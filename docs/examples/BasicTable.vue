<template>
  <section>
    <SmartDataTable v-model="selectedIds" :columns="columns" :items="rows" :items-per-page="10" selectable />
    <p aria-live="polite">Selected IDs: {{ selectedIds.join(', ') || 'none' }}</p>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { SmartDataTable } from 'vue2-smart-datatable'
import type { DataTableColumn } from 'vue2-smart-datatable'
import 'vue2-smart-datatable/styles.css'

type User = { id: number; name: string; email: string }

export default Vue.extend({
  components: { SmartDataTable },
  data: () => ({
    selectedIds: [] as number[],
    columns: [
      { key: 'id', label: 'ID', type: 'number', sortable: true },
      { key: 'name', label: 'Name', sortable: true, filterable: true, mobile: { summary: true } },
      { key: 'email', label: 'Email', type: 'text' },
    ] as DataTableColumn<User>[],
    rows: [
      { id: 1, name: 'Ada', email: 'ada@example.test' },
      { id: 2, name: 'Lin', email: 'lin@example.test' },
    ] as User[],
  }),
})
</script>
