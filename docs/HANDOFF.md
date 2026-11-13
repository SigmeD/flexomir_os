# Flexomir OS — передача работы

Обновлено 13.11.2026. Начать с [состояния](PROJECT_STATE.md), [очереди](DELIVERY_PLAN.md) и [решений](DECISIONS.md); здесь только сведения для продолжения.

## Последняя поставка

PR #46 слит: приложение `479c591`, последующая синхронизация Markdown `f2bb70d`. Результаты, SHA, CI и ограничения — [единый контракт](COMM_DOCS_2026-11-12.md). Завершённые №05/06/07 не возвращать в реализацию. Локальные ветки слитых PR не переиспользовать.

## Текущий инкремент · issue #21 U01–U04

Рабочая ветка `refactor/ux-ui-unification-20261113`, основная папка `D:\Projects\flexomir_os`; база3b9a0aa, app/tests commit9f95198. Company title переведён на общую Card роль16/22/600; Client Orders/Layouts/Support используют один list padding contract. [Контракт, тесты и before/after](UI_UNIFICATION_2026-11-13.md). Это не merge и не закрытие всей M8/CMP.

Targeted48/48 PASS; независимый QA12 PASS и frozen5/5. Регрессия174:173PASS/1timeout cross-role demo390, изолированный повтор3/3PASS и последовательный integration12/12PASS; исходный FAIL сохранён. Подробные команды и границы — в контракте. Snapshot baseline: More2PASS, Select6FAIL одинаково до/после. Не обновлять эталоны ради зелёного отчёта.

Следующий шаг — визуальная приёмка Owner двух контрольных вариантов. U05–U09 после неё; frozen FE11, бизнес-логика и №10/13 не менялись. Classic scrollbar/physical devices/full suite остаются OPEN. Существующие источники/вложения/исторические доказательства и4stash не трогались. Ревизия документов13.11 завершена PR#47/#48, следующая27.11; это не фоновая автоматизация.

## Перед следующей задачей

- Сверить GitHub, git status, worktree list и [Drive CURRENT, вкладка «Читать сначала»](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit?tab=t.aiwyg425dkrn). Figma canvas и нормативные документы не менялись. Старый ClientRow14/20/400 отличается от более нового разрешённого контрольного16/22/600; не выдавать это за синхронизацию мастера.
- Состав дубликата тикета, Owner visual/D09, API/read/ACL/storage/1С и физические устройства остаются открытыми. M8 и 8 baseline failures — отдельная проверка, не автоматический fix.
- Сохранить frozen reference f527bcb и [manifest](FE11_MOTION_FROZEN_V0_2.json). Репозиторий PUBLIC; только синтетические данные.
- Артефакты output локальные и ignored; проверять их наличие. Серверы и браузерные сессии не считать запущенными по старому handoff.
