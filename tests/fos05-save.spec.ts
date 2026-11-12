import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { backToOrders, chooseMore, commitItem, fillItem } from './helpers/orders'
import { emptyDemoItem, validDemoItem, type DemoItem } from '../src/demo/order-compose-model'

async function repeat(page: Page) {
  await page.goto('/?view=client-orders')
  await page.locator('[data-order-open="DEMO-007"]').click()
  await chooseMore(page, 'Дублировать заказ')
  const composer = page.getByTestId('order-composer')
  const id = await composer.getAttribute('data-order-id')
  const itemId = await composer.locator('li[data-item-id]').first().getAttribute('data-item-id')
  await page.getByRole('button', { name: 'Изменить позицию 1', exact: true }).click()
  return { composer, id, itemId }
}

const save = (page: Page) => page.getByRole('button', { name: 'Сохранить позицию', exact: true })
const artworkError = (page: Page) => page.locator('.fos-artwork-source > .fos-field__error')

for (const source of ['LOCAL', 'LIBRARY', 'HELP'] as const) {
  test(`repeat: ${source} clears the field reason, preserves validation, IDs and cancel`, async ({ page }) => {
    const { composer, id, itemId } = await repeat(page)
    await expect(artworkError(page)).toContainText(/недоступен/i)
    await expect(save(page)).toBeDisabled()
    await page.getByLabel('Количество', { exact: true }).fill('1234')
    await expect(save(page)).toBeDisabled()
    await expect(artworkError(page)).toBeVisible()
    // Owner chose field-only errors: the header owns no validation text.
    await expect(page.locator('.fos-page-header .fos-field__error')).toHaveCount(0)
    await expect(page.locator('.fos-artwork-source button[aria-invalid="true"]').first()).toHaveAccessibleDescription(/недоступен/i)
    if (source === 'LOCAL') {
      await page.getByLabel('Выбрать файл макета').setInputFiles({ name: 'fos05.txt', mimeType: 'text/plain', buffer: Buffer.from('synthetic') })
    } else if (source === 'LIBRARY') {
      await page.getByRole('button', { name: 'Мои макеты', exact: true }).click()
      await page.getByTestId('layout-row-demo-layout-01').click()
      await page.getByRole('button', { name: 'Выбрать макет', exact: true }).click()
      await expect(page.getByLabel('Количество', { exact: true })).toHaveValue('1234')
    } else await page.getByLabel('Нужна помощь с макетом').check()
    await expect(artworkError(page)).toHaveCount(0)
    await expect(page.getByText(/Исходный макет недоступен:/)).toHaveCount(0)
    await expect(save(page)).toBeEnabled()
    await page.getByLabel('Количество', { exact: true }).fill('0')
    await expect(save(page)).toBeDisabled()
    await expect(page.locator('.fos-item-form__quantity .fos-field__error')).toContainText(/целое/)
    await page.getByLabel('Количество', { exact: true }).fill('1234')
    await save(page).focus()
    await page.keyboard.press('Enter')
    const first = composer.locator('li[data-item-id]').first()
    await expect(first).toHaveAttribute('data-item-id', itemId!)
    await expect(composer).toHaveAttribute('data-order-id', id!)
    await expect(first).toContainText('1234 шт.')
    await expect(composer.locator('li[data-item-id]').nth(1)).toContainText('200 шт.')
    await page.getByRole('button', { name: 'Изменить позицию 1', exact: true }).click()
    await expect(save(page)).toBeDisabled()
    await expect(page.locator('.fos-field__error')).toHaveCount(0)
    await page.getByLabel('Количество', { exact: true }).fill('9999')
    await chooseMore(page, 'Отменить изменения')
    await expect(first).toContainText('1234 шт.')
    await expect(page.getByRole('button', { name: 'Изменить позицию 1', exact: true })).toBeFocused()
    await backToOrders(page)
    await page.locator('[data-order-open="DEMO-007"]').click()
    await expect(page.getByTestId('order-detail')).toContainText('500 шт.')
  })
}

