import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { resolve } from 'node:path'

export default defineConfig(({ mode }) => ({
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
    rollupOptions: {
      input: {
        demo: resolve(__dirname, 'examples/index.html'),
        ...(mode === 'labs'
          ? {
              design: resolve(__dirname, 'examples/design.html'),
              foundations: resolve(__dirname, 'examples/foundations.html'),
              renderers: resolve(__dirname, 'examples/renderers.html'),
            }
          : {}),
      },
    },
    outDir: resolve(__dirname, 'dist-demo'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
}))
