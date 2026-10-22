import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  webServer: {
    command: `${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run build:demo:labs && ${process.platform === 'win32' ? 'npx.cmd' : 'npx'} vite preview --config vite.demo.config.ts --host 127.0.0.1 --port 4174`,
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
  },
  use: {
    baseURL: 'http://127.0.0.1:4174',
    channel: process.env.SDT_PLAYWRIGHT_CHANNEL || undefined,
  },
})
