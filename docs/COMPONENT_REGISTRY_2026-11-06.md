# Flexomir OS — React Component Registry

**Date:** 2026-11-06  
**Scope:** frontend React, Client/Manager.  
**Decision (Owner):** Figma maintains visual design-system references, **not a requirement to implement every Figma frame as an individual React screen**. Compose screens from shared React primitives and reusable domain components. Existing UX frames may inform scenarios and state coverage but do not override accepted shared React Glass.

## Source of truth and constraints

## PR #16 — blocking Figma parity audit (Owner 06.11, before screen refactor)

Head `99303fe`: A/B/C TEST_PASS, **VISUAL_PASS/OWNER_ACCEPTED не присвоены**. Источники адресно перечитаны: DS `634:60`, Technical `1688:532`, Client `1782:6000`, Manager `2495:8870`, masters ниже. Задача #15 обновлена Owner: сначала общий UI и отдельный rendering, затем эталон New Item, затем остальные композиции; один PR #16, без merge.

| Figma master / states | Existing React / consumers | Audit action | Gate |
| --- | --- | --- | --- |
| Header family `1953:4168`, compact `2173:1425`: Add/Create/Save/Send/Edit + disabled | `HeaderAction` есть для Add/Create; local Send в Composer/Completed | EXTEND существующий HeaderAction новыми glyphs, сохранить motion; удалить local Primary | primitive QA → screens |
| More `1914:650`, menus `1914:655/658/663/668/673/676`: default/disabled/focus/open | только `CompletedOrderMenu`, отдельный движок | CREATE общий MoreAction/OverflowMenu; Completed thin composition, один keyboard/outside/focus lifecycle | Radix already installed, без нового Glass |
| Input `634:402`, Select `1148:311`, Textarea `634:418`, Note `681:203`, Date `1169:437`, Quantity `680:177`: default/focus/error/readonly | локальная `.fos-order-field` разметка повторяется в Item/Composer/Manager | CREATE controlled shared fields + FOSAction, единые токены, labels/error semantics | 44px field, 8px label gap/radius, isolated variants |
| Segmented `943:263`, Printing `2315:9747`: wide/compact × empty/flex/digit | видимые radio в Item | CREATE shared segmented/PrintingMethodControl; не рисовать отдельные экраны | 6 variants + keyboard |
| Artwork `634:445`: empty/selected/HELP + disabled library/error | native file UI в Item | CREATE ArtworkSource; chooser скрыт внутри FOS upload, exact UI; filename selected, не uploaded | local file/HELP, no fake success |
| Upload Panel `1438:474` | не используется в актуальном `634:445` / Order Item Form | DEFER отдельную library upload family; не создавать ложные network states | server upload/library OPEN |
| Header V3 `2302:2138`, Breadcrumb `2330:2346` | отдельные локальные headers, footer/back rows | CREATE PageHeader + Breadcrumbs; Desktop 30/40, T26/36, M22/30; action row48/68, no extra compact back row | long title/focus/viewport |
| Item Summary `2025:6608`, full row + chevron; Order Row `685:195` | summary + отдельная Edit кнопка; OrderCard собственные размеры | EXTEND summary/OrderItemRow и OrderCard; whole-row button, exact geometry | click/Enter/touch + readonly |
| Item Form `2025:6779/6822/6865`, New `1791:6130/1837:6385/1791:6185` | один ItemForm, неверная grid/footer/no note | RECOMPOSE из shared controls; Header Add/Save+More; убрать footer controls | reference D/T/M before spread |
| Composer `1782:6074/1837:6469/1782:6160`, Repeat `1846:3046` | один Composer New/Repeat, неверные header/row/actions | RECOMPOSE из тех же primitives; compact Secondary Add; сохранить IDs/flow | A/B/C + full scenario matrix |

OPEN exceptions до подтверждения: Delete Draft/Item и duplicate-item backend permissions, real library/upload, required date/1С mapping, unsaved-leave policy. `1914:668` разрешает локальный revert; `1914:673` явно содержит Cancel Input. Layout/SRS не дополняются догадкой. Устаревшее описание Draft Compose говорит Primary Add, но более поздний `1953:4168`/CORE — Send; используем более поздний Send. GL03 на всех ширинах и принятые Sidebar/Drawer/Glass сохраняются по Owner override. Остальные Companies/Support/library masters NEXT/OUT OF CURRENT SCOPE.

