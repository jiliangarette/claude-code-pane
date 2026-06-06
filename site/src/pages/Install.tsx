import { Reveal } from '../components/Reveal'
import { Eyebrow, Button, TerminalWindow } from '../components/ui'

const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <section className={`mx-auto max-w-3xl px-6 py-12 ${className}`}>{children}</section>
)

const REQS = [
  ['Git for Windows', 'Provides the Git Bash shell (MINGW64) Panes uses as its default program.'],
  ['WezTerm', 'The terminal emulator Panes is built on.'],
  ['Claude Code on PATH', 'So Panes can launch claude in panes — on demand or automatically.'],
]

const STEPS: [string, string | null, string][] = [
  ['Install Git for Windows', 'winget install --id Git.Git -e', 'Provides the Git Bash shell.'],
  ['Install WezTerm', 'winget install wez.wezterm', 'The terminal Panes runs on.'],
  ['Install Claude Code', 'npm install -g @anthropic-ai/claude-code\nclaude --version', 'So claude is on your PATH.'],
  ['Clone Panes', 'git clone https://github.com/jiliangarette/claude-code-pane.git\ncd claude-code-pane', 'Grab the repo.'],
  ['Run the installer', 'powershell -ExecutionPolicy Bypass -File .\\install.ps1', 'Copies config + scripts, generates the icon, makes a Desktop shortcut. Never clobbers an existing settings.lua.'],
  ['Launch', null, 'Open Panes from the Desktop shortcut. On first run it asks for your projects folder and saves it — no config editing needed. Then the centered chooser appears: pick a grid size or press 0 to choose projects.'],
  ['Tune it (optional)', null, 'Change the folder later with Ctrl+A then S, or open ~/.config/wezterm/settings.lua to set projects, scan_roots, and auto_launch_claude. Reload with Ctrl+Shift+R.'],
]

const TROUBLE = [
  ['wezterm-gui.exe not found', 'The installer skips the Desktop shortcut. Install WezTerm, then re-run install.ps1, or launch wezterm-gui.exe directly.'],
  ['PowerShell blocks the script', 'Use the -ExecutionPolicy Bypass flag shown above; it applies to that one invocation only.'],
  ['Blank or erroring launch', 'Read the latest log at ~/.local/share/wezterm/wezterm-gui*log*.txt, fix settings.lua, and reload.'],
  ["Claude won't start in a pane", 'Confirm which claude works in Git Bash and that claude_command matches it. Panes still work as plain shells regardless.'],
]

export const Install = () => (
  <>
    <Section className="!pt-16 text-center">
      <Reveal><Eyebrow glyph="$" className="justify-center">install</Eyebrow></Reveal>
      <Reveal delay={0.05}><h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">Install Panes</h1></Reveal>
      <Reveal delay={0.1}><p className="mx-auto mt-4 max-w-md text-mut">Windows, macOS, or Linux. Five minutes, one script.</p></Reveal>
    </Section>

    <Section>
      <div className="grid gap-3 sm:grid-cols-3">
        {REQS.map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.06}>
            <div className="h-full rounded-[10px] border border-line bg-surface/40 p-5">
              <div className="font-display font-semibold">{t}</div>
              <p className="mt-2 text-sm text-mut">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section>
      <div className="space-y-8">
        {STEPS.map(([title, cmd, note], i) => (
          <Reveal key={title} delay={0.03}>
            <div className="flex gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-accent/40 bg-accent/10 font-mono text-sm text-accent">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                {cmd && (
                  <TerminalWindow title="powershell" className="mt-3" copy={cmd}>
                    {cmd.split('\n').map((line) => (
                      <div key={line}><span className="text-accent">{'> '}</span>{line}</div>
                    ))}
                  </TerminalWindow>
                )}
                <p className="mt-2 text-sm text-mut">{note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section>
      <Reveal><Eyebrow glyph="$">macOS &amp; Linux</Eyebrow></Reveal>
      <Reveal delay={0.05}><h2 className="mt-3 text-2xl font-bold">Not on Windows?</h2></Reveal>
      <Reveal delay={0.1}>
        <p className="mt-3 text-mut">
          The shell auto-detects and the scripts are bash 3.2-clean, so Panes runs on macOS and
          Linux too. Install WezTerm and bash (e.g. <code className="font-mono text-ink">brew install --cask wezterm</code> on macOS),
          then clone and run the shell installer.
        </p>
      </Reveal>
      <Reveal delay={0.12}>
        <TerminalWindow title="bash" className="mt-5" copy={'git clone https://github.com/jiliangarette/claude-code-pane.git\ncd claude-code-pane\nbash install.sh'}>
          <div><span className="text-accent">$</span> git clone https://github.com/jiliangarette/claude-code-pane.git</div>
          <div><span className="text-accent">$</span> cd claude-code-pane</div>
          <div><span className="text-accent">$</span> bash install.sh</div>
        </TerminalWindow>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mt-3 text-sm text-faint">
          Built and daily-driven on Windows; macOS and Linux are supported but less battle-tested — issues and PRs welcome.
        </p>
      </Reveal>
    </Section>

    <Section>
      <h2 className="text-2xl font-bold">Troubleshooting</h2>
      <div className="mt-5 space-y-3">
        {TROUBLE.map(([t, d]) => (
          <Reveal key={t}>
            <div className="rounded-[10px] border border-line bg-surface/40 p-4">
              <div className="font-mono text-sm text-amber">{t}</div>
              <p className="mt-1.5 text-sm text-mut">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section className="text-center">
      <Reveal>
        <div className="rounded-2xl border border-violet/30 bg-violet/[0.05] p-8">
          <p className="text-mut">Prefer to let Claude do it?</p>
          <div className="mt-4"><Button to="/handoff" variant="violet">Use the handoff</Button></div>
        </div>
      </Reveal>
    </Section>
  </>
)
