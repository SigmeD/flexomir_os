import { expect, test } from '@playwright/test'
import { chooseMore } from './helpers/orders'

test('confirmation uses the brand blue and keeps a quick click visible before saving', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByLabel('Желаемый срок', { exact: true }).fill('17.12.2026')
  await chooseMore(page, 'Выйти')

  const dialog = page.getByRole('alertdialog', { name: 'Сохранить изменения?' })
  const confirm = dialog.getByRole('button', { name: 'Да', exact: true })
  await expect(dialog).toBeVisible()
  await expect.poll(() => confirm.locator('.fos-action__solid').evaluate(node => getComputedStyle(node).backgroundColor)).toBe('rgb(2, 53, 127)')

  const bounds = await confirm.boundingBox()
  expect(bounds).not.toBeNull()
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
  await page.mouse.down()
  await expect(confirm).toHaveAttribute('data-pressed', 'true')
  await expect.poll(() => confirm.locator('.fos-action__solid').evaluate(node => getComputedStyle(node).backgroundColor)).toBe('rgb(1, 38, 92)')
  await page.mouse.up()
  await expect(confirm).toHaveAttribute('data-feedback', 'true')
  await expect(dialog.getByRole('button', { name: 'Нет', exact: true })).toBeEnabled()
  await expect(dialog.getByRole('button', { name: 'Закрыть' })).toBeEnabled()
  await expect(dialog).toBeVisible()

  await expect(dialog).toHaveCount(0)
  await expect(page.getByTestId('client-orders-list')).toBeVisible()
})

test('No and close keep their normal appearance and can cancel a pending confirmation', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  const orderId = await page.getByTestId('order-composer').getAttribute('data-order-id')
  await page.getByLabel('Желаемый срок', { exact: true }).fill('17.12.2026')
  await chooseMore(page, 'Выйти')

  const dialog = page.getByRole('alertdialog', { name: 'Сохранить изменения?' })
  await expect(dialog).toBeVisible()
  const stillActive = await dialog.evaluate(async root => {
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('button'))
    const yes = buttons.find(button => button.textContent?.trim() === 'Да')!
    const no = buttons.find(button => button.textContent?.trim() === 'Нет')!
    const close = buttons.find(button => button.getAttribute('aria-label') === 'Закрыть')!
    yes.click()
    await new Promise(requestAnimationFrame)
    const result = { noDisabled: no.disabled, closeDisabled: close.disabled, noOpacity: getComputedStyle(no).opacity, closeOpacity: getComputedStyle(close).opacity }
    no.click()
    return result
  })
  expect(stillActive).toEqual({ noDisabled: false, closeDisabled: false, noOpacity: '1', closeOpacity: '1' })
  await expect(dialog).toHaveCount(0)
  await page.getByRole('button', { name: 'Открыть заказ ' + orderId }).click()
  await expect(page.getByLabel('Желаемый срок', { exact: true })).toHaveValue('')
})
