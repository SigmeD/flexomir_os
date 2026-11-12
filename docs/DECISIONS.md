# Flexomir OS — реестр решений и вопросов

## Owner 12.11 — остаток текущей итерации

- №11 **CLOSED FOR THIS ITERATION / NOT IMPLEMENTED**: вложения поддержки снимаются с этой итерации, доработка компонента поддержки целиком будет позже. Это не приёмка отсутствующей функции.
- №10 и №13 **BACKLOG / DEFERRED**: пока отложены; backend/API и модель файлов — Алексей, возврат по подтверждению Owner/PO.
- №06 **UX RULES APPROVED / IMPLEMENTATION PENDING**: Owner ответил «1 — да; 2 — редактор; 3 — да». [Q1–Q3](FOS06_ITEM_ACTIONS_DECISIONS_2026-11-12.md): обе роли, «Черновик»/«На рассмотрении», только до начала передачи в1С; копия с новым ID открывается в редакторе и добавляется после явного сохранения; удаление с подтверждением, пустой черновик допустим, последнюю позицию в «На рассмотрении» удалить нельзя. Сам файл/библиотека не удаляются. Код действий пока не реализован.

В активном остатке итерации только №06. Из 13 пунктов 9 реализованы, 1 закрыт решением о границах итерации, 2 в backlog и 1 ожидает реализации по утверждённым правилам.

