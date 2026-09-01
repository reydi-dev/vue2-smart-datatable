import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { resolve } from 'node:path'

export default defineConfig({
  root: 'examples',
  plugins: [vue()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  server: { port: 4173 },
})
