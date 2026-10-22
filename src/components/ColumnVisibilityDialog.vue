<template>
  <dialog
    ref="dialog"
    class="sdt-dialog"
    :aria-label="messages.columns"
    @keydown.tab="trapFocus"
    @cancel="close"
    @close="closed"
    @click="backdrop"
  >
    <div class="sdt-dialog__body">
      <header>
        <h2>{{ messages.columns }}</h2>
        <button type="button" class="sdt-control" @click="close">{{ messages.close || 'Close' }}</button>
      </header>
      <div class="sdt-dialog__columns">
        <label v-for="column in hideableColumns" :key="column.key" class="sdt-choice">
          <input
            type="checkbox"
            class="sdt-checkbox"
            :checked="draft.includes(column.key)"
            :disabled="disabled"
            @change="change(column.key, $event)"
          />{{ column.label }}
        </label>
      </div>
      <footer>
        <button type="button" class="sdt-control" :disabled="disabled" @click="!disabled && $emit('reset')">
          {{ messages.reset }}</button
        ><button type="button" class="sdt-control sdt-control--primary" :disabled="disabled" @click="apply">
          {{ messages.apply }}
        </button>
      </footer>
    </div>
  </dialog>
</template>
<script lang="ts">
import Vue from 'vue'
import { inputChecked } from '../core/interactions'
import type { DataTableColumn, DataTableMessages } from '../types'
export default Vue.extend({
  name: 'ColumnVisibilityDialog',
  props: {
    value: Boolean,
    columns: { type: Array as () => DataTableColumn[], required: true },
    visibleColumns: { type: Array as () => string[], required: true },
    messages: { type: Object as () => DataTableMessages, required: true },
    disabled: Boolean,
  },
  data() {
    return { draft: [...this.visibleColumns] as string[] }
  },
  computed: {
    hideableColumns(): DataTableColumn[] {
      return this.columns.filter((column) => column.hideable !== false)
    },
  },
  watch: {
    visibleColumns(value: string[]) {
      this.draft = [...value]
    },
    value() {
      this.syncDialog()
    },
  },
  mounted() {
    this.syncDialog()
  },
  beforeDestroy() {
    const dialog = this.$refs.dialog as HTMLDialogElement
    if (dialog?.open && dialog.close) dialog.close()
  },
  methods: {
    change(key: string, event: Event) {
      this.toggle(key, inputChecked(event))
    },
    trapFocus(event: KeyboardEvent) {
      const dialog = this.$refs.dialog as HTMLDialogElement
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)'))
      const first = controls[0],
        last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    },
    syncDialog() {
      const dialog = this.$refs.dialog as HTMLDialogElement
      if (!dialog) return
      if (this.value) {
        this.draft = [...this.visibleColumns]
        if (!dialog.open) {
          if (dialog.showModal) dialog.showModal()
          else dialog.setAttribute('open', '')
        }
      } else if (dialog.open) {
        if (dialog.close) dialog.close()
        else dialog.removeAttribute('open')
      }
    },
    close() {
      this.$emit('input', false)
    },
    closed() {
      if (this.value) this.close()
    },
    backdrop(event: MouseEvent) {
      if (event.target === this.$refs.dialog) this.close()
    },
    toggle(key: string, selected: boolean) {
      if (this.disabled) return
      this.draft = selected ? [...new Set([...this.draft, key])] : this.draft.filter((item) => item !== key)
    },
    apply() {
      if (this.disabled) return
      const fixed = this.columns.filter((column) => column.hideable === false).map((column) => column.key)
      this.$emit('apply', [...new Set([...fixed, ...this.draft])])
      this.close()
    },
  },
})
</script>
