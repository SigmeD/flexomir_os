# M4 — карта экранов Flexomir OS Client + Manager

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
| Completed `1846:2942/2982/3014` | More → Duplicate | Repeat `1846:3046/3092/3129` | Completed thin wrapper → shared Overflow → `duplicateOrder` | PASS: новый Order и Item IDs, источник неизменён, даты/доступ к файлу сброшены |
| Repeat file unavailable | Open Item → HELP/новый файл → Save | Новый черновик готов к отправке | Тот же ItemForm/Composer | PASS: нет вымышленной связи со старым server file |
| Lists GL03 / empty `1837:6275/6281/6287` | Фильтр/empty/reset/reload | Реальное членство fixtures, честное empty | Client/Manager controlled filters, Workspace reset | PASS: выбранная роль/фильтр, детерминированный reset; нет persistence |
| Delete Draft/Item, Duplicate Item, My Layouts | Недоступное действие | Disabled до решения/контракта | Shared menu/Artwork guards | OPEN Owner/PO/API; не включено догадкой |

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
