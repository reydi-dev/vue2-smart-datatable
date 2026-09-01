import type { DataProviderRequest, DataRow, NormalizedData, ResponseNormalizer } from '../types'

export function defaultResponseNormalizer<Row extends DataRow>(raw: unknown): NormalizedData<Row> {
  if (Array.isArray(raw)) return { items: raw as Row[], total: raw.length }
  if (raw && typeof raw === 'object') {
    const value = raw as Record<string, unknown>
    if (
      Array.isArray(value.items) &&
      typeof value.total === 'number' &&
      Number.isFinite(value.total) &&
      value.total >= 0
    ) {
      return { items: value.items as Row[], total: value.total, meta: value.meta }
    }
  }
  throw new TypeError('The response normalizer must return { items: Row[], total: number, meta?: unknown }')
}

export function normalizeProviderResponse<Row extends DataRow>(
  raw: unknown,
  request: DataProviderRequest,
  normalizer?: ResponseNormalizer<Row>,
): NormalizedData<Row> {
  const result = normalizer ? normalizer(raw, request) : defaultResponseNormalizer<Row>(raw)
  if (!result || !Array.isArray(result.items) || !Number.isFinite(result.total) || result.total < 0) {
    throw new TypeError('The response normalizer returned invalid data')
  }
  return result
}
