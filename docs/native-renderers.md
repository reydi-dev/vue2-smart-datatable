# Native desktop, mobile, and cells (migration stage 4)

The production desktop/mobile renderers, selection checkboxes, row actions, and built-in cells now use native HTML and
the Clarity tokens. Toolbar, filters, export/column dialogs, and some states still use Vuetify. Keep the required Vuetify
peer installed until [stage 6](clarity-migration.md).

## Desktop and mobile behavior

- Desktop uses a semantic table inside a keyboard-focusable scroll region. `height` controls the region; `fixedHeader`
  keeps column headings visible while scrolling it. Wide tables scroll inside that region.
- `dense` reduces row height and vertical padding, including mobile summaries. `width`, `minWidth`, `align`, `headerClass`,
  `cellClass`, and `rowClass` remain available. Row-height tokens are minimums; tall content can increase a row's height.
- Page selection uses native checked/indeterminate states; selected styling reflects the supplied selected keys.
- A `row-click` listener enables keyboard activation on desktop (Enter/Space) and an explicit localized Open row button
  on mobile. Clicking a noninteractive part of a row/summary also emits the event. Links, buttons, inputs, and other
  recognized interactive descendants do not activate the enclosing row.
- Mobile summaries use up to two columns, retaining the configured summary fields/order/limit. Native `details`/`summary`
  controls expose the remaining fields and actions. Checkboxes are outside the disclosure control. Reading details does
  not emit `row-click`, and remains available while the table is disabled.
- Mobile detail fields span both columns for `expandable-text`, `compact: false`, or copy/link fields and formatted text
  longer than 80 characters when `compact` is unset. Long unbroken values wrap; ordinary multiline text preserves line breaks.

## Cells and actions

Missing formatted values (`null`, `undefined`, or an empty string) display an em dash with a localized screen-reader label.
Zero and false remain meaningful values. Chips display the formatted value. Text, copied values, and link labels use
direction isolation where appropriate. Links and images retain URL validation; content is rendered as text, never raw HTML.

`expandable-text` shows a two-line desktop preview with an accessible expand/collapse button. On mobile its full text is
already inside the row disclosure. Images use native lazy-loaded `img` elements with the column label as their alt text;
use a custom cell slot when per-image descriptions are needed.

Row-action labels remain visible during loading. Both built-in buttons and the slot-provided `trigger` guard against
table-disabled, action-disabled, and action-loading states. Custom controls should also consume the slot's `disabled` and
`loading` values for their presentation. Action colors `primary`, `secondary`, `success`, `error`, `warning`, and `info` map
to Clarity tokens. Other colors must be valid CSS color values; Vuetify palette names such as `red darken-2` require a CSS
color or a custom action slot.

## Extensions and styling migration

Existing `header`, `header.<key>`, `cell`, `cell.<key>`, `action.<key>`, `row-actions`, `mobile-summary`, and `mobile-details`
slots retain their contexts. Named action overrides can coexist with default native actions. Custom mobile-summary
content owns its layout and selection control, as before.

Consumer CSS and tests targeting Vuetify's internal renderer classes must migrate. Useful classes are
`.sdt-desktop__table`, `.sdt-checkbox`, `.sdt-row--selected`, `.sdt-mobile__row`, `.sdt-mobile__disclosure`, `.sdt-action`,
and `.sdt-cell__*`. Prefer semantic role/name/state selectors for interactions. The new native disclosure does not offer
Vuetify expansion-panel transition classes or its single-panel accordion state.

Optional message overrides: `table` names the desktop scroll region/mobile list, `moreDetails` labels disclosures,
`openRow` labels explicit mobile row activation, and `notProvided` names missing values. Selection, expand/collapse,
copy, true/false, and action labels remain configurable. See [foundations](ui-foundations.md) for palette, density, icons,
and viewport settings.

## Standalone verification

Run `npm run dev` and open `/renderers.html`. This page imports the real renderers, cells, pagination, and library CSS
without Vuetify or an icon font. It provides 13 columns, English/Persian, RTL, light/dark, compact, disabled/loading
controls, sort, selection, and long/missing/multiline sample values. It verifies these migrated pieces, not the complete
table without Vuetify. Packed consumers, Vue 2.6, and Package Lab remain scheduled for stage 6.
