import { describe, expect, it } from 'vitest'
import { applyFilters, matchesFilter, withoutEmptyFilters } from '@/core/filters'
import type { DataTableColumn } from '@/types'

describe('filters', () => {
  it.each([
    ['contains', 'Alpha beta', 'BETA', true],
    ['startsWith', 'Alpha', 'al', true],
    ['endsWith', 'Alpha', 'HA', true],
    ['eq', 5, 5, true],
    ['neq', 5, 6, true],
    ['gt', 5, 4, true],
    ['gte', 5, 5, true],
    ['lt', 4, 5, true],
    ['lte', 5, 5, true],
  ] as const)('applies %s', (operator, actual, expected, result) =>
    expect(matchesFilter(actual, { operator, value: expected }, typeof actual === 'number' ? 'number' : 'text')).toBe(
      result,
    ),
  )
  it('uses inclusive between and date comparisons', () => {
    expect(matchesFilter(5, { operator: 'between', from: 5, to: 8 }, 'number')).toBe(true)
    expect(matchesFilter('2026-02-01', { operator: 'gt', value: '2026-01-01' }, 'date')).toBe(true)
  })
  it('filters with column accessors and removes empty clauses', () => {
    const columns: DataTableColumn[] = [{ key: 'name', label: 'Name', field: 'user.name', filterable: true }]
    expect(
      applyFilters([{ user: { name: 'Alice' } }, { user: { name: 'Bob' } }], columns, {
        name: { operator: 'contains', value: 'ali' },
      }),
    ).toHaveLength(1)
    expect(withoutEmptyFilters({ name: { operator: 'contains', value: '' } })).toEqual({})
  })
})
