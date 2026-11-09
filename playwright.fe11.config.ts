import { defineConfig } from '@playwright/test'
import base from './playwright.config'

export default defineConfig({
  ...base,
  testMatch: /(navigation-drawer|fe11-drawer-pilot|fe11-popup-adapters|fe11-frozen-contract|profile-settings|glass-select-api|glass-select-theme|popup-surface)\.spec\.ts/,
  outputDir: 'output/playwright/fe11-pilot/results',
  reporter: [['list'], ['json', { outputFile: 'output/playwright/fe11-pilot/results.json' }]],
  projects: [
    { name: 'chromium-fe11', use: { browserName: 'chromium', viewport: { width: 390, height: 844 } } },
    { name: 'firefox-fe11', use: { browserName: 'firefox', viewport: { width: 390, height: 844 } } },
    { name: 'webkit-fe11', use: { browserName: 'webkit', viewport: { width: 390, height: 844 } } },
    { name: 'touch-fe11', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
  ],
})
