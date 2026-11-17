import { expect, test } from '@playwright/test'
import { PNG } from 'pngjs'
import { chooseMore } from './helpers/orders'
import { waitForNavigationMotion } from './helpers/navigation-motion'

async function openSection(page: import('@playwright/test').Page, id: 'orders' | 'artworks' | 'clients' | 'support', role: 'client' | 'manager' = 'client') {
  if ((page.viewportSize()?.width ?? 1440) < 1024) {
    await page.locator('.fos-app-shell:visible').last().getByTestId('navigation-drawer-trigger').click()
    await page.getByRole('dialog').getByTestId('sidebar-nav-' + id).click()
    await expect(page.getByRole('dialog', { name: role === 'client' ? 'Меню клиента' : 'Меню менеджера', exact: true })).toHaveCount(0)
  } else await page.getByRole('navigation', { name: role === 'client' ? 'Навигация клиента' : 'Навигация менеджера', exact: true }).getByTestId('sidebar-nav-' + id).click()
}

async function watchSectionMotion(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const probe = window as typeof window & { sectionMotionEvents: string[] }
    probe.sectionMotionEvents = []
    document.addEventListener('animationstart', event => {
      if (event.animationName === 'fos-section-in') probe.sectionMotionEvents.push(event.target instanceof Element && event.target.closest('.fos-page-header') ? 'header' : 'content')
    }, true)
  })
}

async function watchHorizontalMotion(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const probe = window as typeof window & { horizontalMotionEvents: string[]; horizontalAnimationEvents: string[] }
    probe.horizontalMotionEvents = []
    probe.horizontalAnimationEvents = []
    const record = () => {
      const value = document.documentElement.dataset.orderNavigationMotion ?? document.documentElement.dataset.orderNavigationFallback ?? document.documentElement.dataset.orderFilterMotion
      if (value) probe.horizontalMotionEvents.push(value)
    }
    new MutationObserver(record).observe(document.documentElement, { attributes: true, attributeFilter: ['data-order-navigation-motion', 'data-order-navigation-fallback', 'data-order-filter-motion'] })
    document.addEventListener('animationstart', event => {
      if (event.animationName.startsWith('fos-order-in-')) probe.horizontalAnimationEvents.push(event.animationName)
    }, true)
  })
}

async function expectHorizontalMotion(page: import('@playwright/test').Page, direction: 'forward' | 'back') {
  await expect.poll(() => page.evaluate(() => (window as typeof window & { horizontalMotionEvents: string[] }).horizontalMotionEvents)).toContain(direction)
}

test.use({ video: 'on' })

test('creating a draft and opening a new item use the forward transition, then return backward', async ({ page }, testInfo) => {
  await page.goto('/?view=client-orders')
  const direction = async (value: 'forward' | 'back') => {
    await expect(page.locator('html')).toHaveAttribute(testInfo.project.name.includes('webkit') ? 'data-order-navigation-fallback' : 'data-order-navigation-motion', value)
    await expect(page.locator('html')).not.toHaveAttribute(testInfo.project.name.includes('webkit') ? 'data-order-navigation-fallback' : 'data-order-navigation-motion', /forward|back/)
  }
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await expect(page.getByTestId('order-composer')).toBeVisible()
  await direction('forward')
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  await expect(page.getByTestId('order-item-form')).toBeVisible()
  await direction('forward')
  await chooseMore(page, 'Отменить ввод')
  await expect(page.getByTestId('order-composer')).toBeVisible()
  await direction('back')
  await chooseMore(page, 'Выйти')
  await expect(page.getByTestId('client-orders-list')).toBeVisible()
  await direction('back')
})

