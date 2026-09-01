import { resolveColumnValue } from './columns'
import type { DataRow, DataTableColumn, FilterClause, FilterOperator, FilterState } from '../types'

export const operatorDefaults: Record<'text' | 'number' | 'date' | 'select', FilterOperator> = {
  text: 'contains',
  number: 'eq',
  date: 'eq',
  select: 'eq',
}

export const operatorsByType: Record<'text' | 'number' | 'date' | 'select', FilterOperator[]> = {
  text: ['contains', 'startsWith', 'endsWith', 'eq', 'neq'],
  number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between'],
  date: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between'],
  select: ['eq', 'neq', 'in'],
}

export function isEmptyFilterValue(value: unknown): boolean {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
}

function comparable(value: unknown, type: string): unknown {
  if (type === 'number') {
    const number = Number(value)
    return Number.isFinite(number) ? number : null
  }
  if (type === 'date') {
    const time = value instanceof Date ? value.getTime() : new Date(String(value)).getTime()
    return Number.isNaN(time) ? null : time
  }
  return value
}

export function matchesFilter(value: unknown, clause: FilterClause, type = 'text'): boolean {
  if (clause.operator === 'between') {
    if (isEmptyFilterValue(clause.from) || isEmptyFilterValue(clause.to)) return true
    const actual = comparable(value, type) as any
    const from = comparable(clause.from, type) as any
    const to = comparable(clause.to, type) as any
    return actual !== null && from !== null && to !== null && actual >= from && actual <= to
  }
  if (isEmptyFilterValue(clause.value)) return true
  if (clause.operator === 'in')
    return Array.isArray(clause.value) && clause.value.some((item) => Object.is(item, value))

  if (['contains', 'startsWith', 'endsWith'].includes(clause.operator)) {
    const actual = String(value ?? '').toLocaleLowerCase()
    const expected = String(clause.value).toLocaleLowerCase()
    if (clause.operator === 'contains') return actual.includes(expected)
    if (clause.operator === 'startsWith') return actual.startsWith(expected)
    return actual.endsWith(expected)
  }

  const actual = comparable(value, type) as any
  const expected = comparable(clause.value, type) as any
  if (actual === null || expected === null) return false
  switch (clause.operator) {
    case 'eq':
      return actual === expected
    case 'neq':
      return actual !== expected
    case 'gt':
      return actual > expected
    case 'gte':
      return actual >= expected
    case 'lt':
      return actual < expected
    case 'lte':
      return actual <= expected
    default:
      return true
  }
}

export function applyFilters<Row extends DataRow>(
  rows: Row[],
  columns: DataTableColumn<Row>[],
  filters: FilterState,
): Row[] {
  const columnsByKey = new Map(columns.map((column) => [column.key, column]))
  return rows.filter((row) =>
    Object.entries(filters).every(([key, clause]) => {
      const column = columnsByKey.get(key)
      if (!column) return true
      return matchesFilter(resolveColumnValue(column, row), clause, column.filter?.type || column.type || 'text')
    }),
  )
}

export function withoutEmptyFilters(filters: FilterState): FilterState {
  return Object.fromEntries(
    Object.entries(filters).filter(([, clause]) =>
      clause.operator === 'between'
        ? !isEmptyFilterValue(clause.from) || !isEmptyFilterValue(clause.to)
        : !isEmptyFilterValue(clause.value),
    ),
  )
}
