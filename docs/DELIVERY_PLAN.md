# Flexomir OS — план frontend и Liquid Glass

## CURRENT 09.11.2026 — FE-ACTION-08NOV / implementation and QA checkpoint

Ветка `feat/fe-action-08nov` основана на актуальном `origin/main` перед FE-PROFILE-01. Реализована shared-правка `FOSAction` и responsive `Primary + More` placement. PR ещё не создан; merge не выполнялся.

| Gate | Статус |
| --- | --- |
| CURRENT Figma / mapping | PASS read-only: Action `835:259`; Work Dock `3143:1219`, adapter `3144:2851`; App Shell `637:180`; Account `3037:2656`; Avatar `3177:1314`; Profile Page Actions `3215:1357`. Masters unchanged. |
| Shared React | PASS: `FOSAction` keeps existing Liquid Glass, standard44 / compact40; `PageHeader floatingWorkActions` is opt-in and one DOM group; `HeaderAction` reuses shared directional press behavior. |
| Screen consumers | PASS: Client/Manager Orders list/detail, compose/item editor, Layouts list/detail/upload/picker, Support, Companies; only real Primary+More pairs dock. Profile Save+More remains separate. |
| Responsive / profile audit | PASS measured at D1440/L1024/T768/M390/M320; dock 108×48 with right 24/20/16 and bottom24 on compact; account trigger/profile photo corrections; Profile Save+More unchanged. |
| Technical QA | PASS: build; responsive actions 48/48 Chromium/Firefox/WebKit; M7 Layouts 33/33 Chromium/Firefox/WebKit; full E2E 392 passed / 2 expected touch-only skips; diff check. |
| Owner / PR | OPEN: Owner visual acceptance; PR not opened yet; no merge/release. Screenshots only in ignored local `test-results/`. |

No backend, API, 1C, ACL, status mapping, routes or business rules changed. Next: review diff, commit/push the single feature branch, open one Draft PR, synchronize Drive CURRENT, leave Owner gate open.

## CURRENT 09.11.2026 — FE-PROFILE-01

