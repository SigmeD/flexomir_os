import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

export default defineConfig({
  ...base,
  testMatch: 'plus-surface-motion.spec.ts',
  outputDir: 'output/playwright/plus-motion/browser',
  reporter: [['line'], ['json', { outputFile: 'output/playwright/plus-motion/results.json' }]],
  use: { ...base.use, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
})
