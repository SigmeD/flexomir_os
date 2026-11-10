import { defineConfig } from '@playwright/test'
import base from './playwright.fe11.config'

export default defineConfig({
  ...base,
  testMatch: /(fe11-reaudit|fos-select-popup|fe11-frozen-contract)\.spec\.ts/,
  outputDir: 'output/playwright/fe11-reaudit/cross-browser',
  reporter: [['line'], ['json', { outputFile: 'output/playwright/fe11-reaudit/cross-browser.json' }]],
})
