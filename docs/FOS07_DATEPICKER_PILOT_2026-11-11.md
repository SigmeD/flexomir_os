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

- [ ] RED: tests/fos07-datepicker.spec.ts и playwright.fos07.config.ts. Открытие RU grid на отдельном /fos07-datepicker.html, выбор ISO, readonly/disabled и min/max. Запустить Chromium, сохранить исходный FAIL отсутствующего пилота.
- [ ] GREEN: src/components/ui/fos-date-picker.tsx + date-only.ts + fos-date-picker.css. DayPicker9.14.0; existing FOSInput/FosPopup/FosButtonRoot. Форма и focus lifecycle в adapter, без изменения frozen или FOSDateField.
- [ ] Стенд: fos07-datepicker.html + src/Fos07DatePickerLab.tsx + scoped lab CSS. Client/Manager fixtures, native comparison, readonly/disabled/error/bounds/controlled rejection/reset. DEV-only отдельная Vite entry; App и обычные формы не меняются.
- [ ] Проверки: Chromium/Firefox/WebKit/touch; ISO/invalid/leap/year crossing/minmax/keyboard/focus/outside/required/FormData/reset; пять ширин1440/1024/768/390/320, zoom200%, reduced-motion/forced-colors и axe. Снимки и видео сохранять в output/playwright/fos07.
- [ ] npm run build; действующие date/order regressions и fingerprints5/5. Независимое review перед сдачей. Для новых browser API обращаться к Context7.
- [ ] LIVE docs обновить в той же ветке/PR; показать ссылку и визуальные доказательства Owner. G-04 остаётся OPEN до решения. До приёмки не подключать обычные поля и не сливать эксперимент как принятый rollout.

## B2.8 — критерии приёмки

FUNCTIONAL: выбор одной даты всеми видами ввода, корректные bounds/readonly/disabled/required/reset/controlled rejection, нет изменения даты от навигации или Escape.
TECHNICAL: build, browser QA, axe, frozen fingerprints; статус CI только по фактическому head.
VISUAL: закрытое поле сверяется с1169:437; открытый popup — изолированный кандидат на существующей поверхности. Owner выбирает принять/доработать/оставить native. Полная визуальная приёмка M8 и backend-ready не заявляются.

