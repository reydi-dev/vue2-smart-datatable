# README media

## Vector overview

`clarity-responsive.svg` is a true vector illustration: SVG text, shapes and paths, with no embedded raster images,
`foreignObject`, scripts or external fonts. It presents equal-height desktop/mobile panels in one 1440 × 1000 canvas,
replacing the earlier JPEG gallery and its unequal image heights. The illustration follows the Clarity demo composition;
it is not a pixel-exact browser export or proof that every consumer uses this layout.

The eight desktop rows and the first mobile order come from `examples/orders/data.ts`. Typography and spacing are curated
for the README; some controls/columns are omitted to keep the overview readable. The mobile panel represents filtering to
`ORD-1048` with details expanded. Both the image and README caption link to the actual interactive demo.

Regenerate from a repository checkout with development dependencies installed:

```sh
node scripts/generate-readme-preview.mjs
```

The generator uses the existing TypeScript development dependency to load the shared dataset. No runtime or development
dependency was added. After changing the source composition, inspect the SVG at normal size and zoomed in, check text
clipping/overlap, validate the XML and confirm the two frame heights before committing the regenerated asset.

## Captured animation

`clarity-demo.gif` was captured on 2026-10-23 from the deployed [order demo](https://reydi-dev.github.io/vue2-smart-datatable/#orders)
with synthetic data. It is 1150 × 367, four captured states held for 2.2s, 2.2s, 0.7s and 2.6s (7.7s total):
All orders → Processing → All orders → search `Lana`. It is a stepped demonstration of real results, not continuous screen
recording. Frames share a 256-color palette and loop. The static vector and live-demo links remain alternatives.

To refresh the GIF, use the in-app browser's screenshot API. Keep a consistent viewport/table crop, read actual element
bounds, capture settled states after each interaction and restore the demo afterward. Do not fabricate query results or
include private consumer data. Encoding used `gifenc` 1.0.3 and `jpeg-js` 0.4.4 outside the repository; no encoding
dependencies were added to the project. Decode/inspect the result and check timing, dimensions and file size.

These are documentation assets, not changes to the library runtime or new browser-compatibility evidence. GitHub displays
the current README; npm will receive the updated README with a future package release.
