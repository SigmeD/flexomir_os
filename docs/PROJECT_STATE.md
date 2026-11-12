# Flexomir OS — состояние проекта

№06: код дублирования/удаления позиции реализован в [PR #44](https://github.com/SigmeD/flexomir_os/pull/44), локальный QA 60/60, регрессия 142/142, production 6/6; независимая QA PASS WITH RISKS. Client/Manager: Draft и доступный полный Review до начала передачи в1С; копия через новый редактор и явный Add, удаление с подтверждением, последняя позиция Review защищена. [Поставка и ограничения](FOS06_ITEM_ACTIONS_DELIVERY_2026-11-12.md). Приёмка результата Owner и merge OPEN; 9 задач уже в main, №06 ещё не слит. №11 закрыт без реализации, №10/13 backlog; PR #40 и CMP отдельно.

№05 слит в [PR #43](https://github.com/SigmeD/flexomir_os/pull/43), main `76948df0120774464ec7edfdd5cd4b20ae810ec9`. Owner утвердил А: **причины блокировки только у полей**, `dirty && valid` сохранён. CI кода 3/3 SUCCESS; после merge — новый build PASS, FOS05 48/48 и frozen 2/2. Полная M8 приёмка остаётся отдельной.

До merge production smoke — 4/4, независимый QA — PASS WITH RISKS. Общий прогон: 770 PASS, 8 SKIP, 8 FAIL; все восемь ошибок воспроизведены на исходном main. [Контракт и ограничения](FOS05_REPEAT_ITEM_SAVE_2026-11-12.md#доставка-и-ci). №11 закрыт в этой итерации без реализации вложений, №10/13 — backlog. По №06 Owner утвердил [Q1–Q3](FOS06_ITEM_ACTIONS_DECISIONS_2026-11-12.md): обе роли до1С, копия через редактор, удаление с подтверждением и защитой последней позиции в «На рассмотрении». Реализованы 9/13; №11 снят с итерации, 2 отложены, №06 реализован в PR #44 и ещё не слит. PR #40 и CMP отдельно.

№07 принят Owner («да, отлично применяй») и слит в PR #41, merge e6a04fd: общий Glass DatePicker с линзой подключён к желаемому сроку в обычных Client/Manager заказах. [Контракт и проверки](FOS07_DATEPICKER_PILOT_2026-11-11.md), [поставка PR #41](https://github.com/SigmeD/flexomir_os/pull/41). Клиентский agreedDate и OrderDetail остаются readonly; данные YYYY-MM-DD.

Актуализировано 12.11.2026. Общая ревизия сводок была 11.11; следующая — 25.11.2026.
Очередность определяет [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit). Предыдущий слитый инкремент кода приложения — [PR #41](https://github.com/SigmeD/flexomir_os/pull/41), merge `e6a04fd748dbb16702610b3d7898b8ba1d3f87a5`; проверенный head `85ad6ef147a246b03652b92e70e50925d948870d`. Документационный PR #42 слит в `1ac5200` — базу FOS05. Для PR #43 Owner прямо поручил merge; фактические merged_at, main SHA и post-merge проверки фиксируются в GitHub и Drive CURRENT.

## Что работает сейчас

- Client и Manager используют общие экраны, формы, меню, кнопки и демонстрационные данные. Доступны заказы, позиции, компании менеджера, макеты, поддержка и профиль.
- Переход из профиля в «Заказы» сохраняет действующий guard несохранённых изменений.
- Принятые отступы Manager Composer и статус в 8 px от H1 подключены на обычных экранах. Состояния ArtworkSource empty/local/library/unavailable/HELP доступны в обоих кабинетах без DEV-флага.
- Account, «Ещё», FOSSelect, GlassSelect и мобильная навигация используют общий hover v0.3. Hover меняет только визуальную цель; выбор, маршрут и фокус прежние. Leave/keyboard возвращают реальную selection; pending commit защищён.
- Подсказки «Выберите…» видны только в пустом поле Select. В открытом списке нет placeholder-строки; реальные варианты «Все статусы» сохраняются.
- Общие OrderDateFields/FOSDateField имеют высоту 44 px и desktop-колонку до 506 px. Клиентский «Согласованный срок» readonly: в новом заказе пустой, в просмотре берётся из данных. Он не копируется из желаемого срока и не наследуется повторному заказу.
- Меню сохраняют Manrope 14/18/500; физика и материал FE11-v0.2 заморожены по [manifest](FE11_MOTION_FROZEN_V0_2.json), reference `f527bcb`.

Демосессия хранится в памяти страницы и сбрасывается при перезагрузке. Файлы не отправляются на сервер; создание заказа в 1С отключено.

## Что вошло в последнюю поставку

| Поставка | Результат и проверенный merge |
| --- | --- |
| [PR #33](https://github.com/SigmeD/flexomir_os/pull/33) | Profile→Orders, required Select, безопасная часть artwork warning; `b2b858f` |
| [PR #34](https://github.com/SigmeD/flexomir_os/pull/34) | Единые кнопки и принятый spacing pilot; `398a93b` |
| [PR #35](https://github.com/SigmeD/flexomir_os/pull/35) | Подключение принятых FOS03/FOS12 в обычных экранах; `bc880b1` |
| [PR #36](https://github.com/SigmeD/flexomir_os/pull/36) | Account hover и сглаживание 240 ms; `4ae4841` |
| [PR #37](https://github.com/SigmeD/flexomir_os/pull/37) | Общий hover остальных popup и стабильное CI-окружение; `3317d50` |
| [PR #38](https://github.com/SigmeD/flexomir_os/pull/38) | Placeholder Select только в пустом поле; `26768f9` |
| [PR #41](https://github.com/SigmeD/flexomir_os/pull/41) | Glass DatePicker и линза в обычном OrderComposer Client/Manager; readonly/ISO сохранены, merge `e6a04fd` |

PR #33–38 и #41 слиты. G-04 принят Owner; ожидание merge DatePicker закрыто. Полная визуальная приёмка экранов M8 остаётся отдельным gate.

## Проверки и доказательства

| Поставка | CI фактического head | Проверки после merge |
| --- | --- | --- |
| PR #37, head `678bf46` | 4/4 SUCCESS: [Orders](https://github.com/SigmeD/flexomir_os/actions/runs/43049308099), [Hover](https://github.com/SigmeD/flexomir_os/actions/runs/43049308060), [Drawer](https://github.com/SigmeD/flexomir_os/actions/runs/43049308061), [M7](https://github.com/SigmeD/flexomir_os/actions/runs/43049308110) | Build 238 modules; production 14 PASS / 6 условных SKIP; frozen contract 4/4 PASS |
| PR #38, head `a13cd0b` | 3/3 SUCCESS: [Orders](https://github.com/SigmeD/flexomir_os/actions/runs/43059507333), [Hover](https://github.com/SigmeD/flexomir_os/actions/runs/43059507183), [M7](https://github.com/SigmeD/flexomir_os/actions/runs/43059507218) | Новый build 238 modules; production 15/15; frozen fingerprints 5/5 |

PR #41, head `85ad6ef`: CI 5/5 SUCCESS — [DatePicker](https://github.com/SigmeD/flexomir_os/actions/runs/43085191441), [Orders](https://github.com/SigmeD/flexomir_os/actions/runs/43085191443), [Hover](https://github.com/SigmeD/flexomir_os/actions/runs/43085191433), [Artwork/Spacing](https://github.com/SigmeD/flexomir_os/actions/runs/43085191426), [M7](https://github.com/SigmeD/flexomir_os/actions/runs/43085191869). До merge: DatePicker 52/52, регрессия 58/58, production 30/30; после merge: новый build 1603 modules PASS, ordinary 2/2, production smoke 5/5 и frozen 5/5. [Контракт DatePicker](FOS07_DATEPICKER_PILOT_2026-11-11.md).

Сценарии, исходные падения и границы QA сохранены в [контракте hover](POPUP_HOVER_ROLLOUT_2026-11-11.md), [контракте Select](SELECT_PLACEHOLDER_2026-11-11.md) и [итоговом аудите M8](M8_FINAL_AUDIT_2026-11-10.md). Reviewer-authored браузерные проверки исполнял root из-за child browser EPERM; reviewer проверил JSON, hashes и PNG. Видео и результаты в output локальны и не входят в Git. Старые 520/4, 582/4 и другие прогоны не являются новыми проверками текущего HEAD.

## Что осталось открытым

- №06: frontend реализован в PR #44; приёмка результата, merge и серверный контракт отдельно.
- №10/13: backlog до backend/API Алексея. №11 закрыт в текущей итерации без реализации вложений; будущая доработка компонента поддержки отдельно.
- Действие менеджера для фиксации согласованного срока, публикация черновика клиенту и event→«В работе». Сохранение даты не меняет статус автоматически.
- Полная визуальная приёмка M8, Auth, реальные поиск/фильтры/сортировка и сопоставление статусов 1С; [issue #21](https://github.com/SigmeD/flexomir_os/issues/21) не закрывается техническим merge.
- M9: подключение к согласованным API, серверные права, storage и 1С. Backend и интеграция принадлежат Алексею.

Исторические remote-ветки очищены: удалены 7 refs, main не менялась; автоудаление head-веток включено. Локальные ветки и 4 stash сохранены. [Проверка Git](GIT_BRANCH_CLEANUP_2026-11-11.md); полный issue #13 остаётся открытым из-за отдельного объёма защиты main.

Следующий порядок действий — [план](DELIVERY_PLAN.md), [handoff](HANDOFF.md) и [реестр решений](DECISIONS.md).
