# Roadmap

`vue2-smart-datatable` is a stable, UI-framework-independent table for maintained Vue 2.6+ applications. Clarity `0.3.0`
provides the current desktop/mobile UI, and Vue is the only required peer dependency.

## Current priorities

- Fix reproducible defects and installation blockers.
- Keep Vue 2.6 and 2.7 packed-consumer coverage green on Node.js 18+.
- Improve copyable examples, search discoverability, and migration guidance when real users expose a gap.
- Preserve the current provider, slot, export, responsive, RTL, and accessibility contracts.

## Deliberately deferred

The following ideas will be considered only when a concrete consumer need justifies their API and maintenance cost:

- multiple sort clauses and advanced filter composition;
- saved table-state presets;
- additional exporter adapters;
- performance modes for very large local datasets.

## Vue 3

Vue 3 support belongs in a separate package so this library can keep a predictable Vue 2 contract. The existing provider,
filter, pagination, export, responsive, and design-token decisions can guide that implementation without delaying Vue 2
maintenance.

Historical Clarity design and migration decisions remain available in the [UI/UX plan](ui-ux-redesign.md),
[migration stages](clarity-migration.md), and [consumer validation report](consumer-validation.md).
