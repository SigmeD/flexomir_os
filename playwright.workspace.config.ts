import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: 'workspace-layout.spec.ts',
  timeout: 90000,
  reporter: [['list'], ['json', { outputFile: 'output/playwright/workspace-layout/results.json' }]],
  use: { baseURL: 'http://127.0.0.1:5173', trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:5173', reuseExistingServer: true, timeout: 120000 },
})
