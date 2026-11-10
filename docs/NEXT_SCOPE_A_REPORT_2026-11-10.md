# Scope01–13: анализ и первый инкремент

## 1. Основные прогрессы

Codex разобрал все13 пунктов и декомпозировал их на A/B/B2/C в [плане](NEXT_SCOPE_13_2026-11-10.md). База `7b17db6dab85e3645c55f3e91fcef81b7dfe26b7`, рабочая ветка `fix/next-scope-a-correctness`, основная папка проекта. Перед стартом fetch выполнен, open PR0, working tree clean, четыре прежних stash сохранены. Main не менялся.

CURRENT Drive/SRS/E2E и Figma Select1148:311/292 перечитаны; даты и ссылки зафиксированы в плане/[SOURCES](SOURCES.md). Объём — frontend adapters/fixtures, без API/1С/frozen engine changes.

## 2. Какие задачи решались

| Пункт / шаги воспроизведения | Expected / actual на базе | Результат |
| --- | --- | --- |
|01 Client/Manager Profile→активные Orders, click/Enter/Space | Root Orders; фактически Profile остаётся, dirty guard не открывается | REPRODUCED. Явная навигация через workspace guard; screen onCommit сбрасывает detail |
|01 compact Drawer, активные Orders | Commit после settled; фактически same-id закрывает без route callback | REPRODUCED touch. Same-id проходит existing rest observer, без смены engine |
|01 dirty Profile→другой раздел→Close | Остаться с правками; фактически Close вызывает Discard и уход | REPRODUCED. Отдельный onDismiss сохраняет draft и отменяет pending action |
|04 required Select, открыть пустой/выбранный | Placeholder подсказка, не selectable; фактически enabled popup row | REPRODUCED. Shared adapter запрещает required+placeholder empty; semantic-empty фильтры сохранены |
|05 completed DEMO-007→duplicate→qty/name | dirty распознаётся, недоступный source объясняет invalid | ALREADY_FIXED в части dirty+Save&&valid и Library/HELP. G-02 UX_CHANGE остаётся OPEN |
|05 выбрать Local вместо исторического UPLOAD | Старый unavailable marker исчезает; фактически сообщение остаётся после Save/reopen | REPRODUCED. Local/HELP source transition очищает marker; файлы остаются локальными |
|12 Library→return | Выбранный layoutName виден, поля сохранены; основной Upload всё ещё показывается | Audit; новый визуальный pilot/rollout OWNER_OPEN |

Read-only аудит03/12: сняты12 PNG и `audit/observations.json`. Manager New пустой/заполненный на1440/1024/768/390/320: gap между company-wrapper и products-section0px; products→general63/68px empty и38/36px filled. Горизонтальный overflow0 и page errors0. Это исходные измерения для reference03, не самостоятельно утверждённый новый spacing. Library picker сохраняет quantity500/layout label, но главный «Загрузить» остаётся —12 подтверждён как UX_CHANGE. Local честно показывает filename и «Файл не загружен на сервер». Материал Plus и palette в этом аудите не менялись.

Source changes: AppShell/CabinetNavigation/OrderDemoWorkspace — один guarded transition; ClientOrdersScreen/ManagerOrdersScreen — собственный root callback; SidebarNav — activation текущего раздела; NavigationDrawer — route-after-rest и modal focus handoff; FOSSelectPopup — placeholder policy; ArtworkSource — очистка stale source marker. Новых visual primitives/статусов нет.

Проверки до правки: initial RED19/19 включает16 реальных падений01/04 и3 ошибочных exact-name селектора DEMO-007 (это **не** доказательства дефекта05). Исправленный отдельный Artwork RED:1 FAIL Local,2 PASS Library/HELP. Touch RED:3 FAIL (две роли current Orders, Close guard). Сохранены логи, screenshots, videos и traces в `output/playwright/next-scope-a/red`, `red-extra`, `red-artwork`.

Независимый read-only review `wave_a_review`: проверены diff/consumers/spec и все пять frozen hashes; найден повторный guard через stale navigation closure, отдельно запрошена проверка modal focus. Автор воспроизвёл6 cross-section FAIL и1 focus FAIL (`review-red`), затем изменил контракт на navigate(section,onCommit) и устранил перехват фокуса. Финальное review: **PASS / READY WITH RISKS**, блокирующих замечаний нет. После первоначального EPERM reviewer запустил отдельный Chromium390 через разрешённый CLI: dirty Client Profile→Drawer Support→Discard, фокус внутри диалога после2RAF, один переход и0 dialogs — независимый runtime PASS. Остальные suites reviewer прочитал в логах автора, самостоятельно не перезапускал. Полный independent runtime/visual PASS и Owner acceptance не заявляются.

