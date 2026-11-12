# M4 — карта экранов Flexomir OS Client + Manager

CURRENT Owner corrections /12.11: Client/Manager OrderComposer→SignedDocumentsSection header file-add/empty-only uploader/preview-delete; readonly OrderDetail без mutations. Order/Support используют один MessageComposer/Thread и hold recording. Support create сохраняет required topic+text, detail REUSE HeaderAction(save)→own support list, local history/draft сохранены; follow-up остаётся explicit commDemo=1. [отчёт и ручной чек-лист](COMM_DOCS_2026-11-12.md), [draft PR #46](https://github.com/SigmeD/flexomir_os/pull/46). Четыре ширины одной реализацией, D09/production отдельно.

Accepted rollout11.11: FOS03 PageHeader.status below-title → Client/Manager Composer/Detail (включая Manager DEMO-002); Manager Composer32/24 без query. FOS12 ArtworkSource → все Client/Manager New/Edit/Repeat и production без DEV gate. Owner принял references и поручил подключение/merge; не весь кабинет/API. [Матрица источников и QA](ACCEPTED_UI_ROLLOUT_2026-11-11.md). Предыдущие пилотные записи ниже — история.

FOS12 /11.11: Client New/Edit/Repeat Item1791:6130/1782:6025 → ArtworkSource634:445 → один DEV-пилот artworkStates=pilot. Empty/local/library/unavailable/HELP, native chooser/picker и сохранение исходных ID/dirty&&valid. Другие consumers reference. Новые selected/unavailable states OWNER VISUAL OPEN, не screen parity PASS. [Карта/контракт](FOS12_ARTWORK_STATES_PILOT_2026-11-11.md), [QA](FOS12_REPORT_2026-11-11.md).

FOS03 /10.11: Manager draft0/1 D2569:24648/24539,T24851/24757,M25041/24945 → один `OrderComposer` DEV reference `?view=manager-orders&composeSpacing=pilot`. [Source map/план](FOS03_MANAGER_SPACING_PILOT_2026-11-10.md), [QA/Owner gate](FOS03_REPORT_2026-11-10.md). Размеры контролов/даты/сценарии прежние; полный screen parity и rollout не присвоены.

Актуальная продуктовая база: main a400b9d, PR #31 MERGED 10.11.2026. Матрица ниже хранит исходные 69 сравнений на head51d93be. Позже Owner поручил унифицировать ширину дат и добавить согласованный срок клиенту: эти изменения отдельно проверены на79d0529, финальный test-only head — f991bd77. Их 18 снимков в output/m8-client-agreed-date не подменяют старые 69 пар. Полная визуальная приёмка остаётся открытой.

## M8 / 10.11.2026 — исходная screen/state matrix после PR #30

Исходная база 9d1f5bc; рабочая ветка feat/m8-final-screen-qa затем слита в PR #31. Получены 69 новых Figma/React pairs:23 семейства × D1440/T768/M390. Каждый browser viewport равен конкретному frame, raw exports сохранены, crop через exact renderBounds, resize отсутствует. Авторский обзор не означает Owner acceptance или автоматический VISUAL PASS.

| Роль/состояние | Figma D/T/M | Общий React | Trigger → следующий state | Fresh pairs | Результат/ограничение |
| --- | --- | --- | --- | --- | --- |
| client-list | 634:6825 / 634:7368 / 634:7714 | OrdersList / GlassPillTabs | Фильтр → карточка → detail/back | [D](../output/m8-final/compare/chromium-client-list-d.png) / [T](../output/m8-final/compare/chromium-client-list-t.png) / [M](../output/m8-final/compare/chromium-client-list-m.png) | Owner GL03/type/menu/header delta |
| client-new | 1810:12510 / 1837:6359 / 1810:12545 | OrderComposer | 0/1/N items → valid send → Manager demo | [D](../output/m8-final/compare/chromium-client-new-d.png) / [T](../output/m8-final/compare/chromium-client-new-t.png) / [M](../output/m8-final/compare/chromium-client-new-m.png) | Owner dock/material delta; позже добавлен readonly agreed-date, отдельные снимки полей |
| client-item | 1791:6130 / 1837:6385 / 1791:6185 | OrderItemForm / ArtworkSource | validation/shape/material/local file/layout/help → save/cancel | [D](../output/m8-final/compare/chromium-client-item-d.png) / [T](../output/m8-final/compare/chromium-client-item-t.png) / [M](../output/m8-final/compare/chromium-client-item-m.png) | Owner dock/select/material delta |
| client-detail | 1838:6565 / 1838:6810 / 1838:7031 | OrderDetail / OrderItemSummary | read-only detail → back | [D](../output/m8-final/compare/chromium-client-detail-d.png) / [T](../output/m8-final/compare/chromium-client-detail-t.png) / [M](../output/m8-final/compare/chromium-client-detail-m.png) | Synthetic records, 1/N and long names; позже клиенту показан agreedDate, отдельные снимки полей |
| client-completed | 1846:2942 / 1846:2982 / 1846:3014 | OrderDetail / CompletedOrderMenu | repeat → new IDs/dates/artwork → composer | [D](../output/m8-final/compare/chromium-client-completed-d.png) / [T](../output/m8-final/compare/chromium-client-completed-t.png) / [M](../output/m8-final/compare/chromium-client-completed-m.png) | Synthetic records; repeat contract |
| manager-list | 2495:8871 / 2495:9000 / 2495:9097 | ManagerOrdersScreen / OrdersList | New/All → own/imported/private fixture detail | [D](../output/m8-final/compare/chromium-manager-list-d.png) / [T](../output/m8-final/compare/chromium-manager-list-t.png) / [M](../output/m8-final/compare/chromium-manager-list-m.png) | OPEN pilot Search/Company/Sort; current GL03 |
| manager-draft | 2569:24648 / 2569:24851 / 2569:25041 | OrderComposer / FOSSelect | company →0/1/N → private save, role isolation | [D](../output/m8-final/compare/chromium-manager-draft-d.png) / [T](../output/m8-final/compare/chromium-manager-draft-t.png) / [M](../output/m8-final/compare/chromium-manager-draft-m.png) | OPEN agreed-date/publication; no pixel-parity PASS |
| manager-item | 2570:12282 / 2570:12460 / 2570:12622 | OrderItemForm / ArtworkSource | same item fields/editor, private draft | [D](../output/m8-final/compare/chromium-manager-item-d.png) / [T](../output/m8-final/compare/chromium-manager-item-t.png) / [M](../output/m8-final/compare/chromium-manager-item-m.png) | Linked prototype; shared form scope |
| companies | 2498:10826 / 2498:10963 / 2498:11087 | CompaniesScreen / CompanyRow | search → company row → linked orders → back/focus | [D](../output/m8-final/compare/chromium-companies-d.png) / [T](../output/m8-final/compare/chromium-companies-t.png) / [M](../output/m8-final/compare/chromium-companies-m.png) | PILOT naming/scope; fixture copy |
| company-orders | 2499:9435 / 2499:9464 / 2499:9490 | CompanyOrders / OrdersList | search/status → scoped order → back/focus | [D](../output/m8-final/compare/chromium-company-orders-d.png) / [T](../output/m8-final/compare/chromium-company-orders-t.png) / [M](../output/m8-final/compare/chromium-company-orders-m.png) | Disabled sorting/reason; Owner Select delta |
| client-support-list | 634:8098 / 634:8228 / 634:8314 | SupportScreen / SupportTicketRow | own list → ticket/new/empty | [D](../output/m8-final/compare/chromium-client-support-list-d.png) / [T](../output/m8-final/compare/chromium-client-support-list-t.png) / [M](../output/m8-final/compare/chromium-client-support-list-m.png) | Owner shared header/dock; fixture text |
| client-support-new | 2412:10665 / 2412:10680 / 2412:10693 | SupportScreen / SupportTicketForm | subject/body → invalid/error → local submit | [D](../output/m8-final/compare/chromium-client-support-new-d.png) / [T](../output/m8-final/compare/chromium-client-support-new-t.png) / [M](../output/m8-final/compare/chromium-client-support-new-m.png) | CANDIDATE only scoped fields; no full parity PASS |
| client-support-detail | 634:8137 / 634:8263 / 634:8347 | SupportTicketDetail / PageHeader | breadcrumb → own list → opener focus | [D](../output/m8-final/compare/chromium-client-support-detail-d.png) / [T](../output/m8-final/compare/chromium-client-support-detail-t.png) / [M](../output/m8-final/compare/chromium-client-support-detail-m.png) | Fixed Client breadcrumb; synthetic messages |
| manager-support-list | 2605:32928 / 2605:33010 / 2605:33079 | SupportScreen / SupportTicketRow | own requester list, not Client operator | [D](../output/m8-final/compare/chromium-manager-support-list-d.png) / [T](../output/m8-final/compare/chromium-manager-support-list-t.png) / [M](../output/m8-final/compare/chromium-manager-support-list-m.png) | Linked Manager prototype, fixture text |
| manager-support-new | 2606:20379 / 2606:20390 / 2606:20399 | SupportScreen / SupportTicketForm | subject/message → invalid/error → local submit | [D](../output/m8-final/compare/chromium-manager-support-new-d.png) / [T](../output/m8-final/compare/chromium-manager-support-new-t.png) / [M](../output/m8-final/compare/chromium-manager-support-new-m.png) | Linked prototype; no real send |
| manager-support-detail | 2606:22577 / 2606:22823 / 2606:23030 | SupportTicketDetail / PageHeader | own ticket → own list → opener focus | [D](../output/m8-final/compare/chromium-manager-support-detail-d.png) / [T](../output/m8-final/compare/chromium-manager-support-detail-t.png) / [M](../output/m8-final/compare/chromium-manager-support-detail-m.png) | Manager breadcrumb retained; fixture reply |
| layouts-list | 634:8050 / 634:8193 / 634:8277 | LayoutBrowser / LayoutRow | list → concrete detail/local upload | [D](../output/m8-final/compare/chromium-layouts-list-d.png) / [T](../output/m8-final/compare/chromium-layouts-list-t.png) / [M](../output/m8-final/compare/chromium-layouts-list-m.png) | UI-only preview / full product scope OPEN |
| layouts-detail | 1316:1966 / 1316:2120 / 1316:2268 | LayoutDetail | concrete layout → back/focus | [D](../output/m8-final/compare/chromium-layouts-detail-d.png) / [T](../output/m8-final/compare/chromium-layouts-detail-t.png) / [M](../output/m8-final/compare/chromium-layouts-detail-m.png) | UI-only preview; no server download |
| layouts-upload | 1440:4989 / 1440:5209 / 1440:5419 | LayoutUploadForm / Panel | name/local file/preview/description → local save | [D](../output/m8-final/compare/chromium-layouts-upload-d.png) / [T](../output/m8-final/compare/chromium-layouts-upload-t.png) / [M](../output/m8-final/compare/chromium-layouts-upload-m.png) | File formats/storage OPEN; Owner action treatment |
| layouts-select | 1316:2015 / 1316:2165 / 1316:2315 | LayoutBrowser / OrderItemForm | parent breadcrumb/active Макеты → select → same Item | [D](../output/m8-final/compare/chromium-layouts-select-d.png) / [T](../output/m8-final/compare/chromium-layouts-select-t.png) / [M](../output/m8-final/compare/chromium-layouts-select-m.png) | UI-only scoped picker; parent/draft retained |
| layouts-selection-detail | 1316:2074 / 1316:2223 / 1316:2372 | LayoutDetail / OrderItemForm | concrete selected layout → same Item | [D](../output/m8-final/compare/chromium-layouts-selection-detail-d.png) / [T](../output/m8-final/compare/chromium-layouts-selection-detail-t.png) / [M](../output/m8-final/compare/chromium-layouts-selection-detail-m.png) | UI-only scoped picker; no API |
| layouts-select-upload | 1440:5059 / 1440:5275 / 1440:5486 | LayoutUploadForm / OrderItemForm | local file/name → select → same Item | [D](../output/m8-final/compare/chromium-layouts-select-upload-d.png) / [T](../output/m8-final/compare/chromium-layouts-select-upload-t.png) / [M](../output/m8-final/compare/chromium-layouts-select-upload-m.png) | UI-only scoped picker; no server success |
| manager-detail | 2560:10872 / 2560:10911 / 2560:10947 | OrderDetail / OrderDemoWorkspace | read-only details/demo pending/success/error → back | [D](../output/m8-final/compare/chromium-manager-detail-d.png) / [T](../output/m8-final/compare/chromium-manager-detail-t.png) / [M](../output/m8-final/compare/chromium-manager-detail-m.png) | PILOT demo state/1С contract OPEN |

На 69 capture не обнаружены horizontal overflow/pageerror/unloaded assets; все titles теперь Flexomir OS. Функциональные L1024/M320, короткие высоты, keyboard/touch/forced-colors/reduced-motion, negative states и axe проверяются suites, а не выдаются за несуществующие Figma frames. M7 final159/159 PASS. Full regression520 PASS/4 expected skips/0 FAIL; independent review PASS WITH RISKS(12 пар), CI отправленного head — [итоговый аудит M8](M8_FINAL_AUDIT_2026-11-10.md).

Общие явные различия: поздние Owner 14/18/500, sharedGlass/GL03/FE11, responsive dock и Account/header имеют приоритет над устаревшими screen instances; синтетические данные/число строк не подгоняются. Sidebar icons, Manager agreed-date/publication/search и Auth design остаются OPEN. Client Support breadcrumb исправлен по FOS, Manager label сохранён. P0/P1 не закрываются без конкретного evidence/reviewer решения.

## История предыдущих карт (не текущий статус)

## FE-DEBUG-02 / Issue #25 — рабочая область

| Reference / screens | Общий контейнер | Геометрия и проверка |
| --- | --- | --- |
| Client CORE / My Orders Desktop `634:6825`; AppShell content slot `637:119`; Page Header `2302:2138`; Order Row `685:195` | `.fos-orders-page__main[data-layout=standard]`, центрируется внутри `.fos-app-shell__content` — области справа от 240px Sidebar. Add/More остаются в PageHeader того же контейнера. | На 1920 исходный main был сдвинут на 120px, на 2560 — на 440px. После исправления center error ≤2px. В CURRENT 1440 main использует content gutters 72px, что сохранено. |
| Client/Manager Orders + detail/composer/item forms, Manager Companies, Client Layouts и nested picker, Support обоих ролей | Один standard contract в AppShell consumers; переиспользуются CabinetPage / ClientOrdersScreen / ManagerOrdersScreen. Manager wide-table mode пока не нужен. | `tests/workspace-layout.spec.ts`, `playwright.workspace.config.ts`: 7 маршрутов × 7 ширин × 3 engine; горизонтального overflow нет. Client Orders header/tabs/cards/actions проверены по общей левой и правой оси. |

Figma CURRENT compact references: My Orders 390 (`634:7714`) uses 20px content inset; Support M390 (`634:8314`) and Layouts M390 (`634:8277`) use 16px. These verified family-specific safe gutters remain. Current `max-width:1440px` is carried forward from React as a browser-checked candidate, not a confirmed design token. Full screenshots/metrics are local under ignored `output/playwright/workspace-layout/`; Owner visual approval remains OPEN.

## FE-DEBUG-01 / issue #23 — stand entry and route-state map, 08.11.2026

| Entry / state | React composition | Trigger → next state | Evidence / disposition |
| --- | --- | --- | --- |
| `/` default | `AppViews` → one `OrderDemoWorkspace(role="client", presentationMode)` → Client My Orders | Client/Manager selector updates role in place; shared new/send → Manager detail/demo result → Client detail | `tests/demo-entry.spec.ts`, `tests/demo-presentation.spec.ts`; full Chromium 338/338 and targeted cross-engine 147/147 per engine. D1440/T768/M390 captures are local/ignored. |
| `?demoTools=1` | Same workspace + separate technical QA strip | QA reset is separate from presentation role control; role/reset disabled while editor is dirty | Client and Manager dirty-state assertions; no URL change/reload on role switch. |
| `?view=glass-filter-lab` and other `view` routes | Existing explicit laboratory or direct cabinet screen | No lab becomes the default; unknown `view` returns Client with diagnostic | Filter tests now use the explicit lab URL; route-preservation coverage in `demo-entry.spec.ts`. |

These rows document the demo entry point and are not additional approved product screens. The existing M8 Figma screen/state audit below remains the cabinet visual source of truth; the stand wrapper has no new Figma master or Owner visual acceptance.

## M8 / FE-S05 #21 — CURRENT Client + Manager screen/state matrix, 08.11.2026

Sources: [Primary DS V2 `634:60`](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-60), [FOS masters `1688:532`](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1688-532), [Client UX V2 `634:6815`](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-6815), [Manager UX V2 `2495:8870`](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2495-8870), Drive CURRENT and Owner PR #22 comment. Rows group responsive variants and states of one shared screen, not Figma frames into separate React pages. `D/T/M` = 1440/768/390; `L/M320` = 1024/320. Comparison PNGs are under ignored `output/playwright/m8/figma-comparison/`; test-generated state captures under `test-results/` and `output/playwright/m8/`. `—` means no dedicated side-by-side PNG; functional test evidence is named instead. Screenshot comparisons are technical evidence, not Owner visual acceptance.

| Role / screen + state coverage | CURRENT Figma node(s) | Shared master → React consumer | Evidence / viewport | Expected → actual / severity / root cause | Reviewer / status |
| --- | --- | --- | --- | --- | --- |
| Shared shell, nav, header, More, responsive drawer; role navigation and focus return | DS `634:60`; shell `637:180`; header `2302:2138`; HeaderAction `1953:4168/2173:1425`; FOS controls `1688:532` | Shell/Nav/Drawer/PageHeader/HeaderAction/OverflowMenu → `AppShell`, `CabinetNavigation`, `NavigationDrawer` | Orders role captures D/T/M; `tests/navigation-drawer.spec.ts`, `tests/sidebar-nav.spec.ts`, `tests/header-action.spec.ts`; L/M320 in responsive suites | Keyboard, Esc, focus, touch and selected section work. Sidebar icon-vs-text appearance is unresolved in shared source; no confirmed P0/P1. | Independent regression PASS; icon visual question OWNER OPEN |
| Client Orders list: default, GL03 status filters, empty, row → detail, back | List `634:6825/7368/7714`; empty `1837:6275/6281/6287`; status examples `2009:5533…6014` | Orders/status/row masters → `ClientOrdersScreen`, `OrdersList`, `GlassPillTabs`, `OrderDetail` | `client-orders-d1440.png`; tests `client-orders.spec.ts`, `order-detail.spec.ts`, `glass-pill-tabs-react.spec.ts`, `gl03-compact-pill-tabs.spec.ts`; D/L/T/M | Filter, empty/list, detail/back and GL03 lens behave as approved component. Illustrative record text differs only in fixtures; no confirmed P0/P1. | Chromium regression PASS; GL03 accepted; Owner screen gate OPEN |
| Client detail: 1/N items; review, production, completed; date, More/repeat, back | `1782:6001/6074`; tablet `1837:6436/6469`; review `1838:6511/6764/6985`; production `1838:6565/6810/7031`; completed `1846:2942/2982/3014`; repeat `1846:3046/3092/3129` | OrderDetail / OrderItemSummary / OverflowMenu → `OrderDetail`, completed wrapper | detail D1440; tests `order-detail.spec.ts`; D/L/T/M; owner Figma/React pair representative | Read-only status/details and repeat create new demo IDs; approved statuses map only to existing presentation fixtures. Business status-to-1C mapping and ACL are external OPEN; no confirmed frontend P0/P1. | Functional regression PASS; visual Owner gate OPEN |
| Client New/Repeat order: 0/1/N items, valid/invalid, send, submitted, return | `1810:12510/1837:6359/1810:12545`; duplicate `1846:3046/3092/3129`; submitted `1994:5084` | Order form/fields/HeaderAction → shared `OrderComposer`, `OrderItemForm` | `client-orders-d1440.png`; `tests/order-compose.spec.ts`; D/L/T/M | Same-session draft values persist; disabled/valid send and read-only submitted state work. No production autosave or API success is implied. | Chromium/Firefox/WebKit targeted PASS; Owner screen gate OPEN |
| Client Item New/Edit and ArtworkSource: empty/invalid/dirty/clean/save/cancel, artwork HELP/local file/layout select/replace | New `1791:6130/1837:6385/1791:6185`; edit `1782:6025/1837:6509/1782:6119`; artwork master `634:445`; LAY picker below | ItemForm/FOS fields/ArtworkSource → `OrderItemForm`, `ArtworkSource`, `LayoutBrowser` | dedicated `client-item-new-{1440,1024,768,390,320}.png` after this QA; `tests/orders-figma-parity.spec.ts`, `tests/order-compose.spec.ts`; all five widths | Inputs, draft identity, field validation, cancel and local selection follow shared contract. Local file selection is not upload; no confirmed P0/P1. | Five-size capture + regression; Owner visual gate OPEN |
| Client Layouts library list/detail, upload; LAY03–06 select/replace; LAY07–09 upload variants | LAY01 `634:8050/8193/8277`; LAY02 `1316:1966/2120/2268`; LAY03 `1316:2015/2165/2315`; LAY04 `1316:2074/2223/2372`; LAY05 `1318:2371/2386/2401`; LAY06 `1318:2379/2394/2409`; LAY07–09 `1440:4989/5209/5419`, `5059/5275/5486`, `5128/5341/5552` | LayoutRow/Detail/Upload/LocalFileControl → `LayoutBrowser`, `LayoutDetail`, `LayoutUploadForm/Panel`, nested in `OrderItemForm` | comparison: `compare-layouts-{list,detail,upload,select,selection-detail,select-upload}-{d,t,m}.png`; `tests/m7-layouts.spec.ts`; D/L/T/M | Confirmed P1: while Item edit guard locked nav, active picker section `Макеты` also appeared disabled. Fixed at `ClientOrdersScreen`: active section stays enabled; peer destinations remain guarded. Parent context and item draft retained. | Test asserts active/enabled + peer disabled; five-size suite PASS; independent QA sampled parity, Owner visual gate OPEN |
| Client Support: list, new form, detail, submitted, empty/validation/error | list `634:8098/8228/8314`; new candidate `2412:10665/10680/10693` (approved FE-S03 field scope); detail `634:8137/8263/8347`; submitted `13565/13594/13608` | SupportRow/Form/Detail/ArtworkThumbnail → shared requester support screens | comparison `compare-support-{list,detail}-{d,t,m}.png`; `tests/m7-support.spec.ts`; D/L/T/M; test captures empty/error/submitted | Subject/body, requester detail, validation and retained input work on fixtures. No real send/async acknowledgement, category or attachment behavior is inferred. No confirmed P0/P1. | Regression PASS; candidate fields scoped by FE-S03; Owner visual gate OPEN |
| Manager Orders: New/All, GL03 status, empty/list, demo detail pending/success/error, back | list `2495:8871/9000/9097`; New/All `2523:10182/2524:10269/10404`; detail/status examples `2560:10872…` and `2634:20104` | ManagerOrders/OrdersList/OrderDetail/GL03 → `ManagerOrdersScreen`, shared `OrderDetail`, `OrderDemoWorkspace` | `manager-orders-{d1440,t768,m390}.png`; `tests/manager-orders.spec.ts`, `tests/fe-s04.spec.ts`; D/L/T/M | Existing FE-S04 New/All demo grouping and GL03 are present. PILOT Search/Company/Sort panel is absent and still lacks approved scope/semantics: intentionally deferred, not a parity defect. No P0/P1. | Regression PASS; ancillary panel OWNER OPEN |
| Manager private draft 0/1/N, company selection, Item New/Edit clean/dirty, artwork/layout picker | draft `2569:24648/24851/25041`, `2569:24539/24757/24945`, `2568:11735/11825/11900`; item `2570:12282/12460/12622`; edit `2571:13720/14129/14504`, dirty `2571:13976/14369/14752` | OrderComposer/ItemForm/ArtworkSource/Company selector → shared composer with manager-owned in-memory draft | `manager-orders-d1440.png`; `tests/fe-s04.spec.ts`, `tests/order-compose.spec.ts`; D/L/T/M; all five widths covered by responsive composer tests | Draft stays private from Client; fixture company selection and item edits use shared components. No company creation, publication, API or server storage. No confirmed P0/P1. | Regression PASS; Owner visual gate OPEN |
| Manager Companies: search/list, company-linked orders, company detail/back | list `2498:10826/10963/11087`; linked orders `2499:9435/9464/9490`; company details `2548:10426/10456/10484`, `10513/10543/10571` | CompanyRow + CompanyOrders + shared OrdersList/Detail → `CompaniesScreen`, `CompanyOrdersScreen` | comparison `compare-companies-{d,t,m}.png`; `tests/m7-companies.spec.ts`; D/L/T/M | Search, whole-row selection, scoped fixture orders, detail/back verified. Figma “Клиенты” vs product “Компании” naming is OPEN; keep existing label/source. No confirmed P0/P1. | Regression PASS; visual Owner gate OPEN |
| Manager requester Support: list, new, detail, submitted, empty/invalid/ready/error | list `2605:32928/33010/33079`; form `2606:20379/20390/20399`, `21778/21802/21822`; detail `22577/22823/23030`; submitted `23411/23481/23538` | Same SupportRow/Form/Detail → Manager requester support | comparison `compare-support-{list,detail}-{d,t,m}.png` (representative content); `tests/m7-support.spec.ts`; D/L/T/M | Requester-only flow and fixture validation checked. Operator tools, replies, real async send/API and persistent state are outside scope; no confirmed P0/P1. | Regression PASS; Owner visual gate OPEN |
| AuthCandidate | No approved CURRENT Auth Figma section/master | candidate `AuthCandidateScreen` reuses shared fields/actions | no Figma comparison | No approved visual reference; `OWNER_DESIGN_OPEN`; excluded from parity score and changes. | Owner design decision required |

**Audit result:** no confirmed P0; one confirmed P1 repaired (Client nested Layout picker’s selected nav item was disabled); independent reviewer reported no additional confirmed large-geometry P1 in sampled side-by-side comparisons. No other P1 accepted for repair. Manager Search/Company/Sort PILOT, Sidebar icons, Auth design, company naming, production API/1C/ACL/status semantics, real file storage and support async remain OPEN. Figma GL03 shared-master appearance is the approved source where stale screen styling differs. Do not interpret technical PASS as visual/product acceptance. Independent re-review is PASS WITH RISKS; GitHub workflows Orders Core UI QA, FE-S03 M7 UI QA and NavigationDrawer GL-02B QA all passed on PR head `515111d`.

**Evidence inventory:** 27 Figma↔React comparison PNGs (9 shared families × D/T/M) and `index.html` in ignored `output/playwright/m8/figma-comparison/`; role screenshots in ignored `output/playwright/m8/`; five-width item captures and scenario screenshots in `test-results/`. Tests reference direct CURRENT nodes and assert functional transitions. Full cross-role device-by-device image overlay was not generated for every listed state; those rows are recorded as test evidence or `—`, not falsely marked side-by-side VISUAL PASS. Independent QA and Owner screen acceptance remain separate gates.

## FE-S03 — итоговая трассировка Figma → React → переход, 07.11

| Figma CURRENT D/T/M | Shared React / consumer | Действие → следующий экран | Проверка / gate |
| --- | --- | --- | --- |
| Manager 02.1 2498:10826/10963/11087; row1189:984 | CompanyRow, FOSInput, CabinetPage | Поиск → целая строка → scoped CompanyOrders | A PASS five sizes / Owner OPEN |
| 2499:9435/9464/9490; company2 2548:10426/10456/10484; company3 2548:10513/10543/10571 | CompanyOrders + OrdersList/OrderDetail | Компания → только её fixture orders → та же деталь → Back | A identity/filter/focus PASS; real ACL OPEN |
| Client SUP01 634:8098/8228/8314; Manager 2605:32928/33010/33079 | SupportTicketRow/Form/Detail, ArtworkThumbnail60 | Свои обращения → Add → тема/описание → отправлено только в demo | B PASS both roles / candidate fields OUT |
| Client NEW2412:10665/10680/10693; Manager 2606:20379/20390/20399 | Shared FOSInput/Textarea + HeaderAction Send | Empty/invalid/ready → immutable own ticket | B empty/disabled/error/input retained PASS; real loading/API OPEN |
| Client DETAIL634:8137/8263/8347; submitted634:13565/13594/13608; Manager 2606:22577/22823/23030 and23411/23481/23538 | Same SupportTicketDetail | Subject H1 stays stable → requester text + support-team reply → back | B PASS; author reply/delete/operator OUT |
| LAY01 634:8050/8193/8277 | LayoutBrowser(library), LayoutRow1313:2182 | My Layouts → whole row → same layout detail | C PASS; five sizes |
| LAY02 1316:1966/2120/2268 | LayoutDetail + source/history action rows | Readonly detail → root/back | C PASS; download/history/More disabled, PROPOSED2101:7959 OPEN |
| LAY03 1316:2015/2165/2315; LAY04 1316:2074/2223/2372 | Same LayoutBrowser(select), LayoutDetail(picker) | New Item → My Layouts → detail → Choose → same unsaved Item | C PASS; no invented order/payment command |
| LAY05 1318:2371/2386/2401; LAY06 1318:2379/2394/2409 | Same LayoutBrowser(replace) | Edit Item → My Layouts → replacement detail → Choose → same Item | C PASS; old source replaced only in demo |
| LAY07 1440:4989/5209/5419; LAY08 1440:5059/5275/5486; LAY09 1440:5128/5341/5552 | One LayoutUploadForm/Panel1438:474 + LocalFileControl | Library/select/replace → local file/name/optional preview/description → demo metadata → detail/Choose | C PASS empty/selected/error/cancel; server files/policy OPEN |
| Shell637:180, header2302:2138, Primary1953:4168/2173:1425 | CabinetNavigation + AppShell/Drawer + HeaderAction/OverflowMenu | Available role destinations → after accepted spring → destination; input/context retained | D PASS; no new Glass engine / no API |
| LAY03 desktop 1316:2015 — parent breadcrumbs + active Sidebar | Historical FE-S03 checkpoint; superseded by M8 matrix above. Current picker context is preserved and `Макеты` remains active/enabled. | The earlier STRUCTURAL VISUAL OPEN statement is stale and must not be read as current parity status. | Current independent review and Owner visual gate remain separate. |

FUNCTIONAL and TECHNICAL evidence are separate from VISUAL/Owner acceptance. D1440/T768/M390 source pairs plus responsive L1024/M320; fixtures differ from illustrative company/status/date copy. Native readonly textareas follow shared FOS state and can differ from hand-styled frame overrides. No production status dictionary or server ACL claimed.


FE-S03 C checkpoint / PR #18: LAY01…09 UI preview реализован одним LayoutBrowser (library/select/replace), LayoutRow/Detail/UploadForm/UploadPanel; HeaderAction расширен Choose из Figma, shared material/motion сохранён. ArtworkSource использует общий LocalFileControl и один LayoutPicker в New/Edit Item. Выбор/замена возвращает тот же Item с полями/фокусом/scroll; local names и synthetic IDs живут только до reload. Build PASS; Chromium C 11/11 (5 размеров + empty/error/cancel), FE-S02 targeted regression 7/7. Axe 0 list/detail/upload; captures local output/fe-s03. История/More ведут в UX PROPOSED 2101:7959, disabled; download/server storage/ACL OPEN. Illustrated 20MB/formats не внедрены как policy. B mobile thumbnail уточнён по master2409:11521:60px, без локального 48px. A/B/C checkpoints выполнены, D integration/full QA next. Owner visual acceptance OPEN, merge запрещён без разрешения.

FE-S03 B checkpoint / PR #18: общий Support Client/Manager реализован по FR-SUP-001..006. Build PASS; Chromium 11/11 functional + 2/2 D/T/M visual-state suites, axe 0 на list/form/detail/submitted. Общие SupportTicketRow/Form/Detail + ArtworkThumbnail; субъект H1 сохраняется, отправка только в демосессии, owner data отдельно, fixture error сохраняет ввод. Category/attachments/author reply/delete/triage исключены; Client candidate form визуально сокращена до подтверждённых полей (Owner OPEN). Реальные server loading/ack/API не имитируются. A 614742f, B checkpoint next, C/D pending; merge не разрешён.

## FE-S03 / M7 — CURRENT execution and transition matrix, 06.11

Issue #17, approved Owner instruction: sequential A → B → C → D, one branch/PR. Base main 351157c, PR #16 merged. Historical baseline below is not current implementation status.

| Figma frame → component | Screen / action → next state | Gate |
| --- | --- | --- |
| Manager 2498:10826/10963/11087 → CompanyRow/FOSInput | clients list → whole row → company linked orders | A Chromium PASS / Owner OPEN |
| 2499:9435/9464/9490, 2548:10426…10571 → CompanyOrders/OrdersList | company summary + scoped orders → order → shared Manager OrderDetail | A QA pending |
| Prototype Company Row reactions, breadcrumb + shell | Back → scoped orders → filtered company list, same identity/focus/scroll | A QA pending |
| Client/Manager Support | B source mapping pending | OPEN |
| Client LAY-01…09 | C source mapping pending; full product scope OPEN | OPEN |

Figma company detail and linked orders are the same composition. Add company disabled; sort fixture-supplied/disabled pending contract. Server ACL, onboarding, 1C outside FE-S03.


**Проверено:** 06.11.2026 · React baseline `origin/main` `884e78f` (FE-S01 merged); FE-S02 в `feat/fe-s02-order-compose-flow` · Figma/Drive — read-only источники.
**Статус:** M4 inventory DONE / Owner product gate OPEN; это карта для реализации, **не изменение** SRS/Scope, Figma, маршрутов, backend/API/1С.
**Канонический план:** [Google Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit).

**FE-S01 / PR #14 MERGED:** C-01/C-02 и read-only C-03/M-04 на общих OrderDetail/OrderItemSummary в main `884e78f`. **FE-S02 / #15 в ветке:** A — C-04/C-06 New/Edit, B — C-05 completed Duplicate через тот же Composer, C — общий Client→Manager demo/read-only intake; текущий QA/PR см. PROJECT_STATE/HANDOFF. Никаких новых production routes, прав/1С или полного MVP этим не утверждено.

## Источники

- [Figma / Primary Design System V2](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-60) — согласованные foundations, page header, orders/status, order item templates.
- [Figma / Technical FOS Masters](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1688-532) — controls, navigation, OrderItem summary/form.
- [Figma / Client UX V2](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-6815) — CORE, states, Support; `UX PROPOSED`/архив отдельно.
- [Figma / Manager UX V2 CURRENT](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2495-8870) — актуальная секция `01 Заказы · 02 Компании · 03 Поддержка`; старые ARCHIVE не источник реализации.
- [SRS v0.5](https://docs.google.com/document/d/1EwjqQ3z_lO2lyDCQHhm-NIiDxgZzPrKOXAWR3tC-C4M/edit), [Scope MVP v0.3](https://docs.google.com/document/d/1-xAngGqyIBJg-Whyv7fMYKvwBa3mRonWtSp-O9mq5Mg/edit), [E2E CURRENT](https://docs.google.com/document/d/1aOeKYmlmh5hiNltnwIpsLnk7LtlhJ93ldlHVCTVG7Us/edit).
- Реальный React: `?view=client-orders` и `?view=manager-orders`, shared AppShell/Drawer, list/readonly detail в main. В FE-S02 оба preview используют `OrderDemoWorkspace`: New/Edit/Duplicate → демопередача → Manager без reload. Лаборатория `GlassFilterDemo` не заменяет клиентский кабинет.

## Статусы карты

## FE-S02 — проверка переходов Figma → React

Источник: Owner issue #15, тот же Draft PR #16. PASS ниже означает проверенный frontend переход на fixtures; не утверждение backend прав и не Owner visual acceptance. Фреймы: [Client CORE](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1782-6000), [supporting scenarios](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2026-6868), [Manager current](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2495-8870). Visual exceptions перечислены в Component Registry; unmatched state нельзя объявлять VISUAL_PASS.

| Figma frame/state | Действие | Ожидаемый следующий frame/state | React consumer/handler | Результат |
| --- | --- | --- | --- | --- |
| List `634:6825/7368/7714` | Header Add | Empty Order `1810:12510/1837:6359/1810:12545` | Client `createDraft/openCreatedOrder` → Composer | PASS: свежий ID, 0 items, Send disabled |
| Empty/1/N Composer, `1988:3939` | Secondary Add Item, Enter/touch | New Item `1791:6130/1837:6385/1791:6185` | `SectionAddItem` → Composer `addItem` | PASS: один ItemForm, фокус H1, единые поля |
| New Item `1791:6130`, `1953:4168` | Пусто/invalid, Header Add | Disabled до валидного ввода | `validDemoItem` + HeaderAction disabled | PASS: 0/дробное количество/отрицательная ширина/no artwork; локальные правила, API OPEN |
| Input `634:402`, Quantity `680:177` | Невалидное значение + blur | Error state + сообщение | FOSInput `aria-invalid/describedby` | PASS: ошибка связана с полем, action disabled |
| Print `2315:9747/943:263` | Flex/Digit/arrow keys | Выбран ровно один вариант | PrintingMethodControl → `update` | PASS: native radio/segmented, wide/compact |
| Artwork `634:445` | Upload/replace/drop | Local selected filename | ArtworkSource `selectFile` | PASS chooser/filename/replace UI; upload/storage OPEN, не success |
| Artwork `634:445` | HELP on/off | Exclusive HELP / empty Upload | ArtworkSource `onChange` | PASS: upload/library скрыты при HELP, прежний local file не переносится незаметно |
| New Item valid | Header Add | 1-item `1782:6001/1837:6436/1782:6103`, далее N | ItemForm `onSave` → Composer `saveItem` | PASS: item/order IDs стабильны, поля сохранены в памяти |
| Composer `1782:6074/1837:6469/1782:6160` | Вся строка позиции, Enter/touch | Edit `1782:6025/1837:6509/1782:6119` | OrderItemRow → `setEditing(item.id)` | PASS: одна форма, то же имя в H1/breadcrumb |
| Edit unchanged / valid dirty | Header Save | Disabled / возврат в тот же Composer | ItemForm guard + `saveItem` | PASS: ID тот же, изменённое количество/комментарий восстановлены при открытии |
| Edit More `1953:4210 → 1917:3311` | Cancel Changes `1917:3319` | Composer `1782:6074`, старые saved values | OverflowMenu → ItemForm `onClose` | PASS: несохранённая правка отброшена явно, фокус на строку |
| New More `1953:4227 → 1917:3323` | Cancel Input `1917:3329` | Composer `1810:12510`/исходный состав | OverflowMenu → `onClose` | PASS: позиция не добавляется, фокус на Secondary Add |
| More `1914:650` / menus `1914:655..676` | Arrow/Enter/Space/Escape/outside | Открытие/выбор/закрытие, корректный фокус | Один Radix OverflowMenu | PASS: Esc→trigger, navigating item→consumer, outside close |
| Dirty Item / navigation | Breadcrumb/Orders/смена роли | Нет неявной потери данных | dirty breadcrumb disabled; item editor guard; explicit Save/Cancel | PASS safe guard; production leave policy OPEN |
| Compact Drawer + все пункты disabled | Открытие/Tab/Escape | Dialog focus, Escape закрывает, inert снят | NavigationDrawer fallback focus | PASS; regression сохраняет старый spring/optics |
| Composer General fields `1169:437/681:203` | Ввод даты/комментария → список → открыть | Те же значения, без footer substitute | `save` → demo `saveDraft` | PASS ephemeral retention; server autosave не моделируется |
| Desktop breadcrumbs `2330:2346` / compact AppShell | Root Orders → list | Фильтр/scroll сохранены | AppShell host → `backToList/useOrderPreview` | PASS: desktop opener focus, compact drawer trigger focus; touch scroll сохранён |
| Valid Composer `1953:4170` | Send | Submitted `1994:5084`, readonly | `canSendDemo/onSend/sendDraft` → OrderDetail | PASS: explicit local send, повторный submit недоступен; API/1С OPEN |
| Client draft → Manager list | Смена demo роли до отправки | Draft отсутствует | Workspace scopes only sent drafts | PASS: private draft не появляется у Manager |
| Submitted → Manager list/detail `2500:9701` | Смена роли → открыть тот же ID | Те же items/date/comment | Shared store → OrdersList/OrderDetail | PASS data parity; proposed actions/ACL OPEN, agreed date readonly/Create disabled |
| Client completed `1846:2942/2982/3014`, production `1838:6565` / Manager detail | Открыть readonly Detail | Client один Date Field, Manager requested + agreed | Общий OrderDetail, role-specific fields | PASS: число полей на пяти ширинах; agreed date в модели не удаляется |
| Completed `1846:2942/2982/3014` | More → Duplicate | Repeat `1846:3046/3092/3129` | Completed thin wrapper → shared Overflow → `duplicateOrder` | PASS: новый Order и Item IDs, источник неизменён, даты/доступ к файлу сброшены |
| Repeat file unavailable | Open Item → HELP/новый файл → Save | Новый черновик готов к отправке | Тот же ItemForm/Composer | PASS: нет вымышленной связи со старым server file |
| Lists GL03 / empty `1837:6275/6281/6287` | Фильтр/empty/reset/reload | Реальное членство fixtures, честное empty | Client/Manager controlled filters, Workspace reset | PASS: выбранная роль/фильтр, детерминированный reset; нет persistence |
| Delete Draft/Item, Duplicate Item, My Layouts | Недоступное действие | Disabled до решения/контракта | Shared menu/Artwork guards | OPEN Owner/PO/API; не включено догадкой |
| Manager PILOT list `2495:8871/9000/9097` | «Новые/Все», поиск, компания, сортировка | Дополнительная панель списка | В текущем React только согласованные GL03 + OrdersList | OPEN Owner scope: панель не реализована; не подменять business semantics «Новые»/сортировки |

Тесты: `order-compose`, `order-detail`, `client-orders`, `manager-orders`, `orders-components`, `orders-figma-parity`; screenshots пяти ширин, Chromium/Firefox/WebKit. Полный итог текущего прогона — HANDOFF. Figma/React side-by-side и список исключений — Component Registry; визуальная приёмка Owner/merge заблокированы до закрытия gate.

- `PARTIAL`: есть часть рабочего React-экрана или общего шаблона, но не все сценарии/поля/переходы.
- `NONE`: отдельного React-экрана нет; даже если в Figma есть макет.
- `SHARED DONE`: компонент существует в `main`, не означает готовность всех экранов-потребителей.
- `DESIGN OPEN`: Figma `PILOT`, `CANDIDATE`, `PROPOSED` или контракт/Scope не утверждён; реализация допустимого MVP-сценария может опираться на SRS, но **не** автоматически включать эти варианты.
- Идентификаторы ниже — **ключи карты**, не утверждённые URL/React Router маршруты; продукционные pathnames — OPEN.

## Клиент / Client — уникальные композиции

| ID | Композиция / сценарий | Figma источник | React в main | Очередь и граница |
| --- | --- | --- | --- | --- |
| C-00 | Вход по e-mail: ссылка + код; доверенное устройство | SRS/Scope; CURRENT Client UX V2 **не показывает подтверждённого auth screen** | NONE | UI требуется MVP; до реализации проверить auth UX и контракт Алексея |
| C-01 | AppShell / клиентская навигация | DS Responsive Web Shell + Client UX; shared AppShell в React | SHARED DONE — Client подключён в PR #14 | Навигация новых разделов отдельно |
| C-02 | «Мои заказы», список, фильтр статусов, empty | [CLIENT CORE](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1782-6000), [status states](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2009-5532) | PARTIAL — list/filter/empty + QA в PR #14 | Только DEMO; API/data states отдельно |
| C-03 | Детали заказа: черновик/review/production/completed/cancelled, read-only states | [CLIENT CORE](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1782-6000), [supporting states](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2026-6868) | PARTIAL — общая readonly detail PR #14 | FE-S02 добавляет editor только для локально созданных demo drafts |
| C-04 | Новый заказ: пустой/1/2 позиции, готовность к отправке | CORE + supporting scenarios; [FOS Order Item templates](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2029-7296) | NONE в main | FE-S02/A ветка: общий Composer + Form, 0/1/N/edit/save/revert; send только демо |
| C-05 | Repeat Order: заполнение из старого заказа и сохранение как новый черновик | CLIENT supporting scenarios / duplicate / E2E Repeat | NONE в main | FE-S02/B ветка: completed More/Duplicate → тот же C-04, новые IDs, старые сроки сброшены; CR-REP исключён |
| C-06 | Позиция заказа: новая, редактирование, сохранение, ошибки/dirty | [CLIENT Item Prototypes](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1998-5203), [Review editing](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2015-6179) | NONE в main | FE-S02/A ветка: shared OrderItemForm Add/Edit, ID сохраняется; field schema/delete OPEN |
| C-07 | Макет в составе позиции: upload/choose/help (источник макета) | DS Artwork file states / E2E; My Layouts `SCOPE OPEN` | NONE | Нужный для заказа минимум — только по решению Scope; **полная библиотека My Layouts отдельно OPEN** |
| C-08 | Поддержка: мои обращения, новое (тема + описание), деталь, ответ/статус, отправлено | [CLIENT Support CORE](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1340-4351) + Scope FR-SUP | NONE | M7; только подтверждённые действия. Доп. ответ/удаление/черновик = UX CANDIDATE/OPEN |

## Менеджер / Manager — уникальные композиции

| ID | Композиция / сценарий | Figma источник | React в main | Очередь и граница |
| --- | --- | --- | --- | --- |
| M-01 | AppShell / навигация менеджера | [Manager CURRENT](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2495-8870) + DS | SHARED DONE; используется в Manager Orders | Реально готов только shell; пункты будущих разделов пока disabled |
| M-02 | Все заказы, GL-03 статусы, cards, empty | [Manager 01.1](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2633-20095) | **PARTIAL** `ManagerOrdersScreen`, `OrdersList`, `OrderCard` | В main; `Новые/Все`, Company filter/search/sort, реальная навигация ещё OPEN |
| M-03 | «Новые заказы» — очередь менеджера | Manager 01.1 — `PILOT / DEMO scope OPEN` | NONE | M6; UX queue semantics и API-контракт ждут Owner/PO/Алексея; не выводить бизнес-фильтр из demo-статуса |
| M-04 | Детали заказа / подтверждение/согласование и статусы ожидания 1С | [Manager 01.2](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20104), [01.6](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20161) | PARTIAL — readonly detail PR #14 | FE-S02/C ветка: тот же переданный Client Order; срок/Create disabled до API/ACL, manager processing не реализован |
| M-05 | Создание менеджером для существующей компании, private draft 0/1/N items, позиции | [Manager 01.3](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20114) | NONE | M6; UI-пилот по подтверждённым UX-полям; private/publish/ACL контракт OPEN |
| M-06 | Выбор/загрузка макета для позиции менеджера | [Manager 01.4](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20129), [01.5](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20144) | NONE | Не принимать всё STAGE7 как MVP автоматически; reuse с C-07, Scope Gate |
| M-07 | Компании: список, деталь компании, заказы компании | [Manager 02.1](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20095) | NONE | M5–M7; не включать новый onboarding компании |
| M-08 | Свои обращения менеджера: список, новое, деталь, отправлено, ответ | [Manager 03.1](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20172) | NONE | M7; manager НЕ оператор поддержки, не видит обращения клиентов |

## Сквозные моменты и OPEN (не терять)

1. `Authentication` входит в Scope, но утверждённый Client+Manager вход по e-mail не найден как отдельный CURRENT screen. Нужны UX и контракт входа до agent implementation.
2. SRS включает роль `Administrator`, но здесь проектируем два пользовательских кабинета Client+Manager; scope админ-интерфейса и UX — OPEN для владельца (не создавать «третий кабинет» по догадке).
3. Меню менеджера: `Клиенты` в React, `Компании` в CURRENT архитектуре. Уточнить продуктовый label; не переименовывать молча.
4. `В работе` — UI label Owner APPROVED. Real mapping состояний 1С и queue `Новые` — backend/PO contract Алексея; не hardcode в React.
5. Order / Item required fields, permissions, editable states, 1C pending/success/error mapping, multi-item Repeat — OPEN contracts; допустима визуальная композиция на fixtures, но не выдуманная серверная логика.
6. `My Layouts` full library, расширенные Support actions (reply/delete/attachments/drafts), Dashboard владельца, CRM/оплата/производство вне автоматического MVP. На Figma наличие макета не заменяет scope approval.
7. Product routes в React пока не введены (есть `?view=...` лаборатории). Рекомендуемые key/paths не утверждены. Нужна схема навигации перед включением живых переходов.
8. Текущий код React в `main` — один экран менеджера + shared UI. Ни одна Client composition не реализована: `GlassFilterDemo` в `App.tsx` — технический полигон, а не кабинет.

## Готовый backlog для React-агента (после M4 карты, строго по зависимостям)

**FE-S01 / блок A. Client AppShell + «Мои заказы» — [GitHub issue #12](https://github.com/SigmeD/flexomir_os/issues/12)**

- После слияния документационного PR #11 из актуального `main` создать обычную ветку `feat/fe-s01-orders-core` в основной папке. Один React-инкремент, два последовательных блока A/B, один итоговый React PR вместе с LIVE docs; после каждого блока — проверка, коммит и короткий handoff. Только React / `src/screens/client-orders/*`, одна preview-точка в `src/App.tsx`, существующие `AppShell`, `GlassPillTabs`, `OrderCard`. Не редактировать core Glass/Sidebar/Drawer material/motion/CSS.
- Реализовать список из synthetic fixtures + status filtering, empty/loading/error *UI demonstrations* (никакого фальшивого реального network request), адаптивы D1440/L1024/T768/M390/M320. Не вводить API/1C enums, ACL, не объявлять dashboard.
- Передать: React-screen, fixtures, Playwright, CI build, screenshots/evidence, `docs/PROJECT_STATE`/`COMPONENT_REGISTRY`/`HANDOFF` и Drive этап. Гейт: CODE+QA; Owner UI acceptance отдельно. Не merge автоматически.

**FE-S01 / блок B той же задачи. Общий OrderDetail + OrderItemSummary для Client + Manager**

- Реализовать **presentation-only shared components** с вводом props по утверждённым VIEW полям (не копировать неполный 1C schema), варианты read-only/allowed UI states.
- Сначала подтвердить потребителей C-03 и M-04; одна форма для двух ролей, адаптивы, fixtures, empty/error/loading. Не писать manager-команды создания/публикации или client editing, пока они не согласованы.
- Дать открыть выбранный заказ и вернуться к списку внутри обоих preview; сохранить ID/статус/фильтр без production routes и бизнес-команд. Shared order primitives и preview-экраны — в той же ветке и итоговом PR, что блок A. Не менять core Glass. Проверить обе роли и обновить LIVE docs.

**FE-C03 / AFTER FE-S01. Client New/Repeat draft + OrderItemForm — следующий инкремент**

- Доработать карту поведения формы: 0/1/N позиций, add/edit/save/dirty, New vs Repeat как варианты ОДНОЙ React формы; file sources только в явно подтверждённом Scope.
- Демо-переход клиентский список → деталь → New/Repeat → draft; без реальных запросов и без придуманной схемы 1С. Manager processing UI вынести в последующий отдельный agent ticket.
- Отдельный gate на контракт Item/Artwork и role action permissions.

**FE-M04 / AFTER SHARED. Manager detail/queue and linked demo**

- Переиспользовать общую деталь из FE-S01 и будущие FE-C03 компоненты, дополнить Manager processing. `Новые/Все` как business queue только после согласования semantics, не путать со статусами.
- Построить связанную mock-сессию Client → Manager → Client, без псевдоинтеграции с 1С, подтверждённые пункты меню становятся доступными лишь после готовых роутов.

**FE-SUP + FE-COMP / AFTER CORE. Support Client+Manager, затем Companies Manager**

- Support только FR-SUP MVP: собственные тикеты, тема/описание, отправка, статус/ответ; не создавать интерфейс оператора поддержки и не реализовывать предложенные reply/delete.
- Companies: список компаний/деталь/связанные заказы менеджера, без onboarding новых клиентов.

**Для любого агента:** сначала `AGENTS.md`, `README.md`, `docs/PROJECT_STATE.md`, `docs/DELIVERY_PLAN.md`, этот M4 map + актуальные CURRENT Drive/Figma; проверить Git status/HEAD и локальные незакоммиченные изменения. Один законченный инкремент = один React PR с LIVE docs; внутри — небольшие проверяемые блоки и коммиты. FE-S01 включает A и B в одной ветке. Не работать одновременно с другим агентом в `src/App.tsx` или shared CSS; не трогать `main` напрямую. Ответственность Алексея: backend/API/1C, вне agent-задач React.

## Результат M4 и переход

- Инвентаризация Figma/Drive/GitHub — **выполнена**; Figma/Scope утверждены НЕ автоматически.
- Экранная карта построена; auth/admin/labels/queue/layouts остаются **Owner/PO OPEN**. Узкая реализация FE-S01 A/B разрешена отдельной задачей #12 без ожидания backend; не расширять её на New/Repeat, Companies, Support и интеграции.
- Рекомендация: не делать заново архитектуру в Figma и не полировать GL03; перейти к первому Client-screen после согласования карты, затем общий OrderDetail и связанный сценарий между ролями.
