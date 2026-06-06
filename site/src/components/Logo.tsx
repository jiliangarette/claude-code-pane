export function Logo({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="26" height="26" rx="7" stroke="currentColor" strokeWidth="2.2" />
      <line x1="14.5" y1="9" x2="14.5" y2="23" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="14.5" y1="16" x2="23" y2="16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
