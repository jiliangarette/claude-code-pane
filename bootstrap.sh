#!/usr/bin/env bash
# Panes :: bootstrap (macOS / Linux)
# Clones (or updates) the repo, then runs install.sh.
#   bash <(curl -fsSL https://raw.githubusercontent.com/jiliangarette/claude-code-pane/main/bootstrap.sh)
set -euo pipefail

repo="https://github.com/jiliangarette/claude-code-pane.git"
dest="${PANES_DIR:-$HOME/projects/claude-code-pane}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required. Install it and re-run." >&2
  exit 1
fi

if [ -d "$dest/.git" ]; then
  echo "Updating $dest"
  git -C "$dest" pull --ff-only
else
  echo "Cloning into $dest"
  mkdir -p "$(dirname "$dest")"
  git clone "$repo" "$dest"
fi

bash "$dest/install.sh"
