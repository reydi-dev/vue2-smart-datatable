import assert from 'node:assert/strict'
import process from 'node:process'
import console from 'node:console'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', { url: 'http://localhost/' })
for (const name of ['window', 'document', 'navigator', 'Element', 'HTMLElement', 'HTMLBodyElement', 'Node']) {
  Object.defineProperty(globalThis, name, { value: dom.window[name], configurable: true, writable: true })
}
globalThis.getComputedStyle = dom.window.getComputedStyle
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0)
globalThis.cancelAnimationFrame = (handle) => clearTimeout(handle)

const load = createRequire(import.meta.url)
const Vue = load('vue')
const { mount } = load('@vue/test-utils')
const { SmartDataTable } = load('vue2-smart-datatable')
const metadata = JSON.parse(
  readFileSync(resolve(dirname(load.resolve('vue2-smart-datatable')), '../package.json'), 'utf8'),
)
assert.deepEqual(Object.keys(metadata.peerDependencies), ['vue'])
assert.equal(Vue.version, process.env.SDT_VUE_VERSION || '2.6.14')
Vue.config.productionTip = false
Vue.config.devtools = false
let vuetify
if (process.env.SDT_WITH_VUETIFY === '1') {
  const Vuetify = load('vuetify')
  Vue.use(Vuetify)
  vuetify = new Vuetify()
} else {
  assert.throws(() => load.resolve('vuetify'), 'The native consumer must have no Vuetify installed')
}
const warnings = []
Vue.config.warnHandler = (message) => warnings.push(message)
const rows = Array.from({ length: 101 }, (_, index) => ({
  id: index + 1,
  name: `Person ${index + 1}`,
  note: 'Long delivery instructions',
}))
const columns = [
  { key: 'id', label: 'ID', type: 'number', sortable: true, hideable: false },
  { key: 'name', label: 'Name', filterable: true },
  { key: 'note', label: 'Note', type: 'expandable-text' },
]
let exported = false
const exporter = {
  key: 'test',
  label: 'Test',
  scopes: ['current'],
  async export(context) {
    assert.equal(context.rows.length, 25)
    context.reportProgress(100)
    exported = true
  },
}
const wrapper = mount(SmartDataTable, {
  attachTo: document.getElementById('app'),
  ...(vuetify ? { vuetify } : {}),
  propsData: { columns, items: rows, selectable: true, exporters: [exporter] },
})
await Vue.nextTick()
assert.match(wrapper.text(), /Person 1/)
assert.equal(wrapper.findAll('tbody tr').length, 25)
assert.equal(wrapper.find('.v-input, .v-btn, .v-data-table').exists(), false)
await wrapper.findAll('.sdt-checkbox').at(1).setChecked(true)
// Vue 2 may attach its reactive Array prototype; compare selected values across Node versions.
assert.deepEqual(Array.from(wrapper.emitted('input')[0][0]), [1])
await wrapper.find('.sdt-sort-button').trigger('click')
assert.equal(wrapper.vm.getState().sort.direction, 'asc')
wrapper.findComponent({ name: 'SmartTableToolbar' }).vm.$emit('toggle-filters')
await Vue.nextTick()
await wrapper.find('.sdt-filter input').setValue('Person 101')
await Vue.nextTick()
assert.equal(wrapper.findAll('tbody tr').length, 1)
wrapper.vm.resetFilters()
await Vue.nextTick()
await wrapper.vm.exportData('test', 'current')
assert.equal(exported, true)
Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true, writable: true })
window.dispatchEvent(new dom.window.Event('resize'))
await Vue.nextTick()
assert.equal(wrapper.find('.sdt-mobile').exists(), true)
assert.equal(wrapper.find('input.sdt-checkbox').element.checked, true)
wrapper.destroy()

const requests = []
const server = mount(SmartDataTable, {
  ...(vuetify ? { vuetify } : {}),
  propsData: {
    columns,
    mode: 'server',
    dataProvider: async (request) => {
      requests.push(request.page)
      return { items: [rows[0]], total: 2500 }
    },
  },
})
const settle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 10))
  await Vue.nextTick()
}
await settle()
const pagination = server.findComponent({ name: 'SmartTablePagination' })
await pagination.find('input').setValue('۳')
await pagination.find('input').setValue('۳۰')
assert.deepEqual(requests, [1])
await pagination.find('form').trigger('submit')
await settle()
assert.deepEqual(requests, [1, 30])
server.destroy()
assert.deepEqual(warnings, [])
console.log(
  `Packed consumer passed: Vue ${Vue.version}, ${vuetify ? 'Vuetify host' : 'no Vuetify'}, native controls, filters, selection, mobile, export, direct provider jump`,
)
