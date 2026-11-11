# Select: подсказка только в поле

Owner11.11 принял формулировку и поручил реализацию: строку «Выберите форму» убрать из раскрытого списка глобально; оставить в пустом поле, сохранить label «Форма» и реальные варианты «Все статусы». Источник замечания — Screenshot_3.png. База origin/main3317d50, PR37MERGED; ветка fix/select-placeholder-options. DatePicker07 отложен этой узкой правкой.

## Карта и контракт

CURRENT Figma Select1148:311/292 Default/Focus/Error/Readonly → FOSSelect → FOSSelectPopup: EXTEND только список props.items для FosPopup. Closed-field label/44px/placeholder и native proxy options REUSE. Потребители: Shape/Material Client+Manager OrderItemForm, Manager company, OrdersComponentsLab. emptyIsPlaceholder=false → CompanyOrders status/sorting сохраняют реальные empty options. GlassSelect хранит placeholder отдельно в Trigger; его semantic options не являются подсказками и сохраняются. Новые components/CSS/material/motion не нужны.

CURRENT1148:311 перечитан через Figma session372db390; статическая геометрия сохраняется, новое прямое решение Owner уточняет содержимое open list. Canvas не меняется. Основной путь: открыть пустое поле → увидеть только варианты → выбрать → закрыть на rest; reset возвращает placeholder только в поле. Keyboard Home/typeahead/touch, required validation, controlled rejection и optional empty filters сохраняются.

## План проверки

1. RED: required и optional placeholder отсутствует среди popup options, остаётся в trigger/native proxy. Проверить Shape/Material/Company обоих кабинетов.
2. GREEN: фильтр emptyIsPlaceholder + empty id только при передаче видимых items в существующий FosPopup.
3. Обновить прежние assertions «disabled placeholder row» на отсутствие строки; не ослаблять required/reset/native FormData/semantic empty contracts.
4. Targeted четыре browser/input проекта, re-audit/native bridge, hover/frozen regression, production и screenshots. Независимый review перед merge.
5. LIVE docs в одном PR, CI фактическогоhead, merge по standing поручению Owner, main/origin и Drive sync. Пользовательские Screenshot_1/2/3 и4stash сохранить; worktree не создавать.

Документация проверена10.11, следующая ревизия24.11; общая уборка не требуется. Полная M8 screen acceptance и backend/API вне задачи. Статус результатов/CI фиксируется после фактической проверки.

## Выполненная проверка

- RED: новый test требовал0 placeholder options и получил1 на исходной реализации; ошибка воспроизведена до runtime change.
- Минимальный GREEN: одна строка filter при передаче visible items в существующий FosPopup. Нового JSX/component/CSS нет.
- Re-audit128/128PASS Chromium/Firefox/WebKit/touch: native events, required, FormData/reset, controlled acceptance/rejection, scroll/keyboard/media, прежние semantic rows и frozen contract.
- FOS04 targeted12/12PASS: required placeholder отсутствует до/после выбора, reset и invalid focus прежние; Shape/Material и Company; настоящий optional empty filter selectable после значения.
- Hover regression13PASS/3conditionalSKIP: field preview/keyboard, реальное empty value, GlassSelect и Manager пять ширин. SKIP только по виду ввода.
- Build PASS238modules. Production UI15/15checks в трёх движках: оба кабинета/Shape+Material, Manager company без placeholder row, реальные Все статусы выбираются после В работе.12viewportPNG1440×900 в output/playwright/select-placeholder/production, results.json и capture.cjs рядом.
- Независимый reviewer-authored script A0B2EAC3276EDCD2C443C322DDBD61C3BE25D0BCDD4A06DBFBC00F4DD9C2BBB3 исполнен root неизменно (child browser EPERM):5/5PASS Chromium/WebKit/real touch. Reset открытого popup, required/optional native FormData, keyboard/typeahead и реальный CompanyOrders filter. Results output/playwright/select-placeholder/independent-results.json. Review source/PNG/JSON — отдельный gate.
- Frozen fingerprints5/5 неизменны. Полная M8 visual acceptance не заявляется: field master/Owner reference проверены адресно, browser font rendering/viewport отличаются от пользовательского crop. UI-content contract выполняется: label и placeholder в поле, только реальные пункты в popup.

Съёмка production сначала потребовала дождаться existing close-on-rest перед повторным открытием и использовать Promise.allSettled для законно отменённых CSS animations; после исправления только capture script полный15-case прогон PASS. Это не изменение приложения или ослабление продуктовых assertions.

CI и merge ещё не выполнены на момент этого snapshot; фактические head/SHA/checks фиксируются в PR и существующем Drive CURRENT после поставки. Owner approval scope и standing merge-поручение уже получены.
