# M8 — заключительная проверка экранов

**База:** `origin/main 9d1f5bca738e667dc3d63a7a1f0ce9a2f1ec18da`, PR #30 MERGED. **Ветка:** `feat/m8-final-screen-qa`. Одна поставка по [issue #21](https://github.com/SigmeD/flexomir_os/issues/21); merge этого инкремента отдельно.

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
| M8 technical delivery | Повторная full regression завершена:520 PASS/4 expected skips/0 FAIL. CI отправленного PR head сверяется отдельно | Codex, до сдачи |

Подтверждённых новых P0/P1 в проверенном объёме не обнаружено; это не доказательство полного отсутствия дефектов вне проверенных состояний. Issue #21 не закрыт, M8 не объявлен OWNER ACCEPTED / RELEASED.

## 4. Договорённости и следующий шаг

Codex завершил локальные build/M7/full QA; отправляет один PR и проверяет CI его фактического head с минимальными правками, tests, script и LIVE docs; синхронизирует существующий Drive CURRENT. Owner получает конкретные пары и список решений для visual review. Merge только по отдельному поручению.

После закрытия утверждённых M8 gates — M9: frontend подключается к согласованным доступным API Алексея; fixtures не выдаются за production. Следующая плановая ревизия документации —24.11.2026.
