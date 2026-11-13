# Flexomir OS — текущий план

Обновлено 13.11.2026. Каноническая очередь — [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit); факты поставок — [PROJECT_STATE](PROJECT_STATE.md). Этот файл содержит только оставшуюся работу.

| Этап | Состояние | Следующий шаг и ответственный |
| --- | --- | --- |
| M4–M7 | Основные композиции и сквозные сценарии реализованы на fixtures | Использовать существующие компоненты и [карту экранов](SCREEN_MAP_M4_2026-11-06.md) |
| M8 | U01–U04 issue #21 реализованы в рабочей ветке; полная приёмка открыта | Owner: два контрольных варианта Company title/list shell → разрешение U05–U09; остальная M8/D09 отдельно |
| M9 | Зависит от готового согласованного API | Алексей: backend/ACL/1С; frontend: подключение клиента и интеграционный QA |

## Открытая очередь

### Issue #21 · U01–U04 · контрольные исправления

Owner поручил реализацию 13.11.2026. База `3b9a0aa424d98df709c724125b6aba83bef5ad38`, обычная ветка `refactor/ux-ui-unification-20261113`. Используется навык writing-plans; план ведётся здесь, без второго CURRENT.

Статус контрольного инкремента: app/tests9f95198, targeted48/48 PASS, independent12 PASS, OWNER VISUAL OPEN / NOT MERGED. [Единый контракт с причинами, consumers, регрессиями и before/after](UI_UNIFICATION_2026-11-13.md). Шаги1–4 ниже выполнены в разрешённом контрольном охвате; gate и оставшиеся baseline/coverage ограничения сохраняются.

1. U01: измерить Company title и anchors Orders/Layouts/Support после fonts.ready, сохранить JSON/PNG/video; написать RED-проверки и повторить исторические More/Select FAIL. Проверить scroll, Activity/remount и scrollbar.
2. U02/U03: существующие Card/Body/Secondary и semantic colors → общие row title/meta aliases; CompanyRow получает явные роли. Высота80, ID, hit-area, search и linked orders сохраняются. Layout/Support/Order typography подключается к тем же ролям без изменения вычисляемого вида; объединение структуры строк — U05.
3. U02/U04: существующий Orders list padding → общий list-контракт в orders-page.css. ClientOrders использует data-view=list, LayoutBrowser — существующие data-mode/data-state, Support — непосредственный list slot; :has выбирает геометрию в первом committed frame без callback/effect. Убрать только конфликтующие list overrides Layout/Support, сохранить picker/detail/upload. Toolbar — существующий filters slot; пустые spacers не добавлять.
4. RED→GREEN; Chromium/Firefox/WebKit,1440/1024/768/390/320, кадры переключений, touch/key/focus, длинный текст, token propagation, соседние сценарии и frozen contracts. Независимый QA отдельным reviewer после фикса.
5. Обновить LIVE docs и Drive, подготовить один PR и сравнения для Owner. U05–U09 после визуальной приёмки; merge отдельно.

Figma ClientRow634:316 всё ещё Body14/20/400; более новое прямое поручение Owner / issue #21 задаёт контрольный title Card16/22/600. Это явное различие источников, не утверждение синхронизации Figma. Canvas не менять. Обе главные вкладки Drive прочитаны; screenshot/video из сообщения и отдельный MD-аудит пока не доступны как файлы, baseline воспроизводится на текущем SHA.

1. Owner visual gate двух U03/U04 вариантов в [PR #49](https://github.com/SigmeD/flexomir_os/pull/49) → U05–U09 по зависимостям. Полная M8-проверка по [аудиту](M8_FINAL_AUDIT_2026-11-10.md) остаётся открытой. Восемь исторических baseline-проверок повторены до/после: More2PASS, Select6snapshotFAIL без изменения; дальнейшее разрешение snapshot drift отдельно, focused-наборы не закрывают полный suite.
2. Owner/PO: определить состав дубликата обращения, действие менеджера по согласованному сроку, публикацию клиенту и событие «В работе». Не реализовывать неподтверждённые решения.
3. №10/13 — отдельный backlog до backend/API Алексея и подтверждения Owner/PO. №11 исходной итерации снят без реализации; позднейшие решения COMM-DOCS учитываются отдельно. [Основания исходных 13 пунктов](NEXT_SCOPE_13_2026-11-10.md).
4. После появления API — согласовать fixtures, ошибки и capabilities; подключить frontend, проверить реальные права, read, файлы и переходы. Сервер и 1С не реализуются в нашем потоке.

Сроки не назначены. PR #46 и №06 завершены; повторного разрешения на их merge не требуется. PR #40 и CMP — отдельный объём, перед выбором задачи проверить их актуальное состояние.

## Поставка

Один инкремент — обычная ветка от свежего origin/main и один PR с кодом, проверками и относящимися к нему документами. Worktree только с согласием Owner. До merge нужны актуальные CI/review и предусмотренные Owner gates; после — подтверждение SHA, remote head и синхронизация существующего Drive CURRENT. [Правила](../AGENTS.md).

Материал и физика FE11-v0.2 заморожены. Принятое hover v0.3 уточняет adapter/presence. Сохранение даты, публикация и запуск в 1С — разные события. Новые статусы и права не выводятся из Figma.