test('client filters move the list in tab order while the filter row stays fixed', async ({ page }) => {
  await page.goto('/?view=client-orders')
  const filters = page.getByRole('group', { name: 'Фильтр заказов по статусу' })
  const motionAttribute = 'data-order-filter-motion'
  await filters.getByRole('button', { name: 'Черновики' }).click()
  const outgoing = page.locator('.fos-order-filter-results__old')
  await expect(outgoing).toHaveAttribute('aria-hidden', 'true')
  await expect(outgoing).toHaveCSS('animation-name', 'fos-order-out-left')
  await expect(page.getByTestId('client-orders-list')).toHaveCSS('animation-name', 'fos-order-in-right')
  await expect(page.getByTestId('client-orders-list')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Открыть заказ DEMO-003' })).toHaveCount(0)
  await expect(page.locator('html')).toHaveAttribute(motionAttribute, 'forward')
  await expect(page.locator('.fos-orders-page__filters')).toHaveCSS('view-transition-name', 'none')
  await expect(page.locator('html')).not.toHaveAttribute(motionAttribute, /forward|back/)
  await filters.getByRole('button', { name: 'Все заказы' }).click()
  await expect(outgoing).toHaveCSS('animation-name', 'fos-order-out-right')
  await expect(page.getByTestId('client-orders-list')).toHaveCSS('animation-name', 'fos-order-in-left')
  await expect(page.getByRole('button', { name: 'Открыть заказ DEMO-003' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute(motionAttribute, 'back')
})

for (const role of ['client', 'manager'] as const) {
  for (const width of [1440, 390]) {
    test(`${role} filter leaves every unrelated header button unchanged at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.goto('/?view=' + role + '-orders')
      const headerButtons = page.locator('.fos-orders-page__main[data-view="list"] .fos-page-header__actions button')
      await expect(headerButtons.first()).toBeVisible()
      const before = await Promise.all((await headerButtons.all()).map(button => button.screenshot()))
      const assertUnchanged = async () => {
        await expect(page.locator('html')).toHaveAttribute('data-order-filter-motion', /forward|back/)
        await page.waitForTimeout(90)
        const after = await Promise.all((await headerButtons.all()).map(button => button.screenshot()))
        expect(after).toHaveLength(before.length)
        if (width === 1440) after.forEach((shot, index) => {
          const oldPixels = PNG.sync.read(before[index]).data
          const newPixels = PNG.sync.read(shot).data
          expect(newPixels.length).toBe(oldPixels.length)
          let peakDifference = 0
          for (let pixel = 0; pixel < newPixels.length; pixel++) peakDifference = Math.max(peakDifference, Math.abs(newPixels[pixel] - oldPixels[pixel]))
          expect(peakDifference).toBeLessThanOrEqual(3)
        })
        for (const button of await headerButtons.all()) {
          expect(await button.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0)
        }
        await expect(headerButtons.first()).toHaveAttribute('data-pressed', 'false')
        await expect(headerButtons.first()).toHaveAttribute('data-surface-deforming', 'false')
        await expect(page.getByTestId('order-composer')).toHaveCount(0)
      }
      const filters = page.getByRole('group', { name: 'Фильтр заказов по статусу' })
      await filters.getByRole('button', { name: 'Черновики' }).click()
      await assertUnchanged()
      if (role === 'manager') {
        await expect(page.locator('html')).not.toHaveAttribute('data-order-filter-motion', /forward|back/)
        await page.getByRole('group', { name: 'Очередь заказов менеджера' }).getByRole('button', { name: 'Новые' }).click()
        await assertUnchanged()
      }
    })
  }
}

test('rapid order filter changes leave one accessible list and clean the outgoing layer', async ({ page }) => {
  await page.goto('/?view=client-orders')
  const filters = page.getByRole('group', { name: 'Фильтр заказов по статусу' })
  await filters.getByRole('button', { name: 'Черновики' }).click()
  await filters.getByRole('button', { name: 'На рассмотрении' }).click()
  await filters.getByRole('button', { name: 'Все заказы' }).click()
  await expect(page.getByTestId('client-orders-list')).toHaveCount(1)
  await expect(page.getByTestId('client-orders-list')).toContainText('Заказ DEMO-003')
  await expect(page.locator('.fos-order-filter-results__old')).toHaveCount(0)
})

test('reduced motion changes order filters without an outgoing layer', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?view=client-orders')
  await page.getByRole('group', { name: 'Фильтр заказов по статусу' }).getByRole('button', { name: 'Черновики' }).click()
  await expect(page.locator('.fos-order-filter-results__old')).toHaveCount(0)
  await expect(page.locator('html')).not.toHaveAttribute('data-order-filter-motion', /forward|back/)
  await expect(page.getByTestId('client-orders-list')).toContainText('Заказ DEMO-001')
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
    ).map(animation => ({ pseudo: (animation.effect as KeyframeEffect).pseudoElement, duration: animation.effect?.getTiming().duration, frames: (animation.effect as KeyframeEffect).getKeyframes().map(frame => frame.transform) }))))
      .toContainEqual(expect.objectContaining({ pseudo: '::view-transition-new(fos-order-content)', duration: 300, frames: expect.arrayContaining(['translateX(44px)', 'translateX(0px)']) }))
  }
  await page.goBack()
  await expect(page.getByTestId('client-orders-list')).toBeVisible()
  if (testInfo.project.name.includes('webkit')) {
    await expect.poll(() => page.evaluate(() => (window as typeof window & { motionEvents: string[] }).motionEvents)).toContain('fos-order-in-left')
  } else {
    await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation =>
      (animation.effect as KeyframeEffect | null)?.pseudoElement?.includes('view-transition')
    ).map(animation => ({ pseudo: (animation.effect as KeyframeEffect).pseudoElement, duration: animation.effect?.getTiming().duration, frames: (animation.effect as KeyframeEffect).getKeyframes().map(frame => frame.transform) }))))
      .toContainEqual(expect.objectContaining({ pseudo: '::view-transition-new(fos-order-content)', duration: 300, frames: expect.arrayContaining(['translateX(-44px)', 'translateX(0px)']) }))
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

test('sidebar section changes raise new content while the heading and shell stay still', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await watchSectionMotion(page)
  await openSection(page, 'artworks')
  await expect(page.getByTestId('client-artworks-screen')).toBeVisible()
  await expect.poll(() => page.evaluate(() => (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents)).toContain('content')
  expect(await page.evaluate(() => (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents)).not.toContain('header')
  await expect(page.locator('html')).not.toHaveAttribute('data-cabinet-section-motion', 'enter')
  await page.evaluate(() => { (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents = [] })
  await openSection(page, 'orders')
  await expect(page.getByTestId('client-orders-list')).toBeVisible()
  await expect.poll(() => page.evaluate(() => (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents)).toContain('content')
})

test('section motion starts after dirty exit is confirmed and respects reduced motion', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await watchSectionMotion(page)
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByLabel('Желаемый срок', { exact: true }).fill('20.12.2026')
  await openSection(page, 'artworks')
  await expect(page.getByRole('alertdialog', { name: 'Сохранить изменения?' })).toBeVisible()
  await expect(page.locator('html')).not.toHaveAttribute('data-cabinet-section-motion', 'enter')
  expect(await page.evaluate(() => (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents)).toEqual([])
  await page.getByRole('alertdialog').getByRole('button', { name: 'Нет', exact: true }).click()
  await expect(page.getByTestId('client-artworks-screen')).toBeVisible()
  await expect.poll(() => page.evaluate(() => (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents)).toContain('content')
  await expect(page.locator('html')).not.toHaveAttribute('data-cabinet-section-motion', 'enter')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.evaluate(() => { (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents = [] })
  await openSection(page, 'orders')
  await expect(page.getByTestId('client-orders-list')).toBeVisible()
  await expect(page.locator('html')).not.toHaveAttribute('data-cabinet-section-motion', 'enter')
  expect(await page.evaluate(() => (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents)).toEqual([])
})

test('shared section motion reaches Support and Manager without moving their headings', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await watchSectionMotion(page)
  await openSection(page, 'support')
  await expect(page.getByTestId('client-support-screen')).toBeVisible()
  await expect.poll(() => page.evaluate(() => (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents)).toContain('content')
  expect(await page.evaluate(() => (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents)).not.toContain('header')

  await page.goto('/?view=manager-orders')
  await watchSectionMotion(page)
  await openSection(page, 'clients', 'manager')
  await expect(page.getByTestId('manager-clients-screen')).toBeVisible()
  await expect.poll(() => page.evaluate(() => (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents)).toContain('content')
  expect(await page.evaluate(() => (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents)).not.toContain('header')
  await page.evaluate(() => { (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents = [] })
  await openSection(page, 'support', 'manager')
  await expect(page.getByTestId('manager-support-screen')).toBeVisible()
  await expect.poll(() => page.evaluate(() => (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents)).toContain('content')
})

test('Manager Orders detail uses the shared horizontal drill and browser return', async ({ page }) => {
  await page.goto('/?view=manager-orders')
  await watchHorizontalMotion(page)
  await page.getByRole('button', { name: 'Открыть заказ DEMO-003' }).click()
  await expect(page.getByTestId('order-detail')).toBeVisible()
  await expectHorizontalMotion(page, 'forward')
  await page.goBack()
  await expect(page.getByTestId('manager-orders-list')).toBeVisible()
  await expectHorizontalMotion(page, 'back')
})

test('Layouts, Support and Companies detail routes share forward and back motion', async ({ page }, testInfo) => {
  for (const [route, row, detail] of [
    ['client-layouts', 'layout-row-demo-layout-01', 'layout-browser'],
    ['client-support', 'ticket-row-client-01', 'client-support-screen'],
    ['manager-companies', 'company-row-company-01', 'manager-clients-screen'],
  ] as const) {
    await page.goto('/?view=' + route)
    await watchHorizontalMotion(page)
    await page.getByTestId(row).click()
    await expect(page.getByTestId(detail)).toBeVisible()
    await expectHorizontalMotion(page, 'forward')
    if (route === 'client-layouts') {
      if (testInfo.project.name.includes('webkit')) {
        await expect.poll(() => page.evaluate(() => (window as typeof window & { horizontalAnimationEvents: string[] }).horizontalAnimationEvents)).toContain('fos-order-in-right')
      } else {
        await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation =>
          (animation.effect as KeyframeEffect | null)?.pseudoElement === '::view-transition-new(fos-order-content)'
        ).map(animation => animation.effect?.getTiming().duration))).toContain(300)
      }
      await expect(page.getByTestId('client-artworks-screen').locator('.fos-page-header')).toHaveCSS('animation-name', 'none')
    }
    await page.goBack()
    await expectHorizontalMotion(page, 'back')
  }
})

test('library heading stays anchored through detail, back and upload at four widths', async ({ page }) => {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/?view=client-layouts')
    const heading = page.getByTestId('client-artworks-screen').getByRole('heading', { level: 1 })
    const origin = await heading.boundingBox()
    expect(origin).not.toBeNull()
    const assertAnchor = async () => {
      await waitForNavigationMotion(page)
      const current = await heading.boundingBox()
      expect(current).not.toBeNull()
      expect(current!.x).toBe(origin!.x)
      expect(current!.y).toBe(origin!.y)
    }
    await page.getByTestId('layout-row-demo-layout-01').click()
    await expect(page.getByTestId('layout-detail')).toBeVisible()
    await assertAnchor()
    await page.goBack()
    await expect(heading).toHaveText('Мои макеты')
    await assertAnchor()
    await page.getByRole('button', { name: 'Добавить макет', exact: true }).click()
    await expect(heading).toHaveText('Загрузить макет')
    await assertAnchor()
  }
})

test('Manager creation, item entry and status filters use the same direction contract', async ({ page }) => {
  await page.goto('/?view=manager-orders')
  await watchHorizontalMotion(page)
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await expect(page.getByTestId('order-composer')).toBeVisible()
  await expectHorizontalMotion(page, 'forward')
  await page.evaluate(() => { (window as typeof window & { horizontalMotionEvents: string[] }).horizontalMotionEvents = [] })
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  await expect(page.getByTestId('order-item-form')).toBeVisible()
  await expectHorizontalMotion(page, 'forward')
  await page.goto('/?view=manager-orders')
  await watchHorizontalMotion(page)
  const filters = page.getByRole('group', { name: 'Фильтр заказов по статусу' })
  await filters.getByRole('button', { name: 'Черновики' }).click()
  await expectHorizontalMotion(page, 'forward')
  await page.evaluate(() => { (window as typeof window & { horizontalMotionEvents: string[] }).horizontalMotionEvents = [] })
  await filters.getByRole('button', { name: 'Все заказы' }).click()
  await expectHorizontalMotion(page, 'back')
})

test('leaving an open order for another section commits one vertical transition', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await page.getByRole('button', { name: 'Открыть заказ DEMO-003' }).click()
  await expect(page.locator('html')).not.toHaveAttribute('data-order-navigation-motion', /forward|back/)
  await expect(page.locator('html')).not.toHaveAttribute('data-order-navigation-fallback', /forward|back/)
  await watchHorizontalMotion(page)
  await watchSectionMotion(page)
  await openSection(page, 'artworks')
  await expect(page.getByTestId('client-artworks-screen')).toBeVisible()
  await expect.poll(() => page.evaluate(() => (window as typeof window & { sectionMotionEvents: string[] }).sectionMotionEvents)).toContain('content')
  expect(await page.evaluate(() => (window as typeof window & { horizontalMotionEvents: string[] }).horizontalMotionEvents)).toEqual([])
})

test('nested history stays usable with reduced motion and rapid Back/Forward', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?view=client-layouts')
  const row = page.getByTestId('layout-row-demo-layout-01')
  await row.click()
  await expect(page.getByTestId('layout-detail')).toBeVisible()
  await expect(page.locator('html')).not.toHaveAttribute('data-order-navigation-motion', /forward|back/)
  await page.goBack()
  await page.goForward()
  await expect(page.getByTestId('layout-detail')).toBeVisible()
  await page.goBack()
  await expect(row).toBeFocused()
})
