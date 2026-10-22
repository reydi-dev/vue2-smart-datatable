<template>
  <div
    class="sdt-mobile"
    :class="{ 'sdt-mobile--dense': dense }"
    role="list"
    :aria-label="messages.table || 'Data table'"
  >
    <article
      v-for="(row, index) in rows"
      :key="String(rowKeyOf(row))"
      role="listitem"
      class="sdt-mobile__row"
      :class="[rowClassValue(row, index), { 'sdt-row--selected': selectedKeys.includes(rowKeyOf(row)) }]"
    >
      <div
        class="sdt-mobile__summary"
        :class="{ 'sdt-mobile__summary--selectable': selectable }"
        :style="{ '--sdt-summary-count': Math.max(1, Math.min(2, summaryColumns.length)) }"
        @click="activateRow(row, index, $event)"
      >
        <slot name="mobile-summary" :row="row" :columns="summaryColumns" :row-index="index">
          <label v-if="selectable" class="sdt-selection-control" @click.stop
            ><input
              type="checkbox"
              class="sdt-checkbox"
              :checked="selectedKeys.includes(rowKeyOf(row))"
              :aria-label="`${messages.selectRow || 'Select row'} ${index + 1}`"
              :disabled="disabled"
              @click.stop
              @change="selectRow(row, $event)"
          /></label>
          <div class="sdt-mobile__summary-fields">
            <div v-for="column in summaryColumns" :key="column.key" class="sdt-mobile__summary-field">
              <small>{{ column.label }}</small>
              <slot name="cell" :row="row" :row-key="rowKeyOf(row)" :column="column" :row-index="index" :mobile="true">
                <SmartTableCell
                  :row="row"
                  :row-key-value="rowKeyOf(row)"
                  :column="column"
                  :row-index="index"
                  mobile
                  :messages="messages"
                  :icons="icons"
                  :disabled="disabled"
                  @cell-click="$emit('cell-click', $event)"
                />
              </slot>
            </div>
          </div>
        </slot>
      </div>
      <button
        v-if="rowClickable"
        type="button"
        class="sdt-mobile__open sdt-action"
        :disabled="disabled"
        :aria-label="`${messages.openRow || 'Open row'} ${index + 1}`"
        @click="activateRow(row, index, $event, true)"
      >
        {{ messages.openRow || 'Open row' }}
      </button>
      <details
        v-if="
          detailColumns.length ||
          visibleActions(row).length ||
          $scopedSlots['mobile-details'] ||
          $scopedSlots['row-actions']
        "
        class="sdt-mobile__disclosure"
      >
        <summary>
          {{ messages.moreDetails || 'More details' }}<SmartTableIcon icon="chevron-right" :size="14" />
        </summary>
        <div class="sdt-mobile__details-body">
          <slot name="mobile-details" :row="row" :columns="detailColumns" :row-index="index">
            <dl class="sdt-mobile__details">
              <div
                v-for="column in detailColumns"
                :key="column.key"
                :class="{ 'sdt-mobile__field--full': fullWidth(column, row) }"
              >
                <dt>{{ column.label }}</dt>
                <dd>
                  <slot
                    name="cell"
                    :row="row"
                    :row-key="rowKeyOf(row)"
                    :column="column"
                    :row-index="index"
                    :mobile="true"
                  >
                    <SmartTableCell
                      :row="row"
                      :row-key-value="rowKeyOf(row)"
                      :column="column"
                      :row-index="index"
                      mobile
                      :messages="messages"
                      :icons="icons"
                      :disabled="disabled"
                      @cell-click="$emit('cell-click', $event)"
                    />
                  </slot>
                </dd>
              </div>
            </dl>
          </slot>
          <slot name="row-actions" :row="row" :actions="visibleActions(row)" :disabled="disabled">
            <div v-if="visibleActions(row).length" class="sdt-mobile__actions">
              <template v-for="action in visibleActions(row)">
                <slot
                  name="action"
                  :action="action"
                  :row="row"
                  :row-key="rowKeyOf(row)"
                  :disabled="disabled || actionDisabled(action, row)"
                  :loading="actionLoading(action, row)"
                  :trigger="actionTrigger(action, row)"
                >
                  <SmartTableAction
                    :key="action.key"
                    :action="action"
                    :disabled="disabled || actionDisabled(action, row)"
                    :loading="actionLoading(action, row)"
                    @click="triggerAction(action, row, $event)"
                  />
                </slot>
              </template>
            </div>
          </slot>
        </div>
      </details>
    </article>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import SmartTableIcon from './SmartTableIcon.vue'
