import { defineConfig } from '@playwright/test'
import base from './playwright.fe11.config'

export default defineConfig({
  ...base,
  testMatch: /(fe11-reaudit|fe11-rollout|fos-select-popup|glass-select-api|fe11-frozen-contract)\.spec\.ts/,
  outputDir: 'output/playwright/fe11-reaudit/cross-browser',
  reporter: [['line'], ['json', { outputFile: 'output/playwright/fe11-reaudit/cross-browser.json' }]],
})
