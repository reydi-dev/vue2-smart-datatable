<template>
  <main class="demo-page" :class="{ 'demo-page--dark': theme === 'dark' }" :dir="rtl ? 'rtl' : 'ltr'">
    <div class="demo-shell">
      <header class="demo-hero">
        <div>
          <p class="demo-eyebrow">SMART / TABLE · CLARITY</p>
          <h1>Smart Data Table</h1>
          <p>{{ fa ? 'داده‌های خود را پیدا، بررسی و مدیریت کنید.' : 'Find, explore, and manage your data.' }}</p>
        </div>
        <a href="https://github.com/reydi-dev/vue2-smart-datatable" target="_blank" rel="noopener noreferrer">{{
          fa ? 'کد پروژه' : 'View source'
        }}</a>
      </header>
      <div class="demo-controls">
        <div class="demo-mode" role="group" :aria-label="fa ? 'منبع داده' : 'Data source'">
          <button type="button" :aria-pressed="mode === 'local'" @click="mode = 'local'">
            {{ fa ? 'محلی' : 'Local' }}</button
          ><button type="button" :aria-pressed="mode === 'server'" @click="mode = 'server'">
            {{ fa ? 'سرور' : 'Server' }}
          </button>
        </div>
        <label
          >{{ fa ? 'زبان' : 'Language'
          }}<select :value="fa ? 'fa' : 'en'" @change="setLanguage">
            <option value="en">English</option>
            <option value="fa">فارسی</option>
          </select></label
        >
        <label><input v-model="rtl" type="checkbox" />RTL</label>
        <label
          >{{ fa ? 'پوسته' : 'Theme'
          }}<select v-model="theme">
            <option value="light">{{ fa ? 'روشن' : 'Light' }}</option>
            <option value="dark">{{ fa ? 'تیره' : 'Dark' }}</option>
          </select></label
        >
        <label><input v-model="dense" type="checkbox" />{{ fa ? 'فشرده' : 'Compact' }}</label>
        <label><input v-model="disabled" type="checkbox" />{{ fa ? 'غیرفعال' : 'Disabled' }}</label>
      </div>
      <SmartDataTable
        v-model="selected"
        :columns="columns"
        :items="rows"
        :mode="mode"
        :data-provider="mockProvider"
        :normalize-response="normalize"
        :actions="actions"
        selectable
        :direction="rtl ? 'rtl' : 'ltr'"
        :theme="theme"
        :dense="dense"
        :disabled="disabled"
        :filters="filters"
        :messages="messages"
        persistence-key="demo"
        :persistence-adapter="persistence"
        :exporters="exporters"
        @update:filters="filters = $event"
        @row-action="lastAction = `${$event.action.key}:${$event.row.id}`"
      >
        <template #toolbar-prepend>
          <strong>{{
            mode === 'local' ? (fa ? 'داده‌های محلی' : 'Local data') : fa ? 'داده‌های سرور' : 'Normalized server data'
          }}</strong>
          <label class="sdt-search"
            ><span class="sdt-sr-only">{{ fa ? 'جست‌وجوی نام' : 'Search by name' }}</span
            ><input
              type="search"
              :disabled="disabled"
              :value="searchValue"
              :placeholder="fa ? 'جست‌وجوی نام…' : 'Search by name…'"
              @input="search"
          /></label>
        </template>
        <template #cell.email="{ formattedValue }"
          ><a :href="`mailto:${formattedValue}`"
            ><bdi>{{ formattedValue }}</bdi></a
          ></template
        >
      </SmartDataTable>
      <div class="demo-feedback" role="status">
        <span data-testid="selection">Selected: {{ selected.join(', ') || 'none' }}</span
        ><span>Last action: {{ lastAction || 'none' }}</span>
      </div>
      <nav class="demo-labs" aria-label="Development previews">
        <a href="./design.html">Design lab</a><a href="./foundations.html">Foundations</a
        ><a href="./renderers.html">Renderer lab</a>
      </nav>
    </div>
  </main>
