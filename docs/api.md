# Component API

`SmartDataTable` is the default and named package export. It supports `local` mode with `items`, and `server` mode with `dataProvider` and an optional `normalizeResponse`.

## Props

| Prop                            | Type / default                 | Purpose                                                                                                             |
| ------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `columns`                       | `DataTableColumn[]` (required) | Stable column schema.                                                                                               |
| `mode`                          | `'local' \| 'server'`; `local` | Selects the data pipeline.                                                                                          |
| `items`                         | `Row[]`; `[]`                  | Input rows in local mode.                                                                                           |
| `dataProvider`                  | `DataProvider`                 | Required in server mode.                                                                                            |
| `normalizeResponse`             | `ResponseNormalizer`           | Converts a provider result to `{ items, total, meta? }`.                                                            |
| `providerContext`               | `unknown`                      | Consumer-owned context forwarded to the provider.                                                                   |
| `rowKey`                        | string or getter; `id`         | Resolves a stable string/number key.                                                                                |
| `page`                          | number; `1`                    | Current one-based page.                                                                                             |
| `itemsPerPage`                  | number; `25`                   | Current page size.                                                                                                  |
| `pageSizeOptions`               | number array; `[10,25,50,100]` | Allowed sizes.                                                                                                      |
| `sort`                          | `SortState \| null`            | Single-column sorting state.                                                                                        |
| `filters`                       | `FilterState`; `{}`            | Canonical filter clauses keyed by column key.                                                                       |
| `value`                         | `RowKey[]`; `[]`               | Vue 2 `v-model` selection.                                                                                          |
| `selectable`                    | boolean; `false`               | Enables row/page selection.                                                                                         |
| `actions`                       | `RowAction[]`; `[]`            | Visible, disabled, and loading row actions.                                                                         |
| `visibleColumns`                | string array                   | Controlled visible column keys.                                                                                     |
| `columnVisibility`              | boolean; `true`                | Enables the visibility dialog.                                                                                      |
| `persistenceAdapter`            | `PersistenceAdapter`           | Optional visibility persistence.                                                                                    |
| `persistenceKey`                | string                         | Required when persistence is used.                                                                                  |
| `exporters`                     | `ExporterAdapter[]`; `[]`      | Enables export UI when non-empty.                                                                                   |
| `exportFileName`                | string; `export`               | File-name stem passed to exporters.                                                                                 |
| `messages`                      | partial messages               | Overrides default English strings.                                                                                  |
| `direction`                     | `'ltr' \| 'rtl'`; `ltr`        | Applies direction only to the component root.                                                                       |
| `theme`                         | `'light' \| 'dark'`; unset     | Selects the independent foundation palette; unset preserves the legacy dark-theme bridge.                           |
| `icons`                         | partial icon map               | Overrides bundled SVG icons or supplies SVG definitions; see UI foundations.                                        |
| `mobileBreakpoint`              | number or legacy alias; `960`  | Selects the mobile renderer using an independent viewport threshold.                                                |
| `mobileSummaryLimit`            | number; `3`                    | Default summary column count.                                                                                       |
| `filterDebounce`                | number; `250`                  | Server-filter delay in milliseconds.                                                                                |
| `autoLoad`                      | boolean; `true`                | Loads server data on mount or when switching to server mode. Set `false` to call `refresh()` for the first load.    |
| `loading`                       | boolean; `false`               | Adds consumer-controlled loading state.                                                                             |
| `disabled`                      | boolean; `false`               | Disables built-in state-changing controls, links, copy buttons, and row/cell actions; ref methods remain available. |
| `dense`, `fixedHeader`          | boolean; `false`               | Display options.                                                                                                    |
| `height`                        | string or number               | Desktop table height.                                                                                               |
| `showToolbar`, `showPagination` | boolean; `true`                | Enables built-in controls.                                                                                          |
| `rowClass`                      | function                       | Returns Vue-compatible classes for a row.                                                                           |

Controlled props take precedence over persisted/default values. Interactions update internal optimistic state and emit the matching event so a parent can synchronize its source of truth.

For translated selection controls, override `messages.selectAll` and `messages.selectRow`. The latter is a label prefix followed by the row's position on the current page (for example, `Select row 1`).

