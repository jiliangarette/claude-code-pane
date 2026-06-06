import { useEffect, type ReactNode } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { PageShell } from './components/PageShell'
import { Landing } from './pages/Landing'
import { Docs } from './pages/Docs'
import { Install } from './pages/Install'
import { Handoff } from './pages/Handoff'
import { NotFound } from './pages/NotFound'

const Page = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

export default function App() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <PageShell>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Landing /></Page>} />
          <Route path="/docs" element={<Page><Docs /></Page>} />
          <Route path="/install" element={<Page><Install /></Page>} />
          <Route path="/handoff" element={<Page><Handoff /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
    </PageShell>
  )
}
