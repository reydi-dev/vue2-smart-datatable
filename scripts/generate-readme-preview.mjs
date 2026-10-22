import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// Draw a vector illustration from the demo dataset, not a raster screenshot export.
const source = readFileSync(new URL('../examples/orders/data.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const { orders } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const escape = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const colors = { text: '#26352f', muted: '#6a7b74', border: '#dfe7e4', accent: '#087f68', tint: '#f6f9f7' }
const parts = []
const rect = (x, y, w, h, fill = '#fff', radius = 0, stroke = colors.border) =>
  parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`)
const text = (x, y, value, size = 15, fill = colors.text, weight = 400, extra = '') =>
  parts.push(
    `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${escape(value)}</text>`,
  )
const line = (x1, y1, x2, y2) =>
  parts.push(`<path d="M${x1} ${y1}H${x2}V${y2}" fill="none" stroke="${colors.border}"/>`)
const circle = (x, y, r, fill) => parts.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`)
const button = (x, y, w, label, primary = false) => {
  rect(x, y, w, 40, primary ? colors.accent : '#fff', 8, primary ? colors.accent : colors.border)
  text(x + w / 2, y + 25, label, 14, primary ? '#fff' : colors.text, 550, 'text-anchor="middle"')
}
const search = (x, y, w, label) => {
  rect(x, y, w, 42, '#fff', 8)
  parts.push(
    `<g stroke="${colors.muted}" stroke-width="1.7" fill="none"><circle cx="${x + 21}" cy="${y + 20}" r="6"/><path d="M${x + 25} ${y + 25}l5 5"/></g>`,
  )
  text(x + 42, y + 26, label, 14, colors.muted)
}
const status = (x, y, value, w = 115) => {
  const tone = { completed: '#22794e', processing: '#486aaf', pending: '#996b1b', cancelled: '#b24c4c' }[value]
  rect(x, y, w, 29, value === 'completed' ? '#edf8f1' : colors.tint, 6)
  circle(x + 13, y + 15, 3, tone)
  text(x + 23, y + 20, value[0].toUpperCase() + value.slice(1), 13, tone, 500)
}
const check = (x, y) => rect(x, y, 16, 16, '#fff', 3, '#8b9992')
const date = (value) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(value),
  )
