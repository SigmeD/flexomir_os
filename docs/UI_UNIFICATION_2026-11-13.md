# Issue #21 · U01–U04: контрольные исправления

Назначение: контракт, причины и доказательства двух контрольных исправлений. Ответственный: Codex/frontend; визуальная приёмка: Owner. Проверено 13.11.2026. Статус: **IMPLEMENTED / OWNER VISUAL OPEN / NOT MERGED**. U05–U09 не начаты; QA и документация этого контрольного инкремента выполняются сейчас.

## Источники и база

- [Issue #21](https://github.com/SigmeD/flexomir_os/issues/21), [Frontend / Читать сначала](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit?tab=t.aiwyg425dkrn), [CMP](https://docs.google.com/document/d/15MSDck4Ktrjn34xiWvFhkF77VpbM1DJZUvdKQ-Iu84Q/edit?tab=t.0), актуальные первые вкладки клиентского статуса и инструкции агенту, SRS прочитаны.
- `origin/main` после fetch: `3b9a0aa424d98df709c724125b6aba83bef5ad38`. Чистое дерево, один worktree, открытых PR перед стартом нет; четыре существующих stash сохранены. Ветка `refactor/ux-ui-unification-20261113` создана в основной папке; проверенный app/tests commit `9f95198` (последующие docs-only коммиты не меняют приложение). Ни историческая очередь, ни PR #40 не возобновляются.
- Figma read-only: Client Row [634:316](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-316), master1189:984; контекст2272:2199 содержит Compact Section Header822:227 с16/22/600. React Card scale и [действующий typography contract](TYPOGRAPHY_AUDIT_2026-11-09.md) проверены.
- **Различие источников:** Client Row master634:316 по-прежнему14/20/400. Более новое прямое поручение Owner / issue #21 разрешает контрольный title16/22/600. Это основание изменения React, не утверждение обновления или приёмки Figma. Canvas не менялся.
- Screenshot/video из пользовательского сообщения и `FLEXOMIR_UX_UI_UNIFICATION_AUDIT_2026-11-13.md` не появились как доступные файлы. Их содержимое не выдумано. Текст issue доступен; собственные before получены на проверенной базе. Ширина/пиксели прежнего видео и его SHA не установлены.

## Причины и карта влияния

| Источник → потребители | Решение и радиус регрессии |
| --- | --- |
| CompanyRow span → inherited cabinet row Body14/20/400 | FIX: явная title роль Card16/22/600. Только разрешённое изменение вида; metadata12/18/400,80px, chevron, company IDs/search/onOpen/linked orders сохранены |
| styles.css Card/Body/Secondary → CompanyRow, OrderCard/CompanyOrders, LayoutRow/library/picker, SupportTicketRow Client/Manager | MERGE только определения type-ролей: row-title, row-meta и Body aliases. У соответствующих consumers прежние computed значения, кроме Company title. Один alias цвета title использует существующий semantic primary; metadata/error/disabled/menu остаются отдельными |
| Orders main52px vs artwork main68px, compact26px vs40px, gutters20px vs24/16px | FIX общего list-контракта в orders-page.css: top/inline/bottom tokens. Orders data-view=list, непосредственный LayoutBrowser library/list и Support list выбираются синхронно CSS :has; дополнительных state/effect нет |
| AppShell/CabinetPage/PageHeader и filters section | KEEP общую композицию. Toolbar — существующий filters slot; он сдвигает список Orders, а не header. Первая карточка разных разделов не обязана иметь общую y. Нет пустых spacers, timers, overflow:hidden или локального !important |
| Library detail/upload, nested picker/select/replace; Profile/Composer/Detail | KEEP отдельные bounds. Artwork overrides ограничены non-list состояниями; picker margins/подзаголовки не менялись |
| React Activity, usePreviewNavigation, OrderDemoWorkspace, guards/history/scroll | KEEP: источники состояния и handlers без изменений; сохранность проверяется существующими и новыми сценариями. Профилирование не доказало бы проблему из одного видео; memo/Suspense не добавлялись |
| FosButtonRoot/FosActionSurface/GlassMaterial/GlassLens/Rows/popup/nav | KEEP. Frozen sources5/5 и optics проверены; материал, spring, hoverv0.3, menu14/18/500 и GL03 не менялись |
| Объединение структуры строк, material API, motion presets, legacy cleanup | DEFER U05–U09 до Owner reference acceptance. Доменные адаптеры не удалены, новые универсальные строки не создавались |

Company title: `--fos-type-row-title` → existing Card size/line/weight/family; meta → Secondary; `--fos-color-row-title` на production shell → existing semantic primary. Лабораторная Onest-тема и body portals не получают новую row-роль. Изменение menu alias и порталов отдельно проверяет существующий typography suite.

## RED → GREEN и геометрия

Windows / Node24.11.1 / Playwright1.64.1; установленный lockfile и зависимости не менялись. Chromium/Firefox/WebKit; CSS viewport1440/1024/768/390/320 ×900, DPR1, visualViewport.scale1, fonts.ready, Manrope check=true. До/после — одинаковые fixture list-состояния. PNG не масштабировались при измерениях.

| Ширина | До: Orders / Layouts / Support H1(x,y), CSS px | После: все три |
| --- | --- | --- |
| 1440 /1024 | (312,52) / (312,68) / (312,52) | (312,52) |
| 768 | (20,98) / (24,112) / (20,98) | (20,98) |
| 390 /320 | (20,98) / (16,112) / (16,112) | (20,98) |

Проверяются H1/actions/breadcrumb/sidebar/main anchors; отсутствующие compact breadcrumbs/sidebar не сравниваются с видимыми. Новые RAF-проверки проходят каждый viewport/движок: все видимые anchors стабильны в пределах1 CSS px на первом и последующих committed frames, scrollY=0. Выбранный фильтр сохраняется между Activity sections. Длинный company title остаётся ellipsis без overflow; row80px и keyboard Enter/Back/focus сохранены.

Scroll/font гипотезы: текущие измерения не показали font swap/remount как причину постоянного смещения. Все измеренные scrollbar widths=0, включая Chromium probe без --hide-scrollbars. **Classic non-overlay scrollbar остаётся OPEN**; это не доказательство его отсутствия на физических устройствах. History/scroll/focus проверяются соседними suites, но не менялись под этот дефект.

## Проверки и воспроизведение

- `tests/m7-ui-unification-contract.spec.ts` использует существующий m7-профиль; новый config не добавлялся. Он входит в текущий M7 CI через testMatch, без отдельной копии pipeline.
- До production edits:11/11 RED (5 company type,5 list geometry,1 desktop frames). Дополнительный color propagation RED:1 FAIL на пяти consumers. Исходные reports сохранены.
- Финальный targeted: **48/48 PASS**,0FAIL/SKIP, три движка/пять ширин. Runtime override одной title type/color роли доходит до всех целевых строк; meta и disabled actions сохраняются, override снимается. Первый расширенный прогон имел15 FAIL из-за ошибочного тестового aria-selected вместо действующего aria-pressed; после исправления assertion выполнен новый чистый прогон без production-изменений.
- `npm run build`: PASS (tsc+Vite); стандартное предупреждение размера bundle сохранено. `npm run verify:material-optics`: свежий browser run PASS, errors=[], не чтение исторических картинок. Frozen normalized hashes5/5 PASS; `git diff --check` PASS.
- Регрессия9 existing suites: **173 PASS /1 timeout** из174; timeout ожидал Manager Clients в оставшемся Client Drawer в cross-role demo-тесте390. Изолированно без изменения кода/таймаутов/asserts: **3/3 PASS**, затем весь integration suite последовательно **12/12 PASS**. Исходный174-прогон не объявляется зелёным; точная причина единичного role-switch timeout не доказана, OPEN. Reports `regression.json`, `regression-repeat.json`, `m7-integration-clean.json` сохранены отдельно.
- Независимый reviewer: **12 PASS** (9 adjacent scenarios +1 propagation across5consumers +2 реальных Client/Manager error/disabled probes), frozen5/5 и diff-check. Самостоятельно прочитал15 final RAF attachments: максимальный delta0CSSpx. Его первая semantic harness попытка2FAIL искала Send в пустом composer; подготовка текста в тесте дала2PASS без production fix, обе попытки сохранены. Авторский48-test прогон не выдаётся за его независимый запуск.
- Восемь исторических проверок воспроизведены **до и после**: More-hover2/2 PASS, GlassSelect snapshots6/6 FAIL. До/после одинаковый mismatch257px на1440 /261px на390 в typography лабораторной страницы; assertions/thresholds/snapshots не менялись. Это существующее отличие runtime от snapshot baseline, не новый дефект двух исправлений; точная причина исторического drift и обновление baseline — OPEN. Один просмотр diff не доказывает причину браузера/шрифта.

```powershell
npx playwright test tests/m7-ui-unification-contract.spec.ts --config=playwright.m7.config.ts --workers=2
npx playwright test tests/m7-companies.spec.ts tests/m7-layouts.spec.ts tests/m7-support.spec.ts tests/m7-integration.spec.ts tests/typography-contract.spec.ts tests/fe11-frozen-contract.spec.ts tests/fos06-item-actions.spec.ts tests/comm-docs-owner.spec.ts tests/fos-select-popup.spec.ts --workers=2
npm run build
npm run verify:material-optics
```

Полный default suite, physical devices, NVDA/VoiceOver, browser200% zoom и общая M8/production API приёмка этим контрольным блоком не закрыты. №10/13, backend/ACL/1С и бизнес-решения не затронуты.

## Сравнение и доказательства

[Страница before/after](../output/ui-unification/review.html), [геометрия](../output/ui-unification/geometry.json), [SHA256 файлов сравнения](../output/ui-unification/checksums.json), [final report](../output/ui-unification/final.json), [независимый review](../output/ui-unification/independent/review.md). Тяжёлые файлы ignored/local, в другом checkout нужны CI artifacts либо новый прогон; их отсутствие не заменять старыми результатами.

Проверка локальных ссылок затронутых LIVE docs:172/172 доступны, включая anchors. Дата ревизии13.11 и следующая27.11 сохраняются; повторная полная уборка не требовалась.

Видимая разница: company content — только title size/weight/line; header/search/sidebar/row bounds/metadata прежние. Layout/Support header и content смещаются к Orders gutters/top; естественные list margins сохранены, floating actions/safe area прежние. Orders/control typography и anchors выглядят как before. Равенство Figma и всего приложения не заявляется: изменение ClientRow требует Owner review, соседние ранее открытые расхождения не исправлялись.

Видео before — исходный desktop RED; after дополнительно проверяет сохранение фильтра «Завершённые». Это разные данные списка в части after-видео; для точного сравнения одного состояния использовать PNG/geometry. Код и изображения не выдаются за Owner acceptance.

## Приёмка и продолжение

Owner должен визуально принять Company title и переключение трёх list-разделов. До этого U05–U09 остаются за gate. Финальный merge — только отдельное поручение. Документы относятся к этому контрольному блоку, а не объявляют завершённой всю issue #21.
