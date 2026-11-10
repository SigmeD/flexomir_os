import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

const phase = process.env.FOS03_PHASE === 'red' ? 'red' : 'green'
export default defineConfig({
  ...base,
  testMatch: 'fos03-spacing.spec.ts',
  outputDir: `output/playwright/fos03/${phase}/artifacts`,
  reporter: [['line'], ['json', { outputFile: `output/playwright/fos03/${phase}/results.json` }]],
  use: { ...base.use, screenshot: 'only-on-failure', trace: 'retain-on-failure', video: 'retain-on-failure' },
})
