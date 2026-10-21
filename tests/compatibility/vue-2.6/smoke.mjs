import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', {
  url: 'http://localhost/',
})

globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.navigator = dom.window.navigator
globalThis.Element = dom.window.Element
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.HTMLBodyElement = dom.window.HTMLBodyElement
globalThis.Node = dom.window.Node
globalThis.getComputedStyle = dom.window.getComputedStyle
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0)
globalThis.cancelAnimationFrame = (handle) => clearTimeout(handle)

const load = createRequire(import.meta.url)
const Vue = load('vue')
const testUtils = load('@vue/test-utils')
const Vuetify = load('vuetify')
const { SmartDataTable } = load('vue2-smart-datatable')
const { mount } = testUtils

Vue.config.productionTip = false
Vue.config.devtools = false
Vue.use(Vuetify)

assert.equal(Vue.version, '2.6.14')
assert.equal(SmartDataTable.options.name, 'SmartDataTable')

const wrapper = mount(SmartDataTable, {
  attachTo: document.getElementById('app'),
  vuetify: new Vuetify(),
  propsData: {
    columns: [
      { key: 'id', label: 'ID', type: 'number', sortable: true },
      { key: 'name', label: 'Name', filterable: true },
    ],
    items: [{ id: 1, name: 'Ada' }],
  },
})

await Vue.nextTick()

assert.match(wrapper.text(), /Ada/)
assert.equal(wrapper.vm.getState().total, 1)
wrapper.destroy()
