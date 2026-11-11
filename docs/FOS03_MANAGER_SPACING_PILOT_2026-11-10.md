# FOS03 — Manager New Order spacing pilot

11.11.2026 Owner принял положение подписи «Черновик» и отступы на контрольном экране менеджера. Ниже сохранён план исходного пилота. [Аудит FOS03](FOS03_HEADER_AUDIT_2026-11-10.md).

> Исполнение: superpowers:executing-plans, небольшие проверяемые шаги. Источник — Owner «приступай к следующему этапу» после очереди03→08/09→02/07→12/13/06/10/11. Предыдущая поставка — [Draft PR33](https://github.com/SigmeD/flexomir_os/pull/33), не разрешение её merge.

## Цель и база

Один контрольный вариант Manager New Order из существующих React-компонентов: одинаковый ритм Company→Products→General и понятное отделение поля срока от заголовка/комментария, без смены размеров контролов, логики и дат.

База после fetch10.11: `origin/main=7b17db6dab85e3645c55f3e91fcef81b7dfe26b7`; ветка `feat/fos03-manager-spacing-pilot`, основная папка. PR33 OPEN/Draft, head25eb159,4CI SUCCESS, working tree до новой задачи clean,4stash сохранены. Пункт03 не зависит от исходных изменений A: diff OrderComposer/order-compose.css/order-date-fields.css от main к PR33 пустой. Новая ветка создана от main; PR33/main не меняются. Пересечения LIVE docs обеих веток должны быть объединены при последующем разрешённом merge, без потери записей A.

Drive CURRENT modified `2026-11-10T14:09:37.549Z` перечитан: wave B03/08/09, pilot→Owner gate; новые API/DS решения не утверждены. План13 пунктов доступен в PR33; не копировать его как второй CURRENT. Ревизия документов10.11, следующая24.11, уборка по14 дням сейчас не требуется.

## Figma и карта компонентов до JSX

Файл `7rvIYc6yj3OA7gxmf1xJbv`, read-only session `bb9a0704-e302-499e-b2bc-b52f01338d24`.

| Source | React | Решение / scope |
| --- | --- | --- |
| Manager0 D2569:24648/T2569:24851/M2569:25041;1-item D2569:24539/T2569:24757/M2569:24945 | OrderComposer | EXTEND opt-in spacing variant, один component для0/1/N. Legacy consumers не мигрировать до Owner |
| Select1148:292, Date1169:383, Note681:164 | FOSSelect, FOSDateField, FOSTextarea, OrderDateFields | REUSE44px, requested date desktop506px, existing width/readonly/validation; без новой согласованной даты Manager |
| PageHeader2302:2138, SectionAdd1986:774, ItemSummary2025:6608/6613/6618 | PageHeader, SectionAddItem, OrderItemRow | REUSE actions/hit areas/fonts/material/motion; форма только собирает блоки |
| DS V2 Variable633:148→633:80=32;633:122→633:79=24 | component-scoped primitive→semantic→composition CSS variables | section gap32; general heading→fields и dates→comment24. Не публиковать новый глобальный scale |

Metadata, screenshots и high-fidelity context D/T/M перечитаны, instances прослежены к masters. Figma canvas не изменяется.

Наблюдения Figma: Company bottom221→Products title253 на Desktop (32px); compact Company bottom272→title298 (26px), Add hitbox начинается296. Это вручную расставленные координаты, не связанный responsive gap-token. Pilot использует приоритетный DS section-gap32 между контейнерами и сохраняет существующее вертикальное центрирование h2/44px Add; точное совпадение всех title Y с этими frames не заявляется. Figma empty не показывает существующую React empty-подсказку; она сохраняется. Manager agreed-date и Provide-to-Client в frames остаются OPEN, не реализуются этим spacing-пилотом.

## Root cause и подход

Current `OrderComposer.__body` — block flow: Company без bottom gap; General получает38/36px, а при0items63/68px; h2→date10/12/14px, dates→comment20px. Ритм зависит от наполнения и breakpoint. Shared scope: оба кабинета используют один composer, поэтому правка общей геометрии без gate затронула бы Client.

Варианты: общий rollout сейчас (преждевременен по Owner gate); копия Manager screen/локальный screen CSS (дублирует источник); opt-in вариант существующего shared composer (выбран для одного reference). `?view=manager-orders&composeSpacing=pilot` включает вариант только при `import.meta.env.DEV` и ownerRole=manager. Это служебный адрес просмотра, без новых controls/route/подсказок в продуктовом UI. Обычный Manager и Client с этим параметром сохраняют прежнюю геометрию; production build игнорирует параметр.

Variant задаёт grid row-gap32 на существующем body; component variables обнуляют legacy General offsets и задают24 для heading/notes. Все legacy declarations получают прежние fallback numbers. Без копий form, engines или контролов. Никакой оптики08/09, hover02, calendar07, Save05, API/storage/1С/ACL.

## Проверяемые шаги

- [x] Preflight Git/PR/Drive/Figma, independent source boundary, новая обычная ветка от main.
- [x] Baseline: новые screenshots/measurements normal Manager0/1/N и Client на1440/1024/768/390/320; источник source SHA в evidence.
- [x] RED: DEV pilot обещает32px между группами и24px внутри General; исходный код показывает0/различные margins. Сохранить RED отдельно.
- [x] Minimal implementation: OrderComposer.tsx, order-compose.css; существующие components/контракты reuse. No production rollout.
- [x] GREEN: Chromium/Firefox/WebKit/touch, five widths,0/1/N, long labels, required/disabled/dirty, save/edit/cancel, стабильные IDs, dates unchanged, axe, forced-colors/reduced-motion/short height.
- [x] Production probe: реальный built preview игнорирует параметр; default/Client geometry unchanged.
- [x] Визуальный просмотр before/after/Figma; raw screenshots сохранить без resize; Owner gate остаётся OPEN.
- [x] Build + подходящая shared regression + полный suite; frozen5 fingerprints; independent read-only QA; LIVE docs и Draft PR. Не переносить результаты старого A на новый head.

Команды: `npx playwright test --config=playwright.fos03.config.ts --workers=2`; `npm run build`; `npm run test:e2e -- --workers=2`. Artifacts: `output/playwright/fos03/{red,green,baseline,reference,captures}`; gallery — `output/playwright/fos03/index.html`, measurements/source hashes — `observations.json`. Последний output предыдущего A сохраняется.

## Приёмка и передача

FUNCTIONAL/TECHNICAL/visual observation/Owner acceptance/merge — отдельные статусы. До явного Owner visual approval новый spacing доступен только как DEV reference. После принятия — отдельный шаг распространения на согласованных consumers, подтверждение shared regression и синхронизация Figma/Drive по разрешённой поставке. Другие пункты NEXT_SCOPE не объявляются закрытыми этим пилотом.

Итог на 10.11: focused 48/48, full 544 PASS + 4 штатных skip, build PASS; 30 raw PNG, production PASS, page errors 0. Frozen fingerprints 5/5. Независимый read-only QA: PASS WITH RISKS для DEV reference. Owner visual acceptance, rollout и merge OPEN. Фактический CI head — в Draft PR этой ветки. [Подробности и ранние запуски](FOS03_REPORT_2026-11-10.md).

## Уточнение после визуального просмотра

Owner поручил приблизить «Черновик» к «Новый заказ». [Аудит Header](FOS03_HEADER_AUDIT_2026-11-10.md). Один opt-in контракт PageHeader below-title; desktop subtitle Y128→108 (CURRENT Figma109), Company Y151 сохраняется, compact без перемещения. Новая проверка: RED28≠8 → focused cross-browser48, общие Header/forms/layout regression, build, production probe и 30 raw captures. Результаты исходного пилота выше — отдельный checkpoint, не доказательство нового head. Owner screen acceptance/rollout OPEN.

Итог Header follow-up: RED28≠8 зафиксирован; focused48/48, shared82/82, build/production1440/320 PASS,30 PNG, source/frozen hashes совпали. Независимый review READY с указанными в аудите рисками. Owner visual gate и CI нового head проверяются отдельно.

## Общая роль размера статуса — Owner10.11

Принят статус PageHeader: desktop14 /compact12, единый token --fos-type-order-status-size, props subtitleRole=secondary|status. OrderComposer/OrderDetail обеих ролей REUSE общего контракта; LayoutBrowser/context сохраняют secondary12/18. Line-height18 и геометрия Header сохраняются. Figma styles Default/Compact подтверждены; AUTO line-height и полный screen parity не присвоены. План проверки: RED desktop12≠14 → typography-contract cross-browser (draft/detail + token propagation + secondary isolation), focused48, shared responsive/compose/detail/layout regression, build, production probes и30 raw captures. Это одна ветка/PR34; размер глобальный по принятому решению, spacing placement остаётся opt-in.

Status-size итог:32/32 typography,48/48 pilot,86/86 shared; build и production Client/Manager1440/390 PASS,30 raw PNG, source7/7/frozen5/5. Reviewer подтвердил source/runtime; test selector исправлен и полный набор повторён. Ранние параллельные browser crashes сохранены как неитоговый прогон; их первопричина не заявляется устранённой. Actual-head CI — в PR34. Размер компонента принят Owner; полный экран/spacing/line-height AUTO — отдельные gates.
