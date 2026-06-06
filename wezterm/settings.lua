-- Panes :: SETTINGS
-- This is the only file you edit. Change VALUES only, then press Ctrl+Shift+R
-- (or relaunch). A bad edit here falls back to safe defaults and is logged —
-- it will NOT break CCP.

local HOME = (os.getenv('USERPROFILE') or os.getenv('HOME') or 'C:/Users/Public'):gsub('\\', '/')

return {
  -- Renderer: 'OpenGL' (recommended, lowest lag on Windows) | 'WebGpu' (advanced)
  front_end = 'OpenGL',
  max_fps = 60, -- use 30 for a battery-first profile

  -- Show the centered grid chooser on launch and on new tab.
  -- false = open a single plain terminal instead.
  show_chooser = true,

  -- Claude launches ON DEMAND (Ctrl+A then C) to keep things light.
  -- Set true to auto-run Claude in every grid pane (heavier: one Node process each).
  auto_launch_claude = false,
  claude_command = 'claude',

  -- Projects mapped onto grid panes, in order (cycled if fewer than panes).
  -- Leave empty {} to just open panes in your home directory.
  projects = {
    -- HOME .. '/projects/app-one',
    -- HOME .. '/projects/app-two',
  },

  -- Preferred order for the project picker (by folder name); the rest follow A-Z.
  project_order = {
    -- 'app-one', 'app-two',
  },

  -- Folders scanned by the project picker (press 0 in the chooser, or Ctrl+A then O).
  scan_roots = {
    HOME .. '/projects',
  },

  -- Default shell for every pane (Git Bash on Windows).
  default_prog = { 'C:/Program Files/Git/bin/bash.exe', '-l', '-i' },
}
