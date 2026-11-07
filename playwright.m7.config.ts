import { defineConfig } from '@playwright/test'
import base from './playwright.config'

export default defineConfig({
  ...base,
  testMatch: /m7-.*\.spec\.ts/,
  outputDir: 'output/fe-s03/browser',
  reporter: [['list'], ['json', { outputFile: 'output/fe-s03/results.json' }]],
  projects: ['chromium', 'firefox', 'webkit'].map(browserName => ({
    name: browserName, use: { browserName: browserName as 'chromium' | 'firefox' | 'webkit', viewport: { width: 1440, height: 960 } },
  })),
})
