import { useEffect, lazy, Suspense, type ReactNode } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { PageShell } from './components/PageShell'
import { Landing } from './pages/Landing'

const Docs = lazy(() => import('./pages/Docs').then((m) => ({ default: m.Docs })))
const Install = lazy(() => import('./pages/Install').then((m) => ({ default: m.Install })))
const Handoff = lazy(() => import('./pages/Handoff').then((m) => ({ default: m.Handoff })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

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
