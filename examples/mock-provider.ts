import { applyFilters } from '@/core/filters'
import { stableSort } from '@/core/local-data'
import { columns, rows } from './data'
import type { DataProvider, DataProviderRequest } from '@/types'

export const mockProvider: DataProvider = async (request: DataProviderRequest) => {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, request.page === 2 ? 600 : 150)
    request.signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
  const filtered = applyFilters(rows, columns, request.filters)
  const sorted = stableSort(filtered, columns, request.sort)
  const start = (request.page - 1) * request.itemsPerPage
  return { records: sorted.slice(start, start + request.itemsPerPage), count: sorted.length, requestPage: request.page }
}
