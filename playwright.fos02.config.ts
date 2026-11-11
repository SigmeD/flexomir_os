import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

const production = process.env.FOS02_PRODUCTION === '1'

export default defineConfig({
  ...base,
  testMatch: /(fos02-account-preview|fe11-frozen-contract)\.spec\.ts/,
  timeout: 60000,
  outputDir: production ? 'output/playwright/fos02/production' : 'output/playwright/fos02/qa',
  reporter: [['line'], ['json', { outputFile: production ? 'output/playwright/fos02/production-results.json' : 'output/playwright/fos02/results.json' }]],
  use: { ...base.use, baseURL: production ? 'http://127.0.0.1:5187' : base.use?.baseURL, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: production ? { command: 'npm run preview -- --port 5187', url: 'http://127.0.0.1:5187', reuseExistingServer: true, timeout: 120000 } : base.webServer,
})
