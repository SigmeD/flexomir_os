# №06 — выполненный план и карта компонентов

12.11.2026. Основание: [утверждённые правила](FOS06_ITEM_ACTIONS_DECISIONS_2026-11-12.md). План выполнен, PR #44 MERGED, main6d3fa83. Карта ниже сохраняется как контракт потребителей; это не активная очередь заданий.

| CURRENT Figma → React | Состояния и потребители | Действие |
| --- | --- | --- |
| More 1914:668 → OrderItemForm / OverflowMenu | Сохранённая позиция, Client/Manager | EXTEND: duplicate/delete, dirty guard; frozen popup без изменений |
| New/Edit Item 1791:6130 / 1782:6025 → OrderItemForm | Новая предзаполненная копия, invalid/dirty | REUSE: явное Add; недоступный макет не становится доступным |
| Composer 1782:6074; Review 1838:6511 → OrderComposer / OrderDetail | Draft/Review обеих ролей | EXTEND: доступный полный локальный заказ до передачи; readonly для исторических summary |
| Существующий ConfirmDialog | Подтверждение удаления и несохранённые изменения | REUSE: focus/Escape; последнее удаление Review запрещено |

Этапы выполнены: исходный RED → общий редактор copy/delete → общий источник Review → QA обеих ролей и пяти ширин → независимая QA → CI фактического head7c5b017 7/7SUCCESS → merge по прямому поручению Owner → новые post-merge проверки. [Результаты и доказательства](FOS06_ITEM_ACTIONS_DELIVERY_2026-11-12.md).

Гейты отдельно: FUNCTIONAL, VISUAL, TECHNICAL, независимая QA, Owner. Тестовые fixtures не означают готовность backend. №10/13 — backlog, №11 закрыт по границе итерации; CMP и PR #40 вне поставки.
