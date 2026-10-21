# Roadmap

The current package targets Vue 2.6+ and requires Vuetify 2.6+. The package version in `package.json` is `0.2.0`;
the `0.1.0` checklist below is retained as historical release context.

## Next: UI/UX design, then independent UI implementation

The agreed direction is to design the new table experience first, then implement that design while removing the
mandatory Vuetify dependency. There is no separate project to reproduce the current UI without Vuetify before redesigning it.

See the [UI/UX redesign plan](ui-ux-redesign.md) for decisions, proposed scope, open choices, and completion criteria.
Recording this plan does not start prototype development; the initial brief and visual directions are awaiting maintainer
confirmation.

1. Define the design brief and release scope; explore two visual directions in an isolated, interactive prototype.
2. Refine the selected direction across desktop, mobile, RTL, and table states.
3. Implement the design in the library, reuse existing logic, and replace Vuetify-dependent UI and breakpoint behavior.
4. Validate accessibility, behavior, consumer integration, and migration guidance before release.

Vue 3 support remains a future goal. Shareable logic, design tokens, and interaction contracts should support that goal;
the redesign does not promise a Vue 3 release or a single implementation compatible with both Vue versions.

## Historical: 0.1.0 release checks

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
