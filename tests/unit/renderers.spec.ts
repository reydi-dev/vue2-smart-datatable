import Vue from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import SmartTableDesktop from '@/components/SmartTableDesktop.vue'
import SmartTableMobile from '@/components/SmartTableMobile.vue'
import SmartTableCell from '@/components/SmartTableCell.vue'
import { defaultIcons, defaultMessages } from '@/core/messages'
import type { DataTableColumn } from '@/types'

const rows = [
  { id: 1, name: 'Ada', note: 'Long delivery instructions\nKeep upright.' },
  { id: 2, name: 'Lin', note: '' },
]
const columns: DataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true, mobile: { summary: true } },
  { key: 'note', label: 'Note', type: 'expandable-text' },
]
const props = () => ({
  rows,
  columns,
  rowKeyOf: (row: { id: number }) => row.id,
  selectedKeys: [] as number[],
  messages: defaultMessages,
  icons: defaultIcons,
})

describe('native table renderers without a Vuetify instance', () => {
  it('renders a semantic table with mixed page selection and native selection events', async () => {
    const wrapper = mount(SmartTableDesktop, { propsData: { ...props(), selectable: true, selectedKeys: [1] } })
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('th').attributes('scope')).toBe('col')
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(Reflect.get(checkboxes.at(0).element, 'indeterminate')).toBe(true)
    await checkboxes.at(0).setChecked(true)
    expect(wrapper.emitted('select-page')).toEqual([[true]])
    await checkboxes.at(2).setChecked(true)
    expect(wrapper.emitted('select-row')?.[0][0]).toEqual({ row: rows[1], selected: true })
    expect(wrapper.findAll('tbody .sdt-row--selected')).toHaveLength(1)
    wrapper.destroy()
  })

  it('retains sortable header state, alignment, sizes, density, fixed header, and custom row classes', async () => {
    const wrapper = mount(SmartTableDesktop, {
      propsData: {
        ...props(),
        columns: [{ key: 'name', label: 'Name', sortable: true, align: 'end', width: 160, minWidth: 120 }],
        sort: { columnKey: 'name', direction: 'desc' },
        dense: true,
        fixedHeader: true,
        height: 250,
        rowClass: () => 'custom-row',
      },
    })
    expect(wrapper.find('th').attributes('aria-sort')).toBe('descending')
    expect(wrapper.find('th').classes()).toContain('sdt-align--end')
    expect(wrapper.find('th').attributes('style')).toContain('min-width: 120px')
    expect(wrapper.classes()).toContain('sdt-desktop--dense')
    expect(wrapper.classes()).toContain('sdt-desktop--fixed-header')
    expect(wrapper.attributes('style')).toContain('height: 250px')
    expect(wrapper.find('tbody tr').classes()).toContain('custom-row')
    await wrapper.find('.sdt-sort-button').trigger('click')
    expect(wrapper.emitted('sort')?.[0][0]).toEqual(wrapper.props('columns')[0])
    wrapper.destroy()
  })

  it('does not also activate a row when custom links or buttons in cells are clicked', async () => {
    const wrapper = mount(SmartTableDesktop, {
      propsData: { ...props(), rowClickable: true },
      scopedSlots: { cell: () => new Vue().$createElement('a', { attrs: { href: '#test' } }, 'Custom link') },
    })
    await wrapper.find('tbody a').trigger('click')
    expect(wrapper.emitted('row-click')).toBeUndefined()
    await wrapper.find('tbody tr').trigger('keydown.enter')
    expect(wrapper.emitted('row-click')?.[0][0].row).toEqual(rows[0])
    await wrapper.setProps({ disabled: true })
    expect(wrapper.find('tbody tr').attributes('tabindex')).toBeUndefined()
    await wrapper.find('tbody tr').trigger('keydown.space')
    expect(wrapper.emitted('row-click')).toHaveLength(1)
    wrapper.destroy()
  })

  it.each([SmartTableDesktop, SmartTableMobile])(
    'preserves cell/action slots and guards their action triggers',
    async (renderer) => {
      const cells: any[] = []
      let trigger = (_event: Event) => {}
      const h = new Vue().$createElement
      const wrapper = mount(renderer, {
        propsData: { ...props(), actions: [{ key: 'open', label: 'Open' }] },
        scopedSlots: {
          cell: (context: any) => {
            cells.push(context)
            return h('span', context.row.name)
          },
          action: (context: any) => {
            trigger = context.trigger
            return h('button', 'Custom action')
          },
        },
      })
      expect(cells[0]).toMatchObject({
        rowKey: 1,
        rowIndex: 0,
        column: columns[0],
        mobile: renderer === SmartTableMobile,
      })
      trigger(new Event('click'))
      expect(wrapper.emitted('row-action')).toHaveLength(1)
      await wrapper.setProps({ actions: [{ key: 'open', label: 'Open', loading: true }] })
      trigger(new Event('click'))
      expect(wrapper.emitted('row-action')).toHaveLength(1)
      await wrapper.setProps({ actions: [{ key: 'open', label: 'Open', disabled: () => true }] })
      trigger(new Event('click'))
      expect(wrapper.emitted('row-action')).toHaveLength(1)
      await wrapper.setProps({ disabled: true })
      trigger(new Event('click'))
      expect(wrapper.emitted('row-action')).toHaveLength(1)
      wrapper.destroy()
    },
  )

  it('keeps native loading actions labeled and disabled and respects action visibility', async () => {
    const wrapper = mount(SmartTableDesktop, {
      propsData: {
        ...props(),
        actions: [
          { key: 'busy', label: 'Working', loading: true },
          { key: 'hidden', label: 'Hidden', visible: false },
        ],
      },
    })
    const button = wrapper.find('.sdt-action')
    expect(button.text()).toBe('Working')
    expect(button.attributes('aria-busy')).toBe('true')
    expect(button.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).not.toContain('Hidden')
    await button.trigger('click')
    expect(wrapper.emitted('row-action')).toBeUndefined()
    wrapper.destroy()
  })

  it('keeps selection outside mobile disclosures and full-width text details available while disabled', async () => {
    const wrapper = mount(SmartTableMobile, {
      propsData: { ...props(), selectable: true, disabled: true, rowClickable: true, rowClass: () => 'custom-mobile' },
    })
    expect(wrapper.find('summary input').exists()).toBe(false)
    expect(wrapper.find('.sdt-checkbox').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.sdt-mobile__row').classes()).toContain('custom-mobile')
    expect(wrapper.find('.sdt-mobile__field--full').text()).toContain(rows[0].note)
    expect(wrapper.find('.sdt-mobile__details .sdt-cell__preview').exists()).toBe(false)
    expect(wrapper.find('.sdt-mobile__disclosure summary').text()).toBe('More details')
    expect(wrapper.find('.sdt-mobile__open').attributes('disabled')).toBeDefined()
    wrapper.destroy()
  })

  it('preserves mobile-summary, mobile-details, and row-actions slot contexts', () => {
    const h = new Vue().$createElement
    const contexts: Record<string, any> = {}
    const wrapper = mount(SmartTableMobile, {
      propsData: props(),
      scopedSlots: {
        'mobile-summary': (context: any) => {
          contexts.summary = context
          return h('strong', context.row.name)
        },
        'mobile-details': (context: any) => {
          contexts.details = context
          return h('p', context.row.note)
        },
        'row-actions': (context: any) => {
          contexts.actions = context
          return h('button', 'Custom')
        },
      },
    })
    expect(contexts.summary.columns).toEqual([columns[0]])
    expect(contexts.details.columns).toEqual([columns[1]])
    expect(contexts.actions.disabled).toBe(false)
    expect(contexts.summary.rowIndex).toBe(1)
    wrapper.destroy()
  })
})

