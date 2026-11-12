# Flexomir OS — состояние проекта

CURRENT /13.11 — PR #46 MERGED по прямому поручению Owner «сделай merge в main/origin». SHA приложения `479c59188b5ee0b2bda4dd3150b75803cf3d3886`, проверенный PR head `ea3f2b858d661592948c76760be6459c6c2bde28`, CI **6/6 SUCCESS**. Дерево squash совпадает с PR head. Новые post-merge build PASS, smoke **8/8**, bundled production1440/320 **2/2 PASS**, pageerrors=[]. Remote head удалён автоматически, локальная feat/comm-docs-20261112 сохранена; рабочая ветка main. Последующая синхронизация Markdown — только метаданные, не новый код приложения. Duplicate payload, Owner visual/D09, physical devices и production API/read/ACL/1С остаются OPEN. [PR #46](https://github.com/SigmeD/flexomir_os/pull/46), [отчёт](COMM_DOCS_2026-11-12.md). Все pre-merge CURRENT ниже — история. Ревизия документов11.11/следующая25.11 сохраняется.

Owner /13.11 разрешил merge PR46 в main/origin. Проверка результата и фактический merge SHA — в связанном PR и Drive CURRENT; pre-merge fixes и свежие проверки — [единый отчёт](COMM_DOCS_2026-11-12.md). Дублирование/production/API/ACL и полная visual приёмка остаются отдельно. Датированные pre-merge статусы ниже — история этапов.

