<template>
  <div class="sdt-pagination">
    <label class="sdt-pagination__size"
      >{{ messages.rowsPerPage }}
      <v-select
        dense
        outlined
        hide-details
        :items="pageSizeOptions"
        :value="itemsPerPage"
        @change="$emit('update:items-per-page', Number($event))"
      />
    </label>
    <span class="sdt-pagination__count" aria-live="polite"
      >{{ firstItem }}–{{ lastItem }} {{ messages.of }} {{ total }}</span
    >
    <v-btn icon :disabled="page <= 1" :aria-label="'Previous page'" @click="$emit('update:page', page - 1)"
      ><v-icon>{{ previousIcon }}</v-icon></v-btn
    >
    <v-btn icon :disabled="page >= pageCount" :aria-label="'Next page'" @click="$emit('update:page', page + 1)"
      ><v-icon>{{ nextIcon }}</v-icon></v-btn
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { DataTableMessages } from '../types'
export default Vue.extend({
  name: 'SmartTablePagination',
  props: {
    page: { type: Number, required: true },
    itemsPerPage: { type: Number, required: true },
    total: { type: Number, required: true },
    pageSizeOptions: { type: Array as () => number[], required: true },
    messages: { type: Object as () => DataTableMessages, required: true },
    previousIcon: String,
    nextIcon: String,
  },
  computed: {
    pageCount(): number {
      return Math.max(1, Math.ceil(this.total / this.itemsPerPage))
    },
    firstItem(): number {
      return this.total === 0 ? 0 : Math.min(this.total, (this.page - 1) * this.itemsPerPage + 1)
    },
    lastItem(): number {
      return Math.min(this.total, this.page * this.itemsPerPage)
    },
  },
})
</script>
