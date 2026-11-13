# FOS12 — пилот состояний макета позиции

Действующий результат: ArtworkSource принят и подключён ко всем New/Edit/Repeat обеих ролей в PR #35. DEV-only/ожидание rollout ниже — основания пилота, не текущий gate. [Rollout](ACCEPTED_UI_ROLLOUT_2026-11-11.md).

Пилотf509eba принят Owner11.11 ответом «Принято». Последующим прямым поручением разрешены подключение обеим ролям/production и merge PR #35. Presentation/reference и DEV gate удалены. [Текущий rollout](ACCEPTED_UI_ROLLOUT_2026-11-11.md); остальная часть этого документа — контракт и доказательства исходного пилота.

## Задача и источник

Owner поручил реализацию после описания пункта12: один React-пилот empty/local/library/unavailable, затем визуальная приёмка перед распространением. База — main398a93b, PR33/34 MERGED. Ветка `feat/fos12-artwork-source-pilot`, основная рабочая папка. CURRENT Drive modified11.11 06:25:07 подтверждает эту очередь. Ревизия документации10.11, следующая24.11, не просрочена.

Это реализация согласованного пилота, без повторного согласования очевидных технических шагов. Новый визуальный вариант остаётся OWNER VISUAL OPEN. Источники Figma читаются, canvas не изменяется.

Figma session `552c9aee-1769-4007-bc19-8fa4a022306a`, file `7rvIYc6yj3OA7gxmf1xJbv`:

- ArtworkSource634:445 — COMPONENT, не component set: утверждённый empty,506×249, dropzone183, action164×44, upload icon20, library action132×40. Скрытый reuse hint2084:7516 — только «Или», не готовый Library-state.
- Client New1791:6130 → ItemForm2025:6910 → ArtworkSource2025:6811 → master634:445. Edit1782:6025 →2026:6870 использует тот же master. Нет отдельных утверждённых selected-library/unavailable вариантов.
- Layout Upload Panel1438:474/Selected1438:453 — другая композиция библиотеки. Просмотрен для сопоставления, не копируется в ArtworkSource. Его Uploading/Success и лимиты не становятся контрактом этого пилота.
- Action835:259/Secondary835:243 и локальная upload.svg — REUSE. Более поздние принятые нейтральные кнопки/FE11 выше старых screen instances. Иллюстративные20МБ/MIME в Figma остаются OPEN по требованиям; новые ограничения не вводятся.

## Контракт компонента и охват

| Источник → React | Props / состояния | Потребители / решение |
| --- | --- | --- |
| Artwork634:445 → ArtworkSource | presentation reference(default) / states; value/onChange/disabled/error/onOpenLibrary сохраняются | EXTEND общий компонент; подключить только Client OrderItemForm через DEV-флаг `artworkStates=pilot` |
| Native selection/drop → LocalFileControl | Нативный chooser, первый выбранный файл, cancel без изменения, disabled | REUSE, контракт базового контрола не менять |
| Action835:243 → FOSAction | Та же геометрия и принятые material/motion | REUSE, без новых button variants |
| OrderComposer → OrderItemForm | Передать presentation только при DEV + ownerRole client + query-флаге | Один эталон New/Edit/Repeat в клиентском заказе; Manager/обычный UI/production сохраняют reference |

Выбрано расширение существующей композиции с вычисляемым UI-состоянием. Копия экрана/компонента увеличила бы дублирование; глобальная замена до приёмки нарушила бы gate. Новый persistence/state enum/API не создаётся. Производственный source data остаётся DemoItem.

## Состояния и переходы

| Состояние | Что видно | Действие → результат |
| --- | --- | --- |
| empty | Прежний master empty, подсказка и «Загрузить» | Chooser/drop → local; «Мои макеты» → существующий full-page picker |
| local | «Выбран локально: имя», честное отсутствие upload | «Заменить файл» → native chooser; cancel оставляет выбор; library choose → library |
| library | «Выбран из библиотеки: имя», только текущая демосессия | «Заменить макет» → существующий picker; нижняя «Выбрать файл» → native chooser; cancel/back сохраняют выбор |
| unavailable | Явно недоступный исходный макет и его имя, восстановление не имитируется | «Выбрать файл», picker либо HELP; только фактический выбор очищает unavailable |
| help | Прежний checkbox, выбор файла скрыт | Снятие HELP → empty по действующему контракту |

