import { Eyebrow, KeyChip, TerminalWindow } from '../components/ui'

const NAV: [string, [string, string][]][] = [
  ['Getting started', [['Overview', 'overview'], ['Requirements', 'requirements'], ['Installation', 'installation']]],
  ['Configuration', [['settings.lua', 'settings']]],
  ['Reference', [['Keybindings', 'keybindings']]],
  ['Guide', [['Usage', 'usage'], ['Performance', 'performance']]],
  ['Help', [['Troubleshooting', 'troubleshooting'], ['FAQ', 'faq']]],
]

const SETTINGS: [string, string, string, string][] = [
  ['front_end', "'OpenGL' | 'WebGpu'", "'OpenGL'", 'Rendering backend. OpenGL = lowest lag on Windows; WebGpu = modern GPU path.'],
  ['max_fps', 'number', '60', 'Renderer frame cap. Use 30 for a battery-first profile.'],
  ['show_chooser', 'boolean', 'true', 'Show the centered grid chooser on launch and new tab. false = a single plain terminal.'],
  ['auto_launch_claude', 'boolean', 'false', 'true auto-runs Claude in every grid pane (one Node process each). false = on demand.'],
  ['claude_command', 'string', "'claude'", 'Command used to start Claude in a pane.'],
  ['projects', 'list (ordered)', '{}', 'Project paths mapped onto grid panes in order (cycled). Empty = open panes in home.'],
  ['project_order', 'list', '{}', 'Preferred order for the project picker; the rest follow A–Z.'],
  ['scan_roots', 'list', "{ HOME..'/projects' }", 'Folders scanned by the picker (press 0, or Ctrl+A then O). First-run onboarding writes ~/.config/ccp/roots.txt, which overrides this.'],
  ['default_prog', 'program spec | nil', 'nil', 'Default shell for every pane. Leave nil to auto-detect — Git Bash on Windows, bash on macOS/Linux.'],
]

const KEYS: [string, string][] = [
  ['Pick grid size / open picker', '1 2 4 6 8 9 / 0'],
  ['Reshape current tab into N panes', 'Ctrl+1 … Ctrl+9'],
  ['New tab · switch tab', 'Ctrl+T · Ctrl+Tab'],
  ['Close current tab', 'Ctrl+X'],
  ['Launch Claude in current pane', 'Ctrl+A then C'],
  ['Open project picker', 'Ctrl+A then O (or P)'],
  ['Broadcast a line to all panes', 'Ctrl+Shift+B'],
  ['Zoom / unzoom current pane', 'Ctrl+Shift+Z'],
  ['Jump to pane by number', 'Alt+1 … Alt+9'],
  ['Pane-select overlay (jump)', 'Ctrl+A then F'],
  ['Move to adjacent pane', 'Ctrl+← → ↑ ↓'],
  ['Close current pane', 'Ctrl+A then X'],
  ['Rename current tab', 'Ctrl+A then R'],
  ['Change projects folder (re-onboard)', 'Ctrl+A then S'],
  ['Workspace switcher', 'Ctrl+A then W'],
  ['Toggle in-place help', 'Ctrl+H'],
  ['Reload config', 'Ctrl+Shift+R'],
]

const USAGE: [string, string][] = [
  ['First run', 'If no projects/scan_roots are configured, Panes shows an onboarding screen asking for your projects folder and saves it to ~/.config/ccp/roots.txt. Re-run it anytime with Ctrl+A then S.'],
  ['The launcher', 'A centered launcher appears (show_chooser = true). Pick a count for a balanced grid filled from projects in order, or press 0 for the picker.'],
  ['The project picker', '0 at the launcher (or Ctrl+A then O) scans scan_roots, orders by project_order then A–Z, and opens a balanced grid — one pane per chosen project.'],
  ['Reshape', 'Ctrl+1..9 re-tiles the current tab into N balanced panes. Per-tab, so tabs can hold different layouts.'],
  ['Claude on demand', 'Focus a pane, Ctrl+A then C launches Claude. Or set auto_launch_claude = true to start it as panes open.'],
  ['Broadcast', 'Ctrl+Shift+B sends one line to every pane — git status, pnpm install, or the same instruction to multiple Claude sessions.'],
  ['Zoom', 'Ctrl+Shift+Z fills the tab with the current pane; press again to restore. Layout preserved.'],
  ['Help overlay', 'Ctrl+H toggles a fast in-place keybinding overlay.'],
]

