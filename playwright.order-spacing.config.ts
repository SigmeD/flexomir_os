import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

export default defineConfig({
  ...base,
  testMatch: /(order-status-spacing|fos03-spacing)\.spec\.ts/,
  timeout: 60000,
  outputDir: 'output/playwright/order-spacing',
  reporter: [['line'], ['json', { outputFile: 'output/order-spacing-results.json' }]],
  use: { ...base.use, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
})
