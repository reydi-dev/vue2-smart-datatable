<template>
  <v-simple-table class="sdt-desktop" :dense="dense" :fixed-header="fixedHeader" :height="height">
    <template #default>
      <thead>
        <tr>
          <th v-if="selectable" scope="col" class="sdt-column--selection">
            <v-checkbox
              :input-value="allPageSelected"
              :indeterminate="somePageSelected"
              :aria-label="messages.selectAll"
              :disabled="disabled"
              hide-details
              dense
              @change="$emit('select-page', Boolean($event))"
            />
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
            :class="[column.headerClass, `text-${column.align || 'start'}`]"
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
          <th v-if="actions.length" scope="col" class="text-center">{{ messages.actions }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="String(rowKeyOf(row))"
          :class="rowClassValue(row, index)"
          :tabindex="rowClickable ? 0 : undefined"
          @click="!disabled && $emit('row-click', { row, rowKey: rowKeyOf(row), index, event: $event })"
          @keydown.enter.self="!disabled && $emit('row-click', { row, rowKey: rowKeyOf(row), index, event: $event })"
          @keydown.space.self.prevent="
            !disabled && $emit('row-click', { row, rowKey: rowKeyOf(row), index, event: $event })
          "
        >
          <td v-if="selectable" class="sdt-column--selection" @click.stop>
            <v-checkbox
              :input-value="selectedKeys.includes(rowKeyOf(row))"
              :aria-label="`${messages.selectRow || 'Select row'} ${index + 1}`"
              :disabled="disabled"
              hide-details
              dense
              @change="$emit('select-row', { row, selected: Boolean($event) })"
            />
          </td>
          <td
            v-for="column in columns"
            :key="column.key"
            :class="`text-${column.align || 'start'}`"
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
          <td v-if="actions.length" class="text-center" @click.stop>
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
                  <v-btn
                    :key="action.key"
                    small
                    text
                    :color="action.color"
                    :disabled="disabled || actionDisabled(action, row)"
                    :loading="actionLoading(action, row)"
                    @click="triggerAction(action, row, $event)"
                    ><SmartTableIcon v-if="action.icon" :icon="action.icon" :size="16" leading />{{
                      action.label
                    }}</v-btn
                  >
                </slot>
              </template>
            </slot>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from 'vue'
import SmartTableIcon from './SmartTableIcon.vue'
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
  components: { SmartTableCell, SmartTableIcon },
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
      if (this.disabled) return
      this.$emit('row-action', { action, row, rowKey: this.rowKeyOf(row), event })
    },
    rowClassValue(row: DataRow, index: number): unknown {
      return this.rowClass ? this.rowClass({ row, rowKey: this.rowKeyOf(row), index }) : null
    },
  },
})
</script>
