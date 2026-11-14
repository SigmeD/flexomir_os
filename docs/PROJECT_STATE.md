# Flexomir OS — состояние проекта

Ответственный: Codex/frontend. Статус: актуальное состояние на 14.11.2026. Очередь и владельцы — [DELIVERY_PLAN](DELIVERY_PLAN.md) и [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit); решения — [DECISIONS](DECISIONS.md).

## Текущий инкремент

Рабочая ветка `refactor/ux-ui-unification-20261113`, [PR #49](https://github.com/SigmeD/flexomir_os/pull/49) — draft, merge не выполнялся. Код приложения на head `228b226` прошёл CI 9/9 SUCCESS. Owner ответил «Визуальная приемка принята» для показанной локальной версии заказа на этом head. Это приёмка данного вида, а не полной M8/D09 или релиза. После объединения документов checkpoint `cae2b86` содержит только документационные изменения: на 14.11 его CI 9/10 PASS, M7 ещё выполняется. Screen сначала дал 233 PASS/1 FAIL: тест движения линзы не прошёл геометрический порог на 0,012px; повтор задачи PASS, причина первого сбоя OPEN. Ранее на документационном `d9853c2` Communication WebKit повторил timeout при выборе «Копировать» (CI 8/9); причина также OPEN. Итог CI точного head сверять в PR.

Документация: 22 отдельных контракта и отчёта собраны в [единый документ](CONTRACTS_AND_EVIDENCE.md), исходные SHA256 и адресные разделы сохранены, старые Markdown-пути удалены. Frozen manifest и исходные доказательства не удалялись. Это изменение навигации по документам, не поведения приложения.

Список, создание, позиция и детали заказа используют общий рабочий контур. Зоны загрузки макета и бланков, «Материал», желаемый и согласованный сроки занимают одинаковую колонку на одном viewport: 635px при 1920px и 280px при 320px. На планшете выровнены трёхколоночные строки позиции. Формы используют Manrope: подпись 13/18, ввод 14/20, подсказка 12/18, расстояние от подписи до поля 8px. Разная ширина по числу колонок и высота многострочного комментария сохраняют назначение. [Причина, размеры, кадры и QA](CONTRACTS_AND_EVIDENCE.md#evidence-ui-unification-2026-11-13-контроль-всех-полей-заказа--14112026).

DocumentPreview Latest включён по умолчанию в DEV и production build через общий `GlassLens` и `DocumentGlassMaterial`. Pilot/original доступны только для DEV-сравнения. PDF, скачивание, управление окном и возврат фокуса проверены; кадры принятого DEV Latest и production совпали на пяти ширинах. Замороженный FE11 engine не менялся. [Rollout и проверки](CONTRACTS_AND_EVIDENCE.md#evidence-ui-unification-2026-11-13-documentpreview--production-rollout-14112026).

Общие строки, кнопки, поля, календарь, загрузка и popup описаны в [реестре компонентов](COMPONENT_REGISTRY_2026-11-06.md). U03/U04 приняты, U05/U06/U08 внедрены в рамках PR #49; точные результаты, исходные PNG и SHA сохранены в [контракте M8](CONTRACTS_AND_EVIDENCE.md#evidence-ui-unification-2026-11-13).

## Ранее поставлено

| Область | Действующий контракт |
| --- | --- |
| Переписка, поддержка, PDF, media · PR #46 | [COMM-DOCS](CONTRACTS_AND_EVIDENCE.md#evidence-comm-docs-2026-11-12) |
| Позиции, сохранение · PR #43/#44 | [№05](CONTRACTS_AND_EVIDENCE.md#evidence-fos05-repeat-item-save-2026-11-12), [№06](CONTRACTS_AND_EVIDENCE.md#evidence-fos06-item-actions-delivery-2026-11-12) |
| Даты, согласованный срок readonly · PR #31/#41 | [№07](CONTRACTS_AND_EVIDENCE.md#evidence-fos07-datepicker-pilot-2026-11-11) |
| Popup, Select, кнопки и отступы · PR #34–38 | [Hover](CONTRACTS_AND_EVIDENCE.md#evidence-popup-hover-rollout-2026-11-11), [Select](CONTRACTS_AND_EVIDENCE.md#evidence-select-placeholder-2026-11-11), [rollout](CONTRACTS_AND_EVIDENCE.md#evidence-accepted-ui-rollout-2026-11-11) |

## Открыто

- Полная Owner M8/D09, Auth/WIP UX, отдельное сравнение с CURRENT Figma, физические устройства и ручная доступность. WebKit menu сообщения однажды дал нестабильный FAIL; повтор того же CI head прошёл, локально 4/5 PASS, причина OPEN.
- Owner/PO: состав дубликата тикета, фиксация согласованного срока менеджером, публикация клиенту и переход в «В работе». UA-03/04 остаются кандидатами, не принятым редизайном.
- Алексей: API, ACL, хранение, 1С. Frontend M9 зависит от согласованного контракта. №10/13 отложены; №11 снят с исходной итерации.
- Внешняя выкладка и merge PR #49 не поручены. Frozen FE11-v0.2 и [manifest](FE11_MOTION_FROZEN_V0_2.json) сохраняются.

Предыдущие промежуточные head, сбои, исходные контрольные суммы и точные проверки находятся в профильных контрактах и истории Git; они не задают текущую очередь.
