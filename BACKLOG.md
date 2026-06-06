# CCP — improvement backlog

Small, safe, independently verifiable items. Verify = `wezterm show-keys` loads +
`bash -n` all scripts + a headless launch with a clean error log. Never break a
working feature.

## Usability
- [x] Picker: eliminate flicker — repaint via cursor-home + erase-below instead of full clear.
- [x] Picker: show a live preview line of the resulting grid shape (e.g. "6 → 2×3").
- [ ] Picker: support mouse click to toggle a card (SGR mouse). Keep letter-toggle too.
- [x] Launcher: bare ENTER picks the default (4).
- [ ] Help: add a thin top border + group spacing; confirm overlay restores layout on close.
- [x] Tab titles: show the active pane's project folder name (from cwd).

## Performance
- [ ] Measure cold-launch time to first interactive pane; shave anything safe.
- [ ] Prefer `tput` size when sane, fall back to CPR probe — fewer /dev/tty round-trips.
- [ ] Confirm Debug Overlay renderer is hardware GL (not llvmpipe); note result.

## Reliability / edge cases
- [x] Picker >24 projects: show "showing N of total" instead of silently truncating.
- [x] Dedup case-variant folders (CO/co) so they never appear twice.
- [x] Guard pane:split for "no space" — toast "window too small, opened X of N" instead of silent under-build.

## Polish (lowest priority)
- [ ] Subtle, cheap right-status (e.g. pane count) — only if no measurable lag.
- [ ] Theme: fine-tune ansi colors for readability of Claude's diff output.
