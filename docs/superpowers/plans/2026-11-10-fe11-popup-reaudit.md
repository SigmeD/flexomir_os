# FE11 popup re-audit — план пилота

**Источник:** поручение Owner `D:/downloads/FLEXOMIR_FE11_POPUP_UNIFICATION_REAUDIT_2026-11-09.md`.
**База:** свежий `origin/main a9ffa8a`, PR #29 уже MERGED в `03238af`.
**Ветка:** `feat/fe11-popup-unification-reaudit`; одна поставка, без merge.
**Уточнение Owner 10.11:** сохранить общую роль **14/18/500**, несмотря на 13/18/600 в исходном задании.

Применяются навыки architecture-impact-analysis, systematic-debugging, vision-first-ui, writing-plans и verification-before-completion. Исполнение — последовательно в основной папке; независимый reviewer работает read-only.

## Границы и решения

- Пять frozen sources + manifest, spring, overlap/scale formula не меняются.
- Пилот включается только в dev через `popupPilot=1`; обычные маршруты сохраняют прежнее поведение до Owner rollout gate.
- Один публичный `FosPopup` компонует существующие Surface + Rows; material и hover driver не являются props потребителя. Semantic mode отделяет действия от настоящего выбора.
- В action-menu нет initial selectedId и aria-selected. Активация — временный feedback, callback выполняется штатно, без таймеров и фиктивного ожидания анимации. Первая линза появляется в нажатой строке без придуманной начальной позиции. Навигация может размонтировать popup; это ограничение кандидатного action-adapter требуется показать Owner.
- Узкий FOSGlassSelect adapter сохраняет реальный native select для value/change/required/FormData/reset, а видимый trigger открывает React listbox. Нативный FOSSelect API не меняется; focus/key события нового адаптера относятся к видимой кнопке. Нативный popup не вызывается. Не подделывать React ChangeEvent.
- Только «Форма» и «Материал» включают form pilot. Компания/фильтры/disabled sorting остаются native до отдельной проверки/rollout.
- Drawer — визуальный и motion эталон, не переписывается ради пилота. Его переход на публичный API и cleanup старого API — после приёмки, не массово заранее.

## Карта компонентов и влияние

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
- [ ] Показать Drawer reference, Account D/M, More, Shape/Material D/T/M; отдельное описание first-action behavior.
- [ ] Явная Owner visual acceptance. До неё массовая migration, Figma sync и версия APPROVED запрещены.

## D/E — после приёмки (не разрешены автоматически)

- [ ] Миграция всех согласованных потребителей через public API и удаление legacy drivers/CSS.
- [ ] Полный Playwright + cross-browser, a11y, screen-by-screen regression; все FAIL и skips отражены отдельно.
- [ ] Релевантные LIVE docs и один PR; merge только по отдельному поручению.

## Инвентаризация текущих потребителей

| Потребитель | Trigger / semantic contract | Visual / selection | Lifecycle / layout | Пилот |
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
