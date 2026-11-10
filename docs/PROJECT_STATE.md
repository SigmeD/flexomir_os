# Flexomir OS — текущее состояние проекта

## CURRENT 10.11.2026 — заключительная проверка M8

PR #30 MERGED: main/origin/main 9d1f5bc, дерево соответствует проверенному head 039381c; remote head branch удалена. Новый этап — issue #21 в одной ветке feat/m8-final-screen-qa, без worktree.

Сняты 69 свежих пар Figma↔React по 23 семействам D1440/T768/M390. Переполнение по горизонтали, page errors и незагруженные изображения не обнаружены. Сравнение учитывает Owner delta14/18/500, frozenFE11, общий Glass/GL03 и compact action dock; старые screen instances не отменяют принятые решения.

Исправлены browser title и Client Support Detail breadcrumb по FOS; label Manager сохранён. M7 final159/159 PASS, breadcrumb regression6/6, исходный WebKit helper race после исправления 3/3 PASS, buildPASS. Итоговая полная regression520 PASS/4 expected skips/0 FAIL; независимый review PASS WITH RISKS(12 реальных пар). CI отправленного head сверяется в [итоговый аудит M8](M8_FINAL_AUDIT_2026-11-10.md). Первый полный checkpoint519 PASS/1fixture-loadFAIL/4 expected skips; исходный тест отдельно 6/6 PASS.

Manager agreed-date/private publication/search semantics, Auth design и Owner screen acceptance остаются OPEN; поле согласованного срока без явного решения не добавлено. Следующий gate — завершить доказательства и CI этого PR, затем Owner review; M9 по готовым API Алексея.

## Предыдущие checkpoints (история)

## CURRENT 10.11.2026 — FE11: пилот принят, общий popup включён

