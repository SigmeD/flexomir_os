# FE11 — единые меню и списки выбора

**Статус 10.11.2026:** пилот принят Owner ответом «да подтверждаю». Распространение реализовано и локально QA VERIFIED. Полная регрессия: 516 PASS / 4 expected skips / 0 FAIL. CI отправленного head сверяется по PR checks. Merge отдельно.

**Поставка:** [PR #30](https://github.com/SigmeD/flexomir_os/pull/30), ветка feat/fe11-popup-unification-reaudit от a9ffa8a. PR #29 ранее слит в 03238af. Пилотный code/test checkpoint 4bc4a5d, CI пилотного head ef8d439 SUCCESS; это не CI нового rollout head.

**Задание:** D:/downloads/FLEXOMIR_FE11_POPUP_UNIFICATION_REAUDIT_2026-11-09.md. [План и этапы](superpowers/plans/2026-11-10-fe11-popup-reaudit.md).

## 1. Что изменилось

Account, Drawer, More и GlassSelect подключаются через один FosPopup. Все реальные FOSSelect открывают общий React listbox. Флаг popupPilot, временный FOSGlassSelect и legacy hover driver удалены.

Owner отдельно подтвердил **Manrope 14/18/500**. Устаревший пункт 13/18/600 исходного задания не применяется. Профильный блок, заголовки, подписи и типографика закрытых полей сохранены.

В действиях нет фиктивной выбранной строки: hover/focus не двигают линзу, callback выполняется сразу, первая активация даёт feedback в нажатой строке без выдуманной стартовой позиции. Переход может размонтировать меню раньше окончания feedback. Этот контракт принят в пилоте.

В списках выбора данные меняются сразу и один раз, popup закрывается после фактической остановки существующей линзы. Escape/outside закрывают его сразу и сохраняют уже принятое значение. Новая физика, таймер закрытия и повторный callback не добавлялись.

Frozen reference f527bcb, пять engine sources и manifest сохранены. Backend, API, ACL,1С и бизнес-статусы не менялись.

## 2. Какие задачи решены

| ID / потребитель | Воспроизведённая причина | Итог / общий компонент | Что осталось адаптерным |
| --- | --- | --- | --- |
| R1 / пункты | Старые 15/20 уже отсутствовали: до задачи общая 14/18/500 | Сохранён один menu-item token с navigation/popup aliases | Identity, field labels/body, triggers отдельные |
| R2–R3 / Account | Три separators и hardcoded profile selection | FosPopup actions, свободный список без initial lens | Radix dismiss/focus; прежний профиль/disabled |
| R4 / Shape, Material | Native SELECT рисует OS popup | Канонический FOSSelect → FOSSelectPopup → FosPopup | Настоящий select proxy: change/value/required/FormData/reset |
| R5 / More | Legacy Surface hover driver без Rows | FosPopup actions, та же нейтральная оболочка | MoreAction, команды, disabled/reason/confirm/cancel/focus |
| R6 / Drawer | Consumer вручную компонует Surface/Rows | FosPopup navigation, прежний Rows | Dialog/nav wrapper, trap/scroll lock, route commit/close lifecycle |
| R7 / GlassSelect | Другой compound API и lifecycle | FosPopup listbox с semantic-row slot | Item/onClick cancellation, labels, theme/current/matte/dark |
| Manager company | Native select обновляет draft company | Канонический FOSSelect | Прежний draft callback, single-string value |
| CompanyOrders | Native status filter и disabled sorting | Канонический FOSSelect | Empty string = «Все статусы», не placeholder; disabled reason |
| OrdersComponentsLab | Native demo select | Канонический FOSSelect | Controlled demo value |
| ConfirmDialog | Отдельный confirmation dialog | Сохранён | Не превращается в меню |

FosPopup — единственное место композиции Surface + Rows. Actions type запрещает selectedId; semanticRows доступен только listbox. Layout slots сохраняют Drawer nav/classes без копирования материала. Surface содержит только оболочку; её Track/spring/hoverLens и legacy lens CSS удалены.

Общий usePopupSelectionRest наблюдает существующую линзу: settled/off, реальные top/height с точностью 0.75px и generation. Повторный выбор, Escape/outside, reset, замена value, disabled/unmount отменяют устаревшее завершение. Hook не рассчитывает движение и не исполняет бизнес-действия.

Form adapter поддерживает только single string value. Multiple/size и native select focus API не обещаются совместимыми; реальные consumers их не используют. onChange получает настоящий select event; focus/blur/key/autofocus относятся к видимой кнопке. Readonly сохраняет submitted value и пропускает required validation; disabled исключается из FormData. Controlled rejection сохраняет значение/ошибку родителя.

### Figma и требования

Адресный sync после Owner approval выполнен в [FOS Technical Masters](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv?node-id=1688-532):

- Создан shared text style FOS V2 / Menu / Item: Manrope Medium14/18/500, ID S:7b1a1bc5246031d4323a720db87c4aea89cc52e2,. Label MD не менялся.
- Navigation Item634:511 Default/Selected использует новую роль.
- Account set3042:2806,4 варианта: новая роль действий, скрыты 10 divider nodes с сохранением IDs; avatar/name/company сохранены.
- Header Overflow1914:655/658/663/668/673/676,2015:6085,2016:898,2033:1145: новая роль и нейтральная оболочка по Drawer shell, radius20. Команды не менялись, PROPOSED/CANDIDATE masters не затронуты.
- Select1148:311: датированный opening contract про общий React popup. Девять field text nodes, height44 и Default/Focus/Error/Readonly не менялись.

На мастерах записан датированный Owner delta; прежние descriptions сохранены ниже как история. SRS/Scope/Governance не переписаны. Static Figma effects описывают материал; spring/coverage/scale определяет frozen runtime. Sync мастеров не означает pixel parity всех экранов или release approval.

Ledger: output/design-system-state-fe11-2026-11-10.json. [Account](../output/playwright/fe11-reaudit/figma-synced-account.png), [More](../output/playwright/fe11-reaudit/figma-synced-more.png), [Navigation](../output/playwright/fe11-reaudit/figma-synced-navigation.png) после sync получены заново и просмотрены.

### Визуальные доказательства

Baseline снят до изменений; пять attachments исходного задания не выдаются за просмотренные. После rollout сняты 43 свежих screenshot обычных маршрутов без флага на 1440/1024/768/390/320. Профильный блок и закрытые поля сохранены; Account без полос/fake selection, More без hover lens, списки выбора в общей оболочке.

| Состояние | Baseline | После rollout |
| --- | --- | --- |
| Account | [Desktop](../output/playwright/fe11-reaudit/before-account-1440.png) | [Client1440](../output/playwright/fe11-rollout/screens/after-client-account-1440.png), [Manager320](../output/playwright/fe11-rollout/screens/after-manager-account-320.png) |
| More | [Mobile](../output/playwright/fe11-reaudit/before-more-390.png) | [1440](../output/playwright/fe11-rollout/screens/after-more-1440.png), [390](../output/playwright/fe11-rollout/screens/after-more-390.png) |
| Shape/Material | [Native closed field](../output/playwright/fe11-reaudit/before-item-390.png) | [Shape390](../output/playwright/fe11-rollout/screens/after-shape-390.png), [Material320](../output/playwright/fe11-rollout/screens/after-material-320.png) |
| Drawer | [Baseline](../output/playwright/fe11-reaudit/before-drawer.png) | [390](../output/playwright/fe11-rollout/screens/after-reference-drawer-390.png) |
| Остальные | Проверен исходный native/compound контракт | [Manager company320](../output/playwright/fe11-rollout/screens/company-320.png), [status768](../output/playwright/fe11-rollout/screens/status-768.png), [GlassSelect390](../output/playwright/fe11-rollout/screens/glass-select-390.png) |

Файлы ignored/local, недоступны через GitHub checkout. Это browser review и доказательства размеров/состояний, отдельные от Owner all-screen acceptance.

### Проверки и независимый QA

| Проверка | Команда / результат | Доказательство |
| --- | --- | --- |
| Build | npm run build — PASS | output/fe11-rollout-build.log |
| Adapters | playwright rollout/Drawer/GlassSelect API/overlays/surface/reaudit, workers1 —82/82 PASS | output/fe11-rollout-adapters.log |
| Chromium/Firefox/WebKit/touch | npx playwright test --config=playwright.reaudit.config.ts --workers=1 --reporter=line —124/124 PASS | output/fe11-rollout-cross-browser-verified.log; CLI line reporter не обновляет config JSON |
| Полная regression | npx playwright test --workers=2 --output=output/playwright/fe11-rollout/full --reporter=line,json — 516 PASS / 4 expected skips / 0 FAIL (8.7m) | output/fe11-rollout-full.log; output/playwright/fe11-rollout/full-results.json |
| Frozen | normalized SHA256/frame/optics signatures PASS в cross-browser suite; diff5 sources+manifest пуст | [Manifest](FE11_MOTION_FROZEN_V0_2.json) |
| Motion frames | Свежий rollout4/4 PASS, тот же lens node, реальное уменьшение old scale/увеличение new scale | output/playwright/fe11-rollout/motion-evidence/*-frames.json; fresh motion-results.json, 79/113/87/79 samples |
| A11y | Axe form flow без color-contrast rule; keyboard/focus/required/readonly/disabled/forced-colors/reduced-motion, GlassSelect contrast | Scoped/full suites; полный screen reader audit не заявляется |
| Independent review | Итоговый whole-diff read-only review PASS, конкретных дефектов нет | Reviewer typography_review; runtime выполнял основной агент |
| GitHub CI | Результаты отправленного head — по ссылке; pilot ef8d439 m7/screen SUCCESS является историческим checkpoint | [PR checks](https://github.com/SigmeD/flexomir_os/pull/30/checks) |

Reviewer отметил отсутствие GlassSelect adapter-specific controlled rejection/pending lifecycle tests. Добавлены 3 сценария: controlled reject, Escape/outside→reopen, rapid retarget. Все проходят в 4 browser/input проектах; reviewer повторно проверил coverage и закрыл замечание. Acceptance/cancel/theme tests сохранены.

Диагностические FAIL сохранены:

- Пилот: baseline RED, затем исправлены reset sync, long label, visible focus callbacks, controlled rejection/error, readonly validity. Итог 80/80 cross-browser,4/4 frames,500 PASS/4 expected skips/0 FAIL. Два старых first-Tab tests получили ожидание видимого trigger; первоначальные FAIL и rechecks в output/fe11-reaudit-*.log.
- Rollout: baseline tests RED на legacy composition; первый прогон 34 PASS/2 FAIL из-за общего menu locator во время exit Account. Locator уточнён именем More; UI из-за этой проверки не менялся.
- Первый cross-browser rollout98 PASS/2 Firefox teardown errors: Browser.removeBrowserContext / _maybeDontRestoreTabs. Полный serial recheck с новыми GlassSelect cases124/124 PASS. Ошибки не скрыты retry-настройкой.

## 3. Что в процессе

- Полная regression завершена: 516 PASS / 4 expected skips / 0 FAIL; flaky 0. CI отправленного head — Codex проверяет до сдачи, текущий результат по PR checks. Локальный PASS не заменяет GitHub CI.
- Приёмка всех экранов и решение о merge — Owner, после просмотра PR/доказательств; дата не назначена. Пилот принят, production-ready не заявляется.
- Динамическая Figma/runtime pixel parity всех экранов и ручной screen reader audit — не выполнены в этом инкременте; отдельный объём при необходимости, исполнитель/дата не назначены.
- API/backend/ACL/1С — Алексей, по общему CURRENT roadmap; в поставку не входят.

## 4. Договорённости и следующий шаг

1. Codex отправляет проверенные код/tests/LIVE docs в тот же PR #30 и обновляет существующий Drive CURRENT; проверяет CI фактического head. Новый PR не нужен.
2. Owner отдельно решает merge. Поручение не разрешает слияние или изменение frozen engine.
3. Следующий frontend этап — оставшиеся M8 UX/UI gates, затем M9 к согласованным доступным API Алексея, по Drive CURRENT.

Документация по задаче проверена 10.11.2026; следующая плановая ревизия 24.11.2026.
