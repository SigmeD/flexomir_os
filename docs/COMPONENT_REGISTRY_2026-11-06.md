# Flexomir OS — React Component Registry

**Date:** 2026-11-06  
**Scope:** frontend React, Client/Manager.  
**Decision (Owner):** Figma maintains visual design-system references, **not a requirement to implement every Figma frame as an individual React screen**. Compose screens from shared React primitives and reusable domain components. Existing UX frames may inform scenarios and state coverage but do not override accepted shared React Glass.

## Source of truth and constraints

**FE-S01 / A, рабочая ветка:** ClientOrdersScreen (`src/screens/client-orders/ClientOrdersScreen.tsx`) подключает неизменённые AppShell/Drawer/GL-03/HeaderAction и существующий OrderCard. Общий OrdersList (`src/components/orders/OrdersList.tsx`, props `orders/total/idPrefix`), `order-model.ts` и `orders-page.css` используются обеими ролями. Прежние Manager entrypoints переэкспортируют shared слой; все синтетические записи — `src/demo/order-fixtures.ts`. Build + Client/Manager 38/38 PASS; экранная Owner-приёмка OPEN. Деталь заказа — блок B, ещё не реализована. Ниже — состояние исходного main до этого инкремента.

**M4 audit / 06.11.2026:** unique React screen inventory and first reusable-component consumers confirmed in [M4 screen map](SCREEN_MAP_M4_2026-11-06.md). No new React components were added by this audit. `Client AppShell` composition, Client Orders and OrderDetail are still NOT implemented. Next: FE-S01 (#12), block A Client list/shell then block B shared read-only OrderDetail/OrderItemSummary for Client + Manager, in one feature branch/React PR with LIVE docs. New/Repeat, Manager processing, Support/Companies follow in separate increments. Source-of-truth Figma/Scope boundaries remain mandatory.

**CURRENT / 06.11.2026:** Реестр — LIVE: при новом/изменённом React-компоненте укажи тип, потребителей Client/Manager, файл, props/state, QA, Owner gate и использующий экран. Обнови в том же PR, потом синхронизируй с Drive. Не создавай компоненты ради количества Figma-фреймов.

- CURRENT Drive UX/UI index, Frontend Startup and Requirements SRS v0.5 (modified 04.11).
- Repository `SigmeD/flexomir_os`, CURRENT merged `origin/main` SHA `89b043f9ae7e70a36a1eea8f5c98cd621e037aa9`.
- Approved shared GlassPillTabs uses exactly one existing `FosGlassMaterial`, 38px lens / 44px target; 7px top + 12px bottom scrollport shadow clearance. DO NOT fork its material, spring, or tokens.
- Manager/Client views share visual components but have distinct permissions, data scopes and workflows. Backend integration is Alexey's domain. Do not invent status mapping, 1C contract, ACL, or route targets.
- This registry is an implementation planning index, NOT new product Scope approval.

## Verified reusable React primitives (main)

| Component | Path | State | Consumers |
|---|---|---|---|
| FosGlassMaterial / GlassLens | `src/components/ui/fos-glass-material.tsx` | Existing accepted shared material | SidebarNav, GlassPillTabs |
| GlassPillTabs (GL-03) | `src/components/ui/glass-pill-tabs.tsx` | Accepted, merged / component QA | Client/Manager Orders status UI |
| SidebarNav | `src/components/ui/sidebar-nav.tsx` | Existing shared component / screen QA open | Desktop Client/Manager navigation |
| HeaderAction | `src/components/ui/header-action.tsx` | Existing shared component / screen QA open | Client/Manager page-header actions |
| GlassSelect | `src/components/ui/glass-select.tsx` | Exists; used in legacy demo and future form/select needs | Form and select controls (not Orders status-pill replacement) |
| NavigationDrawer (GL-02B) | `src/components/ui/navigation-drawer.tsx` | PR #5 merged into main; reused unchanged | Tablet/Mobile shell, labs for Client/Manager |
| AppShell | `src/components/layout/AppShell.tsx` | PR #9 integration; screen visual acceptance open | Manager Orders; role/items supplied by consumer |

## Manager Orders first vertical slice (FE-08)

| Component / layer | Path | Status |
|---|---|---|
| OrderCard | `src/components/orders/OrderCard.tsx` | Merged into main PR #9; reusable, display-only |
| OrdersList / OrderRow | `src/screens/manager-orders/OrdersList.tsx` | Merged into main PR #9; list/empty states |
| ManagerOrdersScreen | `src/screens/manager-orders/ManagerOrdersScreen.tsx` | Merged into main PR #9, preview `?view=manager-orders`; Owner screen gate OPEN |
| Filter UI (GL-03) | Existing shared `GlassPillTabs` | Reuse unchanged |
| UI data model | `src/screens/manager-orders/model.ts` | FE presentation-only `OrderListItem`, `OrderStatusFilterId`; **not** API or 1C schema |
| UI filter fixture | `src/screens/manager-orders/fixtures.ts` | DEMO only; passed into screen via `orders` prop, no 1C mapping |
| Real manager New/All queue | — | OPEN: definition and API contract |
| Order search / company filter / sort | — | To compose from reusable Form components; semantics and data source need validation |
| Order detail routing / creation command | — | OPEN: route, ACL, backend, no fake navigation |
| ArtworkPreview/Attachment | — | Component contract/design-system mapping pending |
| StatusBadge | — | Avoid premature duplicate: OrderCard accepts display label, common badge needs design variants contract |

## Companies — planned reuse (not built yet)

| Functional block | Intended reusable unit | Status |
|---|---|---|
| Companies list | CompanyCard / CompanyList | PLANNED: no duplicated Manager/Client cards |
| Company selection | CompanyPicker shared control | PLANNED: permissions and filtering contract required |
| Company detail | CompanySummary, CompanyOrders | PLANNED: OrdersList/OrderCard can be reused |
| Actions | HeaderAction | Existing; real enablement depends on route/ACL |

## Support — planned reuse (not built yet)

| Functional block | Intended reusable unit | Status |
|---|---|---|
| My tickets | SupportTicketCard / SupportTicketList | PLANNED |
| Ticket creation | SupportTicketForm (subject + description) | MVP; form component and API contract pending |
| Ticket detail | SupportTicketDetail, ReplyView | PLANNED; status/source/ACL check |
| Additional reply / deletion | — | UX CANDIDATE / NOT APPROVED MVP; DO NOT implement |
| Navigation/header | SidebarNav / HeaderAction | Shared, reuse after screen QA |

## Implementation sequencing

1. FE-08 Manager Orders + AppShell merged in main at PR #9, CI successful; full Manager module and Owner screen acceptance still OPEN. CURRENT next is M4: map Client+Manager screens and React coverage per [Drive plan](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit).
2. Derive next shared components only from actual screen use and cross-role demand, not from the count of Figma frames.
3. Component QA: keyboard/touch, accessible names, disabled, empty/error/loading, responsive D1440/L1024/T768/M390/M320, reduced motion, consistency with shared tokens and no regression.
4. Integrate backend separately after matching data shape, role permissions, status filter membership and 1C mapping; exclude source-system enums from shared visual primitives.
5. Roll out accepted card/filter composition to Client/Companies/Support where real semantics fit; do not reuse order semantics for tickets.

## FE-08 incremental QA / 06.11.2026

- M2 slice now receives `orders: readonly OrderListItem[]` as a prop; only preview `App.tsx` imports demo fixtures. No API client, ACL, 1C exchange, business mapping or server behavior added.
- New screen Playwright captures D1440/L1024/T768/M390/M320 are emitted as CI artifacts for **human visual review**, not automatic pixel-perfect approval. CI and owner visual acceptance are separate gates.
- M3 supersedes the M2 navigation gap: PR #5 is merged; PR #9 composes the same Manager items into desktop SidebarNav (>=1024) and NavigationDrawer (<1024) through AppShell. Only the current Orders destination is enabled; unimplemented pages remain disabled.
- Manager sidebar label `Клиенты` vs UX section `Компании` is an owner/PO terminology mismatch; no speculative rename.

## Explicitly OPEN

- Browser screenshot parity and independent product UX approval for the FE-08 screen.
- Real API/1C status mapping, especially user-facing `В работе`; the label is Owner-approved and needs NO additional UX approval.
- Owner visual acceptance of the integrated shell/Orders screen; see [fresh M3 QA](FE08_MANAGER_ORDERS_M3_QA_2026-11-06.md).
- Real on-page query/search/Company filter, sorting, navigation, security ACL, error/loading; not faked in the demo.
- Public GitHub repository means all committed fixtures and examples must be synthetic.
