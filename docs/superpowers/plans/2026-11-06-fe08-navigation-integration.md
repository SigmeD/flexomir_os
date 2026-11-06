# PR #9 — NavigationDrawer integration

**Goal:** reconcile PR #9 with merged PR #5 and make the existing Manager Orders preview navigable on tablet/mobile.
**Architecture:** one shared `AppShell` composes the unchanged SidebarNav and NavigationDrawer around screen content. The shell owns responsive layout; Manager Orders owns its navigation configuration and filter state. No router, business actions, backend or 1C changes.
**Sources:** Owner's four-step instruction in this session; [CURRENT frontend M0–M9](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit), read 06.11; merged PR #5 / `7372685`; [Drawer contract](../../GL02B_NAVIGATION_DRAWER.md). Figma metadata checked: Primary DS `634:60`, masters `1688:532`, Manager mobile `2495:9097` (72px header). This is component integration, not a recreation of every Figma screen.

## Design and boundaries

- Keep every existing preview route, including `navigation-drawer`, `glass-pill-tabs` and `manager-orders`.
- Desktop >=1024: existing 240px SidebarNav. Tablet/mobile <=1023: sticky 72px brand/role header and the existing menu trigger. Its portal keeps the accepted positioning, material and motion.
- Mount Drawer only at tablet/mobile sizes. Crossing to desktop releases modal inert/scroll lock by normal component cleanup; screen filters and records survive resizing.
- Both presentations use the same Manager items. Only the current Orders page is enabled; selecting it closes the menu. `Клиенты` / `Компании` stays an Owner decision, and unavailable destinations stay disabled.
- Escape, scrim, keyboard focus return/trap, repeated opening and touch use the existing Drawer contract.
- No edits to shared Glass/Nav/Drawer primitives. No fabricated routes or API actions. Screen acceptance remains OPEN.

## Execution (inline, in existing PR #9 branch)

- [x] Resolve `src/App.tsx` conflict with both imports/routes, build and commit merge of main. Preserve pre-existing unstaged files.
- [x] Add failing integration cases in `tests/manager-orders.spec.ts`: tablet menu availability, same-page dismissal, focus/scroll cleanup, 1023/1024 resize, empty/filtered list retention.
- [x] Run a focused case before implementation: `npx playwright test tests/manager-orders.spec.ts --project=chromium-390 --grep "tablet and mobile navigation" --workers=1`. Expect missing menu trigger.
- [x] Create `src/components/layout/AppShell.tsx` and `app-shell.css`; subscribe to the 1023px media query with cleanup, conditionally mount the existing Drawer, compose desktop SidebarNav and content.
- [x] Replace screen-specific sidebar/brand markup with AppShell in `ManagerOrdersScreen.tsx`; retain data props, filters, cards, disabled actions and screen styling.
- [x] Add open-menu captures on T768/M390/M320 and preserve closed-screen D1440/L1024/T768/M390/M320 captures. Extend FE08 CI to run Drawer regression and upload those captures.
- [x] Run build and combined Orders/Drawer/GL03/Sidebar/HeaderAction browser suites. Verify touch, reduced-motion, forced-colors, short landscape, scroll and empty-data behavior; run Firefox/WebKit smoke when available.
- [x] Check primitive byte equality with origin/main, conflict markers, diff whitespace and unchanged pre-existing files. Review the integration diff and actual screenshots.
- [ ] Record fresh results and limitations in an M3 QA report, update local state/handoff without staging pre-existing audit edits, push PR #9 and keep it Draft for Owner visual acceptance.

## Acceptance

At 1440/1024 the desktop navigation is usable, at 768/390/320 the Manager menu opens and dismisses safely. Background controls are isolated only while open. Disabled destinations cannot change the URL or order data; resizing does not reset filters or leave an invisible modal. All original lab routes remain usable. Evidence is fresh and local heavy artifacts remain ignored.
