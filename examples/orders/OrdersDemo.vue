<template>
  <main class="sdt-root renderer-demo" :data-sdt-theme="theme" :dir="locale === 'fa' ? 'rtl' : 'ltr'" :lang="locale">
    <header class="renderer-header">
      <div>
        <p>SMART / TABLE · CLARITY</p>
        <h1>{{ t.orders }}</h1>
        <span>{{ t.subtitle }}</span>
      </div>
      <a href="https://github.com/reydi-dev/vue2-smart-datatable" target="_blank" rel="noopener noreferrer">{{
        locale === 'fa' ? 'کد پروژه' : 'View source'
      }}</a>
    </header>
    <div class="renderer-controls">
      <label
        >{{ t.language
        }}<select v-model="locale">
          <option value="en">English</option>
          <option value="fa">فارسی / RTL</option>
        </select></label
      >
      <label
        >{{ locale === 'fa' ? 'پوسته' : 'Theme'
        }}<select v-model="theme">
          <option value="light">{{ locale === 'fa' ? 'روشن' : 'Light' }}</option>
          <option value="dark">{{ locale === 'fa' ? 'تیره' : 'Dark' }}</option>
        </select></label
      >
      <label><input v-model="dense" type="checkbox" />{{ locale === 'fa' ? 'فشرده' : 'Compact' }}</label>
      <label><input v-model="disabled" type="checkbox" />{{ locale === 'fa' ? 'غیرفعال' : 'Disabled' }}</label>
      <label
        ><input v-model="busyFirst" type="checkbox" />{{
          locale === 'fa' ? 'عملیات در حال اجرا' : 'Busy first action'
        }}</label
      >
    </div>
    <section class="renderer-card">
      <div class="renderer-card-top">
        <div>
          <strong>{{ t.orders }}</strong
          ><span class="renderer-total">{{ orders.length }}</span>
          <p class="renderer-subtitle">{{ t.subtitle }}</p>
        </div>
      </div>
      <nav class="renderer-tabs" :aria-label="t.status">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          :disabled="disabled"
          :aria-pressed="status === tab"
          @click="
            status = tab
            page = 1
          "
        >
          {{ tabLabel(tab) }}<span>{{ tabCount(tab) }}</span>
        </button>
      </nav>
      <p v-if="selected.length" class="renderer-selected" role="status">
        {{ selected.length }} {{ t.selected }}
        <button type="button" @click="selected = []">{{ t.clearSelection }}</button>
      </p>
      <SmartDataTable
        ref="table"
        @update:visible-columns="visibleColumnKeys = $event"
        v-model="selected"
        :exporters="exporters"
        :items="allRows"
        :columns="columns"
        selectable
        :disabled="disabled"
        :dense="dense"
        :theme="theme"
        :direction="locale === 'fa' ? 'rtl' : 'ltr'"
        fixed-header
        :height="470"
        :mobile-summary-limit="4"
        :messages="messages"
        :icons="icons"
        :actions="actions"
        :page.sync="page"
        :items-per-page.sync="pageSize"
        :page-size-options="[8, 16]"
        @row-action="lastAction = `${$event.action.key}: ${$event.row.id}`"
      >
        <template #toolbar-prepend>
          <label class="renderer-search"
            ><svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="7" />
              <path d="m15 15 6 6" /></svg
            ><span class="sdt-sr-only">{{ t.searchLabel }}</span
            ><input v-model="query" type="search" :disabled="disabled" :placeholder="t.search" @input="page = 1"
          /></label>
        </template>
        <template #mobile-summary="{ row, rowIndex }">
          <div class="renderer-order-summary">
            <label class="sdt-selection-control"
              ><input
                class="sdt-checkbox"
                type="checkbox"
                :disabled="disabled"
                :checked="selected.includes(row.id)"
                :aria-label="`${messages.selectRow} ${rowIndex + 1}`"
                @change="toggleOrder(row.id)"
            /></label>
            <strong v-if="columnShown('id')" class="renderer-order-id"
              ><bdi>#{{ row.id }}</bdi></strong
            >
            <span v-if="columnShown('status')" class="renderer-status" :class="`renderer-status--${row.status}`"
              ><i aria-hidden="true" />{{ statusLabel(row.status) }}</span
            >
            <div v-if="columnShown('customer')" class="renderer-order-person">
              <strong>{{ row.customer }}</strong
              ><small v-if="columnShown('date')">{{ orderDate(row.date) }}</small>
            </div>
            <strong v-if="columnShown('amount')" class="renderer-order-amount"
              ><bdi>{{ orderAmount(row.amount) }}</bdi></strong
            >
          </div>
        </template>
        <template #mobile-details="{ row, columns: detailColumns, rowIndex }">
          <dl class="sdt-mobile__details">
            <div
              v-for="column in mobileColumns(detailColumns)"
              :key="column.key"
              :class="{ 'sdt-mobile__field--full': column.key === 'email' || column.key === 'description' }"
            >
              <dt>{{ column.label }}</dt>
              <dd>
                <SmartTableCell
                  :row="row"
                  :column="mobileDetail(column)"
                  :row-key-value="row.id"
                  :row-index="rowIndex"
                  mobile
                  :messages="messages"
                  :icons="icons"
                  :disabled="disabled"
                />
              </dd>
            </div>
          </dl>
        </template>
        <template #cell="context"
          ><div v-if="context.column.key === 'customer'" class="renderer-person">
            <span class="renderer-avatar">{{ context.row.initials }}</span
            ><span
              ><strong>{{ context.row.customer }}</strong
              ><small
                ><bdi>{{ context.row.email }}</bdi></small
              ></span
            >
          </div>
          <span
            v-else-if="context.column.key === 'status'"
            class="renderer-status"
            :class="`renderer-status--${context.row.status}`"
            ><i aria-hidden="true" />{{ statusLabel(context.row.status) }}</span
          >
          <SmartTableCell
            v-else
            :row="context.row"
            :column="context.column"
            :row-key-value="context.rowKey"
            :row-index="context.rowIndex"
            :mobile="context.mobile"
            :messages="messages"
            :icons="icons"
            :disabled="disabled"
        /></template>
      </SmartDataTable>
    </section>
    <p class="renderer-footnote" data-testid="renderer-action">
      {{
        lastAction ||
        (locale === 'fa'
          ? 'نمایشگرها و سلول‌های واقعی کتابخانه · داده نمونه'
          : 'Real library renderers and cells · Sample orders')
      }}
    </p>
  </main>