Owner принял пилот ответом «да подтверждаю». Продолжение идёт в одной ветке `feat/fe11-popup-unification-reaudit` и [PR #30](https://github.com/SigmeD/flexomir_os/pull/30), без merge.

Account, More, Drawer и GlassSelect используют один `FosPopup`. Все реальные FOSSelect (Shape/Material, компания заказа менеджера, фильтр компаний и disabled sorting) переведены на общий listbox с настоящим native form proxy. Флаг пилота и legacy hover driver удалены. Роль Manrope14/18/500 и frozen reference `f527bcb` сохранены; API/backend/1С не менялись.

Build PASS; адресная регрессия 82/82, Chromium/Firefox/WebKit/touch124/124. Независимый review не нашёл дефектов; отмеченный пробел GlassSelect закрыт новыми controlled/lifecycle tests. Сняты 43 свежих screenshots обычных маршрутов на 1440/1024/768/390/320. Затронутые Figma masters синхронизированы; motion остаётся runtime-эталоном. Полная регрессия 516 PASS / 4 expected skips / 0 FAIL; CI отправленного head сверять по PR checks — [отчёт FE11](FE11_POPUP_REAUDIT_2026-11-10.md).

Далее: проверить CI отправленного head PR #30, затем отдельное решение о merge. Приёмка пилота не означает приёмку всех экранов или готовность backend. Канонический roadmap остаётся в Drive: M8, затем M9 по готовым контрактам Алексея.

## История до принятого пилота (не текущие задания)

## CURRENT 09.11.2026 — post-FE11 QA closure

Исправлены More delete/reopen, Escape return-focus и FOSAction press после Profile (реальная причина — delayed popup focus), без изменения frozen motion. Closed Surface теперь inert; Account передаёт focus экрану, More различает trigger/outside/Escape; OrderComposer возвращает More focus после отмены удаления. Build PASS, полная регрессия **458passed/4expected skips/0failed**; critical cross-browser35/35PASS, добавочный Cancel-focus4/4PASS. CI дополнен новыми проверками; [живой статус](https://github.com/SigmeD/flexomir_os/pull/29/checks). Подробности: [FE11 report](FE11_POPUP_PILOT_2026-11-09.md). PR #29 Draft, merge и Owner экранная приёмка OPEN; reference f527bcb не менялся.

## CURRENT 09.11.2026 — FE11-v0.2 approved reference and controlled rollout

Owner подтвердил v0.2; референс сохранён в commit `f527bcb`, статус `OWNER APPROVED / FROZEN`. Общий `FosPopupRows` заменил lab-кандидат и старый hover-preview список; Drawer/Account/GlassSelect используют один контроллер, material и Surface с собственными semantics. Исправлен lifecycle Account Escape→reopen на trigger через Radix onInteractOutside; engine не изменён. Native FOSSelect и Order More не мигрированы. Build/freeze-contract PASS; cross-browser201passed/3Firefox teardown errors/8skips, три случая затем3/3PASS. Полный прогон444/8fail/4skip до последнего Account fix не считается зелёным; Account и M7 rechecks passed, More/FOSAction failures остаются отдельно. [FE11 report](FE11_POPUP_PILOT_2026-11-09.md). Экранная приёмка и merge OPEN.

## CURRENT 09.11.2026 — FE-11 v0.2 motion candidate, lab only

Новое Owner ТЗ заменило hover-preview на selection-only. `DrawerLensCandidate` использует прежний FosGlassMaterial spring, но масштаб DOM-label рассчитывает по реальному перекрытию; hover и focus не ретаргетируют линзу. Подключён только NavigationDrawerLab через render-slot; перенос на общие компоненты и реальные экраны ожидает явного подтверждения. QA: 107 passed / 5 ожидаемых skips / 0 failed across Chromium/Firefox/WebKit/touch; Sidebar regression 14/14; build и diff-check PASS. Покадровые данные и видео локально. Owner approval OPEN / NOT FROZEN, независимый QA OPEN. [Реестр версии, fingerprints, причин и freeze policy](FE11_POPUP_PILOT_2026-11-09.md).

## CURRENT 09.11.2026 — FE-11 NavigationDrawer pilot

По новому ТЗ подготовлен пилот Drawer: `FosPopupRows` переиспользует материал/spring Sidebar и масштабирует DOM-label по приближению одной линзы. Preview pointer/focus отделён от click/tap commit; добавлены arrows/Home/End и flip у нижнего края. `FosPopupSurface` расширен opt-in оболочкой; Account/Select ещё не мигрированы, Order More исключён. Объём и результаты: [FE-11 pilot](FE11_POPUP_PILOT_2026-11-09.md). Build PASS; cross-engine/touch: 101 passed / 2 Firefox context-close protocol errors / 5 ожидаемых skips; оба сбоя отдельно повторены 2/2 PASS. Client/Manager/SidebarNav regression 35/35 PASS. По разделам C–D ТЗ перед распространением требуется Owner visual approval пилота. Независимый QA OPEN. PR #29 остаётся Draft; merge не выполнен.

## CURRENT 09.11.2026 — FE-DEBUG-2026-11-09 / frontend fixes

Branch `feat/fe-debug-2026-11-09`, based on verified `origin/main 01721e1`. FE-01/02/03/04/05/06/08 are implemented. FE-09 real route-shell motion now travels between Client/Manager shells. FE-10 Manager Drawer selection remains `NOT_REPRODUCED`. FE-07 keeps base `DEMO-001` read-only pending the PO/Owner/API editability contract. FE-11 uses one reusable `FosPopupSurface` for Drawer, Account, More and GlassSelect. Its neutral frosted coat, shared Manrope type and one travelling lens are consistent; Drawer reuses its existing lens for hover/focus and stays anchored under the hamburger. Menu actions and dismissal/focus behavior remain with each consumer. Owner visual acceptance of the rendered result remains OPEN.

QA: Latest `npm run build` PASS. Manual Playwright review captured Account, More and hamburger Drawer hover states; computed action type is Manrope 15/20/500, popup coat is white 72% with 20px blur, More lens settled at the hovered option, and Drawer lens target moved to the hovered route (`data-travel-target=48`) then remains one shared lens. The FE-11 focused suites were not rerun after the latest hover-lens changes; automated regression is OPEN. Earlier FE-09 Manager Orders + SidebarNav + Drawer suite **102/102 PASS** is retained as its prior checkpoint. Cross-browser, independent QA and final Owner visual acceptance remain OPEN. Draft [PR #29](https://github.com/SigmeD/flexomir_os/pull/29) is open, not merged. User reference screenshots remain untracked and untouched. No backend/API/1C/ACL changes.

Документация актуализирована 09.11.2026; следующая ревизия 23.11.2026.

### Typography audit / implementation update — 09.11.2026

Stage A used CURRENT Drive/Figma and browser computed styles. Added a scoped Manrope font token and semantic page/card/body/label/secondary type variables while leaving the global Onest stack available to standalone labs. Profile H1 now follows PageHeader V3 at D/L/T/M sizes; compact profile photo actions retain 14/20; the composer empty message uses 14/20. GlassSelect trigger and body portal now share the canonical font. Support thread 12/18 and Sidebar/Tab lens weights and optical scale are approved exceptions and remain unchanged.

`npm run build` PASS. Expanded typography contract tests PASS 16/16 across Chromium, Firefox, WebKit and touch Chromium; GlassSelect screenshots PASS 8/8 after text-only Manrope baseline updates. Full Playwright regression: 427 passed / 9 failed / 2 expected skips. Five distinct menu/focus checks fail (More deletion, Account alignment, Order Compose focus, popup focus outline and GlassSelect keyboard scrolling); some repeat across viewport projects. Keep regression status OPEN and investigate in the related FE-11/menu flows. Profile screenshots at D1440/M390/M320 are in ignored `output/playwright/typography/`; responsive assertions cover Client/Manager headers at D1440/L1024/T768/M390/M320. `git diff --check` reports no whitespace errors. TY-05 popup weight and TY-08 Profile/Layout 15/22 subheadings remain Owner-gated; formal visual acceptance is OPEN. No merge; no API/backend/1C changes. Details: [typography audit](TYPOGRAPHY_AUDIT_2026-11-09.md).

## CURRENT 09.11.2026 — FE-ACTION-08NOV / shared actions and responsive work dock

Branch `feat/fe-action-08nov` is based on `origin/main a9b2217`; code, responsive tests and docs are in [Draft PR #28](https://github.com/SigmeD/flexomir_os/pull/28); implementation/test checkpoint `f94f55b`. One shared `FOSAction` now carries the existing FOS Liquid Glass material, standard 44px and compact 40px pill sizes, and shares directional press handling with `HeaderAction`. `PageHeader` has an opt-in `floatingWorkActions` variant for actual Primary+More pairs only: desktop/laptop stay in the header; tablet/mobile use a fixed 108×48 dock with safe-area clearance. Client/Manager Orders, details, compose/item forms, Layouts, Support and Companies pairs are covered. Singles and Profile Save+More remain in their existing families/positions.

- Account trigger/header alignment and Profile photo action centering were corrected only where responsive measurements failed; Profile Save+More geometry remains unchanged and passes D1440/L1024/T768/M390/M320.
- Figma mapping: Action `835:259` → `FOSAction`; Work Dock `3143:1219` / adapter `3144:2851` → `PageHeader` opt-in; App Shell `637:180`, Account `3037:2656`, Avatar `3177:1314`, Profile Page Actions `3215:1357` → existing AppShell/Profile consumers. Reuse/extend; no Figma masters changed.
- QA: `npm run build` PASS; new responsive actions suite 48/48 across Chromium/Firefox/WebKit; `m7-layouts` 33/33 across Chromium/Firefox/WebKit; full `npm run test:e2e` 392 passed, 2 expected touch-only skips; `git diff --check` PASS. Screenshots are local under ignored `test-results/`.
- PR #28 is Draft and unmerged. Owner visual acceptance remains OPEN; do not call this accepted/released or merge. No API/backend/1C/ACL or business rules changed. User screenshots remain untracked and untouched.

Документы синхронизированы 09.11.2026; следующая ревизия 23.11.2026.

## CURRENT 09.11.2026 — FE-PROFILE-01 / Client + Manager Account Menu and Profile

Ветка `feat/fe-profile-01-account-profile` создана от свежего `origin/main 806b9b5`. Реализован общий account menu и профильный экран внутри текущего AppShell для Client/Manager, с изоляцией fixture identity, локальным photo preview, редактированием имени, dirty guard и confirm dialog. Для перехода: «Да» сохраняет и продолжает, «Нет» отбрасывает черновик и продолжает; закрытие диалога оставляет пользователя в профиле. Сохранение — только в демосессии; перезагрузка возвращает fixture. Company Settings, Logout и Profile More остаются disabled; backend/API/1C/ACL не менялись. [Draft PR #27](https://github.com/SigmeD/flexomir_os/pull/27); code/test SHA `d9e83b0`.

- Build PASS. Profile Playwright: 37 passed, 3 skipped (touch-only case на non-touch проектах); Chromium/Firefox/WebKit и touch Chromium, viewport 1440/1024/768/390/320. Связанный Client/Manager shell regression: 128/128 PASS в Chromium 1440/390. Скриншоты — ignored `output/playwright/profile-settings/`.
- Первый CI M7 прогон на `026697a` нашёл axe `label-content-name-mismatch` у desktop account trigger. Исправлено: footer берёт доступное имя из видимого текста; повторная M7 companies/integration/layouts/support регрессия прошла 105/105 в Chromium/Firefox/WebKit. Final CI после fix-коммита ожидает перезапуска.
- First CI attempt on `026697a` found and exposed the account trigger label issue; fixed. `Orders Core UI QA` and `FE-S03 M7 UI QA` both PASS on `d9e83b0`.
- Owner visual acceptance WIP remains OPEN; React is not marked accepted/released. PR #27 remains Draft, not merged. Следующий отдельный инкремент: FE-ACTION-08NOV — NOT STARTED.

Документация обновлена 09.11.2026; следующая ревизия 23.11.2026.

## CURRENT 08.11.2026 — FE-DEBUG-02 / issue #25

Работа начата от свежего `origin/main 25745e82e6b187b05642beb476f9d918cac71944` в `feat/fe-debug-02-client-workspace-centering`; рабочее дерево до начала было чистым, четыре исходных stash сохранены. Код, проверка и LIVE-документация входят в одну ветку; открыт [Draft PR #26](https://github.com/SigmeD/flexomir_os/pull/26); актуальный head и CI видны в PR.

- Общий `.fos-orders-page__main[data-layout=standard]` теперь центрируется внутри `.fos-app-shell__content` после Sidebar. Первопричина воспроизведена до правки: смещение 120px на 1920 и 440px на 2560; после — не более 2px.
- Потребители: Client Orders и вложенные формы/детали, Manager Orders, Companies, Layouts, Client/Manager Support. Header, tabs, cards и Add/More остаются в том же основном контейнере. Зафиксированные CURRENT Figma gutters сохранены.
- `wide` режим отложен: среди текущих экранов нет широких таблиц/датасетов; Manager Orders остаётся карточным списком. Стандартный max-width 1440px унаследован от текущего кода как проверяемый кандидат, не утверждённый DS-токен.
- Новая Playwright layout-матрица прошла в Chromium/Firefox/WebKit: 7 маршрутов × 7 ширин и 10 вложенных состояний × 7 ширин на каждом движке (357 проверок геометрии), без overflow; desktop центрирование и Client Orders общая ось PASS. Build PASS; полная функциональная регрессия PASS (342/342); независимая проверка PASS WITH RISKS, замечаний в последнем diff нет.

Следом: проверить CI на актуальном head PR #26; оставить визуальную приёмку Owner и merge открытыми. До Owner visual approval результат не считать принятым.

Документация проверена 08.11.2026; следующая ревизия 22.11.2026.

## CURRENT 08.11.2026 — FE-DEBUG-01 / issue #23

Ветка `feat/frontend-qa-debug-cycle` основана на свежем `origin/main bc734d29163cb84c5751437839b75044b98eb29b`. Новая задача продолжает M8 после merged PR #22; [Draft PR #24](https://github.com/SigmeD/flexomir_os/pull/24), code/test head `e1a9069`. До начала подтверждены чистое дерево, единственный worktree и четыре исходных stash; stash не изменялись. Merge не выполняется.

- `/` показывает Client «Мои заказы» и презентационную панель Client/Manager. Обе роли остаются в одном `OrderDemoWorkspace`; в QA через `demoTools=1` отдельная панель reset. Пока Manager draft изменён, роль/reset заблокированы, навигация не сбрасывает редактор; после явного Save переключение открывается.
- Старый Glass Filter доступен только через `?view=glass-filter-lab`; остальные лаборатории и прямые маршруты Client/Manager/Auth сохранены. Неизвестный `view` возвращает на Client с пояснением.
- Изменён shared `OrderCard` для доступного имени, сохраняя видимый номер и CTA. Новые проверки: `tests/demo-entry.spec.ts`, `tests/demo-presentation.spec.ts`; существующая регрессия фильтра закреплена за явным lab route.
- Текущий checkpoint: build PASS (207 modules), полный Playwright suite **338/338 Chromium PASS** на проектах 1440/390; кроссбраузерный пакет root/route/presentation/FE-S04/M7 **147/147 на каждом Chromium, Firefox, WebKit**. Responsive assertions включают 1440/1024/768/390/320, Axe — 0 нарушений на стенде. `git diff --check` PASS. Независимый regression review PASS: подтверждённых P0/P1 в этой правке нет; Owner visual/UI review остаётся OPEN.
- Снимки Client entry D1440/T768/M390 и JSON/прочие QA артефакты находятся в игнорируемом `output/playwright/fe-debug-cross-browser/`; они не добавляются в Git. Все шесть GitHub workflows завершились SUCCESS на code/test SHA `e1a9069`; следующий коммит — только документационный.

Следующий шаг: дождаться Owner UI review. Production-ready статус не заявлять.

Документация обновлена 08.11.2026; следующая ревизия 22.11.2026.

## CURRENT 08.11.2026 — M8 / FE-S05 issue #21, QA checkpoint

База `origin/main b5a8624b`; feature-ветка `feat/m8-ui-parity-refactor`; [Draft PR #22](https://github.com/SigmeD/flexomir_os/pull/22) открыт, mergeable, не слит. До старта проверены clean `main`, единственный worktree, четыре исходных stash — сохранены; открытых PR для этой ветки не было. Источники: Drive CURRENT M8, issue #21, CURRENT Figma DS V2 / FOS Technical Masters / Client UX V2 / Manager UX V2.

- Аудит A: составлена полная экранно-сценарная матрица Client + Manager с CURRENT node refs, общими masters/React consumers, состояниями/переходами, D/L/T/M/M320 доказательствами, severity, root cause и reviewer status — [SCREEN_MAP](SCREEN_MAP_M4_2026-11-06.md). 27 пар сравнения покрывают девять shared families D/T/M; там, где отдельной пары для каждого состояния нет, матрица честно указывает functional evidence/—.
- Подтверждённое P1: в Client LAY03 активный `Макеты` был выключен guard-ом Item editor. Исправлено: активный пункт остаётся доступен, другие пункты остаются защищены до завершения Item. P0 не найдено; независимая визуальная выборка не выявила иных подтверждённых крупных P1.
- Manager Orders New/All — существующая FE-S04 demo grouping; PILOT Search/Company/Sort остаются OWNER OPEN. AuthCandidate — `OWNER_DESIGN_OPEN`. Sidebar icon/text parity, “Клиенты/Компании”, server/API/1C/ACL status semantics, persistent file storage и Support async остаются OPEN — не менять без решения.
- Минимальная правка B: сохранить guard незавершённого Item, включать только текущий активный раздел в sidebar/drawer; остальные назначения остаются disabled. Shared Glass/material/motion не менялись. Тест проверяет active/enabled и блокировку остальных пунктов.
- Проверки head `515111d`: `npm run build` PASS (207 modules); расширенный связанный Client/Manager/Orders/Glass/Layout/Support/FE-S04 suite 268/268 Chromium на профилях 1440/390, responsive checks включают D/L/T/M/M320. Независимая выборка ранее прошла 164/164 Firefox+WebKit, layout 22/22 Chromium, comparison PNG 27 (9 families × D/T/M). Новые New Item D/L/T/M/M320 снимки созданы локально и игнорируются Git. Три GitHub workflow на этом head — SUCCESS.
- Независимый re-review: PASS WITH RISKS; новых P0/P1 или ложного parity заявления не найдено, но полный state-by-device side-by-side набор не создавался. Owner visual acceptance остаётся OPEN; PR #22 Draft. Merge запрещён без Owner-разрешения; backend/API/1С не затронуты.

## CURRENT 07.11.2026 — FE-S04 / issue #19, в работе

База: свежий `origin/main` `8099539d9a5e018492de93f7a55137cfa783b5de`; ветка `feat/fe-s04-client-manager-ui`; [Draft PR #20](https://github.com/SigmeD/flexomir_os/pull/20), head `3f8c0a3bd92e9cb6452bab0e6488fb39ef8fcb0d`. Merge запрещён без разрешения Owner. Исходные stash и локальные данные сохранены.

- Перед FE-S04: TypeScript/build PASS на свежем main; FE-S03 regression M7 105/105 (Chromium/Firefox/WebKit) и Orders/Glass 202/202 Chromium. Изменения только README между `8b54886` и `8099539`.
- FE-S04 A–D: Manager Orders `Новые/Все` и demo processing; приватный Manager draft по существующим компаниям через общий `OrderComposer`; Auth UI candidate; Client→Manager→Client на общем in-memory store плюс synthetic import fixture только при `fixture=imported-1c`.
- Блоки A–D smoke прошли 34/34 Chromium на 1440 и 390; полный M7 regression — 105/105 Chromium/Firefox/WebKit; Orders/Composer/Glass/FE-S04 — 210/210 Chromium; `npm run build` PASS (207 modules), `git diff --check` PASS.
- Границы: только React/fixtures; нет API, писем, аккаунтов, реальной проверки кода, синхронизации/1С или production status. Auth Figma отсутствует: `OWNER_DESIGN_OPEN`. Визуальная полировка и pixel parity остаются M8.
- PR #20 открыт; проверять CI строго на head SHA. Drive CURRENT синхронизировать с PR и этим QA. Визуальное принятие и merge остаются Owner gates.

Документация обновлена 08.11.2026; плановая ревизия 22.11.2026.

## CURRENT 07.11.2026 — FE-S03 / M7, PR #18

FE-S03 / M7 merged to `origin/main` in `7828005`. The post-merge Client OrderDetail correction and related docs were committed as `7078b39`, then merged and pushed to `origin/main` in `e184e01`. Screen acceptance and visual OPEN items remain open. CI for the correction and merge has not run; follow the Owner gate before release.

- Готово: компании Manager → связанные заказы → общая деталь → назад; общий Support Client/Manager; My Layouts LAY01…09 UI preview и выбор/замена из формы позиции. Состояния, фокус, навигация и синтетические данные сохраняются в пределах демосессии.
- Итоговая проверка 07.11: build PASS (205 modules), M7 **105/105** Chromium/Firefox/WebKit, Orders/Glass **202/202** Chromium; в итоговых прогонах skipped 0 / flaky 0 / failed 0. В первом M7 был Firefox Drawer timeout (104/105); три изолированных повтора PASS, первопричина не подтверждена, полный прогон повторён отдельно от regression. Команды и доказательства — [HANDOFF](HANDOFF.md). Эти результаты предшествуют `7078b39`; CI для correction/merge ещё не запускался.
- Figma CURRENT LAY03/04 D/T/M перепроверены по узлам 1316:2015/2074/2165/2223/2315/2372. Визуальные пары: output/fe-s03/comparison/index.html (27). Совпадают геометрия рядов/detail и адаптивные отступы. Structural OPEN desktop picker: Figma показывает родительские breadcrumbs «Новая позиция / Мои макеты» и Sidebar «Макеты»; React показывает только «Мои макеты» и сохраняет Sidebar «Заказы» от формы позиции. Остальные отличия: runtime Glass, контраст secondary text, native fields и предупреждение демосессии. VISUAL/Owner acceptance OPEN.
- CI Orders теперь реагирует также на src/components/layouts/**: эти стили используются внутри общего OrderItemForm. CI для correction/merge OPEN.
- Независимое ревью и экранная приёмка OPEN. Backend/API/1С/реальный upload/ACL/full My Layouts scope — Алексей/PO/Owner, OPEN. Push выполнен; release OPEN.
- Все восемь исходных изменений включены в `7078b39`; stash остаётся резервной копией до проверки итогового Git-состояния.

Ревизия документов: 06.11.2026; следующая 20.11.2026. Адресная синхронизация статуса: 07.11.2026. Более ранние checkpoints ниже — история.

FE-S03 D checkpoint / PR #18: доступные разделы подключены через единый CabinetNavigation/OrderDemoWorkspace; AppShell commits после onSelectionSettled. Сохранение формы Support и контекста компании проверено на пяти размерах; явные opener IDs исправляют Safari focus-on-click. Общий HeaderAction ограничивает tooltip viewport при hover/focus и disabled→enabled, без изменения material/spring. Build PASS; финальные 105 M7 и 202 regression перезапускаются после visual capture, результаты ещё PENDING. Ранее 98/105 и 201/202 не объявлены PASS: устранены реальное tooltip overflow и автоматический reload Vite от записи QA HTML. Генератор сравнений запускать отдельно от тестов. A614742f / B059b270 / Cbc52a45; D code checkpoint. Owner/independent review/merge OPEN, merge не разрешён.

FE-S03 C checkpoint / PR #18: LAY01…09 UI preview реализован одним LayoutBrowser (library/select/replace), LayoutRow/Detail/UploadForm/UploadPanel; HeaderAction расширен Choose из Figma, shared material/motion сохранён. ArtworkSource использует общий LocalFileControl и один LayoutPicker в New/Edit Item. Выбор/замена возвращает тот же Item с полями/фокусом/scroll; local names и synthetic IDs живут только до reload. Build PASS; Chromium C 11/11 (5 размеров + empty/error/cancel), FE-S02 targeted regression 7/7. Axe 0 list/detail/upload; captures local output/fe-s03. История/More ведут в UX PROPOSED 2101:7959, disabled; download/server storage/ACL OPEN. Illustrated 20MB/formats не внедрены как policy. B mobile thumbnail уточнён по master2409:11521:60px, без локального 48px. A/B/C checkpoints выполнены, D integration/full QA next. Owner visual acceptance OPEN, merge запрещён без разрешения.

FE-S03 B checkpoint / PR #18: общий Support Client/Manager реализован по FR-SUP-001..006. Build PASS; Chromium 11/11 functional + 2/2 D/T/M visual-state suites, axe 0 на list/form/detail/submitted. Общие SupportTicketRow/Form/Detail + ArtworkThumbnail; субъект H1 сохраняется, отправка только в демосессии, owner data отдельно, fixture error сохраняет ввод. Category/attachments/author reply/delete/triage исключены; Client candidate form визуально сокращена до подтверждённых полей (Owner OPEN). Реальные server loading/ack/API не имитируются. A 614742f, B checkpoint next, C/D pending; merge не разрешён.

## CURRENT 06.11.2026 — FE-S03 / M7 in progress

Owner requested issue #17, sequential A/B/C/D, one PR and no merge without permission. Fresh origin/main = 351157c, PR #16 merged, active PR inventory empty at start. Working branch feat/fe-s03-m7-client-manager-ui; main unchanged. Drive CURRENT plan/SRS/Scope and CURRENT DS/FOS/Manager Companies read. A FUNCTIONAL/TECHNICAL QA: build PASS; Chromium 5/5 at 1440/1024/768/390/320, whole-page axe 0 violations. Figma/React list images inspected D/M; geometry matches 80px rows, 16px gaps and search spacing. Synthetic copy differs; accepted runtime Glass remains. Owner visual acceptance OPEN. B/C/D pending. Existing staged OrderDetail/test/docs edits and deleted screenshots preserved outside task commits; stash unchanged. Current plan and component/transition map in DELIVERY_PLAN / COMPONENT_REGISTRY / SCREEN_MAP.


## FE-S02 / #15 — Figma parity CODE_DONE / Owner gate OPEN

База `origin/main 884e78f` (FE-S01 PR #14 merged); обычная ветка `feat/fe-s02-order-compose-flow`, тот же [Draft PR #16](https://github.com/SigmeD/flexomir_os/pull/16). `5a26e4a` — shared masters; `03f55ac` — reference New Item; `df98092` — остальные композиции + LIVE docs (пять CI SUCCESS, Orders Core 202). Финальная корректировка Client Date Field проверена отдельно; CI последнего SHA — GitHub. Main/worktree/stash/Screenshot_3.png не изменены; новые ветки/PR/зависимости не создавались.

Один UI-слой для Client/Manager: PageHeader/Breadcrumbs, расширенный HeaderAction, MoreAction/OverflowMenu, FOS fields/Action, PrintingMethodControl, ArtworkSource, SectionAddItem, целиком кликабельные OrderCard/OrderItemRow. Один ItemForm New/Edit, один Composer New/Repeat, один readonly Detail. Footer substitutes и отдельные Send/menu engines удалены. AppShell chrome приведена к общей DS; принятые Glass/GL03/Sidebar/Drawer optics/spring сохранены. Исправлены portal Escape, all-disabled Drawer focus, возврат фокуса и 320px grid.

Функционально: 0/1/N, valid/dirty/disabled/error, Add/Save/явный Cancel по прототипу, сохранение общих полей в памяти, свежие clone IDs без изменения источника/старых дат, Send → «Заказ отправлен» / «Передан менеджеру» → та же Manager запись. Фильтры/reset/readonly и границы Company проверены на demo fixtures. `&demoTools=1` включает отдельный role-switch harness; обычная композиция его не показывает. API/1С/auth/storage не реализованы.

Проверки: build PASS (175 modules), расширенный TypeScript src/tests/configs PASS. Полная регрессия **200 Chromium + 78 Firefox/WebKit PASS**; после добавления screen-wide axe — ещё 2 Chromium + 2 Firefox/WebKit PASS, 0 WCAG2A/AA/2.1AA violations на проверенных Client/Manager list/detail и Composer. После коррекции secondary text повторены shared-component/полные композиции и captures. Текущая CI-команда включает **202** Chromium cases, cross-engine config — **80**. Итог CI именно текущего head сверять в PR #16; локальный QA не заменяет Owner acceptance. Команды, раздельные engine captures/JSON и ограничения — [HANDOFF](HANDOFF.md).

**Визуальная приёмка/merge BLOCKED.** [Screen Map](SCREEN_MAP_M4_2026-11-06.md#fe-s02--проверка-переходов-figma--react) содержит таблицу Figma → действие → state/frame → React handler → PASS/OPEN. [Component Registry](COMPONENT_REGISTRY_2026-11-06.md) содержит master/consumer/state QA и конкретные source conflicts: native controls/file policy/library, доступный secondary text вместо недостаточно контрастного Figma, V3 против старых absolute offsets, Manager PILOT list panel/PROPOSED actions/ACL, production leave policy. Лишнее поле agreed date в Client исправлено по CURRENT completed/production; общая модель и Manager сохранены. Side-by-side D/T/M + captures пяти ширин в `output/fe-s02-parity/`; Owner исключения не объявлены согласованными.

`CR-REP-2026-11-06` (подписной, новые поля Repeat, media/вложения/обязательный комментарий) DEFERRED. Backend/API/1С/ACL — Алексей; Delete Draft/Item, Duplicate Item, persisted upload/library, Manager publication/concurrency и физические устройства/полный screen reader audit OPEN/NOT RUN. Следующий шаг — визуальная приёмка реального PR #16 и решение перечисленных OPEN, затем только явно разрешённое слияние.

## История FE-S01 до merge — PR #14 уже слит в main 884e78f

База `15eb6d9`; ветка `feat/fe-s01-orders-core`, [единый PR #14](https://github.com/SigmeD/flexomir_os/pull/14), без merge в main. A (`3a15eb6`): Client `?view=client-orders` на готовом shell/GL-03/карточках, общие список/empty и оформление. B: один read-only OrderDetail/OrderItemSummary и переход список → деталь → назад для Client и Manager; сохраняются ID/статус, фильтр, фокус и прокрутка. Два клиентских заказа из общего DEMO-набора компании 01 — не серверная ACL.

Проверено: build PASS (77 modules), расширенный TypeScript check PASS; общая регрессия Chromium **180/180**, списки/детали Firefox + WebKit **58/58**, пять размеров 1440/1024/768/390/320, длинные строки, 0/1/2 позиции, keyboard/touch, reduced-motion/forced-colors. A отдельно прошёл 38/38 до B. PNG локально в `test-results/`; CI artifact — `orders-core-screen-captures`. Core Glass/AppShell не изменены. Статус CI финального SHA проверять в PR; локальный PASS не заменяет CI или Owner acceptance. Дальше — Owner review PR #14, затем отдельный New/Repeat + Manager processing по контрактам. Полные кабинеты, API/1С, физические устройства и screen-reader audit не объявляются готовыми. Ниже — исходный снимок до FE-S01.

## Исторический M4-снимок до FE-S01

- Проверено: `origin/main` `89b043f9ae7e70a36a1eea8f5c98cd621e037aa9`; PR #5, #9, #10 закрыты как MERGED. Первый экран Manager Orders, AppShell и NavigationDrawer уже в React; **Client React-экраны ещё не реализованы**. Полный Manager/Client MVP не готов.
- **M4: AUDIT DONE / OWNER REVIEW OPEN.** Сверены CURRENT Figma DS/Client/Manager, CURRENT Scope/SRS/E2E и `origin/main` `89b043f`. Подробный реестр: [M4 screen map](SCREEN_MAP_M4_2026-11-06.md). Client: **0 собственных React-экранов**, общий `AppShell` есть, но не подключён к клиенту; Manager: `AppShell` готов, список «Все заказы» частично реализован, остальные модули не созданы. Подтверждённые UX не подменяются пилотами/архивами. Следующее React-задание агенту: **FE-S01 (#12): блок A Client Shell + «Мои заказы», блок B read-only OrderDetail для Client + Manager; одна ветка от main и один React PR с LIVE docs** на synthetic fixtures; Owner вопросы по auth, «Клиенты/Компании», queue и full My Layouts остаются OPEN.
- **ДАЛЬШЕ:** M5 каркасы и основные экраны обоих кабинетов → M6 сквозной заказ между ролями → M7 оставшиеся утверждённые MVP-разделы → M8 UX/UI-полировка → M9 итоговый QA. Данные пока синтетические.
- **Правило:** LIVE-документация обновляется в той же задаче, что код/решение; Drive-план, локальный статус, реестр компонентов, решение и handoff поддерживаются без вторых «актуальных» планов. Успешный CI/merge не равен продуктовой приёмке.
- **Границы:** frontend/React — наша работа, backend/API/1С — ответственность Алексея. [Действующий план](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit).

**Рабочий план:** [09_Frontend Development Plan CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit). Владелец 06.11 ограничил нашу работу React/frontend: компоненты, экраны, интерактивность, адаптивность, тесты и UI-интеграция с готовым API. Backend, создание API, server ACL и обмен с 1С — за Алексеем; не ставить эти работы в наш frontend-бэклог. Figma — DS + источник свойств компонентов, НЕ команда реализовать ~230 отдельных кадров.

## Последнее — 06.11.2026: PR #9 слит в main

- PR #9 слит в `origin/main` (`0fc653667ac4acba675fe702920b476a2fda5ac8`) после пяти успешных CI-проверок на `aaaa4304`. PR #5 уже в main (`7372685`); оба preview-маршрута сохранены.
- Общий `AppShell` подключает существующий Drawer к Manager Orders ниже 1024px, SidebarNav — от 1024px. Glass primitives, API/1С и бизнес-контракты не изменены; отсутствующие разделы остаются disabled.
- Свежая локальная проверка: build PASS, combined Chromium **148/148**, финальный экранный Chromium **26/26**, Firefox/WebKit **26/26**, пять размеров и открытое меню T/M. [Протокол, команды, снимки и ограничения](FE08_MANAGER_ORDERS_M3_QA_2026-11-06.md).
- Статус: `CODE_DONE / QA_VERIFIED / MERGED / OWNER_SCREEN_OPEN`. Слияние разрешено прямым поручением владельца; визуальная приёмка и релиз этим не объявляются. Сейчас завершается только слияние PR #9/#10; следующий этап — единая карта экранов Client + Manager в существующем Drive-плане. Название «Клиенты / Компании» остаётся Owner/PO OPEN.
- Существующие локальные аудитные правки и удаления скриншотов сохранены отдельно от коммитов задачи. Ниже — прежние снимки; актуальный этап задаёт этот блок и [Drive CURRENT M0–M9](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit).

**Локальный снимок:** 04.11.2026. **Источник свежих изменений:** [Frontend Startup CURRENT](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit). На новой сессии проверить изменения в Drive и фактический Git.

## Объединение веток — 04.11.2026

- По прямому поручению владельца все локальные и origin-ветки включены в `main`, включая ветку компонентного процесса. Ветки и рабочие папки не удаляются.
- В `origin/main` на `e6fad06` код HeaderAction, SidebarNav и нейтрального стекла уже присутствовал через squash. Конфликты исходных веток разрешены без изменения этих исходников, тестов, зависимостей и CI; сохранена полная история коммитов.
- До слияния и повторно после разрешения конфликтов: `npm run build` PASS (TypeScript + Vite, 50 modules), `npm run test:e2e -- --workers=2` — **80 PASS**, Chromium 1440/390. Проверены 60 локальных Markdown-ссылок и якорей, broken=0; staged diff без whitespace errors. Статус технической интеграции: `QA_VERIFIED`. Material/optics и CURRENT Drive/Figma в задаче слияния NOT RUN; новые продуктовые approvals не выдавались.
- Единственные исходные незакоммиченные изменения — удаления `Screenshot_1.png` и `Screenshot_2.png`; они сохранены вне коммитов. Рабочая папка `D:/Projects/flexomir_os`, дополнительных worktree нет.
- Ниже сохранён контекст предыдущих задач. Указания «код не изменён» и DRAFT относятся к подготовке соответствующей документации; фактически shared-компоненты уже существуют. Дальше нужна сверка их контрактов и Owner gates, затем Manager Orders.

## CURRENT / OWNER 04.11 — компонентный процесс (заменяет обязательный HTML для каждого экрана)

- Сверены CURRENT Client UX V2, Manager UX V2 и общие FOS masters: 95 мастер-семейств, 57 общих [карта](https://drive.google.com/file/d/1vK7eRlBXxDxTAdfKQhdFA8qRVJ6H_FOr/view). Архивы и superseded не используются.
- Новый путь: Figma → компонентный контракт → **HTML только для сложного материала/движения/меню** и Owner gate → React shared primitive → QA → React screens → Figma visual QA/Owner. Схема «каждый экран HTML» УСТАРЕЛА.
- FE-01 [HeaderAction contract](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view) DRAFT: 68×68 icon+label desktop, Compact48 T/M, одна семья Client/Manager; текстовая ActionButton — отдельный компонент. Не исправлять мобильную подпись, противоречащую SRS, самостоятельно.
- Исходный Agent Package A: геометрия + состояния/disabled + a11y + тестовое dev-preview; **без** GL-01B motion, без бизнес-логики. Package B после Owner motion approval. На момент подготовки этой ветки код ещё не менялся; теперь документация и существующие реализации включены в main, без нового Owner approval.

## История локальной проверки и уборки 04.11.2026

- Рабочая папка `D:\Projects\flexomir_os`, одна рабочая папка Git; уборка документов ведётся в `docs/filesystem-cleanup` от `eb6173e`. `origin`: `https://github.com/SigmeD/flexomir_os.git`. До уборки уже отсутствовали отслеживаемые `Screenshot_1.png` и `Screenshot_2.png`; эти удаления оставлены без изменений и не включаются в уборку документации.
- `gh repo view SigmeD/flexomir_os --json nameWithOwner,visibility,defaultBranchRef,url`: PUBLIC, основная ветка `main`. Приватность из пакета не выполнена; доступ без решения владельца не менялся.
- Уже существует React 19 / TypeScript / Vite приложение, `src/App.tsx`, `src/GlassMaterialLab.tsx`, Glass/Select primitives, тесты и lockfile. Это Glass-полигон с DEMO-заказами, а не принятый продуктовый Manager Orders.
- Последняя сборка при подключении правил 04.11: `npm run build` PASS, TypeScript (`tsc -b`) и Vite production build, 41 module. При аудите и уборке файлов сборка повторно не запускалась. Зафиксированные версии: Node `v24.11.1`, npm `11.6.2`, Git `2.56.0.windows.4`, Codex CLI `0.166.0`. Отдельных npm scripts `lint` и `typecheck` нет.
- Браузерные тесты/оптический gate в этой задаче NOT RUN: менялись только инструкции и документация. Старые результаты от 03.11 доступны в [документе материала](fos-glass-material.md) и [Select](glass-select-check.md), не считаются свежей проверкой.
- Отчёты `output/`, `test-results/`, `playwright-report/`, зависимости, сборка и кэши исключены `.gitignore`. Версионируемые PNG-эталоны тестов сохранены; тяжёлые видео/PNG прогонов не отправляются.
- Подключены корневой `AGENTS.md`, `.codex/config.toml`, карта источников, QA, реестр решений, план и handoff из пакета владельца с поправками на факты. Superpowers skills доступны; проект уже trusted. Автоматическая загрузка новых файлов в следующей сессии ещё не проверена.

## Продуктовые источники: частичная CURRENT-сверка

04.11 перечитаны CURRENT Baseline (изменён 03.11 в 16:54 UTC), Frontend Startup (20:44 UTC), UX/UI Index (19:19 UTC) и Glass Visual Contract (20:45 UTC). Направление и открытые гейты ниже подтверждены этими документами. Figma и адресная нормативная сверка SRS/Scope/Governance/Data/E2E ещё не выполнены; FE-01 целиком не закрыт.

- Исторические схемы «сразу Figma→React» и «полный HTML каждого экрана перед React» заменены уточнением Owner 04.11: component-first, HTML только сложным motion/optics/menus.
- Прежний автономный HTML-пилот НЕ ПРИНЯТ; не использовать как baseline.
- Primary Button 2.1.5, Sidebar Lens 2.2.5 C, Horizontal Tabs 2.3.3c указаны как визуально согласованные изолированные HTML-эталоны. React-порт и продуктовая интеграция — отдельные гейты.
- Select/Dropdown и `FosGlassMaterial`: Owner gate OPEN; код в этом репозитории есть, его существование не означает продуктовую приёмку.
- Карта ссылок и Figma node IDs — в [SOURCES](SOURCES.md). Документ хранит происхождение пакета; частичная свежая проверка указана выше.

## На очереди

1. **FE-01:** проверить CURRENT Drive/Figma по первой продуктовой задаче; локальная часть FE-00 выполнена.
2. **FE-02/03:** решить вопрос PUBLIC/PRIVATE; использовать существующий React и build, не повторять bootstrap. Запуск и браузерный QA проверять отдельно.
3. **FE-04/05/06:** карта компонентов и FE-01 HeaderAction DRAFT, затем Agent Package A (base React icon action, QA, не трогать экраны).
4. **FE-07:** после визуального Owner approval GL-01B — motion Package B; Figma/HTML/React side-by-side QA.
5. **GL-01…GL-05 (параллельно):** React-порт визуальных эталонов, затем Select/Dropdown по контракту.
6. После компонентного и motion QA + Owner — React Manager Orders, review, PR; не создавать отдельный HTML всего экрана без специфического обоснования.

## Блокеры и открытые решения

- Требование пакета о приватности расходится с последним проверенным PUBLIC GitHub; решение владельца OPEN. CURRENT Drive сверён частично, Figma не инспектировалась.
- Детальные причины непринятия прежнего HTML не оформлены; выполнить gap-аудит, не копировать его.
- SRS Client Orders: Tabs Desktop / Select Tablet-Mobile; единый Dropdown предложен, но не утверждён.
- Критерий Manager «Новые», real API/1C field/status mapping, permitted actions и маршруты требуют подтверждений.
- Website Glass: локальный build проверен; браузерные/оптические тесты требуют свежего прогона для продуктового гейта. Лицензия и браузерная совместимость — отдельные проверки.

## Предыдущее изменение — уборка

- 04.11.2026, Codex, `docs/filesystem-cleanup`, исходная точка `eb6173e`: файловый аудит и уборка документации по поручению владельца. Удалены три завершённых Glass-плана; история остаётся в Git. Действующие ограничения, SHA256, отчёты, локальные доказательства и 14 PNG-эталонов сохранены.
- В README и отчётах обозначены локальные ссылки в `output/`, внешние HTML по путям `D:/downloads/`, порядок получения новых доказательств и границы воспроизводимости. Текущий план поставки и продуктовые решения не менялись.
- При read-only аудите: 55 локальных Markdown-ссылок разрешались, 21 из них вела в игнорируемый `output/`; 20 локальных импортов разрешались; 18 прямых зависимостей совпадали с lockfile/установкой; дублей рабочих файлов по SHA256 не найдено. `git fsck --full` не выявил повреждений, сообщил о двух dangling blobs. Это результаты аудита, не runtime QA.
- Статус уборки и проверка итогового diff — в [HANDOFF](HANDOFF.md). Следующее: закончить FE-01 и перейти к одному React-пилоту Manager «Заказы»; ожидание финальной оптики Glass его не блокирует.
