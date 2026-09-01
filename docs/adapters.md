# Optional adapters

## Column persistence

`createLocalStoragePersistenceAdapter({ prefix? })` stores versioned visible-column keys. It is safe when rendered without `window` and treats storage failures as non-fatal.

## CSV

`createCsvExporter({ label?, fileName?, pageSize?, download? })` supports current-page and all-row scopes. All-row server exports page through the same provider and normalizer. CSV output uses UTF-8 BOM, quoting, formula-injection mitigation, leading-zero preservation, and Excel cell-length handling.

Custom exporters implement `{ key, label, scopes, export(context) }` and may generate PDF/XLSX or call a consumer-owned report service.
