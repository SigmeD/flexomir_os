# №06 — дублирование и удаление позиции

## 1. Основные прогрессы

12.11.2026. [PR #44](https://github.com/SigmeD/flexomir_os/pull/44) слит squash по прямому поручению Owner «вливай в main/origin», merged_at12:13:20UTC. Продуктовый main — `6d3fa83e14d1581017ae19a4451ec0181e9d126a`, фактический проверенный PR head — `7c5b017228dbef58f7bb85d6211257b1519556f0`, CI **7/7 SUCCESS**. База инкремента — main76948df. [Q1–Q3](FOS06_ITEM_ACTIONS_DELIVERY_2026-11-12.md) утверждены; реализация работает на данных демосессии.

Из13пунктов **10 реализованы и слиты** (01/02/03/04/05/06/07/08/09/12), №11 закрыт без реализации вложений в этой итерации, №10/13 в backlog. №06 не остаётся в активной очереди. Полная M8 визуальная приёмка и серверная интеграция отдельно.

## 2. Какие задачи решались

Codex реализовал через общие OrderItemForm/OrderComposer:

- Duplicate копирует сохранённые параметры, тираж, комментарий и источник макета в новый редактор. Копия добавляется после явного валидного Add; получает отдельный ID, отмена ничего не добавляет. У неизменённой предзаполненной копии есть несохранённое состояние. У сохранённой неизменённой позиции Save disabled.
- Delete открывает существующий ConfirmDialog «Удалить позицию?». Отмена/Escape возвращают фокус к More. После удаления фокус переходит на соседнюю строку или Add. Пустой черновик допустим, отправка disabled; последняя позиция Review защищена в меню и обработчике.
- Несохранённые правки перед действием защищены существующим выбором сохранения/отмены. Invalid нельзя сохранить. Недоступный исторический макет не становится доступным после копирования. Библиотека/сам файл не удаляются.
- Для полных доступных заказов демосессии «На рассмотрении»: More → «Изменить» → тот же Composer → «Сохранить заказ» или «Отменить изменения». Client/Manager сохраняют в одну запись. ID, стадия и владелец заказа сохраняются. Компания Review readonly. Исторические строки с одним summary остаются readonly: параметры для них не выдумываются.
- Передача в1С блокирует вход в редактор и операции. `transferStarted` — локальный fixture/UI-признак, не новый API-контракт. Демонстрационная обработка pending/success/error не считается реальной передачей в1С.
- Независимый QA выявил выход из dirty copy через вложенную библиотеку и через Account/Profile; Codex подключил защиту родительского редактора. Client использует существующий диалог, Manager сохраняет существующий запрет перехода при dirty.

Карта Figma → React → потребители: [выполненный план и карта компонентов](FOS06_ITEM_ACTIONS_DELIVERY_2026-11-12.md). CURRENT More `1914:668`, New/Edit `1791:6130/1782:6025`, Review `1838:6511`, file `7rvIYc6yj3OA7gxmf1xJbv`. Figma context и скриншоты прочитаны, canvas не менялась. More использует существующие FosPopup и Manrope14/18/500, модальный диалог — существующий ConfirmDialog; CSS, материал и frozen engine не менялись. Новое решение Owner по доступности приоритетнее старых readonly/disabled кадров.

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

CI фактического PR head `7c5b017` — **7/7 SUCCESS**; это отдельные повторные прогоны после документационного коммита, а не подстановка результатов кода745c225:

| GitHub workflow | Результат |
| --- | --- |
| [NavigationDrawer GL-02B QA](https://github.com/SigmeD/flexomir_os/actions/runs/43208725478) | SUCCESS |
| [SidebarNav GL-02A QA](https://github.com/SigmeD/flexomir_os/actions/runs/43208726389) | SUCCESS |
| [GL-03 Compact Glass Pill Tabs React QA](https://github.com/SigmeD/flexomir_os/actions/runs/43208725516) | SUCCESS |
| [HeaderAction QA](https://github.com/SigmeD/flexomir_os/actions/runs/43208725422) | SUCCESS |
| [Orders Core UI QA](https://github.com/SigmeD/flexomir_os/actions/runs/43208725563) | SUCCESS |
| [Accepted Artwork and Order Spacing QA](https://github.com/SigmeD/flexomir_os/actions/runs/43208726152) | SUCCESS |
| [FE-S03 M7 UI QA](https://github.com/SigmeD/flexomir_os/actions/runs/43208725579) | SUCCESS |

После merge выполнены **новые** проверки на main6d3fa83:

| Проверка после merge | Результат |
| --- | --- |
| `npm run build` | PASS,1603 modules; тот же JS index-CqBUkk5U.js и SHA256 выше |
| FOS06, четыре browser/touch проекта | **60/60 PASS**, start12:13:31.752UTC, duration104588.601ms, unexpected0/skipped0/flaky0 |
| Frozen contract Chromium1440/390 | **2/2 PASS** |
| Production Review copy→save→delete→save | **4/4 PASS**, Client/Manager×1440/touch320, pageerror/API requests отсутствуют |

Дерево поставки main6d3fa83 совпадает с проверенным PR head: `6b6fc96a330761b548e36195557acceafb4f52bb`. Последующие документационные коммиты меняют только Markdown. Артефакты после merge: `output/playwright/fos06/post-merge-results.json`, `post-merge-production-results.json`, `post-merge-frozen/`. Основной green/results.json также содержит последний post-merge прогон; отдельные post-merge JSON сохраняют его явно. Эти файлы локальные/ignored. Проверки приложения повторно не запускались ради последующей синхронизации Markdown.

Remote head `docs/scope-decisions-20261112` удалён автоматически; fetch --prune и пустой git ls-remote подтверждены. Локальная ветка сохранена. Существующий Drive CURRENT обновлён после merge с сохранением параллельной очереди M8. Текущая документационная правка устраняет оставшиеся pre-merge статусы в локальных сводках; код, тесты, workflows, snapshots, нормативные SRS/Scope и Figma не меняются. Проверяются ссылки/якоря, согласованность статусов и состав diff.

## 3. Что в процессе

Frontend-инкремент №06 завершён и слит; ожидание его merge закрыто. Owner/UX: полная M8 визуальная приёмка, сроки не назначены. Алексей: backend/API/ACL/версии/конкурентные изменения и события1С — отдельный согласованный контракт, сроки не назначены. NVDA/VoiceOver и физические устройства не проверялись. Восемь прежних ошибок полного набора из отчёта №05 не объявляются исправленными.

## 4. Основные договорённости

- Считать №06 слитым frontend-инкрементом — Codex/Owner,12.11.2026. Поручение merge не подменяет полную M8 приёмку и готовность backend.
- Сохранить утверждённые dirty && valid, общие даты/комментарии, source order и библиотеку — Codex, выполнено в PR #44.
- Синхронизировать локальные LIVE docs с GitHub и существующим Drive CURRENT — Codex, по текущему поручению «обнови документацию».
- №10/13 оставить в backlog; №11 не считать реализованными вложениями; PR #40 и CMP вести отдельно — Codex/Owner, текущая итерация.
- Новую рабочую ветку создавать от свежего origin/main; слитую ветку не переиспользовать — Codex, следующая задача.


## №06 — согласованные правила дублирования и удаления позиции — основания и проверки

12.11.2026. Статус: **UX RULES APPROVED / MERGED / POST-MERGE PASS**. Owner ответил: «1 — да; 2 — редактор; 3 — да». Все три решения ниже утверждены. Команды подключены через общие OrderItemForm/OrderComposer; [поставка и QA](FOS06_ITEM_ACTIONS_DELIVERY_2026-11-12.md), PR #44 слит по прямому поручению Owner, main6d3fa83. Полная M8 приёмка отдельно. Повторение целого завершённого заказа — другое, уже работающее действие.

## Подтверждённые границы

- [SRS CURRENT](https://docs.google.com/document/d/1EwjqQ3z_lO2lyDCQHhm-NIiDxgZzPrKOXAWR3tC-C4M/edit), FR-ORD-ACTOR-004: Client и Manager могут править доступный заказ, включая позиции, до интеграции с 1С. «На рассмотрении» допускает редактирование по правам; это не общий запрет всех правок вне черновика.
- После инициирования передачи в 1С, включая pending/retry, Client readonly. Правки Manager после передачи требуют согласованного процесса с 1С; отдельная несинхронизированная версия запрещена. Пункт №06 не создаёт такого API или исключения.
- Отправляемый заказ содержит 1..N позиций; пустой ещё не отправленный composer уже поддерживается, Send при 0 позиций disabled. Существующие dirty/valid, защита несохранённых изменений, общие даты и комментарий заказа сохраняются.
- Права на backend, Company isolation, версии и конкурентные изменения принадлежат контракту Алексея. React-disabled не является серверной проверкой прав.

## Решения Owner

Owner выбрал рекомендованные варианты Q1–Q3. Альтернативы «сразу добавить копию» и «запретить последнее удаление в обоих статусах» не выбраны.

| ID | Область | Утверждённое правило | Статус |
| --- | --- | --- | --- |
| Q1 | Доступность Duplicate/Delete Item | Client и Manager в доступных им заказах «Черновик» и «На рассмотрении», только до начала передачи в 1С. После инициирования передачи оба действия этого сценария недоступны | APPROVED |
| Q2 | Создание копии | Новый ID; скопировать сохранённые параметры, тираж, комментарий и доступный источник макета, открыть копию в редакторе. В состав добавлять только после явного сохранения; отмена не добавляет копию. Недоступный исходник остаётся недоступным, valid не обходится | APPROVED |
| Q3 | Удаление и последняя позиция | Подтверждение «Удалить позицию?». Пустой черновик допустим, Send disabled; в «На рассмотрении» последнюю позицию удалить нельзя. Удаление позиции не удаляет сам файл/макет из библиотеки | APPROVED |

Несохранённые изменения не должны теряться: использовать действующий guard сохранения/отмены; недоступный макет и другие invalid не обходят правила №05. Q2 означает отдельный редактор копии и явное сохранение, без автоматического добавления invalid. Исходная позиция и общие сведения заказа сохраняются.

## Объём после решения

Решения Owner определили сценарий. [План и карта общих компонентов](FOS06_ITEM_ACTIONS_DELIVERY_2026-11-12.md) выполнены, CURRENT Figma states прочитаны. [Реализация и QA](FOS06_ITEM_ACTIONS_DELIVERY_2026-11-12.md) находятся в PR #44. Новый движок меню, файловый lifecycle и CMP-рефакторинг не добавлены. Утверждение UX не является готовностью API или серверных ACL; PR #44 MERGED по прямому поручению Owner, CI head7c5b017 7/7SUCCESS; post-merge проверки PASS. Полная M8 приёмка отдельно.

Frontend на fixtures может проверить переходы, ID, copy/cancel, подтверждение удаления, последнюю позицию, dirty/valid и регрессию обеих ролей. Серверная операция и окончательная проверка прав требуют согласованного API Алексея; изменения SRS/Scope не вносятся по умолчанию.

## Новое решение по остаткам скоупа

Owner 12.11: **№11 закрыт в текущей итерации без реализации вложений** — будущая доработка всего компонента поддержки. №10/13 оставлены в backlog до backend/API Алексея. №06 слит в PR #44. Из 13 пунктов 10 реализованы и слиты, №11 закрыт решением о границе итерации без реализации, №10/13 в backlog. Закрытие №11 не означает появления функции вложений.


## Карта компонентов №06 — основания и проверки

| CURRENT Figma → React | Состояния и потребители | Действие |
| --- | --- | --- |
| More 1914:668 → OrderItemForm / OverflowMenu | Сохранённая позиция, Client/Manager | EXTEND: duplicate/delete, dirty guard; frozen popup без изменений |
| New/Edit Item 1791:6130 / 1782:6025 → OrderItemForm | Новая предзаполненная копия, invalid/dirty | REUSE: явное Add; недоступный макет не становится доступным |
| Composer 1782:6074; Review 1838:6511 → OrderComposer / OrderDetail | Draft/Review обеих ролей | EXTEND: доступный полный локальный заказ до передачи; readonly для исторических summary |
| Существующий ConfirmDialog | Подтверждение удаления и несохранённые изменения | REUSE: focus/Escape; последнее удаление Review запрещено |
