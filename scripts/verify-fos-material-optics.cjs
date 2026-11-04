const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium, devices, expect } = require('@playwright/test');
const { measurePixels } = require('./lib/material-pixels.cjs');

async function main() {
  const folder = path.resolve('output/playwright/fos-material/optics');
  await fs.mkdir(folder, { recursive: true });
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ userAgent: devices['Desktop Chrome'].userAgent, viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    const frames = [];
    for (const strength of [0, 0.1, 0.6]) {
      await page.goto(`http://127.0.0.1:5173/?view=material&phase=optics&strength=${strength}`);
      const material = page.locator('[data-fos-glass-material]');
      await expect(material).toHaveAttribute('data-material-ready', 'true');
      await expect(material.locator('.fos-glass-optics')).toHaveCSS('width', '300px');
      if (strength) await expect.poll(() => material.locator('.fos-glass-optics').evaluate(el => getComputedStyle(el).backdropFilter)).toContain('url(');
      await page.mouse.move(0, 0);
      const scene = await page.locator('.fos-proof-scene').boundingBox();
      const lens = await material.boundingBox();
      const first = await page.locator('[data-order-id]').first().boundingBox();
      const text = await page.locator('[data-order-id]').nth(1).locator('[data-material-text]').boundingBox();
      const relative = rect => ({ x: rect.x - scene.x, y: rect.y - scene.y, width: rect.width, height: rect.height });
      const geometry = { lens: relative(lens), lineY: first.y + first.height - 1 - scene.y, text: relative(text) };
      const image = await page.locator('.fos-proof-scene').screenshot({ animations: 'disabled' });
      const file = `strength-${String(strength).replace('.', '-')}.png`;
      await fs.writeFile(path.join(folder, file), image);
      frames.push({ strength, file, geometry, pixels: measurePixels(image, geometry), filter: await material.locator('.fos-glass-optics').evaluate(el => getComputedStyle(el).backdropFilter) });
    }
    const baseline = frames[0];
    await page.locator('feDisplacementMap').evaluate(el => el.setAttribute('scale', '0'));
    const nativeZeroImage = await page.locator('.fos-proof-scene').screenshot({ animations: 'disabled' });
    await fs.writeFile(path.join(folder, 'native-scale-zero.png'), nativeZeroImage);
    const nativeZero = measurePixels(nativeZeroImage, frames[2].geometry);
    const shifts = frames.slice(1).map(frame => ({ strength: frame.strength,
      linePx: frame.pixels.line.contrast > 5 ? frame.pixels.line.position - baseline.pixels.line.position : null,
      textPx: frame.pixels.dominantTextFeature.contrast > 15 ? frame.pixels.dominantTextFeature.position - baseline.pixels.dominantTextFeature.position : null,
    }));
    const isolatedSvgShift = {
      linePx: frames[2].pixels.line.position - nativeZero.line.position,
      textPx: frames[2].pixels.dominantTextFeature.position - nativeZero.dominantTextFeature.position,
    };
    for (const frame of frames) assert.deepEqual(frame.geometry, baseline.geometry, 'DOM geometry must stay unchanged');
    assert.equal(errors.length, 0, 'Application console must stay clean');
    assert.ok(frames[2].pixels.line.contrast > 10 && frames[2].pixels.dominantTextFeature.contrast > 15, 'Both measured features must be visible');
    assert.ok(Math.abs(isolatedSvgShift.linePx) >= .5, 'Actual order line must move, not only frame/shadow');
    assert.ok(Math.abs(isolatedSvgShift.textPx) >= 1, 'Dominant text feature must change near the rim (not a matched-stroke distance)');
    const result = { opticsGate: 'PASS', browser: browser.version(), errors, frames, shifts, nativeZero, isolatedSvgShift,
      qualification: 'linePx tracks the genuine blue-gray row separator. textPx is a dominant local feature shift, not correspondence of an identical glyph stroke.' };
    await fs.writeFile(path.join(folder, 'metrics.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify({ folder, errors, shifts, isolatedSvgShift, features: frames.map(frame => ({ strength: frame.strength, line: frame.pixels.line.position, text: frame.pixels.dominantTextFeature.position, lineContrast: frame.pixels.line.contrast, textContrast: frame.pixels.dominantTextFeature.contrast })) }, null, 2));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
