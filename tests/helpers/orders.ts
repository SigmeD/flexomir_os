import { expect, type Page } from '@playwright/test'

export async function openDemoControls(page: Page) {
  const trigger = page.getByRole('button', { name: 'Демо — показать панель демонстрации' })
  if (await trigger.isVisible()) await trigger.click()
}

export async function closeDemoControls(page: Page) {
  const hide = page.getByRole('button', { name: 'Скрыть панель демонстрации' })
  if (await hide.isVisible()) await hide.click()
}

export async function setDemoRole(page: Page, role: 'client' | 'manager') {
  await openDemoControls(page)
  await page.getByRole('button', { name: role === 'client' ? 'Демо: клиент' : 'Демо: менеджер', exact: true }).click()
}

export async function backToOrders(page: Page) {
  if ((page.viewportSize()?.width || 1440) >= 1024) {
    await page.getByRole('navigation', { name: /Навигация (клиента|менеджера)/ }).getByTestId('sidebar-nav-orders').click()
  } else {
    await page.getByTestId('navigation-drawer-trigger').click()
    await page.getByRole('dialog').getByTestId('sidebar-nav-orders').click()
    await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
  }
}

export async function fillItem(page: Page, name = 'Этикетка DEMO') {
  await page.getByLabel('Наименование продукции', { exact: true }).fill(name)
  await page.getByLabel('Количество', { exact: true }).fill('500')
  await page.getByLabel('Флексопечать', { exact: true }).check()
  await page.getByLabel('Форма', { exact: true }).selectOption('Прямоугольная')
  await page.getByLabel('Ширина, мм', { exact: true }).fill('100')
  await page.getByLabel('Высота, мм', { exact: true }).fill('150')
  await page.getByLabel('Материал', { exact: true }).selectOption('Бумага')
  await page.getByLabel('Нужна помощь с макетом', { exact: true }).check()
}

export async function commitItem(page: Page) {
  await page.getByTestId('order-item-form').locator('.fos-page-header [data-action=add], .fos-page-header [data-action=save]').click()
  await expect(page.getByTestId('order-item-form')).toHaveCount(0)
}

export async function chooseMore(page: Page, label: string) {
  await page.getByRole('button', { name: 'Ещё', exact: true }).click()
  await page.getByRole('menuitem', { name: label, exact: true }).click()
}

export async function detailData(page: Page) {
  return {
    id: await page.getByTestId('order-detail').getAttribute('data-order-id'),
    status: await page.getByTestId('order-detail-status').innerText(),
    items: await page.getByTestId('order-item-summary').allTextContents(),
    date: await page.getByLabel('Желаемый срок', { exact: true }).inputValue(),
    comment: await page.getByLabel('Комментарии', { exact: true }).inputValue(),
  }
}
