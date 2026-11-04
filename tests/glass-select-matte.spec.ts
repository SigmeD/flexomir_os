import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { selectContrast } from './helpers/select-contrast'

test('matte comparison uses a uniform 97% surface, a quiet rim and one soft shadow', async ({ page }, testInfo) => {
  await page.goto('/?glass=matte')
  const trigger = page.getByTestId('filter-control').locator('button')
  await trigger.click()
  const popup = page.getByRole('listbox')
  await expect(popup).toHaveCSS('opacity', '1')
  await expect(popup.locator('.glass-select-viewport')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  await expect(popup.locator('.glass-select-viewport')).toHaveCSS('background-image', 'none')
  await expect(popup.locator('feDisplacementMap')).toHaveCount(1)
  expect(Number(await popup.locator('feDisplacementMap').getAttribute('scale'))).toBeLessThan(16)
  const material = popup.locator('.glass-select-material')
  const center = await material.evaluate(el => {
    const probe = document.createElement('span')
    probe.style.color = 'rgb(var(--fos-center-rgb) / var(--fos-center-opacity))'
    el.append(probe)
    const color = getComputedStyle(probe).color
    probe.remove()
    return color
  })
  expect(center).toBe('rgba(249, 251, 252, 0.97)')
  await expect(material).toHaveCSS('box-shadow', 'none')
  const shadows = await material.locator(':scope > div[aria-hidden]').evaluateAll(nodes => nodes.map(el => getComputedStyle(el).boxShadow).filter(value => value !== 'none'))
  expect(shadows).toHaveLength(1)
  const parts = shadows[0].split(/,(?![^(]*\))/)
  expect(parts.filter(value => !value.includes('inset'))).toHaveLength(1)
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
  await testInfo.attach('matte-97-contrast', { body: JSON.stringify(metrics), contentType: 'application/json' })
  await testInfo.attach('matte-97-axe', { body: JSON.stringify(axe), contentType: 'application/json' })
  await page.getByRole('option', { name: 'Черновики', exact: true }).click()
  await expect(trigger).toContainText('Черновики')
  await expect(page.locator('.order-row')).toHaveCount(2)
})