Filename/layoutId/layoutName и unavailableArtwork меняются только существующими событиями выбора. Cancel нативного диалога и возврат из picker не вызывают onChange. Item ID/Order ID/остальные поля и dirty&&valid сохраняются. Отмена редактора не сохраняет изменения. Ни upload/storage success, ни preview bytes/удаление/пункт13 не добавляются.

Вариант states использует ту же dropzone и кнопки. LocalFileControl оборачивает композицию выбора, чтобы его callback открывал file chooser и из нижней альтернативы Library. Options-row исключается из drop-target; доступность и keyboard/focus проверяются отдельно. Первичный library-trigger помечается существующим data-artwork-library для возврата фокуса.

Уточнение после RED keyboard-проверки: options/HELP-checkbox сохраняют DOM-родителя при переключении, чтобы фокус не терялся. В HELP единственный скрытый native input остаётся disabled внутри общей композиции; видимые выбор/действия скрыты. Это не новый файловый статус. RED и GREEN focus сохраняются отдельно.

## План выполнения и приёмка

- [x] Сохранить текущие Figma reference PNG и baseline поведения, зафиксировать RED на отсутствии корректного Library-state.
- [x] Написать целевые браузерные тесты переходов, cancel, disabled/error, сохранения/отмены, пяти ширин и ограничения DEV/Client.
- [x] Минимально расширить ArtworkSource; передать opt-in через OrderComposer/OrderItemForm. Использовать прежние токены/общие действия.
- [x] Проверить Chromium/Firefox/WebKit/touch, keyboard/escape/focus/reduced-motion, доступность и переполнение. Сверить empty с CURRENT master, новые состояния — как предложенный пилот.
- [x] Выполнить build, связанные Layouts/Compose/Wave A проверки, frozen5/5; отдельное независимое QA.
- [x] Сохранить raw screenshots/измерения и обновить относящиеся LIVE docs. [Отчёт проверки](FOS12_ARTWORK_STATES_PILOT_2026-11-11.md).

Доставка — Draft PR этой ветки. Фактические head/CI публикуются в GitHub. Owner visual gate и rollout остаются открытыми, merge без отдельного поручения не выполнять.

Статусы FUNCTIONAL, VISUAL и TECHNICAL фиксируются раздельно в итоговом отчёте. Отсутствие selected master не выдаётся за визуальную приёмку; Figma reference подтверждает базовую композицию. Отмена пилота — убрать query-флаг; reference остаётся default. Backend, файлы и1С — зона Алексея.


## 1. Основные прогрессы — основания и проверки

**Последующее решение Owner11.11:** пилотf509eba принят, rollout FOS03/FOS12 и merge PR #35 явно разрешены. [Новая поставка и проверки](ACCEPTED_UI_ROLLOUT_2026-11-11.md). Текст ниже фиксирует исходный DEV-пилот до приёмки, а не действующее ограничение.

Пункт12 реализован как один DEV-пилот общего ArtworkSource в клиентском редакторе позиции: empty/local/library/unavailable и сохранённый HELP. База main398a93b, ветка `feat/fos12-artwork-source-pilot`. Код не слит, Owner visual acceptance и rollout открыты.

