# Copyable Vue 2 examples

These single-file components use public `vue2-smart-datatable` exports and can be copied individually into an existing
Vue 2 application with TypeScript SFC support. They do not import repository internals or require Vuetify.

| Goal                  | Copy this file                       | Includes                                                                                       |
| --------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Start with local data | [BasicTable.vue](BasicTable.vue)     | Columns, sorting, Name filter, responsive rows and selected IDs                                |
| Connect your API      | [ServerTable.vue](ServerTable.vue)   | Fetch, pagination/sort/filter mapping, cancellation, error handling and response normalization |
| Use Persian and RTL   | [PersianTable.vue](PersianTable.vue) | Translated controls, RTL, Rial formatting and an explicit mobile breakpoint                    |
| Match your branding   | [StyledTable.vue](StyledTable.vue)   | Scoped Clarity tokens, light/dark switching, a payment-status slot and CSV export              |

## Use an example

Install in an existing Vue `>=2.6.14 <3` application:

```sh
npm install vue2-smart-datatable@0.3.0
```

Copy one file into `src/components`, then register it in your parent component:

```vue
<template><BasicTable /></template>
<script lang="ts">
import Vue from 'vue'
import BasicTable from './components/BasicTable.vue'
export default Vue.extend({ components: { BasicTable } })
</script>
```

Change the import/name for a different example. The files include the public stylesheet import so each works alone; when
combining examples, move `import 'vue2-smart-datatable/styles.css'` into the application entry once. These files are not
standalone HTML pages or Vue 3 components. Vue 2.6 projects should use their matching `vue-template-compiler` version.
For Vite applications that already use Vuetify, retain the [single Vue runtime alias](../../README.md#vite-apps-using-vuetify-2).
The column chooser needs native modal-dialog support or a host polyfill; see [browser support](../native-controls.md).

## API contract

`ServerTable.vue` calls your own `/api/users` endpoint. Without that backend it will show an error and Retry; the
[interactive local/API demo](https://reydi-dev.github.io/vue2-smart-datatable/#data) uses a mock provider instead.

Example request:

```text
GET /api/users?page=1&per_page=10&sort=name&direction=asc&name=Ada
```

The `name` parameter is a case-insensitive contains filter. Implement sorting, filtering and pagination on the backend;
return `{ data: User[], total: number }`, where total is the count after filtering and before pagination. For example:

```json
{ "data": [{ "id": 1, "name": "Ada" }], "total": 1 }
```

Return an empty array and zero total for no matches. Keep IDs stable and unique; pages are one-based. Map request keys
and response fields to your API, whitelist sort fields/operators on the server, and keep the `AbortSignal` and HTTP-error
check. Normalization maps the response; the library validates its item array/total. The table initiates requests itself:
do not add a second page/filter watcher that duplicates those requests. Typing a page number alone does not commit a jump;
Go/Enter requests the destination directly. See the [provider guide](../providers.md) for the full contract.

## Localization and styling

`direction="rtl"` changes layout; it does not translate messages or format application values. The Persian example
translates built-in controls, column labels and filter operators, and uses `Intl.NumberFormat('fa-IR')` for Rial values.
Replace those domain labels and units for your application.

The styled example changes tokens only on `.sdt-root.brand-table` and supplies a dark palette for its accent. Its status
slot uses Vue text interpolation; CSV uses underlying values (`paid`/`unpaid`) unless you configure `exportValue` on the
column. Slots add application UI; avoid targeting Vuetify internals. See [UI foundations](../ui-foundations.md) and
[columns](../columns.md) for tokens and exporter formatting.

## Maintenance checks

Repository type checking and lint include these SFCs. Unit regressions cover controlled selection, Persian/RTL formatting,
theme/slot rendering, committed API jumps, request mapping/cancellation and HTTP-error rejection. Development aliases in
TypeScript/Vitest resolve the public import to the source entry so clean-checkout tests do not depend on an existing
`dist` directory. Distribution import tests remain separate and read the built files directly. Also type-check the copied
files in an isolated consumer against the published npm declarations before changing the guide's compatibility claims.

Validation on 2026-10-23: repository type checking, lint/format checks and all five focused example regressions passed.
All four SFCs were also copied into an isolated consumer with no repository aliases and type-checked against the published
`vue2-smart-datatable@0.3.0` declarations, first with Vue 2.7.16 and then Vue 2.6.14 with its matching template compiler.
Those are consumer declaration checks, not new browser-engine or real-backend acceptance claims. No library runtime
source or package version was changed by this documentation stage.
