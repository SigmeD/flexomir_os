# Flexomir OS — состояние проекта

№07 принят Owner («да, отлично применяй»): общий Glass DatePicker с линзой подключён к желаемому сроку в обычных Client/Manager заказах. [Контракт и проверки](FOS07_DATEPICKER_PILOT_2026-11-11.md), [поставка PR #41](https://github.com/SigmeD/flexomir_os/pull/41). Клиентский agreedDate и OrderDetail остаются readonly; данные YYYY-MM-DD.

Актуализировано 11.11.2026. Следующая ревизия сводок — 25.11.2026.
Очередность определяет [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit); фактические head/CI/merge поставки DatePicker сверяются в [PR #41](https://github.com/SigmeD/flexomir_os/pull/41). Предыдущая поставка интерфейса — [PR #38](https://github.com/SigmeD/flexomir_os/pull/38), merge `26768f9f019563092c17488def2070bf34f26e71`; далее документационный PR #39/main94b6587 — база разработки №07.

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
| [PR #41](https://github.com/SigmeD/flexomir_os/pull/41) | Принятый Glass DatePicker и линза, обычный OrderComposer Client/Manager; readonly и ISO сохранены |

PR #33–38 слиты. Для поставки DatePicker фактический статус доставки задаётся PR #41; G-04 принят Owner. Полная визуальная приёмка экранов M8 остаётся отдельным gate.

## Проверки и доказательства

| Поставка | CI фактического head | Проверки после merge |
| --- | --- | --- |
| PR #37, head `678bf46` | 4/4 SUCCESS: [Orders](https://github.com/SigmeD/flexomir_os/actions/runs/43049308099), [Hover](https://github.com/SigmeD/flexomir_os/actions/runs/43049308060), [Drawer](https://github.com/SigmeD/flexomir_os/actions/runs/43049308061), [M7](https://github.com/SigmeD/flexomir_os/actions/runs/43049308110) | Build 238 modules; production 14 PASS / 6 условных SKIP; frozen contract 4/4 PASS |
| PR #38, head `a13cd0b` | 3/3 SUCCESS: [Orders](https://github.com/SigmeD/flexomir_os/actions/runs/43059507333), [Hover](https://github.com/SigmeD/flexomir_os/actions/runs/43059507183), [M7](https://github.com/SigmeD/flexomir_os/actions/runs/43059507218) | Новый build 238 modules; production 15/15; frozen fingerprints 5/5 |

Сценарии, исходные падения и границы QA сохранены в [контракте hover](POPUP_HOVER_ROLLOUT_2026-11-11.md), [контракте Select](SELECT_PLACEHOLDER_2026-11-11.md) и [итоговом аудите M8](M8_FINAL_AUDIT_2026-11-10.md). Reviewer-authored браузерные проверки исполнял root из-за child browser EPERM; reviewer проверил JSON, hashes и PNG. Видео и результаты в output локальны и не входят в Git. Старые 520/4, 582/4 и другие прогоны не являются новыми проверками текущего HEAD.

## Что осталось открытым

- №05: Save UX/G-02; действует dirty && valid. №06: права и статусы дублирования/удаления позиций.
- №10/13: хранение файлов и связь Item↔Library; №11: вложения поддержки. Нужны решения Owner/PO и готовые контракты Алексея.
- Действие менеджера для фиксации согласованного срока, публикация черновика клиенту и event→«В работе». Сохранение даты не меняет статус автоматически.
- Полная визуальная приёмка M8, Auth, реальные поиск/фильтры/сортировка и сопоставление статусов 1С; [issue #21](https://github.com/SigmeD/flexomir_os/issues/21) не закрывается техническим merge.
- M9: подключение к согласованным API, серверные права, storage и 1С. Backend и интеграция принадлежат Алексею.

Исторические remote-ветки очищены: удалены 7 refs, main не менялась; автоудаление head-веток включено. Локальные ветки и 4 stash сохранены. [Проверка Git](GIT_BRANCH_CLEANUP_2026-11-11.md); полный issue #13 остаётся открытым из-за отдельного объёма защиты main.

Следующий порядок действий — [план](DELIVERY_PLAN.md), [handoff](HANDOFF.md) и [реестр решений](DECISIONS.md).
