# Flexomir OS — React Component Registry

## M8 / 10.11.2026 — адресная проверка существующих компонентов

| Figma/master → React | Решение | Consumers / проверка |
| --- | --- | --- |
| Client Support Detail 634:8137 → existing SupportScreen/PageHeader | EXTEND label variant | Client parent Поддержка; Manager 2606:22577 parent Мои обращения; nav.back/focus opener прежние, regression6/6 |
| AppShell/Orders/Composer/Item/Companies/Support/Layouts masters → existing shared React | REUSE |69fresh pairs/23 families; screenshot script не создаёт отдельные UI-компоненты |
| Title приложения → index.html | CORRECT text | Все cabinet routes Flexomir OS, browser проверка 6/6 |
| Frozen FE11/GL03/14-18-500 | KEEP | Без изменения источников и manifest |
| Manager agreed-date/private publication/Auth | OPEN | Не добавлять неподтверждённые props/state/API; [итоговый аудит M8](M8_FINAL_AUDIT_2026-11-10.md) |

Автоматические технические проверки и авторское сравнение не заменяют независимый screen review и Owner visual acceptance.

## Предыдущие checkpoints (история)

## FE11 popup rollout / 10.11.2026 — пилот OWNER ACCEPTED

| Источник / вариант | React / решение | Контракт и consumers |
| --- | --- | --- |
| Frozen FE11-v0.2 + Owner accepted pilot | CREATE FosPopup, единственная композиция Surface/Rows | actions/navigation/listbox; actions не допускает selectedId; material/hover flags закрыты; wrappers/classes только для layout |
| Account set3042:2806,4 variants | EXTEND AccountMenu | все Client/Manager routes; identity сохранён, separators/fake selected удалены; Radix focus/dismissal |
| Header Overflow1914:655…676,2015:6085,2016:898,2033:1145 | EXTEND OverflowMenu | все реальные More consumers/CompletedOrderMenu; прежние действия, disabled/reason/confirm/focus |
| Navigation634:511 + Drawer1368:499/1384:26491 | EXTEND NavigationDrawer public composition | dialog/nav/focus trap/inert/scroll lock/real route selection; frozen physics не менялась |
| Select Field1148:311 Default/Focus/Error/Readonly,44px | EXTEND canonical FOSSelect → FOSSelectPopup | Shape/Material, Manager company, CompanyOrders filter/disabled sorting, lab; real select events/FormData/validation/reset; visible button focus |
| Existing GlassSelect | EXTEND via listbox semanticRows slot | compound Item API, onClick cancellation, theme/current/matte/dark, existing lab/status consumers |
| Adapter lifecycle, не motion engine | CREATE usePopupSelectionRest | reuse form + compound select; actual state/geometry + generation cancellation; no physics, timer or replayed callback |
| Owner14/18/500 + Figma style Menu/Item | REUSE shared type token/aliases | Navigation/Account/More/GlassSelect/Select options; identity/header/field roles сохранены |
| ConfirmDialog | KEEP | самостоятельный dialog, не popup menu |

Флаг popupPilot, FOSGlassSelect alias и legacy Surface hover driver удалены. Figma style `S:7b1a1bc5246031d4323a720db87c4aea89cc52e2,`; closed field labels/body неизменны. Пять frozen sources+manifest сохранены. [отчёт FE11](FE11_POPUP_REAUDIT_2026-11-10.md).

## История до public popup rollout

## Post-FE11 lifecycle / 09.11.2026

EXTEND существующий `FosPopupSurface`: closed=inert/pointer-none при прежней exit animation. EXTEND AccountMenu focus handoff для открытия Profile; EXTEND OverflowMenu trigger-aware outside handling и reason-aware Escape return-focus. Линзы, физика, материал и типографические преобразования не менялись. `FOSAction/useDirectionalPress` не менялись: исправлен источник потери клавиатурного фокуса в popup adapter. Регрессии `tests/popup-dismissal.spec.ts`, freeze/adapter suites и прежние order/profile сценарии. CI — существующие Orders Core / M7 jobs. [Причины и QA](FE11_POPUP_PILOT_2026-11-09.md).

## CURRENT FE11-v0.2 / OWNER APPROVED / FROZEN

Owner подтвердил стенд; эталон зафиксирован в `f527bcb`, [manifest](FE11_MOTION_FROZEN_V0_2.json). Единственный общий visual list — `FosPopupRows`, оболочка — `FosPopupSurface`, оптика/пружина — прежние `FosGlassMaterial`/`glass-motion`. Потребители: Drawer (dialog), Account (Radix menu), GlassSelect (listbox). Lab использует тот же компонент, отдельный кандидат/render-slot удалены. Formulas/material/scale защищены freeze-contract test. Account Escape→reopen исправлен в адаптере через trigger-aware onInteractOutside; Select flip/clamp/scroll остаются в listbox adapter. Нативные FOSSelect и исключённый Order More не мигрированы. Проверка адаптеров ≠ автоматическая экранная приёмка. [QA и ограничения](FE11_POPUP_PILOT_2026-11-09.md).