## UI foundations

`theme` optionally accepts `'light'` or `'dark'` for the independent native-control palette. Omit it to preserve the legacy
`.theme--dark` ancestor bridge. Remaining Vuetify controls still use the host theme in this intermediate migration stage.

See [UI foundations](ui-foundations.md) for the numeric `mobileBreakpoint`, legacy alias ranges, SVG definitions and MDI
compatibility, boolean-cell accessible labels, theme tokens, and the standalone verification page.

## Pagination

The built-in footer shows the current/total page count, previous/next controls, a native page-size select, and a
"Go to page" form. Typing edits a draft only; pressing Enter or clicking Go submits the target. Latin, Persian, and
Arabic-Indic digits are accepted. Empty, fractional, nonnumeric, and out-of-range values show an associated inline error
without emitting `update:page`. Submitting the current page does not emit another update.

A valid jump uses the existing `update:page` / `options-change` flow. In server mode it requests the target page through
the provider, without loading intermediate pages. This requires a page/offset-based backend and a correct `total` from
the provider; cursor-only APIs need their own pagination integration. `total` is the filtered count before pagination.

The built-in pagination controls are disabled while a data load is pending, when `disabled` is true, or after a provider
error until retry succeeds. Page navigation is also disabled when there are no results. Page size and valid input range
follow the current controlled props. The existing custom `footer` slot remains available.

Pagination labels can be translated with optional `messages.previousPage`, `messages.nextPage`, `messages.goToPage`,
`messages.go`, and `messages.invalidPage`, alongside `rowsPerPage` and `of`. `invalidPage` is the error prefix followed by
the allowed numeric range. Existing message objects retain English defaults for omitted fields.

Pagination form controls now use native HTML with scoped `.sdt-pagination__*` classes. The `--sdt-accent`,
`--sdt-accent-soft`, `--sdt-surface`, `--sdt-text-color`, and `--sdt-error-color` CSS variables configure these controls
alongside the existing border/muted/tint variables. Bundled inline SVG icons and RTL navigation direction are independent of Vuetify; custom MDI font names require a
host-provided font stylesheet. The library as a whole still requires Vuetify for controls that have not yet migrated.

## Events

State events are `input`, `selection-change`, `update:page`, `update:items-per-page`, `update:sort`, `update:filters`, `update:visible-columns`, `column-visibility-change`, and `options-change`.

`selection-change` emits `{ keys, rows }`. `keys` contains the complete selection; `rows` contains only selected rows on the currently displayed page. Consumers using custom slots must disable their own interactive content when `disabled` is true.

When disabled, users can still expand mobile rows to read their details.

Lifecycle events are `load-start`, `load-success`, `load-error`, `loading-change`, `export-start`, `export-success`, and `export-error`. Interaction events are `row-click`, `row-action`, and `cell-click`. Load/export events include the request, result, scope, adapter key, or error described by the exported TypeScript types.

Desktop rows enter the keyboard tab order when the consumer listens for `row-click`. Press Enter or Space on a focused row to emit the event.

## Slots

The component exposes `toolbar`, `toolbar-prepend`, `toolbar-append`, `header`, `header.<key>`, `cell`, `cell.<key>`, `filter.<key>`, `action.<key>`, `row-actions`, `mobile-summary`, `mobile-details`, `loading`, `empty`, `error`, `footer`, and `export-progress`.

Cell slots receive `{ row, rowKey, column, value, formattedValue, rowIndex, mobile }`. Filter slots receive `{ column, clause, setClause, clear }`. Action slots receive `{ action, row, rowKey, disabled, loading, trigger }`. Custom slots are a security boundary and must sanitize any HTML or URLs they create.

`rowIndex` is zero-based within the current page. The `row-actions` slot also receives `disabled` so custom action controls can follow the table's disabled state.

## Ref methods

- `refresh(reason = 'refresh'): Promise<void>`
- `resetFilters(): void`
- `clearSelection(): void`
- `resetColumnVisibility(): Promise<void>`
- `exportData(exporterKey, scope = 'current'): Promise<void>`
- `getState(): DataTableState`
