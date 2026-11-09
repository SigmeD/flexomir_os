import { expect, test } from '@playwright/test'
import { commitItem, fillItem } from './helpers/orders'

async function selectSection(page: import('@playwright/test').Page, id: string) {
  if ((page.viewportSize()?.width ?? 1440) < 1024) {
    await page.locator('[data-testid="navigation-drawer-trigger"]:visible').click()
    await page.getByRole('dialog').getByTestId('sidebar-nav-' + id).click()
  } else {
    await page.getByRole('navigation', { name: 'Навигация клиента', exact: true }).getByTestId('sidebar-nav-' + id).click()
  }
}

test('leaving a dirty New Item asks first; No discards only that item and continues', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?view=client-orders&demoTools=1')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  const orderId = await page.getByTestId('order-composer').getAttribute('data-order-id')
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  await page.getByLabel('Наименование продукции', { exact: true }).fill('Несохранённая позиция')

  await selectSection(page, 'support')
  const dialog = page.getByRole('alertdialog', { name: 'Сохранить изменения?' })
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(page.getByTestId('order-item-form')).toBeVisible()

  await selectSection(page, 'support')
  await expect(page.getByRole('alertdialog', { name: 'Сохранить изменения?' })).toBeVisible()
  await page.getByRole('button', { name: 'Нет', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Мои обращения', exact: true })).toBeVisible()

  await selectSection(page, 'orders')
  await page.getByRole('button', { name: 'Открыть заказ ' + orderId }).click()
  await expect(page.getByTestId('order-item-summary')).toHaveCount(0)
  await expect(page.getByTestId('order-composer')).toHaveAttribute('data-order-id', orderId!)
})

test('Yes saves one valid item into the draft before navigating away', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?view=client-orders&demoTools=1')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  const orderId = await page.getByTestId('order-composer').getAttribute('data-order-id')
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  await fillItem(page)
  const name = await page.getByLabel('Наименование продукции', { exact: true }).inputValue()

  await selectSection(page, 'support')
  await page.getByRole('alertdialog', { name: 'Сохранить изменения?' }).getByRole('button', { name: 'Да', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Мои обращения', exact: true })).toBeVisible()
  await selectSection(page, 'orders')
  await page.getByRole('button', { name: 'Открыть заказ ' + orderId }).click()
  await expect(page.getByTestId('order-item-summary')).toContainText(name)
  await expect(page.getByTestId('order-item-summary')).toHaveCount(1)
})

test('invalid dirty item keeps the save decision open and does not navigate', async ({ page }) => {
  await page.goto('/?view=client-orders&demoTools=1')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  await page.getByLabel('Наименование продукции', { exact: true }).fill('Неполная позиция')
  await selectSection(page, 'support')
  const dialog = page.getByRole('alertdialog', { name: 'Сохранить изменения?' })
  await dialog.getByRole('button', { name: 'Да', exact: true }).click()
  await expect(dialog).toBeVisible()
  await expect(page.getByTestId('order-item-form')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Мои обращения', exact: true })).toHaveCount(0)
})

test('mobile Drawer navigation guards a dirty item and returns to the updated draft list', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?view=client-orders&demoTools=1')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  const orderId = await page.getByTestId('order-composer').getAttribute('data-order-id')
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  await fillItem(page)
  const itemName = await page.getByLabel('Наименование продукции', { exact: true }).inputValue()

  await selectSection(page, 'support')
  const dialog = page.getByRole('alertdialog', { name: 'Сохранить изменения?' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Да', exact: true }).click()
  await expect(page.getByTestId('client-support-screen')).toBeVisible()
  await selectSection(page, 'orders')
  await expect(page.getByTestId('client-orders-list')).toBeVisible()
  await page.getByRole('button', { name: 'Открыть заказ ' + orderId }).click()
  await expect(page.getByRole('heading', { name: 'Заказ ' + orderId, exact: true })).toBeVisible()
  await expect(page.getByTestId('order-item-summary')).toContainText(itemName)
})

test('More deletes only the confirmed in-session draft and leaves other drafts intact', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?view=client-orders&demoTools=1')
  const createDraft = async () => {
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    const id = await page.getByTestId('order-composer').getAttribute('data-order-id')
    await page.getByRole('button', { name: 'Мои заказы', exact: true }).click()
    return id!
  }
  const firstId = await createDraft()
  const secondId = await createDraft()
  await page.getByRole('button', { name: 'Открыть заказ ' + firstId }).click()

  await page.getByRole('button', { name: 'Ещё' }).click()
  const deleteDraft = page.getByRole('menuitem', { name: 'Удалить черновик', exact: true })
  await expect(deleteDraft).toBeEnabled()
  await deleteDraft.click()
  const confirm = page.getByRole('alertdialog', { name: 'Удалить черновик?' })
  await expect(confirm).toBeVisible()
  await confirm.getByRole('button', { name: 'Отмена', exact: true }).click()
  await expect(page.getByTestId('order-composer')).toBeVisible()

  await page.getByRole('button', { name: 'Ещё' }).click()
  await page.getByRole('menuitem', { name: 'Удалить черновик', exact: true }).click()
  await page.getByRole('alertdialog', { name: 'Удалить черновик?' }).getByRole('button', { name: 'Да', exact: true }).click()
  await expect(page.getByTestId('client-orders-list')).toBeVisible()
  await expect(page.getByTestId('client-order-' + firstId)).toHaveCount(0)
  await expect(page.getByTestId('client-order-' + secondId)).toBeVisible()
})

test('new draft list identifier and Composer title follow their distinct current labels', async ({ page }) => {
  await page.goto('/?view=client-orders&demoTools=1')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  const id = await page.getByTestId('order-composer').getAttribute('data-order-id')
  await expect(page.getByRole('heading', { level: 1, name: 'Новый заказ', exact: true })).toBeVisible()
  await selectSection(page, 'orders')
  await expect(page.getByRole('button', { name: 'Открыть заказ ' + id })).toContainText('Заказ ' + id)
  await page.getByRole('button', { name: 'Открыть заказ ' + id }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Заказ ' + id, exact: true })).toBeVisible()
})

test('base DEMO-001 fixture remains read-only until its editability contract is approved', async ({ page }) => {
  await page.goto('/?view=manager-orders')
  await page.getByRole('button', { name: 'Открыть заказ DEMO-001' }).click()
  await expect(page.getByTestId('order-detail')).toHaveAttribute('data-order-id', 'DEMO-001')
  await expect(page.getByRole('button', { name: 'Добавить позицию заказа' })).toBeDisabled()
  await expect(page.getByTestId('order-composer')).toHaveCount(0)
})

test('Manager mobile active Заказы selection returns from order detail to the list', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?view=manager-orders')
  await page.getByRole('button', { name: 'Открыть заказ DEMO-001' }).click()
  await expect(page.getByTestId('order-detail')).toBeVisible()

  await page.getByRole('button', { name: 'Открыть меню менеджера' }).click()
  await page.getByRole('dialog', { name: 'Меню менеджера', exact: true }).getByRole('button', { name: 'Заказы', exact: true }).click()
  await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
  await expect(page.getByTestId('manager-orders-list')).toBeVisible()
  await expect(page.getByTestId('order-detail')).toHaveCount(0)
})
