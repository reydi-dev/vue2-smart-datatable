import type { MobileBreakpoint } from '../types'

const legacyBreakpoints = ['xsOnly', 'smAndDown', 'mdAndDown', 'mdAndUp', 'lgAndUp'] as const

export function isMobileBreakpoint(value: unknown): value is MobileBreakpoint {
  return typeof value === 'number'
    ? Number.isFinite(value) && value >= 0
    : legacyBreakpoints.includes(value as (typeof legacyBreakpoints)[number])
}

export function matchesMobileBreakpoint(width: number, breakpoint: MobileBreakpoint): boolean {
  if (typeof breakpoint === 'number') return width < breakpoint
  // Preserve Vuetify 2's *default* ranges, including its 16px desktop scrollbar allowance.
  // These fixed aliases do not read or inherit a host application's Vuetify configuration.
  switch (breakpoint) {
    case 'xsOnly':
      return width < 600
    case 'smAndDown':
      return width < 960
    case 'mdAndDown':
      return width < 1264
    case 'mdAndUp':
      return width >= 960
    case 'lgAndUp':
      return width >= 1264
    default:
      return width < 960
  }
}

/** Observe the browser viewport; return an idempotent cleanup and do nothing during SSR. */
export function observeViewportWidth(onChange: (width: number) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const update = () => onChange(Math.max(document.documentElement.clientWidth, window.innerWidth || 0))
  update()
  window.addEventListener('resize', update, { passive: true })
  return () => window.removeEventListener('resize', update)
}
