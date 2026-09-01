import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  webServer: {
    command: 'npm.cmd run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    channel: process.env.SDT_PLAYWRIGHT_CHANNEL || undefined,
  },
})
