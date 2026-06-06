import { motion } from 'motion/react'
import { Reveal } from '../components/Reveal'
import { Eyebrow, KeyChip, Button, CopyButton, TerminalWindow, Pill } from '../components/ui'
import { HeroTerminalGrid } from '../components/HeroTerminalGrid'
import { fadeUp, container } from '../lib/anim'

const REPO = 'https://github.com/jiliangarette/claude-code-pane'
const CLONE = 'git clone https://github.com/jiliangarette/claude-code-pane.git'

const Section = ({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`mx-auto max-w-6xl px-6 py-20 md:py-28 ${className}`}>{children}</section>
)

const FEATURES = [
  ['⊞', 'Centered launcher', 'Pick a grid size — 1, 2, 4, 6, 8, or 9 — or hit 0 to choose exact projects.', '0'],
  ['▦', 'Reshape any tab', 'Re-tile the current tab into a balanced grid on the fly. No trip back to the launcher.', 'Ctrl+1..9'],
  ['▸', 'Claude on demand', 'Launch Claude Code in the focused pane — or auto-launch it everywhere.', 'Ctrl+A C'],
  ['⇶', 'Broadcast to all', 'Send one line to every pane at once — the same command across every project.', 'Ctrl+Shift+B'],
  ['⤢', 'Zoom a pane', 'Blow the focused pane up to fill the tab, then drop back to the grid.', 'Ctrl+Shift+Z'],
  ['↔', 'Jump and move', 'Jump straight to a pane by number, or move focus directionally.', 'Alt+1..9'],
  ['?', 'In-place help', 'Drop a fast keybinding overlay right where you are — no window switch.', 'Ctrl+H'],
  ['{}', 'Error-isolated config', 'A bad settings.lua never bricks your terminal. It fails soft to safe defaults and logs it.', 'settings.lua'],
]

const KEYGROUPS: [string, string[]][] = [
  ['Launch', ['1', '2', '4', '6', '8', '9', '0']],
  ['Reshape', ['Ctrl+1', 'Ctrl+2', 'Ctrl+4', 'Ctrl+6', 'Ctrl+9']],
  ['Navigate', ['Alt+1..9', 'Ctrl+←', 'Ctrl+→', 'Ctrl+↑', 'Ctrl+↓']],
  ['Tabs', ['Ctrl+T', 'Ctrl+Tab']],
  ['Claude', ['Ctrl+A C', 'Ctrl+A O']],
  ['Power', ['Ctrl+Shift+B', 'Ctrl+Shift+Z', 'Ctrl+H', 'Ctrl+Shift+R']],
]

const STEPS: [string, string, string[]][] = [
  ['01 — Install', 'panes install', ['Clone the repo and run install.ps1.', 'Config → ~/.config/wezterm, scripts → ~/.config/ccp,', 'plus a Desktop shortcut. settings.lua is never clobbered.']],
  ['02 — Launch', 'panes', ['Open Panes. The launcher asks for a grid size —', 'or press 0 to pick exact projects. One keypress lays', 'out a balanced grid, one pane per project.']],
  ['03 — Run Claude', 'Ctrl+A C', ['Drop into any pane and start Claude with Ctrl+A C,', 'broadcast a prompt to all panes with Ctrl+Shift+B,', 'or set auto_launch_claude and have it ready everywhere.']],
]

