# Consumer validation for the 0.1.0 release candidate

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