## CURRENT FE-11 v0.2 / LAB ONLY / OWNER OPEN

`src/lab/DrawerLensCandidate.tsx` — кандидат selection-only контроллера: фактическое перекрытие DOM-label/icon из единственного FosGlassMaterial spring frame. Подключён только NavigationDrawerLab через `NavigationDrawer.renderNavigation`; не переносить на общие popup до явного Owner approval. Spring/material/Sidebar остаются прежними. Freeze policy: [version reference](FE11_POPUP_PILOT_2026-11-09.md); статус НЕ `OWNER APPROVED / FROZEN`. После одобрения один перенос и переиспользование, без копий и локальных CSS; любое последующее изменение frozen engine требует отдельного разрешения.

## FE-11 pilot / 09.11.2026

EXTEND `FosPopupSurface` с opt-in `sidebarMaterial`; CREATE `FosPopupRows` (selectedId + DOM item/label/icon slots → один accepted FosGlassMaterial spring и optical frame). Первый потребитель — `NavigationDrawer`: dialog semantics, inert/focus/commit сохраняются в адаптере. Источник — Sidebar 2.2.5 C / lens `1578:493`, Drawer `1962:3834/3854`, новое Owner ТЗ 09.11. Account/Select ещё не мигрированы; Order More исключён. [Карта, API, QA и Owner gate](FE11_POPUP_PILOT_2026-11-09.md).

## Typography foundation / 09.11.2026

| Figma role / master | React component | Consumer and disposition |
| --- | --- | --- |
| Page Header V3 `2302:2138` | REUSE `PageHeader`; CSS role variables from `src/styles.css` | Client/Manager orders and Profile. Profile no longer overrides H1 type; responsive sizes are 30/40 desktop, 26/36 through 1023px, 22/30 through 600px. |
| FOS Body/Label/Heading styles `2272:2199` | REUSE `FOSInput`, `FOSAction`, order card/detail primitives | Semantic variables: Card 16/22, Body MD 14/20, Label MD 13/18, Body SM 12/18. |
| Account Menu `3042:2806`; popup `1914:655..676` | REUSE `AccountMenu`, `FosPopupSurface`, `OverflowMenu` | Canonical Manrope family is shared; popup item weight remains within the FE-11 Owner visual gate. No menu optics/actions changed in this typography slice. |
| Client Support Detail `2364:10455` | REUSE shared support thread | Figma explicitly maps thread content to Body SM 12/18; retained. |
| FOS Liquid Glass navigation lens | REUSE `SidebarNav`, `GlassPillTabs`, `FosPopupSurface` | Existing navigation weights and 1.043 optical scale are preserved. |
| Existing `GlassSelect` | EXTEND shared trigger/content family contract | Trigger and portalled options inherit canonical Manrope; still the same component and body portal. |

Changed source: `src/styles.css`, shared `PageHeader`/FOS controls/overlays/navigation and order primitives, Profile CSS. Regression: `tests/typography-contract.spec.ts`; profile cross-browser config now includes that suite.

## FE-DEBUG-2026-11-09 — existing components and consumers

| Figma / source | React component | Change / consumer / status |
| --- | --- | --- |
| App Shell `637:180`, Desktop nav y=100 | REUSE `AppShell` + `SidebarNav` | Shared nav top spacing is 52px after the 28px brand; list is the only sidebar scroll region; footer stays pinned to viewport height. Client and Manager. |
| Sidebar lens `1578:493`, Sidebar response `2.2.5 C` | EXTEND `CabinetNavigation` → `AppShell` → `SidebarNav` | Carry the previous section as the lens origin when route shells change; reuse the existing `FosGlassMaterial` spring. Initial deep links remain settled; the mobile Drawer keeps its existing same-lens selection/settle behavior. |
| FOS demo presentation | REUSE `OrderDemoWorkspace` + `FosGlassMaterial` | DEV-only fixed utility, collapsed by default; QA reset appears only inside the expanded panel. Does not enter AppShell geometry or intercept primary actions while collapsed. |
| Client New/Existing draft | REUSE `ClientOrdersScreen`, `OrderComposer`, `OrderItemForm`, `ConfirmDialog` | Dirty item navigation confirms; Yes validates/commits to one session draft before leaving, No discards only unsaved item edits; list reopens existing draft with its ID title. Base fixtures remain read-only. |
| Sidebar Account Footer `3123:1214` / GlassLens `1578:493` | EXTEND `AccountMenu` footer trigger with shared `FosGlassMaterial` | Existing 240×72 footer geometry; glass appears for hover/focus/press and text receives optical scale; mobile avatar trigger unchanged. Account popover remains independent. |
| Owner popup references `Стилистика формы.png`, `Форма бургер меню.png`; Drawer `1962:3834/3854`; More `1914:655..676`; GlassSelect | CREATE shared `FosPopupSurface`; REUSE `NavigationDrawer`, `AccountMenu`, `OverflowMenu`, `GlassSelect` and `SidebarNav` | One Liquid Glass surface with neutral 72% coat, 20px backdrop blur, shared stroke/shadow and Manrope 15/20/500 menu-item type. Account, More and Select use one spring-travel hover/focus lens with +4.3% optical label scale; Drawer reuses its existing selected lens and follows hover/focus within the popup, returning to selection on exit. Drawer anchors under hamburger. Consumers retain actions, placement and dismissal lifecycle. Owner visual direction approved; rendered visual acceptance OPEN. |

