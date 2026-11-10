import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

test('Every source button goes through the shared native root', () => {
  const native: string[] = []
  function scan(directory: string) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) { scan(file); continue }
      if (!file.endsWith('.tsx')) continue
      const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
      const visit = (node: ts.Node) => {
        if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(source) === 'button') native.push(file.replaceAll('\\', '/'))
        ts.forEachChild(node, visit)
      }
      visit(source)
    }
  }
  scan('src')
  expect(native).toEqual(['src/components/ui/fos-button-root.tsx'])
})

test('Root preserves native form, ref, disabled, keyboard and Radix asChild contracts', async ({ page }) => {
  await page.goto('/tests/fixtures/button-root.html')
  const plain = page.getByTestId('plain')
  await plain.focus(); await page.keyboard.press('Enter'); await page.keyboard.press('Space')
  await expect(page.getByTestId('clicks')).toHaveText('2')
  await expect(page.getByTestId('submit')).toBeEmpty()
  await expect(page.getByTestId('ref-tag')).toHaveText('BUTTON')
  await page.getByRole('button', { name: 'Фокус через ref' }).click()
  await expect(plain).toBeFocused()
  await page.getByRole('button', { name: 'Недоступная' }).evaluate(node => (node as HTMLButtonElement).click())
  await expect(page.getByTestId('clicks')).toHaveText('2')
  await page.getByLabel('Значение').fill('Изменено')
  await page.getByRole('button', { name: 'Сбросить', exact: true }).click()
  await expect(page.getByLabel('Значение')).toHaveValue('Исходное')
  for (const id of ['plus', 'reference-plus']) {
    const plus = page.getByTestId(id)
    await expect(plus).toHaveAttribute('type', 'button')
    await plus.evaluate(node => (node as HTMLButtonElement).click())
    await expect(page.getByTestId('ref-tag')).toHaveText('BUTTON')
  }
  const submit = page.getByRole('button', { name: 'Сохранить форму' })
  await submit.scrollIntoViewIfNeeded()
  const box = (await submit.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height + 80)
  await page.mouse.up()
  await expect(page.getByTestId('submit')).toBeEmpty()
  await submit.click()
  await expect(page.getByTestId('submit')).toHaveText('intent:save')
  const menu = page.getByRole('button', { name: 'Меню', exact: true })
  await menu.focus(); await page.keyboard.press('Enter')
  await expect(page.getByRole('menuitem', { name: 'Пункт меню' })).toBeVisible()
  await page.keyboard.press('Escape'); await expect(menu).toBeFocused()
  await expect(page.locator('button:not([data-fos-button])')).toHaveCount(0)
})

for (const role of ['client', 'manager']) test(`All ${role} business actions use the common neutral family by default`, async ({ page }) => {
  await page.goto(`/?view=${role}-orders`)
  await expect(page.locator('button:not([data-fos-button])')).toHaveCount(0)
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  const plus = page.getByRole('button', { name: 'Добавить позицию', exact: true })
  await expect(plus).toHaveAttribute('data-action-palette', 'neutral')
  await expect(plus.locator('[data-fos-glass-material]')).toHaveCount(1)
  await expect(page.locator('.fos-ha:not([data-action-palette="neutral"]), .fos-action:not([data-action-palette="neutral"])')).toHaveCount(0)
  await page.getByRole('button', { name: 'Ещё', exact: true }).click()
  await expect(page.getByRole('menu')).toBeVisible()
  await expect(page.locator('button:not([data-fos-button])')).toHaveCount(0)
  await page.keyboard.press('Escape')

  await plus.scrollIntoViewIfNeeded()
  const box = (await plus.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height + 80)
  await page.mouse.up()
  const editor = page.getByTestId('order-item-form')
  await expect(editor).toHaveCount(0)
  await plus.press('Space')
  await expect(editor).toBeVisible()
})
