import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { chooseFormOption, commitItem, fillItem } from './helpers/orders'

test('FOS07 RU calendar commits ISO once; navigation and Escape do not commit', async ({ page }) => {
  await page.goto('/fos07-datepicker.html')
  await expect(page.getByRole('heading', { name: 'Календарь выбора даты' })).toBeVisible()
  const trigger = page.getByRole('button', { name: 'Открыть календарь: Желаемый срок', exact: true })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Желаемый срок' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('grid')).toBeVisible()
  await expect(dialog).toContainText('ноябрь 2026')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(page.getByTestId('date-value')).toHaveText('2026-11-16')
  await expect(trigger).toBeFocused()
  await trigger.click()
  await dialog.getByRole('button', { name: '18 ноября 2026', exact: true }).click()
  await expect(page.getByTestId('date-value')).toHaveText('2026-11-18')
  await expect(page.getByTestId('change-count')).toHaveText('1')
  await expect(trigger).toBeFocused()
})

test('FOS07 readonly/disabled do not open; min/max exclude unavailable dates', async ({ page }) => {
  await page.goto('/fos07-datepicker.html')
  await expect(page.getByLabel('Согласованный срок', { exact: true })).toHaveAttribute('readonly', '')
  await page.getByLabel('Согласованный срок', { exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByLabel('Недоступная дата', { exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Открыть календарь: Желаемый срок', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('button', { name: '9 ноября 2026', exact: true })).toBeDisabled()
  await expect(dialog.getByRole('button', { name: '21 ноября 2026', exact: true })).toBeDisabled()
  await expect(dialog.getByRole('button', { name: '20 ноября 2026', exact: true })).toBeEnabled()
  for (const name of ['Перейти к следующему месяцу', 'Перейти к предыдущему месяцу']) {
    await expect(dialog.getByRole('button', { name })).toHaveAttribute('aria-disabled', 'true')
    await expect(dialog.getByRole('button', { name })).toHaveCSS('opacity', '0.42')
  }
})

test('FOS07 manual date validation, native FormData, reset and rejected selection', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto('/fos07-datepicker.html')
  const input = page.getByLabel('Желаемый срок', { exact: true })
  await input.fill('31.11.2026')
  await input.press('Tab')
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByTestId('date-value')).toHaveText('2026-11-16')
  expect(await input.evaluate((el: HTMLInputElement) => el.form?.checkValidity())).toBe(false)
  await input.fill('21.11.2026')
  await input.press('Tab')
  expect(await input.evaluate((el: HTMLInputElement) => el.form?.checkValidity())).toBe(false)
  await input.fill('19.11.2026')
  await page.getByRole('button', { name: 'Проверить форму', exact: true }).click()
  await expect(page.getByTestId('form-value')).toHaveText('2026-11-19')
  await page.getByRole('button', { name: 'Сбросить', exact: true }).click()
  await expect(input).toHaveValue('16.11.2026')
  await expect(page.getByTestId('date-value')).toHaveText('2026-11-16')
  await page.getByRole('checkbox', { name: 'Отклонять изменение родителем' }).check()
  await page.getByRole('button', { name: 'Открыть календарь: Желаемый срок', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: '18 ноября 2026', exact: true }).click()
  await expect(input).toHaveValue('16.11.2026')
  await input.fill('18.11.2026')
  await input.press('Tab')
  await expect(input).toHaveValue('16.11.2026')
  await input.fill('')
  await input.press('Tab')
  await expect(input).toHaveValue('16.11.2026')
  expect(errors).toEqual([])
})

test('FOS07 reset rejection preserves accepted value in text and FormData', async ({ page }) => {
  await page.goto('/fos07-datepicker.html')
  const input = page.getByLabel('Желаемый срок', { exact: true })
  await input.fill('18.11.2026')
  await page.getByRole('checkbox', { name: 'Отклонять изменение родителем' }).check()
  await page.getByRole('button', { name: 'Сбросить', exact: true }).click()
  await expect(page.getByTestId('date-value')).toHaveText('2026-11-18')
  await expect(input).toHaveValue('18.11.2026')
  expect(await input.evaluate((el: HTMLInputElement) => new FormData(el.form!).get('requestedDate'))).toBe('2026-11-18')
})

test('FOS07 keyboard grid, month/year/leap navigation and focus containment', async ({ page }) => {
  await page.goto('/fos07-datepicker.html')
  const input = page.getByLabel('Без ограничений', { exact: true })
  await input.fill('29.02.2028')
  await input.press('ArrowDown')
  const dialog = page.getByRole('dialog', { name: 'Без ограничений' })
  await expect(dialog.getByRole('button', { name: '29 февраля 2028', exact: true })).toBeFocused()
  await page.keyboard.press('PageDown')
  await expect(dialog.getByRole('button', { name: '29 марта 2028', exact: true })).toBeFocused()
  await page.keyboard.press('Shift+PageUp')
  await expect(dialog.getByRole('button', { name: '29 марта 2027', exact: true })).toBeFocused()
  await page.keyboard.press('Home')
  await expect(dialog.getByRole('button', { name: '29 марта 2027', exact: true })).toBeFocused()
  await page.keyboard.press('End')
  await expect(dialog.getByRole('button', { name: '4 апреля 2027', exact: true })).toBeFocused()
  await page.keyboard.press('Space')
  await expect(input).toHaveValue('04.04.2027')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button', { name: 'Открыть календарь: Без ограничений', exact: true }).click()
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true)
  }
  await dialog.getByRole('button', { name: 'Закрыть календарь' }).focus()
  await page.keyboard.press('Shift+Tab')
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
})

