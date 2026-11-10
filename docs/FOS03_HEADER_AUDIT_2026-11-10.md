# FOS03 — аудит «Новый заказ → Черновик → Компания»

## 1. Основные прогрессы

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

Source discrepancy: в CURRENT экране lifecycle label — отдельный TEXT вне Header instance; у master Subtitle скрыт, а Desktop TitleRow имеет высоту68. Нельзя считать скрытую master-подпись утверждённым активным subtitle contract. Owner теперь явно поручил перемещение; новый вариант остаётся эталоном до визуальной приёмки. Разница desktop type14 vs12 и compact CompanyY202 vs193 остаётся OPEN, не исправляется молча под видом вертикального перемещения.

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

Source SHA256 проверенного Header-варианта (CRLF→LF):

| Файл | SHA256 |
| --- | --- |
| src/components/orders/OrderComposer.tsx | 877df69ff52042575847a727ac316d5f75d804d1a5e4a8bd59560e749ebda1ea |
| src/components/orders/order-compose.css | a7d3afca7a3ac887c2cb16e22116c6b7927023c84f2afb09acbaf0712750dc5c |
| src/components/orders/order-date-fields.css | 35775b399f0f8542d87efb07030ccc5ce8d77142a2037724dfc94d8987dc0f11 |
| src/components/ui/page-header.tsx | 664f9ccfe393995cdde866d8779c8ffba67d4980ddbd5a0b0d26a347ada2fb5f |
| src/components/ui/page-header.css | 59f3274e334089d34a77a5c22b9fe0d05c293ed3bd1a85c492e0471316fca546 |

## 3. Что в процессе

- Codex — передать исправление в том же Draft PR #34; фактический CI нового head сверять в PR. Предыдущий copy-only head04eaa66 прошёл обе CI, это отдельный checkpoint.
- Owner — визуально проверить положение «Черновик» после перемещения; до rollout, дата решения не назначена.
- Owner/дизайн — отдельно определить, нужно ли выравнивать desktop subtitle14px и остальные расхождения compact frames; решение OPEN, срок не назначен.

## 4. Основные договорённости

- Codex поднимает только подпись desktop в текущем DEV reference и сохраняет CompanyY; compact и остальные consumers не мигрируют до приёмки.
- Codex фиксирует источники и отдельные результаты нового head в том же PR #34; код/дизайн/типографика не объявляются полностью принятыми по успешному CI.
- Owner принимает визуальный эталон перед распространением. Merge и post-merge Drive sync остаются отдельными действиями по разрешённой поставке.
