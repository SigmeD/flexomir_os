import { defineConfig } from '@playwright/test'
import base from './playwright.profile.config'

export default defineConfig({
  ...base,
  testMatch: /(comm-docs(?:-owner)?|communication-model|media-capture)\.spec\.ts/,
  timeout: 60000,
  outputDir: 'output/comm-docs/cross-browser',
  reporter: [['list'],['json',{outputFile:'output/comm-docs/cross-browser-results.json'}]],
})
