# UI/UX redesign plan

Status: Clarity selected for refinement; prototype review has led to the first production pagination migration. See the
[implementation stages](clarity-migration.md) for completed and planned work.

This document records the agreed direction and separates it from proposals that still need a decision. It is linked from
the [roadmap](roadmap.md). No release number or delivery date has been assigned.

## Agreed direction

- Design the new experience before replacing the library's existing UI. Include behavior and table states, not just a
  static visual mockup.
- Implement the selected design while removing the mandatory Vuetify dependency. Avoid first rebuilding the old UI
  without Vuetify and then redesigning it again.
- Keep the design independent of Vuetify's components and visual conventions.
- Figma is optional. An isolated HTML/CSS and Vue prototype in the demo can support design exploration and interaction
  review with the available tools.
- Consider future Vue 3 support when defining reusable logic, design tokens, and interaction contracts. Vue 3 support
  itself is outside this phase.

## Current implementation constraints

Vuetify is currently a required peer dependency. The dependency extends beyond styling: renderers, filters, pagination,
menus, dialogs, and cell content use Vuetify controls, and mobile detection uses `$vuetify.breakpoint`.

Existing modules in `src/core` and `src/adapters` provide reusable logic. Some table orchestration still lives in
`SmartDataTable.vue`; assess those boundaries during implementation rather than assuming the core is already fully
independent.

Replacing controls also requires preserving keyboard behavior, focus management, accessible names, and menu/dialog
interactions. Removing the peer dependency alone is not sufficient.

## Initial brief — working assumptions

| Decision           | Proposal                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| Primary audience   | Developers of administration panels and business applications                                     |
| Prototype scenario | Order management with customer, status, amount, date, and row actions                             |
| Visual direction   | Restrained, readable, and suitable for repeated work with data                                    |
| Release scope      | Redesign existing capabilities; add features only where needed to complete a coherent interaction |
| Default experience | A ready-to-use styled table with CSS variables and slots for customization                        |

The maintainer authorized starting with these assumptions. They remain open to revision during prototype review;
Clarity is the maintainer's preferred direction for refinement; production migration has started with pagination.
Support for additional UI-library adapters and a public headless API has not been committed.

## Initial prototype

Run `npm run dev` and open `/design.html` on the URL printed by Vite. The existing demo links to this page. The demo build
also includes this entry, with its own Vue mount and CSS, without importing Vuetify or production table components.

- **Clarity:** warm neutral surfaces, green accent, open spacing, and soft boundaries.
- **Precision:** cool neutral surfaces, blue accent, shorter desktop rows, and explicit column boundaries.

Both directions share the same sample orders and local interactions: search, status and minimum-amount filters, sorting,
selection across pages, column visibility, CSV export, pagination, and an inline order-detail panel. Switch language to
review Persian/RTL; dates use the Gregorian calendar in both languages and amounts use USD. The state selector simulates
loading, error/retry, and no-data presentations; filtering can produce a separate no-results state. No server requests are
made, and prototype logic is not a replacement for the production table engine.

Export defaults to all filtered results; the filter panel also exposes an explicit selected-rows export scope. The header
checkbox selects only the current page. Selection is retained across pages and filters, and its feedback states that scope.
These prototype behaviors are proposals for review, not changes to the published API. Native select controls are used for
the first pass; polished custom popup behavior and light/dark theme decisions remain later work.

### Review tasks

1. Compare both directions with the same filter and selected rows; choose based on readability and daily use.
2. Find a customer, filter by status and minimum amount, and remove individual filters.
3. Select a page, navigate, and verify the selection count and CSV scope.
4. Hide columns, open an order, and return to its trigger using the keyboard.
5. Repeat on a narrow viewport and in Persian; review mixed-direction customer emails and order IDs.
6. Inspect the loading, error, empty, and no-results states.

After selecting a direction, refine the interactions and tokens before migrating production components. Vue 2 Package Lab
will serve as independent consumer validation after implementation, with separate with-Vuetify and without-Vuetify
scenarios; its current setup has not been inspected or changed in this design phase.

### Review feedback: direct page navigation

The maintainer identified that previous/next alone makes distant pages expensive to reach, especially with API-backed
data. The prototype now includes the current/total page count and a localized "Go to page" form. Entering a number only
edits a draft; clicking Go or pressing Enter commits one valid target page. Persian, Arabic-Indic, and Latin digits are
accepted. Empty, fractional, nonnumeric, and out-of-range entries show an inline error without navigating. Navigation is
disabled during simulated loading/error/empty states and when no results exist. Changing filters or page size updates
the valid range and synchronizes the displayed page input when the current page changes.

A sample-dataset selector offers 24 or 800 local sample orders (100 pages at 8 rows) so distant-page navigation can be
reviewed. Switching datasets clears selection and filters. These fixtures are not a performance benchmark.

During production migration, connect committed page changes to the existing controlled pagination/provider flow so that
an offset/page-based API can request the target directly, without loading intermediate pages. Arbitrary page jumps
require a backend that supports them and sufficient total-count information; cursor-only APIs may require different UX.
The prototype remains local and does not verify server request counts.

### Review feedback: more columns on mobile

The sample orders include seven additional optional columns: item count, payment, delivery method, city, priority,
tags, and description. Fixtures cover short and long localized descriptions, multiline instructions, a long unbroken
reference, empty descriptions/tags, and boolean and numeric values. All new columns are enabled initially and can be
hidden from the Columns control.

