const relativeUrl = /^(?:[./]|#)/

export function sanitizeUrl(value: unknown, kind: 'link' | 'image'): string {
  if (typeof value !== 'string') return ''
  const candidate = value.trim()
  if (!candidate) return ''
  if (relativeUrl.test(candidate)) return candidate

  try {
    const url = new URL(candidate, 'https://smart-data-table.invalid')
    const allowed = kind === 'image' ? ['http:', 'https:', 'blob:'] : ['http:', 'https:', 'mailto:', 'tel:']
    return allowed.includes(url.protocol) ? candidate : ''
  } catch {
    return ''
  }
}
