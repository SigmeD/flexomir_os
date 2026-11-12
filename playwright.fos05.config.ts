import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

const phase = process.env.FOS_QA_PHASE === 'red' ? 'red' : 'green'
export default defineConfig({
  ...base,
  testMatch: 'fos05-save.spec.ts',
  outputDir: `output/playwright/fos05/${phase}/artifacts`,
  reporter: [['list'], ['json', { outputFile: `output/playwright/fos05/${phase}/results.json` }]],
})
