# №06 — дублирование и удаление позиции

## 1. Основные прогрессы

12.11.2026. Код №06 реализован в [PR #44](https://github.com/SigmeD/flexomir_os/pull/44), в той же ветке, где согласованы правила. База — main `76948df`, [Q1–Q3 утверждены](FOS06_ITEM_ACTIONS_DECISIONS_2026-11-12.md). Это frontend на данных демосессии; приёмка результата Owner и merge открыты.

В main остаются 9 реализованных пунктов из 13. №06 подготовлен отдельно для проверки; №11 закрыт решением Owner без реализации вложений, №10/13 в backlog. Техническая реализация №06 не объявляется десятой слитой задачей до merge.

## 2. Какие задачи решались

Codex реализовал через общие OrderItemForm/OrderComposer:

- Duplicate копирует сохранённые параметры, тираж, комментарий и источник макета в новый редактор. Копия добавляется после явного валидного Add; получает отдельный ID, отмена ничего не добавляет. У неизменённой предзаполненной копии есть несохранённое состояние. У сохранённой неизменённой позиции Save disabled.
- Delete открывает существующий ConfirmDialog «Удалить позицию?». Отмена/Escape возвращают фокус к More. После удаления фокус переходит на соседнюю строку или Add. Пустой черновик допустим, отправка disabled; последняя позиция Review защищена в меню и обработчике.
- Несохранённые правки перед действием защищены существующим выбором сохранения/отмены. Invalid нельзя сохранить. Недоступный исторический макет не становится доступным после копирования. Библиотека/сам файл не удаляются.
- Для полных доступных заказов демосессии «На рассмотрении»: More → «Изменить» → тот же Composer → «Сохранить заказ» или «Отменить изменения». Client/Manager сохраняют в одну запись. ID, стадия и владелец заказа сохраняются. Компания Review readonly. Исторические строки с одним summary остаются readonly: параметры для них не выдумываются.
- Передача в1С блокирует вход в редактор и операции. `transferStarted` — локальный fixture/UI-признак, не новый API-контракт. Демонстрационная обработка pending/success/error не считается реальной передачей в1С.
- Независимый QA выявил выход из dirty copy через вложенную библиотеку и через Account/Profile; Codex подключил защиту родительского редактора. Client использует существующий диалог, Manager сохраняет существующий запрет перехода при dirty.

Карта Figma → React → потребители: [план инкремента](FOS06_IMPLEMENTATION_PLAN_2026-11-12.md). CURRENT More `1914:668`, New/Edit `1791:6130/1782:6025`, Review `1838:6511`, file `7rvIYc6yj3OA7gxmf1xJbv`. Figma context и скриншоты прочитаны, canvas не менялась. More использует существующие FosPopup и Manrope14/18/500, модальный диалог — существующий ConfirmDialog; CSS, материал и frozen engine не менялись. Новое решение Owner по доступности приоритетнее старых readonly/disabled кадров.

| Проверка Codex | Выполнено и результат |
| --- | --- |
| RED до реализации | 1 FAIL: «Дублировать позицию» disabled, сохранён исходный screenshot |
| `npm run build` | PASS; стандартное предупреждение Vite о размере JS chunk остаётся |
| `npx playwright test --config=playwright.fos06.config.ts --workers=2` | **60/60 PASS**, Chromium/Firefox/WebKit/Chromium touch; обе роли, Draft/Review, explicit save/cancel, guard, lock, invalid artwork, keyboard/focus и пять ширин |
| `npx playwright test tests/order-compose.spec.ts tests/fos05-save.spec.ts tests/next-scope-a.spec.ts tests/order-detail.spec.ts tests/m7-layouts.spec.ts tests/fe11-frozen-contract.spec.ts --workers=2 --reporter=line --output=output/playwright/fos06/regression-final` | **142/142 PASS** на Chromium1440/390; включая полные пять ширин в сценариях и frozen manifest |
| Production preview5187 | **6/6 PASS**: Client copy и Client/Manager delete/cancel/empty, 1440 и настоящий touch320; дополнительно **4/4 PASS** Review copy→save→delete→save, Client/Manager ×1440/touch320, без pageerror/API requests; сборка без DEV-панели |
| Независимый QA | **PASS WITH RISKS**, 8 самостоятельных browser-сценариев и 21 проверка модели; две P1 исправлены и перепроверены, открытых блокирующих findings нет |

Визуально просмотрены Figma More и фактическое меню1440: те же 248×160, три строки по48, типографика14/18/500; keyboard focus ring — существующее состояние. На320 подтверждение и пункты помещаются, horizontal overflow отсутствует. PNG пяти ширин — `output/playwright/fos06/green/artifacts/` (menu/delete), production — `output/playwright/fos06/production/artifacts/`. В automated suite проверен axe для диалога. Это проверка затронутого поведения/общих компонентов, не полная Figma pixel-parity или Owner-приёмка M8.

Артефакты: `output/playwright/fos06/green/results.json`, `production/results.json`, `production/review-results.json`, `regression-final/`, `independent-qa.md`, независимые JSON/scripts/PNG в том же каталоге. Они локальные и ignored; другому checkout доступны CI artifacts после запуска workflow. Новый набор добавлен в существующий Artwork/Order workflow, snapshots не обновлялись. Проверенный код: `745c2252fd04038815c7eb71b136dee879b90222`; SHA256 production JS `index-CqBUkk5U.js`: `bbbfe913a6065cff0176e0b34d5fdba151aa1888c9614d357bf1c1b5fd226783`; локальный manifest — `output/playwright/fos06/verification-manifest.json`. Последующие изменения только Markdown не переиздают эти результаты как новый запуск приложения.

Ранние прогоны на dev-сервере во время редактирования исходников получили reload/HMR и промежуточные failures; после стабилизации версии весь указанный набор прошёл заново. Новый тест переключения ролей исправлен: экран при переключении создаётся заново, заказ нужно открыть из списка. Финальные 60/60 и142/142 относятся к стабильной версии. Общий suite целиком в №06 не повторялся; восемь известных baseline failures из [№05](FOS05_REPEAT_ITEM_SAVE_2026-11-12.md) не объявляются исправленными.

## 3. Что в процессе

Codex: локальные проверки и независимая QA завершены, CI кода745c225 — 7/7 SUCCESS. PR #44 готов к review. FUNCTIONAL PASS, TECHNICAL focused PASS, VISUAL affected-component review; OWNER ACCEPTANCE / MERGE OPEN.

CI кода `745c225` — **7/7 SUCCESS**. Ссылки относятся к проверенному коду, не означают приёмку Owner:

| GitHub workflow | Результат |
| --- | --- |
| [NavigationDrawer GL-02B QA](https://github.com/SigmeD/flexomir_os/actions/runs/43205673932) | SUCCESS |
| [SidebarNav GL-02A QA](https://github.com/SigmeD/flexomir_os/actions/runs/43205673314) | SUCCESS |
| [GL-03 Compact Glass Pill Tabs React QA](https://github.com/SigmeD/flexomir_os/actions/runs/43205673420) | SUCCESS |
| [HeaderAction QA](https://github.com/SigmeD/flexomir_os/actions/runs/43205673527) | SUCCESS |
| [Orders Core UI QA](https://github.com/SigmeD/flexomir_os/actions/runs/43205673358) | SUCCESS |
| [Accepted Artwork and Order Spacing QA](https://github.com/SigmeD/flexomir_os/actions/runs/43205673309) | SUCCESS |
| [FE-S03 M7 UI QA](https://github.com/SigmeD/flexomir_os/actions/runs/43205673330) | SUCCESS |

После фиксации результатов дополнительный коммит меняет только Markdown. Если GitHub запускает проверки повторно на документационном head, их текущий статус смотрят в PR #44; он не подменяется успешными проверками кода выше. До merge нужен актуальный CI/review и поручение Owner.


Owner: приёмка интерфейса №06 и поручение на merge после review, срок не назначен. Полная M8 визуальная приёмка отдельная. Алексей: backend/API/ACL/версии/конкурентные изменения и события1С — после согласования серверного контракта, срок не назначен. Проверка NVDA/VoiceOver и физических устройств не выполнялась.

## 4. Основные договорённости

- Передать один небольшой инкремент в PR #44 с кодом, тестами и LIVE docs — Codex, после QA; без автоматического merge.
- Сохранить `dirty && valid`, существующие правила дат/комментариев, source order и библиотеку — Codex, в этой поставке.
- Синхронизировать существующий Drive CURRENT и статус GitHub, сохранив параллельные записи M8 — Codex, при передаче PR.
- №10/13 не возвращать в текущую реализацию; №11 не считать реализованными вложениями; PR #40 и CMP не смешивать — Codex/Owner, в этой итерации.
