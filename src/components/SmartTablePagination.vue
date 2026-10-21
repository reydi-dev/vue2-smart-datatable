<template>
  <div class="sdt-pagination">
    <label class="sdt-pagination__size">
      {{ labels.rowsPerPage }}
      <select :value="itemsPerPage" :disabled="disabled" @change="onPageSizeChange">
        <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
      </select>
    </label>
    <span class="sdt-pagination__count" aria-live="polite"
      >{{ firstItem }}–{{ lastItem }} {{ labels.of }} {{ total }}</span
    >
    <div class="sdt-pagination__navigation">
      <button
        type="button"
        class="sdt-pagination__button sdt-pagination__arrow"
        :disabled="navigationDisabled || currentPage <= 1"
        :aria-label="labels.previousPage"
        @click="navigate(currentPage - 1)"
      >
        <v-icon aria-hidden="true">{{ previousIcon }}</v-icon>
      </button>
      <span class="sdt-pagination__page">{{ currentPage }} {{ labels.of }} {{ pageCount }}</span>
      <button
        type="button"
        class="sdt-pagination__button sdt-pagination__arrow"
        :disabled="navigationDisabled || currentPage >= pageCount"
        :aria-label="labels.nextPage"
        @click="navigate(currentPage + 1)"
      >
        <v-icon aria-hidden="true">{{ nextIcon }}</v-icon>
      </button>
    </div>
    <form class="sdt-pagination__jump" novalidate @submit.prevent="submitPage">
      <label>
        {{ labels.goToPage }}
        <input
          v-model="draft"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          :disabled="navigationDisabled"
          :aria-invalid="invalid ? 'true' : undefined"
          :aria-describedby="invalid ? errorId : undefined"
          @input="invalid = false"
        />
      </label>
      <button type="submit" class="sdt-pagination__button" :disabled="navigationDisabled">{{ labels.go }}</button>
      <span v-if="invalid" :id="errorId" class="sdt-pagination__error" role="alert"
        >{{ labels.invalidPage }} 1–{{ pageCount }}</span
      >
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { defaultMessages } from '../core/messages'
import { parsePageInput } from '../core/pagination'
import type { DataTableMessages } from '../types'

let paginationId = 0

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
    disabled: Boolean,
  },
  data() {
    return { draft: String(this.page), invalid: false, errorId: `sdt-page-error-${++paginationId}` }
  },
  computed: {
    labels() {
      return { ...defaultMessages, ...this.messages }
    },
    pageCount(): number {
      return Math.max(1, Math.ceil(this.total / this.itemsPerPage))
    },
    currentPage(): number {
      return Math.min(Math.max(1, this.page), this.pageCount)
    },
    navigationDisabled(): boolean {
      return this.disabled || this.total === 0
    },
    firstItem(): number {
      return this.total === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1
    },
    lastItem(): number {
      return Math.min(this.total, this.currentPage * this.itemsPerPage)
    },
  },
  watch: {
    currentPage: {
      immediate: true,
      handler() {
        this.resetDraft()
      },
    },
    pageCount() {
      this.resetDraft()
    },
    itemsPerPage() {
      this.resetDraft()
    },
  },
  methods: {
    onPageSizeChange(event: Event) {
      const target = event.target
      if (target && 'value' in target) this.setPageSize(String(target.value))
    },
    resetDraft() {
      this.draft = String(this.currentPage)
      this.invalid = false
    },
    navigate(page: number) {
      if (this.navigationDisabled || page === this.currentPage || page < 1 || page > this.pageCount) return
      this.$emit('update:page', page)
    },
    submitPage() {
      if (this.navigationDisabled) return
      const target = parsePageInput(this.draft, this.pageCount)
      this.invalid = target === null
      if (target === null) return
      this.draft = String(target)
      this.navigate(target)
    },
    setPageSize(value: string) {
      const size = Number(value)
      if (this.disabled || size === this.itemsPerPage || !this.pageSizeOptions.includes(size) || size <= 0) return
      this.$emit('update:items-per-page', size)
    },
  },
})
</script>
