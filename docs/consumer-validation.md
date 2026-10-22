# Clarity migration candidate validation

Date: 2026-10-22. Work branch: `clarity-ui-migration`. Local package version: `0.2.0`; no npm publication, release tag,
or hosted-demo deployment was performed. The earlier release-candidate report is preserved below as history.

## Package and repository checks

Vue is the only peer dependency. A clean root `npm ci` installs neither Vuetify nor the MDI font. Source-level tests now
run without registering the Vuetify plugin. Package ESM/CJS/CSS/declaration build, 104 unit tests, 4 distribution tests,
14 Chrome browser tests, and type/lint/format checks passed. The default production demo build emits only the main page;
the browser-test build explicitly includes development labs.

## Packed consumers

The same local tarball was installed in four temporary consumers, each reproduced with `npm ci`. All four passed:

| Vue    | Host                         | Result |
| ------ | ---------------------------- | ------ |
| 2.6.14 | Native, no Vuetify installed | Passed |
| 2.6.14 | Vuetify 2.6.15               | Passed |
| 2.7.16 | Native, no Vuetify installed | Passed |
| 2.7.16 | Vuetify 2.6.15               | Passed |

These are DOM compatibility tests of the packed CJS component: native controls, typed filters, row selection, live mobile
switching, export adapters, and a provider jump that requests exactly pages 1 and 30. They are not separate browser-engine
certifications. The CI job now covers this same matrix on Node 18; local execution used Node 24.21.0. CI has not been run
remotely during this migration.

The tested tarball's SHA-256 was `db05f0d48129009f75dfdd1dd3a94ca1f6314019510f44f7e5804ed67f70cce3`. Documentation was refined
after packing; runtime output and the Vue-only peer contract were unchanged. Runtime SHA-256 values:

- ESM: `3220a9ed87ac7b18439fdf369c4ffe048c2b7217ec675c7ed0ff69ed61207a84`.
- CJS: `86a426f3e8c3d1949766175f49b0c4184d84cf6b7b07a30cdcf38c1fcd091f0d`.
- CSS: `03b73becf49a4e26ab3b19f73413f74c30022a096b90aa40e36326f74821424d`.

## Package Lab acceptance — completed by maintainer manual review

The local Package Lab at source commit `a2b66d8` was inspected and copied to a temporary directory. Its repository and
working tree were not modified. Only the temporary copy's dependency/lockfile and browser channel were changed; two extra
regression tests from `tests/compatibility/package-lab/clarity.browser.ts` were added to that copy.

The tarball installation was reproduced with `npm ci`; type checking and production build passed. The original 10
browser tests passed, including server filters/races, retry, persistence, CSV, mobile, and RTL. The additional 100-page
API test passed and observed exactly one initial request plus one request to page 30; invalid page 101 made no request.
The additional host-coexistence test verified slots, action events, native table controls, host-font icon fallback,
selection retention, and opening mobile details, but failed its immediate whole-page width assertion after resizing:
383px document width in a 360px viewport. The retained screenshot shows the host navigation drawer partially visible;
a transitional host layout is a possibility, not a verified diagnosis. The automated assertion remains failed/unrerun; stable-layout acceptance was completed manually as recorded below.

Direct browser inspection remained blocked by the tool's saved origin-access permission despite the maintainer's
explicit authorization. The maintainer opted to finish with available evidence and manual review. After reviewing the
provided screenshots, a focused local-table check was requested: select a row, narrow the window, wait for the host layout
to settle, and open that row's details. The maintainer explicitly confirmed that selection persists and there is no
clipping or horizontal scrolling. This is user-reported manual acceptance, not an agent-observed or automated pass.
Stage 6 is closed on that basis. The earlier immediate-width failure remains recorded and the regression fixture remains
available for a future automated rerun when access is restored; its cause has not been established conclusively.

A final local rerun of formatting, lint, 104 unit tests, package/declaration build, 4 distribution tests, the single-entry
production demo build, and package dry-run passed. The previously passed browser/packed-consumer results above remain
historical evidence; they were not rerun through another browser surface to bypass the origin restriction.

## Compatibility limits

Browser automation used installed Chrome. Safari/Firefox, obsolete browsers, and assistive-technology certification are
not claimed. The built-in column dialog requires native `showModal()` behavior or a compatible host-provided polyfill.

---

# Historical: consumer validation for the 0.1.0 release candidate

Validation date: 2026-10-21. Source commit: `a736abc38ea2e0a53f951b77ca0629e71afafb22`.

The candidate was built from `main` and packed as an npm tarball. Its SHA-1 was `86ed7534ce140ec365ed50f34272cb3f08fb7b2d`. The tarball included the ESM and CJS builds, CSS, TypeScript declarations, README, and linked documentation. This is a **local candidate tarball**; the published `0.1.0-beta.3` on npm does not contain the changes made after that release.

## Independent consumers

1. In an isolated copy of [vue2-package-lab](https://github.com/reydi-dev/vue2-package-lab), the candidate tarball was installed as a `file:` dependency. A clean `npm ci` reproduced that installation. Type-check and production build passed, and all 10 Playwright browser tests passed. These tests cover local and server data, rapid filters, error and retry states, CSV export, mobile layouts, and RTL.
2. A separate minimal Vue 2.7, Vuetify 2.6, and Vite consumer installed the same tarball. Its production build passed, and the built page rendered a table row in the browser. A mobile detail panel opened successfully.

Neither consumer project in its repository was modified. Both checks used temporary copies.

## Published release candidate

The published `0.1.0-rc.1` was installed from npm in a temporary copy of the package lab on 2026-10-21. Its registry tarball SHA-1 (`f7b0ab3f33c1cec21b52112de0083491ce620bad`) matched the locally checked package. The consumer type-check and production build passed, as did all 10 desktop and mobile browser tests. npm's `next` tag pointed to `0.1.0-rc.1`; `latest` remained on the previous beta until the stable release.

## Dependency risk

The minimal consumer's production audit reported advisories through the Vue 2 and Vuetify 2 peer dependencies. Its `vue2-smart-datatable` finding was inherited from those peers, rather than a separate advisory for this package's code. The upstream issues and application responsibilities are described in [Security](security.md). The Vue 2 and Vuetify 2 version contract cannot be upgraded to their newer major versions within this release.
