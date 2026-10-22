import { configDefaults, defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue2'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: /^vue2-smart-datatable$/, replacement: resolve(__dirname, 'src/index.ts') },
      { find: /^vue2-smart-datatable\/styles\.css$/, replacement: resolve(__dirname, 'src/styles/index.scss') },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
  },
})
