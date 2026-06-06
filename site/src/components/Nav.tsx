import { Link, NavLink } from 'react-router-dom'
import { Logo } from './Logo'
import { Button } from './ui'

const REPO = 'https://github.com/jiliangarette/claude-code-pane'
const focus = 'rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-base'
const link = ({ isActive }: { isActive: boolean }) =>
  `${focus} ${isActive ? 'text-ink' : 'text-mut transition hover:text-ink'}`

export const Nav = () => (
  <header className="sticky top-0 z-50 border-b border-line/60 bg-base/70 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <Link to="/" className={`flex items-center gap-2.5 ${focus}`}>
        <span className="text-accent" aria-hidden="true"><Logo size={22} /></span>
        <span className="font-display text-lg font-bold tracking-tight">Panes</span>
      </Link>
      <nav className="hidden items-center gap-7 text-sm md:flex">
        <NavLink to="/docs" className={link}>Docs</NavLink>
        <NavLink to="/install" className={link}>Install</NavLink>
        <NavLink to="/handoff" className={link}>Handoff</NavLink>
        <a href={REPO} target="_blank" rel="noreferrer" className={`text-mut transition hover:text-ink ${focus}`}>GitHub</a>
      </nav>
      <Button to="/install" className="px-4 py-2 text-[13px]">Get Panes</Button>
    </div>
  </header>
)