const amount = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
const tabs = (x, y, mobile = false) => {
  const entries = mobile
    ? [
        ['All orders', '24', 135],
        ['Completed', '9', 135],
        ['Processing', '6', 135],
      ]
    : [
        ['All orders', '24', 156],
        ['Completed', '9', 155],
        ['Processing', '6', 151],
        ['Pending', '6', 135],
        ['Cancelled', '3', 140],
      ]
  let cursor = x
  for (const [label, count, width] of entries) {
    const active = cursor === x
    text(cursor, y, label, 15, active ? colors.accent : colors.muted, active ? 650 : 400)
    const countX = cursor + label.length * 8 + 8
    rect(countX, y - 17, 27, 23, active ? '#eaf6f1' : colors.tint, 5, 'none')
    text(countX + 13.5, y, count, 13, active ? colors.accent : colors.muted, 550, 'text-anchor="middle"')
    if (active) parts.push(`<path d="M${cursor} ${y + 19}h${width - 20}" stroke="${colors.accent}" stroke-width="3"/>`)
    cursor += width
  }
}
parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1000" viewBox="0 0 1440 1000" role="img" aria-labelledby="title description">
<title id="title">Clarity table — desktop and mobile</title>
<desc id="description">Vector illustration of the order demo. Eight desktop orders and an expanded mobile card for Olivia Rhye use the same sample data. Both panels have equal height. See the live demo for actual behavior.</desc>
<defs><clipPath id="desktop"><rect x="28" y="120" width="932" height="852" rx="18"/></clipPath><clipPath id="mobile"><rect x="984" y="120" width="428" height="852" rx="18"/></clipPath></defs>
<g font-family="Arial, Helvetica, sans-serif">`)
rect(0, 0, 1440, 1000, '#f3f7f5', 0, 'none')
text(30, 43, 'CLARITY / VUE 2', 13, colors.accent, 700, 'letter-spacing="2"')
text(30, 83, 'One table. Every screen.', 32, colors.text, 700)
text(1384, 80, 'DESKTOP + MOBILE', 12, colors.muted, 600, 'text-anchor="end" letter-spacing="1.5"')
rect(28, 120, 932, 852, '#fff', 18)
rect(984, 120, 428, 852, '#fff', 18)
parts.push('<g clip-path="url(#desktop)">')
text(52, 164, 'Orders', 25, colors.text, 700)
rect(151, 142, 36, 28, colors.tint, 6)
text(169, 161, orders.length, 14, colors.text, 500, 'text-anchor="middle"')
text(52, 194, 'Track, filter, and manage customer orders.', 15, colors.muted)
tabs(52, 240)
line(28, 260, 960, 260)
search(52, 280, 432, 'Search by customer or order ID…')
button(508, 281, 91, 'Filters')
button(611, 281, 111, 'Columns')
button(734, 281, 202, '↓  Export CSV', true)
rect(29, 342, 930, 46, colors.tint, 0, 'none')
line(28, 342, 960, 342)
check(52, 357)
for (const [x, label] of [
  [92, 'Order'],
  [231, 'Customer'],
  [496, 'Status'],
  [669, 'Amount'],
  [794, 'Order date'],
])
  text(x, 371, label, 14, colors.muted)
orders.slice(0, 8).forEach((row, index) => {
  const y = 388 + index * 60
  check(52, y + 22)
  text(92, y + 34, row.id, 14, colors.text, 550)
  circle(245, y + 30, 17, '#eaf6f1')
  text(245, y + 34, row.initials, 10, colors.accent, 550, 'text-anchor="middle"')
  text(274, y + 25, row.customer, 15, colors.text, 600)
  text(274, y + 44, row.email, 12, colors.muted)
  status(496, y + 16, row.status)
  text(754, y + 34, amount(row.amount), 15, colors.text, 550, 'text-anchor="end"')
  text(794, y + 34, date(row.date), 14, colors.muted)
  line(28, y + 60, 960, y + 60)
})
text(52, 910, 'Rows per page', 14, colors.muted)
button(166, 885, 65, '8  ⌄')
text(500, 910, '1–8 of 24', 14, colors.muted)
button(595, 885, 40, '‹')
text(650, 910, '1 of 3', 14, colors.text, 600)
button(706, 885, 40, '›')
text(762, 910, 'Go to page', 13, colors.muted)
button(840, 885, 42, '1')
button(892, 885, 44, 'Go')
parts.push('</g><g clip-path="url(#mobile)">')
text(1008, 164, 'Orders', 25, colors.text, 700)
rect(1108, 142, 36, 28, colors.tint, 6)
text(1126, 161, '24', 14, colors.text, 500, 'text-anchor="middle"')
text(1008, 194, 'Track, filter, and manage customer orders.', 14, colors.muted)
tabs(1008, 240, true)
line(984, 260, 1412, 260)
search(1008, 278, 380, 'ORD-1048')
button(1008, 334, 84, 'Filters')
button(1104, 334, 100, 'Columns')
button(1216, 334, 172, '↓  Export CSV', true)
line(984, 391, 1412, 391)
const row = orders[0]
check(1008, 413)
text(1040, 427, '#' + row.id, 15, colors.text, 700)
status(1263, 407, row.status, 125)
text(1040, 462, row.customer, 17, colors.text, 600)
text(1040, 484, date(row.date), 13, colors.muted)
text(1388, 464, amount(row.amount), 18, colors.text, 650, 'text-anchor="end"')
line(1008, 505, 1388, 505)
text(1008, 536, 'More details', 15, colors.accent)
text(1388, 536, '⌃', 17, colors.accent, 500, 'text-anchor="end"')
const field = (x, y, label, value) => {
  text(x, y, label, 13, colors.muted)
  text(x, y + 25, value, 16)
}
field(1008, 576, 'Email', row.email)
field(1008, 641, 'Items', row.items)
field(1220, 641, 'Payment', 'Unpaid')
field(1008, 706, 'Delivery', 'Express')
field(1220, 706, 'City', row.city.en)
field(1008, 771, 'Priority', row.priority ? 'Yes' : 'No')
field(1220, 771, 'Tags', 'Gift · Fragile')
text(1008, 836, 'Description', 13, colors.muted)
text(1008, 861, 'Gift order. Please remove the price tag', 15)
text(1008, 883, 'and include a handwritten note.', 15)
line(984, 904, 1412, 904)
text(1008, 946, '1–1 of 1', 13, colors.muted)
button(1110, 920, 38, '‹')
text(1163, 945, '1 of 1', 14, colors.text, 600)
button(1221, 920, 38, '›')
button(1271, 920, 52, '1')
button(1335, 920, 53, 'Go')
parts.push('</g></g></svg>')
writeFileSync(fileURLToPath(new URL('../docs/assets/clarity-responsive.svg', import.meta.url)), parts.join('\n') + '\n')