QA additions: `tests/fe-debug-shell.spec.ts`, `tests/fe-debug-order-transitions.spec.ts`, `tests/fe-debug-overlays.spec.ts`, `tests/popup-surface.spec.ts`. FE-11 popup suite passed 58/58 in Chromium 1440/390; computed 20px backdrop blur and shared action typography are asserted. FE-10 Manager mobile selection was not reproduced; no route code change. FE-07 `DEMO-001` remains read-only. Final Owner visual acceptance remains OPEN.

## FE-ACTION-08NOV — shared FOS actions and responsive action dock, 09.11.2026

| Figma master / variant | React component | Props / states | Consumers / disposition |
| --- | --- | --- | --- |
| Action `835:259` and Secondary Default/Hover/Pressed `835:243/245/247` | REUSE/EXTEND `FOSAction` | hierarchy primary/secondary/tertiary; `size=standard|compact`; shared focus/disabled/hover/pressed and directional press. Secondary retains existing `FosGlassMaterial`, no new material engine. Loading has no current FOSAction consumer and is not added. | Shared control consumers; ArtworkSource upload44 and library40; Profile photo40. |
| Work Action Dock `3143:1219`; adapter `3144:2851`; Header `2302:2138` | EXTEND `PageHeader` with opt-in `floatingWorkActions` | one existing action group; desktop/laptop inline; T/M fixed 108×48, gap12, bottom24+safe-area, right24/20/16 | Only paired Primary+More: Client/Manager Orders list/detail/compose/item, Layouts list/detail/upload/picker, Support, Companies. Singles stay inline; no global AppShell dock. |
| HeaderAction `1953:4168` and MoreAction | REUSE existing components | directional press now comes from shared `useDirectionalPress`; no visual variant added | Existing consumers, including Profile Save+More; dimensions/placement unchanged. |
| App Shell `637:180`, Account `3037:2656`, Avatar `3177:1314`, Profile Page Actions `3215:1357` | EXTEND existing AppShell/Profile CSS | compact account trigger edge, photo action centered beside Avatar80 | Client and Manager profile: measured at five canonical widths; Save+More stays 148×68 with original positions. |

**QA evidence:** `tests/m7-responsive-actions.spec.ts` (48/48 across Chromium/Firefox/WebKit), `tests/m7-layouts.spec.ts` (33/33 across same browsers), full Playwright 392 passed / 2 expected touch-only skips. Owner visual acceptance remains OPEN; Figma masters are read-only.

## FE-PROFILE-01 — shared Account Menu and Profile, 09.11.2026

- **Figma mapping:** Account Menu `3038:2667` → `AccountMenu` (desktop Sidebar footer + compact header trigger); Sidebar Account Footer `3123:1214` and App Shell `637:180` → existing `AppShell`; Profile Page Actions `3215:1357` → existing `PageHeader` + shared `HeaderAction`/`MoreAction`; Profile Avatar `3177:1314` → profile avatar (80px); unsaved Confirm Dialog `3098:1663` → scoped shared `ConfirmDialog` adapter.
- **Consumers:** Client and Manager AppShells via `OrderDemoWorkspace`; Profile Settings is rendered inside the active shell to avoid duplicate hidden account triggers. Role-specific identity comes from isolated fixtures.
- **States:** view/edit name, read-only email, local photo preview/remove/restore, dirty/save, navigation confirmation (`Да` saves and continues; `Нет` discards the draft and continues), failed demo save. Closing the dialog keeps the user on Profile. Company Settings, Logout and Profile More stay disabled pending approved behavior.
- **Responsive / QA:** D1440/L1024/T768/M390/M320; shared menu uses 40px compact avatar, footer anchored to desktop sidebar bottom. Tests: `tests/profile-settings.spec.ts`; evidence at ignored `output/playwright/profile-settings/`.
- **Boundary:** demo-session save only; reload resets fixture. No server persistence, account mutation, API, ACL or identity/auth implementation. Owner visual acceptance remains OPEN.

