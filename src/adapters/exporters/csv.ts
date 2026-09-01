import { formatColumnValue } from '../../core/columns'
import type { DataRow, DataTableColumn, ExporterAdapter, ExporterContext } from '../../types'

export interface CsvExporterOptions {
  key?: string
  label?: string
  fileName?: string
  pageSize?: number
  download?: (content: Uint8Array, fileName: string) => void
}

const excelLimit = 32767
export function normalizeCsvCell(value: unknown): string {
  let text =
    value === null || value === undefined
      ? ''
      : String(value)
          .replace(/<br\s*\/?\s*>/gi, '\n')
          .replace(/<[^>]*>/g, '')
  if (text.length > excelLimit) text = `${text.slice(0, excelLimit - 14)}\n[truncated]`
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  if (/^0\d+$/.test(text) || /^\d{16,}$/.test(text)) text = `'${text}`
  return text
}
export function escapeCsvCell(value: unknown): string {
  return `"${normalizeCsvCell(value).replace(/"/g, '""')}"`
}
function exportValue<Row extends DataRow>(column: DataTableColumn<Row>, row: Row): unknown {
  return column.exportValue ? column.exportValue(row) : formatColumnValue(column, row)
}
export function buildCsv<Row extends DataRow>(columns: DataTableColumn<Row>[], rows: Row[]): string {
  const header = columns.map((column) => escapeCsvCell(column.label)).join(',')
  const body = rows
    .map((row) => columns.map((column) => escapeCsvCell(exportValue(column, row))).join(','))
    .join('\r\n')
  return `${header}\r\n${body}${body ? '\r\n' : ''}`
}
function encode(content: string): Uint8Array {
  const bytes = new TextEncoder().encode(content)
  const result = new Uint8Array(bytes.length + 3)
  result.set([0xef, 0xbb, 0xbf])
  result.set(bytes, 3)
  return result
}
function browserDownload(content: Uint8Array, fileName: string) {
  const blob = new Blob([content as BlobPart], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export function createCsvExporter<Row extends DataRow = DataRow>(
  options: CsvExporterOptions = {},
): ExporterAdapter<Row> {
  return {
    key: options.key ?? 'csv',
    label: options.label ?? 'CSV',
    scopes: ['current', 'all'],
    async export(context: ExporterContext<Row>) {
      let rows = [...context.rows]
      if (context.scope === 'all') {
        rows = []
        const size = options.pageSize ?? 1000
        const pages = Math.max(1, Math.ceil(context.total / size))
        for (let page = 1; page <= pages; page++) {
          const result = await context.fetchPage(page, size)
          rows.push(...result.items)
          context.reportProgress((page / pages) * 90)
          if (result.items.length < size) break
        }
      }
      const content = encode(buildCsv(context.columns, rows))
      context.reportProgress(100)
      const name = `${options.fileName ?? context.fileName}.csv`
      ;(options.download ?? browserDownload)(content, name)
    },
  }
}
