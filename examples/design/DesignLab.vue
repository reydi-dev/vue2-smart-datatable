<template>
  <div class="lab-preview-shell">
    <div class="lab-preview-controls" :dir="locale === 'fa' ? 'rtl' : 'ltr'" :aria-label="t.previewWidth">
      <span>{{ t.previewWidth }}</span>
      <button type="button" :aria-pressed="!mobilePreview" @click="mobilePreview = false">{{ t.desktop }}</button>
      <button type="button" :aria-pressed="mobilePreview" @click="mobilePreview = true">{{ t.mobile }}</button>
    </div>
    <div class="lab-viewport" :class="{ 'lab-viewport--mobile': mobilePreview }">
      <main class="lab" :class="`lab--${direction}`" :dir="locale === 'fa' ? 'rtl' : 'ltr'" :lang="locale">
        <header class="lab-header">
          <a class="lab-brand" href="./index.html"
            ><span class="lab-logo"><LabIcon name="grid" /></span>smart<span class="lab-brand-light">/</span>table</a
          >
          <span class="lab-header-label">{{ t.lab }} <span class="lab-dot">/</span> {{ t.prototype }}</span>
          <label class="lab-language"
            ><span class="sr-only">{{ t.language }}</span
            ><select v-model="locale">
              <option value="en">English</option>
              <option value="fa">فارسی / RTL</option>
            </select></label
          >
        </header>

        <section class="lab-intro">
          <p class="lab-eyebrow">{{ t.eyebrow }}</p>
          <h1>{{ t.title }}</h1>
          <p class="lab-intro-copy">{{ t.intro }}</p>
        </section>

        <section class="lab-directions" :aria-label="t.compare">
          <button
            v-for="variant in variants"
            :key="variant.key"
            type="button"
            class="lab-direction"
            :aria-pressed="direction === variant.key"
            @click="direction = variant.key"
          >
            <span class="lab-swatch" :class="`lab-swatch--${variant.key}`"><i /><i /><i /></span>
            <span
              ><strong>{{ variant.key === 'clarity' ? t.directionA : t.directionB }}</strong
              ><small>{{ variant.key === 'clarity' ? t.descriptionA : t.descriptionB }}</small></span
            >
            <span class="lab-radio"><LabIcon v-if="direction === variant.key" name="check" /></span>
          </button>
        </section>

        <section class="lab-workspace" :aria-label="t.orders">
          <header class="lab-table-title">
            <div>
              <div class="lab-title-line">
                <h2>{{ t.orders }}</h2>
                <span class="lab-count">{{ number(orders.length) }}</span>
              </div>
              <p>{{ t.subtitle }}</p>
            </div>
            <span class="lab-live"><i />{{ t.prototype }}</span>
          </header>
          <div class="lab-tabs" :aria-label="t.status">
            <button
              v-for="tab in tabs"
              :key="tab"
              type="button"
              :aria-pressed="status === tab"
              :class="{ active: status === tab }"
              @click="setStatus(tab)"
            >
              {{ tab === 'all' ? t.all : t[tab]
              }}<span>{{
                number(tab === 'all' ? orders.length : orders.filter((row) => row.status === tab).length)
              }}</span>
            </button>
          </div>
          <div class="lab-toolbar">
            <label class="lab-search"
              ><LabIcon name="search" /><span class="sr-only">{{ t.searchLabel }}</span
              ><input v-model="query" type="search" :placeholder="t.search" @input="page = 1"
            /></label>
            <div class="lab-tools">
              <button
                type="button"
                class="lab-button"
                :aria-expanded="filtersOpen"
                aria-controls="lab-filters"
                @click="filtersOpen = !filtersOpen"
              >
                <LabIcon name="filter" />{{ t.filters }}<span v-if="minAmount" class="lab-mini-count">1</span>
              </button>
              <details class="lab-column-menu">
                <summary class="lab-button"><LabIcon name="columns" />{{ t.columns }}</summary>
                <fieldset>
                  <legend>{{ t.columns }}</legend>
                  <label v-for="column in optionalColumns" :key="column"
                    ><input v-model="visibleColumns" type="checkbox" :value="column" :aria-label="t[column]" />{{
                      t[column]
                    }}</label
                  >
                </fieldset>
              </details>
              <button
                type="button"
                class="lab-button lab-button--primary"
                :disabled="!exportRows.length || state !== 'ready'"
                @click="download"
              >
                <LabIcon name="download" />{{ t.export }}
              </button>
            </div>
          </div>
          <div v-if="filtersOpen" id="lab-filters" class="lab-filter-panel">
            <label>{{ t.min }}<input v-model.number="minAmount" type="number" min="0" @input="page = 1" /></label
            ><label
              >{{ t.exportScope
              }}<select v-model="exportScope">
                <option value="results">{{ t.results }}</option>
                <option value="selected">{{ t.selectedScope }}</option>
              </select></label
            ><button type="button" class="lab-text-button" @click="clearFilters">{{ t.clearFilters }}</button>
          </div>
          <div v-if="query || status !== 'all' || minAmount" class="lab-active-filters">
            <button
              v-if="query"
              type="button"
              @click="
                query = ''
                page = 1
              "
            >
              {{ t.searchLabel }}: {{ query }} <LabIcon name="close" />
            </button>
            <button v-if="status !== 'all'" type="button" @click="setStatus('all')">
              {{ t[status] }} <LabIcon name="close" />
            </button>
            <button
              v-if="minAmount"
              type="button"
              @click="
                minAmount = ''
                page = 1
              "
            >
              {{ t.amount }} ≥ {{ money(Number(minAmount)) }} <LabIcon name="close" />
            </button>
            <button type="button" class="lab-clear" @click="clearFilters">{{ t.clearFilters }}</button>
          </div>
          <div v-if="selected.length" class="lab-selection" role="status">
            <span><LabIcon name="check" />{{ number(selected.length) }} {{ t.selected }}</span
            ><button type="button" @click="selected = []">{{ t.clearSelection }}</button>
          </div>

          <div v-if="state !== 'ready' || !filteredRows.length" class="lab-state" :aria-busy="state === 'loading'">
            <div class="lab-state-icon" :class="{ 'lab-spin': state === 'loading' }">
              <LabIcon :name="state === 'error' || state === 'loading' ? 'retry' : 'box'" />
            </div>
            <h3>
              {{
                state === 'loading'
                  ? t.loadingTitle
                  : state === 'error'
                    ? t.errorTitle
                    : state === 'empty'
                      ? t.emptyTitle
                      : t.noResults
              }}
            </h3>
            <p>
              {{
                state === 'loading'
                  ? t.loadingText
                  : state === 'error'
                    ? t.errorText
                    : state === 'empty'
                      ? t.emptyText
                      : t.noResultsText
              }}
            </p>
            <button v-if="state === 'error'" type="button" class="lab-button" @click="state = 'ready'">
              {{ t.retry }}
            </button>
            <button v-if="state === 'ready'" type="button" class="lab-button" @click="clearFilters">
              {{ t.clearFilters }}
            </button>
          </div>
          <template v-else>
            <div class="lab-table-scroll">
              <table class="lab-table">
                <caption class="sr-only">
                  {{
                    t.orders
                  }}
                </caption>
                <thead>
                  <tr>
                    <th class="lab-checkbox-cell">
                      <input
                        type="checkbox"
                        :checked="allPageSelected"
                        :indeterminate.prop="somePageSelected"
                        :aria-label="t.selectPage"
                        @change="togglePage"
                      />
                    </th>
                    <th :aria-sort="sortKey === 'id' ? (ascending ? 'ascending' : 'descending') : 'none'">
                      <button type="button" @click="sortBy('id')">{{ t.id }}<LabIcon name="sort" /></button>
                    </th>
                    <th :aria-sort="sortKey === 'customer' ? (ascending ? 'ascending' : 'descending') : 'none'">
                      <button type="button" @click="sortBy('customer')">{{ t.customer }}<LabIcon name="sort" /></button>
                    </th>
                    <th v-if="visibleColumns.includes('status')">{{ t.status }}</th>
                    <th
                      v-if="visibleColumns.includes('amount')"
                      :aria-sort="sortKey === 'amount' ? (ascending ? 'ascending' : 'descending') : 'none'"
                    >
                      <button type="button" @click="sortBy('amount')">{{ t.amount }}<LabIcon name="sort" /></button>
                    </th>
                    <th v-if="visibleColumns.includes('date')">{{ t.date }}</th>
                    <th v-for="column in detailColumns" :key="column">{{ t[column] }}</th>
                    <th>
                      <span class="sr-only">{{ t.details }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in pageRows"
                    :key="row.id"
                    :class="{ 'is-selected': selected.includes(row.id) }"
                  >
                    <td class="lab-checkbox-cell">
                      <input
                        v-model="selected"
                        type="checkbox"
                        :value="row.id"
                        :aria-label="`${t.selectRow} ${row.id}`"
                      />
                    </td>
                    <td>
                      <button type="button" class="lab-order-id" @click="inspect(row)">
                        <bdi>#{{ row.id }}</bdi>
                      </button>
                    </td>
                    <td>
                      <div class="lab-person">
                        <span class="lab-avatar" :class="`lab-avatar--${index % 4}`">{{ row.initials }}</span
                        ><span
                          ><strong>{{ row.customer }}</strong
                          ><small
                            ><bdi>{{ row.email }}</bdi></small
                          ></span
                        >
                      </div>
                    </td>
                    <td v-if="visibleColumns.includes('status')">
                      <span class="lab-badge" :class="`lab-badge--${row.status}`"><i />{{ t[row.status] }}</span>
                    </td>
                    <td v-if="visibleColumns.includes('amount')" class="lab-money">{{ money(row.amount) }}</td>
                    <td v-if="visibleColumns.includes('date')" class="lab-date">{{ date(row.date) }}</td>
                    <td
                      v-for="column in detailColumns"
                      :key="column"
                      :class="{ 'lab-description-cell': column === 'description' }"
                    >
                      <details
                        v-if="column === 'description' && row.description[locale]"
                        class="lab-desktop-description"
                      >
                        <summary>{{ row.description[locale] }}</summary>
                        <p>{{ row.description[locale] }}</p>
                      </details>
                      <span v-else :class="{ 'lab-priority': column === 'priority' && row.priority }">{{
                        extra(row, column)
                      }}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        class="lab-icon-button"
                        :aria-label="`${t.details} ${row.id}`"
                        @click="inspect(row)"
                      >
                        <LabIcon name="arrow" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="lab-mobile-list">
              <article v-for="row in pageRows" :key="row.id" :class="{ 'is-selected': selected.includes(row.id) }">
                <div class="lab-mobile-top">
                  <input
                    v-model="selected"
                    type="checkbox"
                    :value="row.id"
                    :aria-label="`${t.selectRow} ${row.id}`"
                  /><button type="button" class="lab-order-id" @click="inspect(row)">
                    <bdi>#{{ row.id }}</bdi></button
                  ><span v-if="visibleColumns.includes('status')" class="lab-badge" :class="`lab-badge--${row.status}`"
                    ><i />{{ t[row.status] }}</span
                  >
                </div>
                <div class="lab-mobile-bottom">
                  <div>
                    <strong>{{ row.customer }}</strong
                    ><small v-if="visibleColumns.includes('date')">{{ date(row.date) }}</small>
                  </div>
                  <strong v-if="visibleColumns.includes('amount')">{{ money(row.amount) }}</strong
                  ><button
                    type="button"
                    class="lab-icon-button"
                    :aria-label="`${t.details} ${row.id}`"
                    @click="inspect(row)"
                  >
                    <LabIcon name="arrow" />
                  </button>
                </div>
                <details class="lab-mobile-details">
                  <summary>{{ t.moreDetails }}<LabIcon name="arrow" /></summary>
                  <dl>
                    <div>
                      <dt>{{ t.email }}</dt>
                      <dd>
                        <bdi>{{ row.email }}</bdi>
                      </dd>
                    </div>
                    <div
                      v-for="column in detailColumns"
                      :key="column"
                      :class="{ 'lab-field--description': column === 'description' }"
                    >
                      <dt>{{ t[column] }}</dt>
                      <dd :class="{ 'lab-priority': column === 'priority' && row.priority }">
                        {{ extra(row, column) }}
                      </dd>
                    </div>
                  </dl>
                </details>
              </article>
            </div>
          </template>
          <footer class="lab-pagination">
            <label
              >{{ t.perPage
              }}<select v-model.number="pageSize" @change="page = 1">
                <option :value="8">{{ number(8) }}</option>
                <option :value="16">{{ number(16) }}</option>
              </select></label
            ><span aria-live="polite"
              >{{ number(resultCount ? (currentPage - 1) * pageSize + 1 : 0) }}–{{
                number(Math.min(currentPage * pageSize, resultCount))
              }}
              {{ t.of }} {{ number(resultCount) }}</span
            >
            <div>
              <button
                type="button"
                class="lab-icon-button lab-previous"
                :aria-label="t.previous"
                :disabled="currentPage <= 1 || state !== 'ready'"
                @click="page = currentPage - 1"
              >
                <LabIcon name="arrow" /></button
              ><span class="lab-page-number">{{ number(currentPage) }} {{ t.of }} {{ number(pageCount) }}</span
              ><button
                type="button"
                class="lab-icon-button"
                :aria-label="t.next"
                :disabled="currentPage >= pageCount || state !== 'ready'"
                @click="page = currentPage + 1"
              >
                <LabIcon name="arrow" />
              </button>
            </div>
            <form class="lab-page-jump" @submit.prevent="jumpToPage">
              <label for="lab-page-target">{{ t.goToPage }}</label>
              <input
                id="lab-page-target"
                v-model="pageDraft"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                :aria-invalid="jumpError ? 'true' : undefined"
                :aria-describedby="jumpError ? 'lab-page-error' : undefined"
                :disabled="state !== 'ready' || !resultCount"
                @input="jumpError = false"
              />
              <button type="submit" class="lab-button" :disabled="state !== 'ready' || !resultCount">{{ t.go }}</button>
            </form>
            <span v-if="jumpError" id="lab-page-error" class="lab-page-error" role="alert">
              {{ t.pageRange }} {{ number(1) }} {{ t.to }} {{ number(pageCount) }}.
            </span>
          </footer>
        </section>

        <section v-if="inspected" ref="orderDetail" class="lab-detail" tabindex="-1" :aria-label="t.details">
          <div>
            <p class="lab-eyebrow">{{ t.details }}</p>
            <h2>
              <bdi>{{ inspected.id }}</bdi>
            </h2>
          </div>
          <dl>
            <div>
              <dt>{{ t.customer }}</dt>
              <dd>{{ inspected.customer }}</dd>
            </div>
            <div>
              <dt>{{ t.amount }}</dt>
              <dd>{{ money(inspected.amount) }}</dd>
            </div>
            <div>
              <dt>{{ t.status }}</dt>
              <dd>{{ t[inspected.status] }}</dd>
            </div>
            <div>
              <dt>{{ t.email }}</dt>
              <dd>
                <bdi>{{ inspected.email }}</bdi>
              </dd>
            </div>
            <div
              v-for="column in detailColumns"
              :key="column"
              :class="{ 'lab-field--description': column === 'description' }"
            >
              <dt>{{ t[column] }}</dt>
              <dd>{{ extra(inspected, column) }}</dd>
            </div>
          </dl>
          <button type="button" class="lab-icon-button" :aria-label="t.close" @click="closeDetails">
            <LabIcon name="close" />
          </button>
        </section>
        <footer class="lab-bottom">
          <p>{{ t.note }}</p>
          <label
            >{{ t.dataset
            }}<select v-model="dataset" @change="resetDataset">
              <option value="standard">{{ t.standardDataset }}</option>
              <option value="large">{{ t.largeDataset }}</option>
            </select></label
          >
          <label
            >{{ t.state
            }}<select v-model="state">
              <option value="ready">{{ t.ready }}</option>
              <option value="loading">{{ t.loading }}</option>
              <option value="error">{{ t.error }}</option>
              <option value="empty">{{ t.empty }}</option>
            </select></label
          >
        </footer>
        <p class="sr-only" role="status" :aria-label="t.notice">{{ announcement }}</p>
      </main>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import LabIcon from './LabIcon.vue'
import { orders as standardOrders, largeOrders, copy, extraColumns, formatExtra } from './data'
import type { Order, OrderStatus, ExtraColumn } from './data'
import { parsePageInput } from '../../src/core/pagination'

type SortKey = 'id' | 'customer' | 'amount'
type FocusTarget = NonNullable<typeof document.activeElement> & { focus(): void }
export default Vue.extend({
  components: { LabIcon },
  data: () => ({
    dataset: 'standard',
    mobilePreview: false,
    locale: 'en' as 'en' | 'fa',
    direction: 'clarity',
    variants: [{ key: 'clarity' }, { key: 'precision' }],
    tabs: ['all', 'completed', 'processing', 'pending', 'cancelled'] as Array<OrderStatus | 'all'>,
    status: 'all' as OrderStatus | 'all',
    query: '',
    minAmount: '' as number | string,
    optionalColumns: ['status', 'amount', 'date', ...extraColumns] as const,
    visibleColumns: ['status', 'amount', 'date', ...extraColumns],
    filtersOpen: false,
    sortKey: 'id' as SortKey,
    ascending: false,
    page: 1,
    pageDraft: '1',
    jumpError: false,
    pageSize: 8,
    selected: [] as string[],
    state: 'ready',
    inspected: null as Order | null,
    returnFocus: null as FocusTarget | null,
    exportScope: 'results',
    announcement: '',
  }),
  computed: {
    detailColumns(): ExtraColumn[] {
      return extraColumns.filter((column) => this.visibleColumns.includes(column))
    },
    orders(): Order[] {
      return this.dataset === 'large' ? largeOrders : standardOrders
    },
    t() {
      return copy[this.locale]
    },
    filteredRows(): Order[] {
      const query = this.query.trim().toLowerCase()
      return this.orders
        .filter(
          (row) =>
            (this.status === 'all' || row.status === this.status) &&
            row.amount >= Number(this.minAmount || 0) &&
            `${row.id} ${row.customer} ${row.email}`.toLowerCase().includes(query),
        )
        .sort((a, b) => {
          const result =
            this.sortKey === 'amount'
              ? a.amount - b.amount
              : String(a[this.sortKey]).localeCompare(String(b[this.sortKey]), undefined, { numeric: true })
          return this.ascending ? result : -result
        })
    },
    resultCount(): number {
      return this.state === 'empty' ? 0 : this.filteredRows.length
    },
    pageCount(): number {
      return Math.max(1, Math.ceil(this.resultCount / this.pageSize))
    },
    currentPage(): number {
      return Math.min(this.page, this.pageCount)
    },
    pageRows(): Order[] {
      return this.filteredRows.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    allPageSelected(): boolean {
      return this.pageRows.length > 0 && this.pageRows.every((row) => this.selected.includes(row.id))
    },
    somePageSelected(): boolean {
      return !this.allPageSelected && this.pageRows.some((row) => this.selected.includes(row.id))
    },
    exportRows(): Order[] {
      return this.exportScope === 'selected'
        ? this.orders.filter((row) => this.selected.includes(row.id))
        : this.filteredRows
    },
  },
  watch: {
    currentPage(value: number) {
      this.pageDraft = String(value)
      this.jumpError = false
    },
  },
  methods: {
    extra(row: Order, column: ExtraColumn) {
      return formatExtra(row, column, this.locale)
    },
    resetDataset() {
      this.page = 1
      this.pageDraft = '1'
      this.selected = []
      this.inspected = null
      this.jumpError = false
      this.clearFilters()
    },
    jumpToPage() {
      if (this.state !== 'ready' || !this.resultCount) return
      const target = parsePageInput(this.pageDraft, this.pageCount)
      if (target === null) {
        this.jumpError = true
        return
      }
      this.jumpError = false
      this.page = target
      this.pageDraft = String(target)
    },
    number(value: number) {
      return new Intl.NumberFormat(this.locale).format(value)
    },
    money(value: number) {
      return new Intl.NumberFormat(this.locale, { style: 'currency', currency: 'USD' }).format(value)
    },
    date(value: string) {
      return new Intl.DateTimeFormat(this.locale === 'fa' ? 'fa-IR-u-ca-gregory' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(`${value}T00:00:00Z`))
    },
    setStatus(value: OrderStatus | 'all') {
      this.status = value
      this.page = 1
    },
    clearFilters() {
      this.query = ''
      this.status = 'all'
      this.minAmount = ''
      this.page = 1
    },
    sortBy(key: SortKey) {
      this.ascending = this.sortKey === key ? !this.ascending : true
      this.sortKey = key
      this.page = 1
    },
    togglePage() {
      const ids = this.pageRows.map((row) => row.id)
      this.selected = this.allPageSelected
        ? this.selected.filter((id) => !ids.includes(id))
        : Array.from(new Set([...this.selected, ...ids]))
    },
    inspect(row: Order) {
      this.returnFocus = document.activeElement as FocusTarget
      this.inspected = row
      this.$nextTick(() => (this.$refs.orderDetail as FocusTarget).focus())
    },
    closeDetails() {
      this.inspected = null
      this.returnFocus?.focus()
    },
    download() {
      const rows = [
        ['Order', 'Customer', 'Amount (USD)', 'Status', 'Date'],
        ...this.exportRows.map((row) => [row.id, row.customer, row.amount, row.status, row.date]),
      ]
      const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n')
      const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = url
      link.download = 'sample-orders.csv'
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      this.announcement = `${this.t.downloadReady} · ${this.number(this.exportRows.length)}`
    },
  },
})
</script>
