# Flexomir OS — текущий план

Обновлено 13.11.2026. Каноническая очередь — [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit); факты поставок — [PROJECT_STATE](PROJECT_STATE.md). Этот файл содержит только оставшуюся работу.

| Этап | Состояние | Следующий шаг и ответственный |
| --- | --- | --- |
| M4–M7 | Основные композиции и сквозные сценарии реализованы на fixtures | Использовать существующие компоненты и [карту экранов](SCREEN_MAP_M4_2026-11-06.md) |
| M8 | U03/U04 Owner accepted; U05 общий row source реализован; U06 один material pilot | Owner: принять U06 DocumentPreview preset перед переносом material family; общая M8/D09 отдельно |
| M9 | Зависит от готового согласованного API | Алексей: backend/ACL/1С; frontend: подключение клиента и интеграционный QA |

## Открытая очередь

### Issue #21 · U05–U09 · после принятия контрольных вариантов

Owner13.11: «принято продолжай» — U03/U04 OWNER ACCEPTED, разрешено продолжение в той же ветке/PR#49. Head перед продолжениемfbd88ce; CI3/3SUCCESS. Main3b9a0aa не изменился. Frozen/business/№10/13 и отдельный merge gate сохраняются.

- [x] U05: общий FosSummaryRow/Copy, четыре доменных адаптера, readonly variant; RED→GREEN,120PNG до/после без отличий.
- [x] U06 pilot: карта владельцев motion, существующие контроллеры REUSE; одна настройка action profile достигает3consumers (6PASS). Внешний preset только DocumentPreviewDialog,9PNG без отличий. API style override найден независимым QA и закрыт во внешнем адаптере.
- [ ] U06 family: **Owner material pilot gate** перед другими consumers; frozen files и их checksum не менять.
- [x] U07 rows: удалены только перенесённые CSS-копии; compatibility hooks и drift checks сохранены. Material cleanup после его gate.
- [x] U08 текущего блока: build/optics/frozen,78targeted,129image pairs,6independentPASS; full949PASS/8SKIP/9FAIL,4touch в реальных профиляхPASS, Morecurrent4PASS, popupisolated5PASS. Полный чистый suite и точная причина singleton popup FAIL остаютсяOPEN;6snapshots не обновлены.
- [ ] U09 финальный объём: материал после gate, финальная регрессия и отчёт; контрольная доставка этого блока сопровождается LIVE docs/Drive/issue/PR сейчас. Merge отдельно.

Выбран минимальный общий presentation слой вместо универсальной domain-row или CSS-only объединения: первый сохраняет данные/права у адаптеров и устраняет повтор структуры; CSS-only оставил бы четыре JSX-копии. Styles старого Card/flat различаются обоснованно и сохраняются вариантами. Source mapping: ClientRow1189:984 → CompanyRow(compact/flat); OrderRow685:195 → OrderCard(regular/card + static); LayoutRow1313:2182 → LayoutRow(regular/flat + ArtworkThumbnail); SupportRequester → SupportTicketRow(regular/flat), обе роли. Все → FosSummaryRow/FosSummaryRowCopy, props: slots/density/surface/native attrs, title/meta tags и compatibility classes; никаких бизнес-данных в primitive.

### Принятые U01–U04

Owner поручил реализацию 13.11.2026. База `3b9a0aa424d98df709c724125b6aba83bef5ad38`, обычная ветка `refactor/ux-ui-unification-20261113`. Используется навык writing-plans; план ведётся здесь, без второго CURRENT.

Статус: app/tests9f95198, Owner accepted на headfbd88ce (CI3/3SUCCESS), NOT MERGED. [Исторические причины, RED/GREEN и доказательства](UI_UNIFICATION_2026-11-13.md). Выполненные шаги не возвращаются в очередь.

Figma ClientRow634:316 всё ещё Body14/20/400; более новое прямое поручение Owner / issue #21 задаёт контрольный title Card16/22/600. Это явное различие источников, не утверждение синхронизации Figma. Canvas не менять. Обе главные вкладки Drive прочитаны; screenshot/video из сообщения и отдельный MD-аудит пока не доступны как файлы, baseline воспроизводится на текущем SHA.

1. U06 material pilot gate в [PR #49](https://github.com/SigmeD/flexomir_os/pull/49) → перенос следующего consumer/семейства. Полная M8-проверка и причины6snapshot mismatches/единичного popup FAIL остаются открытыми. Устаревший More assertion приведён к уже принятому hoverv0.3 без runtime fix; это не обновление snapshot baseline.
2. Owner/PO: определить состав дубликата обращения, действие менеджера по согласованному сроку, публикацию клиенту и событие «В работе». Не реализовывать неподтверждённые решения.
3. №10/13 — отдельный backlog до backend/API Алексея и подтверждения Owner/PO. №11 исходной итерации снят без реализации; позднейшие решения COMM-DOCS учитываются отдельно. [Основания исходных 13 пунктов](NEXT_SCOPE_13_2026-11-10.md).
4. После появления API — согласовать fixtures, ошибки и capabilities; подключить frontend, проверить реальные права, read, файлы и переходы. Сервер и 1С не реализуются в нашем потоке.

Сроки не назначены. PR #46 и №06 завершены; повторного разрешения на их merge не требуется. PR #40 и CMP — отдельный объём, перед выбором задачи проверить их актуальное состояние.

## Поставка

Один инкремент — обычная ветка от свежего origin/main и один PR с кодом, проверками и относящимися к нему документами. Worktree только с согласием Owner. До merge нужны актуальные CI/review и предусмотренные Owner gates; после — подтверждение SHA, remote head и синхронизация существующего Drive CURRENT. [Правила](../AGENTS.md).

Материал и физика FE11-v0.2 заморожены. Принятое hover v0.3 уточняет adapter/presence. Сохранение даты, публикация и запуск в 1С — разные события. Новые статусы и права не выводятся из Figma.
