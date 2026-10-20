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

  it('lets keyboard users activate rows when row-click is observed', async () => {
    const onRowClick = vi.fn()
    const wrapper = mount(SmartDataTable, {
      vuetify: new Vuetify(),
      propsData: {
        columns: [{ key: 'name', label: 'Name' }],
        items: [{ id: 1, name: 'Ada' }],
      },
      listeners: { 'row-click': onRowClick },
    })

    const row = wrapper.find('tbody tr')
    expect(row.attributes('tabindex')).toBe('0')
    await row.trigger('keydown.enter')
    await row.trigger('keydown.space')
    expect(onRowClick).toHaveBeenCalledTimes(2)
    wrapper.destroy()
  })

  it('disables built-in interactions without blocking later re-enablement', async () => {
    const onRowClick = vi.fn()
    const wrapper = mount(SmartDataTable, {
      vuetify: new Vuetify(),
      propsData: {
        columns: [{ key: 'name', label: 'Name', sortable: true, filterable: true }],
        items: [{ id: 1, name: 'Ada' }],
        selectable: true,
        actions: [{ key: 'open', label: 'Open' }],
        disabled: true,
      },
      listeners: { 'row-click': onRowClick },
    })

    const desktop = wrapper.findComponent({ name: 'SmartTableDesktop' })
    expect(wrapper.find('tbody tr').attributes('tabindex')).toBeUndefined()
    expect(wrapper.find('thead .sdt-sort-button').attributes('disabled')).toBe('disabled')
    expect(wrapper.findAllComponents({ name: 'v-checkbox' }).at(1).props('disabled')).toBe(true)

    await wrapper.find('tbody tr').trigger('click')
    desktop.vm.$emit('select-row', { row: { id: 1, name: 'Ada' }, selected: true })
    desktop.vm.$emit('row-action', { action: { key: 'open' } })
    wrapper.findComponent({ name: 'SmartTableToolbar' }).vm.$emit('toggle-filters')
    await wrapper.vm.$nextTick()

    expect(onRowClick).not.toHaveBeenCalled()
    expect(wrapper.emitted('input')).toBeUndefined()
    expect(wrapper.emitted('row-action')).toBeUndefined()
    expect(wrapper.findComponent({ name: 'SmartTableFilters' }).exists()).toBe(false)

    await wrapper.setProps({ filters: { name: { operator: 'contains', value: 'Ada' } } })
    wrapper.vm.resetFilters()
    expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({})

    await wrapper.setProps({ disabled: false })
    desktop.vm.$emit('select-row', { row: { id: 1, name: 'Ada' }, selected: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('input')?.[0][0]).toEqual([1])
    wrapper.destroy()
  })

  it('keeps local state when a server request finishes after switching modes', async () => {
    let resolveProvider!: (value: unknown) => void
    const dataProvider = vi.fn(
      () =>
        new Promise<unknown>((resolve) => {
          resolveProvider = resolve
        }),
    )
    const wrapper = mount(SmartDataTable, {
      vuetify: new Vuetify(),
      propsData: {
        columns: [{ key: 'name', label: 'Name' }],
        items: [{ id: 1, name: 'Local row' }],
        mode: 'server',
        dataProvider,
      },
    })

    expect(dataProvider).toHaveBeenCalledOnce()
    expect(wrapper.vm.getState().loading).toBe(true)
    await wrapper.setProps({ mode: 'local' })
    expect(wrapper.vm.getState().total).toBe(1)
    expect(wrapper.vm.getState().loading).toBe(false)

    resolveProvider({ items: [{ id: 2, name: 'Late server row' }], total: 99 })
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(wrapper.vm.getState().total).toBe(1)
    expect(wrapper.emitted('load-success')).toBeUndefined()
    wrapper.destroy()
  })

  it('shows a provider error and reloads when the retry control is clicked', async () => {
    const dataProvider = vi
      .fn()
      .mockRejectedValueOnce(new Error('Temporary failure'))
      .mockResolvedValue({ items: [{ id: 2, name: 'Recovered row' }], total: 1 })
    const wrapper = mount(SmartDataTable, {
      vuetify: new Vuetify(),
      propsData: {
        columns: [{ key: 'name', label: 'Name' }],
        mode: 'server',
        dataProvider,
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(wrapper.emitted('load-error')).toHaveLength(1)
    expect(wrapper.find('.sdt-state button').exists()).toBe(true)
    await wrapper.find('.sdt-state button').trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(dataProvider).toHaveBeenCalledTimes(2)
    expect(wrapper.emitted('load-success')).toHaveLength(1)
    expect(wrapper.text()).toContain('Recovered row')
    wrapper.destroy()
  })
})
