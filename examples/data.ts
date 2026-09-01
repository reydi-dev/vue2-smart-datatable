import type { DataTableColumn, RowAction } from '@/types'

export interface DemoRow {
  id: number
  name: string
  email: string
  age: number
  active: boolean
  joined: string
  role: string
  note: string
}
export const rows: DemoRow[] = Array.from({ length: 67 }, (_, index) => ({
  id: index + 1,
  name: `Person ${index + 1}`,
  email: `person${index + 1}@example.com`,
  age: 20 + (index % 35),
  active: index % 3 !== 0,
  joined: `2026-${String((index % 8) + 1).padStart(2, '0')}-15`,
  role: ['admin', 'editor', 'viewer'][index % 3],
  note: `Safe text <strong>for row ${index + 1}</strong>`,
}))
export const columns: DataTableColumn<DemoRow>[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'number',
    sortable: true,
    filterable: true,
    width: 80,
    mobile: { summary: true, order: 1 },
  },
  { key: 'name', label: 'Name', sortable: true, filterable: true, mobile: { summary: true, order: 2 } },
  { key: 'email', label: 'Email', type: 'copy', filterable: true },
  { key: 'age', label: 'Age', type: 'number', sortable: true, filterable: true },
  {
    key: 'active',
    label: 'Active',
    type: 'boolean',
    filterable: true,
    filter: { type: 'select' },
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  },
  { key: 'joined', label: 'Joined', type: 'date', sortable: true, filterable: true },
  {
    key: 'role',
    label: 'Role',
    type: 'chip',
    filterable: true,
    filter: { type: 'select' },
    options: ['admin', 'editor', 'viewer'].map((value) => ({ label: value, value })),
  },
  { key: 'note', label: 'Note', type: 'expandable-text', hiddenByDefault: true },
]
export const actions: RowAction<DemoRow>[] = [{ key: 'inspect', label: 'Inspect', icon: 'mdi-eye', color: 'primary' }]
