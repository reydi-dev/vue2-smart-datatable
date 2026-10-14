import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { resolve } from 'node:path'

export default defineConfig({
  root: 'examples',
  base: process.env.SDT_DEMO_BASE || '/',
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: /^vue$/, replacement: resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm.js') },
    ],
  },
  server: { port: 4173 },
  css: {
    preprocessorOptions: {
      scss: { silenceDeprecations: ['import', 'global-builtin'] },
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist-demo'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
})
