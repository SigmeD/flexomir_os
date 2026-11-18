import { expect, test } from '@playwright/test'

for (const role of ['client', 'manager'] as const) {
  test(`${role} filter text stays sharp while the lens moves without changing button widths`, async ({ page }) => {
    await page.goto(`/?view=${role}-orders`)
    await page.evaluate(() => document.fonts.ready)
    const group = page.getByTestId('glass-pill-tabs').filter({ has: page.getByRole('button', { name: 'На рассмотрении' }) })
    const buttons = group.locator('.fos-glass-pill-tabs__button')
    const widths = await buttons.evaluateAll(nodes => nodes.map(node => (node as HTMLElement).getBoundingClientRect().width))
    const review = group.getByRole('button', { name: 'На рассмотрении' })
    await review.click()
    await expect(review).toHaveAttribute('aria-pressed', 'true')
    const during = await review.locator('.fos-glass-pill-tabs__label-text').evaluate(async node => {
      const lens = node.closest('.fos-glass-pill-tabs')?.querySelector('.fos-glass-pill-tabs__lens-frame')
      const frames = []
      for (let index = 0; index < 8; index++) {
        await new Promise(requestAnimationFrame)
        frames.push({ transform: getComputedStyle(node).transform, size: parseFloat(getComputedStyle(node).fontSize), motion: lens?.getAttribute('data-motion-state') })
      }
      return frames
    })
    expect(during.some(frame => frame.motion === 'moving' && frame.size > 13)).toBe(true)
    expect(during.every(frame => frame.transform === 'none')).toBe(true)
    await expect(group.getByTestId('glass-pill-lens-frame')).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })

    const label = review.locator('.fos-glass-pill-tabs__label')
    const text = review.locator('.fos-glass-pill-tabs__label-text')
    await expect(label).toHaveCSS('transform', 'none')
    await expect(text).toHaveCSS('transform', 'none')
    const size = await text.evaluate(node => parseFloat(getComputedStyle(node).fontSize))
    expect(size).toBeCloseTo(13 * 1.043, 2)
    const after = await buttons.evaluateAll(nodes => nodes.map(node => (node as HTMLElement).getBoundingClientRect().width))
    after.forEach((width, index) => expect(Math.abs(width - widths[index])).toBeLessThan(.25))
    await expect(group.locator('[data-fos-glass-material]')).toHaveCount(1)
  })
}
