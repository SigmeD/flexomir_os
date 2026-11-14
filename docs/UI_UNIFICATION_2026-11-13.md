# Issue #21 · унификация UX/UI и контрольные варианты

Назначение: контракт, причины и доказательства issue #21. Ответственный: Codex/frontend; визуальная приёмка: Owner. Проверено 14.11.2026. **U03/U04 OWNER ACCEPTED** на head fbd88ce, Owner: «принято продолжай», CI 3/3 SUCCESS. **U06 DocumentPreview pilot OWNER ACCEPTED** ответом «да, принято»; перенос остальных material consumers разрешён. Frozen FE11 и отдельный merge gate сохраняются. NOT MERGED.

Новое решение Owner по Screenshot_1/2: единственная подсветка всех строк — Orders из Image#3. Второй flat interaction profile удалён. Это порученное изменение прежнего вида; историческая U05-эквивалентность120PNG ниже относится к предыдущей версии, не доказывает неизменность нового hover. [Причина, контроль и доказательства текущей правки](#единая-подсветка-по-эталону-orders).

[Draft PR #49](https://github.com/SigmeD/flexomir_os/pull/49). Контрольные U01–U04 поставлены app/tests 9f95198, приняты Owner на head fbd88ce (CI 3/3 SUCCESS). U05 и последующая единая подсветка реализованы; принятый U06 pilot распространён на остальные незамороженные material consumers, результаты ниже. Merge/production не выполнялись. CI всегда сверять по конкретному текущему head, не по предыдущему принятому коммиту.

U08: причина прежних шести Select snapshot FAIL найдена и воспроизведена. Эталоны от PR #29 сохранили движущуюся линзу в закрытом popup; принятый PR #37 убрал её. Невидимый backdrop/SVG слой влиял на растеризацию окружающего текста. В `9a0603c` обновлены только восемь устаревших closed/focus PNG; шесть open не менялись. Исходные14 изображений и SHA сохранены. Полный прогон998:990PASS/8SKIP/0FAIL; целевые38/38, motion/material24/24, touch4/4 и независимый QA PASS. `403f06f` сохраняет trace/PNG первого FAIL при retries0; diagnostic self-check проверен отдельно. Первый единичный timeout сохранён в истории, его причина не объявлена исправленной. [Подробная причинная проверка](#u08-причина-прежних-select-snapshot-fail).

## Продолжение CI · 14.11.2026

На head `103a55915ef7747c223c43fb8cb4942ab29644c0` восемь checks завершились SUCCESS, M7 — CANCELLED. GitHub annotation run [43526796318](https://github.com/SigmeD/flexomir_os/actions/runs/43526796318) подтверждает причину: `The job has exceeded the maximum execution time of 25m0s`. До остановки прошли M7 273/273, popup 35/35, typography 32/32, reaudit 128/128, spacing 48/48, neutral actions 36/36 и Plus motion 54 PASS / 2 SKIP. ButtonRoot прерван, next-scope не запускался. Это инфраструктурный лимит всей последовательности, не доказательство падения теста.

Минимальное изменение `eab307a`: только общий M7 job timeout 25 → 35 минут. Команды, workers, индивидуальные таймауты, assertions, runner image и artifact upload сохранены. Приложение, Figma и frozen не меняются. [Результат текущего head](https://github.com/SigmeD/flexomir_os/pull/49/checks) проверяется после завершения всей последовательности; точный итог продолжения, head/run и оставшиеся gates ведутся в существующем [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit), без дублирования полного факта в локальных сводках. Полная M8/D09, устройства/A11y и merge остаются отдельными gates; сроки Owner не назначены.

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
| Объединение структуры строк, material API, motion presets, legacy cleanup | После Owner acceptance U05 реализован; принятый U06 pilot распространён на остальные незамороженные material consumers, U07 очистил заменённые sources. Подробности и исторические этапы ниже. Доменные адаптеры сохранены |

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
- В первом контрольном блоке воспроизведены **до и после**: popup-hover-rollout More2/2 PASS, GlassSelect snapshots6/6 FAIL. Уточнение после полного suite: выбранные тогда2More-теста не являлись теми2историческими FAIL — фактический старый assert находится в fe-debug-overlays.spec.ts. Это исправление классификации, а не доказательство, что оба старых FAIL были устранены runtime-кодом. Snapshot mismatch257px на1440 /261px на390 одинаков до/после; эталоны не менялись, точная причина исторического drift — OPEN.

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

Контрольные SHA256 основных материалов (остальные — в JSON выше):

| Файл review-assets | SHA256 |
| --- | --- |
| after-companies-1440.png | `8f3643b1a8d38dfe696e89b674c7c7b564711d2a6acaa795819c976cc647d70e` |
| after-client-layouts-768.png | `727ebbcd9c284cfd4596fccb01e7bf4fa293671c0c5aa53dd8d82ca8f060c024` |
| before-navigation.webm | `110653f01898d8900609f059bb2b4b72ceefde59ea6d7e957c37f752760b7ec6` |
| after-navigation.webm | `63c18a9689f9bd4493c9b1ab3831fcd3613670762dbd1a002ff788cb56912cf8` |

Видимая разница: company content — только title size/weight/line; header/search/sidebar/row bounds/metadata прежние. Layout/Support header и content смещаются к Orders gutters/top; естественные list margins сохранены, floating actions/safe area прежние. Orders/control typography и anchors выглядят как before. Равенство Figma и всего приложения не заявляется: изменение ClientRow требует Owner review, соседние ранее открытые расхождения не исправлялись.

Видео before — исходный desktop RED; after дополнительно проверяет сохранение фильтра «Завершённые». Это разные данные списка в части after-видео; для точного сравнения одного состояния использовать PNG/geometry. Код и изображения не выдаются за Owner acceptance.

## Приёмка и продолжение

Owner принял U03/U04. U05 реализован; U06 ограничен одним material consumer. Перенос других material consumers, полный U07/U08/U09 и merge зависят от отдельных gates. Ниже факты продолжения, а не объявление полной M8/production готовности.

## Единая подсветка по эталону Orders

Owner предоставил Screenshot_1.png (Image#1/#3 — эталон заказов) и Screenshot_2.png (отменённая серая подсветка макетов) и поручил унификацию для обеих ролей. Файлы теперь доступны, визуально просмотрены. Величины пикселей этих изображений не объявляются CSS px, их zoom/DPR не установлен. Оригиналы сохранены в корне без изменения; контрольные копии — ignored output/ui-unification/row-highlight/references.

Причина: React-компонент уже был общим FosSummaryRow, но `data-row-surface=card` выбирал голубую рамку/полупрозрачный фон/тень Orders, а `flat` — серый фон без рамки и тени у Company/Layout/Support. U05 сознательно сохранил эти прежние состояния; новое прямое решение Owner заменяет это ограничение. Figma LayoutRow1313:2182 содержит прежний flat hover; canvas этой frontend-правкой не изменяется.

Исправление находится только в общем `fos-summary-row.css`: один enabled-button профиль hover/active/focus-visible для всех6route consumers и связанных picker/company-order consumers. Orders является источником значений: hover rgba(248,251,255,.9), border rgba(188,209,236,.78), shadow0 6px18px rgba(53,70,91,.09); pressed#ebf0f7; keyboard focus — прежняя inset-рамка Orders. В forced-colors остаётся системная видимая рамка. Старые flat interaction rules и card-only hover/pressed tokens удалены, а не сохранены вторым alias или override. `surface`/`density` остаются только для обоснованной геометрии/типографики/переноса metadata; размеры80/92/104, padding, IDs, onOpen, права и DOM-семантика не менялись. Disabled/static исключены из подсветки.

Карта потребителей: Client Orders → OrderCard; Manager Orders и linked Company orders → тот же OrderCard; Manager Clients → CompanyRow; Client Layout library/picker → LayoutRow; Support обеих ролей → SupportTicketRow. Все используют один FosSummaryRow. Frozen FE11 и material pilot не затронуты.

App/tests commit: `40a15f1`. RED: 7/7 FAIL до исправления — five-width state equality, общий hover-token и отсутствие второго source; дополнительный keyboard RED 1/1. Точные computed значения и реальные before PNG сохранены. GREEN: **21/21 PASS**, Chromium/Firefox/WebKit × 1440/1024/768/390/320 плюс propagation/disabled/static/source checks. Bounds до/после hover/press/focus совпадают. Независимый QA: **3/3 PASS** — шесть routes, оригинальные Orders values, refs/events, keyboard/touch 320, reduced/forced-colors, no overflow/hit shift; normalized frozen 5/5 PASS. Build PASS. Регрессия Company/Layout/Support/SummaryRow и frozen contract: **78/78 PASS**, результат в row-highlight/regression.json. Зелёный полный suite этим не заявляется; прежние OPEN ниже сохраняются.

[Визуальное сравнение](../output/ui-unification/row-highlight/review.html), [RED](../output/ui-unification/row-highlight/red.json), [GREEN](../output/ui-unification/row-highlight/green.json), [независимый отчёт](../output/ui-unification/row-highlight/independent/review.md). Новые контекстные PNG имеют24 CSS px поля вокруг строки для видимости тени. Исходные SHA256: Screenshot_1 `d84d43e586590794858c550735cc921c13b6b5d91b08788a2fc3b23749a72043`; Screenshot_2 `1490f844213295dc2b6e4b192b15f45ca2eb01dd4d04ff7f070ae633eac984a5`.

## U08: причина прежних Select snapshot FAIL

Owner запросил объяснение шести прежних FAIL, подтвердил поиск причины и спросил «так а как пофиксить?». Работа продолжена в том же PR #49 от `3b89971`; runtime UI и frozen FE11 не менялись. Предыдущий U06 full 980/8/6 ниже — исторический результат до этой коррекции тестов, а не текущая классификация причины.

Все шесть падений — три оформления (light/dark/matte97) × desktop/mobile в `glass-select-visual.spec.ts`. Первое сравнение каждого теста — closed full-page screenshot. Поэтому последующее light-focus сравнение не выполнялось: фактически устарели восемь из 14 PNG, а не только шесть closed-файлов. Все шесть open кадров совпали точно с текущим приложением до какой-либо замены эталонов.

Причина подтверждена в одинаковом Chromium/Windows/viewport/DPR, без git switch или нового worktree. Read-only Vite5192 отдавал source text исторического коммита из Git, используя те же установленные зависимости; Vite5173 — текущую рабочую копию. `03238af` (PR #29, 10.11) воспроизводит старый light desktop PNG с raw pixel delta 0. До PR #37 (`4ae4841`) в закрытом popup остаются две поверхности: static shell и moving lens. Принятый PR #37, merge `3317d5029ac7baa3bfa8eccd8b03a72b15cd62b1` от 11.11, назначает закрытому FosPopup targetId=undefined: остаётся static shell, moving lens отсутствует. Это согласованное поведение hover v0.3, не дефект U06.

Контрфактическая проверка: скрыть только moving lens в историческом закрытом popup → получается нынешняя растеризация окружающего текста; вставить копию прежней линзы в текущий закрытый popup в изолированном браузерном DOM → возвращается прежний эталон. Проверка повторена на всех шести theme/viewport сочетаниях. Восстановленные raw delta 0 либо небольшой capture noise 18/20 pixels; до вмешательства current raw delta около 11–12 тысяч. Это точное RGBA-сравнение, отличающееся от Playwright perceptual 257/261 pixels при threshold .15. CSS, реальные CDP platform fonts Segoe UI/SegoeUI-Bold, geometry и содержимое видимого текста совпадают; сам закрытый Select в проверенном desktop-кадре имеет raw delta 0. Невидимая оптика меняла compositing/rasterization страницы, на которой были сняты эталоны. Playwright/Vite версии в lockfile совпадают в старом и текущем коммите.

Исправление — актуализировать эталоны под уже принятый lifecycle, сохранив отсутствие скрытой линзы. Обновлены только шесть closed и два focus PNG явным списком. Полные исходные 14 PNG и SHA256 сохранены в `output/ui-unification/select-cause/original-baselines/` и original-baselines.json; шесть open файлов byte-identical прежним. Не использовался глобальный update-snapshots. FullPage, maxDiffPixels=40 и threshold=.15 не менялись; масок, skip, новых CSS/шрифтов/эффектов нет.

В тот же visual suite добавлены два контракта: закрытый popup не содержит moving optics до/после выбора, reopening и Escape; aria-expanded/hidden/inert, selected value и trigger focus сохранены во всех трёх темах. Отрицательный контроль сначала проверяет корректный focus PNG, затем восстанавливает скрытую линзу только в тестовом DOM и требует отклонения того же snapshot. RED с прежними эталонами: 4 PASS / 8 FAIL; после точной замены восьми PNG: **12/12 PASS**, 0 FAIL/SKIP. Test/baseline commit `9a0603c`. Производственный JSX/CSS/handlers и frozen файлы не изменены.

Независимый reviewer воспроизвёл обе стороны причинного эксперимента: old-minus-lens=current с raw delta 0, current+old-lens=original с raw delta 0, сам trigger имеет delta 0. Отдельно выполнил собственный отрицательный snapshot-контроль и два tracked semantic/obsolete-lens теста: три PASS. Сам проверил все 14 архивных SHA с Git blob базы `3b89971`, ровно восемь заменённых PNG и byte-identical шесть open. Frozen 5/5, src и manifest без diff. [Независимый QA](../output/ui-unification/select-cause/independent/review.md).

Первый новый полный suite: **989 PASS / 8 SKIP / 1 FAIL**, 998 тестов, 0 flaky по классификации runner. Все Select-проверки прошли, прежних шести FAIL нет. Единственный FAIL — timeout первого открытия DEMO-007 в desktop order-compose B; error-context не содержит snapshot страницы, а начальный режим trace=on-first-retry при retries=0 не сохранил трассу. Исходный отчёт [full.json](../output/ui-unification/select-cause/full.json) сохраняется. Без изменения source/asserts/timeouts отдельный прогон того же теста с trace=on и repeat-each5: **5/5 PASS**, [отчёт](../output/ui-unification/select-cause/order-repro.json). Это не доказательство первопричины или исправления таймаута.

Контрольный полный прогон на свежем Vite5173 с trace=retain-on-failure (DOM/network/sources) и failure screenshot завершён: **990 PASS / 8 SKIP / 0 FAIL**, 998 тестов, 0 flaky, 16.8 минут. Все Select tests прошли; timeout дублирования заказа не повторился. Runtime и условия assertions прежние, retries не добавлены. На старте Vite повторно оптимизировал зависимости после временного исторического server config; влияние этого состояния на первый timeout не доказано. Исторический диагностический сервер5192 остановлен; основной Vite session16101. Это новый целиком выполненный прогон, а не сложение targeted и прежних PASS. [Полный проверочный отчёт](../output/ui-unification/select-cause/full-traced.json).

В базовом `playwright.config.ts` закреплены ровно те diagnostic options, с которыми прошёл этот полный прогон: retain-on-failure, DOM snapshots/network/sources, filmstrip screenshots=false, screenshot=only-on-failure. При retries=0 первый FAIL теперь сохраняет данные. Отдельная artifact-only проба намеренно бросает INTENTIONAL_DIAGNOSTIC_PROBE после успешного открытия приложения: retry0/attempt0, trace.zip и PNG фактически сохранены; в archive три trace stream и два network stream. Этот ожидаемый 1 FAIL не входит в продуктовый suite/testDir и не выдан за дефект приложения. [Проверка диагностики](../output/ui-unification/select-cause/diagnostic-proof.json). Независимый reviewer проверил сам ZIP/DOM frames/embedded sources и сравнил effective use обоих проектов нового default config с завершённым full-traced: полное равенство, timeout30000/retries0/ignoreSnapshots=false и test root прежние. Успешные traces не сохраняются; recording имеет runtime overhead, который не скрывается ослаблением assertions.

После закрепления base config выполнены **38/38 PASS** (Select visual/API/theme/frozen), **24/24 PASS** (material/motion в Chromium/Firefox/WebKit), **4/4 PASS** (все четыре touch-сценария из desktop SKIP). Новых skip/timeout/retry overrides нет. UI/frozen/manifest/lockfile/package без diff относительно `3b89971`; source правки касаются только tests/PNG/diagnostics. [Select regression](../output/ui-unification/select-cause/final-regression.json), [motion regression](../output/ui-unification/select-cause/motion-traced.json), [touch](../output/ui-unification/select-cause/touch-traced.json).

SHA256 full-traced.json: `53f8889a13e65a843888cac876122d019b1d9b92ff61355b499bdef5b44a432e`; final-regression.json: `23f86482e8bc4c49d28cce9686178c35332d418095f155c6de2ccc0fca277c13`; motion-traced.json: `285ad37129a077cebae72224e2e68068cdeb2637415f1299373eff4ec8786b8e`; touch-traced.json: `0f0e80223105c4331f1ff2e03611ac5ac999592cb7a7e2d34eed6a52164a6e87`. Прежний full989/8/1 сохранён; причина того одиночного пустого load timeout остаётся недоказанной, его source fix не заявляется. Полная M8/D09, физические устройства и backend/API отдельно; merge не выполнялся.

Доказательства: [commit probe](../output/ui-unification/select-cause/commit-probe.json), [все шесть причинных проб](../output/ui-unification/select-cause/matrix.json), [обратимые оптические пробы](../output/ui-unification/select-cause/compositing-confirmed.json), [все 14 состояний](../output/ui-unification/select-cause/states/comparison.json), [оригинальные SHA](../output/ui-unification/select-cause/original-baselines.json), [точный список замен](../output/ui-unification/select-cause/baseline-changes.json), [RED](../output/ui-unification/select-cause/red.json), [GREEN](../output/ui-unification/select-cause/green.json).

14.11 текущие вкладки Drive Frontend/CMP и клиентский статус синхронизированы с U08: причина, точные8PNG, полный990/8/0, независимый QA, диагностика `403f06f` и ограничения. Readback подтвердил каждую замену; в клиентском документе убран устаревший повторный gate уже принятого U06 pilot. Issue #21 и описание PR #49 обновлены. Новый CI сверять по фактическому head PR;9/9 на `3b89971` — исторический результат, не CI новой коррекции. Merge не выполнялся.

## U06: перенос семейств после приёмки пилота

Ниже сохранены результаты U06 до последующей коррекции Select references. Указанный здесь full980/8/6 — исторический; актуальный U08 full990/8/0 и доказанная причина расхождений приведены выше.

Owner принял DocumentPreview preset ответом «да, принято» после описания U06 и ссылки на сравнение пилота. Это разрешение на последовательный перенос; повторная приёмка того же пилота не требуется. База продолжения `3676502`, app/tests `b689487`, свежий origin/main `3b9a0aa` не изменился; работа в том же PR #49. Drive CURRENT/CMP, инструкция агенту и клиентский статус прочитаны. CURRENT Figma HeaderAction1953:4168 прочитан вместе с component descriptions и screenshot; новые assets/JSX из него не копировались: сценарий сохраняет существующие masters/components и более поздние решения Owner.

| Назначение preset | React consumer / состояния | Сохранённый контракт |
| --- | --- | --- |
| navigation / navigation-reference | SidebarNav, Client/Manager, neutral/reference | radius 14, прежний top/target/onTravelFrame; один существующий spring и та же key/anchor policy |
| segment / segment-reference | GlassPillTabs, оба фильтра Manager и Client | radius 19; прежний горизонтальный adapter владеет transform, preset статичен |
| action / action-round / action-quiet / action-quiet-round / header-action | FosActionMaterial → Header/Plus/Secondary | прежняя геометрия 22/17/24, neutral/reference styling, native input и общий press owner сохраняются |
| popup | FosPopupSurface → Drawer/Account/More/Select | radius 20, blur 20; прежний внешний ref/inert/content, одна оболочка плюс прежняя frozen moving lens |
| account-trigger | AccountMenu desktop footer | radius 15, strength 0, blur 9; ref и Radix lifecycle выше material слоя |
| date-cell | FosDatePickerDay | radius 14, selected/hover; DayPicker сохраняет native day props и события |
| demo-panel | OrderDemoWorkspace | прежние region/role/reset handlers, radius 18, menu shadow и opacity .76 |
| document-preview | DocumentPreviewDialog, принятый пилот | без изменений относительно принятого варианта |

Реализация: существующий FosMaterialSurface расширен внутренними presets; все прежние default values явно закреплены. Публичного style/optical API нет. Только navigation-варианты принимают `layoutTop`, `travelY`, `onTravelFrame`; остальные отбрасывают эти поля и style при runtime-вызове из JS. Нет новой оболочки DOM, оптической формулы, RAF, spring, материалов или бизнес-переходов. Все заменённые inline optical props удалены у семи адаптеров. Низкоуровневые прямые вызовы остаются только в frozen FosPopupRows и преднамеренном GlassMaterialLab; менять freeze ради единообразия API запрещено. Обоснованные CSS-контуры и геометрия потребителей сохранены, не объявляются дублями оптики.

RED перед production: 3 FAIL / 1 PASS — отсутствовали semantic consumer/profile/navigation contract; уже защищённый DocumentPreview override тест проходил. Первые harness-попытки сохранены отдельно: неверный путь stylesheet и ожидание top:auto исправлены на существующие styles.css/top:0; два Manager filters проверяются оба; Vite cache-busting query учитывается перехватом. Это изменения подготовки теста, не ослабление контракта.

Независимый QA нашёл P2: truthiness-проверка `presets[variant]` принимала унаследованные `toString`/`constructor`/`__proto__`, пропуская JS optical overrides. Авторский renderer regression с ErrorBoundary подтвердил RED 1 FAIL; `Object.hasOwn(presets, variant)` перед lookup закрывает обход без изменения optics/frozen. Независимый повтор теми же assertions: **5/5 PASS**, плюс отдельная проверка navigation observer 1/1 PASS; неподтверждённых source findings нет. Все 12 static variants сохраняют защиту, native content и DOM identity.

Финальный targeted: **24/24 PASS**, 0 FAIL/SKIP, Chromium/Firefox/WebKit — presets, shared quiet-profile propagation Header/Plus/Secondary, действующий action contact profile, download/modal/Escape/focus и guard. **135/135 before/after PNG-пар точные**, computed styles/rect/layers/transform также равны: девять сценариев × пять размеров 1440/1024/768/390/320 × три движка. Независимый reviewer отдельно пересчитал decoded PNG/computed. Снимки сняты с reduced-motion; реальное motion-поведение проверялось отдельными suites и runtime QA. Header/sidebar/main/popup regions в зафиксированных состояниях не отличаются. Build PASS после guard fix, optics errors=[], frozen 5/5 и manifest без diff. Публичный API не расширяет frozen контракт.

Предварительный green-final: 17 PASS / 4 FAIL — три ошибки test interception и единичный WebKit contact-profile timing FAIL. После исправления перехвата без production-motion edits green-complete 21/21, после guard final-targeted 24/24. Точная причина единственного timing FAIL остаётся OPEN; повтор не отменяет исходный факт.

Новый полный default suite на `b689487`: **980 PASS / 8 SKIP / 6 FAIL**, 994 теста, 15.5 минут, 0 flaky. Все шесть FAIL — прежние light/dark/matte GlassSelect visual snapshots: 257 отличающихся pixels desktop и 261 mobile, те же имена/проекты и величины, что в историческом U05 full. Baseline и thresholds не менялись. Новых FAIL в мигрировавших семействах нет; прежний popup-dismissal singleton в полном прогоне не повторился, но его историческая точная причина не объявлена найденной. Восемь SKIP — четыре touch-сценария в двух desktop-проектах. Отдельный touch context 390: **4/4 PASS**, 0 FAIL/SKIP (Drawer, Account, More/Select/navigation, Profile trigger). Проверка физического устройства этим не заменяется. [Классификация full FAIL/SKIP](../output/ui-unification/u06-family/full-disposition.json), [touch report](../output/ui-unification/u06-family/touch.json). SHA256 full.json: `69d469817e02b49668f837cb68baf05107a27020143716d4f68698cd48688543`. Полный suite остаётся красным из-за шести исторических snapshot mismatch; полная M8-приёмка этим не закрывается.

[Сравнение семейств](../output/ui-unification/review-u06-family.html), [135 результатов](../output/ui-unification/u06-family/visual/comparison.json), [RED](../output/ui-unification/u06-family/red-final.json), [guard RED](../output/ui-unification/u06-family/guard-red.json), [финальный targeted](../output/ui-unification/u06-family/final-targeted.json), [независимый QA](../output/ui-unification/u06-family/independent/review.md), [полный suite](../output/ui-unification/u06-family/full.json). SHA256 comparison.json: `3209ca6a97dd8fa912ceca2b51f17a96bde555008090852097ee731de2284f20`; final-targeted.json: `113d1f75fc32c8c1169f7e415647d29f9fc79801505c725087f48c98bc291e15`; independent/final-results.json: `022cb47d24de6fe787017ad9d9b28b0f2d459283898d3ce532291ddb71ec8a01`. Артефакты локальные/ignored; при переносе checkout сохранить пакет доказательств либо выполнить новые проверки. Полная M8/D09, физические устройства, screen readers/classic scrollbars и backend/API/ACL/1С остаются отдельными OPEN. Merge не поручен и не выполнялся.

## U05 и контрольный U06 после приёмки

Этот раздел сохраняет историю исходного U05 и одиночного U06 pilot до последующей приёмки Owner. Его прежние gate/проверки не заменяют актуальный U06 rollout и результаты раздела выше.

Проверенный app/tests commit продолжения: `c9d70e6`. Финальный targeted на перезапущенном стенде: **78/78 PASS**, Chromium/Firefox/WebKit,0FAIL/SKIP. Build PASS; optics errors=[]; frozen5/5 unchanged. Independent6PASS. Все4touch-сценария из8desktopSKIP отдельно прошли в соответствующихtouch-профилях: Drawer/Profile2PASS,Account1PASS,Popup1PASS. Touch-эмуляция не заменяет физические устройства.

Baseline продолжения — принятый headfbd88ce, CI3/3SUCCESS. План/карта перед JSX в DELIVERY_PLAN и COMPONENT_REGISTRY. U05: созданы только presentation FosSummaryRow/FosSummaryRowCopy с native interactive/static root, leading/trailing/content/title/meta slots, compact/regular density и прежними flat/card state profiles. Adapters CompanyRow → OrderCard → LayoutRow → SupportTicketRow перенесены по очереди; проверки после каждого5/5,7/7,2/2,2/2PASS. Order использует существующий ArtworkThumbnail; classname — compatibility hook, размеры60/52 не расширялись. Данные/права/handlers/IDs и доступные действия остались в адаптерах.

U05 RED: пять shared-owner/spacing проверок; первый static harness ошибочно искал readonly order в Client list, исправлен на fixture существующего OrderCard без onOpen и отдельно подтверждён RED по отсутствующему owner marker. До/после120PNG (6routes×5widths×4states default/hover/focus/pressed): **0 отличающихся pixels, computed styles и rects совпадают**. Исходники и JSON в output/ui-unification/u05; baseline не перезаписан.

U07 в рамках уже мигрировавших rows: удалены старые root/copy/title/meta/state CSS в cabinet/order/layout/support/company styles. Wrapper/list/detail/upload CSS и совместимые class/test hooks сохранены. Ограниченный drift-check запрещает возврат именно этих удалённых row-selector копий, не всеpx/hex по проекту. Пока полный U07 material cleanup не объявлен завершённым.

Motion owners: flat/card rows → единыйfos-summary-row.css (прежние instant hover/active/focus, без spring); FOSAction/HeaderAction/Plus → useDirectionalPress → useActionSurface + actionPressPower/ACTION_PRESS_CONTACT_MS; reference action fallback → тот же input envelope в useDirectionalPress; More/Account/Select/Drawer → FosPopup adapter + frozen FosPopupRows; Sidebar/GL03 → существующие motion adapters + frozen material/Track. Общий native FosButtonRoot не назначен владельцем motion. Вторая физика/линза не создавались. Настройки approved action profile уже имеют один источник, их не требуется переписывать ради количества props.

U06 material pilot: один DocumentPreviewDialog теперь выбирает FosMaterialSurface variant=document-preview; radius22/blur5/strength.022/dome0/toneNeutral/shadowNone/centerOpacity0/rim1.25 и прежние defaults освещения/центра/motion заданы внутренним preset. Родитель передаёт purpose/content/HTML attributes; optical knobs не являются публичными props. Frozen FosGlassMaterial и checksum не менялись. RED отсутствующегоpreset marker → GREEN modal/download/Esc;9before/after PNG (Chromium/Firefox/WebKit ×1440/768/320): **pixels0, computed/rect/layers/transform equal**. Дальнейший перенос материала в другие consumers — **U06 OWNER GATE OPEN**, согласно отдельному gate issue#21. Это не принятие всей оптики/интеграции.

Независимый QA обнаружил P2: generic div style позволял переопределить rim1.25→42px и centerOpacity0→.8. Исправлен только внешний adapter: style исключён типом и отбрасывается runtime; engine не менялся. Adversarial RED1FAIL → GREEN2PASS, плюс реальныеPDF/unsupported/corrupt/modal/download/Esc и native ref/keyboard/touch/static/disabled: **6 независимых PASS**. Reviewer отдельно пересчитал120+9decodedPNG pairs — полное равенство. [Новый независимый отчёт](../output/ui-unification/u05-independent/review.md).

Action profile propagation: изменение существующего ACTION_PRESS_CONTACT_MS180→1800 только через test network interception одного DEV-module до загрузки. Header/Plus/Secondary показывают разную фактическую material transform и затем settle;6/6PASS в3движках. Ни публичного production tuning API, ни изменения параметров frozen engine нет. Clock install/runFor основаны на актуальной официальной Playwright1.64.1 документации, полученной через Context7.

Полный default suite: **949PASS /8SKIP /9FAIL**, запуск output/ui-unification/u08-full.json. Это исходный результат, не чистый PASS.8SKIP —4touch-сценария в2desktop проектах; их реальные touch-профили проверяются отдельно.6FAIL — те же Select snapshot257/261px.2FAIL — старое ожидание0travel послеhover в fe-debug-overlays; оно противоречит принятому Ownerhoverv0.3. Test-only обновление теперь требует ровно1travel приhover,0приleave, прежние semantic/Esc/focuschecks; текущие More4/4PASS, popup runtime/frozen безdiff. Одиночный popup-dismissal inert FAIL: без изменения source/asserts/timeouts изолированный повтор5/5PASS; точная причина и чистый полный повтор — OPEN. Последующие ограничение styleAPI и новые motion/More tests проверены focused-наборами; исходный полный suite не выдаётся за прогон каждого последующего docs/test-only head.

[Сравнение U05/U06](../output/ui-unification/review-u05-u06.html), [U05 comparison](../output/ui-unification/u05/comparison.json), [U06 comparison](../output/ui-unification/u06/comparison.json), [все SHA256](../output/ui-unification/u05-u06-checksums.json). JSON SHA256: U05 `2397806aa62e4b38be567e0aef9c0755f04271f30a4ffb080be5d82f1263d0f8`; U06 `81d34bcb48a39fbee7fdebbe134a837ac8a2a7108a55739e940faf2d571d2c86`. Все baseline images сохранены.

Frontend «Читать сначала», CMP и клиентский статус синхронизированы с продолжением; issue/PR содержат тот же scope и отдельный U06 gate. Стенд5173 перезапущен по поручению Owner; main/merge не менялись. Новый CI проверять по head этой поставки, прежние3/3 относятся только к принятомуfbd88ce.

Owner принял Company title и переключение трёх list-разделов ответом «принято продолжай»13.11.2026. Продолжение U05–U09 разрешено в той же ветке/PR; отдельный U06 material pilot gate и финальный merge сохраняются. Принятие двух контролей не закрывает всю issue#21/M8 и не разрешает изменение frozen sources.