Один инкремент `feat/fe-profile-01-account-profile` основан на свежем `origin/main 806b9b5`. Реализован общий React Account Menu + Profile Settings для Client/Manager и проверены состояния демо-профиля. [Draft PR #27](https://github.com/SigmeD/flexomir_os/pull/27), code/test SHA `d9e83b0`.

| Gate | Статус |
| --- | --- |
| CURRENT Figma / scope | PASS: Account Menu `3038:2667`, Sidebar Account Footer `3123:1214`, App Shell `637:180`, Profile Page Actions `3215:1357`, Profile Avatar `3177:1314`, Profile WIP `2963:1169`, unsaved Confirm Dialog `3098:1663`; продуктовые действия с OPEN семантикой выключены |
| Shared React | PASS: общий `AccountMenu`, `ProfileSettingsScreen`, scoped `ConfirmDialog`; одна реализация для двух ролей |
| Functional / responsive | PASS: profile suite 37 passed / 3 expected skips across Chromium/Firefox/WebKit/touch Chromium; five widths; account/save/photo/guard/error flows |
| Regression / technical | PASS locally: build; 128/128 related Client/Manager shell tests in Chromium 1440/390; after desktop account trigger a11y fix, affected M7 tests 105/105 across Chromium/Firefox/WebKit |
| PR CI / Owner visual acceptance / merge | Both `Orders Core UI QA` and `FE-S03 M7 UI QA` PASS on `d9e83b0` (initial axe label finding fixed). Owner visual OPEN; PR #27 Draft, no merge; FE-ACTION-08NOV NOT STARTED |

WIP visual approval remains OPEN. No backend/API/1C/ACL or Figma master changes. Local visual evidence is ignored at `output/playwright/profile-settings/`; compare against the approved CURRENT WIP nodes before accepting.

## CURRENT 08.11.2026 — FE-DEBUG-02 / issue #25

База: `origin/main 25745e82e6b187b05642beb476f9d918cac71944`; одна ветка `feat/fe-debug-02-client-workspace-centering`, один Draft PR планируется. `standard` main теперь центрируется в области после Sidebar. Desktop baseline: исходное смещение 120px/440px при 1920/2560; после исправления ошибка центра ≤2px. Текущие Figma compact gutters (Client Orders 20px; Support/Layouts 16px) сохранены. Не менять AccountMenu/UserProfile WIP, Figma masters, стекло или бизнес-логику.

| Gate | Статус |
| --- | --- |
| Свежая база / Git | PASS: main=origin/main `25745e8`, clean; четыре stash сохранены |
| Client My Orders reference | PASS: первопричина зафиксирована на 1920/2560; Add/More остаются частью PageHeader/container |
| Общий rollout | CODED: Orders/формы/детали, Companies, Layouts, Support Client/Manager через shared main contract |
| Responsive/browser geometry | PASS: 49 route-width сочетаний × Chromium/Firefox/WebKit; 320/390/768/1024/1440/1920/2560, overflow=0, desktop center error ≤2px |
| Build / workflow regression | PASS: build; 342/342 Playwright regression tests; 357 layout geometry checks across Chromium/Firefox/WebKit |
| Independent review / PR CI | Independent QA PASS WITH RISKS (no confirmed issue in latest diff); [Draft PR #26](https://github.com/SigmeD/flexomir_os/pull/26), final CI status is tracked on current PR head |
| Owner visual approval / merge | OPEN; merge не выполняется без отдельного разрешения |

`standard max-width:1440px` — сохранённый текущий кодовый предел, кандидат для визуальной приёмки, не DS-токен. `wide` deferred: текущий Manager Orders рендерит карточки; consumer для расширенной таблицы в проверенных экранах отсутствует. Evidence: `output/playwright/workspace-layout/` (локальный, игнорируемый). Проверки сборки и локальной регрессии не заменяют Owner visual approval.

## CURRENT 08.11.2026 — FE-DEBUG-01 / issue #23

**Base:** `origin/main bc734d29163cb84c5751437839b75044b98eb29b`; **branch:** `feat/frontend-qa-debug-cycle`; [Draft PR #24](https://github.com/SigmeD/flexomir_os/pull/24), code/test head `e1a9069`; no merge. Existing workspace was clean, one worktree, four existing stashes preserved.

| Area | Result / gate |
| --- | --- |
| Entry and routes | `/` opens Client My Orders with a Client/Manager selector. Existing direct cabinet/Auth routes and QA fixtures remain. Glass Filter moved to `?view=glass-filter-lab`; unknown views return to Client with a diagnostic. |
| Presentation and demo flow | Role changes use one `OrderDemoWorkspace` without reload. QA reset is in its separate `demoTools=1` strip. Manager dirty drafts lock role/reset and cannot be left through cabinet navigation until saved. |
| Verification | Build PASS (207 modules); full Playwright suite 338/338 Chromium PASS (1440/390 projects); selected entry/presentation/FE-S04/M7 regression 147/147 PASS each on Chromium, Firefox, WebKit. Five target widths, Axe and D/T/M stand captures checked. `git diff --check` PASS. |
| Independent QA / Owner gate | Independent regression review PASS; no confirmed P0/P1 in this change. Owner UI review OPEN. All six GitHub workflows succeeded on code/test head `e1a9069`; no merge. |

**Scope:** React presentation and route framing only. No backend/API/1C/ACL, login, product semantics, Figma masters or global cabinet restyling changed.

Документация обновлена 08.11.2026; следующая ревизия 22.11.2026.

## CURRENT 08.11.2026 — M8 / FE-S05 #21

**Base:** `origin/main b5a8624`; **branch:** `feat/m8-ui-parity-refactor`; [Draft PR #22](https://github.com/SigmeD/flexomir_os/pull/22) is open and mergeable. One feature branch / one PR; no merge without Owner permission. Drive CURRENT remains the canonical plan. Scope is shared React parity/polish only, with no backend/API/1C or unapproved product behavior.

| Block | Result / gate |
| --- | --- |
| A — inventory and discrepancy matrix | Full Client/Manager screen and state matrix completed in [SCREEN_MAP](SCREEN_MAP_M4_2026-11-06.md), with CURRENT nodes, shared component mapping, evidence, severity, root cause, reviewer and OPEN gates. 27 D/T/M pairs cover nine shared visual families. |
| B — minimal shared-component correction | Done: in Client OrderComposer → ArtworkSource → LayoutPicker, keep the current `Макеты` sidebar item active and enabled while an Item editor is open; keep other destinations disabled until the editor guard clears. The draft guard and shared Glass are unchanged. |
| C — representative and controlled rollout | Done in the existing shared AppShell consumer; no per-screen nav clone. |
| D — regression QA | Build PASS (207 modules); expanded Client/Manager/Orders/Glass/Layout/Support/FE-S04 suite 268/268 Chromium (1440/390 projects); LAY01–09 suite 22/22, five widths; earlier targeted cross-browser subset 164/164 Firefox+WebKit. Includes accessibility, keyboard, touch, reduced motion, forced colors, drawer and overflow checks. |
| E — independent QA and Owner gate | Independent re-review PASS WITH RISKS: no additional P0/P1 or false parity claim; broad state-by-device overlays remain sampled. Three PR-head workflows SUCCESS on `515111d`. Owner visual acceptance remains OPEN; PR stays Draft and no merge. |

**OPEN:** Manager Orders PILOT Search/Company/Sort controls have no approved scope/semantics; existing FE-S04 New/All demo grouping is present. Auth remains `OWNER_DESIGN_OPEN`; Sidebar icon styling and company naming remain Owner questions. See the matrix and current comparison/capture paths in ignored `output/playwright/m8/`.

## CURRENT 07.11.2026 — FE-S04 / #19, implementation checkpoint

Один функциональный инкремент в `feat/fe-s04-client-manager-ui` от `origin/main 8099539`; [Draft PR #20](https://github.com/SigmeD/flexomir_os/pull/20), head `3f8c0a3`. Без merge без Owner. Блоки A–D реализованы и проверены.

- **A Manager Orders:** `Новые/Все` используют текущие Client submissions и synthetic records; demo pending/success/error явно UI-only. Synthetic imported-from-1C пример отображается только при явном `fixture=imported-1c` и подписан как несинхронизированный fixture. Исходная GL-03 фильтрация сохранена.
- **B Manager create:** общий `OrderComposer` расширен выбором существующей компании; manager drafts принадлежат Manager в ephemeral workspace и не попадают в Client list. Публикация/ACL/1С не включены.
- **C Auth UI:** компонент-кандидат email → UI code states, invalid/expired/resend/trusted-device preview. Реальных аккаунтов, писем, кода, сессии и persist нет. Одобренный Auth Figma frame не найден: `OWNER_DESIGN_OPEN`.
- **D Client↔Manager:** same in-memory store, новые клиентские submissions видны в Manager New; demo processing label возвращается в Client. Нет API/1С.
- QA: `npm run build` PASS (207 modules); FE-S04 + Manager Orders 34/34 Chromium (1440/390); full M7 105/105 Chromium/Firefox/WebKit; expanded Orders/Composer/Glass/FE-S04 210/210 Chromium; `git diff --check` PASS. PR #20 awaits CI/Owner review. M8 visual polish/parity deferred.

Обновлено: 08.11.2026; плановая ревизия документации: 22.11.2026.

## CURRENT 07.11.2026 — FE-S03 / M7, PR #18

FE-S03 / M7 merged to `origin/main` in `7828005`. Post-merge Client OrderDetail correction `7078b39` was merged and pushed in `e184e01`. Screen acceptance and visual OPEN items remain open; CI for the correction/merge is still pending, and M8 follows the M7 Owner gate.

- Готово: компании Manager → связанные заказы → общая деталь → назад; общий Support Client/Manager; My Layouts LAY01…09 UI preview и выбор/замена из формы позиции. Состояния, фокус, навигация и синтетические данные сохраняются в пределах демосессии.
- Итоговая проверка 07.11: build PASS (205 modules), M7 **105/105** Chromium/Firefox/WebKit, Orders/Glass **202/202** Chromium; в итоговых прогонах skipped 0 / flaky 0 / failed 0. В первом M7 был Firefox Drawer timeout (104/105); три изолированных повтора PASS, первопричина не подтверждена, полный прогон повторён отдельно от regression. Команды и доказательства — [HANDOFF](HANDOFF.md). Эти результаты предшествуют correction `7078b39`; CI для correction/merge ещё не запускался.
- Figma CURRENT LAY03/04 D/T/M перепроверены по узлам 1316:2015/2074/2165/2223/2315/2372. Визуальные пары: output/fe-s03/comparison/index.html (27). Совпадают геометрия рядов/detail и адаптивные отступы. Structural OPEN desktop picker: Figma показывает родительские breadcrumbs «Новая позиция / Мои макеты» и Sidebar «Макеты»; React показывает только «Мои макеты» и сохраняет Sidebar «Заказы» от формы позиции. Остальные отличия: runtime Glass, контраст secondary text, native fields и предупреждение демосессии. VISUAL/Owner acceptance OPEN.
- CI Orders теперь реагирует также на src/components/layouts/**: эти стили используются внутри общего OrderItemForm. Статус финального SHA смотреть в PR, результаты предыдущего SHA ему не приписывать.
- Независимое ревью и экранная приёмка OPEN. Backend/API/1С/реальный upload/ACL/full My Layouts scope — Алексей/PO/Owner, OPEN. Remote push/release не выполнены.
- Все восемь исходных изменений включены в `7078b39`; stash остаётся резервной копией до проверки итогового Git-состояния.

Ревизия документов: 06.11.2026; следующая 20.11.2026. Адресная синхронизация статуса: 07.11.2026. Более ранние checkpoints ниже — история.

FE-S03 D checkpoint / PR #18: доступные разделы подключены через единый CabinetNavigation/OrderDemoWorkspace; AppShell commits после onSelectionSettled. Сохранение формы Support и контекста компании проверено на пяти размерах; явные opener IDs исправляют Safari focus-on-click. Общий HeaderAction ограничивает tooltip viewport при hover/focus и disabled→enabled, без изменения material/spring. Build PASS; финальные 105 M7 и 202 regression перезапускаются после visual capture, результаты ещё PENDING. Ранее 98/105 и 201/202 не объявлены PASS: устранены реальное tooltip overflow и автоматический reload Vite от записи QA HTML. Генератор сравнений запускать отдельно от тестов. A614742f / B059b270 / Cbc52a45; D code checkpoint. Owner/independent review/merge OPEN, merge не разрешён.

FE-S03 C checkpoint / PR #18: LAY01…09 UI preview реализован одним LayoutBrowser (library/select/replace), LayoutRow/Detail/UploadForm/UploadPanel; HeaderAction расширен Choose из Figma, shared material/motion сохранён. ArtworkSource использует общий LocalFileControl и один LayoutPicker в New/Edit Item. Выбор/замена возвращает тот же Item с полями/фокусом/scroll; local names и synthetic IDs живут только до reload. Build PASS; Chromium C 11/11 (5 размеров + empty/error/cancel), FE-S02 targeted regression 7/7. Axe 0 list/detail/upload; captures local output/fe-s03. История/More ведут в UX PROPOSED 2101:7959, disabled; download/server storage/ACL OPEN. Illustrated 20MB/formats не внедрены как policy. B mobile thumbnail уточнён по master2409:11521:60px, без локального 48px. A/B/C checkpoints выполнены, D integration/full QA next. Owner visual acceptance OPEN, merge запрещён без разрешения.

FE-S03 B checkpoint / PR #18: общий Support Client/Manager реализован по FR-SUP-001..006. Build PASS; Chromium 11/11 functional + 2/2 D/T/M visual-state suites, axe 0 на list/form/detail/submitted. Общие SupportTicketRow/Form/Detail + ArtworkThumbnail; субъект H1 сохраняется, отправка только в демосессии, owner data отдельно, fixture error сохраняет ввод. Category/attachments/author reply/delete/triage исключены; Client candidate form визуально сокращена до подтверждённых полей (Owner OPEN). Реальные server loading/ack/API не имитируются. A 614742f, B checkpoint next, C/D pending; merge не разрешён.

## CURRENT 06.11.2026 — FE-S03 / M7, issue #17

База после fetch: origin/main 351157c1891e9e23db677b02cfd32a5b1ea9ad1e; FE-S02 PR #16 merged. Одна ветка feat/fe-s03-m7-client-manager-ui, один PR, без merge до разрешения Owner. Это действующий план; прежние CURRENT-блоки ниже — исторические checkpoints. Последняя ревизия документов 06.11, следующая 20.11.

- [x] A: CURRENT Manager 02.1 → CompanyRow + CompanyOrders + shared OrdersList/OrderDetail; list → company-linked orders → order → back. QA 1440/1024/768/390/320, keyboard/history/focus/scroll/empty и synthetic company isolation. Коммит и первый Draft PR.
- [x] B: CURRENT Support + FR-SUP-001..006 → shared list/form/detail обеих ролей. Тема/описание, собственные тикеты и ответ команды; без author replies/delete/category/attachments/triage. QA ролей/отправки demo/адаптивов + коммит.
- [x] C: CURRENT LAY-01…09 + prototype preconditions → LayoutRow/Detail/Picker/upload, ephemeral preview. Без PROPOSED edit/history 2101:7959. QA переходов и ArtworkSource regression + коммит.
- [ ] D: общая навигация готовых разделов; Chromium/Firefox/WebKit, build/CI/axe, Orders/Glass regression, side-by-side D/T/M + 1024/320; LIVE docs + CURRENT Drive. Один итоговый PR без merge.

Гейты отдельно FUNCTIONAL / VISUAL / TECHNICAL / OWNER. Контекст возврата, длинные названия, empty, роли и повторная отправка проверяются сценарными тестами. Backend/API/1С — Алексей. Исходные staged-правки и stash сохранены вне task commits.


## CURRENT / 06.11.2026 — SDLC, единый frontend roadmap

**База:** `origin/main` = `884e78f`, PR #5/#9/#10/#11/#14 merged. FE-S01 list/shared detail в main; FE-S02 в Draft PR #16. Принято Owner: **сначала целостная структура двух кабинетов, затем основные экраны и сценарии; глобальная визуальная полировка после охвата**. Уточнение Owner к #15: текущий Orders-flow должен соответствовать Figma целиком до merge.

| Этап | Выход | Состояние |
| --- | --- | --- |
| M0–M3 | React baseline, shared Glass, AppShell, первый Manager Orders | В `main`; код/QA, экранная Owner-приёмка отдельно |
| M4 | Карта уникальных экранов Client + Manager по CURRENT Figma/Drive; React статусы `готово/частично/нет` — [M4 screen map](SCREEN_MAP_M4_2026-11-06.md) | **AUDIT DONE / OWNER REVIEW OPEN** |
| M5 | FE-S01 (#12): Client list/shell + read-only деталь обеих ролей | **MERGED** PR #14, `884e78f`; QA_VERIFIED, не полный MVP |
| M6 | FE-S02 (#15): A New/Edit Draft/Items, B completed Duplicate, C связанный Manager demo; blocking Figma parity correction | Shared masters + reference New Item + оставшиеся композиции в том же PR #16. Финальный QA/исключения — HANDOFF/Component Registry; transition matrix — Screen Map. Owner visual gate OPEN / merge BLOCKED |
| M7 | Компании/Поддержка/прочие подтверждённые разделы MVP | **CODE MERGED** (`origin/main` 7828005); post-merge correction merged locally; Owner screen acceptance OPEN |
| M8 | Системная UI/UX-полировка и рефакторинг общей DS | PLANNED после M5–M7 |
| M9 | Финальный QA/handoff и подключение frontend к готовым API по мере доступности | PLANNED; backend/1С — Алексей |

**LIVE:** на каждом PR проверять/обновлять `PROJECT_STATE`, этот краткий индекс и CURRENT Drive-план, `COMPONENT_REGISTRY` при создании общего компонента, `DECISIONS` при утверждении/противоречии, `HANDOFF` на передачу. После слияния — проверить новый `main` и обновить SHA/статус/блокеры в Drive. Критические ошибки и базовый QA исправляются сразу, но некритичный визуальный polish не задерживает M4–M7. Полный исполнительный источник: [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit).

---

**Единственный исполняемый план фронтенда:** [09_Frontend Development Plan CURRENT в Google Drive](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit). Подробные этапы, критерии приёмки, ответственность и ссылки на доказательства находятся там. Исторический план от 04.11 ниже сохранён только для отслеживания решений; его `FE-08 TODO` больше не актуален.

**Разделение:** наша задача — React/TypeScript/frontend, компоненты, страницы, UX-состояния, адаптивность, QA и подключение фронтенда к предоставленному API. Алексей — backend, разработка API, серверные права/логика, интеграция с 1С. UI-фильтр «В работе» принят Owner; backend mapping не выполняем.

**Figma:** актуальная дизайн-система и технические мастера; не переносим весь каталог адаптивных/сценарных Figma-макетов как отдельные React-проекты или страницы. Делаем общие React-компоненты и из них собираем роли и сценарии.

**Текущий факт 06.11:** FE-S01 уже merged PR #14; работа идёт над Figma parity FE-S02 в существующем PR #16. Новую ветку/PR/план не создаём; main не меняем. Следующий gate — проверка текущих композиций и OPEN exceptions владельцем, затем только разрешённое слияние.

## Предыдущие локальные сводки (история; актуальные этапы — в Drive)

### Исторический срез до слияния PR #9 — 06.11.2026

Основной рабочий план: [Drive CURRENT M0–M9](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit), перечитан 06.11. PR #5 NavigationDrawer находится в main (`7372685`). В PR #9 конфликт с этой базой устранён, Drawer подключён к Manager Orders через общий AppShell. Техническая проверка: [M3 QA](FE08_MANAGER_ORDERS_M3_QA_2026-11-06.md). Следующий gate — визуальная приёмка экрана владельцем; на момент этого среза PR #9 оставался Draft; последующее слияние указано выше. M4, маршруты других разделов и API/1С — отдельные этапы.

Ниже сохранён исходный срез 04.11; его TODO и статусы не переопределяют текущий инкремент.

План основан на [Frontend Startup CURRENT](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit) и [Glass Visual Contract](https://docs.google.com/document/d/1VgaR8sfpRWeYVhDlN9jGkehLnXbCTiNQSBSEZCVWmGI/edit). Этот локальный список — рабочий срез, не отдельное продуктовое утверждение.

Импортирован из пакета владельца 04.11.2026; внешние источники в этой задаче не перечитывались. Локальные этапы ниже исправлены по фактическому Git и сборке. Новая задача выполняется в основной папке; worktree и параллельные агенты требуют отдельного основания и согласия по `AGENTS.md`.

| Этап | Результат | Контрольный гейт | На 04.11.2026 |
| --- | --- | --- | --- |
| FE-00/01 | Инвентаризация файлов, Git, React, источников Drive/Figma/Glass | Проверка состояния до изменений | Локальная FE-00 выполнена; Drive/Figma FE-01 TODO |
| FE-02 | Один Git, первоначальный commit, решение о приватности | Owner согласовал remote, нет потери данных | Commit `cd0656a` опубликован; PUBLIC/PRIVATE OPEN; worktree не создавался |
| FE-03 | Использовать существующий React baseline | TypeScript/build, затем запуск и браузерный QA | 04.11 при слиянии: build PASS, 80 E2E PASS (Chromium 1440/390); отдельного lint нет |
| FE-04/05 | Компонентная карта Client/Manager V2; FE-01 HeaderAction контракт | Один reusable primitive, разделение Figma masters и React API | Аудит 95/57 сделан; [HeaderAction контракт](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view) DRAFT / Owner review |
| FE-06 | Пилот общий HeaderAction; базовая геометрия и motion имеют отдельные гейты | Figma geometry, disabled/a11y, Client/Manager dev-story | Shared HeaderAction, lab и тесты уже в main; E2E PASS; сверка контрактов и Owner gates остаётся OPEN |
| FE-07 | Liquid Glass press для HeaderAction после визуальной оценки GL-01B | Side-by-side HTML oracle vs React и browser QA | GL-01B OWNER_OPEN, Package B BLOCKED |
| FE-08 | Manager Orders React из общих компонентов, затем Client reuse и другие экраны | React + Figma visual QA / product QA / Owner | TODO; не нужен отдельный HTML-дубль |
| FE-09 | Glass React поток и интерфейс подключения | Дизайн/поведение не подменены | Glass/Select, SidebarNav и neutral tone в main; 80 E2E PASS; отдельные material/optics и Owner gates OPEN |
| FE-10/11 | Контрактный пакет и согласование с Алексеем | Точные типы/ACL/1C mapping APPROVED или OPEN | TODO |
| FE-12 | Сквозная регрессия и handoff | Отдельные CODE/QA/OWNER/INTEGRATION статусы | TODO |

## CURRENT решение Owner / 04.11.2026 — ПОСЛЕ компонентного аудита

Отменена универсальная стадия «полный HTML каждого экрана». Контроль: **Figma → реестр компонентов → контракт → (HTML лаборатория только сложному motion/optics/menus с Owner visual gate) → React-компонент → independent component QA → React-экран → screen QA/Owner → PR**. Glass задаёт материал/движение, Figma — форму/размеры/иконки/контент. Исходный `Flexomir_Orders_Review.html` не считается эталоном; GL-01B motion пока не утверждён. Начинаем с [HeaderAction](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view), не с переноса целого экрана. Текстовая ActionButton `835:259` — отдельная будущая задача; не консолидировать с Icon+Label/Compact header.

## Liquid Glass — отдельные поставки

| ID | Цель | Основание | Gate |
| --- | --- | --- | --- |
| GL-01 | React Primary Button | Visual HTML 2.1.5 согласован | Порт + press/touch/keyboard + visual side-by-side |
| GL-02 | React Sidebar Lens | Visual HTML 2.2.5 C согласован | One-lens motion, click selection, performance |
| GL-03 | React Horizontal Tabs | Visual HTML 2.3.3c согласован | One-lens spring, semantics, responsive |
| GL-04 | Select / material lens | React-полигон с отчётом агента, Owner approval OPEN | Repro build/test, один moving indicator, a11y/browser/fallback, Owner |
| GL-05 | Dropdown/Overflow | Research/contract не закрыт | Только подтверждённые действия, Owner + cross-browser |

## Правило готовности

Этапы: `FIGMA_MAPPED → CONTRACT_READY → (GLASS_HTML_OWNER_APPROVED для сложного эффекта) → REACT_COMPONENT → COMPONENT_QA → REACT_SCREEN → SCREEN_QA/OWNER → PR/INTEGRATED`. Обычный компонент не требует HTML. Glass motion нельзя считать принятой по одной сборке. Backend/API/1C контуры отдельно.

## Приоритет на старте

1. FE-01 — CURRENT Drive/Figma перед продуктовой работой; локальную инвентаризацию повторить только при изменении состояния.
2. FE-02/03 — закрыть вопрос приватности и браузерной проверки существующего приложения; не создавать Git/React заново.
3. FE-06 — HeaderAction Package A: два презентационных варианта, native button, disabled, keyboard/touch, QA D1440/1024/T768/M390/M320, DEV story для двух ролей, без GL-01B и без прод-роутинга. Не изменять Client/Manager screens.
4. После Owner visual approval GL-01B — FE-07 Package B: точечный press + material, повторная QA. Далее FE-08 Manager Orders из общего React, без экранной HTML-копии.
