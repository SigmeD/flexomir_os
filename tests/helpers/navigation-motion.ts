import { expect, type Page } from '@playwright/test'

/** Static geometry, screenshots and a11y checks run after navigation has settled. */
export async function waitForNavigationMotion(page: Page) {
  const html = page.locator('html')
  await expect(html).not.toHaveAttribute('data-order-navigation-motion', /forward|back/)
  await expect(html).not.toHaveAttribute('data-order-navigation-fallback', /forward|back/)
  await expect(html).not.toHaveAttribute('data-cabinet-section-motion', 'enter')
}
