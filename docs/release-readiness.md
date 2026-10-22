# Clarity release preparation

Branch: `clarity-ui-migration`. This checklist follows the completed six implementation stages. It does not authorize
publication, release tags, or deployment.

| Step | Scope                                                                     | Status                                                                      |
| ---- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1    | Final visual review against Clarity                                       | Approved by maintainer after source-demo visual review                      |
| 2    | Pack the final candidate and validate in Package Lab                      | Completed: automated checks and maintainer manual acceptance                |
| 3    | Set the RC version, changelog, upgrade notes and inspect package contents | Completed: 0.3.0-rc.1 packed and inspected                                  |
| 4    | Publish an explicitly approved RC under `next`                            | Completed: published under next and registry consumer passed                |
| 5    | Review real-consumer feedback and approve stable release                  | Stable publication authorized; see decision and remaining unreported checks |

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
remains unresolved by automation. The maintainer refreshed the updated candidate, selected a row, narrowed the window,
waited for the layout to settle and opened its details. They explicitly confirmed retained selection and no clipping or
horizontal scrolling. This is maintainer-reported manual acceptance, not an automated pass. Step 2 is complete on that
basis. See [consumer validation](consumer-validation.md) for hashes and scope. The validated step-2 tarball remains the
historical `0.2.0` artifact; step 3 assigns the new RC identity separately.

## Step 3 release candidate

Prepared version: `0.3.0-rc.1`, targeting a future stable `0.3.0`. This pre-1.0 minor advances the `0.2.0` line because
Clarity changes UI integration (consumer CSS/DOM selectors, color/icon conventions and breakpoint configuration), even
though the provider/state/slot contracts are retained. The changelog identifies the candidate as unpublished, and the
upgrade guide covers local installation, migration checks, browser limits and a complete consumer rollback.

A read-only npm registry check before preparation reported `latest: 0.2.0` and `next: 0.1.0-rc.1`; `0.3.0-rc.1` was not
among published versions. These are point-in-time observations, not claims that tags cannot change before publication.
Package and lockfile versions match. `publishConfig.tag` is `next` for this prerelease, to avoid an accidental default
promotion to `latest`; stable release preparation must review that setting again.

Publication, git tags, pushing and demo deployment have not been performed. Step 4 requires explicit approval of the
actual candidate and a fresh registry/version check. The intended npm operation is `npm publish <reviewed-tarball> --tag next`,
using the exact reviewed file rather than a freshly packed working tree. After any approved publication, verify registry
integrity and `next`/`latest` tags, then install the exact published RC into an isolated consumer. Any runtime changes
require another candidate validation; retain the documented Lab manual-acceptance limitation.

### Candidate inspection results

Package/declaration build, all 4 distribution tests, lint and formatting passed. The exact RC tarball also passed the
packed DOM smoke fixture in the existing isolated Vue 2.7.16 consumer without Vuetify. Its ESM, CJS and CSS files are
byte-for-byte identical to the step-2 accepted candidate; the full unit/browser/four-way consumer results remain step-2
evidence rather than new reruns. No Lab browser rerun is claimed.

The reviewed tarball contains 50 files (78,372 bytes compressed; 283,670 bytes unpacked). ESM/CJS, CSS, declarations,
README, changelog, license and migration documentation are present; all package export targets resolve within the tarball.
Source, tests, examples, node_modules, development demo output and source maps are absent.

Artifact: `vue2-smart-datatable-0.3.0-rc.1.tgz`, saved with `package-manifest.json` under the session visualization directory's
`release-candidate/` folder (outside the Git working tree).

- SHA-256: `504b777dbe6891b787ff8c680e9d4a9c9deff4b064c224dfc0cccbb359097b78`.
- npm integrity: `sha512-JWdOrTpaYmJrLNl8wyDppFcS5cHzvhU/i/7+xAwj17eL7sqjrcp1SOErFmTFxvvdSNsgaavQvPOpgEfs3I8Xpw==`.

This report was completed after packing; the tarball includes the preparation plan rather than its own final hash report.
Do not silently repack and publish a different artifact. If this file is lost, regenerate and inspect a candidate, record
its new integrity and obtain approval of that concrete file before publishing. Step 3 is complete; step 4 remains pending
explicit publication approval. No git release tag was created.

## Step 4 publication

The maintainer explicitly approved publication of the reviewed `0.3.0-rc.1` artifact on 2026-10-23 (Asia/Tehran).
Before publishing, the working tree was clean, its SHA-256 matched the step-3 report, npm identity was `reydi-dev`, and
registry `latest` was `0.2.0`. The version was not already published.

The exact reviewed tarball was submitted with `npm publish <reviewed-tarball> --tag next --access public`.
npm accepted the publication, then took about a minute to expose version metadata; the initial E404/ETARGET responses
were followed by successful registry verification, without submitting another publication.
Registry integrity matches the step-3 SHA-512 exactly, with SHA-1 `d592ce5a04dd598ccfd9e70de74accadba6cbc0e`.
`next` now points to `0.3.0-rc.1`; `latest` remains `0.2.0`. No stable promotion, git release tag, push or demo deployment
was performed. The published archive retains the preparation-time unpublished notices because that approved file was
published unchanged; repository documentation now records the actual release status.

The exact published version was installed from npm in the isolated Vue 2.7.16 consumer without Vuetify. Its lockfile
resolves to the registry tarball (not the local file) with the verified integrity. A clean `npm ci` reproduced that
installation and the DOM smoke fixture passed native controls, filters, selection, mobile switching, export and direct
provider pagination. This is not a new Lab browser run. Step 4 is complete; step 5 (real-application feedback and explicit
stable-release approval) remains pending.

