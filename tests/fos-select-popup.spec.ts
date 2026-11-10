import { expect, test } from '@playwright/test'

const fixture = '/tests/fixtures/fos-select.html'
test('native form bridge preserves required validity, invalid focus, events, implicit values and reset', async ({ page }) => {
  await page.goto(fixture)
  const trigger = page.getByRole('combobox', { name: 'Выбор' })
  await page.getByRole('button', { name: 'Отправить', exact: true }).click()
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByTestId('form-data')).toBeEmpty()
  await trigger.click()
  await expect(page.getByRole('option', { name: 'Бета' })).toBeDisabled()
  await expect(page.getByRole('option', { name: 'Дельта' })).toBeDisabled()
  await page.getByRole('option', { name: 'Гамма' }).click()
  await expect(page.getByTestId('change-event')).toHaveText('SELECT:Гамма')
  await expect(page.getByTestId('change-count')).toHaveText('1')
  await expect(trigger).not.toHaveAttribute('aria-invalid', 'true')
  await page.getByRole('button', { name: 'Отправить', exact: true }).click()
  await expect(page.getByTestId('form-data')).toHaveText('[["choice","Гамма"]]')
  await trigger.click()
  await page.getByRole('option', { name: 'Гамма' }).click()
  await expect(page.getByTestId('change-count')).toHaveText('1')
  await page.getByRole('button', { name: 'Сбросить', exact: true }).click()
  await expect(trigger).toHaveText('Выберите значение')
  await expect(page.locator('select')).toHaveValue('')
  await expect(trigger).toHaveAttribute('aria-describedby', /extra-note.*-message/)
})

test('readonly and disabled cannot open or change the field', async ({ page }) => {
  await page.goto(fixture)
  const trigger = page.getByRole('combobox', { name: 'Выбор' })
  await page.getByRole('button', { name: 'Readonly', exact: true }).click()
  await expect(trigger).toHaveAttribute('aria-readonly', 'true')
  await trigger.click()
  await trigger.press('ArrowDown')
  await expect(page.getByRole('listbox')).toHaveCount(0)
  await page.getByRole('button', { name: 'Readonly', exact: true }).click()
  await trigger.click()
  await expect(page.getByRole('listbox')).toBeVisible()
  await page.getByRole('button', { name: 'Disabled', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(trigger).toBeDisabled()
  await expect(page.getByRole('listbox')).toHaveCount(0)
  await expect(page.getByTestId('change-count')).toHaveText('0')
})

test('keyboard skips disabled options, typeahead focuses without selection, Tab resumes field order', async ({ page }) => {
  await page.goto(fixture)
  const trigger = page.getByRole('combobox', { name: 'Выбор' })
  await trigger.press('ArrowDown')
  await page.keyboard.press('Home')
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('option', { name: 'Альфа' })).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('option', { name: 'Гамма' })).toBeFocused()
  await page.keyboard.press('Home')
  await page.getByRole('option', { name: 'Выберите значение' }).dispatchEvent('keydown', { key: 'г' })
  await expect(page.getByRole('option', { name: 'Гамма' })).toBeFocused()
  await expect(page.locator('select')).toHaveValue('')
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await trigger.click()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Отправить', exact: true })).toBeFocused()
  await expect(page.getByRole('listbox')).toHaveCount(0)
})

test('long list flips in a short viewport, scrolls to End and outside click retains destination focus', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 240 })
  await page.goto(fixture + '?long=1')
  await page.getByRole('combobox', { name: 'Выбор' }).click()
  const list = page.getByRole('listbox')
  await page.keyboard.press('End')
  await expect(page.getByRole('option', { name: 'Вариант 49', exact: true })).toBeFocused()
  const box = (await list.boundingBox())!
  expect(box.x).toBeGreaterThanOrEqual(15)
  expect(box.x + box.width).toBeLessThanOrEqual(305)
  expect(box.y).toBeGreaterThanOrEqual(0)
  expect(box.y + box.height).toBeLessThanOrEqual(240)
  await page.getByLabel('Следующее поле').click()
  await expect(page.getByLabel('Следующее поле')).toBeFocused()
  await expect(list).toHaveCount(0)
})

