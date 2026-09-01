# Smart Data Table for Vue 2.7

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A reusable, backend-neutral data table for Vue 2.7 and Vuetify 2.6. The package remains private until its final npm name and release process are confirmed.

## Features

- Local and provider-backed server data
- Controlled pagination, sorting, filters, selection, and column visibility
- Desktop and mobile layouts
- Typed custom cells, filters, toolbar content, actions, and state events
- Optional local-storage persistence and safe CSV export
- English/LTR defaults with configurable messages and RTL
- Escaped text rendering; no raw HTML renderer

## Development

```sh
npm install
npm run dev
npm run typecheck
npm run test:unit
npm run build
```

The host application must install Vue 2.7, install Vuetify 2.6, create a Vuetify instance, and import both Vuetify CSS and this package's `styles.css`.

## Minimal local example

```vue
<SmartDataTable
  v-model="selectedIds"
  :columns="[
    { key: 'id', label: 'ID', type: 'number', sortable: true },
    { key: 'name', label: 'Name', filterable: true },
  ]"
  :items="rows"
  selectable
/>
```

## Server example

```ts
const dataProvider = (request) => api.list(request)
const normalizeResponse = (raw) => ({ items: raw.records, total: raw.count })
```

See [`docs/api.md`](docs/api.md), [`docs/providers.md`](docs/providers.md), and [`docs/adapters.md`](docs/adapters.md).

> Vue 2 and Vuetify 2 are end-of-life. This package intentionally targets applications that cannot migrate yet.

## License

Released under the [MIT License](LICENSE).

Copyright © 2026 [Mohammad Reza Dehghani](https://github.com/reydi-dev).
