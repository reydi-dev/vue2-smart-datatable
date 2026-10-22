# Public demo and development labs

The public demo is one application built from `examples/index.html`:

| URL fragment             | Example                                                                                                                        | Source                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| No fragment or `#orders` | Approved Clarity order composition: status tabs, search, CSV, column chooser, compact mobile summaries, Persian/RTL and themes | `examples/orders/OrdersDemo.vue` |
| `#data`                  | Generic local/API example: mock provider, typed filters, selection and export                                                  | `examples/DataDemo.vue`          |

Navigation, direct fragment links and browser Back work without server routing rules. Data in both examples is synthetic;
the mock API example does not require a backend. The examples use the source component corresponding to the repository's
release; the npm consumer example in Package Lab separately verifies the published dependency. Order status tabs and
summary/detail composition are application-owned slots, not automatic behavior of every table installation.

## Build and publish

`npm run build:demo` emits only `index.html` and its assets to `dist-demo`. For GitHub Pages use
`SDT_DEMO_BASE=/vue2-smart-datatable/ npm run build:demo`. CI runs package, browser and packed-consumer checks before
building/deploying that public output on `main`. Updating demo-only code does not republish npm.

`examples/App.vue` owns public navigation. Order data lives in `examples/orders/data.ts`, shared with the historical design
prototype so sample values do not diverge. The source-renderer fixture reuses the same order component; it is not a second
implementation of the final appearance.

## Development-only pages

`/design.html`, `/foundations.html` and `/renderers.html` are development fixtures. `npm run dev` serves them and
`npm run build:demo:labs` includes them for browser regressions. They are intentionally absent from the public build and
public navigation. Keep these fixtures and relevant tests: they cover prototype behavior, native foundation boundaries
and renderer edge cases. Person-data tests now target `/#data`; the public-entry regression covers default orders,
mobile selection, switching to the API example, fragment reloads and browser Back.

Package Lab remains separate consumer test infrastructure. Its temporary `/clarity-orders` route is prepared by
`tests/compatibility/package-lab/prepare-orders.mjs` using the shared order example and only public npm exports/slots.
Its access limitation and earlier failed immediate-width assertion remain recorded in the consumer validation report.

## 0.3.0 demo consolidation validation

On 2026-10-23, type checking, lint, formatting, 105 unit tests and all 15 Chrome browser regressions passed locally.
The Pages-base production build passed; the output was inspected to contain exactly one HTML file (`index.html`) with
`/vue2-smart-datatable/assets/` paths. Development HTML entries remain excluded. The default desktop page was also
reviewed in the in-app browser and a screenshot saved as `public-demo-desktop.png` in the session visualization folder.
No library runtime source or npm version changed in this consolidation. Remote CI/deployment is verified separately.
