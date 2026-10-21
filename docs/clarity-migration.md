# Clarity implementation stages

Work branch: `codex/clarity-ui-migration`.

The maintainer selected Clarity and approved the prototype's direct page navigation and expanded mobile examples.
Implementation proceeds in independently reviewable commits. This checklist tracks library migration separately from
the exploratory [design plan](ui-ux-redesign.md). No package publication, release tag, or Vue 3 implementation is included.

## Stages

1. **Design baseline — complete.** Preserve the interactive design lab, its isolated build entry, mobile-width preview,
   sample data, and design decisions in a dedicated commit. The production table still uses Vuetify.
2. **Production pagination — complete.** Transferred the approved page count and explicit page-jump form to the real
   table. Pagination uses native form controls with localized labels and validation. A provider integration test verifies
   that a committed jump requests only the target page. Existing props/events, icon overrides, and RTL arrows are retained;
   icons still use Vuetify until stage 3. The prototype and library share the localized page-input parser.
3. **Independent UI foundations — planned.** Establish scoped Clarity tokens, a consistent focus/disabled system,
   independent icon rendering, and responsive detection. Document migration for Vuetify breakpoint and icon assumptions.
4. **Desktop, mobile, and cells — planned.** Transfer the table and mobile disclosures to native markup, preserve slots,
   support dense layouts and long/missing/mixed-direction content, and verify row/action/selection behavior.
5. **Toolbar, filters, columns, export, and states — planned.** Replace remaining controls, preserve custom extension
   points, complete localization and loading/error/no-results behavior, and review focus and keyboard navigation.
6. **Package and consumer validation — planned.** Remove the required Vuetify peer only after production code no longer
   depends on it. Update install/demo/API/migration documentation and validate packed consumers with and without Vuetify,
   Vue 2.6 compatibility, browser interactions, and API request behavior. Inspect Package Lab before modifying it.

## Commit and validation policy

- Commit each completed stage with a message describing its resulting behavior; record meaningful deviations here.
- Preserve unrelated local changes. The first commit contains only the design work produced in this conversation and
  this execution plan.
- Run checks appropriate to each change. Behavior changes require targeted tests, including provider integration when
  data requests are affected. Run the repository's release checks before the final package-validation stage is complete.
- Keep the library usable between stages. Partial removal of Vuetify controls does not imply that its peer dependency
  can already be removed.
- Do not claim Package Lab or independent-consumer validation until those checks actually run.

## Current validation

The design baseline has passed TypeScript, lint, formatting, and the demo production build. Browser review has exercised
the selected Clarity direction, Persian/RTL mobile details and long/missing values, column visibility, cross-page selection,
and explicit jumps in a 100-page local fixture. A complete accessibility and cross-device review remains outstanding.

Production pagination validation passed: 47 unit tests (including provider integration), 5 browser tests using installed
Chrome, package build and declaration generation, 3 distribution tests, and `npm pack --dry-run`. Browser tests cover
Enter submission, rejected out-of-range input, mobile navigation, and the existing demo's behavior. The bundled Playwright
Chromium was unavailable locally; the repository's existing browser-channel option was used instead of downloading it.
Package Lab and the independent Vue 2.6 consumer have not been revalidated in this stage.
