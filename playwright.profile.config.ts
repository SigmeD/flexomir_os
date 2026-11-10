import { defineConfig } from '@playwright/test'
import base from './playwright.config'

/** Account/Profile regression across browser engines and a touch-enabled mobile viewport. */
export default defineConfig({
  ...base,
  testMatch: /(profile-settings|typography-contract)\.spec\.ts/,
  timeout: 30000,
  outputDir: 'output/playwright/profile-settings',
  reporter: [['list'], ['json', { outputFile: 'output/playwright/profile-settings/results.json' }]],
  projects: [
    { name: 'chromium-profile', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
    { name: 'firefox-profile', use: { browserName: 'firefox', viewport: { width: 1440, height: 900 } } },
    { name: 'webkit-profile', use: { browserName: 'webkit', viewport: { width: 1440, height: 900 } } },
    { name: 'chromium-touch-profile', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
  ],
})