const FAQ: [string, string][] = [
  ['Does Panes make running many agents faster?', "No, and it doesn't claim to. The cost is the N Node processes, not the terminal. Panes stays terminal-first and lets you run Claude only where needed."],
  ['Do I have to run Claude in every pane?', 'No. Panes are shells by default. Ctrl+A C per-pane, or auto_launch_claude = true for everywhere.'],
  ['Will installing overwrite my settings?', 'No. Installer and manual steps never clobber an existing settings.lua.'],
  ['Why doesn’t my config change apply?', 'No hot-reload. Press Ctrl+Shift+R or relaunch; check for syntax errors in the logs.'],
  ['Does Panes work on macOS or Linux?', 'Yes — the shell auto-detects (Git Bash on Windows, bash on macOS/Linux) and the scripts are bash 3.2-clean. Run bash install.sh instead of install.ps1. It is built and daily-driven on Windows + Git Bash; macOS/Linux are supported but less battle-tested, so issues and PRs are welcome.'],
  ['How do I run the same command across all projects?', 'Broadcast with Ctrl+Shift+B.'],
]

const H = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-24 font-display text-2xl font-bold">{children}</h2>
)
const P = ({ children }: { children: React.ReactNode }) => <p className="mt-3 leading-relaxed text-mut">{children}</p>

