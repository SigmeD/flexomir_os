import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

export default defineConfig({
  ...base,
  testMatch: 'neutral-actions.spec.ts',
  outputDir: 'output/playwright/fos08-09/browser',
  reporter: [['line'], ['json', { outputFile: 'output/playwright/fos08-09/results.json' }]],
  use: { ...base.use, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
})