function cell(value: unknown, type: string, overrides = {}) {
  return mount(SmartTableCell, {
    propsData: {
      row: { value },
      column: { key: 'value', label: 'Value', type },
      rowKeyValue: 1,
      rowIndex: 0,
      icons: defaultIcons,
      messages: defaultMessages,
      ...overrides,
    },
  })
}

describe('native cells', () => {
  it('shows an escaped, readable expandable preview and full mobile text', async () => {
    const wrapper = cell('<b>safe</b>\nA long description.', 'expandable-text')
    expect(wrapper.find('b').exists()).toBe(false)
    expect(wrapper.find('.sdt-cell__preview').text()).toContain('<b>safe</b>')
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.sdt-cell__preview').exists()).toBe(false)
    await wrapper.setProps({ mobile: true, disabled: true })
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.text()).toContain('A long description.')
    wrapper.destroy()
  })

  it('distinguishes missing values from zero and false, and formats native chips', async () => {
    const wrapper = cell(null, 'text')
    expect(wrapper.find('.sdt-cell__empty').text()).toContain('Not provided')
    await wrapper.setProps({ row: { value: 0 }, column: { key: 'value', label: 'Value', type: 'number' } })
    expect(wrapper.text()).toBe('0')
    await wrapper.setProps({ row: { value: false }, column: { key: 'value', label: 'Value', type: 'boolean' } })
    expect(wrapper.find('[role="img"]').attributes('aria-label')).toBe('False')
    await wrapper.setProps({
      row: { value: '<b>paid</b>' },
      column: { key: 'value', label: 'Value', type: 'chip', formatter: () => 'Paid' },
    })
    expect(wrapper.find('.sdt-cell__chip').text()).toBe('Paid')
    wrapper.destroy()
  })

  it('preserves URL safety for native images and links', async () => {
    const wrapper = cell('/avatar.png', 'image')
    expect(wrapper.find('img').attributes()).toMatchObject({ src: '/avatar.png', alt: 'Value', loading: 'lazy' })
    await wrapper.setProps({ row: { value: 'data:text/html,<script>unsafe</script>' } })
    expect(wrapper.find('img').exists()).toBe(false)
    await wrapper.setProps({
      row: { value: 'javascript:alert(1)' },
      column: { key: 'value', label: 'Value', type: 'link' },
    })
    expect(wrapper.find('a').exists()).toBe(false)
    await wrapper.setProps({ row: { value: 'https://example.com' } })
    expect(wrapper.find('a').attributes('rel')).toBe('noopener noreferrer')
    await wrapper.setProps({ disabled: true })
    expect(wrapper.find('a').exists()).toBe(false)
    wrapper.destroy()
  })

  it('copies formatted text and prevents copying while disabled', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const wrapper = cell('hello@example.com', 'copy')
    try {
      await wrapper.find('button').trigger('click')
      expect(writeText).toHaveBeenCalledWith('hello@example.com')
      expect(wrapper.emitted('copied')).toEqual([['hello@example.com']])
      await wrapper.setProps({ disabled: true })
      await wrapper.find('button').trigger('click')
      expect(writeText).toHaveBeenCalledOnce()
    } finally {
      wrapper.destroy()
      vi.unstubAllGlobals()
    }
  })
})