test('visible trigger owns autofocus and typed focus/blur callbacks', async ({ page }) => {
  await page.goto(fixture + '?autofocus=1')
  const trigger = page.getByRole('combobox', { name: 'Выбор' })
  await expect(trigger).toBeFocused()
  await expect(page.getByTestId('focus-event')).toHaveText('focus:BUTTON')
  await page.keyboard.press('Tab')
  await expect(page.getByTestId('focus-event')).toHaveText('blur:BUTTON')
})

test('controlled acceptance/reset and controlled rejection preserve the owner value', async ({ page }) => {
  for (const reject of [false, true]) {
    await page.goto(fixture + '?controlled=1' + (reject ? '&reject=1' : ''))
    const trigger = page.getByRole('combobox', { name: 'Выбор' })
    await trigger.click()
    await page.getByRole('option', { name: 'Гамма' }).click()
    await expect(page.locator('select')).toHaveValue(reject ? 'a' : 'Гамма')
    await expect(trigger).toHaveText(reject ? 'Альфа' : 'Гамма')
    await page.getByRole('button', { name: 'Сбросить', exact: true }).click()
    await expect(page.locator('select')).toHaveValue(reject ? 'a' : 'Гамма')
    await expect(trigger).toHaveText(reject ? 'Альфа' : 'Гамма')
  }
})

test('long selected label stays inside the 44px field at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto(fixture + '?label=1')
  const trigger = page.getByRole('combobox', { name: 'Выбор' })
  await trigger.click()
  await page.getByRole('option', { name: /Очень длинное название/ }).click()
  await expect(trigger).toContainText('Очень длинное название')
  const bounds = await trigger.evaluate(element => {
    const label = element.querySelector('.fos-field__select-label')!
    return { height: element.getBoundingClientRect().height, field: element.getBoundingClientRect().right, label: label.getBoundingClientRect().right, overflow: document.documentElement.scrollWidth - innerWidth }
  })
  expect(bounds.height).toBe(44)
  expect(bounds.label).toBeLessThanOrEqual(bounds.field)
  expect(bounds.overflow).toBeLessThanOrEqual(0)
})

test('controlled rejected choice preserves the previous required error', async ({ page }) => {
  await page.goto(fixture + '?controlled=1&reject=1&empty=1')
  const trigger = page.getByRole('combobox', { name: 'Выбор' })
  await page.getByRole('button', { name: 'Отправить', exact: true }).click()
  await expect(trigger).toHaveAttribute('aria-invalid', 'true')
  await trigger.click()
  await page.getByRole('option', { name: 'Гамма' }).click()
  await expect(page.locator('select')).toHaveValue('')
  await expect(trigger).toHaveText('Выберите значение')
  await expect(trigger).toHaveAttribute('aria-invalid', 'true')
})

test('readonly skips required validation like a readonly input while retaining its submitted value', async ({ page }) => {
  await page.goto(fixture)
  await page.getByRole('button', { name: 'Readonly', exact: true }).click()
  await page.getByRole('button', { name: 'Отправить', exact: true }).click()
  await expect(page.getByTestId('form-data')).toHaveText('[["choice",""]]')
  await expect(page.getByRole('combobox', { name: 'Выбор' })).not.toHaveAttribute('aria-invalid', 'true')
})

