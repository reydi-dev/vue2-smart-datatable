import { describe, expect, it } from 'vitest'
import { createLocalStoragePersistenceAdapter } from '@/adapters/persistence/local-storage'
describe('persistence', () => {
  it('round trips versioned state and tolerates corrupt JSON', async () => {
    const adapter = createLocalStoragePersistenceAdapter({ prefix: 'test:' })
    await adapter.save('a', { version: 1, visibleColumns: ['id'] })
    expect(await adapter.load('a')).toEqual({ version: 1, visibleColumns: ['id'] })
    localStorage.setItem('test:a', '{')
    expect(await adapter.load('a')).toBeNull()
    await adapter.remove('a')
  })
})
