# README media

Captured on 2026-10-23 from the deployed [Clarity order demo](https://reydi-dev.github.io/vue2-smart-datatable/#orders).
These are screenshots of the running component with synthetic data, not generated UI mockups.

- `clarity-orders.jpg`: 1280 × 1142, full-page light/English desktop capture at the browser's default viewport. Search is empty and all orders are shown. The image links to the interactive demo.
- `clarity-demo.gif`: 1150 × 367, four captured states assembled with holds of 2.2s, 2.2s, 0.7s and 2.6s (7.7s total). The sequence is All orders → Processing → All orders → search `Lana`. It is a stepped demonstration of real results, not continuous screen recording. Frames share a 256-color palette and loop; the static image and live-demo links remain alternatives.

## Refreshing the media

Use the deployed demo and the in-app browser's screenshot API. Keep the same viewport and table crop throughout the GIF.
Read the actual card/first-row bounds before choosing a crop; do not hard-code this crop for a redesigned page. Capture
settled states after each interaction, and clear the search/return to All orders when done. Do not replace real results
with fabricated rows or controls. Keep the public screenshot free of credentials and private consumer data.

The GIF was encoded outside the project using `gifenc` 1.0.3 and `jpeg-js` 0.4.4 to decode the browser's JPEG frames.
No media-encoding dependencies were added to the library or its development toolchain. Inspect the frame contents and
encoded file, check actual image formats/dimensions and keep total media size small before updating the README.

This is README documentation work. It does not change the table runtime, republish npm or establish additional browser
compatibility. The published npm README will update with a future package release; GitHub shows the current repository README.
