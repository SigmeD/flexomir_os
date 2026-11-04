const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium, devices, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

async function main() {
  const label = process.argv[2] || 'current';
  if (!/^[a-z0-9-]+$/.test(label)) throw new Error('Use a simple artifact label');
  const folder = path.resolve('output/playwright/glass-select-theme', label);
  await fs.mkdir(folder, { recursive: true });
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', userAgent: devices['Desktop Chrome'].userAgent });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('pageerror', error => consoleErrors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    const cdp = await page.context().newCDPSession(page);
    const sheets = new Map();
    cdp.on('CSS.styleSheetAdded', ({ header }) => sheets.set(header.styleSheetId, header));
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    await page.goto(label.endsWith('matte') ? 'http://127.0.0.1:5173/?glass=matte' : 'http://127.0.0.1:5173/');
    const trigger = page.locator('[data-testid="filter-control"] button');
    await expect(trigger).toHaveText('Все заказы');
    await page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished)));

    async function inspect(selector) {
      const element = page.locator(selector).first();
      const computed = await element.evaluate(el => {
        const s = getComputedStyle(el);
        return {
          tag: el.tagName, class: el.className, inline: el.getAttribute('style'),
          color: s.color, background: s.background, opacity: s.opacity,
          colorScheme: s.colorScheme, backdropFilter: s.backdropFilter,
          borderColor: s.borderColor, outline: s.outline, boxShadow: s.boxShadow,
          variables: Object.fromEntries(['--color-white', '--gs-foreground', '--gs-material-rgb', '--gs-material-opacity', '--gs-trigger', '--fos-center-opacity', '--fos-center-rgb'].map(v => [v, s.getPropertyValue(v).trim()])),
        };
      });
      const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
      const matched = await cdp.send('CSS.getMatchedStylesForNode', { nodeId });
      const rules = [];
      for (const { rule } of matched.matchedCSSRules || []) {
        const properties = rule.style.cssProperties.filter(p => /^(color|background.*|opacity|color-scheme|outline.*|border.*|box-shadow|backdrop-filter|--.*)$/.test(p.name) && !p.disabled);
        if (!properties.length) continue;
        const sheet = sheets.get(rule.styleSheetId || rule.style.styleSheetId);
        let source = sheet?.sourceURL;
        if (!source && sheet?.ownerNode) {
          const { node } = await cdp.send('DOM.describeNode', { backendNodeId: sheet.ownerNode });
          const i = node.attributes?.indexOf('data-vite-dev-id');
          source = i >= 0 ? node.attributes[i + 1] : '(inline style element)';
        }
        rules.push({ selector: rule.selectorList.text, origin: rule.origin, source, line: (rule.style.range?.startLine ?? 0) + 1, properties: properties.map(p => ({ name: p.name, value: p.value, important: !!p.important })) });
      }
      return { selector, computed, rules };
    }

    const selectors = ['html', 'body', '[data-testid="filter-control"] button', '[data-testid="filter-control"] button span', '[role="listbox"]'];
    if (await page.locator('.glass-select-material').count()) selectors.push('.glass-select-material', '.glass-select-viewport', '.fos-glass-optics', '.fos-glass-optics > div[aria-hidden]');
    const closed = [];
    for (const selector of selectors) closed.push(await inspect(selector));
    const audit = () => new AxeBuilder({ page }).include('[data-testid="filter-control"]').include('[role="listbox"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    await page.screenshot({ path: path.join(folder, 'closed.png'), fullPage: true });
    const axeClosed = await audit();
    await trigger.click();
    await expect(page.locator('[role="listbox"]')).toHaveCSS('opacity', '1');
    if (await page.locator('.glass-select-material').count()) await expect(page.locator('.glass-select-material feDisplacementMap')).toHaveCount(1);
    await page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished)));
    const open = [];
    for (const selector of [...selectors, '[role="option"][aria-selected="true"]', '[role="option"]:not([aria-selected="true"])']) open.push(await inspect(selector));
    const layers = await page.locator('[role="listbox"] [aria-hidden]').evaluateAll(nodes => nodes.map(el => ({ class: el.className, background: getComputedStyle(el).background, backdropFilter: getComputedStyle(el).backdropFilter })));
    await page.screenshot({ path: path.join(folder, 'open.png'), fullPage: true });
    const axeOpen = await audit();
    const report = { url: page.url(), browser: browser.version(), userAgent: await page.evaluate(() => navigator.userAgent), displacementFilters: await page.locator('feDisplacementMap').count(), theme: await page.evaluate(() => ({ rootClass: document.documentElement.className, rootTheme: document.documentElement.dataset.theme, prefersDark: matchMedia('(prefers-color-scheme: dark)').matches })), consoleErrors, closed, open, layers, axeClosed, axeOpen };
    await fs.writeFile(path.join(folder, 'devtools.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ folder, consoleErrors, trigger: closed[2].computed, option: open.find(item => item.selector === '[role="option"]:not([aria-selected="true"])').computed, violations: { closed: axeClosed.violations.map(v => v.id), open: axeOpen.violations.map(v => v.id) } }, null, 2));
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
