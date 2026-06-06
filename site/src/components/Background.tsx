export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="dotgrid absolute inset-0 opacity-60" />
      <div className="absolute -top-52 left-1/2 h-[55rem] w-[55rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
      <div className="absolute top-1/3 -right-52 h-[42rem] w-[42rem] rounded-full bg-violet/[0.06] blur-[140px]" />
      <div className="absolute bottom-0 -left-52 h-[38rem] w-[38rem] rounded-full bg-accent/[0.05] blur-[140px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 75% at 50% -8%, transparent 42%, rgba(7,8,9,0.72) 100%)' }}
      />
      <div className="grain absolute inset-0 opacity-[0.025] mix-blend-overlay" />
    </div>
  )
}