for (const role of ['client', 'manager'] as const) {
  test(`${role}: all blocking conditions have field reasons and clear after correction`, async ({ page }) => {
    await page.goto('/?view=' + role + '-orders')
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
    const form = page.getByTestId('order-item-form')
    await expect(form.locator('.fos-field__error')).toHaveCount(0)
    await page.getByLabel('Наименование продукции').fill('   ')
    for (const field of ['name', 'quantity', 'shape', 'width', 'height', 'material', 'printing']) {
      await expect(form.locator('.fos-item-form__' + field + ' .fos-field__error')).toBeVisible()
    }
    await expect(artworkError(page)).toBeVisible()
    await expect(page.getByLabel('Наименование продукции')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByRole('combobox', { name: 'Форма', exact: true })).toHaveAccessibleDescription(/форм/)
    await expect(page.getByRole('group', { name: 'Способ печати *', exact: true })).toHaveAccessibleDescription(/способ печати/i)
    await fillItem(page)
    await expect(form.locator('.fos-field__error')).toHaveCount(0)
    await commitItem(page)
    await page.getByRole('button', { name: 'Изменить позицию 1', exact: true }).click()
    await page.getByLabel('Наименование продукции').fill('   ')
    await expect(save(page)).toBeDisabled()
    await expect(page.locator('.fos-item-form__name .fos-field__error')).toBeVisible()
    await page.getByLabel('Наименование продукции').fill('Этикетка DEMO')
    await expect(save(page)).toBeDisabled() // returned to the unchanged item
    await expect(form.locator('.fos-field__error')).toHaveCount(0)
    await page.getByLabel('Ширина, мм', { exact: true }).fill('0')
    await expect(page.locator('.fos-item-form__width .fos-field__error')).toBeVisible()
    await expect(save(page)).toBeDisabled()
    await chooseMore(page, 'Отменить изменения')
    await expect(page.getByTestId('order-item-summary')).toContainText('100 × 150 мм')
  })
}

test('repeat: invalid save-on-leave preserves the editor and requires a valid source', async ({ page }) => {
  await repeat(page)
  await page.getByLabel('Количество', { exact: true }).fill('1234')
  await backToOrders(page)
  const guard = page.getByRole('alertdialog')
  await guard.getByRole('button', { name: 'Да', exact: true }).click()
  await expect(guard).toBeVisible()
  await guard.getByRole('button', { name: 'Закрыть', exact: true }).click()
  await expect(page.getByLabel('Количество', { exact: true })).toHaveValue('1234')
  await expect(artworkError(page)).toBeVisible()
  await page.getByLabel('Нужна помощь с макетом').check()
  await backToOrders(page)
  await guard.getByRole('button', { name: 'Да', exact: true }).click()
  await expect(page.getByTestId('order-item-form')).toHaveCount(0)
  await page.locator('[data-order-open="DEMO-NEW-100"]').click()
  await expect(page.getByTestId('order-item-summary').first()).toContainText('1234 шт.')
})

test('existing validation boundaries remain strict, including historical metadata', () => {
  const valid: DemoItem = { ...emptyDemoItem(), name: 'DEMO', quantity: '1', shape: 'Круглая', width: '0.1', height: '2', material: 'Бумага', printMethod: 'digit', artworkMode: 'HELP' }
  expect(validDemoItem(valid)).toBe(true)
  const invalid: Partial<DemoItem>[] = [
    { name: '  ' }, { quantity: '' }, { quantity: ' ' }, { quantity: '0' }, { quantity: '-1' }, { quantity: '1.5' },
    { quantity: 'Infinity' }, { quantity: '9007199254740992' }, { width: '0' }, { height: '-1' }, { width: 'Infinity' },
    { shape: '' }, { material: '' }, { printMethod: '' },
    { artworkMode: 'UPLOAD', fileName: '', unavailableArtwork: 'old.pdf' },
    { artworkMode: 'LIBRARY', layoutId: 'id', layoutName: '' }, { artworkMode: 'LIBRARY', layoutId: '', layoutName: 'name' },
  ]
  for (const patch of invalid) expect(validDemoItem({ ...valid, ...patch }), JSON.stringify(patch)).toBe(false)
  for (const patch of [{ quantity: '1e3' }, { width: '0.01' }, { artworkMode: 'UPLOAD', fileName: 'local.pdf' }, { artworkMode: 'LIBRARY', layoutId: 'id', layoutName: 'DEMO' }] satisfies Partial<DemoItem>[]) {
    expect(validDemoItem({ ...valid, ...patch })).toBe(true)
  }
})

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`repeat: field errors fit ${width}px and have accessible associations`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 })
    await repeat(page)
    await page.getByLabel('Количество', { exact: true }).fill('0')
    await expect(artworkError(page)).toBeVisible()
    await expect(page.getByLabel('Количество', { exact: true })).toHaveAccessibleDescription(/целое/)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: info.outputPath('repeat-field-errors.png'), fullPage: true })
    expect((await new AxeBuilder({ page }).include('[data-testid="order-item-form"]').analyze()).violations).toEqual([])
  })
}
