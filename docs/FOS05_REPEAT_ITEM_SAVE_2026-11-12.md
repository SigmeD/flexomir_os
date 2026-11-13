# FOS05 — сохранение позиции повторного заказа

12.11.2026. Owner выбрал: «А- вариант. Только у полей показывают причина блокировки». **G-02 APPROVED с уточнением: причины только у полей, без сводки рядом с Save.** Реализация и локальный QA завершены в [PR #43](https://github.com/SigmeD/flexomir_os/pull/43), проверенный код `848dbc6d818d78cc7d05dd6c5644f293df7479ac`. Визуальная merge разрешён Owner 12.11; полная M8 приёмка отдельно. Рабочая ветка `fix/fos05-repeat-item-save`, база `1ac52005ae0b677a35f44d63994bc56e29991a98`. Один инкремент и PR; отдельный PR #40 не входит в эту работу.

## Источники и границы

- Поручение Owner 12.11: воспроизвести повтор заказа, сравнить А/Б, получить решение до реализации; пока сохранить `dirty && valid`. Затем №13 + №10 с Алексеем; CMP-01…CMP-10 отдельно.
- [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit) при диагностике перечитан; modified 11.11.2026 19:47:41 UTC. Тогда №05 PARTIAL / G-02 OPEN; последующий выбор Owner выше закрыл вопрос А/Б. API/storage/ACL за Алексеем. Новое поручение уточняет очередь.
- GitHub: [PR #33](https://github.com/SigmeD/flexomir_os/pull/33), [#41](https://github.com/SigmeD/flexomir_os/pull/41) и [#42](https://github.com/SigmeD/flexomir_os/pull/42) MERGED; [#40](https://github.com/SigmeD/flexomir_os/pull/40) OPEN, head `a61a5b0`. После fetch main = origin/main = база выше; рабочая папка до подготовки чистая, один worktree.
- CURRENT Figma metadata: [Artwork master 634:445](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-445), [Edit Item 1782:6025](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1782-6025), Save instance `1953:4202` называется `unchanged disabled`. Read-only session `291b4330-b00c-4a5b-81a9-60dfa2eeea40`. Metadata не доказывает новую визуальную приёмку. Ошибки показываются существующими error-props по прямому решению Owner, новый визуальный мастер не создаётся. Принятые runtime-состояния ArtworkSource — [FOS12](FOS12_ARTWORK_STATES_PILOT_2026-11-11.md) и [rollout](ACCEPTED_UI_ROLLOUT_2026-11-11.md).

Новых правил обязательности, прав, способов восстановления исторического файла и серверного успеха не вводим. Figma, frozen FE11, API и модель заказов не менялись. Ревизия документации была 11.11, следующая 25.11; общая уборка не требуется.

## Воспроизведение и причина

Обычный `/?view=client-orders` → завершённый DEMO-007 → Ещё → «Дублировать заказ» (текущее название действия повторения) → «Изменить позицию 1» → количество 500 → 1234.

`OrderItemForm` определяет изменение корректно: `dirty=true`. Остальные параметры первой позиции валидны. Но `artworkMode=UPLOAD`, `fileName=''`, исторический файл обозначен только `unavailableArtwork`. Это metadata, а не доступный файл. `validDemoItem=false`, поэтому Save остаётся disabled. Повторение не должно выдавать историческое имя за выбранный файл.

Путь данных: `COMPLETED_DEMO_ITEMS` → `OrderDemoWorkspace.duplicateOrder` → `OrderComposer` → `OrderItemForm` → `validDemoItem`. При повторении создаются новые IDs заказа/позиций и пустой fileName; исходный заказ неизменяемый.

Различаются две проблемы:

1. Недоступный макет действительно нарушает существующее условие валидности позиции. Одного изменения тиража недостаточно для сохранения по нынешним правилам.
2. Не все нарушения имеют field-error от доменной проверки. Native `form.checkValidity()` возвращает true, invalid controls = 0, alerts = 0, хотя доменная проверка не пройдена. `reportValidity()` не объяснит эту ошибку при сохранении через guard ухода. Наименование из одних пробелов даёт такой же пробел обратной связи: Save disabled, native valid, ошибок полей нет. Owner выбрал устранить этот пробел только сообщениями у полей.

PR #33 очистил устаревший `unavailableArtwork` после нового Local/Library/HELP. Эта часть работает; менять dirty или ослаблять valid для её исправления не требуется.

## Два UX-варианта

| Вариант | Поведение | Польза | Цена / ограничение |
| --- | --- | --- | --- |
| **А — выбран с уточнением Owner** | Save активна только при `dirty && valid`; конкретные причины только у соответствующих полей, без сводки рядом с действием | Сохраняет принятое правило; объясняет, что исправить до нажатия; небольшой общий frontend-инкремент | Даже корректный новый тираж нельзя сохранить отдельно от нерешённого макета. Это действующее правило, не новая возможность |
| Б | После изменения Save активна; нажатие показывает ошибки и переводит фокус к первой. Запись всё равно только после valid | Пользователь может запросить проверку кнопкой; ошибки видны по явному действию | Меняет условие доступности Save на dirty; требует отдельного Owner-решения и согласованного поведения guard/keyboard. Сейчас не разрешён |

## Утверждённый вариант А — только причины у полей

Причины блокировки показываются только у соответствующих полей. Header/Save не получают сводки, новых уведомлений или tooltip с ошибками. Для недоступного исторического макета причина появляется в ArtworkSource:

> Исходный макет недоступен. Выберите файл заново, макет из библиотеки или запросите помощь.

Каждое нарушенное условие той же проверки, которая управляет Save, получает сообщение у своего поля: наименование, целый положительный тираж, форма, положительные размеры, материал, способ печати, источник макета. Общие контроли связываются с сообщениями через ARIA. При исправлении причины сообщение исчезает. Для существующей позиции ошибки видны сразу; в новой — после изменения либо взаимодействия с полем. Чистая новая форма не показывает все ошибки заранее.

Без изменений Save остаётся неактивной; у исторического макета сохраняется пояснение unavailable. Сохранение через кнопку, Enter и guard ухода использует прежнюю проверку; guard не закрывает редактор и не теряет ввод при invalid. Отмена возвращает прежнюю позицию и фокус строки. Материалы и взаимодействия HeaderAction/ArtworkSource сохраняются.

**Граница результата:** А делает блокировку понятной и сохраняет позицию после реального устранения причин. Сохранение одного тиража с нерешённым историческим файлом остаётся запрещённым. Разрешение такого частичного сохранения или reuse серверного файла — отдельное продуктовое/API-решение, не FOS05.

## Карта компонентов и будущий узкий объём

| Источник → React | Решение после approval | Потребители |
| --- | --- | --- |
| Item New/Edit `1791:6130 / 1782:6025` → `OrderItemForm` | EXTEND: одна диагностика и причины только у полей; прежние dirty/valid и commit/cancel | Client New/Repeat/Edit, Manager New/Edit |
| Локальные правила `validDemoItem` → `order-compose-model.ts` | EXTEND: вернуть конкретные ошибки, сохранив текущий набор принимаемых значений; boolean валидности выводить из тех же условий | Form, Save/guard, canSendDemo |
| Artwork `634:445` → `ArtworkSource` | REUSE существующие состояния; передавать конкретную ошибку общим error-prop | Обе роли, Local/Library/HELP/unavailable |
| Input/Select/Quantity/Printing → общие поля | REUSE error/ARIA; расширение только при доказанной необходимости | Общая форма позиции |
| Header Save `1953:4202` → `HeaderAction` | REUSE без изменений: disabled = !dirty или !valid; без сводки и новых описаний | Общая форма |

Новые экранные реализации и независимые валидаторы не нужны. `OrderComposer` и workspace меняются только если проверка выявит необходимую интеграцию; массовый рефакторинг не входит в scope.

## Диагностика исходного main до исправления

Chromium desktop, обычный Client UI; три полных пути LOCAL / LIBRARY / HELP:

- Изменение тиража определено; при отсутствующем файле Save disabled. После выбора допустимого источника Save enabled, старое предупреждение исчезает.
- Тираж 0 после исправления макета по-прежнему блокирует Save; на blur показана ошибка целого положительного числа.
- Save клавишей Enter сохраняет 1234; ID заказа/позиции и соседняя позиция сохранены; повторное открытие показывает 1234 и unchanged disabled.
- Отмена следующего изменения на 9999 возвращает 1234 и фокус строки. Во второй позиции с HELP изменение одного тиража разрешает Save. Завершённый источник остаётся с 500.
- Отдельно получены native/domain диагностические значения для отсутствующего макета и пробельного имени, приведённые выше.

Свежие локальные PNG: `output/playwright/fos05/01-dirty-unavailable-desktop.png` (1440), `02-dirty-unavailable-mobile.png` (390), `03-local-valid-save-enabled.png`. Мобильный снимок показывает текущее состояние, не полный touch-прогон. Материалы excluded из Git, на другом checkout не обещаются. При перезапуске среды dev-сервер останавливался: WebSocket ERR_CONNECTION_REFUSED относятся к этому промежутку; полный сценарий выполнен после восстановления.

Эта секция описывает только исходное поведение. Свежий QA реализации фиксируется ниже; приёмка результата Owner не выводится из технических проверок.

## Приёмка после выбора поведения

1. Проверка эквивалентности валидатора до/после: все прежние valid/invalid значения сохранены; сообщение соответствует каждому нарушенному условию. Никаких fake fileName/обхода valid.
2. Один Client Repeat эталон: unavailable → dirty → причина только у макета → исправление → Save; после визуальной проверки — остальные общие потребители.
3. Client/Manager New/Edit, Client Repeat: Local/Library/HELP, настоящее invalid и несколько ошибок, возврат к исходным значениям, Enter/guard ухода, save/cancel/focus, стабильность ID и неизменность источника. Для Manager не добавлять несуществующий сценарий повторения/права.
4. 1440/1024/768/390/320, keyboard/touch/reduced-motion, a11y, Chromium/Firefox/WebKit, Orders/Artwork/Select/DatePicker и frozen regression; build, независимый review.
5. Отдельно FUNCTIONAL / VISUAL / TECHNICAL; приёмка результата, один PR с LIVE docs, CI фактического head. После разрешённого merge — сверка main/SHA и Drive CURRENT. G-02 approved не означает автоматическую приёмку ещё не проверенного результата.

## QA реализации

- `npm run build`: PASS, 1603 modules. Сохраняется предупреждение Vite о chunk >500 kB; зависимости и split в этот fix не входят.
- `npx playwright test --config=playwright.fos05.config.ts --workers=2`: **48/48 PASS**. Chromium/Firefox/WebKit и Chromium touch-context; Client/Manager, три источника макета, повторение, стабильные IDs, cancel/focus, guard invalid/valid, unchanged, реальные ошибки и их очистка. Пять ширин 1440/1024/768/390/320; axe 20 случаев без нарушений. JSON `output/playwright/fos05/green/results.json`.
- Production preview5187: **4/4 PASS** Client/Manager × 1440/320. Client Repeat → blocked artwork → HELP → Enter Save → reopen → cancel; Manager pristine → 8 причин у полей → disabled. `pageerror=[]`, horizontal overflow отсутствует. PNG `output/playwright/fos05/production-{client,manager}-{1440,320}.png`.
- Независимый QA: **PASS WITH RISKS**, подтверждённых code-blockers нет. Отдельное сравнение старого HEAD и нового validDemoItem: 2970 комбинаций, 0 расхождений. Chromium390 — 13/13 самостоятельных assertions; настоящий touch-context320 с `tap()` — 5/5, Client Repeat/HELP/Save и Manager errors. Проверены ARIA references Manager: dangling IDs нет. Не запускал авторский full suite/build/CI повторно. PNG `output/playwright/fos05/independent/manager-390-field-errors.png`, `manager-320-touch-field-errors.png`.
- Визуально baseline/current1440: Header/Sidebar/сетка и материалы сохранены. У Artwork появился существующий красный error-state и сообщение в его блоке; комментарий сдвинулся вниз в потоке. При quantity0 сообщение находится под количеством. На320 Manager сообщения переносятся по ширине без overflow. Сводки у Save нет. Это проверка согласованного изменения и baseline, не новая Figma pixel-parity/полная M8 приёмка.

`npm run test:e2e -- --workers=2`: **770 PASS / 8 SKIP / 8 FAIL**, 786 тестов, 11.1 min. Все восемь failures отдельно воспроизведены на исходных четырёх source-файлах main `1ac5200` (baseline 0 PASS / 8 FAIL), затем файлы реализации восстановлены byte-identical, SHA256 подтверждены. Snapshot baselines не обновлялись. Полный suite не объявляется зелёным.

| Прежнее падение | Projects | Наблюдение |
| --- | --- | --- |
| `fe-debug-overlays.spec.ts:27` More popup uses the shared Liquid Glass surface and closes on Escape | chromium-1440, chromium-390 | Старая проверка ожидает 0 `data-motion=travel`, получает 1 после hover; прежний main ведёт себя так же |
| `glass-select-visual.spec.ts:3` light Select closed, open and keyboard focus match reviewed screenshots | chromium-1440, chromium-390 | Визуальное отличие от старого Windows snapshot на обоих main/ветке |
| `glass-select-visual.spec.ts:21` dark component palette matches reviewed closed and open screenshots | chromium-1440, chromium-390 | То же, отдельный dark snapshot |
| `glass-select-visual.spec.ts:47` matte 97 preview matches reviewed closed and open screenshots | chromium-1440, chromium-390 | То же, отдельный matte snapshot |

Результаты: `output/playwright/fos05/full-results.json`, `full-regression.log`, `baseline/results.json`. Baseline harness `verify-baseline.cjs` временно подставлял ровно четыре исходных файла, запускал только эти четыре теста в двух projects и восстанавливал изменения в finally. Полный прогон завершился до этой проверки. Остальные scope/source и снимки не подменялись. Проверки статусов/Save/Select/date/frozen в полном прогоне прошли; восемь ошибок вынесены в OPEN тестовой базы, не скрыты и не исправляются через изменение frozen-поведения в FOS05.

**FUNCTIONAL PASS / TECHNICAL focused PASS WITH BASELINE FAILURES / VISUAL baseline-reviewed / OWNER MERGE APPROVED 12.11.** Полная M8 визуальная приёмка отдельно. Ручные NVDA/VoiceOver и физические устройства не проверены. CI фактического PR head — отдельное доказательство в GitHub; локальный PASS его не подменяет. Артефакты локальные/ignored, не обещаются в другом checkout.

## Доставка и CI

[PR #43](https://github.com/SigmeD/flexomir_os/pull/43) — поставка FOS05 по прямому поручению Owner на merge 12.11. Фактический статус merge и SHA проверяются в GitHub/Drive CURRENT. Проверки приложения относятся к коду `848dbc6d818d78cc7d05dd6c5644f293df7479ac`. Последующие правки документации остаются в этом PR и не считаются новым прогоном UI/build.

| CI кода 848dbc6 | Проверенный статус |
| --- | --- |
| [Orders Core UI QA](https://github.com/SigmeD/flexomir_os/actions/runs/43189813039) | SUCCESS |
| [FE-S03 M7 UI QA](https://github.com/SigmeD/flexomir_os/actions/runs/43189812889) | SUCCESS |
| [Artwork / Spacing / FOS05](https://github.com/SigmeD/flexomir_os/actions/runs/43189813092) | SUCCESS |

Документационное уточнение 12.11 фиксирует номер PR, проверенный код, CI и открытые гейты; обновляет девять Markdown-файлов: README, LIVE docs, контракт FOS05 и исторический вход NEXT_SCOPE. Исправлена ссылка на стабильный заголовок «Актуальный индекс» в DECISIONS. Проверены 316 локальных ссылок/якорей: ошибок нет; из них 120 ссылок на файлы в изменённых документах проверены отдельно. `git diff --check` PASS. Код, тесты, workflows и snapshots не меняются; результаты приложения выше не переиздаются как новые. Существующий Drive CURRENT синхронизируется в этой же задаче, без создания второго плана.

Все три CI кода 848dbc6 завершены SUCCESS. Owner после отчёта прямо поручил merge в origin/main; это разрешение на поставку FOS05, не полная M8 приёмка. Код/тесты/workflows после проверенного кода не менялись: последующие коммиты содержат только Markdown. После merge Codex сверяет main SHA/дерево, выполняет новые post-merge проверки и синхронизирует существующий Drive CURRENT. Следующий функциональный блок — №13 + №10 с Алексеем.
