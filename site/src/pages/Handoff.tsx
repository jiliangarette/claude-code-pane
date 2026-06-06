import { Reveal } from '../components/Reveal'
import { Eyebrow, Button, TerminalWindow } from '../components/ui'

const PROMPT = `Install Panes (https://github.com/jiliangarette/claude-code-pane) for me — a WezTerm-based multi-pane cockpit for Claude Code on Windows + Git Bash.

1. Make sure WezTerm is installed (winget install wez.wezterm, or the portable build from wezterm.org). Find wezterm-gui.exe and tell me its path.
2. Clone the repo into ~/projects and run install.ps1 with PowerShell (-ExecutionPolicy Bypass). It copies the config to ~/.config/wezterm, the scripts to ~/.config/ccp, generates the icon, and makes a Desktop shortcut. It will not overwrite an existing settings.lua.
3. Open ~/.config/wezterm/settings.lua and set projects and scan_roots to my real project folders, and auto_launch_claude to my preference. Change values only.
4. Launch Panes from the Desktop shortcut and confirm the grid chooser appears. If WezTerm errors, read ~/.local/share/wezterm/wezterm-gui*log*.txt and fix it.

SAFETY: never overwrite an existing settings.lua; never touch files outside the cloned repo and ~/.config. Verify each file exists after copying.`

const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <section className={`mx-auto max-w-3xl px-6 py-12 ${className}`}>{children}</section>
)

const WILLDO = [
  'Check / install prerequisites (WezTerm, Git, Claude Code).',
  'Locate wezterm-gui.exe and report its path.',
  'Clone-or-pull the repo into ~/projects.',
  'Run install.ps1 (config, scripts, icon, Desktop shortcut).',
  'Configure settings.lua by values only — proposing projects from your scan_roots.',
  'Verify every file and read the WezTerm log to self-correct a bad edit.',
]

export const Handoff = () => (
  <>
    <Section className="!pt-16 text-center">
      <Reveal><Eyebrow className="justify-center !text-violet">claude code handoff</Eyebrow></Reveal>
      <Reveal delay={0.05}><h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl text-balance">Let Claude Code install Panes for you.</h1></Reveal>
      <Reveal delay={0.1}>
        <p className="mx-auto mt-4 max-w-lg text-mut">
          Paste one prompt. Claude checks prerequisites, clones the repo, runs the installer, and
          configures your settings — safely.
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mx-auto mt-6 flex max-w-md justify-center gap-6 font-mono text-xs text-faint">
          <span>1. Open Claude Code</span><span>2. Paste below</span><span>3. Confirm the grid</span>
        </div>
      </Reveal>
    </Section>

    <Section>
      <Reveal>
        <TerminalWindow title="paste to claude code" accent="violet" copy={PROMPT}>
          <pre className="whitespace-pre-wrap text-[13px] leading-6 text-mut">{PROMPT}</pre>
        </TerminalWindow>
      </Reveal>
    </Section>

    <Section>
      <h2 className="text-2xl font-bold">What it will do</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {WILLDO.map((w, i) => (
          <Reveal key={w} delay={i * 0.04}>
            <div className="flex h-full items-start gap-3 rounded-[10px] border border-line bg-surface/40 p-4">
              <span className="mt-0.5 font-mono text-sm text-violet">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-sm text-mut">{w}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section>
      <Reveal>
        <div className="rounded-[10px] border border-amber/30 bg-amber/[0.05] p-5">
          <div className="font-mono text-sm text-amber">safety</div>
          <p className="mt-2 text-sm text-mut">
            Panes' settings.lua is error-isolated: a bad edit falls back to safe defaults and is
            logged — it won't break your terminal. The handoff prompt never overwrites an existing
            settings.lua and stays within the repo and ~/.config.
          </p>
        </div>
      </Reveal>
    </Section>

    <Section className="text-center">
      <Reveal>
        <p className="text-mut">Rather do it yourself?</p>
        <div className="mt-4"><Button to="/install" variant="ghost">Manual install</Button></div>
      </Reveal>
    </Section>
  </>
)
