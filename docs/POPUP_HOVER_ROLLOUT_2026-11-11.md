# Принятый hover v0.3 — остальные выпадающие списки

## Доставка

[PR #37](https://github.com/SigmeD/flexomir_os/pull/37) MERGED 11.11.2026, merge `3317d5029ac7baa3bfa8eccd8b03a72b15cd62b1`; проверенный head `678bf4635e661fa127fb1a3dbd01bd1c7d58bd11`.
CI 4/4 SUCCESS: [Orders](https://github.com/SigmeD/flexomir_os/actions/runs/43049308099), [Hover](https://github.com/SigmeD/flexomir_os/actions/runs/43049308060), [Drawer](https://github.com/SigmeD/flexomir_os/actions/runs/43049308061), [M7](https://github.com/SigmeD/flexomir_os/actions/runs/43049308110). После merge повторены build 238 modules PASS, production 14 PASS / 6 условных SKIP и frozen contract 4/4 PASS. Remote head удалён.
Код подключён на обычных экранах и в production. Полная визуальная приёмка M8 остаётся OPEN. Датированные промежуточные попытки CI ниже сохранены как доказательства причин и исправлений; они не являются текущим ожиданием merge. [Текущее состояние](PROJECT_STATE.md).

**Основание:** Owner 11.11: «точно такое же компонент поведения, как реализован … подключить к остальным выпадающим спискам». Это расширяет прежнее Account-only разрешение PR #36; физика/материал FE11-v0.2 остаются FROZEN. Историческая база разработки — `origin/main` 4ae4841, ветка `feat/popup-hover-rollout`.

**Цель:** переиспользовать принятые 240ms появления/затухания и ту же линзу во всех пользовательских popup. Hover не меняет данные, маршрут, фокус или aria-selection. Keyboard и touch сохраняют прежнюю активацию.

## Карта компонентов и источников

| CURRENT Figma / решение → React | Props/states | Потребители / действие |
| --- | --- | --- |
| Account3042:2806 → AccountMenu → FosPopup | actions; hover/activation/closed | Client + Manager; REUSE принятого эталона PR36 |
| More1914:655…676 → OverflowMenu → FosPopup | actions; enabled/disabled; hover без выбора | Все Order/Item More + CompletedOrderMenu; EXTEND общего контроллера |
| Select1148:311/292 → FOSSelectPopup → FosPopup | listbox; selectedId/selectionPending; native bridge | Shape/Material/Company/filters; EXTEND |
| Select / существующая GlassSelect composition → FosPopup | semanticRows; selectedId/selectionPending | Фильтры/существующие потребители GlassSelect; EXTEND |
| Drawer1962:3834/3854 + Nav634:511 → NavigationDrawer → FosPopup | navigation; selectedId/selectionPending | Оба кабинета, mobile; EXTEND |

CURRENT masters перечитаны 11.11 через Figma. Их статическая геометрия/материал сохраняются. Старое описание «hover не двигает линзу» для popup заменено новым прямым решением Owner; desktop Sidebar не входит. Native date/file chooser не является FosPopup и остаётся вне этой поставки. Figma изменять для этого переноса не требуется.

## Контракт

- Один общий FosPopup, один frozen FosPopupRows/FosGlassMaterial. Без новых spring, оптических формул или материалов. Принятая CSS presence 240ms общая.
- Actions: вход указателя показывает линзу; disabled, выход в свободную область и уход мыши убирают превью. Реальное действие немедленное, права/confirm прежние.
- Listbox/navigation: hover временно задаёт визуальную цель. Выход/disabled/keyboard возвращают линзу к реальному selectedId; значение и aria-selected/aria-current не меняются.
- Если реального выбранного enabled пункта нет, присутствие плавно исчезает как у Account. Пустая строка может быть реальным optional значением.
- Выбор очищает preview. selectionPending блокирует новые hover-цели до завершения существующего adapter lifecycle. Controlled rejection, отмена onClick, Escape/outside, фокус и touch сохраняются.
- Reduced-motion/forced-colors без новых анимаций. Пять frozen исходников и manifest неизменны.

## Исполненная проверка /11.11

| Набор / команда | Результат | Доказательства |
| --- | --- | --- |
| npm run build | PASS,238modules | Production dist; прежнее предупреждение chunk>500kB |
| playwright.popup-hover.config.ts |23PASS/9conditionalSKIP|output/playwright/popup-hover/results.json|
| playwright.reaudit.config.ts |124PASS|output/playwright/fe11-reaudit/cross-browser.json|
| playwright.fos02.config.ts |29PASS/11conditionalSKIP|output/playwright/fos02/results.json|
| playwright.fos02-regression.config.ts |61PASS/3conditionalSKIP|output/playwright/fos02/regression-results.json|
| playwright.fe11.config.ts tests/navigation-drawer.spec.ts |88PASS в полном совместном112-наборе|output/playwright/popup-hover/navigation-before-geometry-isolation.json|
| playwright.fe11.config.ts tests/fe11-drawer-pilot.spec.ts — исправленная подготовка измерения |19PASS/5conditionalSKIP|output/playwright/fe11-pilot/results.json|
| POPUP_HOVER_PRODUCTION=1, config popup-hover, grep More shares/ordinary Manager/Drawer previews/GlassSelect semantic/touch activates |14PASS/6conditionalSKIP|output/playwright/popup-hover/production-results.json|
| Независимый reviewer-authored review.cjs, Chromium/WebKit |8/8PASS; source hashes SAME|output/playwright/popup-hover/independent/results.json|
| Frozen engine fingerprints |5/5PASS, manifest неизменён|fe11-frozen-contract + reviewer fs/crypto|

SKIP только для несовместимого ввода: hover/keyboard desktop или настоящий touch. Итоговые наборы без unexpected/flaky. Source reviewer не мог запустить свой браузер из child sandbox (EPERM), поэтому скрипт SHA25675EAB0B5A6CCE2DB25C04954E75EE3F5F8764E76E798BE997D48748CB7045187 исполнен root неизменно; reviewer независимо проверил JSON, текущие source hashes и PNG. Firefox проверен авторским набором, не независимым скриптом.

Прежние неуспешные результаты не выдаются за успешные: первый Manager тест искал exact «Компания02», хотя fixture имеет длинное полное имя; исправлен только selector на /^Компания 02/. В Drawer geometry sample после удаления устаревшего hover неявное ожидание стабильности исчезло: viewportY смешивал96px travel с190ms panel-entry transform, давал99.3…99.7px. Добавлено ожидание собственных panel.getAnimations().finished ДО sample; прежние96px/.5px, scale1.043, overlap и количество промежуточных кадров сохранены. Повтор всех24 Drawer pilot scenarios19PASS/5SKIP; остальные88 navigation из предыдущего совместного набора PASS. Код motion не менялся.

Визуальные доказательства: [галерея8PNG + видео hover/return](http://127.0.0.1:5173/output/playwright/popup-hover/review/index.html), five-width Manager PNG в output/playwright/popup-hover/evidence. Capture390×844 Chromium после document.fonts.ready. Reviewer просмотрел More/GlassSelect/Drawer hover↔return и свежие4Figma references: геометрия/читаемость baseline сохранены. StaticFigma не является runtime-hover эталоном и не содержит тех же данных/viewport; pixel-perfect full-screen VISUAL acceptance M8 остаётсяOPEN. Видео reviewer не декодировал; timing подтверждён браузерными assertions. FUNCTIONAL/TECHNICAL PASS; успешные CI фактического head и merge подтверждены в разделе «Доставка».

## CI: установка окружения /11.11

На исходном head4c8bd86 GitHub Orders43044105277 и Drawer43044105818 завершились до тестов: apt не разрешает DNS archive.ubuntu.com/security.ubuntu.com/azure.archive.ubuntu.com, install exit100. Hover43044105556 достиг12мин и отменён; M743044105414 остановлен на том же DNS install. Доказательства сохранены output/playwright/popup-hover/ci-infrastructure-attempt1.json. Повтор на новых runner с тем жеSHA не устранил длительный install; продуктовые тесты ещё не были выполнены и эти CI не объявляются PASS.

Для этих четырёх workflow выбран официальный Playwright container1.64.1-noble, совпадающий с npm lock1.64.1, по [официальной CI инструкции](https://github.com/microsoft/playwright/blob/v1.64.1/docs/src/ci.md) и [Docker контракту](https://github.com/microsoft/playwright/blob/v1.64.1/docs/src/docker.md), перечитанным через Context7. Образ уже содержит Chromium/Firefox/WebKit и системные зависимости; npm ci/build/все тестовые команды, проекты, пороги и timeout сохранены. Удалена только загрузка apt/browser, добавлена fail-fast проверка точного соответствия версии image/package. Образ закреплён digestsha256:2f05f8a734509a7b3f26a912639488ee08f58a7b292d14d62271bcff9038768f (MCR manifest HEAD с правильным media-type:200). Non-root1001, IPC host и init по официальным рекомендациям. Это исправление окружения доставки; успех требует нового GitHub CI фактического head. При будущем обновлении Playwright нужно согласованно обновить image tag/digest.

Static YAML parse + сравнение25 npm/build/testcommands и четырёх timeout с предыдущим head PASS (output/playwright/popup-hover/ci-container-static-check.json). Registry config подтверждает linux/amd64 и PLAYWRIGHT_BROWSERS_PATH=/ms-playwright (ci-image-config.json). Version guard локально PASS1.64.1. Независимый source review CI fix READY WITH RISKS: commands/projects/thresholds сохранены; фактический container runner/pull/browser launch проверяется новым CI, не локальным Windows прогоном.

### CI geometry sample /70770fd

Контейнер успешно запустил все4workflow, версия и сборки PASS; NavigationDrawer43047299801 SUCCESS110tests, Orders43047299531 SUCCESS. Hover43047299458 прошёл Account29/11SKIP, Profile61/3SKIP и shared23/9SKIP, затем один WebKit geometry assertion не нашёл partial scale старой подписи. Это реальный неуспешный прогон, не PASS; production steps этого workflow ещё не выполнялись.

Скачан artifact13867377701 в output/playwright/popup-hover/ci-70770fd, извлечён webkit-geometry-frames.json. Кадр3: lensY85.469, old label86.613..105.387, scale1.043; следующий кадр4: lensY108.893, scale1. Сэмплы пропустили весь короткий partial-overlap интервал старой подписи, обе зафиксированные величины соответствуют frozen формуле; новая подпись имеет промежуточные1.00858/1.01965/1.02991. Точные исходные rAF intervals не записывались и не объявляются установленными. Низкая частота кадров frozen engine остаётся прежним ограничением.

Только измерительный geometry test использует [официальный Clock API](https://github.com/microsoft/playwright/blob/v1.64.1/docs/src/clock.md): install перед reload приложения, дождаться независимого panel-entry, pauseAt и runFor2400 с исполнением всех rAF. Сэмплы теперь содержат performance.now. Реальный DOM/контроллер,96px/.5px, scale1.043, old+new partial overlap, количество промежуточных кадров и before-contact assertions прежние. Ни один production/frozen исходник не меняется; остальные pointer/keyboard/touch/commit тесты остаются на реальном времени. Повтор полного Drawer pilot24 локально:19PASS/5conditionalSKIP/0unexpected/0flaky. После независимого review требуется CI нового head.

## 1. Основные прогрессы — основания и проверки

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

Доказательства: [исходный FigmaPNG](../output/playwright/fos02/reference/account-menu-3042-2806.png), [baseline](../output/playwright/fos02/baseline/observations.json), [targeted](../output/playwright/fos02/results.json), [regression](../output/playwright/fos02/regression-results.json), [production](../output/playwright/fos02/production-results.json), [independent script/result](../output/playwright/fos02/independent/root-executor.log), [новые изображения](../output/playwright/fos02/final-review/). FigmaPNG SHA256 6BF683B609C3A00F8BCAFCDFD57035088E37C384E0F4A78B52E59D76572F5382. [План](POPUP_HOVER_ROLLOUT_2026-11-11.md).

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
