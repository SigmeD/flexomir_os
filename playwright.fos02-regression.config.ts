import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

export default defineConfig({
  ...base,
  testMatch: /(popup-dismissal|fe11-frozen-contract|fe11-popup-adapters|profile-settings)\.spec\.ts/,
  timeout: 60000,
  outputDir: 'output/playwright/fos02/regression',
  reporter: [['line'], ['json', { outputFile: 'output/playwright/fos02/regression-results.json' }]],
  use: { ...base.use, trace: 'retain-on-failure' },
})