export const Docs = () => (
  <div className="mx-auto flex max-w-6xl gap-12 px-6 py-14">
    <aside className="sticky top-24 hidden h-max w-52 shrink-0 lg:block">
      {NAV.map(([group, items]) => (
        <div key={group} className="mb-6">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-faint">{group}</div>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map(([label, id]) => (
              <li key={id}><a href={`#${id}`} className="text-mut transition hover:text-accent">{label}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </aside>

    <div className="min-w-0 max-w-3xl flex-1">
      <Eyebrow glyph="$">documentation</Eyebrow>
      <h1 className="mt-4 text-4xl font-bold">Panes docs</h1>

      <section className="mt-12 space-y-3"><H id="overview">Overview</H>
        <P>Panes is a fast, minimalist multi-pane cockpit for Claude Code on native Windows + Git Bash, built on WezTerm. One keypress opens a balanced grid of terminal panes — one per project — so you can run Claude Code across an entire workspace at once.</P>
        <P>It's terminal-first and deliberately light: every pane is just a cheap shell, and Claude launches on demand or automatically, only where you need it. The renderer uses OpenGL for low input lag so the cockpit itself is never the bottleneck.</P>
      </section>

      <section className="mt-12 space-y-3"><H id="requirements">Requirements</H>
        <ul className="mt-3 space-y-2 text-mut">
          <li><span className="text-ink">Git for Windows</span> — provides the Git Bash shell used as default_prog.</li>
          <li><span className="text-ink">WezTerm</span> — the terminal emulator Panes is built on.</li>
          <li><span className="text-ink">Claude Code on PATH</span> — so Panes can launch claude.</li>
        </ul>
        <P>If claude isn't on PATH, panes still open as normal shells — but Claude-on-demand fails. See Troubleshooting.</P>
      </section>

      <section className="mt-12 space-y-3"><H id="installation">Installation</H>
        <P>Quick install:</P>
        <TerminalWindow title="powershell" copy={'git clone https://github.com/jiliangarette/claude-code-pane.git\ncd claude-code-pane\npowershell -ExecutionPolicy Bypass -File .\\install.ps1'}>
          <div><span className="text-accent">$</span> git clone https://github.com/jiliangarette/claude-code-pane.git</div>
          <div><span className="text-accent">$</span> cd claude-code-pane</div>
          <div><span className="text-accent">$</span> powershell -ExecutionPolicy Bypass -File .\install.ps1</div>
        </TerminalWindow>
        <P>The installer copies wezterm.lua to ~/.config/wezterm, installs settings.lua only if missing (never clobbers yours), copies scripts to ~/.config/ccp, generates the icon, and creates a Panes Desktop shortcut.</P>
        <P>On first launch Panes asks for your projects folder on screen and saves it to ~/.config/ccp/roots.txt — no config editing required. Change it anytime with Ctrl+A then S, or set projects and scan_roots in settings.lua for full control.</P>
      </section>

      <section className="mt-12 space-y-3"><H id="settings">settings.lua reference</H>
        <P>The only file you edit. Change values only, then press Ctrl+Shift+R (or relaunch). Loaded error-isolated: a bad edit falls back to safe defaults and is logged. Config does not hot-reload.</P>
        <div className="mt-4 overflow-x-auto rounded-[10px] border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/60 font-mono text-xs uppercase tracking-wide text-faint">
              <tr><th className="p-3">Field</th><th className="p-3">Type</th><th className="p-3">Default</th><th className="p-3">What it does</th></tr>
            </thead>
            <tbody>
              {SETTINGS.map(([f, t, d, w]) => (
                <tr key={f} className="border-t border-line align-top">
                  <td className="p-3 font-mono text-accent">{f}</td>
                  <td className="p-3 font-mono text-xs text-mut">{t}</td>
                  <td className="p-3 font-mono text-xs text-amber">{d}</td>
                  <td className="p-3 text-mut">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 space-y-3"><H id="keybindings">Keybindings</H>
        <P>Ctrl+A is the leader key. "Then C" means press Ctrl+A, release, then C. It chords into Claude, the project picker, tab rename, onboarding, and more.</P>
        <div className="mt-4 divide-y divide-line rounded-[10px] border border-line">
          {KEYS.map(([action, keys]) => (
            <div key={action} className="flex items-center justify-between gap-4 p-3">
              <span className="text-sm text-mut">{action}</span>
              <span className="shrink-0 font-mono text-xs text-ink">{keys}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-xs text-faint">Ctrl+Space is intentionally left free (e.g. for a Whisper hotkey).</p>
      </section>

      <section className="mt-12 space-y-3"><H id="usage">Usage</H>
        <div className="mt-3 space-y-4">
          {USAGE.map(([t, d]) => (
            <div key={t}><div className="font-display font-semibold text-ink">{t}</div><p className="mt-1 text-sm text-mut">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-3"><H id="performance">Performance &amp; tuning</H>
        <P>If the cockpit feels heavy, it's almost always the N Node processes Claude Code spawns — not WezTerm's renderer. Ten panes running Claude is ten Claude Code instances. The biggest lever is how many you run at once.</P>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-mut">
          <li>Keep auto_launch_claude = false; start Claude per-pane with Ctrl+A C.</li>
          <li>Right-size your grid — open only the panes you'll use; press 0 to hand-pick a set.</li>
          <li>OpenGL (default) for low lag; try WebGpu for a modern GPU path.</li>
          <li>Cap max_fps (30 for battery). Affects the terminal, not Claude.</li>
        </ul>
      </section>

      <section className="mt-12 space-y-3"><H id="troubleshooting">Troubleshooting</H>
        <ul className="mt-3 space-y-3 text-mut">
          <li><span className="text-ink">Config changes don't apply</span> — no hot-reload. Ctrl+Shift+R or relaunch. Still nothing? Likely a syntax error; Panes fell back to defaults. Check the logs.</li>
          <li><span className="text-ink">Where are the logs?</span> — ~/.local/share/wezterm/wezterm-gui*log*.txt. Open the most recent.</li>
          <li><span className="text-ink">"No space for split"</span> — too many panes for the window. Reshape (Ctrl+1..9), enlarge the window, or reduce font size.</li>
          <li><span className="text-ink">Claude won't launch</span> — confirm which claude works in Git Bash; check claude_command.</li>
          <li><span className="text-ink">WebGpu vs OpenGL</span> — OpenGL is the safe default. On glitches, switch back. Reload after changing.</li>
        </ul>
      </section>

      <section className="mt-12 space-y-3"><H id="faq">FAQ</H>
        <div className="mt-3 space-y-5">
          {FAQ.map(([q, a]) => (
            <div key={q}><div className="font-display font-semibold text-ink">{q}</div><p className="mt-1 text-sm text-mut">{a}</p></div>
          ))}
        </div>
      </section>

      <div className="mt-14 flex flex-wrap gap-2">
        <KeyChip k="github.com/jiliangarette/claude-code-pane" />
      </div>
    </div>
  </div>
)
