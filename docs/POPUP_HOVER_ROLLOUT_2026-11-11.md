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

## Завершённые шаги

- [x] RED: четыре новые проверки до реализации упали именно на отсутствии hover-превью/перемещения линзы.
- [x] GREEN: общий FosPopup preview + CSS; pending state трёх адаптеров; без копий.
- [x] Эталонный listbox, все пять adapters: hover/leave/disabled/keyboard/touch, выбранное/пустое, commit/reject, scroll, reopen, пять ширин.
- [x] Прежний Drawer selection-only hover заменён по прямому решению Owner; физические/геометрические пороги сохранены.
- [x] Build, профильные browser regressions, production smoke, визуальные доказательства, независимый QA.
- [x] LIVE docs, PR #37, review/CI, разрешённый merge, проверка main/origin и синхронизация Drive выполнены.

**Приёмка:** FUNCTIONAL и TECHNICAL требуют исполненных проверок; visual evidence отдельно от зелёного CI. Новый визуальный эффект не проектируется: переносится принятый v0.3. Другие задачи, DatePicker07 и backend остаются OPEN.

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
