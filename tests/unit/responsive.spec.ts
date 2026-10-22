import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import SmartDataTable from '@/components/SmartDataTable.vue'
import { isMobileBreakpoint, matchesMobileBreakpoint, observeViewportWidth } from '@/core/responsive'
import type { MobileBreakpoint } from '@/types'

describe('independent responsive detection', () => {
  it.each([
    [959, 960, true],
    [960, 960, false],
    [700, 700, false],
    [699, 700, true],
    [0, 0, false],
    [599, 'xsOnly', true],
    [600, 'xsOnly', false],
    [959, 'smAndDown', true],
    [960, 'smAndDown', false],
    [1263, 'mdAndDown', true],
    [1264, 'mdAndDown', false],
    [959, 'mdAndUp', false],
    [960, 'mdAndUp', true],
    [1263, 'lgAndUp', false],
    [1264, 'lgAndUp', true],
  ] as Array<[number, MobileBreakpoint, boolean]>)(
    'matches viewport %s against %s at the defined boundary',
    (width, breakpoint, expected) => {
      expect(matchesMobileBreakpoint(width, breakpoint)).toBe(expected)
    },
  )

  it('validates configurable thresholds and rejects unsupported aliases', () => {
    expect(isMobileBreakpoint(0)).toBe(true)
    expect(isMobileBreakpoint(768)).toBe(true)
    expect(isMobileBreakpoint(-1)).toBe(false)
    expect(isMobileBreakpoint(Infinity)).toBe(false)
    expect(isMobileBreakpoint('sm')).toBe(false)
  })

  it('does not access browser APIs during SSR', () => {
    const changed = vi.fn()
    vi.stubGlobal('window', undefined)
    try {
      const stop = observeViewportWidth(changed)
      expect(changed).not.toHaveBeenCalled()
      expect(stop).not.toThrow()
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('follows viewport resize and breakpoint prop changes without a Vuetify instance, then cleans up', async () => {
    const originalWidth = window.innerWidth
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
    const wrapper = shallowMount(SmartDataTable, {
      propsData: { columns: [{ key: 'name', label: 'Name' }], items: [{ id: 1, name: 'Ada' }], mobileBreakpoint: 800 },
    })
    let destroyed = false
    try {
      expect(wrapper.vm.isMobile).toBe(false)
      expect(wrapper.findComponent({ name: 'SmartTableDesktop' }).exists()).toBe(true)
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 799 })
      window.dispatchEvent(new Event('resize'))
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isMobile).toBe(true)
      expect(wrapper.findComponent({ name: 'SmartTableMobile' }).exists()).toBe(true)
      await wrapper.setProps({ mobileBreakpoint: 700 })
      expect(wrapper.vm.isMobile).toBe(false)
      await wrapper.setProps({ mobileBreakpoint: 'smAndDown', theme: 'dark' })
      expect(wrapper.vm.isMobile).toBe(true)
      expect(wrapper.attributes('data-sdt-theme')).toBe('dark')
      const resizeListener = add.mock.calls.find(([name]) => name === 'resize')?.[1]
      wrapper.destroy()
      destroyed = true
      expect(remove).toHaveBeenCalledWith('resize', resizeListener)
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 })
      window.dispatchEvent(new Event('resize'))
      expect(wrapper.vm.viewportWidth).toBe(799)
    } finally {
      if (!destroyed) wrapper.destroy()
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth })
      add.mockRestore()
      remove.mockRestore()
    }
  })
})
