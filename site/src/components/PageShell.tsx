import type { ReactNode } from 'react'
import { Background } from './Background'
import { Nav } from './Nav'
import { Footer } from './Footer'

export const PageShell = ({ children }: { children: ReactNode }) => (
  <div className="relative flex min-h-screen flex-col">
    <Background />
    <Nav />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)
