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

## Done — session 2 (owner back; whole queue cleared)
- **macOS seams:** OS-detected `default_shell()`, bash-3.2-clean `pick.sh`, portable Ctrl+H,
  self-detecting settings template (shipped session 1; docs now match)
- `install.sh` (macOS/Linux) + `bootstrap.sh` (curl one-liner) + `bootstrap.ps1` (irm one-liner)
- **CI:** `.github/workflows/ci.yml` — bash -n + shellcheck on `ccp/*.sh`, and `wezterm show-keys`
  on Ubuntu asserting custom bindings loaded (not defaults)
- Docs/README/Install/Footer: real keybindings (added Ctrl+X, leader O/F/S/R/X/W), onboarding +
  `roots.txt` accuracy, honest cross-platform copy (Windows daily-driven; mac/linux supported)
- **SEO:** `robots.txt`, `sitemap.xml`, OG/Twitter/canonical/theme-color tags, generated `og.png`
- **Demo GIF on hero** (reduced-motion users get the animated grid fallback)
- **a11y:** contrast bumps (`--color-faint`/`--color-muted`), focus-visible rings on
  buttons/copy/nav, `aria-hidden` on decorative glyphs/dots
- **launch.sh esc/q → drops to a plain shell** (pipe-verified: number/picker/esc/enter paths)
- **wezterm A8:** one grid toast instead of two; dropped the redundant pre-picker `clear`

## Flagged for owner (won't auto-ship — environment, not the product)
- **ssh-agent leak:** your `~/.bashrc` spawns a new `ssh-agent` per shell — ~215 leaked
  processes measured. Panes opens many shells, so it multiplies. Fix = a shared-agent guard
  in `.bashrc` (won't auto-edit your dotfile). The bigger of the two perf wins.
- Drop `-l` from default_prog — **PATH gate PASSED on this machine** (claude/node/git/base64 all
  resolve in a bare shell), so it's safe for you specifically via a settings.lua override.
  Kept `-l` in the shipped template (safe default for unknown machines).
- WezTerm version bump; mouse-click picker; macOS hardware tests.
