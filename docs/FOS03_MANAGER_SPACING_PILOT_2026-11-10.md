# FOS03 — Manager New Order spacing pilot

Действующий результат: принятые отступы и Header подключены в PR #35. Пилотные reference/DEV-only и OPEN ниже относятся к этапу разработки. Общая карта подключения — [rollout](ACCEPTED_UI_ROLLOUT_2026-11-11.md).

11.11.2026 Owner принял положение подписи «Черновик» и отступы на контрольном экране менеджера. Ниже сохранён план исходного пилота. [Аудит FOS03](FOS03_MANAGER_SPACING_PILOT_2026-11-10.md).

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

## Приёмка и передача

FUNCTIONAL/TECHNICAL/visual observation/Owner acceptance/merge — отдельные статусы. До явного Owner visual approval новый spacing доступен только как DEV reference. После принятия — отдельный шаг распространения на согласованных consumers, подтверждение shared regression и синхронизация Figma/Drive по разрешённой поставке. Другие пункты NEXT_SCOPE не объявляются закрытыми этим пилотом.

Итог на 10.11: focused 48/48, full 544 PASS + 4 штатных skip, build PASS; 30 raw PNG, production PASS, page errors 0. Frozen fingerprints 5/5. Независимый read-only QA: PASS WITH RISKS для DEV reference. Owner visual acceptance, rollout и merge OPEN. Фактический CI head — в Draft PR этой ветки. [Подробности и ранние запуски](FOS03_MANAGER_SPACING_PILOT_2026-11-10.md).

## Уточнение после визуального просмотра

Owner поручил приблизить «Черновик» к «Новый заказ». [Аудит Header](FOS03_MANAGER_SPACING_PILOT_2026-11-10.md). Один opt-in контракт PageHeader below-title; desktop subtitle Y128→108 (CURRENT Figma109), Company Y151 сохраняется, compact без перемещения. Новая проверка: RED28≠8 → focused cross-browser48, общие Header/forms/layout regression, build, production probe и 30 raw captures. Результаты исходного пилота выше — отдельный checkpoint, не доказательство нового head. Owner screen acceptance/rollout OPEN.

Итог Header follow-up: RED28≠8 зафиксирован; focused48/48, shared82/82, build/production1440/320 PASS,30 PNG, source/frozen hashes совпали. Независимый review READY с указанными в аудите рисками. Owner visual gate и CI нового head проверяются отдельно.

## Общая роль размера статуса — Owner10.11

Принят статус PageHeader: desktop14 /compact12, единый token --fos-type-order-status-size, props subtitleRole=secondary|status. OrderComposer/OrderDetail обеих ролей REUSE общего контракта; LayoutBrowser/context сохраняют secondary12/18. Line-height18 и геометрия Header сохраняются. Figma styles Default/Compact подтверждены; AUTO line-height и полный screen parity не присвоены. План проверки: RED desktop12≠14 → typography-contract cross-browser (draft/detail + token propagation + secondary isolation), focused48, shared responsive/compose/detail/layout regression, build, production probes и30 raw captures. Это одна ветка/PR34; размер глобальный по принятому решению, spacing placement остаётся opt-in.

Status-size итог:32/32 typography,48/48 pilot,86/86 shared; build и production Client/Manager1440/390 PASS,30 raw PNG, source7/7/frozen5/5. Reviewer подтвердил source/runtime; test selector исправлен и полный набор повторён. Ранние параллельные browser crashes сохранены как неитоговый прогон; их первопричина не заявляется устранённой. Actual-head CI — в PR34. Размер компонента принят Owner; полный экран/spacing/line-height AUTO — отдельные gates.

## FOS03 — аудит «Новый заказ → Черновик → Компания» — основания и проверки

11.11 после Screenshot_1 Owner потребовал подключить принятый вариант обычным экранам и разрешил merge. Header.status стал below-title для Client/Manager Composer/Detail; Manager32/24 больше не DEV-only. [Подключение и новые проверки](ACCEPTED_UI_ROLLOUT_2026-11-11.md). Предыдущие координаты и ограничения ниже относятся к исходному пилоту.

