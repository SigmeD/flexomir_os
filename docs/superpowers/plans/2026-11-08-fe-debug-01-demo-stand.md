# FE-DEBUG-01 Demonstration Stand Implementation Plan

> **For agentic workers:** Inline execution in the existing `feat/frontend-qa-debug-cycle` branch, following issue #23. Do not create another branch/PR, change backend/API/1C/ACL, or merge.

**Goal:** Make `/` open the real Client Orders cabinet by default, add a clear same-session Client/Manager presentation switch, and keep technical labs available only through explicit query routes.

**Architecture:** Keep `OrderDemoWorkspace` as the single state owner for both cabinets. Resolve explicit screen and lab queries in `AppViews`; only the root/unknown-view presentation gets the demonstration role switch, while `demoTools=1` keeps QA reset controls separate. Reuse shared `FOSAction` and current AppShell; do not alter cabinet visual systems or add a router.

**Tech Stack:** React 19, TypeScript, Vite, Playwright Test, existing FOS controls and AppShell.

---

## File map

- Modify `src/App.tsx`: explicit route classification; root/unknown-view fallback; `glass-filter-lab` route.
- Modify `src/demo/OrderDemoWorkspace.tsx`: presentation role controls, separated QA controls, same-workspace switching and manager-editor lock reporting.
- Modify `src/components/orders/order-compose.css`: responsive presentation/technical panels only.
- Modify `src/screens/manager-orders/ManagerOrdersScreen.tsx`: report private-draft editor visibility to the workspace guard.
- Add `tests/demo-entry.spec.ts`: root entry, unknown views, lab isolation, legacy route/fixture coverage.
- Add `tests/demo-presentation.spec.ts`: same-instance role switch, full order journey, dirty-editor blocking for both roles, responsive/a11y states.
- Update `README.md`, `docs/PROJECT_STATE.md`, `docs/DELIVERY_PLAN.md`, `docs/HANDOFF.md`, `docs/SCREEN_MAP_M4_2026-11-06.md`, `docs/COMPONENT_REGISTRY_2026-11-06.md`, and canonical Drive CURRENT.

## Task 1 — Lock down route behavior

- [ ] Add Playwright cases for `/` -> Client My Orders; explicit `?view=glass-filter-lab` -> legacy filter lab; all existing known query views remain mapped to their current screen; unknown `view` -> Client workspace with a diagnostic status and no GlassFilterDemo.
- [ ] Assert fixtures remain distinct: `fixture=empty`, `layout-error`, `support-error`, and `imported-1c` are still honored on their existing direct views.
- [ ] Run only the new route tests and confirm they fail on the current legacy fallback before implementation.
- [ ] Implement a fixed allowlist in `AppViews`; keep `material`, `sidebar-nav`, `glass-pill-tabs`, `navigation-drawer`, `orders-components`, `header-action`, `auth`, and all current cabinet routes. Route the old `GlassFilterDemo` only from `glass-filter-lab`.

## Task 2 — Add presentation controls without duplicating the workspace

- [ ] Add a `presentationMode` prop to `OrderDemoWorkspace`; render a labelled `Демонстрация` strip with synthetic-data/reload note and two accessible FOSAction buttons with `aria-pressed` state.
- [ ] Keep technical `demoTools=1` actions in their own labelled panel; leave reset available there, not mixed into the presentation strip. Preserve existing direct QA role buttons if existing tests depend on their names.
- [ ] Confirm clicking either presentation role control changes `currentRole` in the mounted workspace, retains sent drafts/processing state, and never changes the URL or reloads the page.
- [ ] On a selected Client draft or Manager private draft, disable both role controls and QA reset; report a short status explaining that the draft must be saved and the editor closed first.
- [ ] Reuse current `FOSAction` and `order-compose.css`; ensure the panel wraps/stacks at 1440/1024/768/390/320 and does not cover AppShell or the mobile Drawer.

## Task 3 — Prove the demonstration journey

- [ ] Add one end-to-end test starting at `/`: create a Client order and Item, submit to Manager, open it from New, set demo processing success, switch back, and verify the Client sees the same order and result.
- [ ] Add lock tests for Client and Manager draft editors; verify role switch/reset disabled until return to the relevant list and then enabled.
- [ ] Test keyboard activation, visible focus, `aria-pressed`, touch viewport, and `document.documentElement.scrollWidth <= innerWidth` at all five widths.
- [ ] Run these tests in Chromium before expanding the suite.

## Task 4 — Complete entry routing and regression

- [ ] Run existing direct-route suites for Orders, Companies, Layouts, Support, AuthCandidate and all technical labs; fix only regressions caused by route resolution or presentation controls.
- [ ] Run build/TypeScript and the connected Playwright suites in Chromium, Firefox and WebKit. Capture screenshots for `/` at D1440/T768/M390; test horizontal overflow and overlap at D1440/L1024/T768/M390/M320.
- [ ] Check keyboard, focus, Drawer/Escape/touch, reduced-motion and axe states. Keep all existing fixtures and URL contracts functional.

## Task 5 — Ship one PR with LIVE status

- [ ] Update README and existing CURRENT sections in Project State, Delivery Plan, Screen Map, Component Registry and Handoff; record the route contract, panel role, QA results, unresolved Owner UI review and exact PR/head/CI status.
- [ ] Update the existing canonical Drive CURRENT in place; read it back to verify the status and evidence.
- [ ] Run `git diff --check`, commit to `feat/frontend-qa-debug-cycle`, push to its existing PR, and verify final-head CI and PR state. Keep merge undone.

## Acceptance criteria

Root `/` shows Client «Мои заказы» with no technical laboratory UI. A visible, accessible presentation switch changes Client/Manager within the same workspace instance and preserves the Client→Manager→Client order journey. Existing direct screens, technical labs, and fixtures still work. Unknown screen queries fall back to Client with a diagnostic message. Switching/reset cannot discard an open Client or Manager draft. No backend/API/1C/ACL, new package, Figma change, or merge.
