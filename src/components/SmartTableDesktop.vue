<template>
  <div
    class="sdt-desktop"
    :class="{ 'sdt-desktop--dense': dense, 'sdt-desktop--fixed-header': fixedHeader }"
    :style="viewportStyle"
    tabindex="0"
    role="region"
    :aria-label="messages.table || 'Data table'"
  >
    <table class="sdt-desktop__table">
      <thead>
        <tr>
          <th v-if="selectable" scope="col" class="sdt-column--selection">
            <label class="sdt-selection-control"
              ><input
                type="checkbox"
                class="sdt-checkbox"
                :checked="allPageSelected"
                :indeterminate.prop="somePageSelected"
                :aria-label="messages.selectAll"
                :disabled="disabled"
                @change="selectPage($event)"
            /></label>
          </th>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            :aria-sort="
              sort && sort.columnKey === column.key
                ? sort.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : undefined
            "
            :class="[column.headerClass, `sdt-align--${column.align || 'start'}`]"
            :style="columnStyle(column)"
          >
            <slot name="header" :column="column">
              <button
                v-if="column.sortable"
                type="button"
                class="sdt-sort-button"
                :disabled="disabled"
                @click="!disabled && $emit('sort', column)"
              >
                {{ column.label }}
                <SmartTableIcon
                  v-if="sort && sort.columnKey === column.key"
                  :icon="sort.direction === 'asc' ? icons.sortAsc : icons.sortDesc"
                  :size="14"
                />
              </button>
              <span v-else>{{ column.label }}</span>
            </slot>
          </th>
          <th v-if="actions.length" scope="col" class="sdt-align--center">{{ messages.actions }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="String(rowKeyOf(row))"
          :class="[
            rowClassValue(row, index),
            {
              'sdt-row--selected': selectedKeys.includes(rowKeyOf(row)),
              'sdt-row--clickable': rowClickable && !disabled,
            },
          ]"
          :tabindex="rowClickable && !disabled ? 0 : undefined"
          @click="activateRow(row, index, $event)"
          @keydown.enter.self="
            rowClickable && !disabled && $emit('row-click', { row, rowKey: rowKeyOf(row), index, event: $event })
          "
          @keydown.space.self.prevent="
            rowClickable && !disabled && $emit('row-click', { row, rowKey: rowKeyOf(row), index, event: $event })
          "
        >
          <td v-if="selectable" class="sdt-column--selection" @click.stop>
            <label class="sdt-selection-control"
              ><input
                type="checkbox"
                class="sdt-checkbox"
                :checked="selectedKeys.includes(rowKeyOf(row))"
                :aria-label="`${messages.selectRow || 'Select row'} ${index + 1}`"
                :disabled="disabled"
                @change="selectRow(row, $event)"
            /></label>
          </td>
          <td
            v-for="column in columns"
            :key="column.key"
            :class="`sdt-align--${column.align || 'start'}`"
            :style="columnStyle(column)"
          >
            <slot name="cell" :row="row" :row-key="rowKeyOf(row)" :column="column" :row-index="index" :mobile="false">
              <SmartTableCell
                :row="row"
                :row-key-value="rowKeyOf(row)"
                :column="column"
                :row-index="index"
                :messages="messages"
                :icons="icons"
                :disabled="disabled"
                @cell-click="$emit('cell-click', $event)"
              />
            </slot>
          </td>
          <td v-if="actions.length" class="sdt-align--center" @click.stop>
            <slot name="row-actions" :row="row" :actions="visibleActions(row)" :disabled="disabled">
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
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SmartTableIcon from './SmartTableIcon.vue'
import SmartTableAction from './SmartTableAction.vue'
import { isInteractiveTarget, inputChecked } from '../core/interactions'
import SmartTableCell from './SmartTableCell.vue'
import type {
  DataRow,
  DataTableColumn,
  DataTableIcons,
  DataTableMessages,
  RowAction,
  RowKey,
  SortState,
} from '../types'

export default Vue.extend({
  name: 'SmartTableDesktop',
  components: { SmartTableCell, SmartTableIcon, SmartTableAction },
  props: {
    rows: { type: Array as () => DataRow[], required: true },
    columns: { type: Array as () => DataTableColumn[], required: true },
    rowKeyOf: { type: Function, required: true },
    selectedKeys: { type: Array as () => RowKey[], required: true },
    selectable: Boolean,
    disabled: Boolean,
    rowClickable: Boolean,
    actions: { type: Array as () => RowAction[], default: () => [] },
    sort: { type: Object as () => SortState | null },
    dense: Boolean,
    fixedHeader: Boolean,
    height: [String, Number],
    messages: { type: Object as () => DataTableMessages, required: true },
    icons: { type: Object as () => DataTableIcons, required: true },
    rowClass: Function,
  },
  computed: {
    viewportStyle(): { height: string | undefined } {
      return { height: typeof this.height === 'number' ? `${this.height}px` : this.height }
    },
    pageKeys(): RowKey[] {
      return this.rows.map((row) => this.rowKeyOf(row))
    },
    allPageSelected(): boolean {
      return this.pageKeys.length > 0 && this.pageKeys.every((key) => this.selectedKeys.includes(key))
    },
    somePageSelected(): boolean {
      return !this.allPageSelected && this.pageKeys.some((key) => this.selectedKeys.includes(key))
    },
  },
  methods: {
    selectPage(event: Event) {
      if (!this.disabled) this.$emit('select-page', inputChecked(event))
    },
    selectRow(row: DataRow, event: Event) {
      if (!this.disabled) this.$emit('select-row', { row, selected: inputChecked(event) })
    },
    activateRow(row: DataRow, index: number, event: MouseEvent) {
      if (!this.disabled && this.rowClickable && !isInteractiveTarget(event))
        this.$emit('row-click', { row, rowKey: this.rowKeyOf(row), index, event })
    },
    columnStyle(column: DataTableColumn) {
      return {
        width: typeof column.width === 'number' ? `${column.width}px` : column.width,
        minWidth: typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth,
      }
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
    rowClassValue(row: DataRow, index: number): unknown {
      return this.rowClass ? this.rowClass({ row, rowKey: this.rowKeyOf(row), index }) : null
    },
  },
})
</script>
