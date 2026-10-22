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
