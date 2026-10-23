# Repository social preview

Upload `social-preview.png` under repository Settings → General → Social preview.
The 1280 × 640 image adapts the README vector illustration into a desktop/mobile
composition. It is an illustration of the demo, not a pixel-exact browser capture.

Regenerate the SVG after updating the README artwork:

```sh
node scripts/generate-social-preview.mjs
```

Render the SVG to PNG in Chromium at a 1280 × 640 viewport and device scale 1.
Use a browser renderer so text anchors and clipping are preserved. Inspect the
PNG before uploading, including its readability at half size.
