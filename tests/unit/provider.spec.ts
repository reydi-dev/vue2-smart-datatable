import { describe, expect, it } from 'vitest'
import { defaultResponseNormalizer, normalizeProviderResponse } from '@/core/provider'
import type { DataProviderRequest } from '@/types'
const request = { page: 1, itemsPerPage: 10, sort: null, filters: {}, reason: 'initial' } as DataProviderRequest
describe('provider normalization', () => {
  it('accepts canonical objects and arrays', () => {
    expect(defaultResponseNormalizer([1, 2]).total).toBe(2)
    expect(defaultResponseNormalizer({ items: [], total: 4 }).total).toBe(4)
  })
  it('rejects backend-specific or malformed shapes', () => {
    expect(() => defaultResponseNormalizer({ model: { data: [] } })).toThrow()
    expect(() => normalizeProviderResponse({}, request, () => ({ items: [], total: -1 }))).toThrow()
  })
})
