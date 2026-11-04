import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  outputDir: 'output/playwright/fos-material/test-artifacts',
  testDir: './tests',
  testMatch: /fos-glass-material\.spec\.ts/,
  reporter: [['list'], ['json', { outputFile: 'output/playwright/fos-material/results.json' }]],
  use: { baseURL: 'http://127.0.0.1:5173', trace: 'retain-on-failure' },
  projects: [
    { name: 'material-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'material-mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
    { name: 'material-firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } } },
    { name: 'material-webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:5173', reuseExistingServer: true, timeout: 120000 },
})
