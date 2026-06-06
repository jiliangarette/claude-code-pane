# CCP — Claude Code Pane

A minimalist, performance-first multi-pane cockpit for running **Claude Code** across
your projects, on **native Windows + Git Bash**, built on [WezTerm](https://wezterm.org).

Open a balanced grid of panes in one keypress, launch Claude where you need it, and
jump between projects without hunting. No Electron, no bloat — just a fast terminal
with a thin, well-tested config.

```
              c c p   ·   claude code pane

          ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
          │ 1 │ │ 2 │ │ 4 │ │ 6 │ │ 8 │ │ 9 │
          └───┘ └───┘ └───┘ └───┘ └───┘ └───┘

           press a number for that many panes
           0  ·  pick specific projects from a list
```

## Why

The good agent cockpits (Conductor, etc.) are macOS-first. CCP is for the Windows +
Git Bash developer who lives in the terminal. The lag from running many agents is the
N Node processes, not the renderer — so CCP is **terminal-first**: panes are cheap
shells, and Claude launches on demand (or automatically, your choice).

## Features

- **Centered launcher** — pick a balanced grid size (1/2/4/6/8/9) on open, or `0` to
  pick exact projects from a list.
- **Reshape any tab** — `Ctrl+1..9` turns the current tab into N panes.
- **Claude on demand** — `Ctrl+A` then `C` launches Claude in the focused pane
  (or set `auto_launch_claude = true`).
- **Project picker** — directories only, your preferred order first, balanced-count
  gate, live `N → R×C` grid preview.
- **Fast help overlay** — `Ctrl+H` shows a centered cheatsheet in-place (no new tab).
- **Broadcast** — `Ctrl+Shift+B` types one line into every pane at once.
- **Minimal dark theme**, tabs titled by project folder, error-isolated settings.

## Requirements

- Windows 10/11
- [Git for Windows](https://git-scm.com/download/win) (provides Git Bash + coreutils)
- [WezTerm](https://wezterm.org/install/windows.html) (portable build is fine)
- [Claude Code](https://docs.claude.com/en/docs/claude-code) on your PATH

## Install

```powershell
git clone https://github.com/jiliangarette/claude-code-pane.git
cd claude-code-pane
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

The installer copies the config to `~/.config/wezterm/`, the scripts to
`~/.config/ccp/`, generates an icon, and (if it can find `wezterm-gui.exe`) drops a
`CCP` shortcut on your Desktop. Your existing `settings.lua` is never overwritten.

Then edit `~/.config/wezterm/settings.lua` to add your `projects` / `scan_roots`.

## Keybindings

| Key | Action |
|--|--|
| `1`–`9` (launcher) | open that many panes · `0` = pick projects · `Enter` = 4 |
| `Ctrl+1..9` | reshape current tab into N panes |
| `Ctrl+T` | new tab (opens the chooser) |
| `Ctrl+Tab` / `Ctrl+Shift+Tab` | next / previous tab |
| `Ctrl+Arrows` | move between panes |
| `Alt+1..9` | jump to a pane by number |
| `Ctrl+Shift+Z` | zoom a pane fullscreen (toggle) |
| `Ctrl+Shift+B` | broadcast a line to all panes |
| `Ctrl+X` | close current tab (asks first) |
| `Ctrl+H` | help overlay |
| `Ctrl+A` then `C` | launch Claude in this pane |
| `Ctrl+A` then `R` / `O` / `W` / `F` | rename tab / pick projects / workspaces / jump-pane |

`Ctrl+Space` is deliberately left free (e.g. for a Whisper hotkey).

## Performance

Running N Claude Code instances costs N Node processes — that's inherent and CCP
can't remove it, only let you avoid paying it when you don't need it. Keep
`auto_launch_claude = false` and launch Claude per pane, keep grids small, and CCP
stays snappy. Renderer defaults to OpenGL (lowest input lag on Windows).

## Notes & limits

- WezTerm config doesn't reliably hot-reload — after editing, press `Ctrl+Shift+R`
  or relaunch.
- A portable WezTerm's **taskbar** icon stays WezTerm's (the Desktop shortcut shows
  the CCP icon) — changing the exe icon would break its signing.

## License

MIT © Jilian Garette Abangan
