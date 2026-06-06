# Panes — autonomous work queue

The loop does the TOP unchecked item, verifies (gates below), commits, redeploys the site
if site files changed, checks it off + logs one line to PROGRESS.md. If any gate fails, it
REVERTS the change and moves on. One item per run. Never break the live app/site.

Gates: `bash -n ccp/*.sh` · wezterm `show-keys` exits 0 ·
`pnpm -C site build` · for site: `npx vercel deploy --prod --yes` then
`npx vercel alias set <deployment> claude-code-pane.vercel.app` then `curl` routes = 200.
Repo: C:/Users/LENOVO/projects/personal/ccp. Keep live ~/.config in sync for ccp/*.sh + wezterm.lua.

## Queue (top first)
- [ ] **launch.sh escape hatch** — in `ccp/launch.sh` read loop, change `q|Q) key="1"; break ;;` to `q|Q|$'\033') show_cursor; clear; exec "$SHELL" -i ;;` so q/Esc drops to a shell. Verify bash -n + pipe test.
- [ ] **A8 polish (wezterm.lua)** — `build_grid` fires two `toast_notification`s; collapse to one. The `ccp_pick` handler sends `clear; bash pick.sh` while pick.sh also clears — drop the leading `clear; `. Verify show-keys + FORCE_ONBOARD selftest (set true, build, set false, rm roots.txt).
- [ ] **robots.txt + sitemap.xml** — new `site/public/robots.txt` (User-agent: * / Allow: / / Sitemap: https://claude-code-pane.vercel.app/sitemap.xml) and `site/public/sitemap.xml` listing /, /docs, /install, /handoff. Verify build copies to dist.
- [ ] **OG meta + image** — add og:/twitter:/canonical/theme-color tags to `site/index.html` (og:image=/og.png, 1200x630, summary_large_image). Generate `site/public/og.png` (1200x630, #0b0d0f bg, "Panes — One keypress. Your whole workspace.") via PowerShell System.Drawing (see ccp/make-icon.ps1 pattern); if image gen fails, ship tags only. Verify build + tags in dist/index.html.
- [ ] **Demo GIF on hero** — copy `media/panes.gif` to `site/public/panes.gif`; in `site/src/pages/Landing.tsx` show it (img, width set, lazy) inside a TerminalWindow, keeping HeroTerminalGrid as the reduced-motion fallback. Verify build.
- [ ] **Docs/README onboarding accuracy** — fix `site/src/pages/Docs.tsx` + `Install.tsx` + `Handoff.tsx` + `README.md`: mention first-run onboarding writes `~/.config/ccp/roots.txt` (overrides scan_roots), `Ctrl+A then S` changes folder; add `Ctrl+X` close-tab + `Ctrl+A then S/R/O/W/F` rows to the keybinding tables. Verify build.
- [ ] **Tri-platform copy (after macOS code shipped)** — update Footer "cockpit for Windows" → "Windows, macOS, Linux"; Docs FAQ "targets native Windows only" → tri-platform with `bash install.sh`; Install page add brew/unix commands. Verify build.
- [ ] **install.sh (author, mac run = owner)** — new repo `install.sh`: mkdir ~/.config/{wezterm,ccp}; copy wezterm.lua always, settings.lua only if missing; copy ccp/*.sh + chmod +x; warn if wezterm/bash<4 absent (brew hints); create ~/Applications/Panes.command (`open -na WezTerm`). Verify bash -n.
- [ ] **bootstrap.sh (author)** — new repo `bootstrap.sh`: require git; clone/pull into ~/projects/claude-code-pane; run `bash install.sh`. Verify bash -n.
- [ ] **a11y** — `site/src/index.css` bump `--color-faint #3a4248→#586169`, `--color-muted #5c666c→#6b757c`; add `aria-hidden="true"` to decorative glyphs/dots and `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60` to Button/CopyButton/nav links. Verify build.

## Flagged for owner (DO NOT auto-ship)
- Drop `-l` from default_prog (PATH gate), ssh-agent .bashrc fix, WezTerm version bump,
  mobile nav menu, mouse-click picker, all macOS hardware tests (B8–B11).