test('FOS07 five widths, both roles, material, touch, reduced motion, forced colors and axe', async ({ page }, info) => {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto('/fos07-datepicker.html')
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: width === 768 ? 'reduce' : 'no-preference', forcedColors: width === 320 ? 'active' : 'none' })
    for (const role of ['Клиент', 'Менеджер']) {
      await page.getByRole('button', { name: role, exact: true }).click()
      const trigger = page.getByRole('button', { name: 'Открыть календарь: Желаемый срок', exact: true })
      if (info.project.name.includes('touch')) await trigger.tap()
      else await trigger.click()
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      await dialog.evaluate(async el => { await Promise.allSettled(el.getAnimations({ subtree: true }).map(a => a.finished)) })
      const box = await dialog.boundingBox()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.y).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width)
      expect(box!.y + box!.height).toBeLessThanOrEqual(900)
      await expect(dialog.locator('[data-fos-popup-surface]')).toHaveCount(1)
      await expect(dialog.locator('.fos-popup-rows__lens')).toHaveCount(0)
      if (width === 1440) {
        expect(await dialog.locator('[data-fos-popup-surface]').evaluate(el => getComputedStyle(el).backdropFilter)).toBe('blur(20px)')
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      }
      await page.screenshot({ path: info.outputPath(`${role}-${width}.png`), fullPage: true })
      await dialog.getByRole('button', { name: '20 ноября 2026', exact: true }).click()
      await expect(page.getByTestId('date-value')).toHaveText('2026-11-20')
    }
  }
  expect(errors).toEqual([])
})

test('FOS07 outside dismiss and 200% CSS zoom keep popup inside viewport', async ({ page }) => {
  await page.goto('/fos07-datepicker.html')
  await page.evaluate(() => { document.documentElement.style.zoom = '2' })
  // Mobile CSS zoom changes the visual viewport offsets. Open by the real
  // keyboard path; pointer/touch activation is covered at all five widths above.
  await page.getByLabel('Желаемый срок', { exact: true }).press('ArrowDown')
  const dialog = page.getByRole('dialog')
  // Focus can pan the visual viewport; its scroll event repositions the panel.
  // Read rect and viewport together after that event, without relaxing bounds.
  await expect.poll(() => dialog.evaluate(el => {
    const box = el.getBoundingClientRect(), viewport = visualViewport
    const x = viewport?.offsetLeft || 0, y = viewport?.offsetTop || 0
    return box.left >= x && box.top >= y && box.right <= x + (viewport?.width || innerWidth) && box.bottom <= y + (viewport?.height || innerHeight)
  })).toBe(true)
  await page.mouse.click(1, 1)
  await expect(dialog).toHaveCount(0)
  await expect(page.getByTestId('date-value')).toHaveText('2026-11-16')
})

