<template>
  <main class="sdt-root renderer-demo" :data-sdt-theme="theme" :dir="locale === 'fa' ? 'rtl' : 'ltr'" :lang="locale">
    <header class="renderer-header">
      <div>
        <p>SMART / TABLE · CLARITY</p>
        <h1>{{ t.orders }}</h1>
        <span>{{ t.subtitle }}</span>
      </div>
      <a href="./index.html">{{ locale === 'fa' ? 'دموی اصلی' : 'Table demo' }}</a>
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
          ><span class="renderer-total">{{ allRows.length }}</span>
        </div>
        <label class="renderer-search"
          ><span class="sdt-sr-only">{{ t.searchLabel }}</span
          ><input v-model="query" type="search" :placeholder="t.search" @input="page = 1"
        /></label>
      </div>
      <p v-if="selected.length" class="renderer-selected" role="status">
        {{ selected.length }} {{ t.selected }}
        <button type="button" @click="selected = []">{{ t.clearSelection }}</button>
      </p>
      <component
        v-if="result.items.length"
        :is="mobile ? 'SmartTableMobile' : 'SmartTableDesktop'"
        :rows="result.items"
        :columns="columns"
        :row-key-of="rowKeyOf"
        :selected-keys="selected"
        selectable
        :disabled="disabled"
        :dense="dense"
        fixed-header
        :height="470"
        :summary-limit="4"
        :messages="messages"
        :icons="icons"
        :actions="actions"
        :sort="sort"
        @sort="setSort"
        @select-row="selectRow"
        @select-page="selectPage"
        @row-action="lastAction = `${$event.action.key}: ${$event.row.id}`"
      >
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
      </component>
      <p v-else class="renderer-empty">{{ t.noResults }}</p>
      <SmartTablePagination
        :page.sync="page"
        :items-per-page="pageSize"
        :total="result.total"
        :page-size-options="[8, 16]"
        :messages="messages"
        :disabled="disabled"
        :previous-icon="locale === 'fa' ? icons.next : icons.previous"
        :next-icon="locale === 'fa' ? icons.previous : icons.next"
        @update:items-per-page="setPageSize"
      />
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
import SmartTableDesktop from '@/components/SmartTableDesktop.vue'
import SmartTableMobile from '@/components/SmartTableMobile.vue'
import SmartTableCell from '@/components/SmartTableCell.vue'
import SmartTablePagination from '@/components/SmartTablePagination.vue'
import { defaultIcons, defaultMessages } from '@/core/messages'
import { observeViewportWidth } from '@/core/responsive'
import { processLocalData } from '@/core/local-data'
import { orders, copy, formatExtra } from '../design/data'
import type { Order } from '../design/data'
import type { DataTableColumn, DataTableMessages, SortState, RowAction } from '@/types'
export default Vue.extend({
  components: { SmartTableDesktop, SmartTableMobile, SmartTableCell, SmartTablePagination },
  data: () => ({
    locale: 'en' as 'en' | 'fa',
    theme: 'light',
    dense: false,
    disabled: false,
    busyFirst: false,
    width: null as number | null,
    stopObserving: null as (() => void) | null,
    query: '',
    page: 1,
    pageSize: 8,
    selected: [] as string[],
    sort: null as SortState | null,
    icons: defaultIcons,
    lastAction: '',
  }),
  computed: {
    t() {
      return copy[this.locale]
    },
    mobile(): boolean {
      return this.width !== null && this.width < 960
    },
    messages(): DataTableMessages {
      return this.locale === 'fa'
        ? {
            ...defaultMessages,
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
        : defaultMessages
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
          numberFormat: { style: 'currency', currency: 'USD' },
          mobile: { summary: true, order: 3 },
        },
        { key: 'date', label: this.t.date, type: 'date', minWidth: 140, dateFormat: { dateStyle: 'medium' } },
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
      return orders.filter((row) => `${row.id} ${row.customer} ${row.email}`.toLowerCase().includes(query))
    },
    result(): { items: Order[]; total: number } {
      return processLocalData(this.allRows, this.columns, {}, this.sort, this.page, this.pageSize)
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
  mounted() {
    this.stopObserving = observeViewportWidth((width) => {
      this.width = width
    })
  },
  beforeDestroy() {
    this.stopObserving?.()
  },
  methods: {
    rowKeyOf(row: Order) {
      return row.id
    },
    selectRow({ row, selected }: { row: Order; selected: boolean }) {
      this.selected = selected
        ? Array.from(new Set([...this.selected, row.id]))
        : this.selected.filter((id) => id !== row.id)
    },
    selectPage(selected: boolean) {
      const keys = this.result.items.map((row) => row.id)
      this.selected = selected
        ? Array.from(new Set([...this.selected, ...keys]))
        : this.selected.filter((id) => !keys.includes(id))
    },
    setSort(column: DataTableColumn) {
      this.sort = {
        columnKey: column.key,
        direction: this.sort?.columnKey === column.key && this.sort.direction === 'asc' ? 'desc' : 'asc',
      }
      this.page = 1
    },
    setPageSize(size: number) {
      this.pageSize = size
      this.page = 1
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
