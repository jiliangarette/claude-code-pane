-- Panes — a minimalist, performance-first multi-pane cockpit for Claude Code
-- on native Windows + Git Bash. Edit settings.lua, not this file.

local wezterm = require 'wezterm'
local act = wezterm.action
local mux = wezterm.mux
local config = wezterm.config_builder()

local HOME = (os.getenv('USERPROFILE') or os.getenv('HOME') or 'C:/Users/Public'):gsub('\\', '/')
local CCP = HOME .. '/.config/ccp'
local FORCE_ONBOARD = false -- testing only: forces the first-run onboarding screen

-- ---------------------------------------------------------------------------
-- settings (error-isolated: a bad settings.lua never bricks CCP)
-- ---------------------------------------------------------------------------
local DEFAULTS = {
  front_end = 'OpenGL', max_fps = 60, show_chooser = true,
  auto_launch_claude = false, claude_command = 'claude',
  projects = {}, scan_roots = {}, project_order = {},
  default_prog = { 'C:/Program Files/Git/bin/bash.exe', '-l', '-i' },
}
local ok_user, user = pcall(require, 'settings')
if not ok_user or type(user) ~= 'table' then
  wezterm.log_error('CCP: settings.lua failed, using defaults -> ' .. tostring(user))
  user = {}
end
for k, v in pairs(DEFAULTS) do if user[k] == nil then user[k] = v end end
pcall(function() wezterm.add_to_config_reload_watch_list(wezterm.config_dir .. '/settings.lua') end)

-- ---------------------------------------------------------------------------
-- helpers
-- ---------------------------------------------------------------------------
local function norm(p) return ((p or ''):gsub('\\', '/')) end

local ROOTS_FILE = CCP .. '/roots.txt'

