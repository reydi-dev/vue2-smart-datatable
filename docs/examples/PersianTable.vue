<template>
  <div lang="fa" dir="rtl">
    <SmartDataTable
      v-model="selectedIds"
      :columns="columns"
      :items="rows"
      :messages="messages"
      :mobile-breakpoint="768"
      direction="rtl"
      theme="light"
      selectable
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SmartDataTable } from 'vue2-smart-datatable'
import type { DataTableColumn, DataTableMessages } from 'vue2-smart-datatable'
import 'vue2-smart-datatable/styles.css'

type Order = { id: number; customer: string; amount: number }
const rial = new Intl.NumberFormat('fa-IR', { style: 'currency', currency: 'IRR', maximumFractionDigits: 0 })

export default Vue.extend({
  components: { SmartDataTable },
  data: () => ({
    selectedIds: [] as number[],
    columns: [
      { key: 'id', label: 'شناسه', type: 'number', sortable: true },
      { key: 'customer', label: 'مشتری', filterable: true, mobile: { summary: true } },
      {
        key: 'amount',
        label: 'مبلغ (ریال)',
        type: 'number',
        sortable: true,
        formatter: (value) => rial.format(Number(value)),
      },
    ] as DataTableColumn<Order>[],
    rows: [
      { id: 1, customer: 'مینا رضایی', amount: 1500000 },
      { id: 2, customer: 'آرمان احمدی', amount: 2400000 },
    ] as Order[],
    messages: {
      loading: 'در حال بارگذاری…',
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
      currentPage: 'صفحهٔ فعلی',
      allRows: 'همهٔ ردیف‌ها',
      copy: 'کپی',
      copied: 'کپی شد',
      expand: 'نمایش متن کامل',
      collapse: 'جمع‌کردن متن',
      actions: 'عملیات',
      selectAll: 'انتخاب همهٔ ردیف‌های صفحه',
      selectRow: 'انتخاب ردیف',
      previousPage: 'صفحهٔ قبل',
      nextPage: 'صفحهٔ بعد',
      goToPage: 'رفتن به صفحه',
      go: 'برو',
      invalidPage: 'شمارهٔ صحیح در این بازه وارد کن:',
      trueValue: 'بله',
      falseValue: 'خیر',
      notProvided: 'ثبت نشده',
      moreDetails: 'جزئیات بیشتر',
      openRow: 'بازکردن ردیف',
      table: 'سفارش‌ها',
      close: 'بستن',
      clearFilter: 'پاک‌کردن فیلتر',
      filterOperator: 'شرط',
      filterValue: 'مقدار',
      filterFrom: 'از',
      filterTo: 'تا',
      filterAny: 'هر مقدار',
      exportFailed: 'خروجی ناموفق بود',
      filterOperators: {
        contains: 'شامل',
        startsWith: 'شروع با',
        endsWith: 'پایان با',
        eq: 'برابر',
        neq: 'نابرابر',
        gt: 'بزرگ‌تر از',
        gte: 'حداقل',
        lt: 'کوچک‌تر از',
        lte: 'حداکثر',
        between: 'بین',
        in: 'یکی از',
      },
    } as Partial<DataTableMessages>,
  }),
})
</script>
