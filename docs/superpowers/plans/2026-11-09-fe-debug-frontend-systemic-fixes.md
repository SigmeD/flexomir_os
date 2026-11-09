# FE-DEBUG-2026-11-09 Frontend Systemic Fixes Implementation Plan

> **For agentic workers:** Execute inline in the existing project branch; project policy requires one branch and one PR for this increment. Keep steps checked as evidence is produced.

**Goal:** Correct confirmed React frontend defects across the shared AppShell, demo order navigation, and popup surfaces while preserving unresolved production contracts as open.

**Architecture:** Fix shared layout and navigation owners first, then the ephemeral demo order state transitions, then shared popup surface presentation. Reuse AppShell, SidebarNav, AccountMenu, NavigationDrawer, OverflowMenu, `FosGlassMaterial`, and ConfirmDialog. Keep base order fixtures read-only; scope any delete/save behavior to the in-memory demo drafts explicitly created by the current session.

**Tech Stack:** React 19, TypeScript, Vite, CSS, Radix UI, Playwright.

---

## Confirmed inputs and disposition

- The numbered user screenshots `1.png`–`12.png` and six supplied Bandicam recordings were opened. Videos were sampled at approximately 1s and 65% duration; the captured recordings show a persistent application loading spinner in several flows. The screenshots remain external source evidence and are not copied into Git.
- Read-only Figma context: Primary DS/FOS AppShell `637:180`; desktop brand at y=20, Primary Navigation at y=100 in the 240px pane; existing Sidebar Account Footer `3123:1214`; selected navigation reuses one Adaptive GlassLens `1578:453`; tablet/mobile header is 72px. No Figma edits.
- The supplied image that shows a company line beneath the brand conflicts with the newer 08.11 CURRENT Owner direction in the UX index: remove company identity from the Sidebar and show it in Account Menu identity. Follow the CURRENT decision and the `637:180` shell; do not restore the company line to solve FE-02.
- FE-02: confirmed structural gap. React renders `SidebarNav` immediately after the 28px brand line; CURRENT Figma positions navigation 52px below that line.
- FE-03: confirmed `presentationMode` and `demoTools` controls were normal-flow siblings before `CabinetNavigation`; after moving them to a fixed layer, the QA panel still intercepted the primary Add action. Keep the utility collapsed by default, with QA reset inside the expanded demo panel. It does not affect cabinet geometry and remains DEV-only.
- FE-04: confirmed aside `min-height:850px` can move the account footer below a short viewport. Make only the desktop sidebar navigation list the scroll region; keep footer pinned to the visible shell height.
- FE-01: confirmed item editor has local unsaved `value`, while shell navigation currently changes sections without a dirty-item decision. Guard navigation out of the editor; “Да” commits the current valid item into the in-memory order draft before leaving, “Нет” leaves the editor without committing that item, and closing the dialog stays on the editor. The layout-picker transition is internal and keeps the same item state. Production partial-save/atomicity/idempotency remain open.
- FE-05: implement delete only for an explicit current-session `DemoDraft`, using the existing confirmation-dialog lifecycle. Base Client/Manager fixture records remain untouched. Production permissions, hard/soft delete, retention, and concurrency remain open.
- FE-06: confirmed mismatch on reopening a draft: list row uses `Заказ <id>`, while the existing Composer hardcoded `Новый заказ`. Keep `Новый заказ` only for the immediate create flow; reopening a session draft now uses `Заказ <id>` from that same draft record.
- FE-07: current documents explicitly say FE-S01/base fixtures are read-only and the Composer edits only drafts created in the current FE-S02 demo session. Do not enable product editing on `DEMO-001` without an approved editability/ownership/transfer contract; report the screenshot as a contract conflict if it expects otherwise.
- FE-10: NOT_REPRODUCED. On the current baseline, selecting the already-active Manager `Заказы` row after opening `DEMO-001` returns to the list and closes the drawer. No source change without a failing reproduction.
- FE-08/09/11: Account footer now reuses `FosGlassMaterial` for its approved hover/focus/press state; Sidebar travel tests already exercise the accepted spring. CURRENT Figma distinguishes the frosted Drawer from the white More menu; GlassSelect already uses `FosGlassMaterial`. Do not collapse independent masters into one visual treatment. Record any remaining surface mismatch as an Owner decision if no shared approved appearance exists.

