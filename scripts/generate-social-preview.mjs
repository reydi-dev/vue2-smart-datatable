import { readFileSync, writeFileSync } from 'node:fs'

// Reuse the README illustration, not a pixel-exact browser screenshot.
const source = readFileSync(new URL('../docs/assets/clarity-responsive.svg', import.meta.url), 'utf8')
const artwork = source.slice(source.indexOf('<defs>'), source.lastIndexOf('</svg>'))
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640" role="img" aria-labelledby="title description">
<title id="title">Smart Data Table for Vue 2 — desktop and mobile</title>
<desc id="description">Adapted vector illustration of the order demo: a desktop table beside an expanded mobile card. Server-side data, responsive layouts and RTL support.</desc>
<rect width="1280" height="640" fill="#f3f7f5"/>
<g font-family="Arial, Helvetica, sans-serif">
  <text x="40" y="57" font-size="36" font-weight="700" fill="#26352f">Smart Data Table for Vue 2</text>
  <text x="40" y="96" font-size="21" fill="#53665e">One table. Every screen.</text>
  <g font-size="15" font-weight="600" text-anchor="middle" fill="#087f68">
    <rect x="830" y="37" width="125" height="36" rx="18" fill="#e4f4ed"/>
    <text x="892.5" y="61">Server-side</text>
    <rect x="967" y="37" width="147" height="36" rx="18" fill="#e4f4ed"/>
    <text x="1040.5" y="61">Responsive</text>
    <rect x="1126" y="37" width="74" height="36" rx="18" fill="#e4f4ed"/>
    <text x="1163" y="61">RTL</text>
  </g>
  <text x="40" y="131" font-size="12" font-weight="700" letter-spacing="2" fill="#6a7b74">DESKTOP</text>
  <text x="968" y="131" font-size="12" font-weight="700" letter-spacing="2" fill="#6a7b74">MOBILE</text>
</g>
<defs>
  <clipPath id="desktop-frame"><rect x="40" y="146" width="850" height="460" rx="16"/></clipPath>
</defs>
<g clip-path="url(#desktop-frame)">
  <svg x="40" y="146" width="850" height="460" viewBox="28 120 932 505" preserveAspectRatio="xMinYMin meet">${artwork}</svg>
</g>
<rect x="40" y="146" width="850" height="460" rx="16" fill="none" stroke="#dfe7e4"/>
<svg x="968" y="146" width="232" height="460" viewBox="984 120 428 852" preserveAspectRatio="xMidYMin meet">${artwork.replaceAll('id="desktop"', 'id="mobile-desktop"').replaceAll('id="mobile"', 'id="mobile-card"').replaceAll('url(#desktop)', 'url(#mobile-desktop)').replaceAll('url(#mobile)', 'url(#mobile-card)')}</svg>
</svg>
`
writeFileSync(new URL('../.github/assets/social-preview.svg', import.meta.url), svg)
