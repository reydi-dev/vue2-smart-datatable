import { mount } from '@vue/test-utils'
import { it, expect } from 'vitest'
import RendererLab from '../../examples/orders/OrdersDemo.vue'

it('uses production slots for compact order summaries, retained selection and working status tabs', async () => {
  const previous = window.innerWidth
  Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true, writable: true })
  const wrapper = mount(RendererLab)
  try {
    await wrapper.vm.$nextTick()
    const summary = wrapper.find('.renderer-order-summary')
    expect(summary.text()).toContain('#ORD-1048')
    expect(summary.text()).toContain('Olivia Rhye')
    expect(summary.text()).toContain('$240.00')
    await summary.find('input').setChecked(true)
    expect(wrapper.find('.renderer-selected').text()).toContain('1 selected')
    const details = wrapper.find('.sdt-mobile__details')
    expect(details.text()).not.toContain('Order date')
    expect(details.text()).toContain('olivia@acme.design')
    expect(details.find('.sdt-cell__icon-button').exists()).toBe(false)
    await wrapper.findAll('.renderer-tabs button').at(1).trigger('click')
    expect(wrapper.find('.renderer-selected').text()).toContain('1 selected')
    expect(wrapper.findAll('.renderer-order-summary').wrappers.every((row) => row.text().includes('Completed'))).toBe(
      true,
    )
    const dialog = wrapper.findComponent({ name: 'ColumnVisibilityDialog' })
    dialog.vm.$emit('apply', [
      'id',
      'status',
      'amount',
      'date',
      'email',
      'items',
      'payment',
      'shipping',
      'city',
      'priority',
      'tags',
      'description',
    ])
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.renderer-order-summary').text()).not.toContain('Olivia Rhye')
    await wrapper.setData({ disabled: true })
    expect(wrapper.find('.renderer-order-summary input').attributes('disabled')).toBeDefined()
  } finally {
    wrapper.destroy()
    Object.defineProperty(window, 'innerWidth', { value: previous, configurable: true, writable: true })
  }
})
