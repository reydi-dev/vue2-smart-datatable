<template>
  <v-expansion-panels class="sdt-mobile" multiple flat>
    <v-expansion-panel v-for="(row, index) in rows" :key="String(rowKeyOf(row))">
      <v-expansion-panel-header
        @click.native="!disabled && $emit('row-click', { row, rowKey: rowKeyOf(row), index, event: $event })"
      >
        <slot name="mobile-summary" :row="row" :columns="summaryColumns" :row-index="index">
          <div
            class="sdt-mobile__summary"
            :class="{ 'sdt-mobile__summary--selectable': selectable }"
            :style="{ '--sdt-summary-count': summaryColumns.length }"
          >
            <v-checkbox
              v-if="selectable"
              :input-value="selectedKeys.includes(rowKeyOf(row))"
              :aria-label="`${messages.selectRow || 'Select row'} ${index + 1}`"
              :disabled="disabled"
              hide-details
              dense
              @click.native.stop
              @change="$emit('select-row', { row, selected: Boolean($event) })"
            />
            <div v-for="column in summaryColumns" :key="column.key">
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
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <slot name="mobile-details" :row="row" :columns="detailColumns" :row-index="index">
          <dl class="sdt-mobile__details">
            <template v-for="column in detailColumns">
              <dt :key="`${column.key}-label`">{{ column.label }}</dt>
              <dd :key="column.key">
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
            </template>
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
                <v-btn
                  :key="action.key"
                  small
                  text
                  :color="action.color"
                  :disabled="disabled || actionDisabled(action, row)"
                  :loading="actionLoading(action, row)"
                  @click="triggerAction(action, row, $event)"
                >
                  <v-icon v-if="action.icon" left small>{{ action.icon }}</v-icon
                  >{{ action.label }}
                </v-btn>
              </slot>
            </template>
          </div>
        </slot>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from 'vue'
import SmartTableCell from './SmartTableCell.vue'
import type { DataRow, DataTableColumn, DataTableIcons, DataTableMessages, RowAction, RowKey } from '../types'

export default Vue.extend({
  name: 'SmartTableMobile',
  components: { SmartTableCell },
  props: {
    rows: { type: Array as () => DataRow[], required: true },
    columns: { type: Array as () => DataTableColumn[], required: true },
    rowKeyOf: { type: Function, required: true },
    selectedKeys: { type: Array as () => RowKey[], required: true },
    selectable: Boolean,
    disabled: Boolean,
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
  },
})
</script>
