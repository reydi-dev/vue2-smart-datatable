# Column schema

Every column requires a stable, unique `key` and a `label`. `field` may be a dot path or a getter. Supported core types are `text`, `number`, `boolean`, `date`, `select`, `chip`, `icon`, `image`, `link`, `copy`, `expandable-text`, and `custom`.

Use `formatter` for safe text formatting and `cell.<key>` for domain-specific UI. Function fields need `sortKey` for server sorting. Visibility is persisted by column key, never by translated labels.

Filter types are text, number, date, and select. Canonical operators are `contains`, `startsWith`, `endsWith`, `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, inclusive `between`, and `in`.
