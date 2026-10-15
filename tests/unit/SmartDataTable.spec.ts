import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import { describe, expect, it, vi } from 'vitest'
import SmartDataTable from '@/components/SmartDataTable.vue'
describe('SmartDataTable', () => {
  it('renders text safely and emits selection', async () => {
    const wrapper = mount(SmartDataTable, {
      vuetify: new Vuetify(),
      propsData: {
        columns: [{ key: 'name', label: 'Name' }],
        items: [{ id: 1, name: '<b>unsafe</b>' }],
        selectable: true,
      },
      attachTo: document.body,
    })
    expect(wrapper.html()).toContain('&lt;b&gt;unsafe&lt;/b&gt;')
    expect(wrapper.find('b').exists()).toBe(false)
    const checkbox = wrapper.findAllComponents({ name: 'v-checkbox' }).at(1)
    await checkbox.vm.$emit('change', true)
    expect(wrapper.emitted('input')?.[0][0]).toEqual([1])
    wrapper.destroy()
  })

  it('loads from the provider when mode changes to server', async () => {
    const dataProvider = vi.fn().mockResolvedValue({ items: [{ id: 2, name: 'Server row' }], total: 1 })
    const wrapper = mount(SmartDataTable, {
      vuetify: new Vuetify(),
      propsData: {
        columns: [{ key: 'name', label: 'Name' }],
        items: [{ id: 1, name: 'Local row' }],
        dataProvider,
      },
    })

    await wrapper.setProps({ mode: 'server' })
    await new Promise((resolve) => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    expect(dataProvider).toHaveBeenCalledOnce()
    expect(wrapper.text()).toContain('Server row')
    wrapper.destroy()
  })

  it('opens default filters when no custom filter slots are provided', async () => {
    const wrapper = mount(SmartDataTable, {
      vuetify: new Vuetify(),
      propsData: {
        columns: [{ key: 'name', label: 'Name', filterable: true }],
        items: [{ id: 1, name: 'Ada' }],
      },
    })

    wrapper.findComponent({ name: 'SmartTableToolbar' }).vm.$emit('toggle-filters')
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'SmartTableFilters' }).exists()).toBe(true)
    expect(wrapper.find('.sdt-filter').exists()).toBe(true)
    wrapper.destroy()
  })
})
