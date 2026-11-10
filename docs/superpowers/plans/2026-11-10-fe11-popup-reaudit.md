# FE11 popup re-audit — план и выполнение rollout

**Источник:** поручение Owner `D:/downloads/FLEXOMIR_FE11_POPUP_UNIFICATION_REAUDIT_2026-11-09.md`.
**База:** свежий `origin/main a9ffa8a`, PR #29 уже MERGED в `03238af`.
**Ветка:** `feat/fe11-popup-unification-reaudit`; одна поставка, без merge.
**Уточнение Owner 10.11:** сохранить общую роль **14/18/500**, несмотря на 13/18/600 в исходном задании.

**Owner gate C закрыт:** ответ «да подтверждаю» на показанный пилот и action-adapter behavior. Разрешены этапы D/E в той же ветке/PR #30; merge отдельно. CI пилотного head ef8d439 — m7/screen SUCCESS.

**Ruling для rollout:** общий FosPopup допускает только listbox semantic-row slot для сохранения существующего compound API GlassSelect (consumer не собирает Surface/Rows). Drawer передаёт данные/семантическую nav-обёртку; physics/controller неизменны. Form fields используют один канонический FOSSelect с узким string single-select контрактом; существующие реальные consumers не используют multiple/size/native focus callbacks. Общий observer actual rest переиспользуется обоими select adapters. Исторический native API не выдаётся за автоматически совместимый.

Применяются навыки architecture-impact-analysis, systematic-debugging, vision-first-ui, writing-plans и verification-before-completion. Исполнение — последовательно в основной папке; независимый reviewer работает read-only.

## Границы и решения

- Пять frozen sources + manifest, spring, overlap/scale formula не меняются.
- На этапе B пилот включался только в dev через `popupPilot=1`. После приёмки C флаг удалён; D распространяет общий API на обычные маршруты.
- Один публичный `FosPopup` компонует существующие Surface + Rows; material и hover driver не являются props потребителя. Semantic mode отделяет действия от настоящего выбора.
- В action-menu нет initial selectedId и aria-selected. Активация — временный feedback, callback штатный, без таймера. Первая линза в нажатой строке без придуманного origin; навигация может размонтировать popup. Owner принял этот контракт в C.
- Пилотный FOSGlassSelect после проверки реальных consumers стал каноническим FOSSelect; временный alias удалён. Реальный native select сохраняет value/change/required/FormData/reset, visible button открывает React listbox и получает focus/key. Multiple/size не обещаются совместимыми. React ChangeEvent не подделывается.
- В D мигрированы Shape/Material, Manager company, CompanyOrders filter/disabled sorting и lab. Статус «Все статусы» не placeholder, reason disabled sorting сохранён.
- Drawer перешёл на public composition после C; его physics/controller, семантика и route lifecycle сохранены. GlassSelect сохранил compound Item API через listbox-only semanticRows slot. Старый Surface hover driver/CSS удалён.

## Карта компонентов пилота B (история)

Итоговая карта после D — [реестр компонентов](../../COMPONENT_REGISTRY_2026-11-06.md).

| Источник / вариант | React / решение | Состояния / потребители |
| --- | --- | --- |
| Owner re-audit + FOS Account `3038:2667`; identity 16/20/600 + 12/16 preserved | CREATE `FosPopup`, EXTEND opt-in `AccountMenu` | Client/Manager, D/L/T/M; identity unchanged, flat actions, disabled unchanged, Escape/outside/profile focus |
| Sidebar `634:511`, frozen FE11-v0.2 | REUSE Surface + Rows internals | Одна material family, no hover retarget, геометрический scale; исходные hashes обязательны |
| More `1914:650/655` + новое разрешение Owner | EXTEND opt-in `OverflowMenu` | Add/delete confirmation/cancel/duplicate; actions and trigger unchanged |
| Select Field `1148:311`, 44px, Default/Focus/Error/Readonly | CREATE `FOSGlassSelect` form popup adapter; KEEP `FOSSelect` | Shape then Material, label/required/value/onChange/FormData/reset/error/disabled/readonly |
| Drawer / existing GlassSelect / CompanyOrders / Manager company | KEEP / DEFER rollout | Инвентаризация ниже; baseline behavior сохраняется |

## A — аудит и baseline