## FE-DEBUG-02 / issue #25 — shared workspace layout contract, 08.11.2026

- **Source:** CURRENT AppShell FOS V2 `637:180` / content slot `637:119`; Client My Orders Desktop `634:6825`; shared Page Header `2302:2138` and Order Row `685:195`. Content region is the area after the fixed 240px Sidebar.
- **REUSE:** `AppShell` → `.fos-app-shell__content` → `.fos-orders-page__main[data-layout="standard"]`. Shared CSS owns `width:100%`, `max-width:1440px` candidate and `margin-inline:auto`; each screen's existing Figma-approved inner gutters remain. No screen-specific centering offsets.
- **Consumers:** Client My Orders/detail/New/Repeat/Item editor; Manager Orders/detail/New; Manager Companies; Client My Layouts and nested picker; Support in both roles. Add/More continue inside the existing shared PageHeader row.
- **Responsive:** Client Orders uses 20px compact gutters; current Support/Layouts mobile Figma uses 16px. Desktop list/support uses 72px inset. Avoid nested main padding or centering a table/card independently.
- **Mode:** `standard` is live. `wide` is DEFERRED because no current screen in this scope uses a complex wide table/dataset. Do not apply a wider manager-wide default without a real consumer and visual evidence.
- **QA:** `tests/workspace-layout.spec.ts` checks centering, axis, and overflow for seven routes and seven widths in Chromium, Firefox, WebKit. Test evidence is local/ignored at `output/playwright/workspace-layout/`; Owner visual acceptance remains OPEN.

## FE-DEBUG-01 / issue #23 — demo stand delta, 08.11.2026

- `AppViews` maps `/` to the existing Client Orders workspace. Direct `view` routes stay explicit; legacy `GlassFilterDemo` is retained at `?view=glass-filter-lab`, other labs keep their routes, and unknown values fall back to Client with a diagnostic.
- `OrderDemoWorkspace` reuses one Client/Manager state owner; role selection stays in the presentation strip and `demoTools=1` reset in a separate QA strip. `ManagerOrdersScreen` and shared `OrderComposer` report dirty Manager draft state so role/reset lock and cabinet navigation cannot discard unsaved edits. Save clears the guard.
- Shared `OrderCard` now derives its accessible name from its visible contents and a visually hidden “Открыть заказ …” action. Client and Manager consumers retain the same card layout and interaction.
- Consumers/regression: Client Orders, Manager Orders, direct route and FE-S04/composer tests; no new cabinet variants or design master.

## M8 / FE-S05 #21 audit delta — 08.11.2026

- `AppShell` → `SidebarNav` / `NavigationDrawer` → Client Composer → `OrderItemForm` → `ArtworkSource` / `LayoutBrowser`: CURRENT LAY03 sets «Макеты» as the selected section during picker flow. `ClientOrdersScreen` now leaves that selected item enabled while the item editor guard still disables other destinations. Draft/focus state and accepted `FosGlassMaterial`/spring are unchanged. Consumer regression: `tests/m7-layouts.spec.ts` asserts active/enabled and guarded peer item on desktop and drawer.
- Manager Orders panel `2495:8871/9000/9097`: Search/Company/Sort and New/All remain `OWNER_OPEN` / PILOT candidate. React uses the existing accepted GL03 status filter; do not duplicate controls or infer business semantics before decision.
- Sidebar icons remain in the shared nav as an unresolved visual question against text-only CURRENT shell/nav references. Existing optional icon contract and tests are retained pending Owner review; no one-role workaround.
- AuthCandidate has no approved CURRENT Figma master: `OWNER_DESIGN_OPEN`; no visual acceptance.

### M8 screen-family traceability

