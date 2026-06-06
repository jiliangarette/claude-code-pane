import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { TerminalWindow } from './ui'

const PROJECTS = ['client-dashboard', 'tracker', 'adlauncher', 'hiring', 'CO', 'api']

export const HeroTerminalGrid = () => {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setActive((a) => (a + 1) % PROJECTS.length), 1600)
    return () => clearInterval(t)
  }, [reduce])

  return (
    <TerminalWindow title="panes — workspace" className="w-full">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-accent">▸</span>
        <span className="text-ink">panes</span>
        <span className="text-muted">deploy 6 panes</span>
        <span className="cursor-blink ml-0.5 inline-block h-4 w-[7px] translate-y-[2px] bg-accent" />
      </div>
      <motion.div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } }}
      >
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p}
            variants={{
              hidden: { opacity: 0, scale: 0.92 },
              show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
            }}
            className={`rounded-md border bg-inset/60 p-2.5 transition-colors duration-500 ${
              active === i ? 'border-accent/70 shadow-[0_0_26px_-8px_rgba(86,182,194,0.65)]' : 'border-line'
            }`}
          >
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${active === i ? 'bg-accent' : 'bg-accent/40'}`} />
              {p}
            </div>
            <div className="space-y-0.5 text-[11px] leading-4 text-faint">
              <div>
                <span className="text-accent/70">$</span> claude
              </div>
              <div className="text-mut/70">
                {active === i ? (
                  <span>
                    working<span className="cursor-blink text-accent">_</span>
                  </span>
                ) : (
                  'ready'
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </TerminalWindow>
  )
}
