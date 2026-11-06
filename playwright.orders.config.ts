import { defineConfig } from '@playwright/test'
import base from './playwright.config'

/** Reproduce the local Orders cross-engine QA; physical devices remain a separate check. */
export default defineConfig({
  ...base,
  testMatch: /(client-orders|manager-orders|order-detail|order-compose|orders-components|orders-figma-parity)\.spec\.ts/,
  outputDir: 'output/playwright/orders-cross-browser',
  reporter: [['list'], ['json', { outputFile: 'output/playwright/orders-cross-browser/results.json' }]],
  projects: [
    { name: 'firefox-orders', use: { browserName: 'firefox', viewport: { width: 390, height: 844 } } },
    { name: 'webkit-orders', use: { browserName: 'webkit', viewport: { width: 390, height: 844 } } },
  ],
})
