<template>
  <section>
    <label
      >Theme
      <select v-model="theme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    <SmartDataTable class="brand-table" :columns="columns" :items="rows" :theme="theme" :exporters="exporters">
      <template v-slot:[`cell.status`]="{ value }">
        <span class="brand-status" :class="{ 'brand-status--paid': value === 'paid' }">{{
          value === 'paid' ? 'Paid' : 'Unpaid'
        }}</span>
      </template>
    </SmartDataTable>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { SmartDataTable, createCsvExporter } from 'vue2-smart-datatable'
import type { DataTableColumn, DataTableTheme } from 'vue2-smart-datatable'
import 'vue2-smart-datatable/styles.css'

type Invoice = { id: number; customer: string; status: 'paid' | 'unpaid' }

export default Vue.extend({
  components: { SmartDataTable },
  data: () => ({
    theme: 'light' as DataTableTheme,
    exporters: [createCsvExporter({ label: 'CSV' })],
    columns: [
      { key: 'id', label: 'Invoice', type: 'number', sortable: true },
      { key: 'customer', label: 'Customer', mobile: { summary: true } },
      { key: 'status', label: 'Payment', mobile: { summary: true } },
    ] as DataTableColumn<Invoice>[],
    rows: [
      { id: 101, customer: 'Ada', status: 'paid' },
      { id: 102, customer: 'Lin', status: 'unpaid' },
    ] as Invoice[],
  }),
})
</script>

<style>
.sdt-root.brand-table {
  --sdt-accent: #365ba8;
  --sdt-accent-soft: #eff4ff;
  --sdt-control-height: 40px;
  --sdt-control-radius: 8px;
}
.sdt-root.brand-table[data-sdt-theme='dark'] {
  --sdt-accent: #a5c4ff;
  --sdt-accent-soft: #253853;
}
.brand-table .brand-status {
  display: inline-flex;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--sdt-tint-color);
  color: var(--sdt-muted-color);
}
.brand-table .brand-status--paid {
  color: var(--sdt-success-color);
}
</style>
