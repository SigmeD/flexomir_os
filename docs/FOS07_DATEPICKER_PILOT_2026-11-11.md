# №07 — Glass DatePicker: анализ, контракт и пилот

Статус: IMPLEMENTATION AUTHORIZED / PILOT OWNER OPEN (G-04). Owner 11.11.2026 поручил начать B2.5–B2.8; решение о распространении требуется после показа пилота. База свежего origin/main — 94b6587, ветка feat/fos07-glass-datepicker-pilot. Обычная папка, новый worktree не нужен.

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
- [x] LIVE docs обновлены в той же ветке, открыт [Draft PR #41](https://github.com/SigmeD/flexomir_os/pull/41); ссылка и визуальные доказательства подготовлены для Owner. G-04 остаётся OPEN до решения. До приёмки не подключать обычные поля и не сливать эксперимент как принятый rollout.

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

G-04 OWNER OPEN: приёмка пилота, обычный rollout и merge экспериментальной задачи ожидают решения Owner. Глобальная визуальная приёмка M8 и API/production-ready не заявляются.

## Уточнение Owner: компактный календарь /11.11

По Screenshot_1 Owner поручил убрать повторный заголовок «Желаемый срок» и нижнюю инструкцию. Они удалены из popup; подпись самого поля и доступное имя dialog сохранены. Закрытие перенесено в строку месяца, календарь лишён отдельной строки заголовка и подвала; hit targets44px и существующая клавиатура сохранены. Для узкой области при zoom навигация переносится без наложения на месяц. Изменение продолжает Draft PR #41; это не приёмка G-04 и не разрешение rollout.
