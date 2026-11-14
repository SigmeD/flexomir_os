# Flexomir OS — текущий план

Обновлено 14.11.2026. Каноническая очередь — [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit); факты поставок — [PROJECT_STATE](PROJECT_STATE.md). Ревизия структуры 13.11, следующая 27.11; ниже актуальная очередь и текущий проверяемый инкремент.

| Этап | Состояние | Следующий шаг и ответственный |
| --- | --- | --- |
| M4–M7 | Основные композиции и сквозные сценарии реализованы на fixtures | Использовать существующие компоненты и [карту экранов](SCREEN_MAP_M4_2026-11-06.md) |
| M8 | Принятые U03/U04 и U06 rollout сохранены; строки, шрифты и Date Field объединены. DEV glass Pilot имеет ровный контур, но реальное поле под PDF-панелью остаётся скрытым | Owner: выбрать визуальное решение для PDF-области или геометрии окна после [диагностики](UI_UNIFICATION_2026-11-13.md#documentpreview-реальные-поля-под-стеклом--14112026), затем оценить новый кандидат; перенос frozen источника и merge только после приёмки. Полная M8/D09 и UA-03/04 отдельно |
| M9 | Зависит от готового согласованного API | Алексей: backend/ACL/1С; frontend: подключение клиента и интеграционный QA |

## Открытая очередь

### Проверка Owner: подписные бланки и края DocumentPreview · 14.11

1. [x] SignedDocumentsSection подключён к существующему FosSummaryRow с прежними размерами, именами, native disabled и действиями; состояния обеих ролей21/21 на пяти ширинах. PDF/download/delete/доступность и независимый QA проверены.
2. [x] По поручению Owner подготовлен **тестовый дубль** DocumentPreview: сначала точная копия0pixel diff, затем расширение SVG filter region. После повторной проверки выровнены свет, рамка и тень внешней оболочки только кандидата; единая шахматная подложка подтвердила баланс четырёх сторон (разброс2,74). DEV `documentGlass=pilot`; оригинал/frozen и production сохранены. [Стенд с парой реальных кадров](http://127.0.0.1:5173/tests/fixtures/document-glass-review.html) готов; pilot suite14PASS/10SKIP, независимый18/18, build/optics PASS. **Owner visual OPEN**, перенос в оригинал пока не разрешён.
3. [x] Дополнительный read-only аудит унификации выполнен: фактические consumers → реестр → общие owners → пропуски/дубли/KEEP/OPEN. [Полный факт](UI_UNIFICATION_2026-11-13.md#дополнительный-аудит-унификации--14112026); независимый reviewer подтвердил UA-01 обеих ролей.
4. [x] По Screenshot_3 проведён повторный аудит шрифтов: SignedDocuments Row+Copy+ArtworkThumbnail, FosSectionHeading в Compose/Detail/Conversation/Signed/Artwork; UA-02 tablet-расхождение закрыто. RED→GREEN, build и focused114/114 PASS; [точная причина](UI_UNIFICATION_2026-11-13.md#повторный-аудит-типографики-по-screenshot_3--14112026). Glass original/frozen не менялись.
5. [x] UA-01: OrderItemRow Client/Manager использует FosSummaryRow overlay/card вместо локального border-only hover. `article` и нативная кнопка сохранены; RED→GREEN, три движка row30/30, FOS06 15/15, build PASS. [Причина и контракт](UI_UNIFICATION_2026-11-13.md#ua-01--строка-позиции-и-общий-fossummaryrow--14112026). UA-03/04 пока OPEN candidates, не утверждённый общий redesign; сроки не назначены. Merge отдельно.
6. [x] Screenshot_4: readonly согласованный срок и даты Detail переведены с native FOSDateField на общий FOSDatePicker readOnly. Формат ДД.ММ.ГГГГ, серый readonly фон и скрытый ISO proxy проверены; cross-browser/touch4/4, соседние30/30+27/27, independent60/60. [Контракт](FOS07_DATEPICKER_PILOT_2026-11-11.md#повторный-аудит-readonly-полей--14112026). Новый CI head и Owner visual отдельно.

### CI PR #49 завершён; далее приёмка M8

Codex, 14.11: CI проверенного head `b027ce7` — **9/9 SUCCESS**; M7 выполнил все девять наборов и сохранил artifact. Прежний общий лимит job подтверждён annotation/log, увеличение только budget в `eab307a` проверено. Полный факт — в существующем [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit), [контракт](UI_UNIFICATION_2026-11-13.md#продолжение-ci--14112026). Далее — полная M8/D09 у Owner и назначение исполнителя ручных устройств/A11y; сроки не утверждены. Merge отдельно. Последующие Markdown-коммиты не выдавать за новый прогон приложения; CI нового head сверять отдельно в [PR](https://github.com/SigmeD/flexomir_os/pull/49/checks).

### U08: закрытие прежних Select snapshot FAIL

Owner: «правильно нужно искать причину», затем «так а как пофиксить?». Причина подтверждена в одинаковом браузере: baseline `03238af` содержит движущуюся линзу даже в закрытом popup; принятое изменение PR #37 (`3317d50`) убрало её. Невидимый backdrop/SVG слой менял растеризацию текста окружающего стенда. Обратимые DOM-пробы воспроизводят старый и новый кадр во всех шести closed-сценариях; CSS/геометрия/фактические шрифты текста прежние. Восстановление линзы — только диагностическая мутация, в приложение её не возвращать.

1. [x] Сравнить исторический код и текущий в одном окружении без switch/worktree; найти первый изменивший поведение merge. Доказательства: output/ui-unification/select-cause/{commit-probe,matrix,compositing-confirmed}.json.
2. [x] Проверить все 14 кадров: шесть open совпадают точно; устарели шесть closed и два focus, до которых исходные тесты не доходили после первого FAIL.
3. [x] `9a0603c`: прежние 14 PNG+SHA сохранены; behavioral closed/selection/Escape guard и отрицательный возврат obsolete lens добавлены. Обновлены только closed6/focus2; open6 byte-identical, maxDiffPixels40/threshold.15/fullPage прежние. Targeted12/12, независимые causal/semantic/negative проверки PASS.
4. [x] Targeted38/38, motion/material24/24 в трёх движках, touch4/4, независимый QA и full990PASS/8SKIP/0FAIL из998. Первый full989/8/1 и repeat5/5 сохранены отдельно, причина единичного timeout не выдумана. `403f06f` сохраняет диагностический trace+PNG на первом FAIL при retries0; фактическая intentional probe проверена отдельно. UI/frozen без изменений. Синхронизация в том же PR; merge отдельно.

### Owner: единая подсветка строк по эталону «Заказы»

Новый запрос Owner со Screenshot_1/2: эталон — подсветка строки заказа (Image#3). Общий FosSummaryRow уже существует; расхождение создают два CSS-профиля card/flat, сохранённые в U05 для прежнего вида. Новое поручение заменяет это ограничение: один профиль hover/pressed/focus для всех интерактивных Company/Order/Layout/Support строк обеих ролей. Геометрия, данные и переходы сохраняются; readonly/disabled не подсвечиваются.

Выполнено в `40a15f1`: RED 7 + keyboard 1 → общий Orders highlight; второй профиль удалён. Targeted 21/21, регрессия 78/78 и независимый QA 3/3 PASS, build PASS; before/after и исходные скриншоты сохранены. [Единый контракт](UI_UNIFICATION_2026-11-13.md#единая-подсветка-по-эталону-orders). CI сверять по текущему PR head. Последующая приёмка U06 и его rollout описаны ниже. Копии пользовательских PNG в ignored evidence сохранять.

### Issue #21 · U05–U09 · после принятия контрольных вариантов

Owner13.11: «принято продолжай» — U03/U04 OWNER ACCEPTED, разрешено продолжение в той же ветке/PR#49. Head перед продолжениемfbd88ce; CI3/3SUCCESS. Main3b9a0aa не изменился. Frozen/business/№10/13 и отдельный merge gate сохраняются.

- [x] U05: общий FosSummaryRow/Copy, четыре доменных адаптера, readonly variant; RED→GREEN,120PNG до/после без отличий.
- [x] U06 pilot: карта владельцев motion, существующие контроллеры REUSE; одна настройка action profile достигает3consumers (6PASS). Внешний preset только DocumentPreviewDialog,9PNG без отличий. API style override найден независимым QA и закрыт во внешнем адаптере.
- [x] U06 family: Owner принял DocumentPreview pilot ответом «да, принято»; `b689487` переносит остальные незамороженные consumers. 135 PNG/computed пар exact, targeted 24/24, независимый повтор 5/5, build/optics/frozen PASS. Прямые frozen Rows и optics lab — KEEP.
- [x] U07 перенесённых consumers: row CSS-копии и прежние inline material props удалены; compatibility hooks, drift checks, геометрия и обоснованные CSS-контуры сохранены. Frozen/raw optics lab исключения проверены по usages.
- [x] U08 проверка текущего переноса: U06 targeted 24/24, 135 image/computed pairs exact, независимый повтор 5/5, build/optics/frozen PASS. Исходный U06 full980/8/6 сохранён в истории. После причинного U08 исправления closed/focus references полный контрольный suite990/8/0; touch4/4 отдельно. Полная M8 и исторические одиночные timing-наблюдения остаются отдельно.
- [x] U09 текущая передача: итог полного прогона и OPEN, контракт/LIVE docs/Drive/issue/PR синхронизированы. Это не закрытие полной M8 и не разрешение merge. Принятый material gate не открывать повторно.

Выбран минимальный общий presentation слой вместо универсальной domain-row или CSS-only объединения: первый сохраняет данные/права у адаптеров и устраняет повтор структуры; CSS-only оставил бы четыре JSX-копии. Обоснованная геометрия Card/flat сохраняется вариантами; подсветка у них теперь одна, по Orders. Source mapping: ClientRow1189:984 → CompanyRow(compact/flat); OrderRow685:195 → OrderCard(regular/card + static); LayoutRow1313:2182 → LayoutRow(regular/flat + ArtworkThumbnail); SupportRequester → SupportTicketRow(regular/flat), обе роли. Все → FosSummaryRow/FosSummaryRowCopy, props: slots/density/surface/native attrs, title/meta tags и compatibility classes; никаких бизнес-данных в primitive.

### U06: выполнение после приёмки пилота

Owner: «да, принято» после описания U06 и ссылки на DocumentPreview comparison. Пилот принят; повторно этот gate не запрашивать. База продолжения: `3676502`, свежий origin/main `3b9a0aa`, тот же PR #49. Цель — сохранить утверждённые optics/motion/DOM и вынести параметры потребителей в уже существующий FosMaterialSurface.

Карта до JSX: Sidebar Nav634:511 → SidebarNav (`navigation`/reference, controlled top/travel/callback) → оба кабинета; GL03 → GlassPillTabs (`segment`/reference) → status filters; Action835:259/Header1953:4168 → FosActionMaterial (`action`, round/quiet/header variants) → Header/Plus/Secondary; popup masters1914 → FosPopupSurface (`popup`) → Drawer/Account/More/Select; Account3042:2806 → AccountMenu (`account-trigger`) → desktop footer; Date1169 → FosDatePickerDay (`date-cell`) → общий календарь; existing demo panel → OrderDemoWorkspace (`demo-panel`). Все EXTEND существующий preset owner, native semantics и текущие CSS REUSE. Frozen FosPopupRows и GlassMaterial/motion — KEEP; GlassMaterialLab — KEEP как сырой стенд параметров, не экранный consumer.

Выбор: расширить принятый внешний adapter. Дубли preset на каждом экране оставили бы проблему; перенос внутрь frozen engine нарушил бы freeze. Публичные optical/style overrides остаются закрыты. Для Sidebar разрешить только конкретную геометрию top и существующий travel observer, без второго RAF/масштабирования. Существующие action controllers уже имеют один источник; менять их ради миграции материала не требуется.

1. [x] Снять before PNG/computed: девять сценариев, обе роли, пять размеров и три движка; 135 пар до/после exact.
2. [x] RED runtime contract: 3 FAIL / 1 PASS; отдельный inherited-key bypass RED 1 FAIL → own-property guard. Native props/children и navigation travel сохранены.
3. [x] Перенести семь адаптеров в принятый общий source (`b689487`), удалить прежние inline optical copies. Targeted 24/24 PASS, независимый повтор 5/5 PASS; обоснованные контуры CSS не удалять.
4. [x] Регрессия существующих navigation/popup/action/date/document suites, build/optics/frozen и независимый QA. Full 980/8/6 с точной классификацией; touch 4/4 отдельно. Известные OPEN и непринятая полная M8 сохраняются.
5. [x] Обновить тот же контракт, реестр, HANDOFF, Drive CURRENT/CMP/клиентский статус и PR; readback подтверждён. CI сверять по новому head, merge отдельно.

### Принятые U01–U04

Owner поручил реализацию 13.11.2026. База `3b9a0aa424d98df709c724125b6aba83bef5ad38`, обычная ветка `refactor/ux-ui-unification-20261113`. Используется навык writing-plans; план ведётся здесь, без второго CURRENT.

Статус: app/tests9f95198, Owner accepted на headfbd88ce (CI3/3SUCCESS), NOT MERGED. [Исторические причины, RED/GREEN и доказательства](UI_UNIFICATION_2026-11-13.md). Выполненные шаги не возвращаются в очередь.

Figma ClientRow634:316 всё ещё Body14/20/400; более новое прямое поручение Owner / issue #21 задаёт контрольный title Card16/22/600. Это явное различие источников, не утверждение синхронизации Figma. Canvas не менять. Обе главные вкладки Drive прочитаны; screenshot/video из сообщения и отдельный MD-аудит пока не доступны как файлы, baseline воспроизводится на текущем SHA.

1. U06 pilot принят, rollout и проверка U07–U09 текущего переноса выполнены в [PR #49](https://github.com/SigmeD/flexomir_os/pull/49). Причина шести snapshot FAIL доказана и references актуализированы в U08. Далее — CI актуального head и полная M8/D09; исторические единичные timing-наблюдения сохранены. Baseline не менять без причины и проверки.
2. Owner/PO: определить состав дубликата обращения, действие менеджера по согласованному сроку, публикацию клиенту и событие «В работе». Не реализовывать неподтверждённые решения.
3. №10/13 — отдельный backlog до backend/API Алексея и подтверждения Owner/PO. №11 исходной итерации снят без реализации; позднейшие решения COMM-DOCS учитываются отдельно. [Основания исходных 13 пунктов](NEXT_SCOPE_13_2026-11-10.md).
4. После появления API — согласовать fixtures, ошибки и capabilities; подключить frontend, проверить реальные права, read, файлы и переходы. Сервер и 1С не реализуются в нашем потоке.

Сроки не назначены. PR #46 и №06 завершены; повторного разрешения на их merge не требуется. PR #40 и CMP — отдельный объём, перед выбором задачи проверить их актуальное состояние.

## Поставка

Один инкремент — обычная ветка от свежего origin/main и один PR с кодом, проверками и относящимися к нему документами. Worktree только с согласием Owner. До merge нужны актуальные CI/review и предусмотренные Owner gates; после — подтверждение SHA, remote head и синхронизация существующего Drive CURRENT. [Правила](../AGENTS.md).

Материал и физика FE11-v0.2 заморожены. Принятое hover v0.3 уточняет adapter/presence. Сохранение даты, публикация и запуск в 1С — разные события. Новые статусы и права не выводятся из Figma.
