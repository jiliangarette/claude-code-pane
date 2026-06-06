import { Link } from 'react-router-dom'
import { Logo } from './Logo'

const REPO = 'https://github.com/jiliangarette/claude-code-pane'

const Col = ({ title, links }: { title: string; links: [string, string][] }) => (
  <div>
    <div className="font-mono text-xs uppercase tracking-[0.14em] text-faint">{title}</div>
    <ul className="mt-4 space-y-2.5 text-sm">
      {links.map(([label, href]) => (
        <li key={label}>
          {href.startsWith('http') ? (
            <a href={href} target="_blank" rel="noreferrer" className="text-mut transition hover:text-accent">{label}</a>
          ) : (
            <Link to={href} className="text-mut transition hover:text-accent">{label}</Link>
          )}
        </li>
      ))}
    </ul>
  </div>
)

export const Footer = () => (
  <footer className="relative mt-28 border-t border-line/60">
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 text-accent">
          <Logo size={20} />
          <span className="font-display font-bold text-ink">Panes</span>
        </div>
        <p className="mt-3 max-w-xs text-sm text-muted">
          A minimalist Claude Code cockpit for Windows, macOS &amp; Linux. Free &amp; open source — no login, runs entirely on your machine.
        </p>
      </div>
      <Col title="Product" links={[['Features', '/#features'], ['Docs', '/docs'], ['Install', '/install'], ['Handoff', '/handoff']]} />
      <Col title="Project" links={[['GitHub', REPO], ['Issues', REPO + '/issues'], ['Releases', REPO + '/releases'], ['License (MIT)', REPO + '/blob/main/LICENSE']]} />
      <Col title="Author" links={[['Jilian Garette Abangan', 'https://jilian.dev'], ['@jiliangarette', 'https://github.com/jiliangarette']]} />
    </div>
    <div className="border-t border-line/60 px-6 py-5 text-center font-mono text-xs text-faint">
      MIT Licensed · Built by Jilian Garette Abangan · Not affiliated with Anthropic or WezTerm.
    </div>
  </footer>
)
