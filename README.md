# Panes

A fast, minimalist multi-pane cockpit for **Claude Code** on Windows + Git Bash,
built on [WezTerm](https://wezterm.org). Open a balanced grid in one keypress,
launch Claude where you need it, jump between projects.

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

MIT © Jilian Garette Abangan
