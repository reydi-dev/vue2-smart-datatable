import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
describe('distribution', () => {
  it('emits ESM, CJS, CSS and declarations', () => {
    for (const file of [
      'dist/smart-data-table.js',
      'dist/smart-data-table.cjs',
      'dist/style.css',
      'dist/types/index.d.ts',
    ])
      expect(existsSync(resolve(file)), file).toBe(true)
  })

  it('loads the ESM and CommonJS entry points', async () => {
    const esmEntry = pathToFileURL(resolve('dist/smart-data-table.js')).href
    const esm = await import(esmEntry)
    const cjs = createRequire(import.meta.url)(resolve('dist/smart-data-table.cjs'))

    expect(esm.SmartDataTable.options.name).toBe('SmartDataTable')
    expect(cjs.SmartDataTable.options.name).toBe('SmartDataTable')
    expect(typeof esm.createCsvExporter).toBe('function')
  })
})
