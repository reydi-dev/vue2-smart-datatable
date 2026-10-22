# Clarity RC acceptance

Candidate: `vue2-smart-datatable@0.3.0-rc.1` from npm. Review started 2026-10-23 (Asia/Tehran).
The maintainer selected Package Lab as the acceptance consumer for now. This is a test-bench review, not evidence of
production use in another application. Stable publication requires the review results and separate explicit approval.

## Prepared environment

The existing isolated copy of Lab source `a2b66d8` at `/private/tmp/sdt-clarity-review-eyj9_4dv/package-lab` now installs
the exact registry RC, replacing its older file dependency. `npm ci`, type checking and production build passed on
Vue 2.7.16 with a Vuetify 2.6.16 host. The lockfile resolves to the npm registry tarball and its integrity matches the
published candidate in [release readiness](release-readiness.md). The original Lab repository remains unchanged.

The temporary server runs at `http://127.0.0.1:4176`. Only the temporary Lab's visible version labels/links and obsolete
Vuetify-breakpoint description were corrected after the build to identify the actual RC and independent breakpoint.
No table behavior or host layout was changed. Its pre-existing host chunk-size warning remains.

The earlier source-demo, independent-consumer and manual resize evidence remains recorded in
[consumer validation](consumer-validation.md). No new browser automation is claimed for the previously blocked Lab origin.
Do not route around that restriction. The earlier immediate-width automated failure remains unresolved; manual acceptance
does not convert it into a pass.

## Maintainer review

Refresh the pages before reviewing. Record a result for each group; if something fails, include the page, action,
expected/actual result, viewport and a screenshot where useful. This review has no arbitrary waiting-period requirement.

| Group                  | Page                         | Actions and expected result                                                                                                                                                                           | Status  |
| ---------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Local data             | `/local`                     | Sort Name, use a Name filter, change page/page size, select a row and use Inspect. Rows and selection indicators respond correctly.                                                                   | Pending |
| Provider data          | `/server`                    | Change a filter and commit a valid direct page jump. Loading ends with the requested rows; typing a page number alone does not commit a jump. This fixture has only as many pages as its data allows. | Pending |
| Recovery               | `/scenarios`                 | Choose Empty result, then Fail once, then Retry; press Retry. Empty/error states are understandable and the retry returns rows.                                                                       | Pending |
| Persistence and export | `/scenarios`, features table | Hide Email, apply and refresh: it stays hidden. Export CSV and open the download: headers and data are readable.                                                                                      | Pending |
| Mobile and RTL         | `/scenarios`, features table | Select a row, toggle RTL, narrow the window, wait for layout, open details. Selection persists; text and controls have no clipping or whole-page horizontal scroll.                                   | Pending |

## Stable-release gate

The test-bench results are pending. No production-application feedback has been claimed. Before stable publication:

- Record the maintainer's results and resolve any blocking defect; a runtime fix requires another RC and validation.
- Carry forward the explicit browser-support and unresolved automated Lab-width limitations.
- Prepare stable `0.3.0` metadata and release notes from the accepted RC; review the prerelease `publishConfig.tag` setting.
- Build, pack and inspect the stable artifact, confirming any runtime changes relative to the accepted RC.
- Obtain explicit approval of that concrete stable release before publishing under `latest`.

No stable publication, tag, push or hosted-demo deployment is authorized by starting this review.

## Approved order composition in the registry consumer

Following maintainer feedback that `/local` still shows the generic Lab composition, the disposable Lab now includes
`http://127.0.0.1:4176/clarity-orders`. This route presents the approved order composition without the Lab's surrounding
intro/status cards and navigation drawer. Vuetify remains registered in the consumer and its global CSS remains loaded;
this route is a composition comparison, not evidence of all host-shell behavior. `/local`, `/server` and `/scenarios`
remain available for the generic functional acceptance groups above.

The reproducible preparation script is `tests/compatibility/package-lab/prepare-orders.mjs`:

```sh
node tests/compatibility/package-lab/prepare-orders.mjs /absolute/path/to/disposable-package-lab
```

It requires an existing Lab copy pinned to registry RC `0.3.0-rc.1` and rejects the original sibling Lab path.
It copies the approved example's data, styles and application-owned composition. Unlike the source fixture, it imports
only public package exports: `SmartDataTable`, `createCsvExporter` and types. Named customer/status cell slots retain the
package's default desktop rendering for other columns. The approved plain mobile details are formatted in the consumer's
own slot; no private cell component, source alias or default-message/icon module is imported. App-owned message overrides
are partial, allowing the installed package to provide its defaults. No source copy of the table or library CSS replaces
the npm dependency. The route and navigation entry are added only to the disposable Lab; rerunning the script is idempotent.

Validation: the consumer's TypeScript checks and Vite production build passed with the new route (43 modules,
including a separate order-page chunk). Repository lint passed. The original Lab repository remains clean. The existing
host chunk-size warning remains. Direct visual review at the restricted origin was not performed, and no screenshot or
browser pass is claimed. Source-demo visual approval does not establish this new consumer route's visual acceptance.

The maintainer explicitly approved the appearance of `/clarity-orders` on 2026-10-23. This is maintainer-reported
visual acceptance of the registry consumer composition, not an automated browser result or confirmation that every
functional scenario has passed. Visual comparison is closed. The remaining behavior checks (search/status tabs, selection,
column visibility, CSV and the generic provider/recovery scenarios above) remain pending explicit results. Earlier
manual resize acceptance remains recorded; it does not establish a fresh pass for every RTL/theme combination.
