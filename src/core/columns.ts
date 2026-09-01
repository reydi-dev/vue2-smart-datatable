import type { CellContext, DataRow, DataTableColumn, RowKey, RowKeyGetter } from '../types'

export function getPathValue(source: unknown, path: string): unknown {
  if (!path) return undefined
  return path.split('.').reduce<unknown>((value, key) => {
    if (value === null || value === undefined || typeof value !== 'object') return undefined
    return (value as Record<string, unknown>)[key]
  }, source)
}

export function resolveColumnValue<Row extends DataRow>(column: DataTableColumn<Row>, row: Row): unknown {
  if (typeof column.field === 'function') return column.field(row)
  return getPathValue(row, column.field || column.key)
}

export function formatColumnValue<Row extends DataRow>(column: DataTableColumn<Row>, row: Row, locale = 'en'): unknown {
  const value = resolveColumnValue(column, row)
  if (column.formatter) return column.formatter(value, row, column)
  if (value === null || value === undefined) return ''
  if (column.type === 'select') {
    return column.options?.find((option) => Object.is(option.value, value))?.label ?? value
  }
  if (column.type === 'number') {
    const number = Number(value)
    return Number.isFinite(number) ? new Intl.NumberFormat(locale, column.numberFormat).format(number) : ''
  }
  if (column.type === 'date') {
    const date = value instanceof Date ? value : new Date(String(value))
    return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(locale, column.dateFormat).format(date)
  }
  return value
}

export function normalizeColumns<Row extends DataRow>(columns: DataTableColumn<Row>[]): DataTableColumn<Row>[] {
  const keys = new Set<string>()
  return columns.map((column) => {
    if (!column.key || keys.has(column.key))
      throw new Error(`Column keys must be non-empty and unique: ${column.key || '(empty)'}`)
    keys.add(column.key)
    return {
      type: 'text',
      sortable: false,
      filterable: false,
      hideable: true,
      align: 'start',
      ...column,
    }
  })
}

export function resolveRowKey<Row extends DataRow>(row: Row, rowKey: string | RowKeyGetter<Row>): RowKey {
  const key = typeof rowKey === 'function' ? rowKey(row) : getPathValue(row, rowKey)
  if (typeof key !== 'string' && typeof key !== 'number')
    throw new Error('Every row must resolve to a string or number row key')
  return key
}

export function resolveCellClass<Row extends DataRow>(
  column: DataTableColumn<Row>,
  context: CellContext<Row>,
): unknown {
  return typeof column.cellClass === 'function' ? column.cellClass(context) : column.cellClass
}
