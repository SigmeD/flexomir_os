# Flexomir OS — экраны и переходы

Обновлено 13.11.2026. Реализация — React на синтетических данных; backend-ready и полная visual acceptance не присвоены. [Статус](PROJECT_STATE.md), [компоненты](COMPONENT_REGISTRY_2026-11-06.md), [решения](DECISIONS.md).

## Действующие композиции

| Роль / экран | Общие компоненты | Основной переход | Ограничение |
| --- | --- | --- | --- |
| Client / Заказы | ClientOrdersScreen, OrdersList, GlassPillTabs, OrderDetail | Фильтр → карточка → detail → назад | Fixture-поиск/фильтр не заменяет API |
| Client / Новый, повтор, правка | OrderComposer, OrderItemForm, ArtworkSource, OrderDateFields | 0/1/N → valid save/send → Manager demo | Повтор создаёт новые IDs; согласованный срок не наследуется |
| Manager / Новые, все, детали | ManagerOrdersScreen, OrdersList, OrderDetail | Новый Client submission → открыть → demo processing | Реальная очередь/1С/ACL OPEN |
| Manager / Заказ для компании | Тот же OrderComposer/ItemForm | Компания → private draft → позиции → save | Private draft не показывается Client |
| Обе роли / позиции Draft/Review | OrderItemForm, OverflowMenu, ConfirmDialog | Duplicate → editor → Add/cancel; Delete → confirm | До передачи в1С; последняя Review-позиция защищена |
| Обе роли / переписка | ConversationPanel, MessageComposer/Thread | Send → own unread edit/delete → read lock; Copy текста | Work фиксирует старую историю; новая сохраняет CRUD до read |
| Обе роли / подписные документы | SignedDocumentsSection, preview/PDF, FileDropzone | Header Add → preview/download/delete | Big dropzone только empty; readonly Detail без mutations |
| Обе роли / поддержка | SupportScreen, Form/Detail/Row, HeaderAction(save) | Создать → detail → follow-up/edit → Save → own list; delete → list | Save dirty && valid; Duplicate payload OPEN; Manager не оператор |
| Client / Мои макеты | ClientLayoutsScreen, LayoutBrowser/UploadPanel | Browse → preview / выбрать в позицию | Реальная библиотека, версии, storage и ACL №10/13 OPEN |
| Manager / Компании | ManagerCompaniesScreen, общие карточки/заказы | Компания → detail + её заказы | Только существующие fixtures; без нового onboarding |
| Обе роли / Профиль | ProfileSettingsScreen, AccountMenu | Save; leave → save/discard/остаться | Локальная память; visual/API OPEN |
| Auth | AuthCandidateScreen | Изолированный UI-кандидат | Нет утверждённого Auth UX или реального входа |

Общие проверки: deep link и Back, dirty guard, empty/error/disabled, длинные строки, focus/Escape/outside-click, scroll и touch. Desktop Sidebar и compact Drawer используют один AppShell. Production backend, возврат статуса и closed/cancelled workflows не выводятся из текущих демопереходов.

## Визуальные доказательства M8

Issue#21: U03/U04 приняты Owner; U05 общие presentation строки Company/Order/Layout/Support и readonlyOrder подключены, U06 один material preset в DocumentPreviewDialog. [Текущая карта consumers,78targeted/129PNGpairs и gate](UI_UNIFICATION_2026-11-13.md). U06 visual OPEN, таблица10.11 ниже историческая. Сценарии и доменные права не менялись.

Следующая матрица — конкретный набор сравнения 10.11, а не снимки текущего приложения. Более поздние №03/05/06/07/12 и COMM-DOCS проверяются по собственным контрактам. Исходные Figma IDs и ссылки сохранены для повторного QA; output-файлы локальные/ignored. Отсутствие локального файла означает, что доказательство нужно получить из соответствующего CI или воспроизвести, а не объявлять актуальным.

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

## Индекс исходных Figma-композиций

ID сохраняются для трассировки требований. Старые NONE/PARTIAL и планы реализации удалены: действующая композиция описана выше. Наличие кадра не утверждает новые API, ACL или функции.

| ID | Композиция | Figma / источник |
| --- | --- | --- |
| C-00 | Вход по e-mail: ссылка + код; доверенное устройство | SRS/Scope; CURRENT Client UX V2 **не показывает подтверждённого auth screen** |
| C-01 | AppShell / клиентская навигация | DS Responsive Web Shell + Client UX; shared AppShell в React |
| C-02 | «Мои заказы», список, фильтр статусов, empty | [CLIENT CORE](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1782-6000), [status states](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2009-5532) |
| C-03 | Детали заказа: черновик/review/production/completed/cancelled, read-only states | [CLIENT CORE](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1782-6000), [supporting states](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2026-6868) |
| C-04 | Новый заказ: пустой/1/2 позиции, готовность к отправке | CORE + supporting scenarios; [FOS Order Item templates](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2029-7296) |
| C-05 | Repeat Order: заполнение из старого заказа и сохранение как новый черновик | CLIENT supporting scenarios / duplicate / E2E Repeat |
| C-06 | Позиция заказа: новая, редактирование, сохранение, ошибки/dirty | [CLIENT Item Prototypes](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1998-5203), [Review editing](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2015-6179) |
| C-07 | Макет в составе позиции: upload/choose/help (источник макета) | DS Artwork file states / E2E; My Layouts `SCOPE OPEN` |
| C-08 | Поддержка: мои обращения, новое (тема + описание), деталь, ответ/статус, отправлено | [CLIENT Support CORE](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1340-4351) + Scope FR-SUP |
| M-01 | AppShell / навигация менеджера | [Manager CURRENT](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2495-8870) + DS |
| M-02 | Все заказы, GL-03 статусы, cards, empty | [Manager 01.1](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2633-20095) |
| M-03 | «Новые заказы» — очередь менеджера | Manager 01.1 — `PILOT / DEMO scope OPEN` |
| M-04 | Детали заказа / подтверждение/согласование и статусы ожидания 1С | [Manager 01.2](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20104), [01.6](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20161) |
| M-05 | Создание менеджером для существующей компании, private draft 0/1/N items, позиции | [Manager 01.3](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20114) |
| M-06 | Выбор/загрузка макета для позиции менеджера | [Manager 01.4](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20129), [01.5](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20144) |
| M-07 | Компании: список, деталь компании, заказы компании | [Manager 02.1](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20095) |
| M-08 | Свои обращения менеджера: список, новое, деталь, отправлено, ответ | [Manager 03.1](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20172) |

Открытые противоречия: Auth и Administrator scope, название «Клиенты/Компании», mobile caption/Compact48, tabs/dropdown, согласованный срок и события1С. Их владельцы и ограничения — в [реестре решений](DECISIONS.md#открыто-кто-должен-решить). Подробные Figma master/variant refs — в контрактах из [индекса](README.md#контракты-и-доказательства).
