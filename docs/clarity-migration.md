# Clarity implementation stages

Work branch: `clarity-ui-migration`.

The maintainer selected Clarity and approved the prototype's direct page navigation and expanded mobile examples.
Implementation proceeds in independently reviewable commits. This checklist tracks library migration separately from
the exploratory [design plan](ui-ux-redesign.md). No package publication, release tag, or Vue 3 implementation is included.

## Stages

1. **Design baseline — complete.** Preserve the interactive design lab, its isolated build entry, mobile-width preview,
   sample data, and design decisions in a dedicated commit. The production table still uses Vuetify.
2. **Production pagination — complete.** Transferred the approved page count and explicit page-jump form to the real
   table. Pagination uses native form controls with localized labels and validation. A provider integration test verifies
   that a committed jump requests only the target page. Existing props/events, icon overrides, and RTL arrows are retained;
   icons were retained in this stage and are replaced by inline SVG in stage 3. The prototype and library share the localized page-input parser.
3. **Independent UI foundations — complete.** Table-owned icons use local SVG with explicit custom definitions and a
   legacy host-font fallback. Viewport observation replaces `$vuetify.breakpoint`, with numeric cutoffs and documented
   legacy aliases. Scoped Clarity tokens define explicit palettes, focus, disabled states, and future renderer geometry.
   The [UI foundations guide](ui-foundations.md) documents migration and a standalone page without Vuetify imports.
4. **Desktop, mobile, and cells — complete.** Native table, selection, mobile disclosures, row actions, and cells now use
   Clarity styles. Slots are retained; dense/sticky layouts, keyboard activation, and long/missing/mixed-direction content
   are covered. The [native renderer guide](native-renderers.md) records behavior and consumer CSS migration. A standalone
   `/renderers.html` entry exercises real components with 13 columns and no Vuetify imports.
5. **Toolbar, filters, columns, export, and states — complete.** Native controls, localized filter conditions, column
   drafts and modal focus, export disclosure/progress/failure, and loading/error/no-results states now share Clarity styles.
   Slots and provider/export contracts remain available. The main demo uses the full component without Vuetify imports,
   with search through existing filters, Persian/RTL, and explicit themes. See the [control migration guide](native-controls.md).
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

Stage 3 validation passed: 83 unit tests, 8 Chrome browser tests, package/declaration build, 3 distribution tests, and the
multi-entry demo build. Tests exercise bundled/custom SVG icons without a Vuetify instance, safe handling of icon values,
legacy viewport boundaries, SSR-safe observation and listener cleanup, live renderer changes with retained selection,
native-control themes/focus, and a standalone entry that makes no icon-font requests. Mobile/desktop layout checks also
cover unintended page overflow. Type checking, lint, and formatting passed. Independent Vue 2.6 and Package Lab validation
remain scheduled for the final consumer-validation stage; this step does not remove the Vuetify peer dependency.

Stage 4 validation passed: 96 unit tests, the 11-test Chrome browser suite, package/declaration build, 3 distribution
tests, demo production build, type checking, lint, formatting, and `npm pack --dry-run`. The 3 renderer browser tests
were rerun after the final mobile copy/link layout adjustment. Coverage includes named cell/action slots with default
fallbacks, native mixed selection, nested controls, guarded actions, dense rows, sticky headers, RTL long/empty/multiline
values, disabled-but-readable mobile details, and light/dark styling. Manual review covered 1280px desktop and 390px
Persian mobile. A page-overflow issue from offscreen screen-reader placeholders was fixed and covered by the desktop
browser test. Package Lab and independent Vue 2.6 validation remain pending stage 6. Next: stage 5 controls and states.

Stage 5 validation passed: 104 unit tests, 14 Chrome browser tests, type checking, lint, formatting, package/declaration
build, 3 distribution tests, demo production build, and `npm pack --dry-run`. New coverage verifies original boolean
option types, numeric ranges and zero, scalar/multiple filter transitions, custom filter callbacks, column draft/fixed
column behavior, modal Tab/Shift+Tab/Escape/focus restoration, export scope/download and guarded failures, no-results
recovery, and disabled states. The complete main demo makes no font requests and has no Vuetify component markup.
Manual review covered the main desktop view and Persian/RTL dark mobile column dialog at 390px. Native dialog focus
cycling was tightened after a keyboard regression test exposed a boundary case. Package peer removal, independent
Vue 2.6/Package Lab validation, older-browser compatibility, and final demo-fixture consolidation remain stage 6 work.
