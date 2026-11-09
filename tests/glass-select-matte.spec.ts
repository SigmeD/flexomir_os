import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { selectContrast } from './helpers/select-contrast'

test('Select uses the shared popup surface, keeps readable states, and preserves selection', async ({ page }, testInfo) => {
  await page.goto('/?view=glass-filter-lab&glass=matte')
  const trigger = page.getByTestId('filter-control').locator('button')
  await trigger.click()
  const popup = page.getByRole('listbox')
  await expect(popup).toHaveCSS('opacity', '1')
  await expect(popup.locator('.glass-select-viewport')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  await expect(popup.locator('.glass-select-viewport')).toHaveCSS('background-image', 'none')
  const material = popup.locator('.glass-select-material')
  await expect(material).toHaveAttribute('data-fos-popup-surface', '')
  await expect(material).toHaveCSS('border-radius', '20px')
  await expect(material).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.72)')
  await expect(material).toHaveCSS('backdrop-filter', 'blur(20px)')
  await expect(material.locator('.fos-popup-surface__shell > .fos-glass-optics')).not.toHaveCSS('box-shadow', 'none')
  await expect(material.locator('[data-motion="travel"]')).toHaveCount(1)
  const states = [await selectContrast(page)]
  await page.getByRole('option', { name: 'Черновики', exact: true }).hover()
  await page.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished)))
  states.push(await selectContrast(page))
  await page.keyboard.press('ArrowDown')
  await page.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished)))
  states.push(await selectContrast(page))
  const metrics = {
    ...states[0],
    trigger: Math.min(...states.map(state => state.trigger)),
    options: states[0].options.map((option, i) => ({ ...option, ratio: Math.min(...states.map(state => state.options[i].ratio)) })),
    states,
  }
  for (const option of metrics.options) expect(option.ratio).toBeGreaterThanOrEqual(4.5)
  const axe = await new AxeBuilder({ page }).include('[data-testid="filter-control"]').include('[role="listbox"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  expect(axe.violations).toEqual([])
  await testInfo.attach('shared-popup-contrast', { body: JSON.stringify(metrics), contentType: 'application/json' })
  await testInfo.attach('shared-popup-axe', { body: JSON.stringify(axe), contentType: 'application/json' })
  await page.getByRole('option', { name: 'Черновики', exact: true }).click()
  await expect(trigger).toContainText('Черновики')
  await expect(page.locator('.order-row')).toHaveCount(2)
})
