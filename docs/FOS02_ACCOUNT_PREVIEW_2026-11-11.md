## 1. Основные прогрессы

FOS02 Account hover принят Owner и подключён на обычных экранах Client/Manager и в production-сборке. Ветка feat/fos02-account-hover-pilot от mainbc880b1; один PR этого инкремента готовится к CI. Физика/материал/пять frozen-файлов не менялись.

Решения11.11: на отдельный вопрос о DEV-пилоте Owner ответил «давай попробуем». После показа ссылки, объяснения hover/keyboard и полного сценария, затем уточнения «т.е. линза появляется при наведении?» Owner ответил «Принято». По прежнему поручению «все принятые задачи подключай и сливай в main/origin» выполнено подключение принятого Account-сценария без DEV/query gate; merge после CI. Это приёмка сценария Account, не полная визуальная приёмка M8.

## 2. Какие задачи решались

**Реализация — frontend/Codex,11.11.** AccountMenu → FosPopup(actions, actionPreview=account-hover-v0.3) → существующие FosPopupRows/FosGlassMaterial. PreviewId отделён от activatedId и бизнес-выбора, public actions selectedId по-прежнему never. Другие popup не передают actionPreview и сохраняют прежнюю семантику. Ни копии spring/material, ни дополнительного overlay/CSS-эффекта нет.

| Источник / вариант | React / состояние | Потребители / решение |
| --- | --- | --- |
| Account3042:2806; Wide/Narrow ×Company/Personal (3038:2667,3042:2795,3112:2726,3112:2736) | AccountMenu open/closed,sidebar/header,identity/disabled | AppShell Client/Manager; REUSE, принятый hover подключён без флагов |
| Owner11.11: принят Account hover | FosPopup action-only previewId и activatedId | EXTEND, отдельный explicit opt-in; default остальных consumers прежний |
| Frozenf527bcb / manifestv0.2 | FosPopupRows/FosGlassMaterial и одна линза | REUSE, все5 файлов/формулы/physics/material без изменений |
| Radix overlay / MenuItem | keyboard/Escape/outside/focus, immediate activation | REUSE; pointer-focus отменён только у принятого Account preview |

**Принятый сценарий:** после открытия линзы нет; hover enabled Profile показывает одну нейтральную линзу и прежний overlap-scale до1.043. Hover не открывает Profile и не перехватывает фокус. Leave/disabled/keyboard очищают preview и временный scale. Keyboard использует outline2px; Arrow/Enter/Space/Escape и возврат фокуса сохранены. Touch — прямойtap без hover. Click/Enter/Space/tap выполняют действие сразу, без ожидания линзы. Company/Logout остаются disabled. Rapid movement, outside close и reopen не оставляют stale preview; reduced motion/forced colors используют прежний fallback.

**Источники — frontend/Codex,11.11.** CURRENT Drive прочитан. Figma session1a0bf98f-f9e7-4279-b782-b5c7f12fd462: [Account master3042:2806](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=3042-2806), design context/screenshot и4variants. Его описание still selection-only отражает прежний v0.2; более новое решение Owner разрешает Account-исключение. Figma canvas не менялась. Геометрия390=280px вместо описанных332 — предсуществующее расхождение, в этой задаче не изменено. Полная Figma parity меню/M8 не заявляется.

**Проверки — frontend/Codex,11.11.** До реализации14 baseline flows (обе роли×5ширин +4touch),20PNG и frozen5/5 подтвердили прежний v0.2. RED нового preview —3missing-lens failures; RED подключения обычного URL —missing lens. После изменения:

- Targeted:29PASS/11условныхSKIP/0unexpected/0flaky, Chromium/Firefox/WebKit/touch. Пропуски — pointer-тесты touch, touch-тесты desktop, unsupported forced-colors engines; это не пропуск failing assertion.
- Existing popup/Profile/frozen/adapter regression:61PASS/3штатныхSKIP/0unexpected/0flaky на4проектах.
- Build PASS238modules. Production:7PASS/1условныйSKIP в8cases на4проектах: обычный/прежний query и native intermediate presence. Проверены обе роли/16route combinations; pointer hover сглажен, touch не требуетhover.
- Независимый review PASS WITH RISKS: собственный source/ref/evidence review и пересчёт frozen5/5. По независимо написанному check.js выполнены16/16 составных проверок обеих ролей на1440/320,8PNG. Исполнитель браузерного скрипта — root: child CLI недоступна, запрос escalation был остановлен; reviewer сверилJSON и изображения. Touch/production/широкие наборы запускал автор, а не независимый reviewer.
- Финальные60 rawPNG/30states сняты отдельно от DEV-пилота. Автор просмотрел Client1440 и Manager320 hover; сравнение idle/hover/keyboard геометрии фиксируется в gallery observations. Старые DEV evidence не заменяют итоговые rollout-проверки.

Первый новый тест ошибочно требовал фокуса H1 Profile; реальный контракт — сохранение фокуса пользователя после ухода popup. Проверка исправлена на поле имени и отсутствие перехвата фокуса. Axe region/moderate на portal-wrapper присутствует и у baseline: сохранено сравнение full-page fingerprints, новых нарушений нет. Это предсуществующий пункт, а не исправленный дефект. Прежний DEV production4/4, игнорировавший query, является историческим результатом и не доказательством нового rollout.

