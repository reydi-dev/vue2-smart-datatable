import { configDefaults, defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue2'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
  },
})
