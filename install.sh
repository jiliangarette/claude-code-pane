#!/usr/bin/env bash
# Panes :: installer (macOS / Linux)
# Copies the config + scripts into place. Never overwrites your settings.lua.
# Windows users: use install.ps1 instead.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
wt_dir="$HOME/.config/wezterm"
ccp_dir="$HOME/.config/ccp"
os="$(uname -s)"

echo "Checking dependencies..."
missing_fatal=0
if command -v git >/dev/null 2>&1; then
  echo "  [ok] git"
else
  echo "  [missing] git — required. Install it and re-run."
  missing_fatal=1
fi
if command -v wezterm >/dev/null 2>&1; then
  echo "  [ok] wezterm"
else
  if [ "$os" = "Darwin" ]; then
    echo "  [missing] wezterm — install:  brew install --cask wezterm"
  else
    echo "  [missing] wezterm — see https://wezterm.org/install/linux.html"
  fi
  missing_fatal=1
fi
bash_major="${BASH_VERSINFO[0]:-0}"
if [ "$bash_major" -ge 4 ]; then
  echo "  [ok] bash $BASH_VERSION"
else
  echo "  [note] bash $BASH_VERSION — scripts are bash 3.2-clean so this works."
  [ "$os" = "Darwin" ] && echo "         for a newer bash:  brew install bash"
fi
if [ "$missing_fatal" -ne 0 ]; then
  echo "" >&2
  echo "Install the required dependencies above, then re-run install.sh. Nothing was copied." >&2
  exit 1
fi

mkdir -p "$wt_dir" "$ccp_dir"

# config: wezterm.lua always; settings.lua only if missing (don't clobber user edits)
cp "$root/wezterm/wezterm.lua" "$wt_dir/wezterm.lua"
if [ ! -f "$wt_dir/settings.lua" ]; then
  cp "$root/wezterm/settings.lua" "$wt_dir/settings.lua"
  echo "Installed settings.lua (optional tuning; first launch will ask for your projects folder)."
else
  echo "Kept your existing settings.lua."
fi

# scripts (shell only; skip Windows-only make-icon.ps1)
for f in "$root"/ccp/*.sh; do
  cp "$f" "$ccp_dir/"
  chmod +x "$ccp_dir/$(basename "$f")"
done
echo "Installed scripts to $ccp_dir"

# macOS: a double-clickable launcher
if [ "$os" = "Darwin" ]; then
  app_dir="$HOME/Applications"
  mkdir -p "$app_dir"
  cmd="$app_dir/Panes.command"
  cat > "$cmd" <<'CMD'
#!/usr/bin/env bash
open -na WezTerm
CMD
  chmod +x "$cmd"
  echo "Created launcher: $cmd (double-click to open Panes)"
fi

echo ""
if command -v claude >/dev/null 2>&1; then
  echo "Done. Launch WezTerm — Panes will ask for your projects folder on first run."
  echo "(Change it later with Ctrl+A then S.)"
else
  echo "Installation complete, but one thing is missing:"
  echo ""
  echo "  Claude Code not found on PATH. Panes opens plain shells until you install it."
  echo "  Install it: https://docs.claude.com/en/docs/claude-code"
  echo ""
  echo "Launch WezTerm — Panes will ask for your projects folder on first run."
  echo "(Change it later with Ctrl+A then S.)"
fi
