# FosGlassMaterial implementation plan

**Goal:** One reusable adapter of the installed Website Glass over live HTML, calibrated against supplied Sidebar2.2.5 and button2.1.5, without another optical engine.

**Architecture:** `src/components/ui/fos-glass-material.tsx` wraps native GlassLens once, measures its box, offers a sharp foreground slot, and owns shared material CSS/tokens. True zero uses its supported CSS style override to omit the URL filter while retaining the same rest of the optical pipeline. Reference motion uses native Track/spring. Browser/forced-color fallback is explicit. A separate `?view=material` renders only HTML orders and one lens, never a Select. Existing filtering data are passed from App unchanged.

**Reference findings and source hashes:** `docs/fos-glass-material.md`.

- [x] Inspect supplied2.2.5/2.1.5 and earlier2.1.4; inventory ZIPs; separate background renderer from reusable material/motion parameters.
- [x] Inspect Glass/GlassLens/GlassSurface and glass-motion; record true-zero, band coupling and pressure-SDF limits.
- [x] Write and run failing standalone material tests; add separate material test config with Chromium, Firefox and WebKit.
- [x] Implement only the minimal adapter and standalone optics phase over real existing orders.
- [x] Measure line/text pixel positions for strength0 and positive strengths; prove DOM rects unchanged, only one active native lens, no synthetic scene/Canvas element. Save original screenshots and metrics.
- [x] Only after optics passes: add common shape/light/center/rim/shadow tokens from2.2.5, native spring travel/tilt, reduced-motion behavior. Do not port the button shader.
- [x] Compare static and motion states with the actual supplied HTML reference; report approximation/unsupported behavior honestly.
- [x] Check Firefox/WebKit fallback, keyboard/contrast, reduced-motion and resizing.
- [x] Only after standalone material passes: replace inline Select optics with this same adapter; retain selection mechanics and all current/matte previews.
- [x] Run existing regression suite and necessary new visual references, production build, independent review and documentation/link checks. Keep the local demo running.

No Figma changes, approved button/sidebar edits, worktree, synthetic grid, generated backdrop image or alternative renderer. This folder is not a Git repository. User requested execution of this staged plan; no additional plan approval is required.

Final evidence: Select38 passed; material30 passed/2 browser-specific forced-color skips; optics/build PASS. Owner visual acceptance OPEN. Results: docs/fos-glass-material.md.
