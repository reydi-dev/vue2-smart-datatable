# Smart Data Table for Vue 2

[![npm version](https://img.shields.io/npm/v/vue2-smart-datatable.svg)](https://www.npmjs.com/package/vue2-smart-datatable)
[![npm downloads](https://img.shields.io/npm/dt/vue2-smart-datatable.svg)](https://www.npmjs.com/package/vue2-smart-datatable)
[![CI](https://github.com/reydi-dev/vue2-smart-datatable/actions/workflows/ci.yml/badge.svg)](https://github.com/reydi-dev/vue2-smart-datatable/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A TypeScript-ready data table for Vue 2.6+ with server-side pagination, filtering, mobile layouts, RTL, and safe CSV export.

[Live demo](https://reydi-dev.github.io/vue2-smart-datatable/) · [API](docs/api.md) · [Roadmap](docs/roadmap.md) · [Security](SECURITY.md)

## Why this package?

`vue2-smart-datatable` is for maintained Vue 2 applications that need a complete data table without coupling table state to one backend or store.

- Native Clarity UI for legacy Vue 2 applications, with no UI framework required
- Built-in TypeScript declarations and controlled state APIs
- Backend-neutral provider and response-normalizer contracts
- Responsive desktop/mobile renderers with configurable RTL
- Safe-by-default text rendering and spreadsheet export
- No direct runtime dependencies; Vue is the only peer dependency

## Features

- Local and provider-backed server data
- Controlled pagination, sorting, filters, selection, and column visibility
- Desktop and mobile layouts
- Typed custom cells, filters, toolbar content, actions, and state events
- Optional local-storage persistence and safe CSV export
- English/LTR defaults with configurable messages and RTL
- Escaped text rendering; no raw HTML renderer

## Compatibility

| Dependency            | Supported versions |
| --------------------- | ------------------ |
| Vue                   | `>=2.6.14 <3`      |
| Node.js for consumers | `>=18.18`          |

The package is developed with Vue 2.7 and also tested as a packed dependency in an independent Vue 2.6.14 consumer. Vue is a peer dependency and is not bundled. Vuetify is optional host software; the table does not import it. Native dialog support is required for the built-in column chooser (see [browser support](docs/native-controls.md)).

Contributing to or building this repository requires Node.js 20 because the development and browser-test toolchain has a newer runtime floor than the distributed library.

> Clarity is available as `0.3.0-rc.1` under the npm `next` tag. Install it explicitly with `npm install vue2-smart-datatable@0.3.0-rc.1`. The unqualified install still selects stable `0.2.0`; the hosted demo has not been redeployed by this release. See the [upgrade guide](docs/clarity-upgrade.md).

## Install

In a Vue 2.6.14+ application:

```sh
npm install vue2-smart-datatable
```

Import the table stylesheet once in your application entry point:

```ts
import 'vue2-smart-datatable/styles.css'
```

Use the table in a component:

```vue
<template>
  <SmartDataTable v-model="selectedIds" :columns="columns" :items="rows" selectable />
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

The host application must provide a supported Vue 2 version. No Vuetify instance, `v-app`, icon font, or external icon service is required. Existing Vuetify hosts can keep their own setup. See the [API reference](docs/api.md) for provider mode, slots, events, and options.

## Try the demo locally

```sh
git clone https://github.com/reydi-dev/vue2-smart-datatable.git
cd vue2-smart-datatable
npm ci
npm run dev
```

Open the local URL printed by Vite. The default demo build contains one public entry. Development-only labs can be built with `npm run build:demo:labs` for regression testing. The [live demo](https://reydi-dev.github.io/vue2-smart-datatable/) shows the last deployed example with local data, a mock server provider, and mobile and RTL layouts.

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

Import the table stylesheet as shown above; no UI-framework wrapper is needed. The table handles loading, empty results, request cancellation, and a retry button for failed requests. See the [provider guide](docs/providers.md) for the endpoint contract and filter mapping.

See [`docs/api.md`](docs/api.md), [`docs/providers.md`](docs/providers.md), [`docs/adapters.md`](docs/adapters.md), and [`docs/roadmap.md`](docs/roadmap.md).

Contributions are welcome. Read [`CONTRIBUTING.md`](CONTRIBUTING.md), the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and the project [`SECURITY.md`](SECURITY.md) before opening a pull request or report.

> Vue 2 is end-of-life. This package intentionally targets applications that cannot migrate yet.

## License

Released under the [MIT License](LICENSE).

Copyright © 2026 [Mohammad Reza Dehghani](https://github.com/reydi-dev).
