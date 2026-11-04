const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium, devices, expect } = require('@playwright/test');

async function main() {
  const folder = path.resolve('output/playwright/fos-material/reference');
  await fs.mkdir(folder, { recursive: true });
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: devices['Desktop Chrome'].userAgent });
    const page = await context.newPage();
    await page.goto(pathToFileURL('D:/downloads/Flexomir_Lens_225.html').href);
    await page.locator('#optic-mode').selectOption('c');
    await page.locator('#light-side').selectOption('left');
    await expect.poll(() => page.evaluate(() => window.__lensQA?.snapshot().rafActive)).toBe(false);
    await page.screenshot({ path: path.join(folder, 'sidebar-225.png'), fullPage: true });
    await page.locator('#glass-lens').screenshot({ path: path.join(folder, 'sidebar-225-lens.png') });
    const reference = await page.locator('#glass-lens').evaluate(el => {
      const s = getComputedStyle(el), box = el.getBoundingClientRect();
      return { box: { width: box.width, height: box.height }, radius: s.borderRadius, border: s.border, background: s.background, shadow: s.boxShadow, keyX: getComputedStyle(document.body).getPropertyValue('--key-x').trim(), qa: window.__lensQA.snapshot() };
    });
    await page.goto(pathToFileURL('D:/downloads/Flexomir_V3_Liquid_Glass_215_REUPLOAD (1).html').href);
    await page.screenshot({ path: path.join(folder, 'button-215.png'), fullPage: true });
    await page.locator('.scene').screenshot({ path: path.join(folder, 'button-215-scene.png') });
    await page.goto('http://127.0.0.1:5173/?view=material');
    const material = page.locator('[data-fos-glass-material]');
    await expect(material).toHaveAttribute('data-optics-mode', 'refraction');
    await expect(material.locator('feDisplacementMap')).toHaveCount(1);
    await page.screenshot({ path: path.join(folder, 'fos-material.png'), fullPage: true });
    await material.screenshot({ path: path.join(folder, 'fos-material-lens.png') });
    const adapted = await material.evaluate(el => {
      const s = getComputedStyle(el), box = el.getBoundingClientRect(), optics = el.querySelector('.fos-glass-optics');
      return { box: { width: box.width, height: box.height }, radius: s.borderRadius, keyX: s.getPropertyValue('--fos-key-x').trim(), shadow: getComputedStyle(optics).boxShadow, filter: getComputedStyle(optics).backdropFilter, coats: el.querySelectorAll('.fos-glass-optics > div[aria-hidden]').length };
    });
    const trace = [];
    await page.evaluate(() => {
      window.__fosTrace = [];
      const el = document.querySelector('[data-fos-glass-material]');
      const observer = new MutationObserver(() => {
        const s = getComputedStyle(el);
        window.__fosTrace.push({ t: performance.now(), y: parseFloat(s.getPropertyValue('--fos-travel')), tilt: parseFloat(s.getPropertyValue('--fos-tilt')), lightY: s.getPropertyValue('--fos-light-y').trim() });
      });
      observer.observe(el, { attributes: true, attributeFilter: ['style'] });
      window.__stopFosTrace = () => observer.disconnect();
    });
    await page.getByRole('button', { name: 'Сместить линзу ниже' }).click();
    await expect.poll(() => material.evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue('--fos-travel')))).toBe(76);
    await expect(material).toHaveAttribute('data-motion-state', 'settled');
    trace.push(...await page.evaluate(() => { window.__stopFosTrace(); return window.__fosTrace; }));
    const result = { reference, adapted, motion: { frames: trace.length, maxTilt: Math.max(...trace.map(f => Math.abs(f.tilt))), finalY: trace.at(-1)?.y, trace } };
    await fs.writeFile(path.join(folder, 'comparison.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify({ reference: reference.box, adapted, frames: trace.length, maxTilt: result.motion.maxTilt, finalY: result.motion.finalY }, null, 2));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
