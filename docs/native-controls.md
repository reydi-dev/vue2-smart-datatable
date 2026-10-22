# Native controls and states (migration stage 5)

The table's built-in toolbar, filters, column visibility dialog, export chooser, and states now use native controls with
Clarity tokens. The main demo (`/`) runs the complete production component without importing Vuetify or an icon font.
Stage 6 removes the required Vuetify peer and updates installation instructions. See the [consumer validation report](consumer-validation.md) for packed Vue 2.6/2.7 and Package Lab checks.

## Toolbar and search

The filter toggle exposes its expanded state. Column visibility opens a native modal dialog. Toolbar, toolbar-prepend,
and toolbar-append slots remain available; custom controls still own their own disabled state and keyboard behavior.

Search stays backend-neutral. The main demo places a labeled search input in `toolbar-prepend` and updates a `contains`
clause for the `name` column through the existing controlled `filters` prop. Changes from the filter panel synchronize
back to that input through `update:filters`. Local data and provider mode therefore share the existing filter contract,
page reset, debounce, and request cancellation behavior. No new backend-specific search request field is introduced.
Applications can choose their own columns and operators for their search UI.

## Filters

Each native input/select has a visible label containing the column and its role (condition, value, from, or to). Conditions
have readable, translatable labels while emitted operator identifiers remain unchanged. Text, number, date, select,
multiple-select, and between controls use the existing filter schema and slot callbacks. Number inputs emit numbers
(including zero); empty inputs remain empty. Native select indices map back to original option values, including booleans
and numbers, rather than coercing them into strings. Switching to/from `in` normalizes scalar/array values.

A per-column Clear filter button removes that clause; Clear filters removes all clauses. Multi-select uses the browser's
native selection UI and keyboard conventions. Existing `filter.<key>` slots retain `column`, `clause`, `setClause`, and
`clear`; their callbacks are guarded while disabled.

## Columns, export, and focus

Column choices remain a draft until Apply. Closing with Close, Escape, or the backdrop discards unapplied choices on the
next open. Fixed columns are retained; Reset uses the existing persistence reset behavior. Native `dialog.showModal()`
provides modality, the background is inert, Tab/Shift+Tab cycle through enabled controls, and closing restores focus to
the opener. The dialog retains the table's direction and theme. Browsers must support native HTML dialog (or the host
must provide a dialog polyfill); browsers without native dialog support need a host-provided polyfill. Browser automation in this migration used Chrome; Safari/Firefox and assistive-technology certification are not claimed.

The export chooser is a disclosure containing normal buttons, not an ARIA application menu. Enter/Space opens it, Tab
reaches choices, Escape closes it and returns focus, and pointer/focus movement outside dismisses it. Choosing a scope
closes the chooser. Loading/disabled controls block repeated UI exports. Current/all scopes and exporter adapters are
unchanged. Progress uses a labeled native progress element. UI-triggered failures emit the existing export-error event
and show a dismissible localized alert; the public `exportData()` method still rejects for callers to handle themselves.

## Data states and localization

Loading uses a status message and a reduced-motion-aware spinner; the root exposes its busy state. Provider errors use
an alert with a disabled-aware Retry button. Empty data and filtered no-results have distinct messages. The default
no-results view offers Clear filters; custom empty/loading/error/export-progress slots retain their existing contract.
The new message fields are optional, so existing message objects remain valid:

- `close`, `clearFilter`, `filterOperator`, `filterValue`, `filterFrom`, `filterTo`, `filterAny`.
- `filterOperators`: a partial mapping from existing operator identifiers to labels; omitted entries use English defaults.
- `noResults`, `exportFailed`.

Column labels, options, action labels, exporter names, and custom slot content remain owned by the application. The main
demo demonstrates Persian UI messages and RTL without automatically translating its sample column/option data.

## Styling and demo consolidation

Style `.sdt-control`, `.sdt-filter`, `.sdt-dialog`, `.sdt-choice`, `.sdt-export__panel`, `.sdt-state`, and the existing Clarity
variables instead of Vuetify internal classes. Native controls and popup choices follow explicit light/dark color schemes.
No Vuetify component markup or service access remains in production components; the main demo entry also has no Vuetify
imports. The package has no Vuetify or icon-font dependency; legacy host-font overrides still work when supplied by the consumer.

The main demo is the reference for the complete component. Design/foundations/renderer labs remain development fixtures
for targeted comparison and regression tests, not alternate production implementations. Stage 6 removes their links from the public demo and excludes them from the default production build. They remain directly accessible in the dev server; `npm run build:demo:labs` includes them for browser regression tests.