test('accepted selection keeps the same lens mounted until its real spring settles, without another change', async ({ page }, info) => {
  await page.goto(fixture + '?controlled=1')
  const trigger = page.getByRole('combobox', { name: 'Выбор' })
  await trigger.click()
  const list = page.getByRole('listbox')
  await list.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)))
  await page.evaluate(() => {
    const state = { moved: false, settled: false, frames: [] as Array<{ time: number; lensTop: number; state: string; oldScale: number; newScale: number }> }
    const list = document.querySelector('[role="listbox"]')!
    const initial = list.querySelector('[data-motion="travel"]')
    const observer = new MutationObserver(() => {
      const lens = list.querySelector<HTMLElement>('[data-motion="travel"]')
      if (lens && lens === initial && lens.dataset.motionState === 'moving' && Number(lens.dataset.travelTarget) !== 0) state.moved = true
      if (state.moved && lens?.dataset.motionState === 'settled') state.settled = true
    })
    observer.observe(list, { subtree: true, attributes: true, childList: true })
    const sample = () => {
      if (!list.isConnected) return
      const lens = list.querySelector<HTMLElement>('[data-motion="travel"]')
      const scale = (id: string) => Number(list.querySelector<HTMLElement>('[data-popup-item="' + id + '"] [data-popup-label]')?.style.getPropertyValue('--fos-sidebar-label-scale') || 1)
      if (lens) state.frames.push({ time: performance.now(), lensTop: lens.getBoundingClientRect().top, state: lens.dataset.motionState ?? '', oldScale: scale('a'), newScale: scale('Гамма') })
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
    Object.assign(window, { popupMotionEvidence: state })
  })
  await page.getByRole('option', { name: 'Гамма' }).click()
  await expect(trigger).toHaveText('Гамма')
  await expect(list).toHaveCount(0)
  await expect(trigger).toBeFocused()
  const evidence = await page.evaluate(() => (window as unknown as { popupMotionEvidence: { moved: boolean; settled: boolean; frames: Array<{ oldScale: number; newScale: number }> } }).popupMotionEvidence)
  expect(evidence).toMatchObject({ moved: true, settled: true })
  expect(evidence.frames.some(frame => frame.oldScale < 1.042 && frame.newScale > 1.001)).toBe(true)
  await info.attach('popup-motion-frames', { body: JSON.stringify(evidence), contentType: 'application/json' })
  await expect(page.getByTestId('change-count')).toHaveText('1')
})

test('Escape/outside interrupt only presentation, and stale observers cannot close a reopened list', async ({ page }) => {
  await page.goto(fixture + '?controlled=1')
  const trigger = page.getByRole('combobox', { name: 'Выбор' })
  await trigger.click()
  await page.getByRole('option', { name: 'Гамма' }).click()
  await page.keyboard.press('Escape')
  await expect(trigger).toHaveText('Гамма')
  await expect(trigger).toBeFocused()
  await trigger.click()
  await expect(page.getByRole('listbox')).toBeVisible()
  await page.getByRole('option', { name: 'Альфа' }).click()
  await page.getByLabel('Следующее поле').click()
  await expect(page.getByRole('listbox')).toHaveCount(0)
  await expect(page.getByLabel('Следующее поле')).toBeFocused()
  await expect(trigger).toHaveText('Альфа')
  await trigger.click()
  await page.keyboard.press('End')
  await expect(page.getByRole('listbox')).toBeVisible()
  await expect(page.getByRole('option', { name: 'Гамма' })).toBeFocused()
  await expect(page.getByTestId('change-count')).toHaveText('2')
})

test('rapid selection retarget closes once at the latest value and emits only two changes', async ({ page }) => {
  await page.goto(fixture + '?controlled=1')
  const trigger = page.getByRole('combobox', { name: 'Выбор' })
  await trigger.click()
  await page.getByRole('option', { name: 'Гамма' }).click()
  await page.getByRole('option', { name: 'Альфа' }).click()
  await expect(page.getByRole('listbox')).toHaveCount(0)
  await expect(trigger).toHaveText('Альфа')
  await expect(trigger).toBeFocused()
  await expect(page.getByTestId('change-count')).toHaveText('2')
})

test('reduced motion and forced colors close accepted selection from real off/settled state', async ({ page }) => {
  for (const forced of [false, true]) {
    await page.emulateMedia(forced ? { forcedColors: 'active', reducedMotion: 'no-preference' } : { forcedColors: 'none', reducedMotion: 'reduce' })
    await page.goto(fixture + '?controlled=1')
    const trigger = page.getByRole('combobox', { name: 'Выбор' })
    await trigger.click()
    await page.getByRole('option', { name: 'Гамма' }).click()
    await expect(page.getByRole('listbox')).toHaveCount(0)
    await expect(trigger).toHaveText('Гамма')
    await expect(trigger).toBeFocused()
    await expect(page.getByTestId('change-count')).toHaveText('1')
  }
})