**FE-S02 / #15:** New и Duplicate используют один `OrderComposer`; Add/Edit одной позиции — один `OrderItemForm`. Существующие Glass, AppShell/NavigationDrawer и общий readonly OrderDetail сохранены. Роли здесь переключаются только в явной ephemeral demo workspace, без auth/storage/API. FE-S01 PR #14 уже merged (`884e78f`); описание ниже — исторический component checkpoint до merge.

| FE-S02 компонент | Контракт / данные | Потребитель |
| --- | --- | --- |
| `OrderComposer` | `draft: DemoDraft`, `onSave/onSend/onBack`; dirty/revert, 0/1/N, send только валидный сохранённый draft | Client New + Duplicate, пять ширин |
| `OrderItemForm` | `item?: DemoItem`, `onSave/onClose`; Name/Quantity/Shape/Width/Height/Material + UX print, UPLOAD/HELP, library disabled | Composer Add/Edit; native labels/file, keyboard/Esc, локальная валидация |
| `CompletedOrderMenu` | `onDuplicate`; только completed Client; FOS 2036:7604, More 1914:650, без новых Glass effects | Client OrderDetail `actions` slot; keyboard/outside/focus и Safari blur regression |
| `ManagerDemoIntake` | readonly intake, agreed-date/Create disabled до API/ACL-контракта, без изменения Order | Manager detail только переданных DEMO-records |
| `OrderDemoWorkspace` | initial role/empty; один in-memory набор draft/items, сохранение фильтров роли, явный reset | Оба существующих preview; новые вкладки не синхронизируются |
| `order-compose-model.ts` | `DemoDraft`, `DemoItem`, `itemSummary/draftView`, local validation; никакого backend DTO/status enum | Composer/store → общий OrdersList/OrderDetail двух ролей |

Figma Input `634:402`, Select `1148:311`, Note `681:203`, Action `835:259`, Item Form `2029:7310`, Composer `1782:6074/6160`, Manager `2500:9701`. Нативные поля/селекты передают интерактивную семантику без новой оптики. Малые SVG More/Send/Upload/Chevron сохранены локально в `src/assets/orders/` из этих контекстов, временных Figma URL в runtime нет. Backend required fields, print/1С mapping, library и delete OPEN. HELP или локальное имя не означают server file relation.

**FE-S01 / A+B, [PR #14](https://github.com/SigmeD/flexomir_os/pull/14):** ClientOrdersScreen подключает неизменённые AppShell/Drawer/GL-03/HeaderAction; OrdersList (`orders/total/idPrefix/onOpen`), `order-model.ts` и `orders-page.css` общие для Client/Manager. OrderCard использует существующий optional `onOpen`; без `order.detail` активного открытия нет. Manager entrypoints совместимы через переэкспорт. Единый синтетический источник — `src/demo/order-fixtures.ts`, список и деталь читают одну запись. Build + 180 Chromium + 58 Firefox/WebKit PASS локально; main/Owner acceptance не присваиваются до merge/review.

| Новый shared component | Контракт | Потребители / QA |
| --- | --- | --- |
| `src/components/orders/OrderDetail.tsx` | `order: OrderListItem`, `detail: OrderDetailContent`, `onBack`; только чтение, фокус заголовка | ClientOrdersScreen + ManagerOrdersScreen; ID/статус/0-N items, пять ширин |
| `src/components/orders/OrderItemSummary.tsx` | `item: OrderItemSummaryView`, `position`; строки названия/характеристик/макета, без файла или формы | OrderDetail обеих ролей; длинное имя, 320px |
| `src/components/orders/useOrderPreview.ts` | список view models → выбранная запись, open/back, surfaceRef; локальное состояние и восстановление фокуса/scroll | Два экрана; keyboard/touch/list-detail-back, без URL/API/storage |

`OrderDetailContent` содержит только необязательные view-строки дат/комментария и список Item summaries; это не договор обязательных Item-полей, DTO/ACL или mapping 1С. Ниже — исходный main до этого инкремента.

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