</template>
<script lang="ts">
import Vue from 'vue'
import { SmartDataTable, createCsvExporter, createLocalStoragePersistenceAdapter } from '@/index'
import { actions, columns, rows } from './data'
import { mockProvider } from './mock-provider'
import type { DataProviderRequest, FilterState, DataTableMessages } from '@/types'
export default Vue.extend({
  components: { SmartDataTable },
  data: () => ({
    mode: 'local',
    rtl: false,
    fa: false,
    theme: 'light' as 'light' | 'dark',
    dense: false,
    disabled: false,
    filters: {} as FilterState,
    selected: [] as number[],
    lastAction: '',
    rows,
    columns,
    actions,
    mockProvider,
    persistence: createLocalStoragePersistenceAdapter(),
    exporters: [createCsvExporter()],
    normalize: (raw: any, _request: DataProviderRequest) => ({
      items: raw.records,
      total: raw.count,
      meta: { page: raw.requestPage },
    }),
  }),
  computed: {
    searchValue(): string {
      return String(this.filters.name?.value ?? '')
    },
    messages(): Partial<DataTableMessages> {
      return this.fa
        ? {
            loading: 'در حال دریافت داده…',
            empty: 'داده‌ای برای نمایش نیست',
            noResults: 'نتیجه‌ای پیدا نشد',
            error: 'دریافت داده ناموفق بود',
            retry: 'تلاش دوباره',
            rowsPerPage: 'ردیف در هر صفحه',
            of: 'از',
            filters: 'فیلترها',
            clearFilters: 'پاک‌کردن فیلترها',
            columns: 'ستون‌ها',
            reset: 'بازنشانی',
            apply: 'اعمال',
            export: 'خروجی',
            currentPage: 'صفحه فعلی',
            allRows: 'تمام ردیف‌ها',
            copy: 'کپی',
            copied: 'کپی شد',
            expand: 'نمایش متن کامل',
            collapse: 'جمع‌کردن متن',
            actions: 'عملیات',
            selectAll: 'انتخاب تمام ردیف‌های این صفحه',
            selectRow: 'انتخاب ردیف',
            previousPage: 'صفحه قبل',
            nextPage: 'صفحه بعد',
            goToPage: 'رفتن به صفحه',
            go: 'برو',
            invalidPage: 'بازه مجاز:',
            trueValue: 'بله',
            falseValue: 'خیر',
            notProvided: 'ثبت نشده',
            moreDetails: 'جزئیات بیشتر',
            openRow: 'بازکردن ردیف',
            table: 'داده‌ها',
            close: 'بستن',
            clearFilter: 'پاک‌کردن فیلتر',
            filterOperator: 'شرط',
            filterValue: 'مقدار',
            filterFrom: 'از',
            filterTo: 'تا',
            filterAny: 'همه مقادیر',
            exportFailed: 'گرفتن خروجی ناموفق بود',
            filterOperators: {
              contains: 'شامل',
              startsWith: 'شروع با',
              endsWith: 'پایان با',
              eq: 'برابر با',
              neq: 'نابرابر با',
              gt: 'بیشتر از',
              gte: 'بزرگ‌تر یا مساوی',
              lt: 'کمتر از',
              lte: 'کوچک‌تر یا مساوی',
              between: 'بین',
              in: 'یکی از',
            },
          }
        : {}
    },
  },
  methods: {
    search(event: Event) {
      const value = (event.target as HTMLInputElement).value
      const next = { ...this.filters }
      if (value) next.name = { operator: 'contains', value }
      else delete next.name
      this.filters = next
    },
    setLanguage(event: Event) {
      this.fa = (event.target as HTMLSelectElement).value === 'fa'
      this.rtl = this.fa
    },
  },
})
</script>
<style>
body {
  margin: 0;
}
.demo-page {
  min-height: 100vh;
  padding: 40px 4vw;
  background: #f8faf9;
  color: #24312e;
  font:
    14px/1.7 system-ui,
    Tahoma,
    sans-serif;
}
.demo-page--dark {
  background: #17231d;
  color: #edf5f0;
}
.demo-shell {
  max-width: 1440px;
  margin: auto;
}
.demo-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}
.demo-eyebrow {
  color: #087c63;
  font-size: 10px;
  letter-spacing: 2px;
  font-weight: 700;
}
.demo-hero h1 {
  margin: 6px 0;
  font-size: clamp(26px, 4vw, 36px);
  letter-spacing: -1px;
}
.demo-hero p:last-child {
  color: #697773;
  margin: 0;
}
.demo-page a {
  color: #087c63;
  text-underline-offset: 3px;
}
.demo-page--dark a,
.demo-page--dark .demo-eyebrow {
  color: #83d6bb;
}
.demo-page--dark .demo-hero p:last-child {
  color: #b3c4bb;
}
.demo-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
  font-size: 12px;
}
.demo-controls label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.demo-controls select,
.demo-mode button {
  padding: 8px 12px;
  border: 1px solid #b9c8c0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.demo-mode {
  display: flex;
  gap: 6px;
}
.demo-mode button[aria-pressed='true'] {
  background: #edf7f2;
  color: #087c63;
  border-color: #087c63;
}
.demo-page input {
  accent-color: #087c63;
}
.demo-page :where(button, select, input, a):focus-visible {
  outline: 2px solid #087c63;
  outline-offset: 3px;
}
.demo-page .sdt-search {
  width: min(260px, 100%);
  font-size: 12px;
}
.demo-page .sdt-root {
  box-shadow: 0 4px 18px #182c2408;
}
.demo-page .sdt-toolbar__content > strong {
  font-weight: 600;
}
.demo-feedback,
.demo-labs {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 20px;
  font-size: 12px;
}
.demo-labs {
  justify-content: flex-start;
}
@media (max-width: 600px) {
  .demo-page {
    padding: 24px 12px;
  }
  .demo-hero {
    align-items: start;
  }
  .demo-hero > a {
    white-space: nowrap;
    font-size: 12px;
  }
  .demo-page .sdt-search {
    width: 100%;
  }
}
</style>
