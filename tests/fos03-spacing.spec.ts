import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { chooseFormOption, commitItem, fillItem, chooseMore } from './helpers/orders'

const widths = [1440, 1024, 768, 390, 320]

async function newOrder(page: Page, role = 'manager', pilot = true) {
  await page.goto(`/?view=${role}-orders${pilot ? '&composeSpacing=pilot' : ''}`)
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.evaluate(() => document.fonts.ready)
}

async function geometry(page: Page) {
  return page.getByTestId('order-composer').evaluate(root => {
    const rect = (selector: string) => {
      const box = root.querySelector(selector)!.getBoundingClientRect()
      return { x: box.x, y: box.y, width: box.width, height: box.height, bottom: box.bottom }
    }
    const company = root.querySelector('.fos-order-composer__company') ? rect('.fos-order-composer__company') : null
    const heading = rect('.fos-page-header h1'), subtitle = rect('.fos-page-header__subtitle')
    const products = rect('.fos-order-composer__products'), general = rect('.fos-order-composer__general')
    const title = rect('.fos-order-composer__general > h2'), dates = rect('.fos-order-composer__dates'), note = rect('.fos-order-composer__general > .fos-field')
    const controls = [...root.querySelectorAll('.fos-field__control')].map(node => node.getBoundingClientRect().height)
    return { company, products, general, title, dates, note, controls, heading, subtitle,
      subtitleGap: subtitle.y - heading.bottom,
      companyGap: company ? products.y - company.bottom : null,
      sectionGap: general.y - products.bottom, headingGap: dates.y - title.bottom,
      noteGap: note.y - dates.bottom, overflow: document.documentElement.scrollWidth - innerWidth }
  })
}

async function addItem(page: Page, name: string) {
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  await fillItem(page, name)
  await commitItem(page)
}

for (const width of widths) {
  test(`FOS03 pilot has one spacing rhythm with 0/1/N items at ${width}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 960 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await newOrder(page)
    for (const count of [0, 1, 2]) {
      if (count === 1) await chooseFormOption(page, 'Компания', 'Компания 01')
      if (count > 0) await addItem(page, `Позиция DEMO ${count}`)
      await page.evaluate(() => { window.scrollTo(0, 0) })
      const layout = await geometry(page)
      await page.screenshot({ path: info.outputPath(`manager-${width}-${count}.png`), fullPage: true })
      await info.attach(`geometry-${count}`, { body: JSON.stringify(layout), contentType: 'application/json' })
      expect(layout.companyGap).toBe(32)
      expect(layout.sectionGap).toBe(32)
      expect(layout.headingGap).toBe(24)
      expect(layout.noteGap).toBe(24)
      expect(layout.subtitleGap).toBe(8)
      expect(layout.company!.y).toBe(width >= 1024 ? 151 : 193)
      expect(layout.subtitle.y).toBe(width >= 1024 ? 108 : 154)
      await expect(page.locator('.fos-page-header__subtitle')).toHaveCSS('font-size', width >= 1024 ? '14px' : '12px')
      expect(layout.overflow).toBe(0)
      await expect(page.getByLabel('Желаемый срок', { exact: true })).toHaveCSS('height', '44px')
      await expect(page.getByLabel('Согласованный срок', { exact: true })).toHaveCount(0)
      const dateWidth = await page.getByLabel('Желаемый срок', { exact: true }).evaluate(node => node.getBoundingClientRect().width)
      if (width >= 1440) expect(dateWidth).toBe(506)
      if (width <= 390) expect(dateWidth).toBe(width - 40)
      await expect(page.getByRole('button', { name: 'Добавить позицию', exact: true })).toHaveCSS('width', '44px')
    }
    expect(errors).toEqual([])
  })

  test(`FOS03 accepted Manager spacing is active without a flag and Client is flag-independent at ${width}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 960 })
    await newOrder(page, 'manager', false)
    const current = await geometry(page)
    expect(current.companyGap).toBe(32)
    expect(current.sectionGap).toBe(32)
    expect(current.headingGap).toBe(24)
    expect(current.noteGap).toBe(24)
    expect(current.subtitleGap).toBe(8)
    expect(current.company!.y).toBe(width >= 1024 ? 151 : 193)
    await page.screenshot({ path: info.outputPath(`manager-default-${width}.png`), fullPage: true })
    await newOrder(page, 'client', false)
    const client = await geometry(page)
    await newOrder(page, 'client', true)
    expect(await geometry(page)).toEqual(client)
    await expect(page.getByLabel('Согласованный срок', { exact: true })).toHaveAttribute('readonly', '')
    await expect(page.getByLabel('Согласованный срок', { exact: true })).toHaveValue('')
  })
}

test('FOS03 pilot keeps private Save, item IDs, dates and cancel behavior', async ({ page }) => {
  await newOrder(page)
  const composer = page.getByTestId('order-composer')
  const orderId = await composer.getAttribute('data-order-id')
  const save = page.getByRole('button', { name: 'Сохранить черновик менеджера', exact: true })
  await expect(save).toBeDisabled()
  await chooseFormOption(page, 'Компания', 'Компания 01')
  await addItem(page, 'Очень длинное наименование демонстрационной продукции для проверки переноса строки')
  const row = composer.locator('li[data-item-id]').first()
  const itemId = await row.getAttribute('data-item-id')
  await page.getByLabel('Желаемый срок', { exact: true }).fill('01.12.2026')
  await page.getByLabel('Комментарии', { exact: true }).fill('Комментарий DEMO')
  await save.click()
  await expect(save).toBeDisabled()
  await page.getByRole('button', { name: 'Изменить позицию 1', exact: true }).click()
  await page.getByLabel('Количество', { exact: true }).fill('900')
  await chooseMore(page, 'Отменить изменения')
  await expect(row).toContainText('500 шт.')
  await expect(row).toHaveAttribute('data-item-id', itemId!)
  await expect(composer).toHaveAttribute('data-order-id', orderId!)
  await expect(page.getByLabel('Желаемый срок', { exact: true })).toHaveValue('01.12.2026')
  await expect(page.getByLabel('Комментарии', { exact: true })).toHaveValue('Комментарий DEMO')
  await expect(page.getByRole('button', { name: /Предоставить клиенту|Передать менеджеру|Создать заказ/, exact: true })).toHaveCount(0)
})

test('FOS03 pilot remains usable at narrow height, 200 percent CSS zoom, reduced motion and forced colors', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 480 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await newOrder(page)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.getByLabel('Комментарии', { exact: true }).fill('Низкий экран DEMO')
  await page.getByLabel('Комментарии', { exact: true }).scrollIntoViewIfNeeded()
  await expect(page.getByLabel('Комментарии', { exact: true })).toBeInViewport()
  // 780px at 200% retains a supported 390px layout; 390px at 200% would
  // demand 195px, below the project's 320px responsive contract.
  await page.setViewportSize({ width: 780, height: 960 })
  await page.evaluate(() => { document.documentElement.style.zoom = '2' })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.evaluate(() => { document.documentElement.style.zoom = '' })
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
  await chooseFormOption(page, 'Компания', 'Компания 01')
  await expect(page.getByRole('button', { name: 'Сохранить черновик менеджера', exact: true })).toBeEnabled()
})
