import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SmartTablePagination from '@/components/SmartTablePagination.vue'
import { defaultMessages } from '@/core/messages'

function pagination(props = {}) {
  return mount(SmartTablePagination, {
    propsData: {
      page: 1,
      itemsPerPage: 25,
      total: 2500,
      pageSizeOptions: [25, 50, 100],
      messages: defaultMessages,
      ...props,
    },
    stubs: ['v-icon'],
  })
}

describe('production pagination', () => {
  it.each(['30', '۳۰', '٣٠'])('commits %s only on submit, without emitting intermediate pages', async (draft) => {
    const wrapper = pagination()
    await wrapper.find('input').setValue(draft)
    expect(wrapper.emitted('update:page')).toBeUndefined()
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('update:page')).toEqual([[30]])
    await wrapper.setProps({ page: 30 })
    expect(Reflect.get(wrapper.find('input').element, 'value')).toBe('30')
    expect(wrapper.find('.sdt-pagination__page').text()).toBe('30 of 100')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('update:page')).toHaveLength(1)
    wrapper.destroy()
  })

  it.each(['', '0', '-1', '101', '1.5', '3e1', '0x20', 'hello', '9007199254740993'])(
    'rejects invalid target %s without navigation',
    async (draft) => {
      const wrapper = pagination({ page: 30 })
      await wrapper.find('input').setValue(draft)
      await wrapper.find('form').trigger('submit')
      expect(wrapper.emitted('update:page')).toBeUndefined()
      expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
      expect(wrapper.find('[role="alert"]').text()).toContain('1–100')
      expect(wrapper.find('input').attributes('aria-describedby')).toBe(wrapper.find('[role="alert"]').attributes('id'))
      expect(wrapper.find('.sdt-pagination__page').text()).toBe('30 of 100')
      wrapper.destroy()
    },
  )

  it('synchronizes draft and validation when the parent changes pages, totals, or page size', async () => {
    const wrapper = pagination({ page: 30 })
    await wrapper.find('input').setValue('101')
    await wrapper.find('form').trigger('submit')
    await wrapper.setProps({ total: 100 })
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(Reflect.get(wrapper.find('input').element, 'value')).toBe('4')
    await wrapper.setProps({ page: 2 })
    expect(Reflect.get(wrapper.find('input').element, 'value')).toBe('2')
    await wrapper.find('input').setValue('3')
    await wrapper.setProps({ itemsPerPage: 50 })
    expect(Reflect.get(wrapper.find('input').element, 'value')).toBe('2')
    expect(wrapper.find('.sdt-pagination__page').text()).toBe('2 of 2')
    wrapper.destroy()
  })

  it('uses native page-size selection and retains the existing update event', async () => {
    const wrapper = pagination()
    await wrapper.find('select').setValue('50')
    expect(wrapper.emitted('update:items-per-page')).toEqual([[50]])
    wrapper.destroy()
  })

  it('prevents all page changes while disabled and disables navigation for an empty table', async () => {
    const wrapper = pagination({ disabled: true })
    await wrapper.find('input').setValue('30')
    await wrapper.find('form').trigger('submit')
    wrapper.vm.navigate(2)
    wrapper.vm.setPageSize('50')
    expect(wrapper.emitted('update:page')).toBeUndefined()
    expect(wrapper.emitted('update:items-per-page')).toBeUndefined()
    expect(wrapper.findAll('button').wrappers.every((button) => button.attributes('disabled') !== undefined)).toBe(true)
    await wrapper.setProps({ disabled: false, total: 0 })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.sdt-pagination__count').text()).toBe('0–0 of 0')
    await wrapper.setProps({ total: 2500 })
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
    await wrapper.find('input').setValue('30')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('update:page')).toEqual([[30]])
    wrapper.destroy()
  })

  it('localizes pagination controls while older message objects retain English fallbacks', async () => {
    const wrapper = pagination({
      messages: {
        rowsPerPage: 'ردیف در صفحه',
        of: 'از',
        goToPage: 'رفتن به صفحه',
        go: 'برو',
        previousPage: 'قبلی',
        nextPage: 'بعدی',
        invalidPage: 'بازه مجاز:',
      },
    })
    expect(wrapper.find('input').element.closest('label')?.textContent).toContain('رفتن به صفحه')
    expect(wrapper.find('[aria-label="بعدی"]').exists()).toBe(true)
    await wrapper.find('input').setValue('101')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('[role="alert"]').text()).toBe('بازه مجاز: 1–100')
    await wrapper.setProps({ messages: { rowsPerPage: 'Rows', of: 'of' } })
    expect(wrapper.find('[aria-label="Next page"]').exists()).toBe(true)
    wrapper.destroy()
  })

  it('gives validation messages unique IDs for multiple table instances', async () => {
    const first = pagination()
    const second = pagination()
    await first.find('input').setValue('0')
    await first.find('form').trigger('submit')
    await second.find('input').setValue('0')
    await second.find('form').trigger('submit')
    expect(first.find('[role="alert"]').attributes('id')).not.toBe(second.find('[role="alert"]').attributes('id'))
    first.destroy()
    second.destroy()
  })
})
