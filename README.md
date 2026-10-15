# Smart Data Table for Vue 2.7

[![CI](https://github.com/reydi-dev/vue2-smart-datatable/actions/workflows/ci.yml/badge.svg)](https://github.com/reydi-dev/vue2-smart-datatable/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A reusable, backend-neutral data table for Vue 2.7 and Vuetify 2.6. This package is in beta; the API may change before `0.1.0`.

[Live demo](https://reydi-dev.github.io/vue2-smart-datatable/) · [API](docs/api.md) · [Roadmap](docs/roadmap.md) · [Security](SECURITY.md)

## Features

- Local and provider-backed server data
- Controlled pagination, sorting, filters, selection, and column visibility
- Desktop and mobile layouts
- Typed custom cells, filters, toolbar content, actions, and state events
- Optional local-storage persistence and safe CSV export
- English/LTR defaults with configurable messages and RTL
- Escaped text rendering; no raw HTML renderer

## Install the beta

In a Vue 2.7 application that already uses Vuetify 2.6:

```sh
npm install vue2-smart-datatable@beta
```

Initialize Vuetify and import both stylesheets once in your application entry point:

```ts
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'vue2-smart-datatable/styles.css'

Vue.use(Vuetify)
const vuetify = new Vuetify()
// Pass vuetify to your root Vue instance: new Vue({ vuetify, ... })
```

Use the table in a component:

```vue
<template>
  <v-app>
    <v-main>
      <SmartDataTable v-model="selectedIds" :columns="columns" :items="rows" selectable />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { SmartDataTable } from 'vue2-smart-datatable'
import type { DataTableColumn } from 'vue2-smart-datatable'

type Row = { id: number; name: string }

export default Vue.extend({
  components: { SmartDataTable },
  data: () => ({
    selectedIds: [] as number[],
    columns: [
      { key: 'id', label: 'ID', type: 'number', sortable: true },
      { key: 'name', label: 'Name', filterable: true },
    ] as DataTableColumn<Row>[],
    rows: [
      { id: 1, name: 'Ada' },
      { id: 2, name: 'Lin' },
    ] as Row[],
  }),
})
</script>
```

Vue 2.7 and Vuetify 2.6 are peer dependencies. The host application must provide both. See the [API reference](docs/api.md) for provider mode, slots, events, and options.

## Try the demo locally

```sh
git clone https://github.com/reydi-dev/vue2-smart-datatable.git
cd vue2-smart-datatable
npm ci
npm run dev
```

Open the local URL printed by Vite. The [live demo](https://reydi-dev.github.io/vue2-smart-datatable/) shows this repository's full example with local data, a mock server provider, and mobile and RTL layouts.

### Vite apps using Vuetify 2

When using Vuetify 2 in a Vite app, make Vite resolve every `vue` import to the same Vue 2 runtime. Without this alias, Vuetify 2 can load a second Vue runtime and the app may render a blank page:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [{ find: /^vue$/, replacement: resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm.js') }],
  },
})
```

This Vite example assumes npm's `node_modules` layout; adapt the resolved path for other package managers.

## Development checks

```sh
npm run typecheck
npm run test:unit
npm run build
npm pack --dry-run
npm run build:demo
```

## Server example

This example connects to `GET /api/users`. The endpoint accepts one-based `page`, `per_page`, optional `sort` and `direction`, and an optional case-insensitive `name` search. It returns `{ data: User[], total: number }`, where `total` is the count **after filtering and before pagination**. Replace the URL and query names to match your API.

```vue
<template>
  <SmartDataTable :columns="columns" mode="server" :data-provider="loadUsers" :normalize-response="normalizeUsers" />
</template>

<script lang="ts">
import Vue from 'vue'
import { SmartDataTable } from 'vue2-smart-datatable'
import type { DataProvider, DataTableColumn, ResponseNormalizer } from 'vue2-smart-datatable'

type User = { id: number; name: string }
type UsersResponse = { data: User[]; total: number }

const loadUsers: DataProvider = async ({ page, itemsPerPage, sort, filters, signal }) => {
  const query = new URLSearchParams({ page: String(page), per_page: String(itemsPerPage) })
  if (sort) {
    query.set('sort', sort.field || sort.columnKey)
    query.set('direction', sort.direction)
  }
  if (filters.name?.value) query.set('name', String(filters.name.value))

  const response = await fetch(`/api/users?${query}`, { signal })
  if (!response.ok) throw new Error(`Could not load users (${response.status})`)
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
      { key: 'name', label: 'Name', sortable: true, filterable: true, filter: { operators: ['contains'] } },
    ] as DataTableColumn<User>[],
    loadUsers,
    normalizeUsers,
  }),
})
</script>
```

Place this component inside the host application's `<v-app>` and import both stylesheets as shown above. The table handles loading, empty results, request cancellation, and a retry button for failed requests. See the [provider guide](docs/providers.md) for the endpoint contract and filter mapping.

See [`docs/api.md`](docs/api.md), [`docs/providers.md`](docs/providers.md), [`docs/adapters.md`](docs/adapters.md), and [`docs/roadmap.md`](docs/roadmap.md).

Contributions are welcome. Read [`CONTRIBUTING.md`](CONTRIBUTING.md), the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and the project [`SECURITY.md`](SECURITY.md) before opening a pull request or report.

> Vue 2 and Vuetify 2 are end-of-life. This package intentionally targets applications that cannot migrate yet.

## License

Released under the [MIT License](LICENSE).

Copyright © 2026 [Mohammad Reza Dehghani](https://github.com/reydi-dev).
