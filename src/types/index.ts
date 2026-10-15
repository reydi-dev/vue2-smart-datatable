export type DataRow = Record<string, any>
export type RowKey = string | number
export type RowKeyGetter<Row extends DataRow = DataRow> = (row: Row) => RowKey
export type DataMode = 'local' | 'server'
export type Direction = 'ltr' | 'rtl'
export type VuetifyBreakpoint = 'xsOnly' | 'smAndDown' | 'mdAndDown' | 'mdAndUp' | 'lgAndUp'
export type ExportScope = 'current' | 'all'

export type CellType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'select'
  | 'chip'
  | 'icon'
  | 'image'
  | 'link'
  | 'copy'
  | 'expandable-text'
  | 'custom'

export type FilterOperator =
  'contains' | 'startsWith' | 'endsWith' | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in'

export interface FilterClause {
  operator: FilterOperator
  value?: unknown
  from?: unknown
  to?: unknown
}

export type FilterState = Record<string, FilterClause>

export interface ColumnFilterDefinition {
  type?: 'text' | 'number' | 'date' | 'select'
  operators?: FilterOperator[]
  defaultOperator?: FilterOperator
  placeholder?: string
}

export interface CellContext<Row extends DataRow = DataRow> {
  row: Row
  rowKey: RowKey
  column: DataTableColumn<Row>
  value: unknown
  formattedValue: unknown
  rowIndex: number
  mobile: boolean
}

export interface DataTableColumn<Row extends DataRow = DataRow> {
  key: string
  label: string
  field?: string | ((row: Row) => unknown)
  type?: CellType
  formatter?: (value: unknown, row: Row, column: DataTableColumn<Row>) => unknown
  sortable?: boolean
  sortKey?: string
  filterable?: boolean
  filter?: ColumnFilterDefinition
  options?: Array<{ label: string; value: unknown }>
  align?: 'start' | 'center' | 'end'
  width?: string | number
  minWidth?: string | number
  compact?: boolean
  hideable?: boolean
  hiddenByDefault?: boolean
  mobile?: { summary?: boolean; order?: number }
  cellClass?: string | ((context: CellContext<Row>) => unknown)
  headerClass?: string
  exportValue?: (row: Row) => unknown
  numberFormat?: Intl.NumberFormatOptions
  dateFormat?: Intl.DateTimeFormatOptions
  tooltip?: string | ((context: CellContext<Row>) => string)
}

export interface SortState {
  columnKey: string
  direction: 'asc' | 'desc'
}

export interface DataProviderRequest {
  page: number
  itemsPerPage: number
  sort: null | { columnKey: string; field?: string; direction: 'asc' | 'desc' }
  filters: FilterState
  context?: unknown
  signal?: AbortSignal
  reason: 'initial' | 'page' | 'page-size' | 'sort' | 'filter' | 'refresh' | 'export'
}

export interface NormalizedData<Row extends DataRow = DataRow> {
  items: Row[]
  total: number
  meta?: unknown
}

export type DataProvider = (request: DataProviderRequest) => Promise<unknown>
export type ResponseNormalizer<Row extends DataRow = DataRow> = (
  raw: unknown,
  request: DataProviderRequest,
) => NormalizedData<Row>

export interface RowAction<Row extends DataRow = DataRow> {
  key: string
  label: string
  icon?: string
  color?: string
  position?: 'leading' | 'trailing' | 'menu'
  visible?: boolean | ((row: Row) => boolean)
  disabled?: boolean | ((row: Row) => boolean)
  loading?: boolean | ((row: Row) => boolean)
}

export interface PersistedColumnState {
  version: 1
  visibleColumns: string[]
}

export interface PersistenceAdapter {
  load(key: string): Promise<PersistedColumnState | null>
  save(key: string, value: PersistedColumnState): Promise<void>
  remove(key: string): Promise<void>
}

export interface ExporterContext<Row extends DataRow = DataRow> {
  scope: ExportScope
  columns: DataTableColumn<Row>[]
  rows: Row[]
  total: number
  request: DataProviderRequest
  fileName: string
  reportProgress(percent: number): void
  fetchPage(page: number, itemsPerPage: number): Promise<NormalizedData<Row>>
}

export interface ExporterAdapter<Row extends DataRow = DataRow> {
  key: string
  label: string
  scopes: ExportScope[]
  export(context: ExporterContext<Row>): Promise<void>
}

export interface DataTableMessages {
  loading: string
  empty: string
  error: string
  retry: string
  rowsPerPage: string
  of: string
  filters: string
  clearFilters: string
  columns: string
  reset: string
  apply: string
  export: string
  currentPage: string
  allRows: string
  copy: string
  copied: string
  expand: string
  collapse: string
  actions: string
  selectAll: string
  selectRow?: string
}

export interface DataTableIcons {
  sortAsc: string
  sortDesc: string
  filter: string
  columns: string
  export: string
  copy: string
  expand: string
  collapse: string
  previous: string
  next: string
  actions: string
  retry: string
}

export interface DataTableState {
  page: number
  itemsPerPage: number
  sort: SortState | null
  filters: FilterState
  selectedKeys: RowKey[]
  visibleColumns: string[]
  total: number
  loading: boolean
  error: unknown
}
