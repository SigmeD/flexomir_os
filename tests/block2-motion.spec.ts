import { expect, test } from '@playwright/test'
import { chooseMore } from './helpers/orders'

test.use({ video: 'on' })

test('creating a draft keeps the form geometry outside the detail motion pilot', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await expect(page.getByTestId('order-composer')).toBeVisible()
  await expect(page.locator('html')).not.toHaveAttribute('data-order-navigation-motion', /forward|back/)
  await expect(page.locator('html')).not.toHaveAttribute('data-order-navigation-fallback', /forward|back/)
})

test('client order drill and return animate content in opposite directions', async ({ page }, testInfo) => {
  await page.goto('/?view=client-orders')
  if (testInfo.project.name.includes('webkit')) await page.evaluate(() => {
    ;(window as typeof window & { motionEvents: string[] }).motionEvents = []
    document.addEventListener('animationstart', event => (window as typeof window & { motionEvents: string[] }).motionEvents.push(event.animationName))
  })
  await page.getByRole('button', { name: 'Открыть заказ DEMO-003' }).click()
  await expect(page.getByTestId('order-detail')).toBeVisible()
  if (testInfo.project.name.includes('webkit')) {
    await expect.poll(() => page.evaluate(() => (window as typeof window & { motionEvents: string[] }).motionEvents)).toContain('fos-order-in-right')
  } else {
    await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation =>
      (animation.effect as KeyframeEffect | null)?.pseudoElement?.includes('view-transition')
    ).map(animation => ({ pseudo: (animation.effect as KeyframeEffect).pseudoElement, frames: (animation.effect as KeyframeEffect).getKeyframes().map(frame => frame.transform) }))))
      .toContainEqual(expect.objectContaining({ pseudo: '::view-transition-new(fos-order-content)', frames: expect.arrayContaining(['translateX(20px)', 'translateX(0px)']) }))
  }
  await page.goBack()
  await expect(page.getByTestId('client-orders-list')).toBeVisible()
  if (testInfo.project.name.includes('webkit')) {
    await expect.poll(() => page.evaluate(() => (window as typeof window & { motionEvents: string[] }).motionEvents)).toContain('fos-order-in-left')
  } else {
    await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation =>
      (animation.effect as KeyframeEffect | null)?.pseudoElement?.includes('view-transition')
    ).map(animation => ({ pseudo: (animation.effect as KeyframeEffect).pseudoElement, frames: (animation.effect as KeyframeEffect).getKeyframes().map(frame => frame.transform) }))))
      .toContainEqual(expect.objectContaining({ pseudo: '::view-transition-new(fos-order-content)', frames: expect.arrayContaining(['translateX(-20px)', 'translateX(0px)']) }))
  }
})

test('reduced motion and browser Back keep navigation usable without spatial movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?view=client-orders')
  await page.getByRole('button', { name: 'Открыть заказ DEMO-003' }).click()
  await expect(page.getByTestId('order-detail')).toBeVisible()
  await page.goBack()
  await expect(page.getByTestId('client-orders-list')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Открыть заказ DEMO-003' })).toBeFocused()
  await expect(page.locator('html')).not.toHaveAttribute('data-order-navigation-motion', /forward|back/)
})

test('dirty exit waits for confirmation and rapid Back/Forward reaches the requested order', async ({ page }) => {
  await page.goto('/?view=client-orders')
  const exit = async () => {
    if ((page.viewportSize()?.width ?? 1440) < 1024) await chooseMore(page, 'Выйти')
    else await page.getByRole('navigation', { name: 'Хлебные крошки' }).getByRole('button', { name: 'Мои заказы' }).click()
  }
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByLabel('Желаемый срок', { exact: true }).fill('20.12.2026')
  await exit()
  const guard = page.getByRole('alertdialog', { name: 'Сохранить изменения?' })
  await expect(guard).toBeVisible()
  await expect(page.locator('html')).not.toHaveAttribute('data-order-navigation-motion', /forward|back/)
  await guard.getByRole('button', { name: 'Закрыть' }).click()
  await expect(page.getByTestId('order-composer')).toBeVisible()
  await exit()
  await guard.getByRole('button', { name: 'Нет', exact: true }).click()
  await expect(page.getByTestId('client-orders-list')).toBeVisible()
  await page.getByRole('button', { name: 'Открыть заказ DEMO-003' }).click()
  await page.goBack()
  await page.goForward()
  await expect(page.getByTestId('order-detail')).toHaveAttribute('data-order-id', 'DEMO-003')
  await expect(page.getByRole('heading', { level: 1, name: 'Заказ DEMO-003' })).toBeVisible()
})
