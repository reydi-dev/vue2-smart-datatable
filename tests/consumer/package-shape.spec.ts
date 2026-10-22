import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
describe('package shape', () => {
  it('requires only Vue and emits no Vuetify or font imports', () => {
    const metadata = JSON.parse(readFileSync('package.json', 'utf8'))
    expect(metadata.peerDependencies).toEqual({ vue: '>=2.6.14 <3' })
    expect(Object.keys(metadata.dependencies || {})).toEqual([])
    for (const file of ['dist/smart-data-table.js', 'dist/smart-data-table.cjs', 'dist/style.css']) {
      const content = readFileSync(file, 'utf8')
      expect(content).not.toMatch(/(?:from|require\()\s*['"]vuetify/)
      expect(content).not.toMatch(/@font-face|materialdesignicons-webfont/)
    }
  })
  it('contains only distributable runtime output', () => {
    const files = readdirSync('dist', { recursive: true }).map(String)
    expect(files.some((file) => /(?:tests|examples|docs)[\\/]/i.test(file))).toBe(false)
  })
})
