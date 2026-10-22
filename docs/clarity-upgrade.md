# Upgrading to Clarity

These changes are in the migration branch; they do not publish an npm version or deploy the hosted demo. Test the local
packed candidate before rolling it into an application. Existing published versions retain their previous requirements.

## Installation

Vue `>=2.6.14 <3` is the only peer dependency. Import `vue2-smart-datatable/styles.css` once. No Vuetify setup, `v-app`,
MDI font, or online icon service is required by the table. Keep Vuetify and its stylesheet if the rest of your application
uses them. Remove them from your application only after confirming they were exclusively supporting the old table.

## Preserved contracts

Provider/normalizer requests, one-based pagination, controlled state and events, column persistence, exporter adapters,
custom cells/headers/filters/actions, and toolbar/state slots remain available. Direct page jumps commit only on Go or
Enter, accepting Latin/Persian/Arabic digits; typing does not issue intermediate page requests.

## Review in your application

- Replace consumer CSS and DOM-based tests targeting Vuetify table, checkbox, dialog, or expansion-panel internals with
  native `.sdt-*` classes or semantic selectors. See [renderers](native-renderers.md) and [controls](native-controls.md).
- Action colors accept the documented semantic tokens or CSS colors. Vuetify palette expressions require conversion.
- Default icons are local SVG. Other `mdi-*` names need a host-supplied font, or an explicit SVG definition/custom slot.
  Vuetify icon-registry aliases must become explicit definitions. See [foundations](ui-foundations.md).
- `mobileBreakpoint` defaults to a numeric 960px viewport cutoff. Legacy aliases retain their documented fixed ranges;
  customized Vuetify breakpoint settings are no longer read. A zero cutoff forces desktop.
- Explicit `theme="light"` or `theme="dark"` controls the whole native UI. An existing dark ancestor remains a compatibility
  bridge when the theme prop is omitted. Use scoped Clarity variables rather than Vuetify theme classes for customization.
- Mobile disclosure is separate from selection and row activation. It remains readable while disabled. Desktop long
  text has a preview; mobile details show full text. Missing values use a labeled em dash; zero and false remain values.
- Column visibility uses native HTML dialog. Browser environments must support `showModal()` and modal dialog behavior,
  or supply a compatible polyfill. This migration does not promise obsolete-browser compatibility merely because Vue 2
  supports it. Keyboard behavior is covered in Chrome; Safari/Firefox and screen-reader certification are not claimed.
- Translate optional condition/value/range/close/no-results/export-failure messages alongside application-owned column,
  action, and option labels. Native multi-select follows browser/platform keyboard conventions.

## Demos and verification

The public demo has one entry using the real table and a local/server mode switch. Design/foundation/renderer pages are
retained only as development fixtures: `npm run dev` serves them directly, and `npm run build:demo:labs` packages them for
browser regression tests. The default `npm run build:demo` includes only the main page and its assets.

The packed compatibility fixture and CI matrix exercise Vue 2.6.14 and 2.7.16, each in a native-only consumer and a Vuetify
host. See [consumer validation](consumer-validation.md) for actual results, scope, and any remaining acceptance checks.
