import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'
export default defineConfig({
  ...base, testMatch: 'button-system.spec.ts', outputDir: 'output/playwright/button-system/browser',
  reporter: [['line'], ['json', { outputFile: 'output/playwright/button-system/results.json' }]],
})
