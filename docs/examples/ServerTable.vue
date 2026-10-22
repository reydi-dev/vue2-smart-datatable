<template>
  <SmartDataTable
    :columns="columns"
    mode="server"
    :data-provider="loadUsers"
    :normalize-response="normalizeUsers"
    :items-per-page="10"
    :filter-debounce="250"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { SmartDataTable } from 'vue2-smart-datatable'
import type { DataProvider, DataTableColumn, ResponseNormalizer } from 'vue2-smart-datatable'
import 'vue2-smart-datatable/styles.css'

type User = { id: number; name: string }
type UsersResponse = { data: User[]; total: number }

const loadUsers: DataProvider = async ({ page, itemsPerPage, sort, filters, signal }) => {
  const query = new URLSearchParams({ page: String(page), per_page: String(itemsPerPage) })
  if (sort) {
    query.set('sort', sort.field || sort.columnKey)
    query.set('direction', sort.direction)
  }
  const name = filters.name?.value
  if (typeof name === 'string' && name.trim()) query.set('name', name.trim())
  const response = await fetch(`/api/users?${query}`, { signal })
  if (!response.ok) throw new Error(`Unable to load users (${response.status})`)
  return (await response.json()) as UsersResponse
}

const normalizeUsers: ResponseNormalizer<User> = (raw) => {
  const response = raw as UsersResponse
  return { items: response.data, total: response.total }
}

export default Vue.extend({
  components: { SmartDataTable },
  data: () => ({
    columns: [
      { key: 'id', label: 'ID', type: 'number', sortable: true },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        filterable: true,
        filter: { operators: ['contains'] },
        mobile: { summary: true },
      },
    ] as DataTableColumn<User>[],
    loadUsers,
    normalizeUsers,
  }),
})
</script>