| CURRENT family / master | React component and contract | Client / Manager consumers | M8 evidence and disposition |
| --- | --- | --- | --- |
| Shell `637:180`, header `2302:2138`, HeaderAction `1953:4168/2173:1425`, FOS controls `1688:532` | REUSE `AppShell`, `SidebarNav`, `NavigationDrawer`, `PageHeader`, `HeaderAction`, `OverflowMenu`; same responsive/keyboard contract | Both roles, lists, details, nested picker | Navigation/header/drawer suites; optional sidebar icon styling OWNER OPEN |
| Orders list, status, detail, row and GL03 | REUSE `OrdersList`, `OrderDetail`, `OrderItemSummary`, `GlassPillTabs`; role-specific data stays in `OrderDemoWorkspace` | Client Orders/detail/Repeat; Manager Orders/detail/New/All | Orders/GL03/FE-S04 regression; New/All are current FE-S04 demo grouping. PILOT search/company/sort remain OWNER OPEN |
| New/Repeat order, Item New/Edit, ArtworkSource | REUSE shared `OrderComposer`, `OrderItemForm`, `ArtworkSource`, FOS fields, company selector | Client compose/repeat; Manager private draft | Composer/parity suites, five widths; local draft only; no backend contract inferred |
| Layouts LAY01–09 | REUSE `LayoutBrowser(mode=library|select|replace)`, `LayoutDetail`, `LayoutUploadForm/Panel`, `LocalFileControl` | Client library and nested item select/replace; Manager draft picker | 27 comparison images cover list/detail/upload/select families at D/T/M; all five widths tested. Server storage/policy OPEN |
| Support list/new/detail/submitted | REUSE `SupportTicketRow`, `SupportTicketForm`, `SupportTicketDetail`, `ArtworkThumbnail` | Client and Manager requester views | D/T/M comparison for list/detail; empty/invalid/error/submitted functional coverage. Async/API and operator functions excluded |
| Companies list/linked orders/detail | REUSE `CompanyRow`, `CompanyOrders`, `OrdersList` and `OrderDetail` | Manager Companies → scoped fixture orders → detail/back | `compare-companies-{d,t,m}.png`; five sizes. “Клиенты/Компании” naming OPEN |
| AuthCandidate | Candidate uses shared Header/fields/actions only | `?view=auth` | No approved CURRENT design; excluded from visual parity and M8 repairs |

The complete state-by-state node / screenshot / viewport / severity / root-cause / reviewer matrix is in the M8 section at the top of [SCREEN_MAP](SCREEN_MAP_M4_2026-11-06.md). Frame variants are grouped by shared contract; they are not separate React components by default.

## FE-S04 / 07.11.2026 — A–D component map

| Figma / requirement | React component | Props / state | Consumers / decision |
| --- | --- | --- | --- |
| Manager Orders CURRENT 01.1/01.2/01.6 (`2633:20095`, `2634:20104`, `2634:20161`) | REUSE `ManagerOrdersScreen`, `GlassPillTabs`, `OrdersList`, `OrderDetail` | queue `new/all`; order data and processing state supplied by `OrderDemoWorkspace` | Manager Orders; `New` means only current client submissions in the demo store; status tabs remain GL-03 |
| Manager draft CURRENT (`2568:11735`) | EXTEND shared `OrderComposer`; REUSE `OrderItemForm`, `ArtworkSource`, `LayoutBrowser`, FOS controls | `ownerRole=manager`, existing company options, private in-memory draft | Manager Orders; no client publication, new company, or server contract |
| Auth | CREATE `AuthCandidateScreen`; REUSE `PageHeader`, `FOSInput`, `FOSAction` | email/code, invalid/expired/resend, trusted-device preview | `?view=auth`; no approved Auth Figma found, `OWNER_DESIGN_OPEN`, visual details deferred to M8 |
| Same-session Client↔Manager | EXTEND `OrderDemoWorkspace` and `DemoDraft`; REUSE Client/Manager Orders + shared composer/detail | local submission/processing maps; synthetic imported record | `demoTools=1`, import fixture only via `fixture=imported-1c`; no actual import/1C exchange |

Review map: Figma master/variants → React shared component → props/states → screen consumers. Auth screen composition is a candidate pending Owner design review; don't treat build pass as visual acceptance.

## FE-S03 / final responsive checkpoint, 07.11

