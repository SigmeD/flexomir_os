import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'

test('FE11-v0.2 approved coverage formula and material engine remain frozen', () => {
  const manifest = JSON.parse(readFileSync('docs/FE11_MOTION_FROZEN_V0_2.json', 'utf8'))
  const shared = readFileSync('src/components/ui/fos-popup-rows.tsx', 'utf8').replaceAll('\r\n', '\n')
  const frame = (source: string) => source.slice(source.indexOf('  const frame = useCallback'), source.indexOf('  useLayoutEffect', source.indexOf('  const frame = useCallback')))
  const hash = (value: string | Buffer) => createHash('sha256').update(value).digest('hex')
  expect(hash(frame(shared))).toBe(manifest.approved_frame_sha256)
  const optics = (source: string) => source.match(/radius=\{14\}[\s\S]*?onTravelFrame=\{frame\}/)?.[0]
  expect(hash(optics(shared)!)).toBe(manifest.approved_optics_jsx_sha256)
  for (const [file, expected] of Object.entries(manifest.normalized_engine_sha256)) {
    // Normalize CRLF: checkout conversion is not a change to the frozen engine.
    expect(hash(readFileSync(file, 'utf8').replaceAll('\r\n', '\n')).toUpperCase(), file).toBe(expected)
  }
})