</template>
<script lang="ts">
import Vue from 'vue'
import SmartDataTable from '@/components/SmartDataTable.vue'
import { createCsvExporter } from '@/index'
import SmartTableCell from '@/components/SmartTableCell.vue'
import { defaultIcons, defaultMessages } from '@/core/messages'
import { orders, copy, formatExtra } from './data'
import type { Order } from './data'
import type { DataTableColumn, DataTableMessages, RowAction } from '@/types'
export default Vue.extend({
  components: { SmartDataTable, SmartTableCell },
  data: () => ({
    locale: 'en' as 'en' | 'fa',
    theme: 'light' as 'light' | 'dark',
    dense: false,
    disabled: false,
    busyFirst: false,
    query: '',
    visibleColumnKeys: null as string[] | null,
    status: 'all' as 'all' | Order['status'],
    orders,
    tabs: ['all', 'completed', 'processing', 'pending', 'cancelled'] as Array<'all' | Order['status']>,
    exporters: [createCsvExporter()],
    page: 1,
    pageSize: 8,
    selected: [] as string[],
    icons: defaultIcons,
    lastAction: '',
  }),
  computed: {
    t() {
      return copy[this.locale]
    },
    messages(): DataTableMessages {
      return this.locale === 'fa'
        ? {
            ...defaultMessages,
            export: 'خروجی CSV',
            filters: 'فیلترها',
            columns: 'ستون‌ها',
            selectAll: 'انتخاب تمام ردیف‌های این صفحه',
            selectRow: 'انتخاب ردیف',
            moreDetails: 'جزئیات بیشتر',
            openRow: 'بازکردن ردیف',
            table: 'سفارش‌ها',
            notProvided: 'ثبت نشده',
            trueValue: 'بله',
            falseValue: 'خیر',
            copy: 'کپی',
            expand: 'نمایش متن کامل',
            collapse: 'جمع‌کردن متن',
            actions: 'عملیات',
            rowsPerPage: 'ردیف در هر صفحه',
            of: 'از',
            goToPage: 'رفتن به صفحه',
            go: 'برو',
            previousPage: 'صفحه قبل',
            nextPage: 'صفحه بعد',
            invalidPage: 'بازه مجاز:',
          }
        : { ...defaultMessages, export: 'Export CSV', trueValue: 'Yes', falseValue: 'No' }
    },
    columns(): DataTableColumn<Order>[] {
      return [
        { key: 'id', label: this.t.id, minWidth: 130, sortable: true, mobile: { summary: true, order: 0 } },
        { key: 'customer', label: this.t.customer, minWidth: 230, sortable: true, mobile: { summary: true, order: 1 } },
        {
          key: 'status',
          label: this.t.status,
          type: 'chip',
          minWidth: 130,
          formatter: (_value, row) => this.t[row.status],
          mobile: { summary: true, order: 2 },
        },
        {
          key: 'amount',
          label: this.t.amount,
          type: 'number',
          align: 'end',
          minWidth: 125,
          sortable: true,
          filterable: true,
          numberFormat: { style: 'currency', currency: 'USD' },
          formatter: (_value, row) => this.orderAmount(row.amount),
          mobile: { summary: true, order: 3 },
        },
        {
          key: 'date',
          label: this.t.date,
          type: 'date',
          minWidth: 140,
          dateFormat: { dateStyle: 'medium' },
          formatter: (_value, row) => this.orderDate(row.date),
        },
        { key: 'email', label: this.t.email, type: 'copy', minWidth: 230 },
        { key: 'items', label: this.t.items, type: 'number', minWidth: 100 },
        {
          key: 'payment',
          label: this.t.payment,
          type: 'chip',
          minWidth: 140,
          formatter: (_value, row) => formatExtra(row, 'payment', this.locale),
        },
        {
          key: 'shipping',
          label: this.t.shipping,
          minWidth: 120,
          formatter: (_value, row) => formatExtra(row, 'shipping', this.locale),
        },
        { key: 'city', label: this.t.city, minWidth: 100, formatter: (_value, row) => row.city[this.locale] },
        { key: 'priority', label: this.t.priority, type: 'boolean', minWidth: 100 },
        {
          key: 'tags',
          label: this.t.tags,
          minWidth: 170,
          formatter: (_value, row) => (row.tags.length ? formatExtra(row, 'tags', this.locale) : ''),
        },
        {
          key: 'description',
          label: this.t.description,
          type: 'expandable-text',
          minWidth: 300,
          formatter: (_value, row) => row.description[this.locale],
        },
      ]
    },
    allRows(): Order[] {
      const query = this.query.toLowerCase().trim()
      return orders.filter(
        (row) =>
          (this.status === 'all' || row.status === this.status) &&
          `${row.id} ${row.customer} ${row.email}`.toLowerCase().includes(query),
      )
    },
    actions(): RowAction<Order>[] {
      return [
        {
          key: 'inspect',
          label: this.locale === 'fa' ? 'بررسی سفارش' : 'Inspect order',
          icon: 'eye',
          color: 'primary',
          loading: (row) => this.busyFirst && row.id === orders[0].id,
        },
      ]
    },
  },
  methods: {
    columnShown(key: string): boolean {
      return this.visibleColumnKeys === null || this.visibleColumnKeys.includes(key)
    },
    toggleOrder(id: string) {
      if (!this.disabled)
        this.selected = this.selected.includes(id) ? this.selected.filter((key) => key !== id) : [...this.selected, id]
    },
    tabLabel(tab: 'all' | Order['status']): string {
      return tab === 'all' ? this.t.all : this.t[tab]
    },
    tabCount(tab: 'all' | Order['status']): number {
      return tab === 'all' ? orders.length : orders.filter((row) => row.status === tab).length
    },
    orderDate(value: string): string {
      return new Intl.DateTimeFormat(this.locale, { dateStyle: 'medium' }).format(new Date(value))
    },
    orderAmount(value: number): string {
      return new Intl.NumberFormat(this.locale, { style: 'currency', currency: 'USD' }).format(value)
    },
    mobileColumns(columns: DataTableColumn<Order>[]): DataTableColumn<Order>[] {
      return columns.filter((column) => column.key !== 'date')
    },
    mobileDetail(column: DataTableColumn<Order>): DataTableColumn<Order> {
      if (column.key === 'email' || column.key === 'payment') return { ...column, type: 'text' }
      if (column.key === 'priority')
        return {
          ...column,
          type: 'text',
          formatter: (_value, row) => (row.priority ? this.messages.trueValue : this.messages.falseValue),
        }
      return column
    },
    statusLabel(status: Order['status']): string {
      return this.t[status]
    },
  },
})
</script>
<style>
body {
  margin: 0;
}
.renderer-demo {
  min-height: 100vh;
  padding: 36px 5vw;
  background: var(--sdt-tint-color);
  color: var(--sdt-text-color);
  font:
    14px/1.7 system-ui,
    Tahoma,
    sans-serif;
}
.renderer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}
.renderer-header p {
  color: var(--sdt-accent);
  font-size: 10px;
  letter-spacing: 2px;
  font-weight: 650;
}
.renderer-header h1 {
  font-size: 32px;
  letter-spacing: -1px;
  margin: 4px 0;
}
.renderer-header span,
.renderer-footnote {
  color: var(--sdt-muted-color);
}
.renderer-header a {
  color: var(--sdt-accent);
  font-size: 12px;
}
.renderer-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  margin-bottom: 24px;
  font-size: 12px;
}
.renderer-controls label {
  display: flex;
  gap: 8px;
  align-items: center;
}
.renderer-controls select,
.renderer-search input {
  padding: 8px 10px;
  border: 1px solid var(--sdt-border-color);
  border-radius: var(--sdt-control-radius);
  background: var(--sdt-surface);
  color: var(--sdt-text-color);
  font: inherit;
}
.renderer-controls input {
  accent-color: var(--sdt-accent);
}
.renderer-card {
  min-width: 0;
  border: 1px solid var(--sdt-border-color);
  border-radius: var(--sdt-radius);
  background: var(--sdt-surface);
  box-shadow: 0 4px 18px #182c2408;
}
.renderer-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
}
.renderer-card-top strong {
  font-size: 18px;
}
.renderer-total {
  display: inline-block;
  padding: 2px 7px;
  margin-inline-start: 10px;
  border: 1px solid var(--sdt-border-color);
  border-radius: 5px;
  font-size: 11px;
}
.renderer-search input {
  width: 280px;
  max-width: 100%;
  font-size: 12px;
}
.renderer-selected {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin: 0;
  padding: 12px 20px;
  background: var(--sdt-accent-soft);
  color: var(--sdt-accent);
  font-size: 12px;
}
.renderer-selected button {
  border: 0;
  background: none;
  color: inherit;
  text-decoration: underline;
  font: inherit;
  cursor: pointer;
}
.renderer-person {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
}
.renderer-person > span:last-child {
  min-width: 0;
}
.renderer-person strong {
  display: block;
  font-weight: 550;
}
.renderer-person small {
  display: block;
  color: var(--sdt-muted-color);
  font-size: 10px;
  overflow-wrap: anywhere;
}
.renderer-avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--sdt-accent-soft);
  color: var(--sdt-accent);
  font-size: 10px;
  flex-shrink: 0;
}
.renderer-empty {
  padding: 36px;
  text-align: center;
}
.renderer-footnote {
  font-size: 12px;
}
.renderer-card > .sdt-mobile {
  padding: 0 12px 12px;
}
@media (max-width: 600px) {
  .renderer-demo {
    padding: 24px 12px;
  }
  .renderer-card-top {
    flex-wrap: wrap;
    padding: 16px;
  }
  .renderer-search {
    width: 100%;
  }
  .renderer-search input {
    width: 100%;
  }
  .renderer-person {
    flex-wrap: wrap;
    gap: 6px;
  }
  .renderer-person small {
    font-size: 10px;
  }
  .renderer-header {
    align-items: start;
  }
  .renderer-header a {
    white-space: nowrap;
  }
}
</style>

