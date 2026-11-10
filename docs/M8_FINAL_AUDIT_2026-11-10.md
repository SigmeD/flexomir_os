# M8 — заключительная проверка экранов

## Итог поставки — 10.11.2026

[PR #31](https://github.com/SigmeD/flexomir_os/pull/31) слит по прямому поручению Owner. Merge/main SHA a400b9dc73ad77b01b37932fa4c5abbd57d134e0; проверенный PR head f991bd77d16f0552f10e1cb8e0014d7d95a84850. Дерево файлов после squash совпало с проверенным head, сборка на main прошла. Remote feature branch удалена; локальная ветка и четыре stash сохранены.

Обе финальные CI-проверки успешны: [Orders Core UI QA](https://github.com/SigmeD/flexomir_os/actions/runs/42824002319) и [FE-S03 M7 UI QA](https://github.com/SigmeD/flexomir_os/actions/runs/42824002316). Полный локальный popup-набор после исправления outside-click — 35/35 PASS. Исходные FAIL и промежуточные результаты ниже сохранены как доказательства; 520/4 относится к раннему head 51d93be, а не новому полному прогону после всех правок.

Issue #21 остаётся открытым до полного DoD. Manager agreement/status/API и общая визуальная приёмка не закрываются техническим merge. Дальше приведены checkpoints этой поставки; её актуальный статус указан здесь.

## Диагностика перед merge по поручению Owner

Owner прямо разрешил merge PR31 в main/origin. На head79d0529 CI выявил ошибку тестовой геометрии: Orders233PASS/1FAIL, M7 core159PASS, последующий popup lifecycle31PASS/4FAIL. Падал один сценарий popup-dismissal: после добавления даты центр textarea оказался под открытым More. Trace локального воспроизведения2/2FAIL сохраняет point195,663 и menuitem, перехватывающий click. Это не клик вне меню, который сценарий должен был проверять.

В тесте выбран видимый левый край textarea12,12 обычным click без force. Все исходные проверки закрытия, фокуса, немедленного inert/pointer-events и таймауты сохранены; UI, физика и frozen sources не менялись. Исправленный строгий сценарий повторён3раза в Chromium/Firefox/WebKit/touch:12/12PASS, buildPASS. Точечное изменение координаты одобрено независимым reviewer; CI финального head f991bd77 затем завершился успешно; merge выполнен после этого. Доказательства: output/m8-merge/popup-red.log, popup-strict.log, trace-first.

## Последующее уточнение10.11 — поле согласованного срока клиенту

В предыдущей правке размеров поле клиенту не было добавлено. После прямого уточнения Owner пропуск устранён в существующих OrderComposer/OrderDetail: Client New всегда показывает пустой readOnly FOSDateField, Client Detail показывает существующее detail.agreedDate либо пустое значение. Используется прежний OrderDateFields, без копии контрола/нового чернового значения. Желаемая дата не подменяет согласованную; повторный/новый заказ её не наследует. Manager edit, согласование, статусы, API/1С и frozen sources не изменены.

**Проверки этого diff:** сначала2 теста воспроизвели отсутствие поля (Client New и work Detail), затем40/40 Chromium в order-compose/order-detail/orders-figma-parity,8/8 Firefox/WebKit в New/Submit/Client+Manager readonly detail; buildPASS. Detail проверяется на5ширинах, обе роли получают исходную fixture дату2026-11-20; новый и отправленный Client draft сохраняют пустое readonly поле при заполненной requestedDate. Полный520 и предыдущий64/4 — результаты предыдущих checkpoints, не этой правки.

Новые измерения30 состояний и18 screenshots: output/m8-client-agreed-date/measure.json и {client,manager}-{new,detail,item}-{1440,768,390}.png.0overflow/0pageerrors. Client New/Detail даты506×44px на1440,315.5×44px на1024,350×44px на768/390,280×44px на320. На desktop/tablet оба поля рядом, на mobile последовательно; agreed всегда readonly. Автор просмотрел свежие Client New Desktop и Detail Mobile: состав пары соответствует поручению Owner; Header/Sidebar/action dock остаются прежними. Старая Client Figma с одним полем не отменяет новое указание. Предыдущие доказательства размеров сохранены отдельно в output/m8-fields.

Независимое read-only review последней правки: PASS, findings нет. Reviewer проверил diff и4 реальных desktop/tablet/mobile screenshots с пользовательскими references; собственный runtime не запускал.

## Checkpoint342ac12 — размеры существующих полей по поручению Owner

**Реализовано:** общий OrderDateFields использует существующий FOSDateField в OrderComposer/OrderDetail обеих ролей. Desktop grid max1038px, gap26px, две колонки до506px; одиночное поле сохраняет ту же колонку. Ниже1024px одиночное поле занимает доступную ширину, пара делится поровну с gap28px; ниже601px поля идут друг под другом. Старое отдельное readonly720px правило удалено. Manager detail body1056px ранее давал по516px на дату; теперь даты до506px, как в форме создания. Разница ширины родительских контейнеров ролей на1024px остаётся адаптивной композицией, а не отдельным размером контрола.

**Охват аудита:** основные поля позиции уже используют desktop grid1038/gap26, artwork max506; форма/ширина/высота — отдельная более узкая группа. Input/Date/Select используют общий44px контроль. Support120px textarea и Order112px textarea — разные многострочные композиции; Layout description имеет свои responsive размеры, Profile/Auth ограничивают ширину формы. Уравнивание их ширины с колонкой даты не требуется. Новые видимость agreed-date, редактирование, подтверждение, статусы и серверные команды не реализованы.

**Измерения Chromium:** output/m8-fields/measure.json/log,30 состояний =2роли ×3экрана (New/Detail/Item) ×5ширин. Даты на1440px:506×44px везде; на768px: одиночное728px / пара350px; на390px:350px; на320px:280px. На1024px дата Client315.5px и Manager307px из-за доступного пространства их контейнеров; внутри каждой роли New/Detail совпадают.0 horizontal overflow,0 page errors, все измеренные однострочные контроли44px.

**Проверки после правки:** npm run build PASS; существующие order-compose/client-orders/manager-orders/orders-components/orders-figma-parity:64/64 Chromium; два существующих New→Item→Save и five-size reference tests:4/4 Firefox/WebKit. Полный прежний520PASS относится к предыдущему head, после этой правки не перезапускался. Новые screenshot18шт: output/m8-fields/{client,manager}-{detail,new,item}-{1440,768,390}.png. Поле даты совпадает с заданной шириной Client New; Client readonly намеренно уже старого frame720px. Header/Sidebar/action dock и данные неизменны; fixture copy и ранее согласованные Owner deltas не являются новой pixel-parity претензией.

**Независимое review:** просмотрены9 свежих screenshots и2 Figma reference images, исходный diff/measurements; code/layout findings нет. Два замечания к формулировкам реестра (до506px и исключение узких Item dimensions) исправлены. Reviewer runtime не запускал. Owner screen acceptance/merge отдельно; Figma и frozenFE11/14-18-500 не менялись.

**Ответ о статусах:** по CURRENT E2E Manager сохраняет согласованные данные, затем «Создать заказ» запускает1С; после результата система синхронизирует данные/статусы. Само сохранение даты не является утверждённым переходом в«В работе»; точное event→status правило OPEN у Owner/PO/Алексея. В React ManagerDemoIntake production action disabled и не вызывает1С.

**База:** `origin/main 9d1f5bca738e667dc3d63a7a1f0ce9a2f1ec18da`, PR #30 MERGED. **Ветка:** `feat/m8-final-screen-qa`. Одна поставка по [issue #21](https://github.com/SigmeD/flexomir_os/issues/21); этот инкремент затем слит в PR #31; итог указан в начале отчёта.

## 1. Основные результаты

Получены **69 новых Figma↔React пар по 23 семействам экранов** на Desktop1440, Tablet768 и Mobile390. Figma прочитана заново в session `0afae8b2-6da2-4635-a892-97f2392f3d58`; старые screenshots не выдаются за свежие. Полная привязка screen/state → Figma → shared React → действие → pair/ограничение находится в [существующей карте экранов](SCREEN_MAP_M4_2026-11-06.md).

В 69 browser captures: 0 horizontal overflow, 0 page errors, 0 незагруженных изображений; title всех страниц — Flexomir OS. Это технические измерения, не автоматическая визуальная приёмка. Независимый reviewer просмотрел 12 настоящих пар D/T/M и исходный diff: **PASS WITH RISKS**, без подтверждённых новых дефектов. Он не запускал runtime и не объявлял просмотренными все 69 изображений.

Сохранены Manrope14/18/500, frozen FE11 reference `f527bcb`, общий Glass/GL03, Account/header и responsive action dock. Figma masters, SRS/Scope/Governance, backend/API/ACL/1С не менялись.

## 2. Какие задачи решены

| ID | Наблюдение / источник | Исправление и проверка |
| --- | --- | --- |
| M8-01 / P2 | Browser title во всех исходных captures оставался «Flexomir V3 / Glass Filter / website-glass proof» | Единственный index.html теперь задаёт Flexomir OS. Проверены 6 реальных cabinet routes, все 69 финальныхcaptures и build |
| M8-02 / P2 | Client Support Detail 634:8137 / FOS Breadcrumbs Support Detail требует parent «Поддержка», React показывал «Мои обращения». Manager 2606:22577 требует «Мои обращения» | В существующем SupportScreen изменён только Client ticket label variant. PageHeader/nav.back и focus return прежние; Client/Manager new/list не изменены. Regression breadcrumb→свой список→opener focus: RED1 FAIL/1 PASS → GREEN6/6 Chromium/Firefox/WebKit |
| M8-QA-01 | WebKit Account alignment test3/3 FAIL: helper проверял isVisible до mount React, пропускал закрытый demo trigger и ждал скрытую кнопку роли. Error snapshot сохранял закрытый trigger | Test-only openDemoControls ждёт trigger ИЛИ открытую panel. В JSX это взаимоисключающие ветви. Исходный case после исправления 3/3 PASS; таймауты/геометрические assertions не ослаблены |
| Capture tooling | Старый comparison script предполагал одинаковую 24/16px рамку экспорта; 12 новых Figma frames имеют другие render bounds | Новый scripts/m8-screen-review.cjs читает versioned frame manifest и exact renderBounds offsets. Сохраняет raw, не растягивает изображения, переиспользует существующий PNG pair helper. Capture error на исходном предположении зафиксирован, исправлен до review |

### Сравнение по областям

| Область | Что сверено | Различия и трактовка |
| --- | --- | --- |
| Header / Sidebar / Account / actions | Общие композиции, отступы/оси, логотип/аватар, group actions | Поздние принятые решения о header/Account/Glass/dock и 14/18/500 выше старых screen instances. Sidebar icons и точный max-width сохраняют прежний Owner OPEN |
| Orders / Item | List/detail/completed/new, Manager draft/item; поля, segmented, listbox, ArtworkSource | Число/текст записей и длинные названия синтетические; источник не подгонялся под картинки. Manager PILOT filters/agreed-date/publication отдельно OPEN |
| Support | Client/Manager own list/new/detail, role isolation и breadcrumb/focus | Client Detail label исправлен. Fixture dates/messages отличаются; кандидат Client New содержит неутверждённые category/attachments, они не добавлены |
| Layouts | Library/detail/upload, select/detail/select-upload в контексте Item | UI-only preview; server download/history/storage не имитируются. Copy о форматах/размере честно отмечает открытый контракт. В отдельных old-frame Details/Support есть небольшие различия вертикальных отступов/метаданных: материал для Owner review, не заявленная полная pixel parity |

### Файлы и воспроизведение

- [Manifest69 frames](../scripts/m8-screen-manifest.json): exact node IDs, width/height, CURRENT/PILOT/CANDIDATE и export offsets. 54 CURRENT/linked refs,12 PILOT partial refs,3scoped Client New candidates.
- [Capture script](../scripts/m8-screen-review.cjs): `node scripts/m8-screen-review.cjs`; `--only client-support-detail,manager-support-detail` ограничивает текущий run. Перед запуском скачать актуальные Figma PNG по manifest через MCP в output/m8-final/figma. Сам script не авторизуется в Figma и не загружает старые референсы молча.
- [Локальный HTML-обзор](../output/m8-final/chromium-index.html), [измерения 69 captures](../output/m8-final/chromium-manifest.json). Figma слева, React справа в исходном масштабе, matched viewport/state; исходные exports сохранены отдельно.
- Примеры: [Client Item M](../output/m8-final/compare/chromium-client-item-m.png), [Client Support Detail D](../output/m8-final/compare/chromium-client-support-detail-d.png), [Manager draft M](../output/m8-final/compare/chromium-manager-draft-m.png), [Company orders M](../output/m8-final/compare/chromium-company-orders-m.png), [LAY03 D](../output/m8-final/compare/chromium-layouts-select-d.png).

PNG/HTML/JSON прогона ignored/local и не доступны через GitHub checkout. Ни script, ни наличие пары не присваивают VISUAL PASS: результат остаётся REVIEW_REQUIRED до человеческой проверки.

### QA и диагностические результаты

| Проверка | Наблюдаемый результат | Доказательство |
| --- | --- | --- |
| TypeScript / build | PASS | output/m8-final/build.log |
| Свежие captures |69/69, без recorded page errors/overflow/unloaded/wrong title | capture-final.log, chromium-manifest.json |
| Support breadcrumb RED |1 FAIL(Client)/1 PASS(Manager), parent label отсутствовал | breadcrumb-red.log/json |
| Support breadcrumb GREEN |6/6 PASS, обе роли ×3engines; возврат и focus | breadcrumb-green.log/json |
| Первый M7 checkpoint |152 PASS/1 FAIL, WebKit demo-helper race | m7.log/json |
| Исходный WebKit case до/после |3 FAIL →3 PASS без retry | account-webkit-recheck.log → account-webkit-fixed.log |
| Итоговый M7 |159/159 PASS Chromium/Firefox/WebKit, пять ширин, axe/keyboard/touch/dirty/empty/error/integration | m7-final.log, m7-final-results.json |
| Первый полный checkpoint |519 PASS/1 FAIL/4 expected skips; Select fixture не отрисовалась перед первым click, причина не подтверждена | full.log/json, full error-context |
| Изолированный исходный Select case |6/6 PASS, два viewport-проекта ×3 повторения | select-recheck.log/json; UI не менялся по этому сбою |
| Повторная полная regression |520 PASS / 4 expected skips / 0 FAIL; flaky0, 8.5m; без auto retry, trace retained on failure | full-verified.log, full-verified-results.json |
| Frozen |git diff пяти sources+manifest пуст; contract входит в full suite | docs/FE11_MOTION_FROZEN_V0_2.json |
| Independent review |PASS WITH RISKS; code/crop/frozen проверены,12actual pairs, runtime не запускался reviewer | reviewer typography_review; исходная попытка другого reviewer не выполнилась из-за лимита сервиса, не засчитана |
| GitHub CI |Проверить на фактическом head после отправки одного PR | Ссылка PR будет в CURRENT |

Команды итоговых прогонов: `npx playwright test --config=playwright.m7.config.ts --workers=2 --output=output/m8-final/m7-final --reporter=line,json` и `npx playwright test --workers=2 --trace=retain-on-failure --output=output/m8-final/full-verified --reporter=line,json`. JSON output paths заданы через PLAYWRIGHT_JSON_OUTPUT_NAME. Не переносить PASS с старого commit или из незавершённого run.

## 3. Что остаётся открытым

| Пункт | Почему OPEN | Владелец / следующий шаг |
| --- | --- | --- |
| Manager agreed date в private draft | Figma 2569:24648/24851/25041 показывает поле; текущий approved React scope не закрывает agreed-date edit/private publication/versioning. Live Manager section ещё candidate/PROPOSED | Owner/PO: выбрать отдельную UI-задачу или оставить до контракта. Async вопрос задан; «продолжи» не выдано за выбор варианта. Поле без решения не добавлено |
| Manager search/company/sort panel, publication, production statuses | PILOT/demo не задаёт утверждённый business contract | Owner/PO/Алексей; без самовольного расширения |
| Client New Support category/attachments, настоящие replies/send | Candidate screen ≠ approved scope; FE-S03 разрешает subject/body requester flow | Owner/PO/Алексей |
| Auth | Утверждённого CURRENT визуального reference нет | Owner/design; OWNER_DESIGN_OPEN |
| Макеты / file formats / storage/history | Только UI preview и local selection, full product scope открыт | Owner/PO/Алексей |
| Whole-screen visual acceptance и косметические отличия | CI и выборочный независимый review не заменяют решение Owner по всем утверждённым экранам | Owner: просмотр готовых пар и решения по конкретным OPEN; дата не назначена |
| M8 technical delivery | PR #31 MERGED, main a400b9d; обе CI на f991bd77 SUCCESS. Полный520/4 относится к раннему head51d93be | Выполнено; визуальная приёмка отдельно |

Подтверждённых новых P0/P1 в проверенном объёме не обнаружено; это не доказательство полного отсутствия дефектов вне проверенных состояний. Issue #21 не закрыт, M8 не объявлен OWNER ACCEPTED / RELEASED.

## 4. Договорённости и следующий шаг

PR #31 с кодом, проверками и LIVE-документами слит по отдельному поручению Owner после успешного CI. Существующий Drive CURRENT синхронизирован с main a400b9d. Для визуальной приёмки остаются конкретные пары и список открытых решений.

После закрытия утверждённых M8 gates — M9: frontend подключается к согласованным доступным API Алексея; fixtures не выдаются за production. Следующая плановая ревизия документации —24.11.2026.
