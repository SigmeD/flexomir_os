import { defineConfig } from '@playwright/test'
import base from './playwright.fe11.config'

/** Lifecycle regression and frozen-reference checks; same four browser/input projects. */
export default defineConfig({
  ...base,
  testMatch: /(popup-dismissal|fe11-frozen-contract|fe11-popup-adapters|fe-debug-order-transitions|order-compose|m7-responsive-actions)\.spec\.ts/,
  grep: /Profile action keeps|closed menu exits|approved coverage|Account rapid|Account adapter|Select adapter|More deletes only|exclusive artwork HELP|FOSAction secondary keeps/,
  projects: base.projects?.map(project => ({
    ...project,
    ...(project.name === 'touch-fe11' ? { grepInvert: /FOSAction secondary keeps/ } : {}),
  })),
  outputDir: 'output/playwright/post-fe11/cross-browser',
  reporter: [['list'], ['json', { outputFile: 'output/playwright/post-fe11/cross-browser.json' }]],
})
