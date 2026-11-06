# M4 — карта экранов Flexomir OS Client + Manager

**Проверено:** 06.11.2026 · React `origin/main` `89b043f9ae7e70a36a1eea8f5c98cd621e037aa9` · **READ-ONLY** Figma/Drive/GitHub.
**Статус:** M4 inventory DONE / Owner product gate OPEN; это карта для реализации, **не изменение** SRS/Scope, Figma, маршрутов, backend/API/1С.
**Канонический план:** [Google Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit).

**FE-S01 / branch progress, PR #14:** A — C-01/C-02 подключены; B — read-only C-03/M-04 на общих OrderDetail/OrderItemSummary и одном DEMO-наборе. Build + 180 Chromium + 58 Firefox/WebKit PASS локально; Draft / OWNER_OPEN / NOT_MERGED. Полные C-03/M-04 с редактированием/командами не объявляются готовыми. Колонка «React в main» ниже — исходный M4-снимок до merge; новые состояния карты синхронизировать после фактического слияния.

## Источники

- [Figma / Primary Design System V2](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-60) — согласованные foundations, page header, orders/status, order item templates.
- [Figma / Technical FOS Masters](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1688-532) — controls, navigation, OrderItem summary/form.
- [Figma / Client UX V2](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-6815) — CORE, states, Support; `UX PROPOSED`/архив отдельно.
- [Figma / Manager UX V2 CURRENT](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2495-8870) — актуальная секция `01 Заказы · 02 Компании · 03 Поддержка`; старые ARCHIVE не источник реализации.
- [SRS v0.5](https://docs.google.com/document/d/1EwjqQ3z_lO2lyDCQHhm-NIiDxgZzPrKOXAWR3tC-C4M/edit), [Scope MVP v0.3](https://docs.google.com/document/d/1-xAngGqyIBJg-Whyv7fMYKvwBa3mRonWtSp-O9mq5Mg/edit), [E2E CURRENT](https://docs.google.com/document/d/1aOeKYmlmh5hiNltnwIpsLnk7LtlhJ93ldlHVCTVG7Us/edit).
- Реальный React: `src/App.tsx` содержит preview `?view=manager-orders` и component labs; `src/components/layout/AppShell.tsx`, `src/screens/manager-orders/*`, `src/components/orders/OrderCard.tsx`. **Client routes/screens отсутствуют**. Демолаборатория `GlassFilterDemo` НЕ клиентский кабинет.

## Статусы карты

- `PARTIAL`: есть часть рабочего React-экрана или общего шаблона, но не все сценарии/поля/переходы.
- `NONE`: отдельного React-экрана нет; даже если в Figma есть макет.
- `SHARED DONE`: компонент существует в `main`, не означает готовность всех экранов-потребителей.
- `DESIGN OPEN`: Figma `PILOT`, `CANDIDATE`, `PROPOSED` или контракт/Scope не утверждён; реализация допустимого MVP-сценария может опираться на SRS, но **не** автоматически включать эти варианты.
- Идентификаторы ниже — **ключи карты**, не утверждённые URL/React Router маршруты; продукционные pathnames — OPEN.

## Клиент / Client — уникальные композиции

| ID | Композиция / сценарий | Figma источник | React в main | Очередь и граница |
| --- | --- | --- | --- | --- |
| C-00 | Вход по e-mail: ссылка + код; доверенное устройство | SRS/Scope; CURRENT Client UX V2 **не показывает подтверждённого auth screen** | NONE | UI требуется MVP; до реализации проверить auth UX и контракт Алексея |
| C-01 | AppShell / клиентская навигация | DS Responsive Web Shell + Client UX; shared AppShell в React | PARTIAL — shared AppShell готов, клиентское подключение отсутствует | M5 / использовать существующий AppShell |
| C-02 | «Мои заказы», список, фильтр статусов, empty | [CLIENT CORE](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1782-6000), [status states](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2009-5532) | NONE | **M5 P0**; reuse GlassPillTabs, OrderCard, AppShell |
| C-03 | Детали заказа: черновик/review/production/completed/cancelled, read-only states | [CLIENT CORE](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1782-6000), [supporting states](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2026-6868) | NONE | M5 P0; OrderDetail + OrderItemSummary, с проверкой разрешённых действий |
| C-04 | Новый заказ: пустой/1/2 позиции, готовность к отправке | CORE + supporting scenarios; [FOS Order Item templates](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2029-7296) | NONE | M5–M6; общий OrderEditor/ItemForm, mock-only |
| C-05 | Repeat Order: заполнение из старого заказа и сохранение как новый черновик | CLIENT supporting scenarios / duplicate / E2E Repeat | NONE | M6; **вариант C-04**, а не вторая форма |
| C-06 | Позиция заказа: новая, редактирование, сохранение, ошибки/dirty | [CLIENT Item Prototypes](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1998-5203), [Review editing](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2015-6179) | NONE | M5–M6; использовать shared OrderItemForm; backend field schema OPEN |
| C-07 | Макет в составе позиции: upload/choose/help (источник макета) | DS Artwork file states / E2E; My Layouts `SCOPE OPEN` | NONE | Нужный для заказа минимум — только по решению Scope; **полная библиотека My Layouts отдельно OPEN** |
| C-08 | Поддержка: мои обращения, новое (тема + описание), деталь, ответ/статус, отправлено | [CLIENT Support CORE](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1340-4351) + Scope FR-SUP | NONE | M7; только подтверждённые действия. Доп. ответ/удаление/черновик = UX CANDIDATE/OPEN |

## Менеджер / Manager — уникальные композиции

| ID | Композиция / сценарий | Figma источник | React в main | Очередь и граница |
| --- | --- | --- | --- | --- |
| M-01 | AppShell / навигация менеджера | [Manager CURRENT](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2495-8870) + DS | SHARED DONE; используется в Manager Orders | Реально готов только shell; пункты будущих разделов пока disabled |
| M-02 | Все заказы, GL-03 статусы, cards, empty | [Manager 01.1](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2633-20095) | **PARTIAL** `ManagerOrdersScreen`, `OrdersList`, `OrderCard` | В main; `Новые/Все`, Company filter/search/sort, реальная навигация ещё OPEN |
| M-03 | «Новые заказы» — очередь менеджера | Manager 01.1 — `PILOT / DEMO scope OPEN` | NONE | M6; UX queue semantics и API-контракт ждут Owner/PO/Алексея; не выводить бизнес-фильтр из demo-статуса |
| M-04 | Детали заказа / подтверждение/согласование и статусы ожидания 1С | [Manager 01.2](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20104), [01.6](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20161) | NONE | M5–M6; read-only detail на fixtures сначала, затем действия только по подтверждённому контракту |
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
