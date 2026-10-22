<template>
  <div class="sdt-root" :dir="direction" :data-sdt-theme="theme">
    <slot name="toolbar" :state="getState()">
      <SmartTableToolbar
        v-if="showToolbar"
        :has-filters="hasFilterableColumns"
        :column-visibility="columnVisibility"
        :exporters="exporters"
        :messages="resolvedMessages"
        :icons="resolvedIcons"
        :exporting="exporting"
        :disabled="disabled"
        @toggle-filters="!disabled && (filtersOpen = !filtersOpen)"
        @columns="!disabled && (columnsDialog = true)"
        @export="!disabled && exportData($event.exporter, $event.scope)"
        ><slot name="toolbar-prepend" /><template #append><slot name="toolbar-append" /></template
      ></SmartTableToolbar>
    </slot>

    <SmartTableFilters
      v-if="filtersOpen && hasFilterableColumns"
      :columns="activeColumns"
      :value="internalFilters"
      :messages="resolvedMessages"
      :disabled="disabled"
      @input="setFilters"
    >
      <template v-for="column in filterSlotColumns" v-slot:[`filter.${column.key}`]="context">
        <slot :name="`filter.${column.key}`" v-bind="context" />
      </template>
    </SmartTableFilters>

    <v-alert v-if="internalError" type="error" text class="sdt-state">
      <slot name="error" :error="internalError" :retry="refresh"
        >{{ resolvedMessages.error }}
        <v-btn text small @click="refresh()"
          ><SmartTableIcon :icon="resolvedIcons.retry" :size="16" leading />{{ resolvedMessages.retry }}</v-btn
        ></slot
      >
    </v-alert>
    <div v-else-if="isLoading" class="sdt-state">
      <slot name="loading"
        ><v-progress-circular indeterminate color="primary" /><span>{{ resolvedMessages.loading }}</span></slot
      >
    </div>
    <div v-else-if="displayRows.length === 0" class="sdt-state">
      <slot name="empty">{{ resolvedMessages.empty }}</slot>
    </div>

    <component
      v-else
      :is="isMobile ? 'SmartTableMobile' : 'SmartTableDesktop'"
      :rows="displayRows"
      :columns="activeColumns"
      :row-key-of="rowKeyOf"
      :selected-keys="internalSelectedKeys"
      :selectable="selectable"
      :disabled="disabled"
      :row-clickable="!disabled && Boolean($listeners['row-click'])"
      :actions="actions"
      :sort="internalSort"
      :dense="dense"
      :fixed-header="fixedHeader"
      :height="height"
      :summary-limit="mobileSummaryLimit"
      :messages="resolvedMessages"
      :icons="resolvedIcons"
      :row-class="rowClass"
      @sort="setSortFromColumn"
      @select-row="selectRow"
      @select-page="selectPage"
      @row-click="!disabled && $emit('row-click', $event)"
      @row-action="!disabled && $emit('row-action', $event)"
      @cell-click="!disabled && $emit('cell-click', $event)"
    >
      <template #header="context">
        <slot
          v-if="$scopedSlots[`header.${context.column.key}`]"
          :name="`header.${context.column.key}`"
          v-bind="context"
        />
        <slot v-else-if="$scopedSlots.header" name="header" v-bind="context" />
        <template v-else>
          <button
            v-if="context.column.sortable"
            type="button"
            class="sdt-sort-button"
            :disabled="disabled"
            @click="setSortFromColumn(context.column)"
          >
            {{ context.column.label }}
            <SmartTableIcon
              v-if="internalSort && internalSort.columnKey === context.column.key"
              :icon="internalSort.direction === 'asc' ? resolvedIcons.sortAsc : resolvedIcons.sortDesc"
              :size="14"
            />
          </button>
          <span v-else>{{ context.column.label }}</span>
        </template>
      </template>
      <template #cell="context">
        <slot
          v-if="$scopedSlots[`cell.${context.column.key}`]"
          :name="`cell.${context.column.key}`"
          v-bind="cellContext(context)"
        />
        <slot v-else-if="$scopedSlots.cell" name="cell" v-bind="cellContext(context)" />
        <SmartTableCell v-else v-bind="cellProps(context)" @cell-click="!disabled && $emit('cell-click', $event)" />
      </template>
      <template v-if="$scopedSlots['row-actions']" #row-actions="context"
        ><slot name="row-actions" v-bind="context"
      /></template>
      <template v-if="hasCustomActionSlots" #action="context">
        <slot
          v-if="$scopedSlots[`action.${context.action.key}`]"
          :name="`action.${context.action.key}`"
          v-bind="context"
        />
        <SmartTableAction
          v-else
          :action="context.action"
          :disabled="disabled || context.disabled"
          :loading="context.loading"
          @click="context.trigger($event)"
        />
      </template>
      <template v-if="$scopedSlots['mobile-summary']" #mobile-summary="context"
        ><slot name="mobile-summary" v-bind="context"
      /></template>
      <template v-if="$scopedSlots['mobile-details']" #mobile-details="context"
        ><slot name="mobile-details" v-bind="context"
      /></template>
    </component>

    <slot name="footer" :state="getState()">
      <SmartTablePagination
        v-if="showPagination"
        :page="internalPage"
        :items-per-page="internalItemsPerPage"
        :total="internalTotal"
        :page-size-options="pageSizeOptions"
        :messages="resolvedMessages"
        :previous-icon="paginationIcons.previous"
        :next-icon="paginationIcons.next"
        :disabled="disabled || isLoading || Boolean(internalError)"
        @update:page="setPage"
        @update:items-per-page="setItemsPerPage"
      />
    </slot>

    <ColumnVisibilityDialog
      v-model="columnsDialog"
      :columns="normalizedColumns"
      :visible-columns="internalVisibleColumns"
      :messages="resolvedMessages"
      :disabled="disabled"
      @apply="!disabled && setVisibleColumns($event)"
      @reset="!disabled && resetColumnVisibility()"
    />
    <div v-if="exporting" class="sdt-export-progress">
      <slot name="export-progress" :percent="exportProgress"><v-progress-linear :value="exportProgress" /></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SmartTableIcon from './SmartTableIcon.vue'
