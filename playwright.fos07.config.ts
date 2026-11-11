import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

export default defineConfig({
  ...base,
  testMatch: 'fos07-datepicker.spec.ts',
  outputDir: `output/playwright/fos07/${process.env.FOS_QA_PHASE === 'red' ? 'red' : 'green'}/artifacts`,
  reporter: [['list'], ['json', { outputFile: `output/playwright/fos07/${process.env.FOS_QA_PHASE === 'red' ? 'red' : 'green'}/results.json` }]],
  use: { ...base.use, video: 'retain-on-failure' },
})