<style>
.renderer-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border: 1px solid var(--sdt-border-color);
  border-radius: 5px;
  background: var(--sdt-tint-color);
  font-size: 11px;
  line-height: 1.6;
}
.renderer-status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}
.renderer-status--completed {
  color: var(--sdt-success-color);
}
.renderer-status--processing {
  color: var(--sdt-info-color);
}
.renderer-status--pending {
  color: var(--sdt-warning-color);
}
.renderer-status--cancelled {
  color: var(--sdt-error-color);
}
.renderer-card > .sdt-root {
  border-inline: 0;
  border-bottom: 0;
  border-radius: 0 0 var(--sdt-radius) var(--sdt-radius);
}
</style>

<style>
.renderer-card-top {
  padding: 25px 24px 20px;
}
.renderer-card-top strong {
  font-size: 20px;
  letter-spacing: -0.4px;
}
.renderer-subtitle {
  margin: 7px 0 0;
  font-size: 12px;
  color: var(--sdt-muted-color);
}
.renderer-tabs {
  display: flex;
  gap: 25px;
  padding: 0 24px;
  overflow-x: auto;
  border-bottom: 1px solid var(--sdt-border-color);
}
.renderer-tabs button {
  display: flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
  padding: 13px 0 15px;
  background: none;
  border: 0;
  color: var(--sdt-muted-color);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.renderer-tabs button[aria-pressed='true'] {
  color: var(--sdt-accent);
  box-shadow: inset 0 -2px var(--sdt-accent);
  font-weight: 650;
}
.renderer-tabs span {
  padding: 2px 5px;
  font-size: 10px;
  border-radius: 5px;
  background: var(--sdt-tint-color);
}
.renderer-card .sdt-toolbar__content {
  flex: 0 1 36%;
  min-width: 260px;
}
.renderer-card .renderer-search {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  border: 1px solid var(--sdt-border-color);
  border-radius: 7px;
  padding: 0 11px;
  color: var(--sdt-muted-color);
}
.renderer-card .renderer-search input {
  width: 100%;
  padding: 10px 0;
  border: 0;
  background: transparent;
}
.renderer-card .renderer-search:focus-within {
  outline: 2px solid var(--sdt-accent);
  outline-offset: 2px;
}
.renderer-card .renderer-search input:focus-visible {
  outline: none;
}
.renderer-card .sdt-export > .sdt-control {
  background: var(--sdt-accent);
  color: var(--sdt-surface);
  border-color: var(--sdt-accent);
  font-weight: 600;
}
.renderer-card > .sdt-root {
  border-top: 0;
}
.renderer-order-summary {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  gap: 10px 11px;
  align-items: center;
}
.renderer-order-summary .sdt-selection-control {
  min-width: 18px;
  min-height: 30px;
}
.renderer-order-id {
  font-size: 11px;
  font-weight: 650;
}
.renderer-order-person {
  grid-column: 2;
}
.renderer-order-person strong {
  display: block;
  font-size: 12px;
  font-weight: 550;
}
.renderer-order-person small {
  display: block;
  margin-top: 5px;
  color: var(--sdt-muted-color);
  font-size: 10px;
}
.renderer-order-amount {
  justify-self: end;
  font-size: 12px;
  font-weight: 600;
}
.renderer-order-summary .renderer-status {
  justify-self: end;
}
.renderer-status--completed {
  background: color-mix(in srgb, var(--sdt-success-color) 6%, var(--sdt-surface));
  border-color: color-mix(in srgb, var(--sdt-success-color) 18%, var(--sdt-surface));
}
@media (max-width: 600px) {
  .renderer-card .sdt-toolbar {
    column-gap: 8px;
  }
  .renderer-card .sdt-toolbar__content {
    flex-basis: 100%;
  }
  .renderer-card .sdt-toolbar__actions {
    width: 100%;
  }
  .renderer-card .sdt-export {
    margin-inline-start: auto;
  }
}
</style>

<style>
.renderer-status--processing,
.renderer-status--pending,
.renderer-status--cancelled {
  background: var(--sdt-tint-color);
}
@media (max-width: 600px) {
  .renderer-card .sdt-toolbar__content {
    min-width: 0;
  }
}
</style>
