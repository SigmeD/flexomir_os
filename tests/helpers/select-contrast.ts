import type { Page } from '@playwright/test'

type Color = [number, number, number, number]

function over(top: Color, bottom: Color): Color {
  return [0, 1, 2].map(i => top[i] * top[3] + bottom[i] * (1 - top[3])).concat(1) as Color
}

function luminance(color: Color) {
  const linear = color.slice(0, 3).map(channel => {
    const s = channel / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
}

function ratio(text: Color, background: Color) {
  const a = luminance(over(text, background))
  const b = luminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

/** Conservative bounds, including translucency over black/white backdrops and all sheen stops. */
export async function selectContrast(page: Page) {
  const styles = await page.evaluate(() => {
    function color(value: string, scope: Element = document.body): Color {
      const probe = document.createElement('span')
      probe.style.display = 'none'
      probe.style.color = `color(from ${value} srgb r g b / alpha)`
      scope.append(probe)
      const css = getComputedStyle(probe).color
      probe.remove()
      if (!css.startsWith('color(srgb ')) throw new Error(`Cannot normalize color: ${value} -> ${css}`)
      const values = css.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/g)!.map(Number)
      return [values[0] * 255, values[1] * 255, values[2] * 255, values[3] ?? 1]
    }
    const trigger = getComputedStyle(document.querySelector('[data-testid="filter-control"] button')!)
    const surface = document.querySelector('[role="listbox"] > div')!
    return {
      trigger: { text: color(trigger.color), background: color(trigger.backgroundColor), border: color(trigger.borderColor), focus: color(trigger.outlineColor) },
      surface: color(getComputedStyle(surface).backgroundColor),
      options: [...document.querySelectorAll('[role="option"]')].map(el => ({
        label: el.textContent!.trim(), selected: el.getAttribute('aria-selected') === 'true',
        text: color(getComputedStyle(el).color), background: color(getComputedStyle(el).backgroundColor),
      })),
    }
  })
  const extremes: Color[] = [[0, 0, 0, 1], [255, 255, 255, 1]]
  const panelCandidates = extremes.flatMap(backdrop => {
    return [over(styles.surface, backdrop)]
  })
  return {
    trigger: Math.min(...extremes.map(bg => ratio(styles.trigger.text, over(styles.trigger.background, bg)))),
    focusRing: Math.min(...extremes.map(bg => ratio(styles.trigger.focus, over(styles.trigger.background, bg)))),
    border: Math.min(...extremes.map(bg => ratio(styles.trigger.border, over(styles.trigger.background, bg)))),
    options: styles.options.map(option => ({
      label: option.label, selected: option.selected,
      ratio: Math.min(...panelCandidates.map(bg => ratio(option.text, over(option.background, bg)))),
    })),
    styles,
  }
}