[Живой пилот](http://127.0.0.1:5173/?view=client-orders&artworkStates=pilot): «Добавить заказ» → «Добавить позицию». Для unavailable открыть DEMO-007 → «Ещё» → «Дублировать заказ» → первую позицию. [Галерея пяти размеров](http://127.0.0.1:5173/output/playwright/fos12/review/index.html). Артефакты локальные, не входят в Git.

## 2. Какие задачи решались

Frontend/Codex расширил существующий ArtworkSource, без новой модели данных или копии экрана. Пустой вариант сохраняет действующий мастер. Local показывает имя и честное отсутствие upload. Library показывает «Выбран из библиотеки»; «Заменить макет» открывает существующий picker, «Выбрать файл» — native chooser. Unavailable явно показывает недоступный исходный макет; cancel не выдаётся за восстановление. Только фактический выбор или HELP меняют источник.

Переиспользованы LocalFileControl, FOSAction, библиотечный picker и формы. API, dirty&&valid, ID и общий motion не менялись. Pilot включается только при DEV + Client + artworkStates=pilot; обычные Client/Manager и production используют reference.

| Проверка автора | Результат |
| --- | --- |
| Library-state | RED: нет «Заменить макет»; после изменения GREEN |
| HELP keyboard focus | Отдельный RED на потере фокуса; GREEN после сохранения DOM-родителя checkbox, hidden input в HELP disabled |
| Переходы/chooser cancel/empty/change/drop/picker Escape/focus/Save/Cancel/IDs и пять ширин | 44/44 PASS: Chromium, Firefox, WebKit и touch |
| Disabled/error/нет library callback | 8/8 PASS в тех же четырёх проектах |
| Существующие Layouts/Compose/Wave A/ButtonRoot | 104/104 PASS, Chromium1440/390 |
| Сборка | PASS,238 modules |
| Production-preview с query-флагом, Client/Manager | 2/2: reference сохранён, page errors0 |
| Axe | Без нарушений в целевых пятиразмерных сценариях и error fixture |
| Capture/геометрия | 60 raw PNG, page errors0, overflow0; source/panel/action/options/comments empty совпадают с reference на1440/1024/768/390/320 |
| Независимая проверка | PASS WITH RISKS;14 собственных browser assertions Chromium320/reduced motion; frozen5/5 и diff-check PASS |

Независимый сценарий подтвердил Library→cancel/Escape→Local→HELP→empty, возврат фокуса и отсутствие overflow. Скриншот output/playwright/fos12/independent/empty-after-help-320.png записан после14 assertions и просмотрен. Ограничение инструмента: после программной отмены chooser CLI сохранил служебный modal-state и не отдал итоговый console-summary; сессия закрыта. Другие браузеры, build и широкие наборы reviewer самостоятельно не запускал.

Визуальная сверка:

- Header/navigation/поля/комментарий — существующие композиции. Baseline и pilot-empty имеют одинаковую геометрию пяти размеров; это не новая приёмка целых экранов.
- Artwork — CURRENT master634:445 задаёт506px desktop, dropzone183, action164×44 и upload icon20×20; они сохранены. Локальный asset отрисован без подмены. Принятые нейтральные кнопки отличаются от старой статичной Figma-оптики. Сохранены прежние secondary color/mobile hint и честное «Форматы и размер уточняются» вместо неутверждённых20МБ.
- Selected/unavailable — отдельных утверждённых ArtworkSource variants в CURRENT нет. Текст и адаптация действий являются предложенным пилотом в прежней композиции: VISUAL OPEN. Отдельный Layout Upload Panel1438:453 не скопирован в позицию.
- Первые fullPage test images могут показывать fixed dock/header в середине длинного документа. Для Owner созданы viewport/component PNG с центрированием источника; raw изображения не редактировались и не масштабировались.

Доказательства: output/playwright/fos12/{red,help-focus-red,help-focus-green,targeted,fixture,reference,review,independent}, отдельные targeted-results.json/fixture-results.json; output/fos12-regression.log. Скрипт node scripts/fos12-artwork-review.cjs воспроизводит галерею и observations с SHA-256. Для production поднять preview, задать FOS_REVIEW_URL и запустить тот же скрипт с --production. Новый workflow FOS12 выполняет все52 целевых теста и104 регрессионных; фактические head/CI читаются в PR, локальные проверки не заменяют CI.

## 3. Что в процессе

- Owner: визуально принять либо скорректировать один пилот12 — перед распространением, дата не назначена.
- Frontend/Codex: Draft PR, CI и проверка head; merge только по отдельному поручению. Локальные FUNCTIONAL PASS / TECHNICAL PASS, VISUAL OWNER OPEN.
- Frontend/Codex и Owner: rollout — после приёмки, дата не назначена. FOS03 rollout03, Account02, Save UX05, DatePicker07 остаются отдельными пунктами.
- Owner/PO/Алексей: файловые контракты13/10/11 и права/статусы06 — до зависимой реализации, даты не назначены. Upload/storage/API-success не имитируется.

## 4. Основные договорённости

- Один клиентский пилот в общем React-компоненте до rollout — frontend/Codex, поставка11.11.2026. [Контракт, источники и план](FOS12_ARTWORK_STATES_PILOT_2026-11-11.md).
- Reference по умолчанию, FE11-v0.2, shared Action и native file contract сохраняются — frontend/Codex, во всех изменениях. Убранный query-флаг отключает пилот.
- Новый пилот не становится принятым по тестам или наличию старого empty master — frontend/Codex/Owner, до отдельного visual gate.
- Код, проверки и LIVE docs передаются одним PR. Очередь остаётся в существующем [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit), даты следующего блока не утверждены.