Доказательства: [исходный FigmaPNG](../output/playwright/fos02/reference/account-menu-3042-2806.png), [baseline](../output/playwright/fos02/baseline/observations.json), [targeted](../output/playwright/fos02/results.json), [regression](../output/playwright/fos02/regression-results.json), [production](../output/playwright/fos02/production-results.json), [independent script/result](../output/playwright/fos02/independent/root-executor.log), [новые изображения](../output/playwright/fos02/final-review/). FigmaPNG SHA256 6BF683B609C3A00F8BCAFCDFD57035088E37C384E0F4A78B52E59D76572F5382. [План](FOS02_IMPLEMENTATION_PLAN_2026-11-11.md).


**Уточнение Owner после приёмки — hover плавнее.** По просьбе «анимацию плавнее ... при наведении мыши» добавлен Account-only presence 0→1 за240ms в общем FosPopup.css. Один канал плавно проявляет opacity прежней линзы и существующий optical target; steady scale остаётся1.043. Physics/spring/material/overlap target и5 frozen-файлов не меняются. Это новая разрешённая presentation-модуляция Account, а не утверждение неизменности временного вида scale. Leave держит ту же линзу до завершения fade; быстрый re-entry отменяет cleanup, синхронный intent-ref защищает от старого finished-microtask до React passive cleanup. Keyboard/touch/activation не ждут fade; reduced motion/forced colors без перехода. Независимо написанный check-smooth.js исполнен root без изменения:12/12PASS,4PNG просмотрены reviewer. Midpoint entry opacity0.872893/scale1.03753, exit0.127107/scale1.00547; target1.043. Прежние16 проверок остаются отдельной проверкой поведения до сглаживания, не заменяют smooth12.

**Матовость формы — аудит по Screenshot_2.** В продукте фактически rgba(255,255,255,.72), backdrop-filter blur20px; shell/optics прозрачны, второго белого слоя нет. На временном диагностическом checker-фоне фактический blur размывает рисунок, безblur он резкий. MeanNeighborDifference0.3843 vs6.4402 — диагностическая соседняя разность пикселей, не WCAG contrast ratio. На однотонном фоне эффект визуально слабый, дефект отсутствующего blur не подтверждён; материал не изменялся. [Проверка](../output/playwright/fos02/glass-audit/proof.log), [сblur](../output/playwright/fos02/glass-audit/actual-blur20.png), [безblur](../output/playwright/fos02/glass-audit/control-no-blur.png). Сетка была только в браузере диагностики и удалена; product source не менялся для аудита.

**Съёмка и регрессия.** После сглаживания WebKit проверка поймала stale fade cleanup, исправленный синхронным previewVisibleRef; повтор native test PASS. Отдельный CHManager timeout воспроизведён с диагностикой: fullPage screenshot временно меняетviewport на1×1 и обратно1440×900, compact переключается и Account remount закрывает меню. Screenshot изменён на fullPage:false для настоящего заданногоviewport; postcapture menu count1, capture-events, exact steady1.043, завершённыйtransition и остальные assertions сохранены. [Исходный лог](../output/playwright/fos02/screenshot-events.log). После этого полный финальный40:29PASS/11SKIP/0fail/0flaky; final64regression61PASS/3SKIP/0fail/0flaky. Эти повторные результаты заменяют прежние диагностические ошибки, traces сохранены.

## 3. Что в процессе

CI первогоhead93184df: Account43009121771 иOrders43009121723SUCCESS; M743009121736 остановился на4старых focus-visible assertions в m7-responsive-actions. Runtime probe доказал: послеpointer scriptedfocus не matches focus-visible (none/3px), настоящиеShift+Tab/Tab даютcanonical2pxsolid в обычном/forcedрежимах. В двухM7тестах заменён способ входа вkeyboardfocus, сохранены всеstyle/geometry/press/fallback assertions и порог2px. Повтор6/6PASS Chromium/Firefox/WebKit. Новыйhead содержит только эту тестовую правку и запись; production source идентичен93184df. СтарыеCIне заменяют проверку новогоhead.

- Frontend/Codex: зафиксировать весь инкремент одним PR, проверить CI фактического head и выполнить уже разрешённый merge/main sync; срок — текущая поставка, календарная оценка не назначена.
- Frontend/Codex: после merge сверить SHA/содержимое main, удалить remote head после доказательства merge, сохранить local branches/4stash/Screenshot_1.png и обновить Drive CURRENT.
- Owner/PO/Алексей:05/06/10/11/13 и API/1С остаются отдельной очередью;07DatePicker — следующий отдельный UI-пилот. Полная M8 visual acceptance OPEN; даты не назначены.

## 4. Основные договорённости

- G-01: явное разрешение DEV-пилота получено, затем Owner принял описанный Account hover-сценарий. Подключение/merge принятого объёма выполняются по действующему поручению Owner; повторное разрешение merge не требуется.
- [AGENTS.md](../AGENTS.md) и исходный FOS02 запрещали менять frozen hover/click без отдельного Owner gate; gate выполнен для Account. Frozen physics/material и5файлов остаются прежними. Новая семантика не распространяется на Drawer/Select/More.
- Изменены AccountMenu, FosPopup и общий FosPopup.css для разрешённого Account-presence; frozen CSS/5файлов, новые API/ACL не затронуты. Локальные LIVE docs и тесты идут в том же PR. Новый scaffold/worktree/docs-only PR не создаётся.
- Screenshot_1.png остаётся пользовательским untracked файлом; не изменять/не коммитить. Документы ревизованы10.11, следующая ревизия24.11.