test('FOS07 date-only parsing has leap/year boundaries and no UTC date shift', async ({ browser }) => {
  for (const timezoneId of ['Pacific/Kiritimati', 'America/Los_Angeles']) {
    const context = await browser.newContext({ timezoneId })
    const page = await context.newPage()
    await page.goto('/fos07-datepicker.html')
    const input = page.getByLabel('Без ограничений', { exact: true })
    for (const [typed, expected] of [['29.02.2028', '2028-02-29'], ['01.01.0001', '0001-01-01'], ['31.12.9999', '9999-12-31']]) {
      await input.fill(typed)
      await input.press('Tab')
      await expect(input).toHaveValue(typed)
      await expect(page.getByTestId('date-value')).toHaveText(expected)
    }
    await input.fill('29.02.2027')
    await input.press('Tab')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByTestId('date-value')).toHaveText('9999-12-31')
    await context.close()
  }
})

test('FOS07 empty bounded calendar focuses today clamped to the available range', async ({ page }) => {
  await page.goto('/fos07-datepicker.html')
  for (const [label, expected] of [['Прошлый диапазон', '20 ноября 2020'], ['Будущий диапазон', '10 ноября 2030']]) {
    await page.getByRole('button', { name: 'Открыть календарь: ' + label, exact: true }).click()
    await expect(page.getByRole('dialog').getByRole('button', { name: expected, exact: true })).toBeFocused()
    await page.keyboard.press('Escape')
  }
})

test('FOS07 picking the accepted date repairs invalid manual input, including rejected selection', async ({ page }) => {
  await page.goto('/fos07-datepicker.html')
  const input = page.getByLabel('Желаемый срок', { exact: true })
  for (const reject of [false, true]) {
    if (reject) await page.getByRole('checkbox', { name: 'Отклонять изменение родителем' }).check()
    await input.fill('31.11.2026')
    await input.press('Tab')
    await page.getByRole('button', { name: 'Открыть календарь: Желаемый срок', exact: true }).click()
    await page.getByRole('dialog').getByRole('button', { name: reject ? '18 ноября 2026' : '16 ноября 2026', exact: true }).click()
    await expect(input).toHaveValue('16.11.2026')
    expect(await input.evaluate((el: HTMLInputElement) => el.form!.checkValidity())).toBe(true)
    await expect(page.getByTestId('date-value')).toHaveText('2026-11-16')
  }
})

test('FOS07 selected date and pointer preview use one shared Glass lens without committing on hover', async ({ page }, info) => {
  await page.goto('/fos07-datepicker.html')
  await page.getByRole('button', { name: 'Открыть календарь: Желаемый срок', exact: true }).click()
  const dialog = page.getByRole('dialog')
  const selected = dialog.getByRole('button', { name: '16 ноября 2026', exact: true })
  const target = dialog.getByRole('button', { name: '18 ноября 2026', exact: true })
  const lens = dialog.locator('[data-date-lens]')
  await expect(selected.locator('..').locator('[data-date-lens]')).toHaveCount(1)
  await expect(lens).toHaveCount(1)
  await expect(lens).toHaveAttribute('data-tone', 'neutral')
  await expect(selected).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  if (!info.project.name.includes('touch')) {
    await target.hover()
    await expect(target.locator('..').locator('[data-date-lens]')).toHaveCount(1)
    await expect(lens).toHaveCount(1)
    await expect(page.getByTestId('date-value')).toHaveText('2026-11-16')
    await expect(dialog.getByRole('gridcell', { selected: true })).toContainText('16')
    await dialog.getByRole('button', { name: 'Закрыть календарь' }).hover()
    await expect(selected.locator('..').locator('[data-date-lens]')).toHaveCount(1)
    await dialog.getByRole('button', { name: '9 ноября 2026', exact: true }).hover()
    await expect(selected.locator('..').locator('[data-date-lens]')).toHaveCount(1)
  }
  await selected.focus()
  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByRole('button', { name: '17 ноября 2026', exact: true })).toBeFocused()
  await expect(selected.locator('..').locator('[data-date-lens]')).toHaveCount(1)
  if (info.project.name.includes('touch')) await target.tap()
  else await target.click()
  await expect(page.getByTestId('date-value')).toHaveText('2026-11-18')
  await page.getByRole('button', { name: 'Открыть календарь: Желаемый срок', exact: true }).click()
  await expect(target.locator('..').locator('[data-date-lens]')).toHaveCount(1)
})

