import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

export const Eyebrow = ({ children, glyph = '>', className = '' }: { children: ReactNode; glyph?: string; className?: string }) => (
  <div className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] ${className}`}>
    <span className="text-accent" aria-hidden="true">{glyph}</span>
    <span className="text-mut">{children}</span>
  </div>
)

export const KeyChip = ({ k, active = false }: { k: string; active?: boolean }) => (
  <kbd
    className={`inline-flex items-center rounded-md border px-2 py-1 font-mono text-[12px] shadow-[0_2px_0_0_rgba(0,0,0,0.45)] transition ${
      active ? 'border-accent/70 bg-accent/10 text-accent' : 'border-line-strong bg-elevated text-ink'
    }`}
  >
    {k}
  </kbd>
)

export const CopyButton = ({ text, className = '' }: { text: string; className?: string }) => {
  const [done, setDone] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(text)
    setDone(true)
    setTimeout(() => setDone(false), 1400)
  }
  return (
    <button
      onClick={copy}
      aria-label="Copy to clipboard"
      className={`inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-mut transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-base ${className}`}
    >
      {done ? '✓ copied' : 'copy'}
    </button>
  )
}

type BtnProps = { to?: string; href?: string; children: ReactNode; variant?: 'primary' | 'ghost' | 'violet'; className?: string }
export const Button = ({ to, href, children, variant = 'primary', className = '' }: BtnProps) => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-base'
  const styles =
    variant === 'primary'
      ? 'bg-accent text-[#06181b] hover:bg-accent-bright glow-btn'
      : variant === 'violet'
        ? 'bg-violet text-[#160b2b] hover:brightness-110 shadow-[0_0_24px_-6px_rgba(167,139,250,0.5)]'
        : 'border border-line-strong text-ink hover:border-accent/50 hover:text-accent'
  const cls = `${base} ${styles} ${className}`
  if (to) return <Link to={to} className={cls}>{children}</Link>
  return (
    <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={cls}>
      {children}
    </a>
  )
}

export const TerminalWindow = ({
  title = 'panes',
  children,
  copy,
  className = '',
  accent = 'teal',
}: {
  title?: string
  children: ReactNode
  copy?: string
  className?: string
  accent?: 'teal' | 'violet'
}) => (
  <div
    className={`relative overflow-hidden rounded-xl border bg-surface/90 shadow-2xl ${
      accent === 'violet' ? 'border-violet/30' : 'border-line'
    } ${className}`}
  >
    <div className="flex items-center gap-2 border-b border-line bg-inset/80 px-4 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full bg-accent/60" aria-hidden="true" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber/60" aria-hidden="true" />
      <span className="h-2.5 w-2.5 rounded-full bg-violet/60" aria-hidden="true" />
      <span className="ml-2 font-mono text-xs text-muted">{title}</span>
      {copy && <span className="ml-auto"><CopyButton text={copy} /></span>}
    </div>
    <div className="scanlines">
      <div className="relative p-4 font-mono text-sm leading-relaxed text-mut sm:p-5">{children}</div>
    </div>
  </div>
)

export const Pill = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-line-strong bg-elevated/60 px-3 py-1 font-mono text-xs text-mut">
    {children}
  </span>
)
