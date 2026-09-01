import { describe, expect, it, vi } from 'vitest'
import { buildCsv, createCsvExporter, normalizeCsvCell } from '@/adapters/exporters/csv'
describe('CSV exporter', () => {
  it('quotes cells and neutralizes formulas', () => {
    expect(normalizeCsvCell('=2+2')).toBe("'=2+2")
    expect(normalizeCsvCell('001')).toBe("'001")
    expect(normalizeCsvCell('1234567890123456')).toBe("'1234567890123456")
    expect(buildCsv([{ key: 'v', label: 'Value' }], [{ v: 'a,"b"' }])).toContain('"a,""b"""')
  })
  it('adds UTF-8 BOM', async () => {
    const download = vi.fn()
    const exporter = createCsvExporter({ download })
    await exporter.export({
      scope: 'current',
      columns: [{ key: 'id', label: 'ID' }],
      rows: [{ id: '001' }],
      total: 1,
      request: { page: 1, itemsPerPage: 10, sort: null, filters: {}, reason: 'export' },
      fileName: 'test',
      reportProgress: vi.fn(),
      fetchPage: vi.fn(),
    })
    expect(Array.from(download.mock.calls[0][0].slice(0, 3))).toEqual([239, 187, 191])
  })
})
