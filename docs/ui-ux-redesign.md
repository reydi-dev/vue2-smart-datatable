# UI/UX redesign plan

Status: planning recorded; design brief and prototype work have not started.

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

## Proposed starting brief — not yet approved

| Decision           | Proposal                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| Primary audience   | Developers of administration panels and business applications                                     |
| Prototype scenario | Order management with customer, status, amount, date, and row actions                             |
| Visual direction   | Restrained, readable, and suitable for repeated work with data                                    |
| Release scope      | Redesign existing capabilities; add features only where needed to complete a coherent interaction |
| Default experience | A ready-to-use styled table with CSS variables and slots for customization                        |

These are starting assumptions, not committed requirements. Confirm or revise them before building the visual directions.
Support for additional UI-library adapters and a public headless API has not been committed.

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
