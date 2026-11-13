# GL-02B — адаптивное меню NavigationDrawer (CURRENT / 04.11.2026)

Действующий результат: Drawer и AppShell интегрированы, PR #5/#9 давно слиты. Сохранённые проверки M3 относятся к 06.11, а не к текущему head. Старые disabled-разделы и ожидание merge — история; текущие экраны — [карта](SCREEN_MAP_M4_2026-11-06.md).

**Статус:** CODE CANDIDATE после Owner уточнений. Новые тесты/визуальная приёмка отдельно. Предыдущие 68/68 относились к версии ДО этих изменений; их нельзя выдавать за результат текущей ветки. PR #5: https://github.com/SigmeD/flexomir_os/pull/5. Не объединять без проверки результата и явного Owner approval.

## Источник

- CURRENT **Client UX V2**, Figma Mobile overlay frame [1962:3854](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1962-3854), Tablet overlay [1962:3834](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1962-3834).
- CURRENT **Manager UX V2**, Orders Tablet `2495:9000`, Mobile `2495:9097`: общий Menu Button внутри FOS V2 Shell. **Открытый Drawer менеджера в текущих пилотных фреймах не представлен**; не считать клиентский контент автоматически утверждённым менеджерским продуктовым экраном.
- Figma canonical `FOS V2 / Navigation Drawer` `1368:499`; Menu Button icon `1368:371`; FOS shared Navigation Item `634:511`, Glass Lens `1578:493`.
- Исключены ARCHIVE, SUPERSEDED, UX PROPOSED.

## Не путать с полноэкранным Drawer

Текущий паттерн — **компактное плавающее меню с правой привязкой под 72px header**. Не боковая выезжающая панель.

| Параметр | Mobile 390 | Tablet 768 |
|---|---:|---:|
| Panel | 296 × 229 | 320 × 229 |
| X / Y | 74 / 72 | 428 / 72 |
| Right inset | 20px | 20px |
| Padding / radius | 16 / 20px | 16 / 20px |
| Navigation rows | 3 × 44, gap4 | 3 × 44, gap4 |
| Inner nav width | 264 | 288 |

При ширине 320px панель адаптируется до 280px. Scrim: black opacity 0.16. Стекло: нейтральное белое полупрозрачное покрытие с backdrop blur20 и лёгкой тенью/кромкой; **не синяя заливка**. Divider 1px, footer 13px Manrope. **Owner 04.11.2026 утвердил отклонение от icon-less Mobile/Tablet Figma**: навигационные SVG-иконки и их движения должны быть теми же, что в Desktop Sidebar. Реальные CURRENT Figma mobile overlays пока без иконок — это документированное требование на обновление дизайн-мастера после визуальной приёмки.

## Компонентный контракт

- `NavigationDrawer` берёт `items`, `activeId`, `onSelect`, `onSelectionSettled`, `closeOnSelection`, `ariaLabel`, `footerText` от родителя. Сам не вызывает API/роутинг/1С, не создаёт заказов. Закрытие после движения линзы остаётся поведением по умолчанию для реальной навигации. В изолированном стенде новый Owner режим «оставить меню открытым до outside-click/Escape/trigger» включён по умолчанию, и его можно сравнить с обычным закрытием по завершении движения.
- Один **принятый** `SidebarNav` с нейтральным `GlassLens`: hover меняет только цвет; выбранная линза перемещается после выбора; text max 1.043× и icon max 1.022× только по мере движения линзы. **Иконки теперь показаны и в Drawer — общий SVG-компонент, 19×19 и gap12, без новой библиотеки и дубликатов.** Пункты обоих React-стендов импортируются из единого файла `src/navigation-demo-items.ts`.
- Меню-триггер: видимая Figma Menu 20×20 с тремя полосками 16×1.5px, увеличенная невидимая область нажатия 44×44 для touch/a11y.
- `role=dialog`, `aria-modal=true`, `aria-expanded/controls`, активный пункт в фокусе при открытии, Tab/Shift+Tab внутри, Escape/outside click/trigger закрывают всегда; `selection` закрывает только в режиме `closeOnSelection=true` **после полного прихода общей линзы**, при `false` меню остаётся открытым для последовательных выборов. Фокус возвращается на триггер; фон `inert`, scroll lock body и documentElement.
- Открытие/закрытие — локальная CSS-анимация (предварительная, **не утверждена Owner**). Reduced-motion/forced colors/fallback отдельно.
- Preview: `/?view=navigation-drawer`. Тестовый переключатель ролей **только в лаборатории**.

## Разделение статусов и рисков

- React code — в отдельном PR, **main не затронут** до merge.
- Browser/TS QA — CI workflow `.github/workflows/navigation-drawer-qa.yml`, результаты должны быть зафиксированы отдельно. Owner visual gate не подменяется CI.
- Менеджерские пункты (в текущей Instance «Клиенты») противоречат названию «Компании» в структурном разделе Manager V2; отдельное PO/Owner решение.
- В Figma Manager Shell встречается Role=Client при user text «Менеджер» — отдельный нерешённый дефект исходных мастеров.
- Manager footer — в demo «Менеджер · тестовый режим» как **заглушка**, без передачи в действующий продукт.
- Реальная навигация, responsive AppShell, deep links, разрешения, 1C/API, тесты Firefox/WebKit и на реальных устройствах — последующие стадии.
- Адаптив 1024+ использует desktop Sidebar; GL-02B Drawer реализуется для Tablet/Mobile, не заменяя его.

## Изменения после первого QA и Owner review