12.11 / FOS05: Owner выбрал «А- вариант. Только у полей показывают причина блокировки». **G-02 APPROVED**: [контракт А](FOS05_REPEAT_ITEM_SAVE_2026-11-12.md) — `dirty && valid`, причины только у соответствующих полей; без сводки рядом с Save. Реализация слита в [PR #43](https://github.com/SigmeD/flexomir_os/pull/43), main `76948df`. Исторический filename не считается доступным файлом; сохранение невалидной позиции запрещено. Полная M8 приёмка отдельно. №10/13 теперь в backlog по решению выше; PR #40 и CMP отдельно.

## Актуальный индекс

Этот индекс определяет текущие статусы. Датированные записи ниже сохраняют основания решений; их прежние OPEN/DEV-only/ожидание merge не задают очередь после последующих подтверждений Owner.

| Решение | Текущий статус и основание |
| --- | --- |
| Hover/G-01 | Принят Account, затем общий adapter для popup; PR #36/#37 MERGED. 240 ms presence, прежние frozen physics/material. Desktop Sidebar не менялся |
| Placeholder Select | Owner подтвердил отсутствие строки в popup при сохранении пустого поля и semantic empty; PR #38 MERGED |
| Кнопки/G-05, отступы03, ArtworkSource12 | Приняты и подключены; PR #34/#35 MERGED. Полная M8 visual acceptance отдельно |
| Save UX/G-02 | APPROVED12.11: А, причины только у полей; dirty && valid сохраняется. CI кода 3/3 SUCCESS; Owner разрешил merge 12.11. Факт merge и полная M8 приёмка учитываются отдельно |
| Duplicate/Delete Item/G-03 | UX RULES APPROVED12.11, Q1–Q3; реализация и серверный контракт/ACL отдельно |
| DatePicker/G-04 | ACCEPTED: «да, отлично применяй» после компактного варианта и линзы. Общий DatePicker подключён к желаемому сроку Client/Manager; PR #41 MERGED e6a04fd, CI head85ad6ef 5/5 SUCCESS; readonly/ISO/бизнес-правила сохранены |
| Item↔Library/G-06, файлы/G-07 | BACKLOG / DEFERRED; вернуться после backend/API Алексея и подтверждения Owner/PO |
| Вложения поддержки/G-08, №11 | CLOSED FOR THIS ITERATION / NOT IMPLEMENTED: будущая доработка компонента поддержки, не активный блокер |
| Согласованный срок менеджера / event→«В работе» | OPEN; клиентское readonly-отображение уже реализовано, сохранение даты не меняет статус автоматически |
| Git | 7 исторических origin-веток удалены после проверки; auto-delete включён. Защита main и локальная уборка — отдельный объём issue #13 |

Standing поручение Owner подключать и сливать принятые задачи действует после нужных review/CI/приёмки. Наша зона — frontend; backend/ACL/storage/1С принадлежат Алексею. Физика и материал FE11-v0.2 остаются FROZEN. [Состояние и поставки](PROJECT_STATE.md), [очередь](DELIVERY_PLAN.md).

## История подтверждений и подробные ограничения

## Owner11.11 — подсказка Select только в поле

По Screenshot_3 Owner попросил убрать «Выберите форму» из открытого Select глобально. Согласованное понимание: placeholder остаётся в пустом поле, label «Форма» и настоящие «Все статусы» сохраняются; Owner ответил «приступай». FOSSelectPopup исключает только placeholder items при отрисовке popup, native proxy/FormData/required/reset остаются. Это уточнение открытого списка1148:311, без новых masters/CSS/motion/API/ACL. [Карта и QA](SELECT_PLACEHOLDER_2026-11-11.md). Применяется standing поручение подключать/сливать принятую задачу после review/CI; полная M8 приёмка отдельно.

## Owner11.11 — принятое hover-поведение подключить ко всем dropdown

Прямое поручение: «точно такое же компонент поведения, как реализован, можешь подключить к остальным выпвадающим спискам?» Разрешён перенос принятого Account v0.3 через общий FosPopup на More/FOSSelect/GlassSelect/NavigationDrawer, без отдельного эффекта/компонентных копий. Для real-selection popup временная цель не меняет значение/маршрут/aria-selection и возвращается на leave/keyboard; на время pending commit hover не ретаргетит линзу. CSS presence240ms и frozen physics/material прежние. Это заменяет прежнее Account-only ограничение interaction adapter и старые selection-only hover описания popup; desktop Sidebar не меняется. Standing поручение подключать и сливать принятые задачи действует после необходимых review/CI. [Карта и доказательства](POPUP_HOVER_ROLLOUT_2026-11-11.md). Новых ACL/API/файловых решений нет; full M8 acceptance OPEN.

## Owner11.11 — сгладить hover; матовость формы проверена

После приёмки Account-сценария Owner попросил «анимацию плавнее ... при наведении мыши». В общем Account-only presentation добавлен один240ms presence для opacity прежней линзы и проявления optical target. Steady1.043, physics/material/frozen5 прежние; transient display теперь плавный. Keyboard/touch/action не задерживаются. Дополнительно Owner попросил перепроверить матовость: computedblur20px/white.72 и контрольная сетка доказали работающийblur, материал не менялся. [Доказательства](FOS02_ACCOUNT_PREVIEW_2026-11-11.md). Разрешение относится к Account hover, не глобальному frozen-профилю других popup.

## Owner11.11 — Account hover-сценарий принят, подключение/merge по standing поручению

После показа пилота, объяснения hover/keyboard и полного сценария Owner уточнил «т.е. линза появляется при наведении?», получил подтверждение и ответил «Принято». Принят описанный Account hover-сценарий: линза только enabled hover, действие только поclick/Enter/Space/tap, leave/disabled/keyboard очищают preview. По действующему «все принятые задачи подключай и сливай в main/origin» вариант подключён обычным Client/Manager/production, merge послеCI. Это Account-исключение из старой selection-only политики, не изменение frozen physics/material/5файлов и не whole-screen M8 visual acceptance. [Результаты](FOS02_ACCOUNT_PREVIEW_2026-11-11.md). Предыдущие DEV-only/G-01 OPEN записи ниже исторические.

## Owner11.11 — G-01: разрешён DEV-пилот B

На прямой вопрос «DEV-пилот v0.3 только Account Menu с прежней физикой?» Owner ответил «давай попробуем». Разрешён вариант B [контракта](FOS02_ACCOUNT_PREVIEW_2026-11-11.md): DEV-only Account hover-preview, прежние frozen material/physics, action только по явной активации. Это отдельное разрешение experimental interaction adapter, не изменение пяти frozen-файлов и не приёмка/rollout. [План реализации](FOS02_IMPLEMENTATION_PLAN_2026-11-11.md). Предыдущая запись G-01 OPEN ниже — история подготовки.

## FOS02 /11.11 — G-01 подготовлен, решение OPEN

После «продолжай работу по этапу» подготовлен [Account-only DEV preview контракт](FOS02_ACCOUNT_PREVIEW_2026-11-11.md). Рекомендация B: экспериментальнаяv0.3 interaction только Account, прежние shared material/physics. A: сохранитьv0.2; C: глобальный hover отложить. Варианты не утверждены. CURRENT Figma3042:2806 и manifest явно selection-only; actions selectedId=never не позволяет подменить hover прежним выбранным действием. Реализация после отдельного Owner G-01. PR35/03/12MERGEDbc880b1, CI3/3SUCCESS.

## Owner11.11 — приёмка и подключение FOS03/FOS12, merge разрешён

FOS12 наf509eba принят ответом «Принято». После Screenshot_1 Manager DEMO-002 Owner потребовал «так подключи принятый вариант», затем «все принятые задачи подключай и сливай в main/origin» и «от main/orgin создавай ветку на следующую задачу». Это разрешает rollout FOS03/FOS12 и merge PR #35 после проверок, заменяя прежний запрет rollout/merge ниже. Непринятые02/05/06/07/10/11/13 этим решением не утверждены. [Подключение и QA](ACCEPTED_UI_ROLLOUT_2026-11-11.md).

## Owner11.11 — начать FOS12

После описания следующей задачи Owner поручил «приступакай к реализации». Разрешён один frontend DEV-пилот empty/local/library/unavailable; визуальная приёмка и rollout отдельно. [Контракт](FOS12_ARTWORK_STATES_PILOT_2026-11-11.md), [результаты](FOS12_REPORT_2026-11-11.md).

REUSE ArtworkSource/LocalFileControl/FOSAction/picker; default reference. CURRENT634:445 содержит empty, отдельных Library/unavailable variants нет: OWNER VISUAL OPEN. Dirty&&valid, frozen FE11, storage/API и пункт13 не менялись. Разрешение merge PR33/34 не относится к этой новой поставке.

## Owner 11.11 — объединить текущие PR

Поручение «Сливай pr» разрешает merge PR #33 и #34 после необходимых проверок. PR #33 слит в main b2b858f. Это не разрешение rollout DEV-отступов, изменения frozen motion, нового файлового scope или объявления production-ready. Последующее сообщение Owner сохраняет очередь: устранить причину WebKit FAIL, совместимость/QA, затем пилот12 и файловые контракты.

## Owner 11.11 — отступы нового заказа менеджера

Owner визуально принял положение подписи «Черновик» и отступы на экране нового заказа менеджера в FOS03. Принят DEV-вариант `composeSpacing=pilot` на версии интерфейса `6007e60`. Ранее согласованный размер подписи 14/12 px сохраняется. Объединение PR и распространение пилота остаются отдельными шагами. [Аудит FOS03](FOS03_HEADER_AUDIT_2026-11-10.md).

## Owner 11.11 — единое семейство кнопок

Owner визуально принял унификацию кнопок сообщением «принято» 11.11.2026 на версии `6007e60`. Кнопки действий обеих ролей используют нейтральную палитру и общий отклик на короткий клик. Plus и круг «Сохранить» используют отрисовку и анимацию Secondary, подпись «Сохранить» остаётся неподвижной. Строки, навигация, поля и меню используют общий нативный компонент со своими контроллерами. Ограничения Frozen FE11-v0.2 действуют. [Отчёт](FOS08_09_REPORT_2026-11-10.md).

## Owner 10.11 — принять размер статуса общим компонентом

После сверки DS Status Default14 / Status Compact12 Owner поручил «давай принимай общим компонентом». Принято: общая роль status в PageHeader и один responsive size token, применённые к OrderComposer/OrderDetail обеих ролей. Secondary/context не меняются. Это принятие размера общего компонента, не всего экрана/spacing rollout и не merge. Line-height18 сохранён: исходный вопрос и решение касались размера; Figma AUTO остаётся отдельным расхождением.

## Owner 10.11 — приблизить подпись к заголовку

Исторический этап: визуальная приёмка DEV-пилота и общий размер статуса подтверждены решениями 11.11 выше; rollout остаётся OPEN.

По второму screenshot Owner поручил поднять «Черновик» к «Новый заказ». Реализация — opt-in вариант общего PageHeader в текущем DEV Manager pilot, без подъёма Company и без локального translate/negative margin. Приёмка всего пилота и распространение остаются OPEN; desktop 14px Figma vs 12px React зафиксировано отдельно, переопределения типографики этим перемещением не делаются.

## Owner 10.11 — подпись черновика

После просмотра пилота Owner поручил заменить подпись «Черновик менеджера · приватно в демосессии» на «Черновик». Применяется в существующем OrderComposer без изменения отступов, приватности или действий. Это не визуальная приёмка всего пилота.

## Owner10.11 — FOS03 контрольная композиция

Историческое разрешение на пилот. Последующие решения 11.11 выше закрыли его визуальную приёмку и палитру кнопок, сохранив отдельный gate распространения FOS03.

Owner «приступай к следующему этапу» разрешил reference03 и QA после представленной очереди; это не merge PR33. [Source map/альтернативы](FOS03_MANAGER_SPACING_PILOT_2026-11-10.md): реальные DS V2 section-gap32/block-md24, существующие shared controls. **OWNER VISUAL OPEN:** нормализация gap перед rollout. Save05, hover02, calendar07, palette08/09, manager agreed-date/publication и API этим поручением не утверждены.

## Owner10.11 — следующий scope01–13

Поручение: разобрать ТЗ `D:/downloads/FLEXOMIR_OS_NEXT_SCOPE_13_CODEX_SDLC_TZ_2026-11-10.md`, декомпозировать и приступить. [План и зависимости](NEXT_SCOPE_13_2026-11-10.md). Разрешена автономная работа внутри этапа; это не разрешение merge, frozen FE11 changes, API/storage/ACL и rollout визуальных пилотов.

G-02 **OPEN**: Save Item dirty-only с валидацией по клику либо прежнее dirty&&valid с причиной. Пока сохраняется действующий dirty&&valid, отсутствующий исторический файл не объявляется существующим. G-01 hover-vs-frozen, G-03 Delete Item, G-04 DatePicker, G-05 neutral action palette, G-06 Item↔Library lifecycle, G-07 file contracts и G-08 Support attachments остаются за указанными в ТЗ владельцами. Новый frontend-план не превращает эти кандидаты в утверждённые требования.

## Исторический статус — 10.11.2026

PR #29, #30 и #31 уже слиты; последняя продуктовая база — main a400b9d, проверенный head PR #31 — f991bd77. Owner отдельно разрешил merge PR #31. Датированные записи ниже сохраняют основания решений, а упомянутые в них ветки, PR и результаты относятся к указанному моменту. Текущая очередь — [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit).

Клиентское readonly-поле согласованного срока и общие размеры дат реализованы. Действие менеджера для фиксации срока и точный переход в «В работе» не определены. Общая роль меню Manrope 14/18/500 и frozen FE11 v0.2 остаются в силе; технический merge не означает полную визуальную приёмку или готовность API/1С.

## Owner10.11 — единый размер даты / статус обсуждается

- **APPROVED, реализовано в PR31:** Owner указал Client New как эталон размера и поручил перепроверить расхождения и унифицировать. OrderDateFields переиспользует FOSDateField1169:383/433, desktop до506px на колонку, tablet/mobile адаптивны; общий контроль44px. Это новое указание выше старого Client readonly720px frame1838:6565; Figma не менялась.
- **APPROVED, отображение реализовано после уточнения Owner:** «Согласованный срок» виден клиенту в New/Detail, всегда readOnly. New пустой; Detail показывает существующее agreedDate либо пустое значение. Дату не копировать из desired/requested и не наследовать новому повторному заказу. Переиспользованы FOSDateField и OrderDateFields; новый backend-контракт не вводился.
- **OPEN, не реализовано:** действие менеджера для фиксации договорённости и точный переход статуса. CURRENT E2E различает сохранение и «Создать заказ» в1С; event→«В работе» пока не утверждён. Не добавлять скрытую смену статуса при сохранении даты и не выдавать disabled demo-команду за работающую интеграцию.

## M8 / 10.11.2026 — проверка после merge FE11

- Источник поручения — Owner «давай следующий этап», затем «продолжи»; объём — финальный M8 audit issue #21, не разрешение merge или расширение MVP.
- Сохранены принятые 14/18/500, frozen f527bcb, shared Glass/GL03 и responsive action dock. Расхождения со старыми screen instances не повод откатывать их.
- Support FOS Detail 634:8137 parent=Поддержка; Manager 2606:22577 parent=Мои обращения. Исправлен только Client detail label в существующем PageHeader, nav.back/focus сохранены. New Ticket candidate не переосмыслен.
- Browser title приведён к текущему имени проекта Flexomir OS; история лаборатории остаётся в Git.
- Manager draft2569:24648/24851/25041 содержит согласованный срок/Provide-to-Client в Figma-кандидате. Редактирование/фиксация менеджером и private publication остаются OPEN; в Manager composer они не добавлены. Клиентское readonly-отображение согласованной даты реализовано отдельным уточнением Owner, описанным выше.
- Auth design, названия Клиенты/Компании, production status/API/1С/ACL, реальный storage/Support async остаются OPEN по прежним владельцам. Технический аудит не означает полную pixel parity или приёмку продукта. [итоговый аудит M8](M8_FINAL_AUDIT_2026-11-10.md).

## Предыдущие checkpoints (история)

## Owner decision 10.11.2026 — принятый FE11 popup pilot

- **APPROVED:** Owner «да подтверждаю» принял показанный пилот и action-adapter, разрешив этапы D/E в одном PR #30. Это заменяет прежний OPEN этого пилота; merge отдельно.
- **APPROVED:** общая Manrope14/18/500, не 13/18/600 из исходного задания; один token с navigation/popup aliases. Identity, field labels/body и trigger roles отдельные.
- **ACTION CONTRACT:** нет фиктивного selected/origin. Callback сразу, первая линза даёт feedback в активированной строке; переход может размонтировать host. Hover/focus не выбирают строку.
- **SELECT CONTRACT:** native change сразу и один раз, popup закрывается по actual rest/geometry. Escape/outside не откатывают committed value. Readonly сохраняет FormData и пропускает required validation; disabled не отправляется.
- **ROLLOUT:** один public FosPopup; Drawer получает данные/nav wrapper, GlassSelect сохраняет compound semantic rows через listbox-only slot. Все реальные form consumers перешли на канонический single-string FOSSelect; historical native multiple/size API не обещается совместимым.
- **FIGMA:** адресно синхронизированы menu style, Navigation/Account/More masters и Select opening contract с датированным supersession; старая история не переписана. Полная динамическая оптика определяется frozen runtime, не эффектом Figma.
- **UNCHANGED:** reference `f527bcb`,5 frozen files+manifest, API/backend/ACL/1С. Приёмка всех экранов, merge и release отдельно. [отчёт FE11](FE11_POPUP_REAUDIT_2026-11-10.md).

## Предыдущие решения (заменённые формулировки не задают текущую очередь)

## Owner scope 09.11.2026 — post-freeze QA fixes

Owner «приступай» разрешил следующий этап: диагностику и исправление оставшихся More/FOSAction сбоев, повтор QA/CI и подготовку PR к приёмке. Исправления ограничены popup focus/dismissal lifecycle; More не переносится визуально на frozen v0.2. Reference `f527bcb`, формулы/параметры/frozen files остаются без изменений. Приёмка интегрированных экранов и merge не следуют автоматически из этого поручения.

## OWNER APPROVED / FROZEN 09.11.2026 — FE11-v0.2

Прямое подтверждение Owner: «да теперь все верно, подтверждаю». Утверждён selection-only motion стенда v0.2; Git reference `f527bcb`, [freeze manifest](FE11_MOTION_FROZEN_V0_2.json). Контроллер перенесён в общий Rows без изменения frame/material/physics; Drawer/Account/GlassSelect подключаются через свои семантические адаптеры с отдельным QA. Нативный FOSSelect и исключённый Order More не мигрируются автоматически. Приёмка стенда не является Owner acceptance всех экранов. Любая правка frozen implementation — только по отдельному разрешению после причины/влияния/предложения; локальные CSS-обходы и копии запрещены.

## CURRENT 09.11.2026 — FE-11 motion scenario and freeze policy

Owner заменил hover-preview сценарием selection-only: hover/focus не двигают линзу; click/Enter/Space/tap ретаргетируют её; scale связан с реальным геометрическим перекрытием. Кандидат v0.2 живёт только на стенде. Последовательность обязательна: стенд → явное подтверждение → общий React-компонент → проверка каждого адаптера → QA → version/reference/Git SHA + `OWNER APPROVED / FROZEN`. После freeze любое изменение engine/GlassLens/параметров/материала/реакций/типографической трансформации требует отдельного разрешения Owner; сначала причина/влияние/предложение. CSS-обходы и отдельные копии запрещены. Сейчас approval OPEN, не FROZEN. [Источник и реестр](FE11_POPUP_PILOT_2026-11-09.md).

## FE-11 / Owner direction 09.11.2026 — phased popup migration

Новое ТЗ `FLEXOMIR_FE11_UNIFIED_LIQUID_GLASS_POPUPS_2026-11-09.md` задаёт Sidebar neutral material/lens как эталон и требует hover/focus preview в popup без изменения выбранного раздела до click/tap. Drawer — первый пилот; Account и Select мигрировать после Owner visual approval пилота (C–D). Order More исключён, ConfirmDialog не превращать в меню. Старые белые DS/FOS меню не подменяют новое Owner-направление; masters не изменены. Реализован opt-in pilot, приёмка OPEN: [FE11 pilot](FE11_POPUP_PILOT_2026-11-09.md).

## OPEN 09.11.2026 — Typography audit

- **TY-05 / OWNER VISUAL GATE:** Figma Account Menu commands are Manrope 15px SemiBold. The shared FE-11 popup currently applies 15/20 Medium to menuitem/option roles. Keep FE-11 appearance and lens unchanged in this typography slice; decide whether Account Menu uses the Figma weight or the shared popup weight during the existing FE-11 visual review.
- **TY-08 / OWNER DESIGN REQUIRED:** Profile-photo and Layout-upload subsection headings currently use 15/22 (Profile is 14/22 on mobile). The current Profile Figma examples are WIP, and the approved masters do not establish whether these are a distinct subheading role or Card Heading 16/22. Keep current values pending approval.
- **CONFIRMED TYPOGRAPHY EXCEPTIONS:** Support thread uses FOS Body SM 12/18 in FOS V2 Support Detail `2364:10455`; Sidebar/GlassPill lens weights and optical text scale remain governed by the accepted Liquid Glass contract. They were preserved.
- **IMPLEMENTED CANDIDATE:** scoped Manrope family token; PageHeader/Profile and Composer empty-copy corrections. Technical QA does not imply Owner visual acceptance. See [audit and evidence](TYPOGRAPHY_AUDIT_2026-11-09.md); no merge.

## OPEN 09.11.2026 — FE-DEBUG-2026-11-09

- **FE-07 / OPEN — PO + Owner + backend contract:** Should a base fixture such as `DEMO-001` become editable, and under which owner/company/transfer/version rules? Current FE-S01/FE-S02 contract says base fixtures are read-only; frontend keeps it disabled.
- **FE-11 / APPROVED 09.11.2026 — Owner visual direction:** Owner supplied `Стилистика формы.png` as the shared popup reference and requested one reusable Liquid Glass surface across popup menus, including typography, while preserving each menu's actions and dismissal behavior. `FosPopupSurface` implements the shared translucent neutral material, radius, stroke/shadow and Manrope-family font for NavigationDrawer, AccountMenu, OverflowMenu and GlassSelect. Drawer placement follows `Форма бургер меню.png`. Final visual acceptance of the rendered result remains OPEN.
- **FE-10 / NOT_REPRODUCED:** On the current baseline, mobile Manager detail → select active `Заказы` returns to the list and closes Drawer; no route change made.
- FE-01 saves/discards only current unsaved item changes in the local demo draft. Persistence, atomic failure, browser reload/back, idempotency and real server save remain OPEN under API/PO contracts.
- **FE-09 / FIXED + TECHNICAL QA:** the isolated SidebarNav lab passed while the real route transition failed because each screen shell mounted a fresh lens at its destination (`travel target=0`). Preserve the existing approved material/spring and pass the previous selected section to the destination shell; no motion engine or visual master changed. Technical visual-travel regression is in `tests/manager-orders.spec.ts`; Owner visual acceptance remains OPEN.

Source evidence: CURRENT Figma AppShell `637:180`, Sidebar Account Footer `3123:1214`, Drawer `1962:3834/3854`, Overflow `1914:655..676`; task brief `D:/downloads/FLEXOMIR_OS_CODEX_FRONTEND_FIXES_2026-11-09.md`. No SRS, scope, API, Figma or product behavior was modified.

## OPEN 09.11.2026 — FE-ACTION-08NOV visual acceptance

- Implementation candidate follows current FOS V2 Action `835:259` and Work Dock `3143:1219` / adapter `3144:2851`, with existing Liquid Glass material and existing shared React controls. Figma is unchanged.
- Confirmed local behavior: only existing paired Primary+More groups opt into responsive docking; singles remain inline. Profile's separate Save+More family and measured geometry remain unchanged.
- QA is technical only: build, full Playwright, responsive geometry and component behavior pass (see [PROJECT_STATE](PROJECT_STATE.md) and [HANDOFF](HANDOFF.md)).
- Code/test/documentation delivery: [Draft PR #28](https://github.com/SigmeD/flexomir_os/pull/28); implementation/test checkpoint `f94f55b`; not merged.
- **OPEN:** Owner visual acceptance of FOSAction treatment and responsive paired-action placement. Do not mark screen/component accepted or merge before the Owner gate.

## OPEN 09.11.2026 — FE-PROFILE-01 visual acceptance and product actions

- **Implemented candidate:** common Client/Manager Account Menu + Profile Settings, based on CURRENT Figma nodes recorded in [Component Registry](COMPONENT_REGISTRY_2026-11-06.md) and [SOURCES](SOURCES.md). Functional and responsive QA passes; this does not imply Owner visual acceptance.
- **Owner instruction 09.11.2026:** on the unsaved-profile navigation dialog, `Да` saves and continues to the requested screen; `Нет` discards the current profile draft and continues. Closing the dialog leaves the user on Profile.
- **OPEN:** Owner acceptance of the WIP screen; approved semantics for Company Settings, Logout and Profile More; real profile persistence/API and authorization contracts remain outside frontend scope.
- **Decision boundary:** leave those menu actions disabled and keep profile persistence demo-only until Owner/PO/backend contract confirms behavior. FE-ACTION-08NOV is now tracked separately in the CURRENT entry above.

## 08.11.2026 — FE-DEBUG-02 / issue #25: centered workspace

- **APPROVED direction (Owner):** center the constrained page workspace within the area to the right of Sidebar; keep header, filters, list, and actions in one shared content container. See [issue #25](https://github.com/SigmeD/flexomir_os/issues/25).
- **IMPLEMENTATION candidate:** keep the existing React `max-width:1440px` as the standard layout limit and center it with automatic inline margins. It is a validated code baseline, **not an approved DS token**. Exact max width/outer gutters remain `OWNER_VISUAL_OPEN` until visual review.
- **Figma gutters preserved:** current My Orders desktop content inset is 72px; mobile My Orders 20px; mobile Support/Layouts 16px. Do not silently normalize these family-specific values.
- **DEFERRED:** no `wide` variant yet. Existing Manager Orders is a card list; no current complex table consumer demonstrates the need. Revisit with an approved table screen.
- `AccountMenu` / `UserProfile` WIP, AppShell behavior, Sidebar, Glass, product state and routes are outside this decision.

## M8 / FE-S05 / 08.11.2026 — scope and open findings

Основание: прямое поручение Owner по issue #21 и Drive CURRENT. Одна ветка/PR; React only; no merge without permission.

- **Approved execution detail:** during Client LAY03/04/05/06 picker flow, keep `Макеты` as the active and enabled sidebar item while the Item editor is open; retain the existing unsaved-item guard for other destinations. This follows CURRENT frame `1316:2015` and does not add a new route or product command.
- **OPEN / Owner:** Manager Orders PILOT row `2495:8871/9000/9097` (New/All, search, company, sort) has no approved scope/semantics. Do not add until decided. Current React GL03 status filters remain.
- **OPEN / Owner:** shared Sidebar icon rows differ from text-only CURRENT shell/nav references; preserve existing tested shared behavior pending approval.
- **OPEN / Owner:** AuthCandidate remains without an approved CURRENT Figma design; do not call it visually accepted.
- **M8 audit result:** zero P0; one confirmed P1 (disabled active `Макеты` item in the nested LAY03 picker) repaired in the existing Client AppShell consumer. No additional confirmed large P1 was found in the independent visual sample. The full traceability matrix is the M8 section of `SCREEN_MAP_M4_2026-11-06.md`.
- **OPEN / Owner:** company naming (“Клиенты” in Figma / “Компании” in product notes), production status/API/1C/ACL mapping, persistent layout storage and real Support async states remain outside this UI parity decision.
- QA statuses are technical only: build and regression do not confer visual, screen, product or release acceptance.

## FE-S04 / 07.11.2026 — approved scope and OPEN

Основание: Owner поручил выполнить FE-S04 issue #19 по CURRENT Drive sequential A→B→C→D. Одобренные границы: React/fixtures only; одна feature-ветка и один PR; LIVE docs в той же поставке; базовый QA после блоков; merge только после разрешения.

- Manager `Новые` = submissions, созданные Client в текущей демосессии; `Все` включает существующие Manager fixtures и private Manager drafts. Это UI grouping, не backend queue/status/ACL mapping.
- Manager-created draft хранится только в shared in-memory workspace и отфильтрован из Client list. Существующие Company fixtures; no create-company or publish action.
- Pending/success/error являются presentation-only demo states, не статусами производства или 1С. Imported-from-1C example synthetic, labeled, and shown only via explicit `fixture=imported-1c`.
- Auth screen: **OWNER_DESIGN_OPEN** because no approved Auth section/login component was found in current Figma. Candidate UI covers email/code and invalid/expired/resend/trusted-device previews; no real address lookup, email/code send, identity, session, or persisted trust.
- M8 owns visual parity/polish and remaining accepted-glass/native-control review. No visual or product acceptance is implied by QA.

## FE-S03 / Owner instruction 06.11.2026 — approved scope and OPEN

Основание: [issue #17](https://github.com/SigmeD/flexomir_os/issues/17) и прямое поручение Owner в этой сессии. A Manager Companies → B shared requester Support → C My Layouts UI-only → D integration/QA, один PR #18, без merge до отдельного разрешения. Это frontend demo на синтетических данных, без backend/API/1С.

- Support: FR-SUP-001..006 разрешают тему/описание, свои обращения и ответ команды. Manager не оператор. Категории/вложения/author reply/delete/triage из CANDIDATE исключены; сокращение candidate Client NEW до двух подтверждённых полей — explicit #17, не изменение SRS.
- Layouts: разрешён UI preview LAY01…09; полная библиотека/реальное хранение/versions/ACL по-прежнему OPEN. CURRENT LAY02 links ведут в PROPOSED section2101:7959: More/history остаются disabled. Download disabled без реального source file. Save хранит только demo metadata, не bytes или server upload.
- Figma «Клиенты» vs issue «Компании»: UI label сохранён по CURRENT Figma, naming OPEN. Company detail и linked orders — одна Figma-композиция, отдельная промежуточная страница не добавлена. Sort disabled: fixture order не равен production rule.
- Иллюстративные formats/20MB в Upload Panel не утверждены file-policy; не внедрены как ограничения. Required title/source — только demo Save affordance, не API schema. Native read-only/disabled rendering и более контрастный existing secondary color требуют DS/Owner review.
- Принятый Glass/material/GL03/Sidebar/Drawer сохранён. AppShell использует существующий onSelectionSettled перед сменой раздела; новый motion engine не создан.
- Код/авторский QA, независимое review, Owner acceptance, merge и release — отдельные статусы. Разрешения на merge нет.


## FE-S02 / Owner scope 06.11.2026 — базовый сценарий и отложенный CR

**Owner уточнение #15:** Figma parity всего Orders-flow обязательна; shared More/menus/Primary/fields/Artwork/rows/PageHeader, один PR #16, merge BLOCKED до визуальной приёмки. Prototype read подтвердил New More Cancel Input `1917:3329 → 1810:12510`, Edit More Cancel Changes `1917:3319 → 1782:6074`: явный Cancel возвращает без несохранённых Item правок. Footer Save/Revert/Close отсутствуют в CURRENT — удалены. General Order values удерживаются в ephemeral store при вводе/навигации; это не утверждённый server autosave. Production leave/reload policy OPEN.

**OPEN для Owner/DS:** Artwork helper `634:445` имеет контраст 4.36:1 (`#737781` на `#fbfcfe`), React временно использует существующий `#586d7c` для доступности; Figma не изменена. Native date/select/checkbox appearance и file-policy text/library disabled требуют визуальной фиксации исключений до merge. Старый CORE status y102 против нового Header V3: используем более поздний V3 с subtitle после полной строки actions. Manager `2500:9701/9730/9756` помечен PROPOSED, бизнес-команды/права из него не утверждены. Полный список и evidence — Component Registry, без второго отчёта.

Источник: прямое поручение Owner в сессии + [issue #15](https://github.com/SigmeD/flexomir_os/issues/15), [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit). В текущий frontend инкремент входят New/Edit Draft/Items, стандартное дублирование completed заказа, общий read-only Manager demo. Пожелания 6 ноября (`CR-REP`: подписной, намотка/рулон/краски, дополнительные вложения, аудио/видео, обязательный комментарий) **DEFERRED / PENDING PO+TECH**, до согласования с заказчиком и Алексеем не реализуются.

Demo field validation, Shape/Material samples и print selection — presentation-only, не закрывают backend schema/1С mapping. Date requiredness, server upload/library, Delete Draft/Item и unsaved-leave, Manager private draft/publication/versioning/права/queue OPEN. Item leave не теряет dirty values: Save или явный Figma Cancel; серверные удаления/автосохранение не моделируются. Reload честно обнуляет ephemeral demo. После локального Send — Figma title «Заказ отправлен» / UI marker «Передан менеджеру», filterId=null; это не mapping статуса API/1С. Базовые FE-S01 display fixtures остаются read-only; Composer редактирует только созданные в FE-S02 черновики.

## FE-DEC-09 / OWNER APPROVED 06.11.2026 — SDLC breadth-first, LIVE DOCS

- **Принято:** сначала аудируем существующую Figma-архитектуру и собираем карту обоих кабинетов Client + Manager; затем общие React-каркасы и все основные экраны, потом сквозной путь заказа, системная UX/UI-полировка и общий QA. Не тратим сопоставимое время на каждую иконку или Glass-анимацию при неполном охвате экранов. Базовый QA и критические дефекты исправляем сразу.
- **Принято:** документация должна оставаться LIVE; синхронизация реальных изменений/гейтов с [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit) и текущими GitHub-документами — часть Definition of Done каждой задачи. Никаких независимых конкурирующих CURRENT-планов.
- **Факт GitHub, не UX-approval:** PR #5/#9/#10 merged; `origin/main` = `89b043f`. Реализация продукта не равна его визуальному/продуктовому принятию.
- SRS/Scope/Governance/Figma Masters сохраняют приоритет и меняются только по отдельной процедуре; API/backend/1С — зона Алексея.

## CURRENT / Owner decision 06.11.2026 — frontend execution + responsibilities

- **FE-DEC-06 APPROVED:** deliver React frontend by reusable components and screen compositions. Figma Primary Design System V2/FOS Masters are the visual foundation; a set of ~230 Figma frames is NOT a requirement to create ~230 independently coded screens. Existing scenario frames are references for user states; archival and UX PROPOSED are not approved product scope.
- **FE-DEC-07 APPROVED:** OUR workstream owns only React/TypeScript frontend (visual components, interactive UI, responsive, frontend routing, mock data, QA, frontend API consumer for an approved API). **Алексей** owns backend, API creation, 1C integration/exchange, server business rules and ACL, integration QA. Responsibility is not re-opened per task. Frontend may request contracts but may not implement or change API/1C.
- **FE-DEC-08 APPROVED:** `В работе` user-facing UI label is decided by Owner without further UI consent. Production 1C status mapping belongs to external backend/PO data contract; no speculative enums in React.
- **FE-STATE-06.11:** GL-03 and NavigationDrawer are in main. PR #9 merged at 0fc653667ac4acba675fe702920b476a2fda5ac8 with AppShell/Drawer integration and five successful CI workflows on aaaa4304. Owner screen acceptance remains OPEN. Canonical stages and the next task: [Drive 09_FRONTEND_CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit). Earlier FE-08=TODO, merge-conflict and mandatory HTML-per-screen notes are historical.

Утверждать решения может только уполномоченный Owner/PO по действующему процессу. Запись агента ≠ approval. Каждый новый пункт: дата, источник, статус, затронутые файлы/экраны, зависимости, кто подтверждает.

Реестр перенесён из пакета владельца от 04.11.2026. Продуктовые статусы `OWNER DIRECTION` и `VISUAL REFERENCE APPROVED` — сведения пакета, а не новая проверка или утверждение агентом: CURRENT Drive/Figma в этой задаче не перечитывались. Локальные Git/build факты проверены отдельно.

| ID | Решение/вопрос | Статус на 04.11 | Источник / замечание |
| --- | --- | --- | --- |
| FE-DEC-01 | История: схема «каждый экран через HTML gate» заменена компонентным процессом 04.11 после повторного аудита | SUPERSEDED 04.11 / COMPONENT-FIRST CURRENT | [Frontend Startup](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit) |
| FE-DEC-02 | Первый микроинкремент — общий HeaderAction (Client + Manager), а не HTML-дубль Manager Orders; React-компонент и QA отдельно от будущего экрана | OWNER DIRECTION 04.11 / CONTRACT DRAFT | [HeaderAction](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view) |
| FE-DEC-03 | Прежний самостоятельный HTML-пилот «Заказы» не подходит; оставить как есть | REJECTED AS BASELINE | [UX/UI CURRENT Index](https://docs.google.com/document/d/1RWrqveia84o487bcXwXh00rXoiSMZBKAJJ9FdpZRVkA/edit) |
| FE-DEC-04 | Screens и Liquid Glass разрабатываются параллельно с отдельными зонами ответственности | OWNER DIRECTION | [Frontend Startup](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit) |
| FE-DEC-05 | Старый обязательный HTML-first для каждого экрана отменён: HTML только для сложной оптики/взаимодействия до React-порта эффекта; статичные shared components сразу в React по Figma | OWNER APPROVED уточнение 04.11 | [Governance](https://docs.google.com/document/d/1m0TmticLfJYsnNG2aXt4tH6dNrjozMvRIahlCOhlicM/edit), [HeaderAction](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view) |
| FE-OPEN-05 | Client My Orders T/M Figma Compact48 vs SRS «постоянная подпись» | OPEN / Owner+PO | [HeaderAction contract](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view); не менять SRS автоматически |
| FE-OPEN-06 | GL-01B press Owner acceptance; Manager Figma Add enabled vs локальный HTML disabled | OPEN / Owner+PO on business action | Package A только базовый HeaderAction без motion/реального создания заказа |
| GL-DEC-01 | Visual эталоны Primary 2.1.5, Sidebar 2.2.5 C, Tabs 2.3.3c визуально согласованы как HTML reference | VISUAL REFERENCE APPROVED, NOT REACT | [Glass Contract](https://docs.google.com/document/d/1VgaR8sfpRWeYVhDlN9jGkehLnXbCTiNQSBSEZCVWmGI/edit) |
| GL-DEC-02 | FosGlassMaterial/Website Glass React есть локально; build PASS 04.11, старые QA-результаты не перепроверены | LOCAL CODE + BUILD VERIFIED / OWNER OPEN | `src/components/ui/fos-glass-material.tsx`, `npm run build`; [Glass Contract](https://docs.google.com/document/d/1VgaR8sfpRWeYVhDlN9jGkehLnXbCTiNQSBSEZCVWmGI/edit) |
| FE-OPEN-01 | Реальный Git/React каталог, remote/branches/worktrees | RESOLVED LOCALLY 04.11 | `D:/Projects/flexomir_os`, `main`, `origin` GitHub, `cd0656a`, одна рабочая папка; build PASS |
| FE-OPEN-02 | Manager «Новые», status mapping, API/1C, ACL, permitted actions | OPEN / ALEKSEY + PO | [SRS](https://docs.google.com/document/d/1EwjqQ3z_lO2lyDCQHhm-NIiDxgZzPrKOXAWR3tC-C4M/edit), [Data Spec](https://docs.google.com/document/d/1Wf8EA76i6qBqY4lfiTLAfSLhuyZVnHKyDQLOpZCnCkU/edit) |
| GL-OPEN-01 | Desktop Client tabs vs tablet/mobile Select по SRS; unified dropdown кандидат | CONFLICT / OWNER + PO | [SRS](https://docs.google.com/document/d/1EwjqQ3z_lO2lyDCQHhm-NIiDxgZzPrKOXAWR3tC-C4M/edit), [Glass Contract](https://docs.google.com/document/d/1VgaR8sfpRWeYVhDlN9jGkehLnXbCTiNQSBSEZCVWmGI/edit) |
| FE-OPEN-03 | Причины несоответствия отклонённого HTML-пилота | OPEN / OWNER VISUAL GATE | Сделать Figma-vs-pilot gap-аудит |
| FE-OPEN-04 | Пакет предполагает приватный Git, но текущий GitHub PUBLIC | OPEN / OWNER | `gh repo view` 04.11 подтвердил PUBLIC; видимость не менялась. Решение не блокирует локальные правила |
| OPS-DEC-01 | Отправлять проект без тяжёлых отчётов/видео/PNG прогонов | OWNER DIRECTION 04.11 | Прямое указание владельца в этой сессии; `.gitignore` исключает `output/`, `test-results/`, `playwright-report/` |
| OPS-DEC-02 | Основная папка и обычные ветки по умолчанию; worktree только с согласия | OWNER DIRECTION | Инструкции владельца в этой сессии; имеют приоритет над шаблоном пакета |
| OPS-DEC-03 | Подключить пакет правил с актуализацией фактов, сохранив код и действующие ограничения | OWNER REQUEST 04.11 | `Flexomir_OS_Codex_Agent_Rules_2026-11-04.zip` и три самостоятельных файла; `AGENTS.md`, `.codex/config.toml`, документация |
| OPS-DEC-04 | Объединить все локальные и удалённые ветки в main | OWNER REQUEST 04.11 | Прямое поручение «смерджи все ветки в main»; история исходных веток сохраняется, существующие удаления скриншотов остаются незакоммиченными; это не новое продуктовое approval |

## Новый запрос на решение (шаблон)

- Дата / ID / инициатор:
- Контекст и практическая проблема:
- Текущие источники и точные ссылки:
- Варианты и последствия (UX, API/1C, сроки, компоненты, QA):
- Предпочтительный вариант и почему:
- Кто должен утвердить и к какому моменту:
- Решение/статус (OPEN / PROPOSED / APPROVED / REJECTED), ссылка на подтверждение:
- Изменённые документы/коммиты/последующие задачи:
