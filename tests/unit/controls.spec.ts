import Vue from 'vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import SmartTableFilters from '@/components/SmartTableFilters.vue'
import ExportMenu from '@/components/ExportMenu.vue'
import ColumnVisibilityDialog from '@/components/ColumnVisibilityDialog.vue'
import SmartDataTable from '@/components/SmartDataTable.vue'
import { defaultMessages } from '@/core/messages'
import type { FilterState } from '@/types'

const columns = [
  {
    key: 'active',
    label: 'Active',
    filterable: true,
    type: 'select' as const,
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  },
  { key: 'age', label: 'Age', filterable: true, type: 'number' as const },
]
function filters(value: FilterState = {}) {
  return mount(SmartTableFilters, { propsData: { columns, value, messages: defaultMessages } })
}

describe('native filters', () => {
  it('preserves boolean option values and clears a single clause', async () => {
    const wrapper = filters()
    const select = wrapper.findAll('select').at(1)
    await select.setValue('1')
    expect(wrapper.emitted('input')?.[0][0]).toEqual({ active: { operator: 'eq', value: false } })
    await wrapper.setProps({ value: { active: { operator: 'eq', value: false } } })
    expect((select.element as HTMLSelectElement).value).toBe('1')
    await wrapper.find('.sdt-filter__clear').trigger('click')
    expect(wrapper.emitted('input')?.[1][0]).toEqual({})
    wrapper.destroy()
  })
  it('converts scalar/multiple selection and retains original types', async () => {
    const wrapper = filters({ active: { operator: 'eq', value: false } })
    await wrapper.find('select').setValue('in')
    const state = wrapper.emitted('input')?.[0][0]
    expect(state).toEqual({ active: { operator: 'in', value: [false] } })
    await wrapper.setProps({ value: state })
    const options = wrapper.findAll('select').at(1)
    await options.setValue(['0', '1'])
    expect(wrapper.emitted('input')?.[1][0].active.value).toEqual([true, false])
    wrapper.destroy()
  })
  it('uses numeric bounds, localized conditions, and disabled guards', async () => {
    const wrapper = filters({ age: { operator: 'between', from: 20, to: 30 } })
    await wrapper.find('input').setValue('0')
    expect(wrapper.emitted('input')?.[0][0].age).toEqual({ operator: 'between', from: 0, to: 30 })
    await wrapper.setProps({ messages: { ...defaultMessages, filterOperators: { between: 'بین' } }, disabled: true })
    expect(wrapper.text()).toContain('بین')
    wrapper.vm.setClause('age', { operator: 'eq', value: 40 })
    wrapper.vm.clear('age')
    expect(wrapper.emitted('input')).toHaveLength(1)
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    wrapper.destroy()
  })
  it('retains custom filter callbacks and blocks them while disabled', async () => {
    const h = new Vue().$createElement
    const wrapper = mount(SmartTableFilters, {
      propsData: { columns, value: {}, messages: defaultMessages },
      scopedSlots: {
        'filter.age': (context: any) =>
          h(
            'button',
            { class: 'custom-filter', on: { click: () => context.setClause({ operator: 'gte', value: 25 }) } },
            'Adults',
          ),
      },
    })
    await wrapper.find('.custom-filter').trigger('click')
    expect(wrapper.emitted('input')?.[0][0]).toEqual({ age: { operator: 'gte', value: 25 } })
    await wrapper.setProps({ disabled: true })
    await wrapper.find('.custom-filter').trigger('click')
    expect(wrapper.emitted('input')).toHaveLength(1)
    wrapper.destroy()
  })
})