- В конце 04.11.2026 Owner прямо согласовал **единые иконки** для мобильного меню и десктопа. Это более новое принятое решение, чем icon-less прототип Drawer в Figma; пометить текущий мастер как требующий синхронизации, не менять без проверки.
- В ответ на UX-запрос «выбирать пункты до клика вне панели» введён параметр `closeOnSelection`. Функциональные тесты и React-визуальная приёмка для этой версии должны быть повторены. Базовая продакшен-политика остаётся закрывать после завершения линзы; stay-open — текущая демонстрационная политика в лаборатории.
- Не смешивать статусы: предыдущий CI 68/68 относится к старому состоянию PR #5; новая версия проверяется отдельно. `SidebarNav`, `HeaderAction` и исходные masters не изменены.


## FE-08 / M3 — Orders + NavigationDrawer — основания и проверки

**06.11.2026 · PR #9 · CODE_DONE / local QA_VERIFIED / OWNER_SCREEN_OPEN.**

## Result and scope

PR #5 is merged into main at `7372685`. Merge commit `8f5eeb7` brings that baseline into the existing PR #9 branch and resolves the single `src/App.tsx` import conflict. Both Orders and Drawer lab routes remain available, along with all existing previews.

`AppShell` now composes desktop SidebarNav (>=1024px) and the existing NavigationDrawer (<1024px) around Manager Orders. A sticky 72px compact header keeps the fixed menu anchored below the header after scrolling. Both presentations receive one Manager item configuration. Selecting the current Orders item dismisses the menu; `Клиенты` and `Поддержка` remain disabled until real frontend destinations exist. Naming `Клиенты` vs `Компании` remains Owner/PO OPEN.

Drawer, SidebarNav, GlassPillTabs, HeaderAction, material, motion and global styles are byte-identical to `origin/main`; no optical implementation was added. The responsive host unmounts Drawer on desktop, releasing the existing component's inert/scroll lock. Filters and order data survive opening, dismissal and breakpoint changes.

## Sources and design checks

- [CURRENT frontend M0–M9](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit), read 06.11.2026; Owner's explicit four-step integration instruction in this session.
- [Existing Drawer contract](GL02B_NAVIGATION_DRAWER.md), PR #5 code/CI and recorded Owner merge instruction. Old pre-merge statuses in that contract describe its original component delivery.
- Live Figma metadata read: Primary DS `634:60`, FOS masters `1688:532`, CURRENT Manager mobile `2495:9097`. Mobile shell header is 72px. This verifies the source/structure; no pixel-perfect recreation or visual approval is claimed.
- React effect cleanup and Playwright focus/screenshot APIs checked against official documentation through Context7.

## Fresh local verification

Windows, Node **24.11.1**, installed React **19.3.1**, Vite **6.4.5**, Playwright **1.64.1**. CI uses lockfile + Node22; local installed versions are reported separately, without changing dependencies.

- `npm run build` — PASS, TypeScript + Vite, 68 modules.
- Extended temporary TypeScript check covering src, the changed Orders spec and Playwright config — PASS (`npx tsc --project output/fe08-drawer-integration/tsconfig.qa.json`). No permanent tooling/config change.
- Combined Chromium regression — **148/148 PASS** in 1.5m: Orders, Drawer, both GL03 suites, SidebarNav, HeaderAction. Command matches the expanded FE08 workflow: `npx playwright test tests/manager-orders.spec.ts tests/navigation-drawer.spec.ts tests/glass-pill-tabs-react.spec.ts tests/gl03-compact-pill-tabs.spec.ts tests/sidebar-nav.spec.ts tests/header-action.spec.ts --workers=2`.
- Final Orders run after screenshot framing/import formatting changes — **26/26 PASS**, both Chromium projects, 9.5s.
- Orders suite in **Firefox and WebKit — 26/26 PASS**, 24.1s, using a temporary local config. These are Playwright engines on Windows, not physical Safari/iOS/Android devices.
- Test-first evidence: the new mobile integration test initially failed because `Открыть меню менеджера` was absent; it passed after shell integration.
- Checked all five widths **1440 / 1024 / 768 / 390 / 320**, plus open-menu resize across **1023/1024**, touch **768×390** landscape and empty-data **320×480**.
- Verified keyboard Enter, Tab/Shift+Tab trap, Escape, scrim/current-item dismissal, focus return, repeated open/close, actual wheel scroll after dismissal, background isolation, reduced-motion/forced-colors, disabled destinations, filter persistence, and no horizontal document overflow.
- `git diff --check` and shared primitive comparison against `origin/main` — PASS. Existing local audit edits and screenshot deletions are retained outside task commits.

## Visual evidence and Owner review

Fresh closed-screen PNGs: **D1440 / L1024 / T768 / M390 / M320**. Fresh open-menu viewport PNGs: **T768 / M390 / M320**. Menu shots use the visible viewport; full-page background content outside a fixed overlay is not presented as an uncovered viewport.

Local final captures: `output/fe08-drawer-integration/final-screen-results/manager-orders-viewport-sc-9c8e9-or-independent-Owner-review-chromium-1440/`. Cross-engine results: `output/fe08-drawer-integration/browser-results.json`; combined Chromium results: `output/playwright/glass-select-theme/results.json`. Heavy artifacts remain ignored. The FE08 workflow uploads `fe08-manager-orders-screen-captures` with all eight PNGs per project for independent Owner review.

The author inspected representative desktop/tablet/mobile captures for clipping and composition. This is not independent visual acceptance. Owner should inspect the five closed states and three open menus, then review the running `/?view=manager-orders` screen for menu placement, role/content, material/motion and desired labels.

## Limits and next gate

**PR #9 stays Draft and is not merged.** New/All queue semantics, search/company/sort, Orders detail/create and real cross-section routing remain separate work. No API, backend, 1C, tenant or server ACL changes; only synthetic data. Physical devices, a full screen-reader audit and an independent human visual review were not run. Screen acceptance remains Owner's decision, separate from component merge and successful CI.
