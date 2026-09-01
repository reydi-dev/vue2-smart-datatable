import { applyFilters } from './filters'
import { resolveColumnValue } from './columns'
import type { DataRow, DataTableColumn, FilterState, SortState } from '../types'

export function stableSort<Row extends DataRow>(
  rows: Row[],
  columns: DataTableColumn<Row>[],
  sort: SortState | null,
): Row[] {
  if (!sort) return [...rows]
  const column = columns.find((item) => item.key === sort.columnKey)
  if (!column) return [...rows]
  const direction = sort.direction === 'asc' ? 1 : -1
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const left = resolveColumnValue(column, a.row)
      const right = resolveColumnValue(column, b.row)
      if (left === right) return a.index - b.index
      if (left === null || left === undefined) return 1
      if (right === null || right === undefined) return -1
      let result: number
      if (column.type === 'number') result = Number(left) - Number(right)
      else if (column.type === 'date') result = new Date(String(left)).getTime() - new Date(String(right)).getTime()
      else result = String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' })
      return result === 0 ? a.index - b.index : result * direction
    })
    .map(({ row }) => row)
}

export function processLocalData<Row extends DataRow>(
  rows: Row[],
  columns: DataTableColumn<Row>[],
  filters: FilterState,
  sort: SortState | null,
  page: number,
  itemsPerPage: number,
): { items: Row[]; total: number } {
  const filtered = applyFilters(rows, columns, filters)
  const sorted = stableSort(filtered, columns, sort)
  const start = Math.max(0, page - 1) * itemsPerPage
  return { items: sorted.slice(start, start + itemsPerPage), total: sorted.length }
}
