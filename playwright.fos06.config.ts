import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

const phase = process.env.FOS_QA_PHASE === 'red' ? 'red' : 'green'
export default defineConfig({
  ...base,
  testMatch: 'fos06-item-actions.spec.ts',
  outputDir: `output/playwright/fos06/${phase}/artifacts`,
  reporter: [['list'], ['json', { outputFile: `output/playwright/fos06/${phase}/results.json` }]],
})
