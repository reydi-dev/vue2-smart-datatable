import { describe, expect, it } from 'vitest'
import { toggleKey, togglePageKeys } from '@/core/selection'
describe('selection', () => {
  it('toggles one key', () => {
    expect(toggleKey([1], 2)).toEqual([1, 2])
    expect(toggleKey([1, 2], 1)).toEqual([2])
  })
  it('selects and clears only a page', () => {
    expect(togglePageKeys([9], [1, 2], true)).toEqual([9, 1, 2])
    expect(togglePageKeys([9, 1, 2], [1, 2], false)).toEqual([9])
  })
})
