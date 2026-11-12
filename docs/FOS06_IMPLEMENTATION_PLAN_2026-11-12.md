# №06 — план реализации

12.11.2026. Основание: [утверждённые правила](FOS06_ITEM_ACTIONS_DECISIONS_2026-11-12.md). Одна поставка в PR #44.

| CURRENT Figma → React | Состояния и потребители | Действие |
| --- | --- | --- |
| More 1914:668 → OrderItemForm / OverflowMenu | Сохранённая позиция, Client/Manager | EXTEND: duplicate/delete, dirty guard; frozen popup без изменений |
| New/Edit Item 1791:6130 / 1782:6025 → OrderItemForm | Новая предзаполненная копия, invalid/dirty | REUSE: явное Add; недоступный макет не становится доступным |
| Composer 1782:6074; Review 1838:6511 → OrderComposer / OrderDetail | Draft/Review обеих ролей | EXTEND: доступный полный локальный заказ до передачи; readonly для исторических summary |
| Существующий ConfirmDialog | Подтверждение удаления и несохранённые изменения | REUSE: focus/Escape; последнее удаление Review запрещено |

1. Воспроизводящий Playwright-тест: команды сейчас disabled. Сохранить RED.
2. Реализовать общий редактор: копирование сохранённых данных, новый ID только при Add; подтверждение удаления; сохранение/отмена несохранённых изменений.
3. Подключить Review к общему локальному источнику Client/Manager. Явное сохранение заказа и отмена, отдельный fixture начала передачи; не проектировать API/ACL/1С.
4. Проверить обе роли, Draft/Review, ID и данные исходника, invalid artwork, last-item, transfer lock, keyboard/focus и пять ширин. Выполнить build и релевантную регрессию №05/compose.
5. Независимая QA, актуальные LIVE docs и Drive CURRENT с сохранением параллельных изменений. Обновить PR #44; merge только по поручению Owner.

Гейты отдельно: FUNCTIONAL, VISUAL, TECHNICAL, независимая QA, Owner. Тестовые fixtures не означают готовность backend. №10/13 — backlog, №11 закрыт по границе итерации; CMP и PR #40 вне поставки.