## Task 1 — Reproduce and test shared AppShell geometry (FE-02/03/04)

**Files:** `tests/fe-debug-shell.spec.ts`; `src/components/layout/AppShell.tsx`; `src/components/layout/app-shell.css`; `src/demo/OrderDemoWorkspace.tsx`; `src/components/orders/order-compose.css`.

- [x] Add Playwright assertions for desktop brand/nav top coordinates (nav top 100px from shell top per Figma), footer within the viewport at short heights, and nav-only scrolling when content exceeds available height.
- [x] Add demo presentation toggle tests proving AppShell/Header/Sidebar/content/profile bounding boxes are unchanged when shown/hidden; check keyboard hide/reopen, focus return, no obscured account or work actions, 320/390/768/1024/1440 widths, and a 600px-tall viewport.
- [x] Run the focused suite and capture expected failures before implementation: `npx playwright test tests/fe-debug-shell.spec.ts --workers=1`.
- [x] Fix shared layout source: give Sidebar navigation its Figma top position; size aside from the dynamic viewport, allow only nav content to scroll, pin account footer; render DEV demo controls as a standalone fixed overlay outside layout flow and collapse them by default.
- [x] Re-run focused suite and inspect desktop/mobile/short-height screenshots. Responsive shell/utility suite passed in the final Chromium regression.

## Task 2 — Guard dirty item exit and delete only session drafts (FE-01/05)

**Files:** `tests/fe-debug-order-transitions.spec.ts`; `src/components/orders/OrderItemForm.tsx`; `src/components/orders/OrderComposer.tsx`; `src/components/orders/ClientOrdersScreen.tsx`; `src/demo/OrderDemoWorkspace.tsx`; `src/components/ui/confirm-dialog.tsx` only if its existing public contract cannot support required focus/close behavior.

- [x] Test dirty New Item → enabled navigation destination opens confirmation; “Нет” discards only unsaved item edits and navigates, “Да” saves a valid item once then navigates, close/Escape keeps the editor open, invalid item cannot be committed, and My Layouts picker retains parent draft/context.
- [x] Test More deletion for a session-created draft: cancellation keeps it; confirmation removes only that draft and returns to its list; base fixtures remain present. No server delete/error contract is invented.
- [x] Focused tests were run against the pre-fix branch and failed for missing dirty guard/delete path and shell spacing/overlay behavior.
- [x] Add explicit editor-leave transition through existing CabinetNavigation and an exact-once commit/discard callback. Reuse ConfirmDialog. Constrain `deleteDraft(id, ownerRole)` to current session drafts in `stage === 'draft'`.
- [x] Re-run focused tests and relevant existing Composer/Orders checks in both configured Chromium projects; Firefox/WebKit projects are not present in this repository config.

## Task 3 — Correct active Manager Orders Drawer selection (FE-10)

**Files:** `tests/fe-debug-navigation.spec.ts`; `src/components/ui/navigation-drawer.tsx`; `src/components/layout/AppShell.tsx`; `src/screens/manager-orders/ManagerOrdersScreen.tsx` only if the actual route owner requires the callback.

- [x] Add mobile 390 regression: open Manager detail, select active `Заказы`, expect the list and closed Drawer.
- [x] Reproduction passed on existing implementation; FE-10 remains `NOT_REPRODUCED`, no routing change.
- [ ] Expand existing Manager navigation tests to 320/768 and browser Back/Forward if a failing case is supplied.

## Task 4 — Audit and align popup surfaces (FE-08/09/11)

**Files:** `tests/fe-debug-overlays.spec.ts`; `src/components/layout/AccountMenu.tsx`; `src/components/layout/account-menu.css`; `src/components/ui/navigation-drawer.tsx`; `src/components/ui/navigation-drawer.css`; `src/components/ui/overflow-menu.tsx`; `src/components/ui/overflow-menu.css`; `src/components/ui/glass-select.tsx`; `src/components/ui/glass-select.css`; a new shared surface file only if the audit proves it serves at least three consumers.

