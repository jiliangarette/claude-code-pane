import { useEffect, lazy, Suspense, type ReactNode } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { PageShell } from './components/PageShell'
import { Landing } from './pages/Landing'

const Docs = lazy(() => import('./pages/Docs').then((m) => ({ default: m.Docs })))
const Install = lazy(() => import('./pages/Install').then((m) => ({ default: m.Install })))
const Handoff = lazy(() => import('./pages/Handoff').then((m) => ({ default: m.Handoff })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Panes — a multi-pane cockpit for Claude Code',
    description: 'WezTerm-based multi-pane cockpit for Claude Code on Windows + Git Bash. Grid terminal launcher for running AI agents across projects. Free, open source.',
  },
  '/docs': {
    title: 'Panes Documentation – Keybindings, settings.lua, & troubleshooting',
    description: 'Panes docs: keybindings, settings.lua reference, performance tuning, and troubleshooting for the WezTerm multi-pane cockpit for Claude Code.',
  },
  '/install': {
    title: 'Install Panes – Setup guide for WezTerm, Git Bash, Claude Code',
    description: 'Install Panes on Windows + Git Bash or macOS/Linux. Step-by-step setup for WezTerm, Git, and Claude Code with a one-command installer.',
  },
  '/handoff': {
    title: 'Let Claude Code install Panes – Automated setup',
    description: 'Hand the install to Claude Code: a ready-to-paste prompt that sets up Panes on WezTerm + Git Bash, configures settings.lua, and verifies every file.',
  },
}

const setMeta = (selector: string, value: string) => {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute('content', value)
}

const usePageMeta = (pathname: string) => {
  useEffect(() => {
    const meta = PAGE_META[pathname]
    if (!meta) return
    document.title = meta.title
    setMeta('meta[name="description"]', meta.description)
    setMeta('meta[property="og:title"]', meta.title)
    setMeta('meta[property="og:description"]', meta.description)
    setMeta('meta[name="twitter:title"]', meta.title)
    setMeta('meta[name="twitter:description"]', meta.description)
  }, [pathname])
}

const Page = ({ children }: { children: ReactNode }) => {
  const reduce = useReducedMotion()
  if (reduce) return <div>{children}</div>
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  usePageMeta(location.pathname)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <PageShell>
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Landing /></Page>} />
            <Route path="/docs" element={<Page><Docs /></Page>} />
            <Route path="/install" element={<Page><Install /></Page>} />
            <Route path="/handoff" element={<Page><Handoff /></Page>} />
            <Route path="*" element={<Page><NotFound /></Page>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </PageShell>
  )
}
