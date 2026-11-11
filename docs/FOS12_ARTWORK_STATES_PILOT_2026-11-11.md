# FOS12 — пилот состояний макета позиции

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
- [x] Сохранить raw screenshots/измерения и обновить относящиеся LIVE docs. [Отчёт проверки](FOS12_REPORT_2026-11-11.md).

Доставка — Draft PR этой ветки. Фактические head/CI публикуются в GitHub. Owner visual gate и rollout остаются открытыми, merge без отдельного поручения не выполнять.

Статусы FUNCTIONAL, VISUAL и TECHNICAL фиксируются раздельно в итоговом отчёте. Отсутствие selected master не выдаётся за визуальную приёмку; Figma reference подтверждает базовую композицию. Отмена пилота — убрать query-флаг; reference остаётся default. Backend, файлы и1С — зона Алексея.
