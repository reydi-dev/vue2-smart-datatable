# Providers and response normalization

The provider receives `{ page, itemsPerPage, sort, filters, context, signal, reason }`. Filters use package operators and are not translated to a backend query language.

The default normalizer accepts either an array or `{ items, total, meta? }`. Other responses require a normalizer:

```ts
const normalizeResponse = (raw) => ({
  items: raw.records,
  total: raw.count,
  meta: raw.pageInfo,
})
```

The table aborts superseded requests where supported and ignores stale results by request ID. A malformed normalized response emits `load-error` instead of silently showing an empty table.