local function read_lines(path)
  local out = {}
  local f = io.open(path, 'r')
  if not f then return out end
  for line in f:lines() do
    line = norm((line:gsub('%s+$', '')))
    if line ~= '' then out[#out + 1] = line end
  end
  f:close()
  return out
end

-- folders to scan for projects: the user's roots.txt wins, else settings.scan_roots.
local function get_roots()
  local r = read_lines(ROOTS_FILE)
  if #r > 0 then return r end
  return user.scan_roots or {}
end

-- every project folder discovered under the roots (deduped by name).
local function discovered_projects()
  local out, seen = {}, {}
  for _, root in ipairs(get_roots()) do
    local ok, paths = pcall(wezterm.glob, root .. '/*')
    if ok and paths then
      for _, p in ipairs(paths) do
        p = norm(p)
        local key = p:lower()
        if not seen[key] then seen[key] = true; out[#out + 1] = p end
      end
    end
  end
  return out
end

-- has the user pointed Panes at any real projects yet?
local function is_configured()
  if user.projects and #user.projects > 0 then return true end
  if #read_lines(ROOTS_FILE) > 0 then return true end
  for _, root in ipairs(user.scan_roots or {}) do
    local ok, paths = pcall(wezterm.glob, root .. '/*')
    if ok and paths and #paths > 0 then return true end
  end
  return false
end

local function project_for(i)
  local list = user.projects
  if list and #list > 0 then return norm(list[((i - 1) % #list) + 1]) end
  local disc = discovered_projects()
  if #disc > 0 then return disc[((i - 1) % #disc) + 1] end
  return HOME
end

local function split_into(first, n)
  local result = {}
  if n < 1 then n = 1 end
  if n == 1 then result[1] = first; return result end
  local cols = math.ceil(math.sqrt(n))
  local base, extra = math.floor(n / cols), n % cols
  local columns, working = {}, first
  for c = 1, cols do
    if c < cols then
      local sok, np = pcall(function() return working:split { direction = 'Right', size = 1 - 1 / (cols - c + 1) } end)
      if not sok or not np then columns[c] = working; break end
      columns[c] = working; working = np
    else
      columns[c] = working
    end
  end
  for c = 1, #columns do
    local rows = base + (c <= extra and 1 or 0)
    local w = columns[c]
    for r = 1, rows do
      if r < rows then
        local sok, nb = pcall(function() return w:split { direction = 'Bottom', size = 1 - 1 / (rows - r + 1) } end)
        if not sok or not nb then result[#result + 1] = w; break end
        result[#result + 1] = w; w = nb
      else
        result[#result + 1] = w
      end
    end
  end
  return result
end

local function build_grid(win, keep, n, want_claude, projlist)
  local result = split_into(keep, n)
  if #result < n then
    pcall(function() win:toast_notification('Panes', 'Window too small — opened ' .. #result .. ' of ' .. n .. ' panes', nil, 2500) end)
  end
  wezterm.log_info('CCP built ' .. #result .. ' panes (requested ' .. n .. ', claude=' .. tostring(want_claude) .. ')')
  pcall(function() win:toast_notification('Panes', 'Opened ' .. #result .. ' pane(s)', nil, 1500) end)
  for k, p in ipairs(result) do
    local proj = (projlist and projlist[k] and norm(projlist[k])) or project_for(k)
    wezterm.time.call_after(0.15, function()
      pcall(function() p:send_text('cd "' .. proj .. '" && clear\r') end)
    end)
    if want_claude then
      wezterm.time.call_after(0.30 * (k - 1) + 0.45, function()
        pcall(function() p:send_text(user.claude_command .. '\r') end)
      end)
    end
  end
end

local function reshape_to(win, pane, n)
  local tab = pane:tab(); if not tab then return end
  if n < 1 then n = 1 end
  local keepid = pane:pane_id()
  local others = {}
  for _, p in ipairs(tab:panes()) do
    if p:pane_id() ~= keepid then others[#others + 1] = p end
  end
  for i, p in ipairs(others) do
    wezterm.time.call_after(0.12 * i, function()
      pcall(function() p:activate(); win:perform_action(act.CloseCurrentPane { confirm = false }, p) end)
    end)
  end
  wezterm.time.call_after(0.12 * #others + 0.5, function()
    pcall(function() pane:activate() end)
    build_grid(win, pane, n, user.auto_launch_claude)
  end)
end

-- run the centered project picker (pick.sh) in the given pane; it emits ccp_picked.
local function run_picker(pane)
  local parts = { 'clear; bash', CCP .. '/pick.sh', '--order' }
  for _, o in ipairs(user.project_order or {}) do parts[#parts + 1] = "'" .. o .. "'" end
  parts[#parts + 1] = '--roots'
  for _, r in ipairs(get_roots()) do parts[#parts + 1] = "'" .. r .. "'" end
  pcall(function() pane:send_text(table.concat(parts, ' ') .. '\r') end)
end

local function start_launcher(pane)
  wezterm.time.call_after(0.35, function()
    pcall(function() pane:send_text('clear; bash ' .. CCP .. '/launch.sh\r') end)
  end)
end

local function start_onboard(pane)
  wezterm.time.call_after(0.35, function()
    pcall(function() pane:send_text('clear; bash ' .. CCP .. '/onboard.sh\r') end)
  end)
  if FORCE_ONBOARD then
    wezterm.time.call_after(2.2, function() pcall(function() pane:send_text(HOME .. '/projects\r') end) end)
    wezterm.time.call_after(5.5, function() pcall(function() pane:send_text('ab\r') end) end)
  end
end

-- ---------------------------------------------------------------------------
-- appearance + performance
-- ---------------------------------------------------------------------------
config.default_prog = user.default_prog
config.front_end = user.front_end
config.max_fps = user.max_fps
config.animation_fps = 1
config.cursor_blink_rate = 0
config.scrollback_lines = 3500
config.term = 'xterm-256color'
config.exit_behavior = 'Close'

config.font = wezterm.font_with_fallback { 'JetBrains Mono', 'Cascadia Code', 'Consolas' }
config.font_size = 11.0
config.window_decorations = 'RESIZE'
config.enable_scroll_bar = false
config.hide_tab_bar_if_only_one_tab = false
config.use_fancy_tab_bar = false
config.tab_bar_at_bottom = true
config.window_padding = { left = 8, right = 8, top = 6, bottom = 2 }
config.inactive_pane_hsb = { saturation = 0.85, brightness = 0.7 }

config.colors = {
  foreground = '#c2c2c2',
  background = '#111317',
  cursor_bg = '#56b6c2',
  cursor_border = '#56b6c2',
  cursor_fg = '#111317',
  selection_bg = '#2c333d',
  selection_fg = '#e6e6e6',
  scrollbar_thumb = '#2a2e36',
  split = '#22262e',
  ansi = { '#1b1e24', '#cc6666', '#9ec07c', '#d8c07a', '#7aa2cc', '#b08fc0', '#56b6c2', '#c2c2c2' },
  brights = { '#3a3f4b', '#e08585', '#b5d99c', '#ecd99a', '#9bc0ec', '#cbabdb', '#7fd4df', '#f2f2f2' },
  tab_bar = {
    background = '#0d0f12',
    active_tab = { bg_color = '#1b1e24', fg_color = '#56b6c2' },
    inactive_tab = { bg_color = '#0d0f12', fg_color = '#6b7280' },
    inactive_tab_hover = { bg_color = '#15181d', fg_color = '#c2c2c2' },
    new_tab = { bg_color = '#0d0f12', fg_color = '#6b7280' },
    new_tab_hover = { bg_color = '#15181d', fg_color = '#56b6c2' },
  },
}

-- ---------------------------------------------------------------------------
-- title / status
-- ---------------------------------------------------------------------------
wezterm.on('format-window-title', function() return 'Panes' end)

wezterm.on('format-tab-title', function(tab)
  local t = tab.tab_title
  if t and #t > 0 then return ' ' .. t .. ' ' end
  local name = 'shell'
  pcall(function()
    local p = tab.active_pane
    if p then
      local d = p.current_working_dir
      local path = d and (d.file_path or d.path or tostring(d)) or nil
      if path then
        name = (path:gsub('[/\\]+$', ''):match('([^/\\]+)$')) or name
      elseif p.title and #p.title > 0 then
        name = p.title
      end
    end
  end)
  return ' ' .. (tab.tab_index + 1) .. ': ' .. name .. ' '
end)

wezterm.on('update-status', function(window)
  local txt = window:leader_is_active() and ' LEADER ' or (' ⬓ Panes · ' .. window:active_workspace() .. ' ')
  window:set_left_status(wezterm.format { { Foreground = { Color = '#56b6c2' } }, { Text = txt } })
end)

-- ---------------------------------------------------------------------------
-- startup + launcher wiring
-- ---------------------------------------------------------------------------
wezterm.on('gui-startup', function()
  local tab, pane, mwin = mux.spawn_window { cwd = project_for(1) }
  pcall(function() mwin:gui_window():maximize() end)
  if FORCE_ONBOARD or not is_configured() then
    start_onboard(pane) -- first run: ask where your projects live, then open the picker
    return
  end
  if not user.show_chooser then return end
  start_launcher(pane)
end)

wezterm.on('user-var-changed', function(window, pane, name, value)
  local tab = pane:tab(); if not tab then return end
  if #tab:panes() ~= 1 then return end
  if name == 'ccp_panes' then
    build_grid(window, pane, tonumber(value) or 1, user.auto_launch_claude)
  elseif name == 'ccp_pick' then
    run_picker(pane)
  elseif name == 'ccp_picked' then
    local projs = {}
    for line in (value .. '\n'):gmatch('([^\n]*)\n') do
      if line ~= '' then projs[#projs + 1] = line end
    end
    if #projs > 0 then build_grid(window, pane, #projs, user.auto_launch_claude, projs) end
  end
end)

-- ---------------------------------------------------------------------------
-- keys
-- ---------------------------------------------------------------------------
config.leader = { key = 'phys:A', mods = 'CTRL', timeout_milliseconds = 1500 }
config.keys = {
  { key = 'c', mods = 'LEADER', action = act.SendString(user.claude_command .. '\n') },
  { key = 'LeftArrow', mods = 'CTRL', action = act.ActivatePaneDirection 'Left' },
  { key = 'RightArrow', mods = 'CTRL', action = act.ActivatePaneDirection 'Right' },
  { key = 'UpArrow', mods = 'CTRL', action = act.ActivatePaneDirection 'Up' },
  { key = 'DownArrow', mods = 'CTRL', action = act.ActivatePaneDirection 'Down' },
  { key = 'phys:X', mods = 'CTRL', action = act.CloseCurrentTab { confirm = true } },
  { key = 'phys:Z', mods = 'CTRL|SHIFT', action = act.TogglePaneZoomState },
  {
    key = 'phys:B', mods = 'CTRL|SHIFT',
    action = act.PromptInputLine {
      description = 'Broadcast a line to ALL panes in this tab:',
      action = wezterm.action_callback(function(_, pane, line)
        if not line then return end
        local tab = pane:tab(); if not tab then return end
        for _, p in ipairs(tab:panes()) do pcall(function() p:send_text(line .. '\r') end) end
      end),
    },
  },
  {
    key = 'phys:T', mods = 'CTRL',
    action = wezterm.action_callback(function(win, pane)
      local _, np = win:mux_window():spawn_tab { cwd = project_for(1) }
      if user.show_chooser then
        wezterm.time.call_after(0.3, function() pcall(function() np:send_text('clear; bash ' .. CCP .. '/launch.sh\r') end) end)
      end
    end),
  },
  {
    key = 'phys:H', mods = 'CTRL',
    action = wezterm.action_callback(function(win, pane)
      local hp = pane:split { size = 0.5, args = { user.default_prog[1], '--noprofile', '--norc', CCP .. '/help.sh' } }
      wezterm.time.call_after(0.05, function() pcall(function() win:perform_action(act.TogglePaneZoomState, hp) end) end)
    end),
  },
  {
    key = 'o', mods = 'LEADER',
    action = wezterm.action_callback(function(win, pane)
      local _, np = win:mux_window():spawn_tab { cwd = project_for(1) }
      wezterm.time.call_after(0.3, function() run_picker(np) end)
    end),
  },
  {
    key = 'r', mods = 'LEADER',
    action = act.PromptInputLine {
      description = 'Rename tab:',
      action = wezterm.action_callback(function(window, _, line)
        if line and #line > 0 then window:active_tab():set_title(line) end
      end),
    },
  },
  {
    key = 'p', mods = 'LEADER',
    action = wezterm.action_callback(function(win, pane)
      local _, np = win:mux_window():spawn_tab { cwd = project_for(1) }
      wezterm.time.call_after(0.3, function() run_picker(np) end)
    end),
  },
  {
    key = 's', mods = 'LEADER',
    action = wezterm.action_callback(function(win, pane)
      local _, np = win:mux_window():spawn_tab { cwd = HOME }
      wezterm.time.call_after(0.3, function() pcall(function() np:send_text('clear; bash ' .. CCP .. '/onboard.sh\r') end) end)
    end),
  },
  { key = 'w', mods = 'LEADER', action = act.ShowLauncherArgs { flags = 'FUZZY|WORKSPACES' } },
  { key = 'f', mods = 'LEADER', action = act.PaneSelect { alphabet = '1234567890' } },
  { key = 'x', mods = 'LEADER', action = act.CloseCurrentPane { confirm = true } },
}

for i = 1, 9 do
  table.insert(config.keys, {
    key = 'phys:' .. tostring(i), mods = 'CTRL',
    action = wezterm.action_callback(function(win, pane) reshape_to(win, pane, i) end),
  })
  table.insert(config.keys, {
    key = 'phys:' .. tostring(i), mods = 'ALT',
    action = act.ActivatePaneByIndex(i - 1),
  })
end

return config
