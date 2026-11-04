# Glass Select theme and accessibility implementation plan

**Goal:** Make the existing Website Glass Select readable in Flexomir's light theme, including its body portal, with measured contrast, visible focus and automated accessibility/visual regression checks. Keep order filtering and unrelated components unchanged.

**Diagnosis:** Chromium CDP evidence in `output/playwright/glass-select-theme/before/devtools.json` shows the trigger's final color is `rgb(255,255,255)`, with white/5% background and white/12% border. Items use white/80%. These explicit Tailwind classes override the host's inherited `#244356`. The root has no explicit theme (`color-scheme: normal`); GlassSurface uses the OS preference independently of the fixed light host. Popup is portaled into body; container-only tokens cannot reach it. CSS is loading correctly; no opacity bug is responsible for the open panel.

**Architecture:** Add Select-specific semantic CSS variables at the document root and consume them in the shared Select parts, replacing the hardcoded dark-demo colors. Explicitly mark this existing light page with `data-theme="light"`; Website Glass observes this. Support the same explicit root light/dark classes/data attribute and system fallback. The user subsequently requested visible transparency, lens refraction and frosted blur, with Website Glass's screenshot as material reference. Stock Select uses GlassSurface without displacement, so render its popup through one ready-made `Glass` from the same installed library: strength 0.62, blur 3, dome 0.08, radius 16, original tint prop. Keep this library engine unmodified. Sharp foreground sits above its optical layers; a theme-colored reading core leaves 8–12px clear side rims. Scroll only the inner viewport so the native rim shadow remains visible. Preserve original popup transitions and the public Select API. No custom engine, synthetic scene or extra optical layer.

**Scope:** `glass-select.tsx`, its new scoped CSS, the root theme attribute, Select accessibility labels, Playwright tests/config and test dependencies. Do not edit `glass.tsx`, order data, filtering expression or styles of other controls. Accessibility fixes stay inside the shared Select: named listbox/trigger, closed panel inert and hidden from assistive technology, visible focus, and standard arrow-key selection with focus restoration. Pointer choice, controlled values, outside dismissal and transitions remain.

## Tasks

- [x] Capture before screenshots, computed styles, matched CSS selectors/sources and portal layers through Chromium DevTools Protocol using `node scripts/inspect-glass-select.cjs before`.
- [x] Verify current Playwright and axe APIs through Context7. Install `@axe-core/playwright` as a dev dependency.
- [x] Add failing tests for light closed/open axe scans, text/placeholder/selected-state contrast ≥4.5:1, focus visibility, root/portal theme consistency and closed-panel accessibility. Preserve existing filtering and keyboard tests.
- [x] Run the new tests against the original component and save the failing evidence before implementation. All 5 initial tests failed; axe measured 1.02:1. Later consumer-handler/overflow and absent-lens regressions were also reproduced before fixing them.
- [x] Implement shared Select palette and the root theme contract. Check neutral, hover, focus, selected and dark-theme states without per-item overrides.
- [x] Run functionality, axe and explicit contrast tests in Chromium at 1440×900 and 390×844, with explicit light theme under both OS preferences and explicit dark component theme. Final 38/38 pass.
- [x] Inspect actual closed/open screenshots and save references. Final comparisons passed without updates; 14 references cover current light/dark/focus and matte previews.
- [x] Verify screenshot regression checks detect a deliberate color regression in an isolated test browser context, without mutating the live application's CSS.
- [x] Run production build and CDP capture after implementation; compare unchanged host controls and order logic. Build passes; original styles/engine hashes unchanged.
- [x] Request an independent code review with the exact requirements and evidence; address relevant findings. Consumer events/labels, overflowing focus and the DevTools browser profile were corrected and verified; final matte addition has no must-fix review findings.
- [x] Update the main documentation/report with cause, changed files, commands, measured ratios, axe scope and remaining limitations. Localhost is running.

**Validation boundaries:** Axe scans include only the Select trigger/group and portaled listbox; unrelated page text is outside this task and is not restyled. No color-contrast rule is disabled. Report incomplete contrast checks rather than treating them as passes, and supplement translucent surfaces with explicit contrast calculations and visual inspection. Snapshot baselines are reviewed artifacts, never generated from the broken initial version as an acceptance result.

Material verification must compare actual Chromium screenshots with native displacement enabled/zeroed and native blur enabled/removed over the same real order rows. Assert that the image pixels change, that exactly one SVG displacement filter is used, that no Canvas element or diagnostic backdrop is added to the page, and that the foreground is above the optics. The unchanged native Glass implementation internally uses Canvas only to build its displacement map; it never paints a replacement background.

Documentation review: 2026-11-03; next review: 2026-11-17. User has requested planning and implementation in this session; no additional design approval is needed.

## Final comparison request

The user then requested a calm matte 97% comparison instead of adopting the expressive lens everywhere. Added an opt-in shared `appearance="matte"` parameter, selected only by `?glass=matte` in the existing page; default remains `current`. Native Glass params are strength0.08, blur10, dome0, with the existing tint contract. Shared theme uses a uniform #F9FBFC/97% reading surface and trigger, a thin outline and only the native one soft outer shadow. No engine rewrite, per-item styles or changes to other components. The new two-viewport test was first observed failing on transparent background, then passed for actual 97% computed color, one shadow, contrast, axe and filtering. Four matte PNG references were inspected and compared in the final 38-test run. User visual approval/default adoption remain pending by design.