## Step 5 consumer feedback

The maintainer chose Package Lab as the acceptance consumer for now. The isolated Lab copy now installs the exact
published RC from npm with matching integrity; clean installation, type checking and production build passed.
The same local origin was restarted for review. Temporary version labels now identify the RC correctly; the original
Lab working tree remains unchanged. No new Lab browser automation or production-application feedback is claimed.

The [RC acceptance checklist](rc-acceptance.md) tracks local/provider behavior, error recovery, persistence/export and
mobile/RTL review. Its results and stable-release approval are pending. Starting step 5 does not authorize stable
publication; an accepted RC must still be prepared and reviewed as a concrete stable artifact before that approval.

### Step 5 order comparison follow-up

The maintainer reported that the generic `/local` page still appeared different from the approved order example.
The disposable Lab now has a dedicated `/clarity-orders` route mounting the same application-owned order composition
against the registry RC using only public exports/slots. The source fixture's private cell/default imports are replaced
with named public cell slots and plain consumer-owned mobile detail formatting. No library runtime changed and no new
package was published. The original Lab repository remains unchanged. Consumer type checking/build and repository lint
passed. See [RC acceptance](rc-acceptance.md) for the reproducible preparation script and review scope.
The maintainer subsequently approved the consumer-route appearance explicitly on 2026-10-23. Visual acceptance is
complete; remaining functional acceptance results are pending. Step 5 stays open and stable publication is not authorized.

## Stable 0.3.0 preparation

On 2026-10-23 (Asia/Tehran), the maintainer explicitly requested stable `0.3.0` publication rather than moving to `1.0.0`.
This later instruction authorizes preparing and publishing the stable artifact; the previously requested additional manual
functional results remain unreported and are not recorded as passes. Consumer appearance was approved, and historical
unit/browser/packed-consumer and manual resize evidence retains its original scope and limitations.

Stable metadata and migration/release notes are prepared; `publishConfig.tag` is now `latest`. The stable artifact must
be built and inspected against the approved RC, including declarations. Publication uses that reviewed tarball, followed
by registry integrity/tag verification and clean consumer installation. No unrelated runtime changes, git push, release
tag or hosted-demo deployment are included in this authorization.

## Stable 0.3.0 publication evidence

Published on 2026-10-23 (Asia/Tehran) using the maintainer's explicit instruction. Build/declaration generation, 4
distribution tests, lint and formatting passed. All distributed JavaScript, CSS and declaration files were compared
byte-for-byte with the approved RC and matched. Package exports resolve to included files; source, tests, examples,
node_modules and demo build output are absent. The final tarball passed the isolated Vue 2.7.16 native-consumer smoke
fixture before publication. The full unit/browser/four-way results remain earlier evidence; no new Lab browser run or
unreported manual functional pass is claimed.

Artifact: `vue2-smart-datatable-0.3.0.tgz`, retained with `package-manifest.json` in the session visualization directory's
`stable-release/` folder. It contains 51 files, 82,814 compressed bytes. The exact inspected artifact was published with
`--tag latest --access public`; registry processing initially returned E404 until the version became available.

- SHA-256: `850ea11e85ede6e6f65131ea4a691976718ce4290c594ec6e059f12be4abbf65`.
- Registry SHA-1: `5ac530d6bf37c168366a3c6afacd2873d47b6a13`.
- Registry integrity: `sha512-PhkJimnBVGNdt5XTC+WxF5IiImTYNzduUTs3uEl33Oc0nZKSk/2owdVEaMuAYtSj86juE0VgXVBLcbQ6feiE+A==`.

Registry integrity matches the reviewed tarball. `latest` is `0.3.0`; `next` remains `0.3.0-rc.1`.
No git release tag, push, hosted-demo deployment or modification of the original Lab repository was performed.
This final evidence was written after packing; the published archive contains the preparation decision rather than its
own final integrity report. Earlier checklist snapshots in this document are historical; this section records the
maintainer's subsequent stable-publication decision. Remaining manual checks stay unreported in `rc-acceptance.md`.

Post-publication verification passed: the exact stable version was installed from npm in the isolated Vue 2.7.16 consumer
without Vuetify, followed by `npm ci` and the DOM smoke fixture (controls, filters, selection, mobile switching, export and
direct provider jump). Its lockfile resolves to the registry tarball with the matching stable integrity. Stable
publication and its registry-consumer verification are complete under the maintainer's recorded acceptance decision.

## GitHub Release 0.3.0

On 2026-10-23 (Asia/Tehran), the maintainer explicitly requested the GitHub Release follow-up. No existing `v0.3.0` tag
or release was present. An annotated `v0.3.0` tag was created and pushed at stable publication commit
`fc085da9796eb2e0623c085fcdcfe7ceceefd58b`; later demo and CI-fixture changes remain on `main` rather than changing this
release's source identity. The stable npm artifact was not rebuilt or republished.

[GitHub Release v0.3.0](https://github.com/reydi-dev/vue2-smart-datatable/releases/tag/v0.3.0) was published as a non-draft,
non-prerelease and marked latest. Its notes include install instructions, Clarity features, live demo/API links, the
migration guide and validation scope. The exact notes are retained in [releases/0.3.0.md](releases/0.3.0.md).
The public GitHub latest-release response was verified to identify `v0.3.0` and contain the prepared notes unchanged.
The tag's peeled commit was checked against `fc085da`. This step does not claim new manual functional acceptance.