CURRENT /13.11 — продолжение [draft PR #46](https://github.com/SigmeD/flexomir_os/pull/46): общий CRUD своих unread сообщений через Glass context menu, блокировка при read и фиксация прежней переписки при входе в Work. Новые Work сообщения редактируются/удаляются до read. Support Save+More видны сразу, чистый Save disabled; follow-up без флага, удаление тикета очищает свой контекст. Дублирование OPEN до уточнения содержимого копии. CRUD59 PASS/1 native SKIP, regression114/114, build/optics/production2/2 PASS, независимая QA7/7 PASS WITH RISKS; полная communication matrix и test-only mobile locator fix подробно в [отчёте](COMM_DOCS_2026-11-12.md). API/ACL/Owner visual/merge OPEN, frozen KEEP. Предыдущие результаты12.11 ниже исторические.

CURRENT /12.11 — Owner corrections в [draft PR #46](https://github.com/SigmeD/flexomir_os/pull/46): delete выбранного local fileID; header file-add и empty-only загрузчик; REUSE HeaderAction(save) в тикете → список поддержки с сохранённой историей; shared composer с short tap/hold/release, crossfade и без pointer-рамки textarea. D03/D08 уточнены Owner, D06 разрешает local delete. QA четырёх правок:130 PASS/10 native SKIP, regression58/58, build/optics/production2/2 PASS, независимый LIVE PASS WITH RISKS, [отчёт и ручной чек-лист](COMM_DOCS_2026-11-12.md). Production API/ACL/хранение/1С, D09 и merge отдельно OPEN; frozen FE11 KEEP.

№06 слит в [PR #44](https://github.com/SigmeD/flexomir_os/pull/44) по поручению Owner «вливай в main/origin». Продуктовый main — `6d3fa83e14d1581017ae19a4451ec0181e9d126a`, проверенный PR head — `7c5b017228dbef58f7bb85d6211257b1519556f0`, CI **7/7 SUCCESS**. После merge выполнены новые проверки: build PASS, №06 **60/60**, frozen **2/2**, production Review **4/4**. [Контракт и доказательства](FOS06_ITEM_ACTIONS_DELIVERY_2026-11-12.md).

Из 13 пунктов **10 реализованы и слиты** (01/02/03/04/05/06/07/08/09/12), **№11 закрыт в этой итерации без реализации вложений**, **№10/13 в backlog** до backend/API Алексея. Полная M8 приёмка, согласованный срок менеджера и события1С остаются отдельными вопросами. PR #40 и CMP не входят в эту поставку.

Актуализировано 12.11.2026. Общая ревизия была 11.11; следующая — 25.11.2026. Очерёдность — [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit), рабочая очередь — [DELIVERY_PLAN](DELIVERY_PLAN.md). SHA поставки указывает на приложение; последующая синхронизация Markdown не является новым изменением frontend.

## Что работает сейчас

- Client и Manager используют общие экраны, формы, меню, кнопки и демонстрационные данные. Доступны заказы, позиции, компании менеджера, макеты, поддержка и профиль.
- Переход из профиля в «Заказы» сохраняет действующий guard несохранённых изменений.
- Принятые отступы Manager Composer и статус в 8 px от H1 подключены на обычных экранах. Состояния ArtworkSource empty/local/library/unavailable/HELP доступны в обоих кабинетах без DEV-флага.
- Account, «Ещё», FOSSelect, GlassSelect и мобильная навигация используют общий hover v0.3. Hover меняет только визуальную цель; выбор, маршрут и фокус прежние. Leave/keyboard возвращают реальную selection; pending commit защищён.
- Подсказки «Выберите…» видны только в пустом поле Select. В открытом списке нет placeholder-строки; реальные варианты «Все статусы» сохраняются.
- Общие OrderDateFields/FOSDateField имеют высоту 44 px и desktop-колонку до 506 px. Клиентский «Согласованный срок» readonly: в новом заказе пустой, в просмотре берётся из данных. Он не копируется из желаемого срока и не наследуется повторному заказу.
- Меню сохраняют Manrope 14/18/500; физика и материал FE11-v0.2 заморожены по [manifest](FE11_MOTION_FROZEN_V0_2.json), reference `f527bcb`.

Демосессия хранится в памяти страницы и сбрасывается при перезагрузке. Файлы не отправляются на сервер; создание заказа в 1С отключено.

## Слитые поставки

| Поставка | Результат и проверенный merge |
| --- | --- |
| [PR #33](https://github.com/SigmeD/flexomir_os/pull/33) | Profile→Orders, required Select, безопасная часть artwork warning; `b2b858f` |
| [PR #34](https://github.com/SigmeD/flexomir_os/pull/34) | Единые кнопки и принятый spacing pilot; `398a93b` |
| [PR #35](https://github.com/SigmeD/flexomir_os/pull/35) | Подключение принятых FOS03/FOS12 в обычных экранах; `bc880b1` |
| [PR #36](https://github.com/SigmeD/flexomir_os/pull/36) | Account hover и сглаживание 240 ms; `4ae4841` |
| [PR #37](https://github.com/SigmeD/flexomir_os/pull/37) | Общий hover остальных popup и стабильное CI-окружение; `3317d50` |
| [PR #38](https://github.com/SigmeD/flexomir_os/pull/38) | Placeholder Select только в пустом поле; `26768f9` |
| [PR #41](https://github.com/SigmeD/flexomir_os/pull/41) | Glass DatePicker и линза в обычном OrderComposer Client/Manager; readonly/ISO сохранены, merge `e6a04fd` |
| [PR #43](https://github.com/SigmeD/flexomir_os/pull/43) | Причины блокировки Save только у полей, dirty && valid; `76948df` |
| [PR #44](https://github.com/SigmeD/flexomir_os/pull/44) | Duplicate/Delete Item обеих ролей в Draft/Review до передачи в1С; `6d3fa83` |

PR #33–38, #41, #43 и #44 слиты. G-04 принят Owner; ожидание merge DatePicker закрыто. Полная визуальная приёмка экранов M8 остаётся отдельным gate.

## Проверки и доказательства

№06: CI фактического PR head7c5b017 — **7/7 SUCCESS**. Новые post-merge проверки на main6d3fa83: build PASS, FOS06 60/60, frozen 2/2, production Review 4/4. №05: CI кода848dbc6 — 3/3 SUCCESS; после merge76948df build PASS, FOS05 48/48, frozen 2/2. [№06](FOS06_ITEM_ACTIONS_DELIVERY_2026-11-12.md), [№05 и прежние восемь ошибок общего набора](FOS05_REPEAT_ITEM_SAVE_2026-11-12.md). Полный suite в №06 заново не выполнялся и не объявляется зелёным.

| Поставка | CI фактического head | Проверки после merge |
| --- | --- | --- |
| PR #37, head `678bf46` | 4/4 SUCCESS: [Orders](https://github.com/SigmeD/flexomir_os/actions/runs/43049308099), [Hover](https://github.com/SigmeD/flexomir_os/actions/runs/43049308060), [Drawer](https://github.com/SigmeD/flexomir_os/actions/runs/43049308061), [M7](https://github.com/SigmeD/flexomir_os/actions/runs/43049308110) | Build 238 modules; production 14 PASS / 6 условных SKIP; frozen contract 4/4 PASS |
| PR #38, head `a13cd0b` | 3/3 SUCCESS: [Orders](https://github.com/SigmeD/flexomir_os/actions/runs/43059507333), [Hover](https://github.com/SigmeD/flexomir_os/actions/runs/43059507183), [M7](https://github.com/SigmeD/flexomir_os/actions/runs/43059507218) | Новый build 238 modules; production 15/15; frozen fingerprints 5/5 |

PR #41, head `85ad6ef`: CI 5/5 SUCCESS — [DatePicker](https://github.com/SigmeD/flexomir_os/actions/runs/43085191441), [Orders](https://github.com/SigmeD/flexomir_os/actions/runs/43085191443), [Hover](https://github.com/SigmeD/flexomir_os/actions/runs/43085191433), [Artwork/Spacing](https://github.com/SigmeD/flexomir_os/actions/runs/43085191426), [M7](https://github.com/SigmeD/flexomir_os/actions/runs/43085191869). До merge: DatePicker 52/52, регрессия 58/58, production 30/30; после merge: новый build 1603 modules PASS, ordinary 2/2, production smoke 5/5 и frozen 5/5. [Контракт DatePicker](FOS07_DATEPICKER_PILOT_2026-11-11.md).

Сценарии, исходные падения и границы QA сохранены в [контракте hover](POPUP_HOVER_ROLLOUT_2026-11-11.md), [контракте Select](SELECT_PLACEHOLDER_2026-11-11.md) и [итоговом аудите M8](M8_FINAL_AUDIT_2026-11-10.md). Reviewer-authored браузерные проверки исполнял root из-за child browser EPERM; reviewer проверил JSON, hashes и PNG. Видео и результаты в output локальны и не входят в Git. Старые 520/4, 582/4 и другие прогоны не являются новыми проверками текущего HEAD.

## Что осталось открытым

- №10/13: backlog до backend/API Алексея. №11 закрыт в текущей итерации без реализации вложений; будущая доработка компонента поддержки отдельно.
- Действие менеджера для фиксации согласованного срока, публикация черновика клиенту и event→«В работе». Сохранение даты не меняет статус автоматически.
- Полная визуальная приёмка M8, Auth, реальные поиск/фильтры/сортировка и сопоставление статусов 1С; [issue #21](https://github.com/SigmeD/flexomir_os/issues/21) не закрывается техническим merge.
- M9: подключение к согласованным API, серверные права, storage и 1С. Backend и интеграция принадлежат Алексею.

Исторические remote-ветки очищены: удалены 7 refs, main не менялась; автоудаление head-веток включено. Локальные ветки и 4 stash сохранены. [Проверка Git](GIT_BRANCH_CLEANUP_2026-11-11.md); полный issue #13 остаётся открытым из-за отдельного объёма защиты main.

Следующий порядок действий — [план](DELIVERY_PLAN.md), [handoff](HANDOFF.md) и [реестр решений](DECISIONS.md).
