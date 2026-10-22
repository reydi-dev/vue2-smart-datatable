# Independent UI foundations (migration stage 3)

Table-owned icons, viewport detection, and the shared Clarity style tokens no longer use Vuetify services. All built-in controls have also migrated in [stage 5](native-controls.md). Vue is now the only required peer; Vuetify is not needed. See the final [package-validation stage](clarity-migration.md).

## Viewport and mobile breakpoint

`mobileBreakpoint` now accepts a nonnegative, finite pixel threshold. The default is `960`: the mobile renderer is used
when the browser viewport is strictly narrower than 960px. A threshold of `0` keeps the desktop renderer. This measures the
viewport, not the table container. Resizing or changing the prop updates the renderer without reloading data or losing
selection. Each mounted table removes its resize listener when destroyed.

```vue
<SmartDataTable :columns="columns" :items="rows" :mobile-breakpoint="768" />
```

The server/initial hydration render uses the desktop layout without accessing browser APIs; viewport detection starts
on mount. Consumers should account for the subsequent mobile layout update when rendering server-side.

The existing string aliases remain supported with fixed ranges matching Vuetify 2's default thresholds:

| Alias       | Mobile renderer when |
| ----------- | -------------------- |
| `xsOnly`    | width < 600px        |
| `smAndDown` | width < 960px        |
| `mdAndDown` | width < 1264px       |
| `mdAndUp`   | width >= 960px       |
| `lgAndUp`   | width >= 1264px      |

The 1264px boundary preserves the default 1280px threshold minus Vuetify 2's 16px scrollbar allowance. These aliases no
longer read custom `$vuetify.breakpoint` settings. Applications with customized Vuetify thresholds should pass the intended
pixel cutoff explicitly. The exported `VuetifyBreakpoint` type remains as a deprecated alias of `LegacyMobileBreakpoint`;
new code can use `MobileBreakpoint`.

## Icons

Default table icons are local inline SVGs. Both the existing `mdi-*` default names and their unprefixed equivalents resolve
to these bundled drawings:

`arrow-up`, `arrow-down`, `filter-variant`, `view-column`, `download`, `content-copy`, `eye`, `eye-off`, `chevron-left`,
`chevron-right`, `dots-vertical`, `refresh`, `check-circle`, `close-circle`.

For example, `mdi-download` and `download` render the same SVG with no external font. This applies to table-owned toolbar,
cell, sort, action, retry, export, and pagination icons. Application-provided icons in custom slots remain host-owned.

`DataTableIcon` accepts a string or an `SvgIconDefinition`. Existing SVG path strings also remain supported. Custom objects
can contain one filled path or multiple paths with an optional view box; use `stroke: true` for a stroke drawing.

```ts
import type { DataTableIcons, RowAction } from 'vue2-smart-datatable'

const icons: Partial<DataTableIcons> = {
  export: 'download',
  next: { path: 'm9 5 7 7-7 7', stroke: true },
}
const actions: RowAction[] = [{ key: 'open', label: 'Open', icon: { path: 'M2 2h20v20H2z', viewBox: '0 0 24 24' } }]
```

Icon cells also accept these definition objects as their values. A formatter can provide an accessible text label for an
icon cell; otherwise its column label is used. Boolean-cell labels are configurable through optional `messages.trueValue`
and `messages.falseValue` strings (English defaults: True and False). Icons adjacent to existing control text are decorative.

Other `mdi-*` names can still render with a host-provided MDI font stylesheet. No font stylesheet is imported by the icon
renderer. Arbitrary font class strings, URLs, HTML, and Vuetify `$...` registry aliases are not resolved. Replace registry
aliases with explicit SVG definitions or use existing custom cell/action slots. SVG definitions are rendered as path
attributes, never as raw HTML.

## Theme and tokens

`theme="light"` and `theme="dark"` set the native foundation palette without a Vuetify theme service. Omitting the prop uses
the light palette, with a compatibility bridge for an existing `.theme--dark` ancestor. An explicit light theme overrides
that bridge. The theme affects all built-in controls, dialogs, desktop/mobile renderers, cells, row actions, and table-owned icons. Custom slot components keep their host configuration.

All tokens and focus/disabled rules are scoped to `.sdt-root`. No stylesheet resets are applied to unrelated app controls.
Customize tokens on the table root:

```vue
<SmartDataTable class="orders-table" theme="light" :columns="columns" :items="rows" />
```

```css
.sdt-root.orders-table {
  --sdt-accent: #365ba8;
  --sdt-accent-soft: #eff4ff;
  --sdt-control-height: 40px;
  --sdt-control-radius: 8px;
}
```

| Group             | Tokens                                                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Palette           | `--sdt-accent`, `--sdt-accent-soft`, `--sdt-surface`, `--sdt-text-color`, `--sdt-muted-color`, `--sdt-border-color`, `--sdt-tint-color`, `--sdt-success-color`, `--sdt-error-color` |
| Text              | `--sdt-font-size`, `--sdt-font-size-small`                                                                                                                                          |
| Spacing           | `--sdt-space-1` through `--sdt-space-6` (4, 8, 12, 16, 20, 24px)                                                                                                                    |
| Shape and density | `--sdt-radius`, `--sdt-control-radius`, `--sdt-control-height`, `--sdt-row-height`, `--sdt-row-height-compact`                                                                      |
| Interaction       | `--sdt-focus-width`, `--sdt-focus-offset`, `--sdt-disabled-opacity`                                                                                                                 |

Space, text, control, and row tokens are consumed by the migrated native controls, renderers, cells, and icons. Row heights
are minimums and can grow for taller content; dense mode uses the compact row token. Focus-visible and native disabled
rules share the same foundation values. Existing event guards remain responsible for disabling interactions.

## Standalone verification page

Run `npm run dev` and open `/foundations.html`. This entry imports Vue, the real icon/pagination components, and the library
stylesheet; it does not import Vuetify or an icon font. It demonstrates explicit light/dark palettes, keyboard focus,
native pagination, custom SVG, RTL arrows, and independently configurable viewport thresholds. This is a development fixture, accessible directly rather than linked from the public main demo. This verifies the migrated foundations, not full removal of Vuetify from the table.

The companion `/renderers.html` page exercises real native desktop/mobile renderers and cells with 13 sample columns.
See the [renderer migration guide](native-renderers.md) for slot, styling, and behavior details.