describe('native column and export controls', () => {
  it('keeps drafts isolated until apply and includes fixed columns', async () => {
    const wrapper = mount(ColumnVisibilityDialog, {
      propsData: {
        columns: [{ key: 'id', label: 'ID', hideable: false }, ...columns],
        value: true,
        visibleColumns: ['id', 'age'],
        messages: defaultMessages,
      },
    })
    await wrapper.findAll('input').at(0).setChecked(true)
    expect(wrapper.emitted('apply')).toBeUndefined()
    await wrapper.findAll('button').at(2).trigger('click')
    expect(wrapper.emitted('apply')?.[0][0]).toEqual(['id', 'age', 'active'])
    expect(wrapper.emitted('input')?.[0][0]).toBe(false)
    await wrapper.setProps({ value: false })
    await wrapper.setProps({ value: true, visibleColumns: ['id'] })
    expect(wrapper.findAll('input').wrappers.every((input) => !(input.element as HTMLInputElement).checked)).toBe(true)
    await wrapper.setProps({ disabled: true })
    wrapper.vm.apply()
    wrapper.vm.toggle('age', true)
    expect(wrapper.emitted('apply')).toHaveLength(1)
    wrapper.destroy()
  })
  it('closes export choices with Escape/outside focus and prevents busy exports', async () => {
    const wrapper = mount(ExportMenu, {
      attachTo: document.body,
      propsData: {
        exporters: [{ key: 'csv', label: 'CSV', scopes: ['current', 'all'], export: vi.fn() }],
        messages: defaultMessages,
      },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('[role="group"]').exists()).toBe(true)
    await wrapper.findAll('button').at(2).trigger('click')
    expect(wrapper.emitted('export')?.[0][0]).toEqual({ exporter: 'csv', scope: 'all' })
    expect(wrapper.find('[role="group"]').exists()).toBe(false)
    await wrapper.find('button').trigger('click')
    await wrapper.trigger('keydown.esc')
    expect(document.activeElement).toBe(wrapper.find('button').element)
    await wrapper.find('button').trigger('click')
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="group"]').exists()).toBe(false)
    await wrapper.setProps({ loading: true })
    wrapper.vm.choose('csv', 'current')
    expect(wrapper.emitted('export')).toHaveLength(1)
    wrapper.destroy()
  })
})

describe('native table states', () => {
  it('distinguishes empty/no-results and restores results by clearing filters', async () => {
    const wrapper = mount(SmartDataTable, {
      propsData: {
        columns: [{ key: 'name', label: 'Name' }],
        items: [{ id: 1, name: 'Ada' }],
        filters: { name: { operator: 'eq', value: 'missing' } },
      },
    })
    expect(wrapper.find('[role="status"]').text()).toContain(defaultMessages.noResults)
    await wrapper.find('.sdt-state button').trigger('click')
    expect(wrapper.text()).toContain('Ada')
    await wrapper.setProps({ items: [] })
    expect(wrapper.find('[role="status"]').text()).toBe(defaultMessages.empty)
    await wrapper.setProps({ loading: true })
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('[role="status"]').text()).toBe(defaultMessages.loading)
    wrapper.destroy()
  })
  it('handles built-in export rejection and prevents duplicate pending exports', async () => {
    let reject!: (error: Error) => void
    const exporter = {
      key: 'bad',
      label: 'Bad',
      scopes: ['current' as const],
      export: vi.fn(
        () =>
          new Promise<void>((_resolve, fail) => {
            reject = fail
          }),
      ),
    }
    const wrapper = mount(SmartDataTable, {
      propsData: { columns: [{ key: 'name', label: 'Name' }], items: [{ id: 1, name: 'Ada' }], exporters: [exporter] },
    })
    const pending = wrapper.vm.runExport('bad', 'current')
    await wrapper.vm.runExport('bad', 'current')
    expect(exporter.export).toHaveBeenCalledOnce()
    reject(new Error('Unavailable'))
    await pending
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="alert"]').text()).toContain(defaultMessages.exportFailed)
    expect(wrapper.emitted('export-error')).toHaveLength(1)
    expect(wrapper.attributes('aria-busy')).toBe('false')
    await wrapper.find('[role="alert"] button').trigger('click')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    wrapper.destroy()
  })
})