- [x] Прочитать задание, CURRENT AGENTS, Git, freeze manifest, локальные документы.
- [x] Сверить Drive CURRENT frontend и Glass contract; прочитать CURRENT Figma Account/Nav/Select masters. Они сохраняют старые separators/type; новое Owner-направление управляет пилотом, Figma не изменяется.
- [x] Независимый read-only аудит контрактов: real form bridge обязателен; fake selected запрещён; first activation не имеет travel origin; не копировать timeout из Drawer.
- [x] Снять свежие baseline screenshots + DOM/computed CSS и контрольные суммы.

## B — минимальный пилот

- [x] Сначала тесты изоляции, Account без separators/fake selected, единая composition, Shape/Material listbox и сохранение значений; подтвердить baseline FAIL.
- [x] Реализовать публичный composition и opt-in Account/More; оставить profile identity и callback/focus contracts.
- [x] Реализовать один form adapter с native form plumbing; подключить только два поля в opt-in режиме.
- [x] Проверить label/value/required/error/disabled/readOnly/reset/submission, keyboard/Escape/outside/Tab/typeahead, flip/scroll, обе роли/пять ширин.
- [x] Build + frozen contract + адресная regression80/80, свежие screenshots и просмотр; финальная полная regression фиксируется в отчёте.

## C — приёмка пилота

- [x] Независимый adversarial review итогового diff и новых сценариев; найденные контракты исправлены и получили тесты.
- [x] Показать Drawer reference, Account D/M, More, Shape/Material D/T/M; описать first-action behavior.
- [x] Явная Owner visual/action acceptance пилота10.11. Разрешён следующий rollout; frozen engine approval не меняется и merge не разрешён автоматически.

## D/E — разрешены после приёмки10.11

- [x] Миграция всех согласованных потребителей через public API и удаление legacy drivers/CSS.
- [x] Адресный sync Figma style/Navigation/Account/More; датированный Select opening contract, сохранение identity/field roles и исторических descriptions.
- [x] Build PASS, adapters82/82, cross-browser124/124, независимый read-only review PASS после закрытия coverage gap GlassSelect.
- [x] Полный Playwright516 PASS/4expected skips/0FAIL, cross-browser124/124, frames4/4; доступность/экранная regression, независимый review PASS. Диагностические FAIL/skips отражены в отчёте.
- [x] Релевантные LIVE docs в одном PR #30; merge только по отдельному поручению. Статус CI фактического head и Drive синхронизируются после отправки.

## Baseline до задачи и объём пилота B (история)

| Потребитель | Trigger / semantic contract | Visual / selection до задачи | Lifecycle / layout | Пилот B |
| --- | --- | --- | --- | --- |
| AccountMenu | avatar/footer; Radix nonmodal menu | Surface sidebar + Rows fake profile; separators; shared14/18/500 | Radix portal z100; top/bottom, collision16; Escape/outside, consumer focus | opt-in real Client/Manager |
| OverflowMenu / CompletedOrderMenu | MoreAction; Radix menu | legacy hoverLens=true, no Rows; shared type | portal z50, end/collision16; Escape/outside/consumer focus | opt-in all real More consumers for review only |
| NavigationDrawer | hamburger; modal dialog + nav buttons | Sidebar material + Rows real route | z130; scroll lock/trap/inert, flip, selected travel, actual rest + historical fallback | reference / DEFER public migration |
| GlassSelect | button/listbox/options; value context | sidebar Surface + Rows real value | body portal z1000; flip/clamp/scroll, keyboard, outside/Escape/Tab | baseline / DEFER public migration |
| OrderItemForm FOSSelect ×2 | native select Shape/Material | OS popup; labels and field style separate | native form values/events/validation | opt-in only |
| CompanyOrders FOSSelect ×2 | status filter + disabled sorting | native | filtering/disabled contract | DEFER |
| OrderComposer FOSSelect | Manager company | native | selected company updates demo draft | DEFER |
| OrdersComponentsLab FOSSelect | native demo | native | controlled value | baseline / DEFER |
| ConfirmDialog | modal confirmation | separate dialog, not a menu | own portal/focus/dismissal | KEEP |

Браузерные материалы — ignored `output/playwright/fe11-reaudit/`; не подменять прежние доказательства.
