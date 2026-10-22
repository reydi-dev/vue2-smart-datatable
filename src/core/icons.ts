import type { DataTableIcon, SvgIconDefinition } from '../types'

// Small, local stroke drawings: no external font, sprite, network request, or raw HTML.
const paths: Record<string, string> = {
  'arrow-up': 'M12 20V4m-6 6 6-6 6 6',
  'arrow-down': 'M12 4v16m-6-6 6 6 6-6',
  'filter-variant': 'M4 7h16M7 12h10M10 17h4',
  'view-column': 'M3 4h18v16H3zM9 4v16M15 4v16',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  'content-copy': 'M9 9h12v12H9zM15 5V3H3v12h2',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  'eye-off':
    'm3 3 18 18M9.5 5.3A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3 4M6 6.5A18 18 0 0 0 2 12s3.5 7 10 7a11 11 0 0 0 5-1.2M10 10a3 3 0 0 0 4 4',
  'chevron-left': 'm15 5-7 7 7 7',
  'chevron-right': 'm9 5 7 7-7 7',
  'dots-vertical': 'M12 5h.01M12 12h.01M12 19h.01',
  refresh: 'M20 7v5h-5M4 17v-5h5M20 12A8 8 0 0 0 6 7M4 12a8 8 0 0 0 14 5',
  'check-circle': 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM7 12l3 3 7-7',
  'close-circle': 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM8 8l8 8M8 16l8-8',
}

export function resolveSvgIcon(icon: DataTableIcon): SvgIconDefinition | null {
  if (icon && typeof icon === 'object') {
    return typeof icon.path === 'string' ||
      (Array.isArray(icon.path) && icon.path.every((path) => typeof path === 'string'))
      ? icon
      : null
  }
  if (typeof icon !== 'string') return null
  const name = icon.replace(/^mdi-/, '')
  const path = Object.prototype.hasOwnProperty.call(paths, name) ? paths[name] : undefined
  if (path) return { path, stroke: true }
  // Vuetify also accepted SVG path strings. Keep these as attributes, never markup.
  if (/^[Mm][\d\s.,+\-AaCcHhLlMmQqSsTtVvZzEe]+$/.test(icon)) return { path: icon }
  return null
}

export function resolveFontIcon(icon: DataTableIcon): string[] {
  // Legacy MDI names outside the bundled set can still use a host-provided MDI font.
  // Vuetify aliases ($...) and arbitrary HTML/URLs are intentionally not interpreted.
  return typeof icon === 'string' && /^mdi-[a-z0-9-]+$/.test(icon) ? ['mdi', icon] : []
}
