import { describe, expect, it } from 'vitest'
import { readdirSync } from 'node:fs'
describe('package shape', () => {
  it('contains only distributable runtime output', () => {
    const files = readdirSync('dist', { recursive: true }).map(String)
    expect(files.some((file) => /(?:tests|examples|docs)[\\/]/i.test(file))).toBe(false)
  })
})
