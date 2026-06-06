# Panes

A fast, minimalist multi-pane cockpit for **Claude Code** on Windows + Git Bash,
built on [WezTerm](https://wezterm.org).

Panes turns one keypress into a balanced grid of terminal panes — one per project —
so you can run Claude Code across your whole workspace without manually opening,
arranging, and hunting through windows. It's terminal-first and lightweight: panes
are cheap shells, and Claude launches exactly where you want it.

## What it does

- **Centered launcher** — pick a balanced grid (1 / 2 / 4 / 6 / 8 / 9), or press `0` to choose exact projects.
- **Reshape any tab** into N panes with `Ctrl+1..9`.
- **Claude on demand** — `Ctrl+A` then `C` (or auto-launch in every pane).
- **Broadcast** a line to every pane, **zoom** a pane, **jump** by number, fast in-place **help**.
- Minimal dark theme, project-named tabs, error-isolated settings.

## Install

```powershell
git clone https://github.com/jiliangarette/claude-code-pane.git
cd claude-code-pane
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

Then edit `~/.config/wezterm/settings.lua` to add your projects.
Requires [Git for Windows](https://git-scm.com/download/win),
[WezTerm](https://wezterm.org/install/windows.html), and
[Claude Code](https://docs.claude.com/en/docs/claude-code) on your PATH.

## Install with Claude Code (handoff)

Don't want to do it by hand? Paste this to Claude Code and let it set everything up:

> Install **Panes** (https://github.com/jiliangarette/claude-code-pane) for me — a
> WezTerm-based multi-pane cockpit for Claude Code on Windows + Git Bash.
> 1. Make sure WezTerm is installed (`winget install wez.wezterm`, or the portable
>    build from wezterm.org). Find `wezterm-gui.exe` and tell me its path.
> 2. Clone the repo into `~/projects` and run `install.ps1` with PowerShell
>    (`-ExecutionPolicy Bypass`). It copies the config to `~/.config/wezterm`, the
>    scripts to `~/.config/ccp`, generates the icon, and makes a Desktop shortcut.
>    It will not overwrite an existing `settings.lua`.
> 3. Open `~/.config/wezterm/settings.lua` and set `projects` and `scan_roots` to my
>    real project folders, and `auto_launch_claude` to my preference.
> 4. Launch Panes from the Desktop shortcut and confirm the grid chooser appears.
>    If WezTerm errors, read `~/.local/share/wezterm/wezterm-gui*log*.txt` and fix it.

## Keys

| Key | Action |
|--|--|
| launcher `1-9` / `0` | open N panes / pick projects |
| `Ctrl+1..9` | reshape tab into N panes |
| `Ctrl+T` · `Ctrl+Tab` | new tab · switch tab |
| `Ctrl+Arrows` · `Alt+1..9` | move · jump panes |
| `Ctrl+A` then `C` | launch Claude in pane |
| `Ctrl+Shift+B` · `Ctrl+Shift+Z` | broadcast · zoom |
| `Ctrl+H` | help |

`Ctrl+Space` is left free (e.g. for a Whisper hotkey).

## License

MIT © Jilian Garette Abangan
