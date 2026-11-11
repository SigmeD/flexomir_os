import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

/** One opt-in ArtworkSource reference across browser engines and touch. */
export default defineConfig({
  ...base,
  testMatch: 'fos12-artwork.spec.ts',
  outputDir: 'output/playwright/fos12/targeted',
  reporter: [['line'], ['json', { outputFile: 'output/playwright/fos12/results.json' }]],
  use: { ...base.use, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
})
