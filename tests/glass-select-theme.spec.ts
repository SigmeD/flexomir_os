import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { selectContrast } from './helpers/select-contrast'

test('light closed and open Select pass axe without disabling contrast rules', async ({ page }, testInfo) => {
  await page.goto('/')
  const trigger = page.getByTestId('filter-control').locator('button')
  await expect(trigger).toContainText('Все заказы')
  for (const state of ['closed', 'open']) {
    if (state === 'open') {
      await trigger.click()
      await expect(page.locator('[role="listbox"]')).toHaveCSS('opacity', '1')
    }
    const results = await new AxeBuilder({ page })
      .include('[data-testid="filter-control"]')
      .include('[role="listbox"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    await testInfo.attach(`axe-${state}`, { body: JSON.stringify(results, null, 2), contentType: 'application/json' })
    expect.soft(results.violations, `${state} Select axe violations`).toEqual([])
    const controlledId = await trigger.getAttribute('aria-controls')
    expect(await page.evaluate(id => document.getElementById(id!)?.getAttribute('role'), controlledId)).toBe('listbox')
    expect(results.incomplete.filter(rule => !['color-contrast', 'aria-valid-attr-value'].includes(rule.id))).toEqual([])
  }
})

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} palette keeps text at least 4.5:1 in trigger, selected, hovered and focused options`, async ({ page }, testInfo) => {
    await page.goto('/')
    await page.evaluate(t => { document.documentElement.dataset.theme = t }, theme)
    const trigger = page.getByTestId('filter-control').locator('button')
    await expect(trigger).toHaveCSS('color-scheme', theme)
    await trigger.click()
    await expect(page.getByRole('listbox')).toHaveCSS('opacity', '1')
    await expect(page.getByRole('listbox')).toHaveCSS('color-scheme', theme)
    const measurements = []
    for (const state of ['normal', 'hover', 'focus']) {
      const item = page.getByRole('option', { name: 'Черновики', exact: true })
      if (state === 'hover') await item.hover()
      if (state === 'focus') await item.focus()
      await page.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished)))
      const measure = await selectContrast(page)
      measurements.push({ state, ...measure })
      expect.soft(measure.trigger, `${theme} trigger contrast`).toBeGreaterThanOrEqual(4.5)
      expect.soft(measure.border, `${theme} trigger border contrast`).toBeGreaterThanOrEqual(3)
      for (const option of measure.options) expect.soft(option.ratio, `${theme} ${state} ${option.label} contrast`).toBeGreaterThanOrEqual(4.5)
    }
    await testInfo.attach(`contrast-${theme}`, { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' })
  })
}

test('explicit light theme survives a dark OS preference in the body portal', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  const trigger = page.getByTestId('filter-control').locator('button')
  await expect(trigger).toHaveCSS('color-scheme', 'light')
  await trigger.click()
  await expect(page.getByRole('listbox')).toHaveCSS('color-scheme', 'light')
  await expect(page.getByRole('listbox')).toHaveCSS('opacity', '1')
  const measure = await selectContrast(page)
  expect(measure.trigger).toBeGreaterThanOrEqual(4.5)
  for (const option of measure.options) expect(option.ratio).toBeGreaterThanOrEqual(4.5)
})

test('keyboard focus is visible and closed options cannot receive focus', async ({ page }) => {
  await page.goto('/')
  const trigger = page.getByTestId('filter-control').locator('button')
  await page.keyboard.press('Tab')
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveCSS('outline-style', 'solid')
  const focusWidth = await trigger.evaluate(el => parseFloat(getComputedStyle(el).outlineWidth))
  expect(focusWidth).toBeGreaterThanOrEqual(2)
  expect((await selectContrast(page)).focusRing).toBeGreaterThanOrEqual(3)
  await page.keyboard.press('Enter')
  await expect(page.getByRole('option', { name: 'Все заказы', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(page.getByRole('option')).toHaveCount(0)
  await expect(page.locator('[role="listbox"]')).toHaveAttribute('inert', '')
})

test('theme classes, explicit data theme and system fallback agree between trigger and portal', async ({ page }) => {
  const cases = [
    { classes: 'dark', theme: 'light', os: 'light', expected: 'dark' },
    { classes: 'light', theme: 'dark', os: 'dark', expected: 'light' },
    { classes: '', theme: '', os: 'dark', expected: 'dark' },
    { classes: '', theme: '', os: 'light', expected: 'light' },
  ] as const
  for (const scenario of cases) {
    await page.emulateMedia({ colorScheme: scenario.os })
    await page.goto('/')
    await page.evaluate(({ classes, theme }) => {
      document.documentElement.className = classes
      if (theme) document.documentElement.dataset.theme = theme
      else delete document.documentElement.dataset.theme
    }, scenario)
    const trigger = page.getByTestId('filter-control').locator('button')
    await expect(trigger).toHaveCSS('color-scheme', scenario.expected)
    await trigger.click()
    await expect(page.getByRole('listbox')).toHaveCSS('color-scheme', scenario.expected)
    await expect(page.getByRole('listbox')).toHaveCSS('opacity', '1')
  }
})
