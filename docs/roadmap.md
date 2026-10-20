# Roadmap

The first stable `0.1.0` release targets Vue 2.7 and Vuetify 2.6 applications.

## 0.1.0 release checks

- Validate the API through the live demo and release candidate.
- Test the package in independent consumer projects ([validation record](consumer-validation.md)).
- Confirm that the stable npm tarball installs, builds, and passes the package lab browser tests.

Release automation is a possible follow-up after the first stable version; the initial release uses the existing CI and a manual npm publish.

## Possible later work

- multiple sort clauses;
- reusable advanced-filter composition;
- saved table-state presets;
- additional exporter adapters maintained outside the core bundle;
- documented calendar and localization integrations;
- performance work for very large local datasets.

Items are intentionally not assigned to a version until their API and maintenance cost are understood.
