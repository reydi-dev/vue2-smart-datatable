# Clarity release preparation

Branch: `clarity-ui-migration`. This checklist follows the completed six implementation stages. It does not authorize
publication, release tags, or deployment.

| Step | Scope                                                                     | Status                                                             |
| ---- | ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1    | Final visual review against Clarity                                       | Agent review and corrections complete; maintainer approval pending |
| 2    | Pack the final candidate and validate in Package Lab                      | Pending, after visual approval                                     |
| 3    | Set the RC version, changelog, upgrade notes and inspect package contents | Pending                                                            |
| 4    | Publish an explicitly approved RC under `next`                            | Pending explicit release approval                                  |
| 5    | Review real-consumer feedback and approve stable release                  | Pending                                                            |

## Step 1 evidence

The actual order example at `/renderers.html` was inspected through the in-app browser at 1280px desktop and 390px
mobile. English/light, Persian/light, and Persian/dark states were reviewed, including expanded details. The 390px
mobile document width matched the viewport (390px). This review covers the source demo, not the previously blocked
Package Lab origin or its outstanding automated resize-width assertion.

Corrections: the desktop search width now follows the reference's 36% proportion; mobile priority uses Yes/No in English;
locale-aware dates/amounts are consistent across desktop/mobile; hiding a column also hides its value in the custom
mobile summary. A DOM regression verifies that column-visibility behavior. The browser test now scopes the direction
assertion to the production table root rather than accidentally matching both the page foundation and table roots.

Validation: 105 unit tests, type checking, lint and formatting passed. The initial full browser run passed 13 tests and
failed one ambiguous locator after the full-table example introduced a nested root; after correcting that locator all
3 targeted renderer browser tests passed. Their web-server build also built all demo entries. No new all-14-pass claim
is made for this run. The existing Package Lab failure remains documented in `consumer-validation.md`.

Source screenshots were saved as `release-step1-desktop-en.png`, `release-step1-mobile-en.png`,
`release-step1-mobile-fa-light.png`, and `release-step1-mobile-fa-dark.png` in the session visualization directory.
They support review rather than claiming pixel-perfect parity. The reference's direct row-navigation arrow and the
production example's labeled Inspect action are intentionally different representations of application-owned actions.
Maintainer confirmation is required before moving to candidate packaging.
