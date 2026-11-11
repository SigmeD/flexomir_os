import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

const phase = process.env.FOS_QA_PHASE === 'red' ? 'red' : 'green'
export default defineConfig({
  ...base,
  testMatch: 'next-scope-a.spec.ts',
  outputDir: `output/playwright/next-scope-a/${phase}/artifacts`,
  reporter: [['line'], ['json', { outputFile: `output/playwright/next-scope-a/${phase}/results.json` }]],
  use: { ...base.use, trace: 'retain-on-failure', video: 'retain-on-failure', screenshot: 'only-on-failure' },
})
