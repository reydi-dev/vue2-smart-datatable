<template>
  <v-dialog :value="value" max-width="480" @input="$emit('input', $event)">
    <v-card
      ><v-card-title>{{ messages.columns }}</v-card-title>
      <v-card-text
        ><v-checkbox
          v-for="column in hideableColumns"
          :key="column.key"
          :input-value="draft.includes(column.key)"
          :label="column.label"
          hide-details
          @change="toggle(column.key, Boolean($event))"
      /></v-card-text>
      <v-card-actions
        ><v-btn text @click="$emit('reset')">{{ messages.reset }}</v-btn
        ><v-spacer /><v-btn color="primary" text @click="apply">{{ messages.apply }}</v-btn></v-card-actions
      >
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue'
import type { DataTableColumn, DataTableMessages } from '../types'
export default Vue.extend({
  name: 'ColumnVisibilityDialog',
  props: {
    value: Boolean,
    columns: { type: Array as () => DataTableColumn[], required: true },
    visibleColumns: { type: Array as () => string[], required: true },
    messages: { type: Object as () => DataTableMessages, required: true },
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
    value(open: boolean) {
      if (open) this.draft = [...this.visibleColumns]
    },
  },
  methods: {
    toggle(key: string, selected: boolean) {
      this.draft = selected ? [...new Set([...this.draft, key])] : this.draft.filter((item) => item !== key)
    },
    apply() {
      const fixed = this.columns.filter((column) => column.hideable === false).map((column) => column.key)
      this.$emit('apply', [...new Set([...fixed, ...this.draft])])
      this.$emit('input', false)
    },
  },
})
</script>
