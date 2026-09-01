import type { PersistedColumnState, PersistenceAdapter } from '../../types'

export interface LocalStoragePersistenceOptions {
  prefix?: string
  storage?: Storage
}

export function createLocalStoragePersistenceAdapter(options: LocalStoragePersistenceOptions = {}): PersistenceAdapter {
  const prefix = options.prefix ?? 'smart-data-table:'
  const storage = (): Storage | null => options.storage ?? (typeof window !== 'undefined' ? window.localStorage : null)
  return {
    async load(key) {
      try {
        const raw = storage()?.getItem(prefix + key)
        if (!raw) return null
        const value = JSON.parse(raw) as PersistedColumnState
        return value.version === 1 && Array.isArray(value.visibleColumns) ? value : null
      } catch {
        return null
      }
    },
    async save(key, value) {
      try {
        storage()?.setItem(prefix + key, JSON.stringify(value))
      } catch {
        /* optional persistence must not break the table */
      }
    },
    async remove(key) {
      try {
        storage()?.removeItem(prefix + key)
      } catch {
        /* optional persistence must not break the table */
      }
    },
  }
}
