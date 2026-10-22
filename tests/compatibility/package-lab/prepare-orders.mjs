// Prepare the approved order example in an existing disposable Package Lab copy.
// Usage: node tests/compatibility/package-lab/prepare-orders.mjs /absolute/path/to/temporary-lab
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import assert from 'node:assert/strict'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const lab = resolve(process.argv[2] || '')
assert(process.argv[2], 'Supply the disposable Lab path')
const metadata = JSON.parse(readFileSync(resolve(lab, 'package.json'), 'utf8'))
assert.equal(metadata.name, 'vue2-package-lab')
assert.equal(metadata.dependencies['vue2-smart-datatable'], '0.3.0-rc.1')
assert.notEqual(lab, resolve(repo, '../vue2-package-lab'), 'Use a disposable copy, not the original Lab repository')
const output = resolve(lab, 'src/clarity-orders')
mkdirSync(output, { recursive: true })
let page = readFileSync(resolve(repo, 'examples/orders/OrdersDemo.vue'), 'utf8')
// The public example's source link is valid in the consumer as well.
page = page.replace(
  /import SmartDataTable from '@\/components\/SmartDataTable.vue'\nimport \{ createCsvExporter \} from '@\/index'\nimport SmartTableCell from '@\/components\/SmartTableCell.vue'\nimport \{ defaultIcons, defaultMessages \} from '@\/core\/messages'/,
  "import { SmartDataTable, createCsvExporter } from 'vue2-smart-datatable'",
)
page = page.replaceAll("'../design/data'", "'./data'").replace("from '@/types'", "from 'vue2-smart-datatable'")
page = page.replace('components: { SmartDataTable, SmartTableCell }', 'components: { SmartDataTable }')
page = page.replace('    icons: defaultIcons,\n', '').replace('        :icons="icons"\n', '')
page = page.replace('messages(): DataTableMessages', 'messages(): Partial<DataTableMessages>')
page = page
  .replace('            ...defaultMessages,\n', '')
  .replace(
    "{ ...defaultMessages, export: 'Export CSV', trueValue: 'Yes', falseValue: 'No' }",
    "{ export: 'Export CSV', selectRow: 'Select row', trueValue: 'Yes', falseValue: 'No' }",
  )
// Named public slots let all other desktop cells retain the package's native renderer.
const cellStart = page.indexOf('        <template #cell="context"')
const cellEnd = page.indexOf('      </SmartDataTable>', cellStart)
assert(cellStart > 0 && cellEnd > cellStart)
page =
  page.slice(0, cellStart) +
  `        <template v-slot:[\`cell.customer\`]="{ row }">
          <div class="renderer-person">
            <span class="renderer-avatar">{{ row.initials }}</span>
            <span><strong>{{ row.customer }}</strong><small><bdi>{{ row.email }}</bdi></small></span>
          </div>
        </template>
        <template v-slot:[\`cell.status\`]="{ row }">
          <span class="renderer-status" :class="\`renderer-status--\${row.status}\`">
            <i aria-hidden="true" />{{ statusLabel(row.status) }}
          </span>
        </template>
` +
  page.slice(cellEnd)
// Mobile details in this approved layout are plain application-owned values.
page = page.replace(/ {16}<SmartTableCell[\s\S]*?\/>/, '                <bdi>{{ detailText(row, column) }}</bdi>')
page = page.replace(
  '    columnShown(key: string): boolean {',
  `    detailText(row: Order, column: DataTableColumn<Order>): string {
      const detail = this.mobileDetail(column)
      const value = row[column.key as keyof Order]
      const formatted = detail.formatter ? detail.formatter(value, row, detail) : value
      return formatted === null || formatted === undefined || formatted === '' ? '—' : String(formatted)
    },
    columnShown(key: string): boolean {`,
)
assert(
  !page.includes("'@/") &&
    !page.includes('SmartTableCell') &&
    !page.includes('defaultIcons') &&
    !page.includes('defaultMessages'),
)
writeFileSync(resolve(output, 'ClarityOrders.vue'), page)
writeFileSync(resolve(output, 'data.ts'), readFileSync(resolve(repo, 'examples/orders/data.ts'), 'utf8'))
const routerPath = resolve(lab, 'src/router.ts')
let router = readFileSync(routerPath, 'utf8')
if (!router.includes("path: '/clarity-orders'")) {
  router = router.replace(
    '  routes: [',
    "  routes: [\n    { path: '/clarity-orders', component: () => import('./clarity-orders/ClarityOrders.vue'), meta: { title: 'Clarity Orders · npm RC' } },",
  )
}
writeFileSync(routerPath, router)
const appPath = resolve(lab, 'src/App.vue')
let app = readFileSync(appPath, 'utf8')
if (!app.includes("$route.path === '/clarity-orders'")) {
  app = app.replace(
    '<AppLayout />',
    `<router-view v-if="$route.path === '/clarity-orders'" />\n    <AppLayout v-else />`,
  )
}
writeFileSync(appPath, app)
const layoutPath = resolve(lab, 'src/app/layout/AppLayout.vue')
let layout = readFileSync(layoutPath, 'utf8')
if (!layout.includes("to: '/clarity-orders'")) {
  layout = layout.replace(
    '    navigation: [',
    "    navigation: [\n      { label: 'Clarity Orders · npm RC', to: '/clarity-orders', icon: 'mdi-table' },",
  )
}
writeFileSync(layoutPath, layout)
