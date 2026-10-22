# Clarity release preparation

Branch: `clarity-ui-migration`. This checklist follows the completed six implementation stages. It does not authorize
publication, release tags, or deployment.

| Step | Scope                                                                     | Status                                                           |
| ---- | ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1    | Final visual review against Clarity                                       | Approved by maintainer after source-demo visual review           |
| 2    | Pack the final candidate and validate in Package Lab                      | Automated checks passed; fresh Package Lab manual review pending |
| 3    | Set the RC version, changelog, upgrade notes and inspect package contents | Pending                                                          |
| 4    | Publish an explicitly approved RC under `next`                            | Pending explicit release approval                                |
| 5    | Review real-consumer feedback and approve stable release                  | Pending                                                          |

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
The maintainer subsequently approved this appearance explicitly; step 1 is closed and candidate validation may proceed.

## Step 2 evidence

The approved source at `6daffc0` was rebuilt and packed locally, with only the step-1 approval documentation changed.
The package version remains `0.2.0`; no version selection, tag, deployment or publication was performed.

Fresh validation passed: package/declaration build, 105 unit tests, 4 distribution tests and the complete 14-test source-demo
Chrome suite. Four isolated packed consumers passed on Vue 2.6.14 and 2.7.16, each with and without a Vuetify 2.6.15 host.
Every consumer installation was reproduced with `npm ci`. These checks exercise DOM behavior, not four browser engines.

The same tarball was installed in the existing temporary Package Lab copy; clean installation, type checking and production
build passed. Installed JavaScript and CSS hashes match the candidate. The original Package Lab repository remains unchanged.
The temporary server was restarted on the same origin, with Vite dependency re-optimization, for maintainer review.
No browser automation was rerun against the previously blocked Lab origin. Its historical immediate resize-width failure
remains unresolved by automation; a fresh manual resize/detail check of this candidate has been requested.
Step 2 remains open until that manual response is recorded. See [consumer validation](consumer-validation.md) for hashes
and scope. Step 3 (RC version and release documentation) has not started.
