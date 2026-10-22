import { mount } from '@vue/test-utils'
import Vue from 'vue'
import { afterEach, expect, it, vi } from 'vitest'
import type { DataProvider } from 'vue2-smart-datatable'
import BasicTable from '../../docs/examples/BasicTable.vue'
import ServerTable from '../../docs/examples/ServerTable.vue'
import PersianTable from '../../docs/examples/PersianTable.vue'
import StyledTable from '../../docs/examples/StyledTable.vue'

const settle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await Vue.nextTick()
}
afterEach(() => vi.unstubAllGlobals())

it('copyable local example keeps selected row IDs controlled by the consumer', async () => {
  const wrapper = mount(BasicTable)
  try {
    expect(wrapper.text()).toContain('Ada')
    await wrapper.findAll('input.sdt-checkbox').at(1).setChecked(true)
    expect(wrapper.text()).toContain('Selected IDs: 1')
  } finally {
    wrapper.destroy()
  }
})

it('copyable Persian example combines RTL with translated controls and explicit Rial formatting', () => {
  const wrapper = mount(PersianTable)
  try {
    expect(wrapper.find('.sdt-root').attributes('dir')).toBe('rtl')
    expect(wrapper.text()).toContain('مینا رضایی')
    expect(wrapper.text()).toContain('فیلترها')
    expect(wrapper.text()).toContain('۱٬۵۰۰٬۰۰۰')
  } finally {
    wrapper.destroy()
  }
})

it('copyable styled example uses a public status slot and explicit theme switching', async () => {
  const wrapper = mount(StyledTable)
  try {
    expect(wrapper.find('.brand-status--paid').text()).toBe('Paid')
    await wrapper.find('select').setValue('dark')
    expect(wrapper.find('.sdt-root').attributes('data-sdt-theme')).toBe('dark')
    expect(wrapper.find('.brand-status--paid').text()).toBe('Paid')
  } finally {
    wrapper.destroy()
  }
})

it('copyable API example commits a direct jump without requesting intermediate pages', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ data: [{ id: 1, name: 'Ada' }], total: 1000 }) })
  vi.stubGlobal('fetch', fetchMock)
  const wrapper = mount(ServerTable)
  try {
    await settle()
    expect(wrapper.text()).toContain('Ada')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const pagination = wrapper.find('.sdt-pagination')
    await pagination.find('input').setValue('۳')
    await pagination.find('input').setValue('۳۰')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    await pagination.find('form').trigger('submit')
    await settle()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls.map(([url]) => new URL(url, 'https://example.test').searchParams.get('page'))).toEqual([
      '1',
      '30',
    ])
  } finally {
    wrapper.destroy()
  }
})

it('copyable API mapping forwards sort/filter/cancellation and rejects unsuccessful HTTP responses', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [], total: 0 }) })
  vi.stubGlobal('fetch', fetchMock)
  const wrapper = mount(ServerTable)
  try {
    await settle()
    const provider = (wrapper.vm as unknown as { loadUsers: DataProvider }).loadUsers
    const signal = new AbortController().signal
    const request = {
      page: 3,
      itemsPerPage: 10,
      sort: { columnKey: 'name', direction: 'desc' as const },
      filters: { name: { operator: 'contains' as const, value: ' Ada ' } },
      signal,
      reason: 'filter' as const,
    }
    await provider(request)
    const [url, options] = fetchMock.mock.calls[1]
    expect(new URL(url, 'https://example.test').searchParams.toString()).toBe(
      'page=3&per_page=10&sort=name&direction=desc&name=Ada',
    )
    expect(options.signal).toBe(signal)
    fetchMock.mockResolvedValueOnce({ ok: false, status: 503 })
    await expect(provider(request)).rejects.toThrow('Unable to load users (503)')
  } finally {
    wrapper.destroy()
  }
})
