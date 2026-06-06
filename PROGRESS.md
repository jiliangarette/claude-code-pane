# Panes — autonomous work log

Owner away ~2h. Every change verified (bash -n / wezterm show-keys / pnpm build / curl)
before commit; failures reverted. Performance and macOS are the two top priorities.

## Done (committed + deployed)
- Branding: picker header `CCP`→`P A N E S`, log strings, help text, install messages
- **Perf (app):** stagger grid `cd && clear` past shell-init; picker repaints without
  re-probing terminal size each keypress and without forking `sed` (pure-bash `strip`)
- **Perf (site):** immutable asset caching + scoped SPA rewrite (verified `immutable`);
  route code-splitting + vendor chunks (Docs/Install/Handoff now lazy); full reduced-motion
  guards; lighter background blur. Built, deployed, routes 200.

## Next (in order)
- **macOS seams (Windows-unchanged):** bash-3.2-clean pick.sh (drop `declare -A`),
  OS-detection `default_shell()` in wezterm.lua, portable Ctrl+H help split, self-detecting
  settings template
- `install.sh` + `bootstrap.sh` (author; Mac run = owner)
- Docs/site: fix onboarding inaccuracies + add real keybindings + "Windows/macOS/Linux"
- SEO: OG image + meta, robots/sitemap; demo GIF staged for hero
- launch.sh escape hatch, a11y (contrast/focus rings)

## Flagged for owner (won't auto-ship)
- **ssh-agent leak:** your `~/.bashrc` spawns a new `ssh-agent` per shell — ~215 leaked
  processes measured. Panes opens many shells, so it multiplies. Fix = a shared-agent guard
  in `.bashrc` (I won't auto-edit your dotfile). Ask me and I'll show the snippet.
- Drop `-l` from default_prog (~250ms/pane faster) — needs a one-command PATH check first.
- WezTerm version bump; mouse-click picker; macOS hardware tests.