export const Landing = () => (
  <>
    {/* Hero */}
    <Section className="!py-16 md:!py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Reveal><Eyebrow>minimalist cockpit for Claude Code</Eyebrow></Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl text-balance">
              One keypress.<br />
              <span className="text-gradient">Your whole workspace.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mut">
              A fast, minimalist cockpit that opens a balanced grid of terminal panes — one per
              project — so you can run Claude Code across everything at once.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-5 flex flex-wrap gap-2">
              <Pill>Free &amp; open source</Pill>
              <Pill>No login</Pill>
              <Pill>Runs locally</Pill>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button to="/install">Install Panes</Button>
              <Button to="/docs" variant="ghost">Read the docs</Button>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-6 flex max-w-xl items-center gap-3 overflow-hidden rounded-lg border border-line bg-surface/70 px-4 py-3">
              <span className="text-accent">$</span>
              <code className="truncate font-mono text-sm text-mut">{CLONE}</code>
              <span className="ml-auto"><CopyButton text={CLONE} /></span>
            </div>
          </Reveal>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <HeroTerminalGrid />
        </motion.div>
      </div>
    </Section>

    {/* Positioning strip */}
    <div className="border-y border-line/60 bg-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center font-mono text-sm text-mut">
        <span className="text-accent">{'// '}</span>
        Terminal-first. Panes are cheap shells — Claude launches only where you need it.
      </div>
    </div>

    {/* Features */}
    <Section id="features">
      <Reveal><Eyebrow glyph="$">what you get</Eyebrow></Reveal>
      <Reveal delay={0.05}><h2 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl text-balance">Everything you need to drive a swarm of agents.</h2></Reveal>
      <motion.div variants={container(0.06)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(([glyph, title, body, chip]) => (
          <motion.div key={title} variants={fadeUp} className="group rounded-[10px] border border-line bg-surface/40 p-5 transition hover:-translate-y-1 hover:border-accent/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg text-accent">{glyph}</span>
              <KeyChip k={chip} />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mut">{body}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>

    {/* Keybinding showcase */}
    <Section>
      <Reveal><Eyebrow>the whole product is keybindings</Eyebrow></Reveal>
      <Reveal delay={0.05}><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Every move is one chord away.</h2></Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KEYGROUPS.map(([group, keys], i) => (
          <Reveal key={group} delay={i * 0.05}>
            <div className="rounded-[10px] border border-line bg-surface/40 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-faint">{group}</div>
              <div className="mt-4 flex flex-wrap gap-2">{keys.map((k) => <KeyChip key={k} k={k} />)}</div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 font-mono text-xs text-faint">Ctrl+Space is left free — e.g. for a Whisper hotkey.</p>
    </Section>

    {/* How it works */}
    <Section>
      <Reveal><h2 className="text-3xl font-bold sm:text-4xl text-balance">From zero to a full grid in three steps.</h2></Reveal>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {STEPS.map(([title, cmd, lines], i) => (
          <Reveal key={title} delay={i * 0.08}>
            <div className="text-faint font-mono text-sm">{title}</div>
            <TerminalWindow title="panes" className="mt-3 h-full">
              <div className="flex items-center gap-2">
                <span className="text-accent">▸</span>
                <span className="text-ink">{cmd}</span>
              </div>
              <div className="mt-3 space-y-1 text-[13px] text-faint">
                {lines.map((l) => <div key={l}>{l}</div>)}
              </div>
            </TerminalWindow>
          </Reveal>
        ))}
      </div>
    </Section>

    {/* Windows + Git Bash band */}
    <div className="border-y border-line/60 bg-surface/40">
      <Section className="!py-16">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <Reveal><Eyebrow glyph="▍">native</Eyebrow></Reveal>
            <Reveal delay={0.05}><h2 className="mt-3 text-3xl font-bold sm:text-4xl">Native Windows. Real Git Bash.</h2></Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-2xl text-mut leading-relaxed">
                No WSL, no VM, no Linux detour. Panes runs on WezTerm with Git Bash as the shell,
                tabs named by project folder, an OpenGL renderer tuned for low input lag, and a dark
                theme that gets out of the way.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="flex flex-wrap gap-2 md:flex-col">
              {['WezTerm', 'Git Bash', 'OpenGL', 'Claude Code on PATH'].map((p) => <Pill key={p}>{p}</Pill>)}
            </div>
          </Reveal>
        </div>
      </Section>
    </div>

    {/* Honest performance */}
    <Section>
      <Reveal><Eyebrow glyph="!">the honest part</Eyebrow></Reveal>
      <Reveal delay={0.05}><h2 className="mt-4 max-w-3xl text-3xl font-bold sm:text-4xl text-balance">The lag isn't the renderer. It's the agents.</h2></Reveal>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-3xl text-mut leading-relaxed">
          Running many AI agents at once is heavy — but the cost is the N Node processes behind
          Claude Code, not the terminal drawing them. So Panes is built terminal-first: every pane is
          a cheap shell that opens instantly, and Claude launches only where you actually need it.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-[10px] border border-accent/30 bg-accent/[0.04] p-6">
            <div className="font-display text-lg font-semibold text-accent">Cheap by default</div>
            <p className="mt-2 text-sm text-mut">Panes are just shells. Spin up a 9-pane grid with near-zero overhead.</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="h-full rounded-[10px] border border-line bg-surface/40 p-6">
            <div className="font-display text-lg font-semibold text-ink">Heavy on demand</div>
            <p className="mt-2 text-sm text-mut">Claude starts per-pane, when you ask. Run agents where the work is — skip the rest.</p>
          </div>
        </Reveal>
      </div>
      <p className="mt-6 font-mono text-xs text-faint">Fewer agents running idle. More headroom where it counts.</p>
    </Section>

    {/* Settings preview */}
    <Section>
      <Reveal><Eyebrow glyph="~">~/.config/wezterm/settings.lua</Eyebrow></Reveal>
      <Reveal delay={0.05}><h2 className="mt-4 text-3xl font-bold sm:text-4xl">One file. Change values only.</h2></Reveal>
      <Reveal delay={0.1}>
        <TerminalWindow title="settings.lua" className="mt-8 max-w-3xl">
          <pre className="overflow-x-auto text-[13px] leading-6">
            <span className="text-violet">return</span> {'{'}
            {'\n'}  front_end = <span className="text-amber">'OpenGL'</span>,   <span className="text-faint">{'-- '}'OpenGL' (low lag) | 'WebGpu'</span>
            {'\n'}  max_fps = <span className="text-accent">60</span>,           <span className="text-faint">{'-- '}30 for a battery-first profile</span>
            {'\n'}  show_chooser = <span className="text-accent">true</span>,
            {'\n'}  auto_launch_claude = <span className="text-accent">false</span>,
            {'\n'}  claude_command = <span className="text-amber">'claude'</span>,
            {'\n'}  projects = {'{}'},          <span className="text-faint">{'-- '}mapped to grid panes, in order</span>
            {'\n'}  project_order = {'{}'},     <span className="text-faint">{'-- '}picker priority (by folder name)</span>
            {'\n'}  scan_roots = {'{ HOME .. '}<span className="text-amber">'/projects'</span>{' }'},
            {'\n'}  default_prog = {'{ '}<span className="text-amber">'C:/Program Files/Git/bin/bash.exe'</span>{", '-l', '-i' }"}
            {'\n'}{'}'}
          </pre>
        </TerminalWindow>
      </Reveal>
      <p className="mt-4 font-mono text-xs text-faint">A bad edit falls back to safe defaults and is logged — it never breaks your terminal. Reload with Ctrl+Shift+R.</p>
    </Section>

    {/* Handoff teaser */}
    <Section>
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-violet/30 bg-violet/[0.05] p-8 md:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet/20 blur-3xl" />
          <div className="relative">
            <Eyebrow glyph=">" className="!text-violet">let Claude do it</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl text-balance">Don't want to install it by hand?</h2>
            <p className="mt-4 max-w-2xl text-mut leading-relaxed">
              Hand the job to Claude Code. Paste one prompt and it installs prerequisites, clones the
              repo, runs the installer, and wires up your settings.lua — without ever overwriting an existing one.
            </p>
            <div className="mt-7"><Button to="/handoff" variant="violet">See the handoff prompt</Button></div>
          </div>
        </div>
      </Reveal>
    </Section>

    {/* Final CTA */}
    <Section className="text-center">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/40 px-6 py-16">
          <div className="dotgrid absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-4xl font-bold sm:text-5xl text-balance">Open your whole workspace in one keypress.</h2>
            <p className="mt-4 text-mut">Free and open source. Clone it, run one script, and your grid is ready.</p>
            <div className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-lg border border-line bg-base/70 px-4 py-3">
              <span className="text-accent">$</span>
              <code className="truncate font-mono text-sm text-mut">{CLONE}</code>
              <span className="ml-auto"><CopyButton text={CLONE} /></span>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button to="/install">Install Panes</Button>
              <Button href={REPO} variant="ghost">View on GitHub</Button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  </>
)