11.11.2026 Owner визуально принял положение «Черновика» и отступы в DEV-варианте нового заказа менеджера на версии `6007e60`. Ранее зафиксированные этапы QA ниже относятся к своим версиям. [PR #34](https://github.com/SigmeD/flexomir_os/pull/34).

## 1. Основные прогрессы

Последующее решение Owner: размер статуса14px desktop /12px compact принят общим компонентом. Новая роль PageHeader.subtitleRole=status и единый responsive size token применяются к OrderComposer/OrderDetail обеих ролей, включая production. Обычные secondary/context сохраняют12/18. Line-height18 сохранён; Figma AUTO — отдельное незакрытое расхождение. Координаты и hashes Header checkpoint7dcbbc4 ниже описывают предыдущую поставку; новые результаты фиксируются отдельным checkpoint.

После второго screenshot Owner поручил приблизить «Черновик» к «Новый заказ». Это отдельная корректировка текущего [Draft PR #34](https://github.com/SigmeD/flexomir_os/pull/34), а не визуальная приёмка всего экрана. Код до корректировки — 04eaa661695dc37889ffe170564162342601cf7f. Сравнение: `/output/playwright/fos03/index.html`; живой DEV pilot: `/?view=manager-orders&composeSpacing=pilot` → «Добавить заказ».

Проверены CURRENT Figma и реальный Chromium на 1440/1024/768/390/320. Figma не менялась. Подпись действительно смещена вниз на desktop; на compact такой проблемы по тем же координатам нет. Процентный сдвиг всех размеров был бы неверен.

## 2. Какие задачи решались

Источник: Figma `7rvIYc6yj3OA7gxmf1xJbv`, read-only session `bb9a0704-e302-499e-b2bc-b52f01338d24`. Manager empty D2569:24648 / T2569:24851 / M2569:25041, filled D2569:24539; PageHeader component set2302:2138 и Desktop2302:2149 / Wide2302:2139 / Mobile2302:2144. Вложенный Title исследован через instances AppShell, не только по screenshot.

Координаты относительно viewport/frame, без resize изображения:

| Метрика | React до fix D1440 | CURRENT Figma D1440 | React compact | CURRENT Figma T/M |
| --- | --- | --- | --- | --- |
| H1 box Y / height | 52 / 48 | 55 / 48 | 98 / 48 | 105 / 48 |
| Subtitle Y / height | 128 / 18 | 109 / 19 | 154 / 18 | 156 / 16 |
| Company group Y | 151 | 151 | 193 | 202 |
| H1 box bottom → subtitle | 28 | 6 | 8 | 3 |
| Subtitle bottom → Company group | 5 | 23 | 21 | 30 |
| Subtitle type | 12px / 18px | 14px / AUTO | 12px / 18px | 12px / AUTO |

React на1024 совпадает с desktop по указанным Y/gaps. Замер glyph range отличается от H1 box: desktop glyph bottom96 → subtitle128 =32px. Это объясняет визуально большой промежуток; эти два разных способа измерения нельзя смешивать в одном утверждении. Figma title TEXT имеет box48px, это не пиксельная маска глифов.

Причина: PageHeader сначала рендерил flex-row с H1 высотой48 и actions высотой68, затем subtitle с margin-top8. На desktop 68 + 8 вместо 48 + 8 даёт лишние20px; на compact actions вынесены в fixed dock и row остаётся48px. Внешняя форма добавляет после всего header только5px на desktop /21px compact. Поэтому ошибка относится к композиции Header, а не к Glass/material или названию подписи.

Source discrepancy: в CURRENT экране lifecycle label — отдельный TEXT вне Header instance; у master Subtitle скрыт, а Desktop TitleRow имеет высоту68. Нельзя считать скрытую master-подпись утверждённым активным subtitle contract. Owner теперь явно поручил перемещение; новый вариант остаётся эталоном до визуальной приёмки. На Header checkpoint7dcbbc4 размер desktop14 vs12 оставался OPEN; последующим решением Owner размер14/12 принят как общая роль статуса. Compact CompanyY202 vs193 и Figma AUTO vs React18 остаются OPEN.

Выбран минимальный вариант общего PageHeader: `subtitlePlacement=below-title`. H1/subtitle/context находятся в текстовой колонке, независимой от высоты actions. Default `below-row` сохраняет существующий DOM/раскладку остальных consumers. Только DEV Manager OrderComposer pilot включает новый вариант. Его desktop body-gap25px вычислен как прежние5 + освобождённые20: CompanyY151 сохраняется, subtitleY128→108. До точного Figma labelY109 остаётся1px при сохранённой типографике. Между H1 box и subtitle теперь8px, между subtitle и Company25px. Compact остаётсяY154/193 без перемещения.

Варианты negative margin/translate и уменьшение высоты HeaderAction отклонены: они маскируют зависимость, могут перекрыть многострочный заголовок или нарушить утверждённую геометрию. Один shared opt-in контракт позволяет проверить эталон до распространения.

Impact map: PageHeader → OrderComposer (pilot); остальные потребители с subtitle — OrderDetail и LayoutBrowser, без subtitle — OrderItemForm. Они сохраняют default. HeaderAction68/48, More, focus, breadcrumbs, frozen FE11, menu14/18/500, данные и API не меняются. Откат — убрать opt-in prop и desktop body-offset из пилота; default поведение независимо.

Проверка:

- RED: desktop expected subtitle gap8, actual28; `output/fos03-header-red.log`, trace/screenshot в `output/playwright/fos03/header-audit/red`.
- GREEN: **48/48 PASS**, skipped/unexpected/flaky 0; Chromium/Firefox/WebKit/touch, пять ширин, 0/1/N. `output/fos03-header-focused.log`, `output/playwright/fos03/green/results.json`.
- Shared regression: **82/82 PASS** — responsive actions, Orders Figma parity, order-compose, private Manager drafts и LayoutBrowser на двух Chromium viewport. `output/fos03-header-shared.log`.
- Build PASS: `output/fos03-header-build.log`. Production preview PASS на 1440 и 320: новый вариант не включается; desktop subtitleY128/gap28/Company151 и отсутствие text-wrapper подтверждены в `output/playwright/fos03/header-audit/production-desktop.json`.
- Пересозданы **30 raw PNG**, page errors0, overflow0. `output/fos03-header-capture.log`; gallery `/output/playwright/fos03/index.html`. Пять source hashes совпадают с проверенными исходниками, frozen fingerprints5/5; manifest не изменён.
- Независимый read-only QA: **PASS WITH RISKS / READY для Owner reference**. Пять ширин/default/Client, отдельная проба длинного H1 на1440/320: перенос без пересечения actions, gap8, положительный gap до Company, overflow0. Скриншоты `output/playwright/fos03/header-audit/independent-{1440,390}.png`. Это не Owner visual acceptance и не полный screen parity.
- Предыдущие 48/48, 544 +4skip и CI2/2 исходного пилота не объявляются проверкой текущего изменения Header.

Source SHA256 Header checkpoint7dcbbc4 (CRLF→LF):

| Файл | SHA256 |
| --- | --- |
| src/components/orders/OrderComposer.tsx | 877df69ff52042575847a727ac316d5f75d804d1a5e4a8bd59560e749ebda1ea |
| src/components/orders/order-compose.css | a7d3afca7a3ac887c2cb16e22116c6b7927023c84f2afb09acbaf0712750dc5c |
| src/components/orders/order-date-fields.css | 35775b399f0f8542d87efb07030ccc5ce8d77142a2037724dfc94d8987dc0f11 |
| src/components/ui/page-header.tsx | 664f9ccfe393995cdde866d8779c8ffba67d4980ddbd5a0b0d26a347ada2fb5f |
| src/components/ui/page-header.css | 59f3274e334089d34a77a5c22b9fe0d05c293ed3bd1a85c492e0471316fca546 |

**Status-size follow-up — проверка принятого общего размера**

| Проверка | Результат |
| --- | --- |
| RED | Desktop expected14, actual12 до изменения; output/fos03-status-red.log |
| Typography, Chromium/Firefox/WebKit/touch | **32/32 PASS**, output/fos03-status-typography-final.log; новый selector использует data-order-open |
| Pilot focused | **48/48 PASS**, output/fos03-status-focused-final.log |
| Shared detail/compose/responsive/layout | **86/86 PASS**, output/fos03-status-shared-final.log |
| Build | PASS, output/fos03-status-build.log |
| Built production | Client+Manager draft/detail:14px на1440,12px на390, line-height18, pilot=null; output/playwright/fos03/status-size/production-final.json |
| Capture / integrity |30 PNG, page errors0, overflow0; все7 source hashes совпадают, frozen5/5. output/fos03-status-capture-final.log |
| Independent source/runtime review | PASS WITH RISKS / READY после исправления найденного тестового locator; size/span/token/secondary isolation проверены отдельно, большие suites reviewer не повторял |

Первый параллельный прогон не является итоговым: typography23 PASS/9 FAIL (новый неверный exact accessible-name locator и закрытие WebKit context), focused46/48 (Firefox protocol close, WebKit Target crashed), shared82/86 (в том числе Target crashed/timeout), capture завершился timeout в сборе screenshot ошибки. Первопричина browser crashes не установлена. Логи output/fos03-status-{typography,focused,shared,capture}.log и артефакты status-size/initial-focused, status-size/typography, status-size/shared сохранены. Исправлен только selector теста; продуктовые исходники между этими запусками и успешными последовательными прогонами не менялись. Таймауты и assertions не ослаблены, retries не добавлялись. Review script теперь сохраняет первичную ошибку до дополнительных screenshot/text/trace, чтобы сбой доказательств не скрывал причину.

Размер14/12 OWNER APPROVED как общий компонент; это не приёмка всего экрана/placement. Line-height18 сохранён по границе решения о размере, AUTO остаётся OPEN. Меню14/18/500 не менялось.

Source SHA256 status-size follow-up (CRLF→LF):

| Файл | SHA256 |
| --- | --- |
| src/components/orders/OrderComposer.tsx | 5439df4a64de20403cfec8a318d60d066a7febf8fd5cbc79a59e91003a628951 |
| src/components/orders/order-compose.css | a7d3afca7a3ac887c2cb16e22116c6b7927023c84f2afb09acbaf0712750dc5c |
| src/components/orders/order-date-fields.css | 35775b399f0f8542d87efb07030ccc5ce8d77142a2037724dfc94d8987dc0f11 |
| src/components/ui/page-header.tsx | 7981bce9fa7d9dd550471a9da83308cdd9d7322f4c939536d455dba96b9b2e9e |
| src/components/ui/page-header.css | b8e48db40f15f6358fb218b9a8fc2c27e5e805e5ee340148f6ad93bbffd49dc7 |
| src/components/orders/OrderDetail.tsx | bdc3d1b1413cc968e01d48c1611e082b6bdf1c3b1214031ca799e54c1ab10268 |
| src/styles.css | ddaad44e7c0a55d056e06ba9d317165eb956f2f0031943a9ab885a4c86e75267 |

## 3. Что в процессе

- Codex — передать исправление в том же Draft PR #34; фактический CI нового head сверять в PR. Предыдущий copy-only head04eaa66 прошёл обе CI, это отдельный checkpoint.
- Owner — положение «Черновика» и отступы приняты 11.11.2026.
- Owner/дизайн — отдельно определить высоту строки AUTO и остальные compact-расхождения; размер14/12 уже принят, оставшиеся решения OPEN, срок не назначен.

## 4. Основные договорённости

- Codex поднимает только подпись desktop в текущем DEV reference и сохраняет CompanyY; compact и остальные consumers не мигрируют до приёмки.
- Codex фиксирует источники и отдельные результаты нового head в том же PR #34; код/дизайн/типографика не объявляются полностью принятыми по успешному CI.
- Owner принимает визуальный эталон перед распространением. Merge и post-merge Drive sync остаются отдельными действиями по разрешённой поставке.

## FOS03 — пилот отступов Manager New Order — основания и проверки

11.11.2026 Owner визуально принял отступы и положение «Черновика» на экране нового заказа менеджера в DEV-варианте `6007e60`. [PR #34](https://github.com/SigmeD/flexomir_os/pull/34).

## 1. Основные прогрессы

Owner принял размер статуса общим компонентом: 14px desktop /12px compact. Добавлены PageHeader.subtitleRole=status и один --fos-type-order-status-size; подключены OrderComposer/OrderDetail обеих ролей в обычном UI и production. Secondary/context остаются12/18, существующая высота строки18 сохраняется. Новый status-size follow-up: **32/32 typography +48/48 pilot +86/86 shared**, build/production PASS,30 PNG, source7/7 и frozen5/5. Независимый review подтвердил общую роль; найденный им тестовый locator исправлен и повторно проверен. Ранний параллельный прогон с browser crashes/ошибкой selector сохранён отдельно, подробности в [аудите](FOS03_MANAGER_SPACING_PILOT_2026-11-10.md). Прошлые QA/CI ниже — исторические checkpoints; новый CI сверять в PR #34.

После второго просмотра Owner поручил поднять «Черновик» ближе к «Новый заказ». [Аудит Header](FOS03_MANAGER_SPACING_PILOT_2026-11-10.md): причина — зависимость подписи от 68px actions row вместо 48px H1. В текущем DEV Manager pilot подготовлен opt-in PageHeader below-title: подпись поднимается на 20 px, Company Y сохраняется; обычные consumers и production остаются на прежнем варианте. Новый Header-вариант проверен отдельно: focused48/48, shared regression82/82, build PASS, production1440/320 PASS, 30 raw PNG без page errors/overflow, frozen5/5. Независимый QA — PASS WITH RISKS / READY для Owner reference. Предыдущие полные QA/CI не переносятся на новый head автоматически.

Уточнение Owner после просмотра: подпись формы переименована в «Черновик» для обеих ролей. Это изменение текста; отступы не менялись. Существующий тест Manager private draft обновлён: 2/2 PASS на desktop/mobile, build PASS (`output/fos03-subtitle-test.log`, `output/fos03-subtitle-build.log`). Полные 48/48, 544 + 4 skip и CI 2/2 ниже относятся к исходному пилоту 2d8a45b. Галерея пересоздана после переименования; OrderComposer на copy-only checkpoint04eaa66 (обе CI SUCCESS) SHA256: 9a282ee2f96fa599103908e313c8f70e0bfcf5863d5f97289088a0f9f43ca4d6.

Подготовлен один контрольный вариант формы менеджера из существующего OrderComposer. Ветка `feat/fos03-manager-spacing-pilot` создана от main `7b17db6dab85e3645c55f3e91fcef81b7dfe26b7`. [План и карта компонентов](FOS03_MANAGER_SPACING_PILOT_2026-11-10.md). Предыдущая поставка остаётся в отдельном [Draft PR #33](https://github.com/SigmeD/flexomir_os/pull/33), четыре CI успешны; её изменения сюда не перенесены.

[Открыть пилот](http://127.0.0.1:5173/?view=manager-orders&composeSpacing=pilot) → «Добавить заказ». [До/после](http://127.0.0.1:5173/output/playwright/fos03/index.html): 30 исходных PNG для 0/1/2 позиций на ширинах 1440/1024/768/390/320. Параметр действует только в DEV для Manager, включая повторно открытый черновик. На 10.11 приёмка, распространение и объединение были открыты.

## 2. Какие задачи решались

Проверены CURRENT Figma: пустая форма D2569:24648 / T2569:24851 / M2569:25041 и заполненная D2569:24539 / T2569:24757 / M2569:24945; metadata, context, screenshots, instance→master. DS V2: section-gap 633:148→633:80 = 32 px, block/md 633:122→633:79 = 24 px. Figma не менялась.

Причина: между Company и Products отсутствовал отступ; General получал разные margins при пустой и заполненной форме; внутри General использовались 10/12/14/20 px. В OrderComposer добавлен DEV query gate, в order-compose.css — scoped CSS variables и grid. Между группами теперь 32 px, внутри General — 24 px. Контролы 44 px, дата до 506 px Desktop, данные и действия сохранены.

| Проверка | Итог и доказательства |
| --- | --- |
| Baseline | 5/5 PASS; `output/fos03-baseline.log` |
| RED до реализации | Пять ожидаемых FAIL: Company gap 0 вместо 32; `output/fos03-red.log` |
| Итоговый focused, четыре проекта | **48/48 PASS**, flaky 0; `output/fos03-focused-stable.log`, `output/playwright/fos03/green/results.json` |
| Полный suite, два Chromium viewport | **544 PASS + 4 штатных skip**, flaky 0; `output/fos03-full-stable.log`, `output/playwright/glass-select-theme/results.json` |
| Build | PASS; `output/fos03-build-final.log` |
| Финальный capture | 30 PNG, page errors 0; `output/fos03-capture-stable.log`, `output/playwright/fos03/observations.json` |
| Built production preview | PASS на 5185: pilot=null, Company gap 0, General 68, дата 44 px, overflow 0 |
| Frozen FE11 / source evidence | 5/5 fingerprints совпали; три source hashes совпали с пересъёмкой; manifest не изменён |
| Независимый read-only QA | PASS WITH RISKS / READY для DEV reference: пять ширин, Client/default/production, WebKit 390 × 3 и Chromium functional/a11y × 2 |
| Документы | Девять документов: относительные Markdown-ссылки разрешаются; diff-check PASS |

12 тестов × 4 проекта покрывают 0/1/N, Save/edit/cancel, stable IDs, даты, длинное имя, Client/default isolation, axe, низкий экран, reduced motion, forced colors и CSS zoom 200% на поддерживаемой ширине. Это CSS zoom, не управление browser chrome zoom. M7 CI включает новый набор и artifacts; фактические head и CI доступны в Draft PR текущей ветки.

Source SHA256 исходного пилота 2d8a45b (CRLF→LF):

- OrderComposer.tsx: `61b957c2e91b1af0f07825f7cbfb8daecb4c34ce89278b5aad836ed9d9adac85`.
- order-compose.css: `149d2625fb78df28faa1da8f0a98b84fae752a35476d1f2e7bd17fffa22cf9cf`.
- Неизменённый order-date-fields.css: `35775b399f0f8542d87efb07030ccc5ce8d77142a2037724dfc94d8987dc0f11`.

Автор и reviewer просмотрели Figma D/T/M и выбранные React before/after. Полная визуальная приёмка экрана не заявляется: сохранены React empty-подсказка, Header/dock, h2/Add alignment и открытые бизнес-контролы Figma. Ручные Y-координаты frames отличаются от выбранных DS gaps между контейнерами. Manager agreed-date, публикация клиенту и пункты 08/09 этим пилотом не реализованы.

Ранние запуски сохранены отдельно. Первый focused: 45 PASS / 3 FAIL из-за ошибочной постановки zoom 390×200%=195 CSS px, ниже минимума 320. Исправленная постановка 780×200%=390 дала 4/4 PASS. Второй focused: 47 PASS / 1 WebKit timeout; WS trace доказал Vite full-reload по изменению review script во время теста. Первый capture остановился на 28 снимках; ранний full прерван. Эти запуски не считаются итоговыми. После завершения всех tracked writes выполнены финальные 48/48, 544 + 4 skip и 30-capture с явным production URL. Таймауты/assertions не ослаблялись, force не использовался. Reviewer подтвердил причину HMR, но полные авторские suites сам не повторял.

PNG/JSON локальные, ignored. На другом checkout: запустить dev server и built preview на 5185; в PowerShell задать `$env:FOS03_PRODUCTION_URL='http://127.0.0.1:5185'`, затем `node scripts/fos03-spacing-review.cjs`. Figma PNG содержат экспортные поля и тень; снимки не масштабировались.

## 3. Что в процессе

- Owner — отступы и положение подписи на контрольном экране приняты 11.11.2026. Распространение пилота остаётся отдельным шагом.
- Codex — проверить actual-head GitHub CI текущего Draft PR до передачи на merge; локальный PASS не заменяет CI.
- Codex — после принятия распространить только согласованный вариант и повторить shared regression. Пункты 08/09, 02/07, 12/13 и API остаются отдельными этапами с собственными gates.
- Owner — отдельное решение о merge PR #33 и FOS03; поручение начать этап не трактовалось как разрешение merge.

## 4. Основные договорённости

- Codex сохраняет DEV opt-in, frozen FE11, menu 14/18/500, размеры и бизнес-контракты до нового решения Owner. API/ACL/1С этим пилотом не реализованы.
- Codex передаёт сравнение, hashes, независимый QA и actual CI в текущем Draft PR; Визуальная приёмка отступов и положения подписи получена 11.11.
- Основная папка и обычная ветка сохранены; worktree не создавался. Ветка PR #33 и четыре старых stash сохранены. Codex объединит пересекающиеся LIVE docs без потери A при разрешённой интеграции.
- Codex синхронизирует существующий Drive CURRENT с post-merge SHA/CI после разрешённой поставки. SRS/DS/Governance не меняются этим пилотом.
