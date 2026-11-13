import { test, expect } from '@playwright/test'

// Break caught: an actual consumer bypasses the semantic owner, or renders a
// second material surface while migrating its existing geometry/interaction.
test('production families choose one semantic material surface per existing layer', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 })
  await page.goto('/?view=manager-orders')
  await expect(page.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-material-preset','navigation')
  const filters = page.getByTestId('glass-pill-lens')
  await expect(filters).toHaveCount(2)
  for (const filter of await filters.all()) await expect(filter).toHaveAttribute('data-material-preset','segment')
  await expect(page.locator('.fos-account-footer__glass')).toHaveAttribute('data-material-preset','account-trigger')
  await page.getByTestId('account-menu-trigger').click()
  const popup = page.getByTestId('account-menu')
  await expect(popup.locator('.fos-popup-surface__shell')).toHaveAttribute('data-material-preset','popup')
  await expect(popup.locator('.fos-popup-surface__shell')).toHaveCount(1)
  // The existing frozen moving lens remains separate from the static shell.
  await expect(popup.locator('[data-motion-reference]')).toHaveCount(1)
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('account-menu-trigger')).toBeFocused()

  await page.goto('/fos07-datepicker.html')
  await page.getByRole('button',{name:'Открыть календарь: Желаемый срок',exact:true}).click()
  await expect(page.locator('[data-date-lens]')).toHaveAttribute('data-material-preset','date-cell')
  await page.getByRole('dialog').getByRole('button',{name:'18 ноября 2026',exact:true}).click()
  await expect(page.getByTestId('date-value')).toHaveText('2026-11-18')

  await page.goto('/?view=client-orders&demoTools=1')
  await page.getByRole('button',{name:'Демо — показать панель демонстрации',exact:true}).click()
  await expect(page.getByTestId('demo-presentation-controls')).toHaveAttribute('data-material-preset','demo-panel')
})

// Break caught: a local optical override or omitted profile restores drift in
// one of Header/Plus/Secondary while the shared quiet-action profile changes.
test('one quiet material profile reaches Header, Plus and Secondary without changing their actions', async ({ page }) => {
  let intercepted = 0
  let sharedProfileFound = false
  await page.route('**/src/components/ui/fos-material-surface.tsx*', async route => {
    const response = await route.fetch()
    const source = await response.text()
    const pattern = /centerColor: ["']255 255 255["']/
    sharedProfileFound = pattern.test(source)
    intercepted++
    await route.fulfill({ response, body:source.replace(pattern,'centerColor: "255 0 255"') })
  })
  await page.goto('/?view=neutral-actions')
  expect(sharedProfileFound, 'shared quiet material profile exists').toBe(true)
  const host = page.getByTestId('neutral-paper')
  for (const [id,variant] of [['neutral-header','header-action'],['neutral-plus','action-quiet-round'],['neutral-secondary','action-quiet']]) {
    const button = host.getByTestId(id)
    const material = button.locator('[data-fos-glass-material]')
    await expect(material).toHaveCount(1)
    await expect(material).toHaveAttribute('data-material-preset',variant)
    await expect(material).toHaveCSS('--fos-center-rgb','255 0 255')
    await button.click()
  }
  await expect(host.getByTestId('neutral-count')).toHaveText('Нажатий: 3')
  await expect(host.getByTestId('neutral-disabled')).toBeDisabled()
  expect(intercepted).toBe(1)
})

// Break caught: native HTML support reopens optical/style overrides, or a
// layout prop bypasses the narrow navigation-only geometry contract.
test('semantic preset rejects untyped optical overrides and preserves native content', async ({ page }) => {
  await page.goto('/tests/fixtures/material-presets.html')
  const material = page.getByTestId('protected-preset')
  await expect(material).toHaveAttribute('data-material-ready','true')
  await expect(material).toHaveAttribute('data-strength','0.022')
  await expect(material).toHaveAttribute('data-motion','none')
  await expect(material).toHaveAttribute('data-travel-target','0')
  await expect(material).toHaveAttribute('data-tone','neutral')
  await expect(material).toHaveAttribute('data-lighting','sidebar')
  await expect(material).toHaveCSS('border-radius','22px')
  await expect(material).toHaveCSS('--fos-rim-width','1.25px')
  await expect(material).toHaveCSS('--fos-center-opacity','0')
  await expect(material).toHaveCSS('top','0px')
  await expect(material).toHaveAccessibleName('Содержимое документа')
  await expect(material.locator('.fixture-copy').getByTestId('native-child')).toHaveText('Оригинальное содержимое')
})

// Break caught: adding a preset causes the existing lens to lose its measured
// top, travel target or real spring observer (or applies a second transform).
test('navigation preset keeps controlled position and the existing travel observer', async ({ page }) => {
  await page.goto('/tests/fixtures/material-presets.html')
  await page.emulateMedia({ reducedMotion:'reduce' })
  const lens = page.getByTestId('navigation-preset')
  await expect(lens).toHaveCSS('top','48px')
  await expect(lens).toHaveCSS('border-radius','14px')
  await expect(lens).toHaveAttribute('data-strength','0.1')
  await expect(lens).toHaveAttribute('data-travel-target','0')
  await page.getByRole('button',{name:'Переместить линзу'}).click()
  await expect(lens).toHaveAttribute('data-travel-target','48')
  await expect(page.getByTestId('observed-frame')).toHaveText('48.000')
  expect(await lens.evaluate(n=>new DOMMatrixReadOnly(getComputedStyle(n).transform).m42)).toBe(48)
  await expect(lens).toHaveCSS('top','48px')
})

// Break caught: inherited object keys are accepted as presets, allowing an
// untyped caller's optical properties through an empty spread.
test('unknown and inherited preset names fail closed before rendering optics', async ({ page }) => {
  await page.goto('/tests/fixtures/material-presets.html?invalid=1')
  for (const name of ['toString','constructor','__proto__','unknown-preset']) {
    const boundary = page.getByTestId('invalid-'+name)
    await expect(boundary.getByRole('status')).toHaveText('Unknown material preset: '+name)
    await expect(boundary.locator('[data-fos-glass-material]')).toHaveCount(0)
  }
})
