# №07 — Glass DatePicker: анализ, контракт и пилот

Статус: OWNER APPROVED / G-04 ACCEPTED / ORDINARY CONNECTED / MERGED. Owner принял компактный вариант с линзой ответом «да, отлично применяй». [PR #41](https://github.com/SigmeD/flexomir_os/pull/41) слит 11.11.2026 в19:33:59UTC, merge `e6a04fd748dbb16702610b3d7898b8ba1d3f87a5`, проверенный head `85ad6ef147a246b03652b92e70e50925d948870d`. Историческая база разработки — origin/main94b6587; remote head после merge удалён.

## Доставка

CI фактического head:5/5SUCCESS — [DatePicker](https://github.com/SigmeD/flexomir_os/actions/runs/43085191441), [Orders](https://github.com/SigmeD/flexomir_os/actions/runs/43085191443), [Hover](https://github.com/SigmeD/flexomir_os/actions/runs/43085191433), [Artwork/Spacing](https://github.com/SigmeD/flexomir_os/actions/runs/43085191426), [M7](https://github.com/SigmeD/flexomir_os/actions/runs/43085191869). Дерево merge идентично проверенному head: a54a277d406f7a7e51079005257a5ba7a1acb39d. После merge: новый build1603modulesPASS, ordinary2/2, production smoke5/5 и frozen5/5. Исходные52/52+58/58+production30/30 и независимое review сохранены ниже. Полная M8 приёмка, SR/реальные устройства и API-ready остаются отдельными gates.

## История разработки и принятый контракт

Датированные этапы ниже сохраняют причины и результаты; прежние G-04 OPEN, Draft и ожидание rollout заменены статусом доставки выше.

## B2.5 — выбор подхода

| Подход | UX и доступность | Стоимость / решение |
| --- | --- | --- |
| Native input date | Системный календарь и клавиатура; внешний вид зависит от ОС | Минимум поддержки, не решает единый Glass popup; остаётся в обычных заказах до приёмки |
| Общий adapter + React DayPicker | Готовые roving focus, календарная математика и RU locale; ручной ввод, dialog lifecycle и форма принадлежат adapter | Выбран для изолированного пилота; точная версия 9.14.0, MIT; без платных сервисов |
| Полностью свой календарь | Полный контроль, но своя арифметика/клавиатура/доступность | Больше риска и поддержки без выигрыша для текущего сценария |

Источники: [DayPicker single](https://daypicker.dev/docs/selection-modes), [accessibility](https://daypicker.dev/guides/accessibility), [APG DatePicker dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/). Context7 /gpbl/react-day-picker/v9.14.0 прочитан. Автоматические проверки не заменяют ручной screen-reader QA перед production.

## B2.6 — карта и границы

| Figma / существующий компонент | Решение | Props / consumers |
| --- | --- | --- |
| Date Field1169:437, Default383/Focus412/Error421/Readonly433 → FOSInput/FOSDateField | REUSE закрытую геометрию и Field/error/helper; CREATE общий FOSDatePicker adapter | label/value ISO/onValueChange/min/max/required/readOnly/disabled/name; будущие Client/Manager consumers, сейчас только пилот |
| Popup shell1914:655 → FosPopup + Surface + frozen Rows/Material | REUSE FosPopup с semanticRows, role=dialog; внутри календарь role=grid | Нет data-popup-item и выдуманной вертикальной линзы между днями; общий material/open motion не меняется |
| Open calendar master | OPEN: в FOS Technical Masters1688:532 отдельного Calendar/DatePicker не найдено | Новый изолированный UX-кандидат, не Figma parity claim и не approved rollout |
| Orders OrderDateFields/FOSDateField | KEEP | Клиент agreedDate readonly; save/dirty/validation/API без изменений |

Figma read-only session c31bae2e-08a1-47a8-88ea-057e57b78f2d, Date Field context+screenshot и popup1914:655 прочитаны 11.11.2026. Canvas не менялась. Reference PNG локален в output/playwright/fos07/reference.

Открытие кнопкой либо Alt+Down/ArrowDown переводит фокус к выбранной доступной дате, иначе today с учётом min/max. RU месяц/weekday, неделя с понедельника. Стрелки/Home/End/PageUp/PageDown/Shift+Page переключают фокус, не value. Enter/Space/click/tap коммитят одну дату, закрывают popup и возвращают фокус. Escape/клик снаружи отменяют навигацию без изменения value; Tab циклический в dialog. min/max только props, новых бизнес-запретов нет.

Ручной ввод ДД.ММ.ГГГГ; дата хранится YYYY-MM-DD без UTC/toISOString. Некорректный или выходящий за min/max ввод не эмитит дату и блокирует form validity; очистка эмитит пустую строку. Native date proxy сохраняет FormData/min/max/required. Readonly/disabled не открывают popup; reset и внешнее controlled value обновляют отображение. Действующий controlled родитель — источник истины.

## B2.7 — проверяемый план

- [x] RED: tests/fos07-datepicker.spec.ts и playwright.fos07.config.ts. Открытие RU grid на отдельном /fos07-datepicker.html, выбор ISO, readonly/disabled и min/max. Запустить Chromium, сохранить исходный FAIL отсутствующего пилота.
- [x] GREEN: src/components/ui/fos-date-picker.tsx + date-only.ts + fos-date-picker.css. DayPicker9.14.0; existing FOSInput/FosPopup/FosButtonRoot. Форма и focus lifecycle в adapter, без изменения frozen или FOSDateField.
- [x] Стенд: fos07-datepicker.html + src/Fos07DatePickerLab.tsx + scoped lab CSS. Client/Manager fixtures, native comparison, readonly/disabled/error/bounds/controlled rejection/reset. DEV-only отдельная Vite entry; App и обычные формы не меняются.
- [x] Проверки: Chromium/Firefox/WebKit/touch; ISO/invalid/leap/year crossing/minmax/keyboard/focus/outside/required/FormData/reset; пять ширин1440/1024/768/390/320, zoom200%, reduced-motion/forced-colors и axe. Снимки и видео сохранять в output/playwright/fos07.
- [x] npm run build; действующие date/order regressions и fingerprints5/5. Независимое review перед сдачей. Для новых browser API обращаться к Context7.
- [x] LIVE docs обновлены в той же ветке, открыт [PR #41](https://github.com/SigmeD/flexomir_os/pull/41); ссылка и визуальные доказательства подготовлены для Owner. Исторический gate пилота впоследствии закрыт приёмкой Owner; обычный rollout слит в PR #41.

## B2.8 — критерии приёмки

FUNCTIONAL: выбор одной даты всеми видами ввода, корректные bounds/readonly/disabled/required/reset/controlled rejection, нет изменения даты от навигации или Escape.
TECHNICAL: build, browser QA, axe, frozen fingerprints; статус CI только по фактическому head.
VISUAL: закрытое поле сверяется с1169:437; открытый popup — изолированный кандидат на существующей поверхности. Owner выбирает принять/доработать/оставить native. Полная визуальная приёмка M8 и backend-ready не заявляются.


## Проверки и открытая приёмка

Первичный RED воспроизвёл отсутствие пилота. Расширенный прогон нашёл повторный выбор дня без закрытия и выход popup за экран при CSS zoom200%; причины исправлены в adapter. Independent review выявил callback readonly при reset, рассинхрон controlled rejection и неверный начальный фокус для полностью прошлого диапазона; все три воспроизведены до исправления. Результаты до исправлений сохранены отдельно в output/playwright/fos07. Пороговые проверки не ослаблялись.

Авторский финальный набор:40/40 PASS Chromium/Firefox/WebKit/touch,0 skipped/unexpected/flaky. Включает обе роли, пять ширин1440/1024/768/390/320, CSS zoom200%, reduced-motion/forced-colors, axe без нарушений, manual/required/FormData/reset/rejection, keyboard/leap/year0001/9999 и UTC+14/UTC−8.40 rawPNG сохранены. Выполнены отдельные 34 проверки существующих OrderComposer/Detail и frozen contract: PASS, 0 skipped/unexpected/flaky. Build238modules PASS, production assets остались прежними; fingerprints5/5. Новая отдельная DEV entry не включена в обычную production сборку.

Независимый script SHA256 60A3931C447ABC323E83B148C79FB32CFF553EB9A016FCC8DBF02EA53A46F326 выполнен root неизменно:10/10PASS Chromium/WebKit, включая real touch. Автор script проверяет source hashes/results/PNG; это не независимое исполнение всех браузерных наборов.

Дополнительный независимый сценарий C3F3CBED4AB9D5B42C4A4232BF2466DAE16616E36C3CE690F8A01D9E6928022A:2/2PASS Chromium/WebKit. Он проверяет исправление invalid manual draft повторным выбором принятой даты. Отдельный авторский RED подтвердил дефект до исправления; на activation отображение теперь сверяется с accepted controlled value даже при unchanged/rejected prop.

Пилот: http://127.0.0.1:5173/fos07-datepicker.html ; [галерея и видео](http://127.0.0.1:5173/output/playwright/fos07/review/index.html). Native calendar и все обычные order consumers сохранены. Закрытые поля используют тот же FOSInput/Field:44px,8px radius,label13/18/600,body14/20. Readonly без calendar trigger, error/helper прежние. Popup использует существующие20px/blur20/surface/motion; геометрия календарной сетки — новый кандидат, не утверждённый Figma master. CSS zoom200% проверен с keyboard open и visualViewport bounds; pointer/touch отдельно на пяти ширинах. Реальные устройства и ручной NVDA/VoiceOver ещё не проверены.

Исторический gate пилота: G-04 тогда был OPEN. После замечаний ниже Owner принял вариант и поручил применение; rollout и merge выполнены. Глобальная визуальная приёмка M8 и API/production-ready не заявляются.

## Уточнение Owner: компактный календарь /11.11

По Screenshot_1 Owner поручил убрать повторный заголовок «Желаемый срок» и нижнюю инструкцию. Они удалены из popup; подпись самого поля и доступное имя dialog сохранены. Закрытие перенесено в строку месяца, календарь лишён отдельной строки заголовка и подвала; hit targets44px и существующая клавиатура сохранены. Для узкой области при zoom навигация переносится без наложения на месяц. На этом этапе изменение продолжало Draft PR #41; последующая явная приёмка Owner разрешила rollout.

## Уточнение Owner: день как линза меню /11.11

Owner показал дату18 и Account Menu как стилевой reference. Новый FosDatePickerDay переиспользует Day/DayButton библиотеки и FosGlassMaterial с параметрами существующей линзы Rows: radius14,blur1.5,strength.1,neutral,centerOpacity.12,rim12. Синий фон выбранного дня и серый day-hover заменены стеклом. Одновременно видна одна линза: preview доступного дня, иначе accepted selected date; leave/disabled/keyboard возвращают выбранную. Hover не меняет value/aria-selected; click/Enter/tap коммитят прежним callback. При закрытии и смене месяца preview очищается. Клавиатурный outline и отметка today сохранены.

Календарь использует неподвижный материал в активной ячейке с проявлением240ms и reduced-motion/forced-colors fallback. Вертикальная физика меню не переносится на двумерную сетку и не изменяется; отдельный spring, moving-2D engine или новая формула optical scale не создаются. Пять frozen sources/manifest сохранены. Карта: Date Field1169:437→FOSDatePicker; existing Rows material→REUSE FosGlassMaterial; DayPicker Day→EXTEND FosDatePickerDay; consumer только DEV-пилот.

Новый сценарий до реализации подтвердил отсутствие линзы (RED). После реализации полный44/44PASS Chromium/Firefox/WebKit/touch:40 прежних и4 новых проверки, две роли/пять ширин/axe/zoom. В первом расширенном прогоне четыре новых assertions имели неверный вложенный locator; исправлен только поиск ячейки. Единичная потеря keyboard focus в WebKit не воспроизвелась в целевом прогоне, полном44 и десяти отдельных повторах10/10; первопричина не подтверждена, product assertions не менялись. Свежие hover/return/selected PNG и видео — в существующей галерее. На этом этапе G-04 и rollout ещё были OPEN; последующее решение Owner и merge закрыли их.

## CURRENT: приёмка и подключение к заказам

Owner принял компактный календарь и линзу: «да, отлично применяй». G-04 закрыт для этого варианта. Общий OrderComposer подключает FOSDatePicker для желаемого срока Client/Manager без DEV-флагов. Новые, повторные и редактируемые черновики используют один компонент. Клиентский согласованный срок и все даты OrderDetail сохраняют прежний readonly FOSDateField; Manager date commit/event→«В работе» не реализуется этой задачей.

Незавершённый текст хранится отдельно от ISO-модели в OrderComposer и переживает Item editor. FOSDatePicker поддерживает optional controlled inputDraft/onInputDraftChange и синхронное onValidityChange; remount с тем же accepted ISO не стирает invalid draft. Save/Send и их обработчики блокируют неверный ввод; Manager dirty учитывает raw/invalid. Valid выбор по-прежнему передаётся через save, сохраняет YYYY-MM-DD и старые события. Новые required/min/max/past-date правила не добавлены.

Проверки rollout:52/52PASS (44 пилота+8 обычных сценариев), существующие OrderComposer/Detail/spacing/frozen58/58PASS. Два старых assertions пришлось уточнить по exact label из-за новой кнопки календаря; формат ввода и editable-display tests изменён на ДД.ММ.ГГГГ, readonly ISO assertions сохранены. Build1603modulesPASS:JS602.06KB/gzip185.12KB вместо пилотных238modules; календарная библиотека теперь входит в обычный bundle. Production30/30PASS:Chromium/Firefox/WebKit, обе роли и пять ширин;30PNG в output/playwright/fos07/production. Независимый reviewer-authored script7E482E1B73C7985E9DBA566FCF4AC11A0A85E48CEA402AE2F059766C3767DEBC исполнен root неизменно:5/5PASS Chromium/WebKit/real touch. Проверены invalid→Item roundtrip→repair same accepted date, Manager guards/save, Client Send→readonly ISO, optional empty, отсутствие pageerrors/nonGET. Review source/hashes/PNG — отдельный gate в PR. Старые результаты пилота не подменяют новые.
