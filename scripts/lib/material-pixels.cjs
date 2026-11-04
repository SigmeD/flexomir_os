const { PNG } = require('pngjs');

function luminance(image, x, y) {
  x = Math.max(0, Math.min(image.width - 1, Math.round(x)));
  y = Math.max(0, Math.min(image.height - 1, Math.round(y)));
  const index = (y * image.width + x) * 4;
  return image.data[index] * .2126 + image.data[index + 1] * .7152 + image.data[index + 2] * .0722;
}

function lineChroma(image, x, y) {
  const index = (Math.round(y) * image.width + Math.round(x)) * 4;
  // The genuine order separator is blue-gray. Neutral frame shadow is not that feature.
  return Math.max(0, image.data[index + 2] - image.data[index]);
}

function peak(profile) {
  const strongest = profile.reduce((a, b) => a.value > b.value ? a : b);
  const floor = Math.min(...profile.map(p => p.value));
  const local = profile.filter(p => Math.abs(p.position - strongest.position) <= 2);
  const total = local.reduce((sum, p) => sum + Math.max(0, p.value - floor), 0);
  return { position: total ? local.reduce((sum, p) => sum + p.position * Math.max(0, p.value - floor), 0) / total : strongest.position, contrast: strongest.value - floor, profile };
}

function measurePixels(buffer, geometry) {
  const image = PNG.sync.read(buffer);
  const { lens, lineY, text } = geometry;
  const lineProfile = [];
  for (let y = Math.ceil(lens.y + 2); y <= Math.floor(lens.y + lens.height - 2); y++) {
    let darkness = 0, samples = 0;
    for (let x = Math.ceil(lens.x + 60); x <= Math.floor(lens.x + lens.width - 60); x++) { darkness += lineChroma(image, x, y); samples++; }
    lineProfile.push({ position: y, value: darkness / samples });
  }
  const textProfile = [];
  for (let x = Math.floor(text.x - 2); x <= Math.ceil(text.x + 9); x++) {
    let darkness = 0, samples = 0;
    for (let y = Math.ceil(text.y + 3); y <= Math.floor(text.y + text.height - 3); y++) { darkness += 255 - luminance(image, x, y); samples++; }
    textProfile.push({ position: x, value: darkness / samples });
  }
  return { line: peak(lineProfile), dominantTextFeature: peak(textProfile), image: { width: image.width, height: image.height } };
}

module.exports = { measurePixels };
