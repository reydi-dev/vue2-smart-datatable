<template>
  <div class="sdt-cell" :class="cellClass" :title="tooltipText" @click="emitCellClick">
    <template v-if="column.type === 'boolean'">
      <v-icon :color="value ? 'success' : 'error'" small>{{ value ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
    </template>
    <v-chip v-else-if="column.type === 'chip'" small outlined>{{ textValue }}</v-chip>
    <v-icon v-else-if="column.type === 'icon'" small>{{ textValue }}</v-icon>
    <v-avatar v-else-if="column.type === 'image' && imageUrl" size="36">
      <img :src="imageUrl" :alt="column.label" />
    </v-avatar>
    <a
      v-else-if="column.type === 'link' && linkUrl"
      class="sdt-cell__link"
      :href="linkUrl"
      target="_blank"
      rel="noopener noreferrer"
      @click.stop="emitCellClick"
      >{{ formattedText }}</a
    >
    <button
      v-else-if="column.type === 'copy'"
      type="button"
      class="sdt-cell__icon-button"
      :aria-label="messages.copy"
      @click.stop="copy"
    >
      <v-icon small>{{ icons.copy }}</v-icon>
      <span class="sdt-cell__copy-value">{{ formattedText }}</span>
    </button>
    <div v-else-if="column.type === 'expandable-text'" class="sdt-cell__expandable">
      <button
        type="button"
        class="sdt-cell__icon-button"
        :aria-label="expanded ? messages.collapse : messages.expand"
        @click.stop="expanded = !expanded"
      >
        <v-icon small>{{ expanded ? icons.collapse : icons.expand }}</v-icon>
      </button>
      <span v-if="expanded">{{ formattedText }}</span>
    </div>
    <span v-else>{{ formattedText }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { formatColumnValue, resolveCellClass, resolveColumnValue } from '../core/columns'
import { sanitizeUrl } from '../core/urls'
import type { CellContext, DataRow, DataTableColumn, DataTableIcons, DataTableMessages, RowKey } from '../types'

export default Vue.extend({
  name: 'SmartTableCell',
  props: {
    column: { type: Object as () => DataTableColumn, required: true },
    row: { type: Object as () => DataRow, required: true },
    rowKeyValue: { type: [String, Number] as unknown as () => RowKey, required: true },
    rowIndex: { type: Number, required: true },
    mobile: { type: Boolean, default: false },
    messages: { type: Object as () => DataTableMessages, required: true },
    icons: { type: Object as () => DataTableIcons, required: true },
  },
  data: () => ({ expanded: false }),
  computed: {
    value(): unknown {
      return resolveColumnValue(this.column, this.row)
    },
    formattedValue(): unknown {
      return formatColumnValue(this.column, this.row)
    },
    textValue(): string {
      return this.value === null || this.value === undefined ? '' : String(this.value)
    },
    formattedText(): string {
      return this.formattedValue === null || this.formattedValue === undefined ? '' : String(this.formattedValue)
    },
    linkUrl(): string {
      return sanitizeUrl(this.textValue, 'link')
    },
    imageUrl(): string {
      return sanitizeUrl(this.textValue, 'image')
    },
    context(): CellContext {
      return {
        row: this.row,
        rowKey: this.rowKeyValue,
        column: this.column,
        value: this.value,
        formattedValue: this.formattedValue,
        rowIndex: this.rowIndex,
        mobile: this.mobile,
      }
    },
    cellClass(): unknown {
      return resolveCellClass(this.column, this.context)
    },
    tooltipText(): string | undefined {
      const tooltip =
        typeof this.column.tooltip === 'function' ? this.column.tooltip(this.context) : this.column.tooltip
      return tooltip ? String(tooltip) : undefined
    },
  },
  methods: {
    emitCellClick(event: MouseEvent) {
      this.$emit('cell-click', { ...this.context, event })
    },
    async copy() {
      if (!this.formattedText) return
      if (typeof navigator !== 'undefined' && navigator.clipboard)
        await navigator.clipboard.writeText(this.formattedText)
      this.$emit('copied', this.formattedText)
    },
  },
})
</script>
