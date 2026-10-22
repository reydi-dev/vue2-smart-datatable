# Providers and response normalization

Use `mode="server"` with a `dataProvider` function. Copy [ServerTable.vue](examples/ServerTable.vue) and follow the [example setup guide](examples/README.md#api-contract) for a complete `/api/users` integration. A shorter explanation is also in the [README](../README.md#server-example).

The provider receives `{ page, itemsPerPage, sort, filters, context, signal, reason }`. The table calls it on initial load and when the user changes pages, page size, sorting, or filters. It also calls it for refreshes and server-side exports.

| Request field  | Meaning                                                                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`         | One-based page number.                                                                                                                                      |
| `itemsPerPage` | Requested page size.                                                                                                                                        |
| `sort`         | `null` or `{ columnKey, field?, direction }`; `direction` is `asc` or `desc`. `field` comes from the column's `sortKey` or string `field`, when configured. |
| `filters`      | Clauses keyed by column key, such as `{ name: { operator: 'contains', value: 'Ada' } }`. Empty clauses are omitted.                                         |
| `signal`       | Pass this to `fetch` so superseded requests can be aborted.                                                                                                 |
| `context`      | Optional consumer-owned value passed through from `providerContext`.                                                                                        |
| `reason`       | Why the table loaded: `initial`, `page`, `page-size`, `sort`, `filter`, `refresh`, or `export`.                                                             |

Map the request to your backend's query format. The [README example](../README.md#server-example) sends `GET /api/users?page=1&per_page=25&sort=name&direction=asc&name=Ada`. Its backend contract is:

```json
{
  "data": [{ "id": 1, "name": "Ada" }],
  "total": 1
}
```

Here `name` means a case-insensitive **contains** search because that column allows only the `contains` operator. If your column allows more operators, inspect each clause's `operator` and translate it explicitly. Validate sortable fields and filter operators on the backend; the client query is not a trusted SQL expression. Return `total` after filtering and before pagination so the table can calculate the correct page count. For no matches, return `{ "data": [], "total": 0 }`.

The default normalizer accepts either an array or `{ items, total, meta? }`. For another response shape, pass `normalizeResponse` as shown in the README. Its return value must contain an array of `items` and a finite, non-negative numeric `total`.

Throw on HTTP errors (`fetch` does not throw for a 4xx or 5xx response). The table then shows its error state and retry control and emits `load-error`. While a request is pending it shows loading; a successful response with no rows shows the empty state. You can customize these using the `loading`, `empty`, and `error` slots or the `messages` prop.

The table aborts superseded requests where supported and ignores stale results by request ID. Switching to local mode cancels a pending server request and ignores any late response. A malformed normalized response emits `load-error` instead of silently showing an empty table.
