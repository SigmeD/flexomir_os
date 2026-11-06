# FE-08 / Manager Orders — M2 technical QA report

**Historical M2 snapshot:** the mobile-navigation gap and PR #5 merge status below are superseded by [M3 integration QA](FE08_MANAGER_ORDERS_M3_QA_2026-11-06.md). The earlier test results remain evidence for their original revision.

**Date:** 2026-11-06  
**Scope:** React frontend only; product screen and visual QA are separate gates.  
**Execution plan:** [Drive 09 Frontend CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit).  
**PR:** [#9 Manager Orders](https://github.com/SigmeD/flexomir_os/pull/9) (DRAFT, NOT MERGED).

## Implemented in current M2 increment

- Separated the screen from demo fixtures: `ManagerOrdersScreen` accepts `orders: readonly OrderListItem[]` as React props; preview `App.tsx` supplies synthetic fixtures.
- Frontend-only presentation model `src/screens/manager-orders/model.ts` contains `OrderListItem`, UI filter IDs and approved label **«В работе»**. It is **not** an API or 1C status contract.
- `OrderCard`, `OrdersList` and `GlassPillTabs` are unchanged in business behavior. Accepted `FosGlassMaterial`, `SidebarNav`, `HeaderAction` code and optics unchanged.
- Added Playwright checks for injected empty source, UI counts, responsive overflow, and five screenshot captures to Actions artifacts.

## Independent CI evidence

- [FE-08 screen CI run 42191366761](https://github.com/SigmeD/flexomir_os/actions/runs/42191366761): **SUCCESS**.
- `npm run build` — **PASS** (TypeScript and Vite).
- Combined FE-08 + GL-03 + SidebarNav + HeaderAction Chromium Playwright — **80 / 80 PASS**, desktop 1440 and mobile 390 configurations.
- Cross-width test and PNG capture on **1440 / 1024 / 768 / 390 / 320**.
- Screenshot ZIP: `fe08-manager-orders-screen-captures` in run artifacts; generated for Owner review. Capturing images is **not** proof of visual acceptance.

## Code review findings and impacts

1. **FIXED — demo data dependency.** Screen no longer imports 1C-like fixture records. Display labels and filter membership are supplied by a typed view model. No frontend backend implementation.
2. **OPEN — mobile/tablet navigation.** Sidebar is hidden below 901px; NavigationDrawer exists only in separate [PR #5](https://github.com/SigmeD/flexomir_os/pull/5), still Owner/merge open. Do not merge a fake replacement into M2; this is the M3 dependency.
3. **OPEN — product semantics.** Manager `Новые / Все` queue, detail routes, status mapping and allowed actions require signed frontend UX and backend/PO contracts. No speculative actions or server states.
4. **OPEN — nomenclature.** Manager nav label `Клиенты` vs section `Компании` is a known Figma/Owner terminology gap. Do not rename silently.
5. **OPEN — visual acceptance.** React mock screen is not asserted pixel-perfect to Figma or release-ready. Owner must review screenshots and functioning screen; visual regressions and device QA remain gates.
6. **OPEN — browser/device coverage.** Chromium automated only; no successful claims for Firefox, WebKit or real hardware.
7. **OPEN — public repository.** Only synthetic fixtures, no client secrets or real production data.

## Next approved work, in order

1. Owner visual/product review on PR #9 with D1440/L1024/T768/M390/M320 PNG evidence and a runnable preview; record specific corrections.
2. Once M2 screen is accepted, review NavigationDrawer [PR #5](https://github.com/SigmeD/flexomir_os/pull/5) against shared UI and merge only after Owner gate; wire a legitimate responsive AppShell.
3. Continue M4 Manager Orders module by reusable React components (search, company filter, sort, cards/detail and state-handling) **on approved fixtures and UX**; backend API/1C design and implementation are **Alexey's responsibility**.
4. Update [canonical Drive plan](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit) and `docs/PROJECT_STATE.md` only after verified status changes.

**Decision gate:** CODE_DONE / QA_PASS, but **OWNER_SCREEN_OPEN / NOT_MERGED / NOT_RELEASED**.