import SmartTableAction from './SmartTableAction.vue'
import SmartTableDesktop from './SmartTableDesktop.vue'
import SmartTableMobile from './SmartTableMobile.vue'
import SmartTableToolbar from './SmartTableToolbar.vue'
import SmartTableFilters from './SmartTableFilters.vue'
import SmartTablePagination from './SmartTablePagination.vue'
import SmartTableCell from './SmartTableCell.vue'
import ColumnVisibilityDialog from './ColumnVisibilityDialog.vue'
import { defaultIcons, defaultMessages } from '../core/messages'
import { formatColumnValue, normalizeColumns, resolveColumnValue, resolveRowKey } from '../core/columns'
import { processLocalData } from '../core/local-data'
import { normalizeProviderResponse } from '../core/provider'
import { toggleKey, togglePageKeys } from '../core/selection'
import { withoutEmptyFilters } from '../core/filters'
import { isMobileBreakpoint, matchesMobileBreakpoint, observeViewportWidth } from '../core/responsive'
import type {
  CellContext,
  DataMode,
  DataProvider,
  DataProviderRequest,
  DataRow,
  DataTableColumn,
  DataTableIcons,
  DataTableIcon,
  DataTableTheme,
  DataTableMessages,
  DataTableState,
  Direction,
  ExportScope,
  ExporterAdapter,
  FilterState,
  NormalizedData,
  PersistenceAdapter,
  ResponseNormalizer,
  RowAction,
  RowKey,
  RowKeyGetter,
  SortState,
  MobileBreakpoint,
} from '../types'

type RequestReason = DataProviderRequest['reason']