LayoutBrowser(mode=select|replace) внутри OrderItemForm: REUSE тех же LayoutRow/LayoutDetail/UploadForm. layouts.css задаёт отступы host и preview по CURRENT LAY03/04 D/T/M (1316:2015/2074/2165/2223/2315/2372); library сохраняет свою композицию. Пять размеров 1440/1024/768/390/320, выбор/замена/возврат проверены в составе свежих 105 M7 и 202 Orders/Glass сценариев. Новый мастер и отдельный экранный CSS не создавались. CI Orders отслеживает layouts/** как зависимость формы позиции. Авторская визуальная сверка; независимое review и Owner gate OPEN.

Historical FE-S03 note, superseded by M8 / FE-S05: CURRENT LAY03 parent context is present in the nested picker; `ClientOrdersScreen` now reports `Макеты` as active and leaves it enabled during Item editing, while peer destinations remain disabled by the unsaved-item guard. See the current matrix at the top of [SCREEN_MAP](SCREEN_MAP_M4_2026-11-06.md). Owner visual acceptance remains OPEN.


## FE-S03 / D — integration contract

CabinetNavigation supplies only available demo destinations. OrderDemoWorkspace composes existing Orders and new Companies/Support/Layouts; React Activity keeps visited same-role sections, form input and selection, while effects/Drawer locks clean up when hidden. Existing Orders role switch still remounts role presentation; draft/filter store is shared at workspace level. No new routing package.

AppShell separates Drawer selected UI from actual section change: local selection → accepted lens settles → existing onSelectionSettled → destination. Sidebar/GL03/HeaderAction material and spring unchanged. usePreviewNavigation uses a unique in-memory history namespace, supports StrictMode, browser Back, nested picker and explicit opener IDs (Safari pointer clicks need not focus buttons). Scope remains demo routes.

Same CompanyOrders uses controlled per-company search/status. SupportTicketRow/Form/Detail use role-owned synthetic records; same subject is H1 before and after submission. LayoutBrowser(mode=library/select/replace) consumes one LayoutRow/Detail/UploadForm/Panel; ArtworkSource and uploader share LocalFileControl. Shared HeaderAction adds only Choose glyph24 from2047:7665; assets are local, root dimensions preserved.


## FE-S03 / M7 — component-first map, 06.11

**C / source map before JSX:** LAY01 `634:8050/8193/8277` → LayoutRow(layout,onOpen), master `1313:2182` Wide/Compact default/hover/pressed/focus, thumbnail `674:114` 60 (row instances including compact use 60). LAY02 `1316:1966/2120/2268` → LayoutDetail(layout), source/history action rows `2167:1357`, `2158:1347`; preview + readonly description, disabled Save/More/history/download where sources/permissions absent. CURRENT LAY02 has links to PROPOSED `2101:7959`; these actions remain OPEN, not implemented.

LAY03/05 `1316:2015/2165/2315`, `1318:2371/2386/2401` → ONE LayoutPicker(mode=select|replace) list. LAY04/06 `1316:2074/2223/2372`, `1318:2379/2394/2409` → same LayoutDetail presentation=picker, HeaderAction EXTEND choose from Figma `2047:7665`, retain shared motion. Reactions confirm Choose → New Item `1791:6130` or Edit `1782:6025`; bind to existing OrderItemForm/ArtworkSource with synthetic layout ID/title only.

LAY07/08/09 `1440:4989/5209/5419`, `1440:5059/5275/5486`, `1440:5128/5341/5552` → ONE LayoutUploadForm + LayoutUploadPanel master `1438:474` Empty/Selected/Error (static fixture), metadata `2109:8114` desktop + T/M variants. CREATE shared native LocalFileControl for existing ArtworkSource and library uploader; no upload/progress/server-success simulation. Save creates ephemeral demo metadata only. Type/size/requiredness/real files/storage/version/ACL OPEN, do not enforce illustrated 20MB policy. All domains reuse PageHeader/FOS controls/More; no per-frame components.

**B / source mapping before JSX:** Support list `634:8098/8228/8314`, Manager `2605:32928/33010/33079` → CREATE shared SupportTicketRow(ticket,onOpen), FOS thumbnail `674:102` → shared ArtworkThumbnail(label,size). Ticket row masters `2409:11511/11521`: 92px wide/104px mobile, 60px thumbnail, 12px gap. REUSE PageHeader/Add/MoreDisabled.

Form master `2272:2015` Empty, `2272:2047` Invalid, `2272:2163` ServerError; Manager `2606:20379/20390/20399`, ready/error frames → shared SupportTicketForm(value,onChange,touched,onBlur,error). FOSInput/FOSTextarea + Header Send. Client `2412:10665/10680/10693` includes candidate category/attachment; omit these per explicit #17 + FR-SUP-002 and record VISUAL exception. Client label «Описание», Manager «Сообщение» via props. Subject/description are the only fields, no production status enum.

Detail `634:8137/8263/8347`, Manager `2606:22577/22823/23030`, submitted `634:13565/13594/13608`, `2606:23411/23481/23538` → shared SupportTicketDetail(ticket,submitted): same subject H1, readonly requester message + support-team reply, separate outcome feedback. No SupportStatus component: no distinct repeated approved status master; display supplied status text. Archive `2413:10812/10825/10837` is CANDIDATE: readonly fixture presentation only, no archive command or enum. Author reply/delete/triage remain OUT.

| Figma node / variant | React contract | Consumers / action |
| --- | --- | --- |
| DS 634:60, FOS 1688:532, shell 637:180, header 2302:2138, controls 634:402/418 + 1148:311 | AppShell/SidebarNav/Drawer/PageHeader/HeaderAction/MoreAction/FOS controls | REUSE; CabinetPage composes new domains; Glass untouched |
| Client Row set 1189:984, Default 634:316; Manager 2498:10826/10963/11087 | CompanyRow(company,onOpen), whole-row button / 80px / ellipsis | CREATE minimal domain row; no duplicate CompanyCard |
| Linked orders 2499:9435/9464/9490; long company 2548:10426/10456/10484; third 2548:10513/10543/10571 | CompanyOrders(company,onOpen) + readonly FOS controls + OrdersList/OrderDetail(role=manager) | REUSE order components, CREATE composition; company detail IS linked orders, no invented intermediate page |
| Shared in-session navigation | usePreviewNavigation(root), browser Back + focus/scroll return points | CREATE for all M7 list/detail flows; no production route or ACL contract |
| Support / Layout masters | Source/variant map before B/C JSX | DEFER until preceding block QA |

Naming OPEN: issue #17 calls domain «Компании», CURRENT Figma says «Клиенты». Preserve Figma visible label, no global rename. Fixture scoping does not prove server ACL.


**Date:** 2026-11-06  
**Scope:** frontend React, Client/Manager.  
**Decision (Owner):** Figma maintains visual design-system references, **not a requirement to implement every Figma frame as an individual React screen**. Compose screens from shared React primitives and reusable domain components. Existing UX frames may inform scenarios and state coverage but do not override accepted shared React Glass.

## Source of truth and constraints

## PR #16 — результат компонентного переноса, 06.11

`5a26e4a` — shared masters; `03f55ac` — эталон New Item; оставшиеся композиции используют тот же UI-слой. CODE_DONE не означает OWNER_ACCEPTED. Финальные команды/результаты — в HANDOFF; переходы — в [Screen Map](SCREEN_MAP_M4_2026-11-06.md#fe-s02--проверка-переходов-figma--react).

| Figma мастер → shared React | Потребители / состояния | Проверка |
| --- | --- | --- |
| `634:402/418`, `1148:311`, `1169:437`, `680:177`, `681:203` → `ui/fos-controls.tsx` | Input/Quantity/Select/Date/Note; ItemForm, Composer, readonly Detail обеих ролей, lab | Default/focus/error/readonly/disabled; labels/aria-describedby; единые 44px/8px |
| `1953:4168/2173:1425` → расширенный `HeaderAction` | Add/Save/Send/Edit/Create + disabled, оба кабинета и lab | Одна исходная Glass/motion family; оригинальные plus/pointer/keyboard/reduced-motion regression |
| `1914:650`, `1914:655..676` → `MoreAction/OverflowMenu` | Item New/Edit, Composer, Completed thin wrapper, list/detail disabled | Один Radix lifecycle: click/Enter/Space, Arrow/Home/End, Esc/outside, focus return; навигационный consumer владеет фокусом |
| `2302:2138`, `2330:2346` → `PageHeader/Breadcrumbs` | Все list/detail/composer/item headers | D30/40, T26/36, M22/30; 48/68 actions; compact без лишнего back/footer; длинный H1 переносится |
| `943:263`, `2315:9747` → `PrintingMethodControl` | New/Edit Item; wide/compact × empty/flex/digit | Native radio семантика, единый segmented, touch/arrow keys |
| `634:445` → `ArtworkSource` | New/Edit Item + lab; empty/local filename/HELP, library disabled | File picker внутри UI, drag/drop/local filename без upload success; error prop; HELP исключает upload/library |
| `1986:774` → `SectionAddItem` | Inline «Продукция» в New/Repeat | 44px target, 34px circle, canonical plus; tooltip/accessible name; не Primary |
| `2025:6608` → `OrderItemSummary/OrderItemRow` | Composer New/Repeat, readonly Detail Client/Manager | Одна целиком кликабельная строка, chevron; ID стабилен; Enter/touch/return focus; нет второй Edit кнопки |
| `685:195` → существующие `OrderCard/OrderRow/OrdersList` | Client/Manager list | Вся строка открывает заказ, thumbnail placeholder, 92/104px; grid не выходит за 320px; empty/count live |
| New `1791:6130/1837:6385/1791:6185`, Edit `1782:6025/1837:6509/1782:6119` → одна `OrderItemForm` | Поля/Print/Artwork/Note, Header Add или Save + More | Reference D/T/M + 1024/320, dirty/unchanged/invalid, cancel по prototype reactions, без footer substitutes |
| Composer `1782:6074/1837:6469/1782:6160`, Repeat `1846:3046/3092/3129` → один `OrderComposer` | 0/1/N, inline Add, General Date/Note один раз | Saved item ID, новые clone IDs, source unchanged, даты сброшены, submit→общий store |
| Shell/Drawer → прежние primitives + `AppShell` host | Оба кабинета, detail→root Orders | Оптика/spring не менялись. Host обрабатывает текущий раздел; Drawer получает fallback focus на dialog, если guard отключил все пункты |
| `1438:474` Layout Upload Panel | Отдельная библиотека макетов | DEFER: не используется текущим ArtworkSource; нет фальшивых uploading/success состояний |

**Визуальные материалы:** `output/fe-s02-parity/figma/` — исходные Figma PNG; `{project}/react-{screen}-{width}.png` — React; `chromium-1440/compare-{screen}-{1440,768,390}.png` — слева Figma, справа React без масштабирования. Browser projects хранятся отдельно, снимки разных движков не перезаписываются. Генератор `scripts/orders-figma-comparison.cjs`; результаты локальные/ignored, в Git не добавляются. Есть New/Edit, 0/1/2, Repeat, Client/Manager list/detail, More и submitted captures. 1024/320 проверяются как адаптивное продолжение D/T/M, не выдаются за отдельные найденные Figma-фреймы. Данные/количество demo записей могут отличаться от иллюстраций Figma; у Manager border/shadow Figma boards добавляют внешние поля в export, это не padding приложения.

**OPEN / source conflicts и исключения для Owner:**

- Принятые runtime Glass/GL03/Sidebar/Drawer приоритетнее старой optical simulation/Select в Figma; общий материал не переписан. Старые CORE status y102 против Header V3 «subtitle после всей 68px actions row»: применён V3, контент далее течёт без наложения; абсолютные старые y не считаются новым layout contract.
- Artwork `634:445`: `#737781` на `#fbfcfe` даёт axe 4.36:1. React использует существующий более контрастный `#586d7c`; Owner/DS review цвета OPEN. Не изменяли Figma master. Текст size/formats заменён на «Форматы и размер файла уточняются», пока нет API policy; library disabled. Native date/calendar/select/checkbox rendering отличается между платформами, это **OPEN**, не pixel parity.
- Screen-wide axe дополнительно подтвердил 4.48:1 у `#737781` на white и 4.33:1 у inactive GL03 text на page surface. Общий semantic secondary text для Orders/новых FOS controls теперь `#586d7c`; GL03 получает токен от host, его material/motion/CSS не менялись. Повторные axe проверки целых Client/Manager list/detail/Composer: 0 violations. DS/Owner exception цвета остаётся OPEN.
- Delete Draft/Item и Duplicate Item имеют prototype reactions, но бизнес-права не утверждены: disabled. Для Edit More Cancel Changes подтверждён переход `1917:3319 → 1782:6074`, для New Cancel Input `1917:3329 → 1810:12510`; нет самодельного revert footer.
- Общие поля Order сохраняются в ephemeral store при вводе, без выдуманной footer Save и без server autosave. Item уход защищён до Save/явного Cancel; production unsaved-leave/reload policy остаётся OPEN.
- Manager detail `2500:9701/9730/9756` помечен PROPOSED: используем разрешённый readonly состав/DS для текущего demo, не утверждаем Manager commands/ACL/1С. Пустые/исторические display fixtures read-only, редактируются новые FE-S02 drafts. Owner screen acceptance, физические устройства и полный screen reader audit OPEN/NOT RUN.
- Сверены Client completed `1846:2942/2982/3014` и production `1838:6565`: один Date Field. Client readonly Detail теперь показывает один срок по Figma; agreed date остаётся в общей модели и Manager-представлении. Это исправленная композиция, не новый контракт данных; role-specific число полей проверено на пяти ширинах.
- Общая chrome AppShell приведена к DS `637:180` и web header `1952:727`: brand20/28 desktop, company context в Client/sidebar, одна brand-строка compact. Оптика/пружина Sidebar/Drawer не менялись; старые ручные CORE sidebar offsets отличаются от более поздней общей DS и принятых runtime primitives.
- Manager list `2495:8871/9000/9097` помечен PILOT и содержит дополнительную панель «Новые/Все», Search, Company, Sort. В текущем React есть согласованные GL03 status filters + list; эта дополнительная панель **OPEN / structural difference**, а не VISUAL_PASS. До решения Owner не переносим PILOT как утверждённый scope и не выдумываем семантику «Новые»/сортировки. Вопрос Owner: включить панель в PR #16 с неподтверждёнными actions disabled или оставить следующему этапу.

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

OPEN exceptions до подтверждения: Delete Draft/Item и duplicate-item backend permissions, real library/upload, required date/1С mapping, unsaved-leave policy. Master `1914:668` содержит Cancel Changes, но фактический prototype `1917:3319` возвращает в composer без dirty правок; `1914:673` содержит Cancel Input. Layout/SRS не дополняются догадкой. Устаревшее описание Draft Compose говорит Primary Add, но более поздний `1953:4168`/CORE — Send; используем более поздний Send. GL03 на всех ширинах и принятые Sidebar/Drawer/Glass сохраняются по Owner override. Остальные Companies/Support/library masters NEXT/OUT OF CURRENT SCOPE.

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
