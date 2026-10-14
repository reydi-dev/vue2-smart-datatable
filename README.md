# Smart Data Table for Vue 2.7

[![CI](https://github.com/reydi-dev/vue2-smart-datatable/actions/workflows/ci.yml/badge.svg)](https://github.com/reydi-dev/vue2-smart-datatable/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A reusable, backend-neutral data table for Vue 2.7 and Vuetify 2.6. This GitHub repository is public; the package is not published to npm yet (`private: true` in `package.json`).

[Live demo](https://reydi-dev.github.io/vue2-smart-datatable/) · [API](docs/api.md) · [Roadmap](docs/roadmap.md) · [Security](SECURITY.md)

## Features

- Local and provider-backed server data
- Controlled pagination, sorting, filters, selection, and column visibility
- Desktop and mobile layouts
- Typed custom cells, filters, toolbar content, actions, and state events
- Optional local-storage persistence and safe CSV export
- English/LTR defaults with configurable messages and RTL
- Escaped text rendering; no raw HTML renderer

## Try the demo locally

```sh
git clone https://github.com/reydi-dev/vue2-smart-datatable.git
cd vue2-smart-datatable
npm ci
npm run dev
```

Open the local URL printed by Vite. The [live demo](https://reydi-dev.github.io/vue2-smart-datatable/) shows this repository's full example with local data, a mock server provider, and mobile and RTL layouts.

## Minimal local example

To try a smaller table in this repository, replace `examples/App.vue` with the following. The existing `examples/main.ts` already initializes Vuetify and imports its CSS and the table styles.

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
import { SmartDataTable } from '@/index'
import type { DataTableColumn } from '@/types'

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

The `@/` imports above are aliases configured for this repository. When the npm package is released, consumer applications will import the component and its `styles.css` from the published package. Vue 2.7 and Vuetify 2.6 must be installed in the host application, which must also create a Vuetify instance and import Vuetify CSS.

## Development checks

```sh
npm run typecheck
npm run test:unit
npm run build
npm run build:demo
```

## Server example

```ts
const dataProvider = (request) => api.list(request)
const normalizeResponse = (raw) => ({ items: raw.records, total: raw.count })
```

See [`docs/api.md`](docs/api.md), [`docs/providers.md`](docs/providers.md), [`docs/adapters.md`](docs/adapters.md), and [`docs/roadmap.md`](docs/roadmap.md).

Contributions are welcome. Read [`CONTRIBUTING.md`](CONTRIBUTING.md), the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and the project [`SECURITY.md`](SECURITY.md) before opening a pull request or report.

> Vue 2 and Vuetify 2 are end-of-life. This package intentionally targets applications that cannot migrate yet.

## License

Released under the [MIT License](LICENSE).

Copyright © 2026 [Mohammad Reza Dehghani](https://github.com/reydi-dev).