for (const role of ['client', 'manager'] as const) {
  test(`FOS07 ordinary ${role}: accepted calendar, invalid draft guard and item roundtrip`, async ({ page }, info) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/?view=' + role + '-orders')
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    const composer = page.getByTestId('order-composer')
    const trigger = composer.getByRole('button', { name: 'Открыть календарь: Желаемый срок', exact: true })
    await expect(trigger).toBeVisible()
    if (role === 'manager') await chooseFormOption(page, 'Компания', 'Компания 01')
    else {
      await expect(composer.getByLabel('Согласованный срок', { exact: true })).toHaveAttribute('readonly', '')
      await expect(composer.getByRole('button', { name: /календарь: Согласованный срок/ })).toHaveCount(0)
    }
    const date = composer.getByLabel('Желаемый срок', { exact: true })
    await date.fill('16.11.2026')
    if (info.project.name.includes('touch')) await trigger.tap()
    else await trigger.click()
    const dialog = page.getByRole('dialog', { name: 'Желаемый срок' })
    await expect(dialog.locator('[data-date-lens]')).toHaveCount(1)
    await dialog.getByRole('button', { name: '18 ноября 2026', exact: true }).click()
    await expect(date).toHaveValue('18.11.2026')
    await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
    await fillItem(page)
    await commitItem(page)
    const action = page.getByRole('button', { name: role === 'client' ? 'Передать менеджеру (демо)' : 'Сохранить черновик менеджера', exact: true })
    await expect(action).toBeEnabled()
    await date.fill('31.11.2026')
    await date.press('Tab')
    await expect(date).toHaveAttribute('aria-invalid', 'true')
    await expect(action).toBeDisabled()
    await page.getByRole('button', { name: 'Изменить позицию 1', exact: true }).click()
    await page.getByLabel('Количество', { exact: true }).fill('700')
    await commitItem(page)
    await expect(date).toHaveValue('31.11.2026')
    await expect(action).toBeDisabled()
    await trigger.click()
    await dialog.getByRole('button', { name: '18 ноября 2026', exact: true }).click()
    await expect(action).toBeEnabled()
    await action.click()
    if (role === 'client') {
      await expect(page.getByTestId('order-detail').getByLabel('Желаемый срок', { exact: true })).toHaveValue('18.11.2026')
      await expect(page.getByLabel('Согласованный срок', { exact: true })).toHaveAttribute('readonly', '')
    } else await expect(action).toBeDisabled()
    expect(errors).toEqual([])
  })
}

test('order dates share the DatePicker display contract in editable and readonly states', async ({ page }, info) => {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/?view=client-orders')
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    const composer = page.getByTestId('order-composer')
    const wanted = composer.getByLabel('Желаемый срок', { exact: true })
    const agreed = composer.getByLabel('Согласованный срок', { exact: true })
    await expect(wanted).toHaveAttribute('placeholder', 'ДД.ММ.ГГГГ')
    await expect(agreed).toHaveAttribute('placeholder', 'ДД.ММ.ГГГГ')
    await expect(agreed).toHaveAttribute('type', 'text')
    await expect(agreed).toHaveAttribute('readonly', '')
    await expect(composer.getByRole('button', { name: /Открыть календарь: Согласованный срок/ })).toHaveCount(0)
    await expect(agreed).toHaveCSS('background-color', 'rgb(246, 247, 249)')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (width === 1440 || width === 320) await composer.locator('.fos-order-composer__general').screenshot({ path: info.outputPath(`date-fields-${width}.png`) })

    for (const role of ['client', 'manager']) {
      await page.goto(`/?view=${role}-orders`)
      await page.getByRole('button', { name: 'Открыть заказ DEMO-003' }).click()
      const detail = page.getByTestId('order-detail')
      const date = detail.getByLabel('Согласованный срок', { exact: true })
      await expect(date).toHaveAttribute('type', 'text')
      await expect(date).toHaveAttribute('placeholder', 'ДД.ММ.ГГГГ')
      await expect(date).toHaveValue('20.11.2026')
      await expect(date).toHaveAttribute('readonly', '')
      await expect(detail.getByRole('button', { name: /Открыть календарь:/ })).toHaveCount(0)
      await expect(detail.locator('input[type=date][aria-hidden=true]')).toHaveCount(2)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
  }
})