Desktop keeps the table horizontally scrollable and lets descriptions expand from a single-line preview. Mobile keeps
the original summary and exposes the additional visible fields in each card's native More details disclosure. Descriptions
span the full card width, preserve newlines, and wrap long references; missing values receive a localized label. The
separate order-detail panel also includes these additional visible fields.

A preview-width switch above the page constrains the same layout to 390px for review on a wider screen. Container queries
drive both this preview and natural narrow-screen behavior. This is a layout preview, not device/browser emulation.

### Initial token comparison

The prototype's `examples/design/design.css` defines scoped `--sdt-*` tokens. These values are exploratory, not a new
public styling API.

| Token                      | Clarity   | Precision |
| -------------------------- | --------- | --------- |
| Accent                     | `#087c63` | `#3458c5` |
| Text                       | `#24312e` | `#263044` |
| Border                     | `#e3e9e6` | `#dfe4ed` |
| Surface                    | `#ffffff` | `#ffffff` |
| Desktop row minimum height | `77px`    | `61px`    |
| Workspace radius           | `14px`    | `5px`     |

Focus uses a visible outline; selection uses an accent-tinted surface. Status badges combine text with a colored dot.
Mobile uses an order card with identity, status, customer, amount, date, and a details action, subject to column visibility.

### Existing API inventory for migration

The [current API reference](api.md) remains authoritative. The prototype does not expose or replace these contracts.

| Area                         | Existing contract to account for                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| Data                         | `columns`, `items`, `mode`, `dataProvider`, `normalizeResponse`, `rowKey`                                |
| Controlled state             | `page`, `itemsPerPage`, `sort`, `filters`, selection through `value`/`input`, `visibleColumns`           |
| Extension points             | Header and cell slots, custom filters, toolbar, row actions, mobile summary/details, footer, state slots |
| Integration                  | Provider events, selection and state events, persistence adapters, exporter adapters                     |
| Presentation                 | `messages`, `direction`, `icons`, `dense`, `fixedHeader`, `height`, `rowClass`                           |
| Vuetify-specific assumptions | Named `mobileBreakpoint` values, MDI icon strings, action colors, inherited theme and control behavior   |

Breakpoint semantics, icon rendering, and theme/action-color mapping need explicit migration decisions. Search, active-filter
chips, status shortcuts, and the order-detail panel demonstrate candidate UX; they do not promise new built-in APIs.

### Initial validation

- Type checking, repository lint, and the multi-entry production demo build passed.
- Browser review covered both directions in English and Persian/RTL, cross-page selection, no-results recovery, opening
  order details with focus transfer, and the simulated error state.
- A 390px mobile layout review covered the additional fields and long descriptions in Persian/RTL.
- A full keyboard/accessibility audit, broader device review, further user feedback, and Package Lab validation remain
  outstanding. The prototype is ready for initial visual comparison, not production release.

## Design workflow and deliverables

### 1. Brief and visual exploration

- Confirm audience, scenario, scope, and the main tasks users must complete.
- Inventory existing props, events, slots, and Vuetify-specific assumptions.
- Define initial tokens for color, typography, spacing, density, borders, focus, and interaction states.
- Build two lightweight visual directions using the same representative data and feature scope.
- Keep exploration separate from the production component and independent of Vuetify.

Deliverables: a concise design brief, initial token definitions, and two comparable browser previews.

### 2. Complete the selected experience

Cover the toolbar, sorting, filters, active-filter visibility and clearing, selection feedback, row actions, column
visibility, export scope, and pagination. Identify any additions to current behavior explicitly rather than treating them
as existing capabilities.

Specify the following states and responsive behavior:

- Initial loading, refresh, error with retry, no data, and no matching results.
- Hover, visible keyboard focus, selected, disabled, and in-progress controls.
- Desktop and mobile layouts, including which fields appear in mobile summaries and details.
- LTR and RTL, localized labels, and mixed-direction content such as email addresses.
- Long text, missing values, numbers, amounts, and dates.
- Selection scope across pages and the meaning of each available export scope.

Deliverables: an interactive prototype of the selected direction and documented interaction rules. Decide the first
release's density options and light/dark theme scope here; they are not yet committed.

### 3. Library implementation and release preparation

Reuse existing table logic and progressively replace the Vuetify-dependent presentation. Preserve public contracts where
practical and document intentional changes, including styling and icon customization. Use semantic native controls where
appropriate; evaluate focused dependencies for complex interactions based on maintenance and accessibility needs.

Validate the resulting library in consumer applications both with and without Vuetify. Update installation instructions,
examples, tests, package metadata, and migration guidance to match the final behavior. Do not claim compatibility or
bundle-size improvements without verification.

## Design-phase completion criteria

- The selected visual direction and first-release scope are recorded.
- The interactive prototype demonstrates the agreed table tasks and states on desktop and mobile, in LTR and RTL.
- Keyboard use and focus behavior have been reviewed; unresolved accessibility work is recorded for implementation.
- Representative users, where available, can try finding/filtering records, selecting rows, exporting, clearing filters,
  and recovering from errors; findings and resulting changes are recorded.
- Tokens and interaction rules are sufficient to guide implementation without relying on Vuetify behavior.
- Remaining technical questions and intended public API changes are documented before production migration.

Completing the design phase does not by itself mean the independent library implementation is ready to publish.
