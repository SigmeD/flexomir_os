# Glass Select implementation plan

**Goal:** Replace only the experimental order-status filter with Website Glass Select in the existing Vite React app. Trial integration; visual approval remains open.

**Architecture:** Keep `statuses`, `orders`, the controlled `status` state and the existing `useMemo` filtering expression. Use the official GlassSelect, GlassSelectTrigger, GlassSelectContent and GlassSelectItem exports. Remove the old dropdown wrapper, matte overlay, moving selection and lab settings; use the library's defaults without modifying its source, appearance or animations.

**Stack:** Existing React 19, TypeScript, Vite 6, Tailwind 4; registry-managed Website Glass files.

- [x] Read the supplied audit, current application and official component documentation; confirm `@/*` resolves to `src/*`.
- [x] Attempt the requested registry installation. Result: npm offline cache miss; installation requested in the user's ordinary PowerShell. Never substitute a locally invented component.
- [x] Inspect the installed `src/components/ui/glass-select.tsx`, its imports and package dependencies. User installed the registry item; all imports resolve, no extra npm dependency is required; `tsc -b` passes.
- [x] Replace the control in `src/App.tsx`; preserve order data and filtering. Remove only obsolete experimental filter CSS in `src/styles.css`.
- [x] Update the existing `tests/filter.spec.ts` to verify all five choices, dismissal and keyboard interaction, console errors and the real DOM behind the popup.
- [x] Run `npm run build` and `npm run test:e2e`. After restrictions were lifted: build PASS; Chromium tests 6 PASS / 2 FAIL (arrow-key selection).
- [x] Open Chromium with Playwright, capture an open list in `output/playwright/glass-select/`, and inspect it for readability and overlap. White text is almost unreadable on the light background; popup fits both viewports.
- [x] Update README and the audit with actual results, local URL and remaining limitations. Documentation review: 2026-11-03; next: 2026-11-17.

Initial environment evidence: `npm run build` and `npm run dev` both fail while starting esbuild with `spawn EPERM`, before any application edit. No local page or screenshot exists yet.

Verification after the integration edit: build stops at missing registry module (`TS2307`); existing test runner detects four tests but cannot launch its worker (`spawn EPERM`). Playwright CLI also cannot launch its daemon (`spawn EPERM`), including when its working data is stored inside the workspace. Static comparison confirms original status choices, order data and filtering expression are unchanged. Both changed TypeScript files parse without syntax errors. This does not complete runtime verification.

After the user installed Glass Select: `tsc -b` exits 0 and npm dependency inspection passes. Build, dev server, e2e and Chromium CLI remain blocked by subprocess `spawn EPERM`. Popup tests now check the library's opacity/pointer-events closing behavior instead of incorrectly expecting DOM removal. Static source review finds no arrow-key navigation, closed options remaining tabbable, white text on the light host page, and frosted GlassSurface rather than displacement refraction. Library source is unchanged; visual/keyboard acceptance remains open.

Final runtime update after the environment was unlocked: local server is running at http://127.0.0.1:5173/ (HTTP 200), production build passes. Eight Chromium tests ran: six pass, two fail because ArrowDown does not select the next status. Real desktop/mobile screenshots were captured and inspected; low contrast is confirmed. The original console favicon 404 was removed with an empty favicon data URI. The registry component remains unchanged. See [verification report](../../glass-select-check.md). Trial integration is presented for visual review; approval remains OPEN.
