# Changelog

## Unreleased

- Replaced built-in Vuetify UI with native Clarity desktop/mobile renderers, filters, column dialog, export controls, and states. Vue is now the only peer dependency; no icon font is required.
- Added explicit page jumps (including Persian/Arabic digits), independent viewport detection, inline SVG overrides, light/dark themes, and keyboard-accessible native interactions.
- Retained public slots/provider/export contracts and legacy breakpoint/icon aliases. Custom CSS targeting Vuetify internals and Vuetify color names must migrate; see [Clarity migration](docs/clarity-migration.md).
- Refreshed the main demo and kept development labs outside its default production build. Extended packed-consumer coverage to Vue 2.6/2.7 with and without a Vuetify host.

## 0.2.0 - 2026-10-21

- Expanded the supported Vue peer range to Vue 2.6.14 and lowered the Node.js floor to 18.18, backed by an independent packed-package compatibility test.
- Improved npm and GitHub discoverability metadata for Vue 2, Vuetify 2, data-table, server-side, and RTL searches.
- Clarified the package's maintained legacy-app focus and its TypeScript, provider, responsive, and safe-export advantages.

## 0.1.0 - 2026-10-21

- First stable release for Vue 2.7 and Vuetify 2.6 applications.
- Promoted the tested release candidate without changes to the public API.

## 0.1.0-rc.1 - 2026-10-21

- Made disabled table controls and actions consistently unavailable to pointer and keyboard users.
- Prevented outdated server responses from replacing current rows after a new request or mode change.
- Validated the packed package in an independent Vue 2/Vuetify 2 consumer and the package lab.

## 0.1.0-beta.3 - 2026-10-19

- Included linked documentation and community files in the npm package.
- Removed an unresolved stylesheet import from generated TypeScript declarations while preserving the built CSS entry point.

## 0.1.0-beta.2 - 2026-10-15

- Fixed the filter panel crash when using the default filters.
- Added a copyable server-side data provider example and expanded provider documentation.

## 0.1.0-beta.1 - 2026-10-14

- New backend-neutral `SmartDataTable` implementation.
- Local and server modes, filters, sorting, pagination, selection, responsive layout, visibility persistence, and optional CSV export.
- No dependency on Nuxt, Vuex, Router, global helpers, or project-specific services.
- First public npm release candidate with a tested package build and live demo.
