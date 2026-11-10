import { expect, test } from '@playwright/test'
import { setDemoRole } from './helpers/orders'

const widths = [320, 390, 768, 1024, 1440, 1920, 2560] as const
const routes = [
  ['/', '[data-testid="client-orders-screen"]'],
  ['/?view=client-orders', '[data-testid="client-orders-screen"]'],
  ['/?view=manager-orders', '[data-testid="manager-orders-screen"]'],
  ['/?view=manager-companies', '[data-testid="manager-clients-screen"]'],
  ['/?view=client-layouts', '[data-testid="client-artworks-screen"]'],
  ['/?view=client-support', '[data-testid="client-support-screen"]'],
  ['/?view=manager-support', '[data-testid="manager-support-screen"]'],
] as const

async function expectCenteredWorkspace(page: import('@playwright/test').Page, width: number, state: string) {
  const geometry = await page.evaluate(() => {
    const content = document.querySelector<HTMLElement>('.fos-app-shell__content')!
    const main = document.querySelector<HTMLElement>('.fos-app-shell__content > main')!
    const contentRect = content.getBoundingClientRect()
    const mainRect = main.getBoundingClientRect()
    return {
      contentLeft: contentRect.left,
      contentWidth: contentRect.width,
      mainLeft: mainRect.left,
      mainWidth: mainRect.width,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }
  })
  const centerOffset = Math.abs(
    (geometry.mainLeft - geometry.contentLeft) - (geometry.contentWidth - geometry.mainWidth) / 2,
  )
  if (width >= 1024) expect(centerOffset, `${state} at ${width}px`).toBeLessThanOrEqual(2)
  expect(geometry.scrollWidth, `${state} overflow at ${width}px`).toBeLessThanOrEqual(geometry.viewportWidth)
}

test('workspace containers center after the sidebar and stay usable across all cabinet routes and widths', async ({ page }, testInfo) => {
  const centerFailures: string[] = []
  for (const [route, screen] of routes) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 })
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await expect(page.locator(screen), `${route} at ${width}px`).toBeVisible()

      const shell = page.locator('.fos-app-shell')
      const content = page.locator('.fos-app-shell__content')
      const main = page.locator('.fos-app-shell__content > main')
      const geometry = await page.evaluate(() => {
        const content = document.querySelector<HTMLElement>('.fos-app-shell__content')!
        const main = document.querySelector<HTMLElement>('.fos-app-shell__content > main')!
        const contentRect = content.getBoundingClientRect()
        const mainRect = main.getBoundingClientRect()
        return {
          content: { left: contentRect.left, width: contentRect.width },
          main: { left: mainRect.left, width: mainRect.width },
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        }
      })
      const centerOffset = Math.abs(
        (geometry.main.left - geometry.content.left) - (geometry.content.width - geometry.main.width) / 2,
      )

      if (width >= 1024) {
        if (centerOffset > 2) centerFailures.push(`${route} at ${width}px: ${centerOffset}px`)
      }
      expect(geometry.scrollWidth, `${route} should not overflow horizontally at ${width}px`).toBeLessThanOrEqual(geometry.viewportWidth)

      if (route === '/' && width >= 1024) {
        const axes = await page.evaluate(() => {
          const selectors = ['.fos-page-header__row', '.fos-orders-page__filters', '.fos-orders-page__list']
          return selectors.map(selector => {
            const rect = document.querySelector<HTMLElement>(selector)!.getBoundingClientRect()
            return { selector, left: rect.left, right: rect.right }
          })
        })
        for (const axis of axes.slice(1)) {
          expect(Math.abs(axis.left - axes[0].left), `${axis.selector} left edge should share the header axis at ${width}px`).toBeLessThanOrEqual(1)
          expect(Math.abs(axis.right - axes[0].right), `${axis.selector} right edge should share the header axis at ${width}px`).toBeLessThanOrEqual(1)
        }
        const action = await page.locator('.fos-page-header__actions').boundingBox()
        expect(action).not.toBeNull()
        expect(Math.abs(action!.x + action!.width - axes[0].right), `header actions should stay inside the shared container at ${width}px`).toBeLessThanOrEqual(1)
      }

      if (route === '/' && widths.includes(width)) {
        await page.screenshot({
          path: testInfo.outputPath(`client-orders-after-${width}-${testInfo.project.name}.png`),
          fullPage: true,
          animations: 'disabled',
        })
      }

      // Keep these locators explicit: primary content and actions share the same padded axis.
      await expect(shell).toBeVisible()
      await expect(content).toBeVisible()
      await expect(main).toBeVisible()
    }
  }
  expect(centerFailures, 'desktop main containers should center inside the area after the sidebar').toEqual([])
})

test('nested Client and Manager states keep the shared workspace centered through transitions', async ({ page }) => {
  for (const width of widths) {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 })

    await page.goto('/?view=client-orders')
    await page.getByRole('button', { name: 'Открыть заказ DEMO-003' }).click()
    await expect(page.getByTestId('order-detail')).toBeVisible()
    await expectCenteredWorkspace(page, width, 'Client order detail')

    await page.goto('/?view=client-orders')
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    await expect(page.getByTestId('order-composer')).toBeVisible()
    await expectCenteredWorkspace(page, width, 'Client order composer')
    await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
    await expect(page.getByLabel('Наименование продукции', { exact: true })).toBeVisible()
    await expectCenteredWorkspace(page, width, 'Client item editor')

    await page.goto('/?view=client-orders')
    await page.getByRole('button', { name: 'Открыть заказ DEMO-007' }).click()
    await page.getByRole('button', { name: 'Ещё', exact: true }).click()
    await page.getByRole('menuitem', { name: 'Дублировать заказ' }).click()
    await expect(page.getByTestId('order-composer')).toBeVisible()
    await expectCenteredWorkspace(page, width, 'Client Repeat composer')

    await page.goto('/?view=manager-orders')
    await page.getByRole('button', { name: 'Открыть заказ DEMO-003' }).click()
    await expect(page.getByTestId('order-detail')).toBeVisible()
    await expectCenteredWorkspace(page, width, 'Manager order detail')

    await page.goto('/?demoTools=1')
    await setDemoRole(page, 'manager')
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    await expect(page.getByTestId('order-composer')).toBeVisible()
    await expectCenteredWorkspace(page, width, 'Manager order composer')

    await page.goto('/?view=manager-companies')
    const company = page.getByTestId('company-row-company-01')
    await company.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('company-order-DEMO-003')).toBeVisible()
    await expectCenteredWorkspace(page, width, 'Manager company orders')

    await page.goto('/?view=client-layouts')
    await page.getByTestId('layout-row-demo-layout-01').click()
    await expect(page.getByTestId('layout-detail')).toBeVisible()
    await expectCenteredWorkspace(page, width, 'Client layout detail')

    await page.goto('/?view=client-support')
    await page.getByTestId('ticket-row-client-01').click()
    await expect(page.getByTestId('support-ticket-detail')).toBeVisible()
    await expectCenteredWorkspace(page, width, 'Client support detail')
    await page.goto('/?view=manager-support')
    await page.getByRole('button', { name: 'Добавить обращение', exact: true }).click()
    await expect(page.getByTestId('support-ticket-form')).toBeVisible()
    await expectCenteredWorkspace(page, width, 'Manager support form')
  }
})