- [x] Inventory recorded below: AccountMenu and More use Radix portals and white surfaces; NavigationDrawer uses a distinct neutral 72%/blur20 overlay plus one SidebarNav lens; GlassSelect already uses `FosGlassMaterial`. ConfirmDialog remains its own modal lifecycle.
- [x] Add regression coverage for Account footer Glass hover/focus/press and unchanged geometry, More surface and keyboard Escape/focus, reduced motion, touch, and GL03 unchanged. Drawer and Sidebar baseline suites also pass.
- [x] Run tests first and retain no-change status for already-correct consumers.
- [x] Account footer hover/focus/press now uses `FosGlassMaterial` without row geometry or font-size changes. Sidebar spring and GL03 remain unchanged; existing motion suites provide the baseline.
- [ ] Popup surface consolidation is `BLOCKED_DECISION`: current Figma masters explicitly specify different popup treatments. Await an approved shared appearance before migrating the Drawer or white More menu.

## Task 5 — FE-06/FE-07 status and evidence

**Files:** `tests/fe-debug-order-transitions.spec.ts` only if an exact runtime defect is established; `docs/DECISIONS.md`; `docs/COMPONENT_REGISTRY_2026-11-06.md`.

- [x] Reproduced FE-06 for existing drafts; new Composer keeps `Новый заказ`, reopening uses `Заказ <id>` from the same record.
- [x] Reproduced FE-07: `DEMO-001` is a base FE-S01 fixture and explicitly read-only; changing this requires approved PO/Owner/API editability contract.

## Task 6 — Cross-screen verification and LIVE documentation

**Files:** `docs/PROJECT_STATE.md`; `docs/DELIVERY_PLAN.md`; `docs/COMPONENT_REGISTRY_2026-11-06.md`; `docs/HANDOFF.md`; `docs/DECISIONS.md`; `docs/SOURCES.md`; new tests listed above; `.github/workflows/**` only if the existing CI workflow misses changed paths.

- [x] Run `npm run build`, changed Playwright suites and existing Orders/Profile/Manager/M7 regressions. Full configured run: 404 passed, 16 stale assumptions identified, 2 expected touch-only skips; corrected affected set: 88/88 passed across Chromium 1440/390. Firefox/WebKit are not configured. Screenshots remain in ignored `test-results/`.
- [x] Capture and inspect the supplied references against CURRENT Figma plus desktop/mobile/short-height browser states; check a11y, keyboard/focus, reduced motion, navigation, 0/1/N and demo/production boundary. Owner visual acceptance remains OPEN.
- [x] Update LIVE docs with FE-01…FE-11 status, causes, commands/results and open Owner/backend questions. SRS, Scope, API, Figma and product rules were not changed.
- [x] Run `git diff --check` and review staged/unstaged status without touching user PNGs. PR creation, Owner acceptance and merge remain open.

## Popup audit disposition

| Consumer | Current React material / lifecycle | CURRENT reference / decision |
| --- | --- | --- |
| `AccountMenu` sidebar footer | Radix DropdownMenu portal; approved footer trigger uses one `FosGlassMaterial` on hover/focus/press; account popover remains white | Figma `3123:1214` mandates the existing Sidebar lens on footer; Account Menu `3038:2667` remains a separate menu contract |
| `NavigationDrawer` | Existing portal, focus trap, body lock, close/settle logic; neutral translucent white 72%, blur20; one `SidebarNav` adaptive moving lens | FOS Drawer masters `1962:3834/3854`; keep its specific material |
| `OverflowMenu` | Radix DropdownMenu portal; white 248px menu and shared keyboard/focus lifecycle | CURRENT FOS menu `1914:655..676` specifies white surface; destructive actions require confirmation |
| `GlassSelect` | Custom portalled listbox and lifecycle; already wraps content in `FosGlassMaterial` | Keep select-specific geometry/behavior |

These approved consumers have different masters and behaviors. FE-11 cannot safely impose one surface style from supplied video/screenshots alone. Confirm whether Owner wants a new shared visual master or the current Figma-specific treatments; do not change menu geometry or motion speculatively.