export default Vue.extend({
  name: 'SmartDataTable',
  components: {
    SmartTableIcon,
    SmartTableAction,
    SmartTableDesktop,
    SmartTableMobile,
    SmartTableToolbar,
    SmartTableFilters,
    SmartTablePagination,
    SmartTableCell,
    ColumnVisibilityDialog,
  },
  props: {
    columns: { type: Array as () => DataTableColumn[], required: true },
    mode: { type: String as () => DataMode, default: 'local' },
    items: { type: Array as () => DataRow[], default: () => [] },
    dataProvider: Function as unknown as () => DataProvider | undefined,
    normalizeResponse: Function as unknown as () => ResponseNormalizer | undefined,
    providerContext: { default: null },
    rowKey: { type: [String, Function] as unknown as () => string | RowKeyGetter, default: 'id' },
    page: { type: Number, default: 1 },
    itemsPerPage: { type: Number, default: 25 },
    pageSizeOptions: { type: Array as () => number[], default: () => [10, 25, 50, 100] },
    sort: { type: Object as () => SortState | null, default: null },
    filters: { type: Object as () => FilterState, default: () => ({}) },
    value: { type: Array as () => RowKey[], default: () => [] },
    selectable: Boolean,
    actions: { type: Array as () => RowAction[], default: () => [] },
    visibleColumns: { type: Array as () => string[] | undefined, default: undefined },
    columnVisibility: { type: Boolean, default: true },
    persistenceAdapter: Object as () => PersistenceAdapter | undefined,
    persistenceKey: String,
    exporters: { type: Array as () => ExporterAdapter[], default: () => [] },
    exportFileName: { type: String, default: 'export' },
    messages: { type: Object as () => Partial<DataTableMessages>, default: () => ({}) },
    direction: { type: String as () => Direction, default: 'ltr' },
    theme: {
      type: String as () => DataTableTheme | undefined,
      validator: (value: string) => ['light', 'dark'].includes(value),
    },
    icons: { type: Object as () => Partial<DataTableIcons>, default: () => ({}) },
    mobileBreakpoint: {
      type: [Number, String] as unknown as () => MobileBreakpoint,
      default: 960,
      validator: isMobileBreakpoint,
    },
    mobileSummaryLimit: { type: Number, default: 3 },
    filterDebounce: { type: Number, default: 250 },
    autoLoad: { type: Boolean, default: true },
    loading: Boolean,
    disabled: Boolean,
    dense: Boolean,
    fixedHeader: Boolean,
    height: [String, Number],
    showToolbar: { type: Boolean, default: true },
    showPagination: { type: Boolean, default: true },
    rowClass: Function,
  },
  data() {
    return {
      viewportWidth: null as number | null,
      stopViewportObservation: null as (() => void) | null,
      internalPage: Math.max(1, this.page),
      internalItemsPerPage: this.itemsPerPage,
      internalSort: this.sort as SortState | null,
      internalFilters: { ...this.filters } as FilterState,
      internalSelectedKeys: [...this.value] as RowKey[],
      internalVisibleColumns: normalizeColumns(this.columns)
        .filter((column) => !column.hiddenByDefault)
        .map((column) => column.key) as string[],
      serverRows: [] as DataRow[],
      internalTotal: 0,
      internalLoading: false,
      internalError: null as unknown,
      filtersOpen: false,
      columnsDialog: false,
      exporting: false,
      exportProgress: 0,
      requestId: 0,
      activeController: null as AbortController | null,
      loadTimer: null as ReturnType<typeof setTimeout> | null,
      ready: false,
    }
  },
  computed: {
    normalizedColumns(): DataTableColumn[] {
      return normalizeColumns(this.columns)
    },
    defaultVisibleColumns(): string[] {
      return this.normalizedColumns.filter((column) => !column.hiddenByDefault).map((column) => column.key)
    },
    activeColumns(): DataTableColumn[] {
      return this.normalizedColumns.filter((column) => this.internalVisibleColumns.includes(column.key))
    },
    filterSlotColumns(): DataTableColumn[] {
      return this.activeColumns.filter((column) => Boolean(this.$scopedSlots[`filter.${column.key}`]))
    },
    localResult(): NormalizedData {
      return processLocalData(
        this.items,
        this.normalizedColumns,
        this.internalFilters,
        this.internalSort,
        this.internalPage,
        this.internalItemsPerPage,
      )
    },
    displayRows(): DataRow[] {
      return this.mode === 'local' ? this.localResult.items : this.serverRows
    },
    resolvedMessages(): DataTableMessages {
      return { ...defaultMessages, ...this.messages }
    },
    resolvedIcons(): DataTableIcons {
      return { ...defaultIcons, ...this.icons }
    },
    paginationIcons(): { previous: DataTableIcon; next: DataTableIcon } {
      return this.direction === 'rtl'
        ? { previous: this.resolvedIcons.next, next: this.resolvedIcons.previous }
        : { previous: this.resolvedIcons.previous, next: this.resolvedIcons.next }
    },
    hasFilterableColumns(): boolean {
      return this.normalizedColumns.some((column) => column.filterable)
    },
    hasCustomActionSlots(): boolean {
      return this.actions.some((action) => Boolean(this.$scopedSlots[`action.${action.key}`]))
    },
    isLoading(): boolean {
      return this.loading || this.internalLoading
    },
    isMobile(): boolean {
      return this.viewportWidth !== null && matchesMobileBreakpoint(this.viewportWidth, this.mobileBreakpoint)
    },
  },
  watch: {
    page(value: number) {
      if (value !== this.internalPage) this.internalPage = Math.max(1, value)
    },
    itemsPerPage(value: number) {
      if (value !== this.internalItemsPerPage) this.internalItemsPerPage = value
    },
    sort: {
      deep: true,
      handler(value: SortState | null) {
        this.internalSort = value ? { ...value } : null
      },
    },
    filters: {
      deep: true,
      handler(value: FilterState) {
        this.internalFilters = { ...value }
      },
    },
    value(value: RowKey[]) {
      this.internalSelectedKeys = [...value]
    },
    visibleColumns(value?: string[]) {
      if (value) this.internalVisibleColumns = this.validVisibleColumns(value)
    },
    internalPage() {
      this.scheduleLoad('page')
    },
    internalItemsPerPage() {
      this.scheduleLoad('page-size')
    },
    internalSort: {
      deep: true,
      handler() {
        this.scheduleLoad('sort')
      },
    },
    internalFilters: {
      deep: true,
      handler() {
        this.scheduleLoad('filter', this.filterDebounce)
      },
    },
    providerContext: {
      deep: true,
      handler() {
        this.scheduleLoad('refresh')
      },
    },
    dataProvider() {
      this.scheduleLoad('refresh')
    },
    mode(value: DataMode) {
      this.internalError = null
      if (value === 'server') {
        if (this.autoLoad) this.scheduleLoad('initial')
      } else {
        this.cancelPendingLoad(true)
        this.serverRows = []
        this.updateLocalTotal()
      }
    },
    items: {
      deep: true,
      handler() {
        if (this.mode === 'local') this.updateLocalTotal()
      },
    },
    localResult: {
      deep: true,
      handler() {
        if (this.mode === 'local') this.updateLocalTotal()
      },
    },
    columns: {
      deep: true,
      handler() {
        this.internalVisibleColumns = this.validVisibleColumns(
          this.internalVisibleColumns.length ? this.internalVisibleColumns : this.defaultVisibleColumns,
        )
      },
    },
  },
  async mounted() {
    this.stopViewportObservation = observeViewportWidth((width) => {
      this.viewportWidth = width
    })
    this.internalVisibleColumns = this.visibleColumns
      ? this.validVisibleColumns(this.visibleColumns)
      : this.defaultVisibleColumns
    if (!this.visibleColumns && this.persistenceAdapter && this.persistenceKey) {
      try {
        const saved = await this.persistenceAdapter.load(this.persistenceKey)
        if (saved?.version === 1) this.internalVisibleColumns = this.validVisibleColumns(saved.visibleColumns)
      } catch {
        /* persistence is optional */
      }
    }
    this.ready = true
    if (this.mode === 'local') this.updateLocalTotal()
    else if (this.autoLoad) await this.load('initial')
  },
  beforeDestroy() {
    this.stopViewportObservation?.()
    this.cancelPendingLoad()
  },
  methods: {
    cancelPendingLoad(emitLoadingChange = false) {
      if (this.loadTimer) clearTimeout(this.loadTimer)
      this.loadTimer = null
      this.requestId += 1
      this.activeController?.abort()
      this.activeController = null
      if (this.internalLoading) {
        this.internalLoading = false
        if (emitLoadingChange) this.$emit('loading-change', false)
      }
    },
    rowKeyOf(row: DataRow): RowKey {
      return resolveRowKey(row, this.rowKey)
    },
    validVisibleColumns(keys: string[]): string[] {
      const allowed = new Set(this.normalizedColumns.map((column) => column.key))
      const fixed = this.normalizedColumns.filter((column) => column.hideable === false).map((column) => column.key)
      return [...new Set([...fixed, ...keys.filter((key) => allowed.has(key))])]
    },
    updateLocalTotal() {
      this.internalTotal = this.localResult.total
    },
    request(reason: RequestReason, signal?: AbortSignal): DataProviderRequest {
      const column = this.internalSort
        ? this.normalizedColumns.find((item) => item.key === this.internalSort?.columnKey)
        : undefined
      return {
        page: this.internalPage,
        itemsPerPage: this.internalItemsPerPage,
        sort: this.internalSort
          ? {
              ...this.internalSort,
              field: column?.sortKey || (typeof column?.field === 'string' ? column.field : undefined),
            }
          : null,
        filters: withoutEmptyFilters(this.internalFilters),
        context: this.providerContext,
        signal,
        reason,
      }
    },
    scheduleLoad(reason: RequestReason, delay = 0) {
      if (!this.ready || this.mode !== 'server') return
      if (this.loadTimer) clearTimeout(this.loadTimer)
      this.loadTimer = setTimeout(() => this.load(reason), delay)
    },
    async load(reason: RequestReason = 'refresh'): Promise<void> {
      if (this.mode !== 'server') {
        this.updateLocalTotal()
        return
      }
      if (!this.dataProvider) {
        this.cancelPendingLoad(true)
        this.internalError = new Error('dataProvider is required in server mode')
        return
      }
      this.activeController?.abort()
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
      this.activeController = controller
      const id = ++this.requestId
      const request = this.request(reason, controller?.signal)
      this.internalLoading = true
      this.internalError = null
      this.$emit('load-start', request)
      this.$emit('loading-change', true)
      try {
        const raw = await this.dataProvider(request)
        const result = normalizeProviderResponse(raw, request, this.normalizeResponse)
        if (id !== this.requestId) return
        this.serverRows = [...result.items]
        this.internalTotal = result.total
        this.$emit('load-success', { request, result })
      } catch (error: any) {
        if (id !== this.requestId || error?.name === 'AbortError') return
        this.serverRows = []
        this.internalError = error
        this.$emit('load-error', { request, error })
      } finally {
        if (id === this.requestId) {
          this.activeController = null
          this.internalLoading = false
          this.$emit('loading-change', false)
        }
      }
    },
    async refresh(reason: RequestReason = 'refresh') {
      await this.load(reason)
    },
    emitOptionsChange() {
      this.$emit('options-change', this.request('refresh'))
    },
    setPage(page: number) {
      if (this.disabled || page === this.internalPage) return
      this.internalPage = Math.max(1, page)
      this.$emit('update:page', this.internalPage)
      this.emitOptionsChange()
    },
    setItemsPerPage(size: number) {
      if (this.disabled || size <= 0) return
      this.internalItemsPerPage = size
      this.internalPage = 1
      this.$emit('update:items-per-page', size)
      this.$emit('update:page', 1)
      this.emitOptionsChange()
    },
    setSortFromColumn(column: DataTableColumn) {
      if (this.disabled || !column.sortable) return
      const next: SortState =
        this.internalSort?.columnKey === column.key
          ? { columnKey: column.key, direction: this.internalSort.direction === 'asc' ? 'desc' : 'asc' }
          : { columnKey: column.key, direction: 'asc' }
      this.internalSort = next
      this.internalPage = 1
      this.$emit('update:sort', next)
      this.$emit('update:page', 1)
      this.emitOptionsChange()
    },
    setFilters(filters: FilterState, force = false) {
      if (this.disabled && !force) return
      this.internalFilters = { ...filters }
      this.internalPage = 1
      this.$emit('update:filters', this.internalFilters)
      this.$emit('update:page', 1)
      this.emitOptionsChange()
    },
    resetFilters() {
      this.setFilters({}, true)
    },
    selectRow({ row, selected }: { row: DataRow; selected: boolean }) {
      if (this.disabled) return
      const next = toggleKey(this.internalSelectedKeys, this.rowKeyOf(row), selected)
      this.setSelection(next)
    },
    selectPage(selected: boolean) {
      if (this.disabled) return
      this.setSelection(togglePageKeys(this.internalSelectedKeys, this.displayRows.map(this.rowKeyOf), selected))
    },
    setSelection(keys: RowKey[]) {
      this.internalSelectedKeys = keys
      const rows = this.displayRows.filter((row) => keys.includes(this.rowKeyOf(row)))
      this.$emit('input', keys)
      this.$emit('selection-change', { keys, rows })
    },
    clearSelection() {
      this.setSelection([])
    },
    async setVisibleColumns(keys: string[]) {
      const next = this.validVisibleColumns(keys)
      this.internalVisibleColumns = next
      this.$emit('update:visible-columns', next)
      this.$emit('column-visibility-change', next)
      if (this.persistenceAdapter && this.persistenceKey)
        await this.persistenceAdapter.save(this.persistenceKey, { version: 1, visibleColumns: next })
    },
    async resetColumnVisibility() {
      if (this.persistenceAdapter && this.persistenceKey) await this.persistenceAdapter.remove(this.persistenceKey)
      await this.setVisibleColumns(this.defaultVisibleColumns)
    },
    async fetchExportPage(page: number, itemsPerPage: number): Promise<NormalizedData> {
      if (this.mode === 'local')
        return processLocalData(
          this.items,
          this.normalizedColumns,
          this.internalFilters,
          this.internalSort,
          page,
          itemsPerPage,
        )
      if (!this.dataProvider) throw new Error('dataProvider is required for server exports')
      const request = { ...this.request('export'), page, itemsPerPage }
      return normalizeProviderResponse(await this.dataProvider(request), request, this.normalizeResponse)
    },
    async exportData(exporterKey: string, scope: ExportScope = 'current'): Promise<void> {
      const exporter = this.exporters.find((item) => item.key === exporterKey)
      if (!exporter) throw new Error(`Unknown exporter: ${exporterKey}`)
      if (!exporter.scopes.includes(scope)) throw new Error(`Exporter ${exporterKey} does not support ${scope}`)
      this.exporting = true
      this.exportProgress = 0
      this.$emit('export-start', { exporter: exporterKey, scope })
      try {
        await exporter.export({
          scope,
          columns: this.activeColumns,
          rows: this.displayRows,
          total: this.internalTotal,
          request: this.request('export'),
          fileName: this.exportFileName,
          reportProgress: (percent) => {
            this.exportProgress = Math.max(0, Math.min(100, percent))
          },
          fetchPage: (page, size) => this.fetchExportPage(page, size),
        })
        this.$emit('export-success', { exporter: exporterKey, scope })
      } catch (error) {
        this.$emit('export-error', { exporter: exporterKey, scope, error })
        throw error
      } finally {
        this.exporting = false
        this.exportProgress = 0
      }
    },
    getState(): DataTableState {
      return {
        page: this.internalPage,
        itemsPerPage: this.internalItemsPerPage,
        sort: this.internalSort,
        filters: { ...this.internalFilters },
        selectedKeys: [...this.internalSelectedKeys],
        visibleColumns: [...this.internalVisibleColumns],
        total: this.internalTotal,
        loading: this.isLoading,
        error: this.internalError,
      }
    },
    cellContext(context: any): CellContext {
      const value = resolveColumnValue(context.column, context.row)
      return {
        row: context.row,
        rowKey: context.rowKey,
        column: context.column,
        value,
        formattedValue: formatColumnValue(context.column, context.row),
        rowIndex: context.rowIndex,
        mobile: context.mobile,
      }
    },
    cellProps(context: any) {
      return {
        row: context.row,
        rowKeyValue: context.rowKey,
        column: context.column,
        rowIndex: context.rowIndex,
        mobile: context.mobile,
        messages: this.resolvedMessages,
        icons: this.resolvedIcons,
        disabled: this.disabled,
      }
    },
  },
})
</script>
