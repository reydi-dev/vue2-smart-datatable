import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SmartTableIcon from '@/components/SmartTableIcon.vue'
import SmartTableCell from '@/components/SmartTableCell.vue'
import SmartTablePagination from '@/components/SmartTablePagination.vue'
import { defaultIcons, defaultMessages } from '@/core/messages'

// These components are mounted without a Vuetify instance or icon font.
describe('independent icons', () => {
  it.each([...Object.values(defaultIcons), 'mdi-check-circle', 'mdi-close-circle'])(
    'renders %s as decorative inline SVG',
    (icon) => {
      const wrapper = mount(SmartTableIcon, { propsData: { icon } })
      expect(wrapper.find('svg path').exists()).toBe(true)
      expect(wrapper.attributes('aria-hidden')).toBe('true')
      expect(wrapper.find('.mdi').exists()).toBe(false)
      expect(wrapper.find('.v-icon').exists()).toBe(false)
      wrapper.destroy()
    },
  )

  it('supports semantic names and filled/multiple custom paths without interpreting markup', async () => {
    const wrapper = mount(SmartTableIcon, { propsData: { icon: 'download', label: 'Download' } })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Download')
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
    await wrapper.setProps({ icon: { path: ['M0 0h10v10H0z', 'M12 12h4v4h-4z'], viewBox: '0 0 32 32' } })
    expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 32 32')
    expect(wrapper.find('svg').attributes('fill')).toBe('currentColor')
    expect(wrapper.findAll('path')).toHaveLength(2)
    await wrapper.setProps({ icon: { path: '<script>alert(1)</script>' } })
    expect(wrapper.find('script').exists()).toBe(false)
    expect(wrapper.find('path').attributes('d')).toBe('<script>alert(1)</script>')
    await wrapper.setProps({ icon: 'M0 0h24v24H0z' })
    expect(wrapper.find('path').attributes('d')).toBe('M0 0h24v24H0z')
    wrapper.destroy()
  })

  it('preserves external MDI font classes, but does not interpret Vuetify aliases, URLs, or HTML', async () => {
    const wrapper = mount(SmartTableIcon, { propsData: { icon: 'mdi-account' } })
    expect(wrapper.find('.mdi.mdi-account').exists()).toBe(true)
    for (const icon of [
      '$vuetify.icons.account',
      '<img src=x onerror=alert(1)>',
      'https://example.com/icon.svg',
      'constructor',
      'toString',
    ]) {
      await wrapper.setProps({ icon })
      expect(wrapper.find('svg').exists()).toBe(false)
      expect(wrapper.find('img').exists()).toBe(false)
      expect(wrapper.find('.mdi').exists()).toBe(false)
      expect(wrapper.text()).toBe('')
    }
    wrapper.destroy()
  })

  it('gives boolean cells localized accessible values and accepts custom icon objects', async () => {
    const wrapper = mount(SmartTableCell, {
      propsData: {
        column: { key: 'active', label: 'Active', type: 'boolean' },
        row: { active: true },
        rowKeyValue: 1,
        rowIndex: 0,
        messages: { ...defaultMessages, trueValue: 'بله', falseValue: 'خیر' },
        icons: defaultIcons,
      },
    })
    expect(wrapper.find('[role="img"]').attributes('aria-label')).toBe('بله')
    await wrapper.setProps({ row: { active: false } })
    expect(wrapper.find('[role="img"]').attributes('aria-label')).toBe('خیر')
    await wrapper.setProps({
      column: { key: 'active', label: 'Custom symbol', type: 'icon' },
      row: { active: { path: 'M0 0h24v24H0z' } },
    })
    expect(wrapper.find('path').attributes('d')).toBe('M0 0h24v24H0z')
    expect(wrapper.find('[role="img"]').attributes('aria-label')).toBe('Custom symbol')
    wrapper.destroy()
  })

  it('renders usable native pagination without Vuetify or font dependencies', async () => {
    const wrapper = mount(SmartTablePagination, {
      propsData: { page: 1, total: 100, itemsPerPage: 10, pageSizeOptions: [10, 25], messages: defaultMessages },
    })
    expect(wrapper.findAll('svg')).toHaveLength(2)
    await wrapper.find('input').setValue('5')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('update:page')).toEqual([[5]])
    wrapper.destroy()
  })
})
