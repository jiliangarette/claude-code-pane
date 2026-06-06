# Panes — autonomous work log

Owner away ~2h. Every change is verified (bash -n / wezterm show-keys / pnpm build / curl)
before commit; anything that fails verification is reverted. Performance and macOS are the
two top priorities.

## Done
- Branding: project picker header `CCP` → `P A N E S` (pick.sh)
- help.sh: corrected the Claude line (on-demand is the default, not auto)
- wezterm.lua: user-facing log strings `CCP` → `Panes`
- install.ps1: onboarding-aware install messages

## Queued (from two audit workflows)
- **Performance pass** (top priority) — app launch/render tunables + measurements, site bundle/motion/asset wins
- **macOS compatibility** — OS-detection for default_prog, portable bash (the scripts use bash-4 features), install.sh, docs
- Site: fix docs/onboarding inaccuracies, add real keybindings, OG image + social meta, robots/sitemap, demo GIF on hero
- launch.sh escape hatch (q/Esc), a11y (focus rings, contrast)
- CI workflow + one-line bootstrap installer

Gates: `bash -n ccp/*.sh` · `wezterm show-keys` · `pnpm -C site build` · `curl` live routes.
