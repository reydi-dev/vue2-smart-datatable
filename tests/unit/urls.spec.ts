import { describe, expect, it } from 'vitest'
import { sanitizeUrl } from '@/core/urls'

describe('URL safety', () => {
  it('allows ordinary and relative URLs', () => {
    expect(sanitizeUrl('https://example.com', 'link')).toBe('https://example.com')
    expect(sanitizeUrl('/avatar.png', 'image')).toBe('/avatar.png')
    expect(sanitizeUrl('mailto:user@example.com', 'link')).toBe('mailto:user@example.com')
  })

  it('rejects executable and image-inappropriate schemes', () => {
    expect(sanitizeUrl('javascript:alert(1)', 'link')).toBe('')
    expect(sanitizeUrl('data:text/html,unsafe', 'image')).toBe('')
    expect(sanitizeUrl('mailto:user@example.com', 'image')).toBe('')
  })
})
