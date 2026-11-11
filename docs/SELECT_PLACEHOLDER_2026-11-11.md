# Select: подсказка только в поле

## Доставка

[PR #38](https://github.com/SigmeD/flexomir_os/pull/38) MERGED 11.11.2026, merge `26768f9f019563092c17488def2070bf34f26e71`; проверенный head `a13cd0bbbdb7162e1c0527aa96552cda0f62b995`.
CI 3/3 SUCCESS: [Orders](https://github.com/SigmeD/flexomir_os/actions/runs/43059507333), [Hover](https://github.com/SigmeD/flexomir_os/actions/runs/43059507183), [M7](https://github.com/SigmeD/flexomir_os/actions/runs/43059507218). После merge повторены build 238 modules PASS, production 15/15 и frozen fingerprints 5/5. Remote head удалён; existing Drive CURRENT синхронизирован.
Owner поручил глобальное подключение. Полная M8 visual acceptance и backend/API вне этой поставки. Следующий UI-блок — DatePicker07/G-04. [Текущее состояние](PROJECT_STATE.md).

Owner11.11 принял формулировку и поручил реализацию: строку «Выберите форму» убрать из раскрытого списка глобально; оставить в пустом поле, сохранить label «Форма» и реальные варианты «Все статусы». Источник замечания — Screenshot_3.png. Историческая база разработки — origin/main3317d50 после PR37; ветка fix/select-placeholder-options.

## Карта и контракт

CURRENT Figma Select1148:311/292 Default/Focus/Error/Readonly → FOSSelect → FOSSelectPopup: EXTEND только список props.items для FosPopup. Closed-field label/44px/placeholder и native proxy options REUSE. Потребители: Shape/Material Client+Manager OrderItemForm, Manager company, OrdersComponentsLab. emptyIsPlaceholder=false → CompanyOrders status/sorting сохраняют реальные empty options. GlassSelect хранит placeholder отдельно в Trigger; его semantic options не являются подсказками и сохраняются. Новые components/CSS/material/motion не нужны.

CURRENT1148:311 перечитан через Figma session372db390; статическая геометрия сохраняется, новое прямое решение Owner уточняет содержимое open list. Canvas не меняется. Основной путь: открыть пустое поле → увидеть только варианты → выбрать → закрыть на rest; reset возвращает placeholder только в поле. Keyboard Home/typeahead/touch, required validation, controlled rejection и optional empty filters сохраняются.

## Выполненная проверка

- RED: новый test требовал0 placeholder options и получил1 на исходной реализации; ошибка воспроизведена до runtime change.
- Минимальный GREEN: одна строка filter при передаче visible items в существующий FosPopup. Нового JSX/component/CSS нет.
- Re-audit128/128PASS Chromium/Firefox/WebKit/touch: native events, required, FormData/reset, controlled acceptance/rejection, scroll/keyboard/media, прежние semantic rows и frozen contract.
- FOS04 targeted12/12PASS: required placeholder отсутствует до/после выбора, reset и invalid focus прежние; Shape/Material и Company; настоящий optional empty filter selectable после значения.
- Hover regression13PASS/3conditionalSKIP: field preview/keyboard, реальное empty value, GlassSelect и Manager пять ширин. SKIP только по виду ввода.
- Build PASS238modules. Production UI15/15checks в трёх движках: оба кабинета/Shape+Material, Manager company без placeholder row, реальные Все статусы выбираются после В работе.12viewportPNG1440×900 в output/playwright/select-placeholder/production, results.json и capture.cjs рядом.
- Независимый reviewer-authored script A0B2EAC3276EDCD2C443C322DDBD61C3BE25D0BCDD4A06DBFBC00F4DD9C2BBB3 исполнен root неизменно (child browser EPERM):5/5PASS Chromium/WebKit/real touch. Reset открытого popup, required/optional native FormData, keyboard/typeahead и реальный CompanyOrders filter. Results output/playwright/select-placeholder/independent-results.json. Review source/PNG/JSON завершён READY WITH RISKS.
- Frozen fingerprints5/5 неизменны. Полная M8 visual acceptance не заявляется: field master/Owner reference проверены адресно, browser font rendering/viewport отличаются от пользовательского crop. UI-content contract выполняется: label и placeholder в поле, только реальные пункты в popup.

Съёмка production сначала потребовала дождаться existing close-on-rest перед повторным открытием и использовать Promise.allSettled для законно отменённых CSS animations; после исправления только capture script полный15-case прогон PASS. Это не изменение приложения или ослабление продуктовых assertions.

Доставка завершена после Owner-поручения, независимого review и CI фактического head; SHA и проверки указаны в разделе «Доставка».