Дополнительная диагностика: отложенный focus после Profile мог вмешаться в следующее быстрое открытие меню; перед focus теперь проверяется действующий контрол/новый popup. Повтор WebKit+touch:24/24 PASS. Ошибки тестового кода (Cyrillic keyboard.press, неверный Support title и селекторы скрытых Activity) исправлены отдельно. Таймауты не увеличивались, force не используется; сохранены strict hidden/inert/background/focus assertions.

Текущая верификация:

| Проверка | Результат / доказательства |
| --- | --- |
| TypeScript + build | PASS, `output/next-scope-a-build-final.log` |
| Focus rapid reopen repeats |24/24 PASS WebKit+touch, `output/next-scope-a-focus-repeat.log` |
| Final targeted matrix |124/124 PASS, Chromium/Firefox/WebKit/touch, пять ширин, a11y/reduced-motion/forced-colors; `output/next-scope-a-final-stable.log`, `green/results.json` |
| Full suite |582 PASS /4 expected SKIP из586, `output/next-scope-a-full-final.log`, финальный стабильный запуск7.9min |
| FE11 freeze | Independent normalized hashes PASS; automated frozen contract PASS в полном наборе; diff protected5+manifest пустой |
| Visual | Просмотрены Figma Select screenshot/context, required popup before/after и реальные desktop/mobile captures. Closed field44px/типографика/геометрия без redesign. Новые визуальные pilots и Owner acceptance OPEN |

Новые31 browser tests (`tests/next-scope-a.spec.ts`) и `playwright.next-scope.config.ts` добавлены в существующий M7 CI workflow с сохранением evidence. Существующий Select keyboard test обновлён на первую разрешённую опцию; required reset, readonly, disabled, controlled rejection, FormData проверяются прежними и новыми сценариями.

В первом full-прогоне упал existing M7 integration390 на возврате к Company01: вместо Manager Company details показан Client Orders. Причина этого одиночного результата не доказана; падение не скрыто и не «исправлялось» удалением assertion. Исходный error-context/result сохранены в `full-initial`; изолированное повторение неизменённого теста с trace3/3 PASS (`integration-repeat`). Финальный full после прекращения исходных правок прошёл582/4, включая этот сценарий. Риск единичной невоспроизведённой нестабильности честно сохраняется; старый failed run не переименован в PASS.

Проверена целостность49 локальных ссылок:0 missing. Runtime fingerprint206 исходных/test/config файлов: `e81cedc15667b8e2d1f4045babd3b82053f78744f5e8ad20e0891682300d7325`; `output/playwright/next-scope-a/evidence-integrity.json`. Изменения после финальных runtime-прогонов ограничиваются документацией; сравнение этого fingerprint позволяет связать доказательства с фактическими файлами доставки. Figma Default1148:292 сохранён без изменения в `reference/figma-select-1148-292.png`; matched closed geometry не означает приёмку остальных экранов.

## 3. Что в процессе

- Codex: локальные targeted/full regression и independent review завершены; доставка — один Draft PR wave A в текущем инкременте. Фактические head/CI читаются в GitHub для этой ветки; локальные тесты не подменяют CI PASS. Owner acceptance/merge остаются отдельным следующим шагом.
- Owner: G-02 Save UX, G-01 Account preview, G-04 calendar и G-05 neutral palette — до соответствующих пилотов/rollout; даты решения не назначены.
- Owner/PO/Алексей: G-03 Item rights/delete, G-06 Item→Library lifecycle, G-07 file contracts, G-08 Support attachment — до API-интеграции; сроки зависят от согласования.
- Codex: B03/08/09, B2 02/07, C06/10–13 — по декомпозиции и необходимым gates; API/storage success не имитируется. FOS12 имеет только аудит в wave A.

## 4. Основные договорённости

- Сохранить существующий Save dirty&&valid, FE11-v0.2, menu14/18/500 и запрет post-1С edits — Codex, во всех следующих изменениях до новых решений Owner/PO.
- Завершить проверки и предоставить Draft PR с кодом/tests/LIVE docs — Codex, в текущем этапе. Merge выполняется только после отдельного поручения Owner; сейчас не выполнялся.
- Визуальные изменения проверять на одном reference, затем Owner принимает и разрешает распространение — Codex/Owner, перед каждой wave B/B2/C rollout.
- Синхронизировать post-merge SHA/CI и существующий Drive CURRENT — Codex, после разрешённого merge. Текущий Drive прочитан, но поставка туда не объявлена merged/released.
- Контроль исходных screenshots/logs остаётся локальным в `output/playwright/next-scope-a`; другой checkout не обязан их содержать. Проверяемый код и сценарии будут доступны в PR, server/API готовность остаётся OPEN.
