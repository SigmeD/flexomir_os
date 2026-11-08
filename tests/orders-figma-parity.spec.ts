import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { backToOrders, chooseMore, commitItem, fillItem } from './helpers/orders'

test('Client/Manager list, readonly detail and draft composition meet basic screen accessibility', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const audit = async (root: string) => {
    await page.evaluate(() => document.fonts.ready)
    const result = await new AxeBuilder({ page }).include(root).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(result.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }))).toEqual([])
  }
  for (const role of ['client', 'manager']) {
    await page.goto('/?view=' + role + '-orders')
    await audit('[data-testid="' + role + '-orders-screen"]')
    await page.getByRole('button', { name: 'Открыть заказ DEMO-003', exact: true }).click()
    await audit('[data-testid="order-detail"]')
  }
  await page.goto('/?view=client-orders')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await audit('[data-testid="order-composer"]')
})

test('reference New Item uses shared Header Add/More, FOS fields, segmented and no footer substitutes', async ({ page }, testInfo) => {
  await page.goto('/?view=client-orders')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  const form = page.getByTestId('order-item-form')
  await expect(form.getByRole('heading', { level: 1, name: 'Новая позиция', exact: true })).toBeVisible()
  await expect(form.locator('.fos-page-header [data-action=add]')).toBeDisabled()
  await expect(form.getByRole('button', { name: 'Ещё', exact: true })).toBeVisible()
  await expect(form.locator('.fos-field')).toHaveCount(7)
  await expect(form.locator('.fos-segmented')).toBeVisible()
  await expect(form.getByRole('button', { name: /Восстановить значения|Закрыть форму позиции|Сохранить позицию/ })).toHaveCount(0)
  // Fresh M8 evidence for the approved blank New Item reference, including narrow widths.
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 960 })
    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({
      path: `output/playwright/m8/${testInfo.project.name}/client-item-new-${width}.png`,
      fullPage: true,
      animations: 'disabled',
    })
  }
})

test('complete Orders compositions at five widths for Figma side-by-side review', async ({ page }, testInfo) => {
  test.setTimeout(90000)
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 975 })
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'none' })
    await page.goto('/?view=client-orders&demoTools=1')
    const capture = async (name: string) => {
      // The explicit role-switch harness is outside the product/Figma surface.
      const style = await page.addStyleTag({ content: '.fos-demo-workspace__controls { display:none }' })
      await page.evaluate(async () => { await document.fonts.ready; window.scrollTo(0, 0) })
      await page.mouse.move(0, 0)
      const overflow = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, nodes: Array.from(document.querySelectorAll('body *')).map(element => ({ tag: element.tagName, cls: element.className, right: element.getBoundingClientRect().right })).filter(node => node.right > innerWidth + 1).slice(0,12) }))
      expect(overflow.scroll <= overflow.width, name + ': ' + JSON.stringify(overflow)).toBe(true)
      await page.screenshot({ path: 'output/fe-s02-parity/' + testInfo.project.name + '/react-' + name + '-' + width + '.png', fullPage: true, animations: 'disabled' })
      await style.evaluate(node => node.parentNode?.removeChild(node))
    }
    await capture('client-list')
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    await capture('composer-0')
    await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
    await fillItem(page, 'Этикетка самоклеящаяся')
    await commitItem(page)
    await capture('composer-1')
    await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
    await fillItem(page, 'Визитки')
    await commitItem(page)
    await capture('composer-2')
    await page.getByRole('button', { name: 'Изменить позицию 1', exact: true }).click()
    await page.getByLabel('Нужна помощь с макетом').uncheck()
    await capture('edit-item')
    await page.getByLabel('Количество', { exact: true }).fill('600')
    await page.getByLabel('Нужна помощь с макетом').check()
    await commitItem(page)
    await backToOrders(page)
    await page.getByRole('button', { name: 'Открыть заказ DEMO-007', exact: true }).click()
    await capture('client-detail')
    await page.getByRole('button', { name: 'Ещё', exact: true }).click()
    await capture('completed-menu')
    await page.keyboard.press('Escape')
    await chooseMore(page, 'Дублировать заказ')
    await capture('repeat')
    const id = await page.getByTestId('order-composer').getAttribute('data-order-id')
    await page.getByRole('button', { name: 'Изменить позицию 1', exact: true }).click()
    await page.getByLabel('Нужна помощь с макетом').check()
    await commitItem(page)
    await page.getByRole('button', { name: 'Передать менеджеру (демо)' }).click()
    await capture('submitted')
    await page.getByRole('button', { name: 'Демо: менеджер', exact: true }).click()
    await capture('manager-list')
    await page.getByRole('button', { name: 'Открыть заказ ' + id, exact: true }).click()
    await capture('manager-detail')
  }
})

test('reference New Item responsive geometry and screenshots', async ({ page }, testInfo) => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 975 })
    await page.goto('/?view=client-orders')
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
    await page.evaluate(() => document.fonts.ready)
    const form = page.getByTestId('order-item-form')
    const fields = await form.locator('.fos-item-form__fields').boundingBox()
    expect(Math.round(fields!.x)).toBe(width >= 1024 ? 295 : 20)
    expect(Math.round(fields!.y)).toBe(width >= 1024 ? 152 : 178)
    await expect(form.getByRole('heading', { name: 'Новая позиция' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: 'output/fe-s02-parity/' + testInfo.project.name + '/react-new-item-' + width + '.png', fullPage: true })
  }
})
