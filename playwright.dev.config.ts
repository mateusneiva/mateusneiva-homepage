import { defineConfig } from '@playwright/test'
import config from './playwright.config'

export default defineConfig({
  ...config,
  use: { ...config.use, baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'pnpm dev --port 3000',
    url: 'http://localhost:3000/pt',
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
  },
})
