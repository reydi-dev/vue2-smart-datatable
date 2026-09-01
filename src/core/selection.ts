import type { RowKey } from '../types'

export function toggleKey(keys: RowKey[], key: RowKey, selected?: boolean): RowKey[] {
  const exists = keys.includes(key)
  const shouldSelect = selected ?? !exists
  if (shouldSelect && !exists) return [...keys, key]
  if (!shouldSelect && exists) return keys.filter((item) => item !== key)
  return [...keys]
}

export function togglePageKeys(keys: RowKey[], pageKeys: RowKey[], selected: boolean): RowKey[] {
  const next = new Set(keys)
  pageKeys.forEach((key) => (selected ? next.add(key) : next.delete(key)))
  return [...next]
}
