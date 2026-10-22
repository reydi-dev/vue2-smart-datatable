import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'build/entry.ts'),
      name: 'SmartDataTable',
      formats: ['es', 'cjs'],
      cssFileName: 'style',
      fileName: (format) => (format === 'es' ? 'smart-data-table.js' : 'smart-data-table.cjs'),
    },
    rollupOptions: {
      external: ['vue'],
      output: { exports: 'named' },
    },
  },
})
