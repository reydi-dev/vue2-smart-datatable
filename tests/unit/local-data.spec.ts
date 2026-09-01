import { describe, expect, it } from 'vitest'
import { processLocalData, stableSort } from '@/core/local-data'
import type { DataTableColumn } from '@/types'
const columns: DataTableColumn[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Name' },
]
describe('local data', () => {
  it('filters, stably sorts and paginates without mutation', () => {
    const rows = [
      { id: 3, name: 'A' },
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]
    const original = JSON.stringify(rows)
    expect(
      processLocalData(
        rows,
        columns,
        { name: { operator: 'eq', value: 'A' } },
        { columnKey: 'id', direction: 'asc' },
        1,
        1,
      ),
    ).toEqual({ items: [{ id: 1, name: 'A' }], total: 2 })
    expect(JSON.stringify(rows)).toBe(original)
  })
  it('places nulls last', () =>
    expect(stableSort([{ id: null }, { id: 1 }], columns, { columnKey: 'id', direction: 'asc' })[1].id).toBeNull())
})
