import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  testIgnore: /fos-glass-material\.spec\.ts/,
  reporter: [['list'], ['json', { outputFile: 'output/playwright/glass-select-theme/results.json' }]],
  // With retries=0, on-first-retry loses the only failing attempt. Keep DOM,
  // network and sources for that first failure, plus its actual screenshot.
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: { mode: 'retain-on-failure', screenshots: false, snapshots: true, sources: true },
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium-1440', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'chromium-390', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:5173', reuseExistingServer: true, timeout: 120000 },
})
