# Flexomir OS — реестр React-компонентов

Обновлено 14.11.2026. Это карта переиспользования, не журнал поставок. Текущий статус приёмки — в [решениях](DECISIONS.md); полный контракт, variants, Figma refs и проверки — по ссылкам ниже. Owner принял U06 DocumentPreview pilot; карта ниже отражает последующий перенос с сохранением вида.

## Карта Figma → React → потребители

U03/U04 приняты Owner13.11 ответом «принято продолжай», на headfbd88ce CI3/3SUCCESS. U05 implemented app/tests c9d70e6: ClientRow1189:984 / OrderRow685:195 / LayoutRow1313:2182 / Support → FosSummaryRow + FosSummaryRowCopy (CREATE minimal presentation; подходящего shared root не было). REUSE FosButtonRoot и ArtworkThumbnail. CompanyRow/OrderCard/LayoutRow/SupportTicketRow сохраняют props/data/handlers/IDs; Геометрия density compact/regular, surface flat/card и static Order сохранена; интерактивная подсветка единая по Orders. Старые surface/copy/title/meta/state CSS-копии удалены, compatibility classes сохранены. U06 pilot принят Owner; FosMaterialSurface теперь объединяет DocumentPreview, Sidebar, segment filters, Action/Header/Plus, popup shell, Account footer, Date cell и demo panel. Public optical/style overrides закрыты; только navigation имеет top/travel/observer. Frozen Rows и optics lab — KEEP. [Контракт и текущий перенос](UI_UNIFICATION_2026-11-13.md#u06-перенос-семейств-после-приёмки-пилота).

| Мастер / источник | React и props/states | Потребители | Решение / контракт |
| --- | --- | --- | --- |
| DS shell, Drawer1962:3834 / Nav634:511 | AppShell, CabinetPage, CabinetNavigation, SidebarNav, NavigationDrawer; role/items/selection/open | Оба кабинета | REUSE; [Drawer](GL02B_NAVIGATION_DRAWER.md) |
| Account3042:2806 | AccountMenu; sidebar/header, identity, disabled, open | AppShell Client/Manager | REUSE; [popup](POPUP_HOVER_ROLLOUT_2026-11-11.md) |
| Header2302:2138, Status Default/Compact | PageHeader; subtitleRole, subtitlePlacement | OrderComposer/Detail, LayoutBrowser | REUSE; status below-title, [rollout](ACCEPTED_UI_ROLLOUT_2026-11-11.md) |
| HeaderAction1953:4168 / 2173:1425 | HeaderAction; action, disabled, onAction; desktop68 / compact48 | Заголовки обоих кабинетов, Support Save | REUSE, не копировать Save/Add по экранам |
| Action835:259 / SectionAdd1986:774 | FosButtonRoot → FOSAction/FosActionSurface; hierarchy/size/shape, disabled, press | Все действия; SectionAddItem, HeaderAction | REUSE; [кнопки](FOS08_09_REPORT_2026-11-10.md) |
| More1914:650/655/668 | OverflowMenu → FosPopup/Surface/Rows; items/rights/open, context point, keyboard/focus/Esc | More, Account, Select, message context | REUSE; [hover](POPUP_HOVER_ROLLOUT_2026-11-11.md), [CRUD](COMM_DOCS_2026-11-12.md) |
| Select1148:311/292 | FOSSelect/FOSSelectPopup, GlassSelect; value/onChange, emptyIsPlaceholder, disabled/error | Формы, фильтры, компания, shape/material | REUSE; [placeholder](SELECT_PLACEHOLDER_2026-11-11.md) |
| Date Field1169:437/383/433 | FOSDatePicker, FOSDateField, OrderDateFields; controlled value, raw draft/validity, readonly | Composer/Detail Client/Manager | REUSE; [даты](FOS07_DATEPICKER_PILOT_2026-11-11.md) |
| GL03 / DS status controls | GlassPillTabs; selection/filter | Списки заказов Client/Manager | REUSE; [GL03](GL03_Compact_Pill_Tabs_Contract_2026-11-04.md) |
| Item1791:6130/1782:6025; Printing2315:9747 | OrderItemForm, PrintingMethodControl; dirty/errors/valid, duplicate seed/delete | Client New/Repeat/Edit, Manager New/Edit | EXTEND существующий редактор; [№05](FOS05_REPEAT_ITEM_SAVE_2026-11-12.md), [№06](FOS06_ITEM_ACTIONS_DELIVERY_2026-11-12.md) |
| Artwork634:445 | ArtworkSource + LocalFileControl; empty/local/library/unavailable/help, error/ARIA | Все OrderItemForm; picker/native chooser | REUSE; [состояния](FOS12_ARTWORK_STATES_PILOT_2026-11-11.md) |
| Composer1782:6074 / Review1838:6511 | OrderComposer, OrderDetail, ConfirmDialog; Draft/Review, dirty guard, transfer lock | Полные локальные заказы обеих ролей | REUSE; исторический summary readonly; [№06](FOS06_ITEM_ACTIONS_DELIVERY_2026-11-12.md) |
| Message3388:3329/3397:3561 | MessageThread(actions/ref.commit/onEditStateChange), MessageComposer(intent/ref.submit/onBusyChange), ConversationPanel(phase/ref.commit/onStateChange) | OrderComposer/Detail, SupportTicketDetail, media pilot | EXTEND; author/readBy/locked, dirty/canSave/busy; [COMM-DOCS](COMM_DOCS_2026-11-12.md) |
| Принятые Owner gestures | useMessageContext + RecordButton | Shared composer/thread | Gesture adapter, hold300ms, crossfade180ms/reduced-motion; не новый motion engine |
| Signed documents3391:3551 / action3441:3719 | SignedDocumentsSection → FosSummaryRow(surface=card, прежняя document geometry/copy), FileDropzone, DocumentPreviewDialog(onDelete), PdfPages | Composer Client/Manager, readonly Detail | EXTEND подключения общего row: native disabled/click/focus, leading PDF/File и прежнее имя/metadata; hovered/pressed/focus из единого owner. File-add/drop/delete — REUSE; [документы](COMM_DOCS_2026-11-12.md) |
| Support CURRENT Client/Manager | SupportScreen, SupportTicketForm/Detail/Row, HeaderAction(save), ConfirmDialog | Свои обращения обеих ролей | REUSE; own list, follow-up, scoped purge; Duplicate OPEN |
| Layout CURRENT | ClientLayoutsScreen, LayoutBrowser/picker, LayoutUploadPanel | Client, OrderItemForm | REUSE demo UI; real storage/versions/ACL №10/13 OPEN |
| Companies2634:20095 | ManagerCompaniesScreen, общие OrdersList/карточки | Manager | REUSE fixtures; создание компании не добавлять |
| Profile CURRENT WIP | ProfileSettingsScreen, AccountMenu, общие поля/Save/More | Client/Manager | REUSE; leave guard; полная visual/API OPEN |
| Auth CURRENT не утверждён | AuthCandidateScreen | Изолированный кандидат | DEFER утверждение UX; реальная auth OPEN |

## Обязательные правила

Аудит14.11 после SignedDocuments: OrderItemRow пока использует собственный hit-overlay и border-only hover; это **UA-01 GAP**, общий охват строк не завершён. Остальные native controls, popup consumers, прямые material exceptions и кандидаты ролей UA-02–04 — в [едином аудите](UI_UNIFICATION_2026-11-13.md#дополнительный-аудит-унификации--14112026). Временный `src/lab/document-glass-pilot/` — явное исключение по поручению Owner, выбирается только DEV `documentGlass=pilot`; не заменяет approved original до отдельной приёмки.

Owner row-highlight correction: все Company/Order/Layout/Support строки Client/Manager используют один enabled hover/pressed/focus профиль Orders в `fos-summary-row.css`. Flat interaction implementation и card-only hover tokens удалены. Geometry/density variants сохраняются; они больше не выбирают подсветку. Новый `m7-row-highlight` контракт проверяет равенство всех consumers и запрет второй реализации. [Решение и доказательства](UI_UNIFICATION_2026-11-13.md#единая-подсветка-по-эталону-orders).

Роли `--fos-type-row-title`, `--fos-type-row-meta`, `--fos-type-body` и `--fos-color-row-title` задаются один раз и применяются через FosSummaryRow/Copy. Company title и list shell приняты Owner; старый Figma master14/20/400 пока сохраняется. AppShell/CabinetPage/PageHeader и общий padding Orders — REUSE; `:has` выбирает существующий library/list или Support slot без нового effect. Picker/detail/upload — KEEP. [Контракт и QA](UI_UNIFICATION_2026-11-13.md). U06 pilot принят Owner; полная M8 и merge остаются отдельными этапами.

- REUSE → EXTEND → CREATE; один Figma master не размножается на отдельные экранные кнопки/поля/меню. До JSX фиксировать props, состояния и потребителей.
- Базовые FOSInput/Select/Textarea/Button и нативные элементы внутри них сохраняют доступность; экран собирает общие композиции.
- Frozen Rows/GlassMaterial/glass-motion не менять без отдельного разрешения. [Manifest](FE11_MOTION_FROZEN_V0_2.json) и hashes сохраняются; hover v0.3 — разрешённый adapter/presence.
- Закрытый `FosPopup` передаёт undefined visual target: moving lens отсутствует, а выбранное значение сохраняет доменный adapter. Не восстанавливать скрытую линзу ради старых screenshot references. `glass-select-visual.spec.ts` проверяет closed→open→selection→Escape и отрицательный возврат obsolete lens; closed/focus эталоны актуализированы под принятый PR #37, open сохранены. [Причина и доказательства](UI_UNIFICATION_2026-11-13.md#u08-причина-прежних-select-snapshot-fail).
- Manrope14/18/500 — общая роль menu/navigation/popup; не задавать размеры локально в потребителях. Heading/identity/trigger — отдельные роли.
- ConfirmDialog, More, фокус/Escape/outside-click и guards едины. Для shared change проверить обе роли, 1440/1024/768/390/320, keyboard/touch/reduced-motion.
- Fixtures не являются API/ACL/1С. Семантику и доступность действий определяют утверждённые требования и более поздние решения Owner.

## Подробные контракты общих контролов

## CURRENT /11.11 — placeholder не является пунктом Select

Select1148:311/292 → FOSSelect → FOSSelectPopup → FosPopup: EXTEND visible items filter по existing emptyIsPlaceholder/id. Trigger/full native options REUSE; required/reset/value/onChange прежние. Consumers: Client/Manager Shape/Material, Manager company, shared lab. CompanyOrders status/sorting explicitfalse сохраняют semantic empty. GlassSelect placeholder уже только в Trigger, без изменения semantic rows. [Полная карта/QA](SELECT_PLACEHOLDER_2026-11-11.md). Frozen5/5/hover/material прежние.

## CURRENT /11.11 — shared popup hover v0.3

FosPopup → EXTEND: общий transient preview для actions/listbox/navigation; выбранное значение и semantic aria отдельно. Удалён Account-only actionPreview prop; общий marker data-hover-preview=v0.3 и прежняя240ms presence. `selectionPending` задаётся существующим adapter pending state. Enabled baseline определяется из реальных data-popup-item DOM rows, включая semantic GlassSelect; optional empty string валиден, disabled placeholder не является baseline. Frozen Rows/material REUSE,5/5 unchanged. Полная Figma→React→props/states→consumers карта и актуальные QA — [единый контракт поставки](POPUP_HOVER_ROLLOUT_2026-11-11.md). Охват: AccountMenu, OverflowMenu, FOSSelectPopup, GlassSelectContent, NavigationDrawer; все текущие popup consumers ordinary/production. Старое Account-only описание ниже историческое.

## Принятые варианты подключены /11.11

ArtworkSource — один принятый вариант без presentation/reference/DEV API, все New/Edit/Repeat consumers Client+Manager и production. PageHeader status по умолчанию below-title, secondary остаётся below-row. Shared Composer/Detail компенсируют desktop flow20px, compact прежний; Manager Composer использует section32/block24 без query. FOSAction/LocalFileControl/FE11 не менялись. [Карта источников, Owner-решения и проверки](ACCEPTED_UI_ROLLOUT_2026-11-11.md). Нижняя карта пилота фиксируетf509eba до rollout.

## FOS08/09 · Кнопки системы

FosButtonRoot — единственное место создания native button в JSX. Через него проходят действия, строки, навигация, поля, элементы меню, сегменты и служебные кнопки. Root передаёт ref, события, ARIA и нативные атрибуты формы. Варианты сохраняют свой визуальный и интерактивный контракт.

| Роль | Мастер / вариант | Компонент |
| --- | --- | --- |
| Primary | Action 835:259, сплошная заливка | FOSAction → FosActionSurface |
| Secondary | Action 835:259, нейтральное стекло | FOSAction → FosActionSurface → FosGlassMaterial |
| Plus | SectionAdd 1986:774, hit 44, стекло 34, текст «+» Manrope 28/24 Medium | SectionAddItem → FOSAction |
| Header | 1953:4168 / 2173:1425, desktop 68, compact 48, круг 48 | HeaderAction → FosActionSurface. Подпись отдельным элементом |
| Закрытие диалога | Плоская иконка, compact 40 | FOSAction, tertiary / icon |
| More | 1914:650, прозрачный триггер меню | MoreAction → FosButtonRoot, lifecycle Radix |
| Поля, строки, сегменты и навигация | Семантические варианты соответствующих мастеров | FosButtonRoot и существующие контроллеры выбора |

Общие focus и disabled для вариантов действий. useDirectionalPress передаёт давление в один useActionSurface, который использует существующие Track/spring. Профиль удерживает короткий импульс 180 мс. FOSAction сохраняет hierarchy, size и shape. Reference-палитра доступна в сравнении на DEV-стенде. Frozen FE11-v0.2 сохраняет свои контракты. [План и проверка](FOS08_09_REPORT_2026-11-10.md).

## Уточнение Owner10.11 — согласованный срок клиента

| Источник → компонент | Решение | Props / состояния / потребители |
| --- | --- | --- |
| Owner screenshot: Client New справа от желаемого срока; существующий Manager Date Readonly1169:433 → FOSDateField в OrderDateFields | REUSE | Client OrderComposer: пустое value, readOnly; Client/Manager OrderDetail: существующее detail.agreedDate либо пустое, readOnly. Общие размеры44px / desktop до506px, адаптивная строка |

Это отображение существующей даты и пустого места до согласования; новые данные, статусные события и команды подтверждения не добавляются. Дата повторного/нового заказа не наследует согласованный срок исходника. Предыдущая правка размеров сама по себе поле клиенту не добавляла; эта правка устраняет пропуск.

## M8 / 10.11.2026 — единые размеры полей заказа

| Figma/master → React | Решение | Consumers / контракт |
| --- | --- | --- |
| Date Field 1169:437, Default1169:383 / Readonly1169:433 → FOSDateField | REUSE | Общая высота44px, состояния и native date input сохранены |
| Client New1810:12510, Manager draft2569:24648 → OrderDateFields | CREATE layout composition | OrderComposer и OrderDetail обеих ролей; desktop колонки до506px, сужаются вместе с контейнером; tablet две равные колонки или одиночное поле на всю ширину; mobile одна колонка |
| Client Detail1838:6565 date720px → Owner instruction10.11 | EXTEND shared layout | Новый эталон ширины — поле Client New506px, а не старый readonly frame720px; Figma не изменена |

Проверка остальных форм: основные поля позиции уже имеют desktop-колонки до506px; группа формы/ширины/высоты намеренно уже. Обычные input/select используют общую высоту44px. Textarea, поиск компаний и формы поддержки/профиля имеют отдельные композиции; их размеры не приравниваются к половине строки дат. Проверка браузером и результаты — в существующем итоговом аудите M8. Публикация согласованной даты и переход статуса в эту правку размеров не входят.