import SmartTableAction from './SmartTableAction.vue'
import { formatColumnValue } from '../core/columns'
import { isInteractiveTarget, inputChecked } from '../core/interactions'
import SmartTableCell from './SmartTableCell.vue'
import type { DataRow, DataTableColumn, DataTableIcons, DataTableMessages, RowAction, RowKey } from '../types'

export default Vue.extend({
  name: 'SmartTableMobile',
  components: { SmartTableCell, SmartTableIcon, SmartTableAction },
  props: {
    rows: { type: Array as () => DataRow[], required: true },
    columns: { type: Array as () => DataTableColumn[], required: true },
    rowKeyOf: { type: Function, required: true },
    selectedKeys: { type: Array as () => RowKey[], required: true },
    selectable: Boolean,
    disabled: Boolean,
    dense: Boolean,
    rowClickable: Boolean,
    rowClass: Function,
    actions: { type: Array as () => RowAction[], default: () => [] },
    summaryLimit: { type: Number, default: 3 },
    messages: { type: Object as () => DataTableMessages, required: true },
    icons: { type: Object as () => DataTableIcons, required: true },
  },
  computed: {
    summaryColumns(): DataTableColumn[] {
      const explicit = this.columns
        .filter((column) => column.mobile?.summary)
        .sort((a, b) => (a.mobile?.order || 0) - (b.mobile?.order || 0))
      return (explicit.length ? explicit : this.columns).slice(0, this.summaryLimit)
    },
    detailColumns(): DataTableColumn[] {
      return this.columns.filter((column) => !this.summaryColumns.includes(column))
    },
  },
  methods: {
    selectRow(row: DataRow, event: Event) {
      if (!this.disabled) this.$emit('select-row', { row, selected: inputChecked(event) })
    },
    activateRow(row: DataRow, index: number, event: Event, explicit = false) {
      if (!this.disabled && this.rowClickable && (explicit || !isInteractiveTarget(event)))
        this.$emit('row-click', { row, rowKey: this.rowKeyOf(row), index, event })
    },
    rowClassValue(row: DataRow, index: number): unknown {
      return this.rowClass ? this.rowClass({ row, rowKey: this.rowKeyOf(row), index }) : null
    },
    fullWidth(column: DataTableColumn, row: DataRow): boolean {
      return (
        column.type === 'expandable-text' ||
        column.compact === false ||
        (!column.compact &&
          (column.type === 'copy' ||
            column.type === 'link' ||
            String(formatColumnValue(column, row) ?? '').length > 80))
      )
    },
    visibleActions(row: DataRow): RowAction[] {
      return this.actions.filter((action) =>
        typeof action.visible === 'function' ? action.visible(row) : action.visible !== false,
      )
    },
    actionDisabled(action: RowAction, row: DataRow): boolean {
      return typeof action.disabled === 'function' ? action.disabled(row) : Boolean(action.disabled)
    },
    actionLoading(action: RowAction, row: DataRow): boolean {
      return typeof action.loading === 'function' ? action.loading(row) : Boolean(action.loading)
    },
    actionTrigger(action: RowAction, row: DataRow): (event: Event) => void {
      return (event: Event) => this.triggerAction(action, row, event)
    },
    triggerAction(action: RowAction, row: DataRow, event: Event) {
      if (this.disabled || this.actionDisabled(action, row) || this.actionLoading(action, row)) return
      this.$emit('row-action', { action, row, rowKey: this.rowKeyOf(row), event })
    },
  },
})
</script>
