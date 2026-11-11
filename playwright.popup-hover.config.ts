import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

const production = process.env.POPUP_HOVER_PRODUCTION === '1'
export default defineConfig({
  ...base,
  testMatch: /popup-hover-rollout\.spec\.ts/,
  outputDir: production ? 'output/playwright/popup-hover/production' : 'output/playwright/popup-hover/qa',
  reporter: [['line'], ['json', { outputFile: `output/playwright/popup-hover/${production ? 'production-' : ''}results.json` }]],
  use: { ...base.use, baseURL: production ? 'http://127.0.0.1:5187' : base.use?.baseURL, video: 'retain-on-failure', trace: 'retain-on-failure' },
  webServer: production ? { command: 'npm run preview -- --port 5187', url: 'http://127.0.0.1:5187', reuseExistingServer: true, timeout: 120000 } : base.webServer,
})
