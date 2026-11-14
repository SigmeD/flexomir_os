# Flexomir OS — источники проекта

Проверка Drive CURRENT: 13.11.2026. Подтверждены поставка PR #46 и открытые M8/API-гейты. Figma и нормативные документы при уборке не изменялись; старые чтения не считаются повторной проверкой.

## Как выбирать источник

14.11, подписные бланки/стекло: текущие Owner Screenshot_1/2 сохранены отдельно в output/ui-unification/documents-fix/references с SHA в контракте. Figma read-only:3391:3551 (files body variants),3441:3719 (header action),3534:3626/3630 (shell/viewport),3534:5364/5482 (принятый показ),685:195 (Orders states). Figma canvas не менялся. Прямое новое поручение Owner разрешает только тестовый дубль стекла перед приёмкой; original не исправлять по прежнему U06 approval. MDN SVG filter-region docs получены через Context7. [Причины, доказательства и аудит](UI_UNIFICATION_2026-11-13.md#последующее-уточнение-owner-бланки-и-тестовый-дубль-стекла).

Продолжение после ответа Owner «принято продолжай»: read-only Figma OrderRow685:195 и LayoutRow1313:2182 (варианты Wide/Compact, Default/Hover/Pressed/Focus) сопоставлены с принятым runtime. Физика/материал сохранены по runtime/frozen reference, новые визуальные значения из Figma не переносились. Для виртуального времени тестов использована официальная Playwright1.64.1 Clock/Route документация через Context7. [Scope и доказательства](UI_UNIFICATION_2026-11-13.md#u05-и-контрольный-u06-после-приёмки).

Для текущего issue #21 проверены первая вкладка [Frontend «Читать сначала»](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit?tab=t.aiwyg425dkrn) и [CMP t.0](https://docs.google.com/document/d/15MSDck4Ktrjn34xiWvFhkF77VpbM1DJZUvdKQ-Iu84Q/edit?tab=t.0), current SRS, первые вкладки инструкции агенту и клиентского статуса. Figma ClientRow634:316 прочитан read-only: старый Body14/20/400 отличается от более нового Owner поручения16/22/600; canvas не синхронизирован. [Точный scope чтения и недоступные вложения](UI_UNIFICATION_2026-11-13.md#источники-и-база).

Требования и одобренные решения Owner/PO определяют логику, права и данные. Утверждённые Primary DS/FOS masters и CURRENT UX определяют компоненты и состояния. Новое подтверждённое решение важнее устаревшего кадра; CURRENT-кандидат сам по себе не является approval. Факты реализации/CI/merge проверяются в GitHub, очередность — в Drive CURRENT.

Локальная точка входа: [состояние](PROJECT_STATE.md), [план](DELIVERY_PLAN.md), [решения](DECISIONS.md), [реестр компонентов](COMPONENT_REGISTRY_2026-11-06.md). Датированные источники ниже не означают, что каждый из них заново прочитан этой документационной правкой.

Источники конкретных изменений и доказательства находятся в [контрактах поставок](README.md#контракты-и-доказательства). Frozen reference и hashes — в [manifest](FE11_MOTION_FROZEN_V0_2.json).

## Google Drive / документы

| Приоритет | Источник | Для чего читать |
| --- | --- | --- |
| 0 | [Основная папка Flexomir-V](https://drive.google.com/drive/folders/1-0UKiK1h1MT2lXS8oy5NL89_0MUuYcnn) | Общая рабочая база |
| 0 | [Frontend Development Plan CURRENT M0–M9](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit) | Действующая очередь, владельцы, зависимости и гейты |
| 1 | [00_CURRENT — Baseline](https://docs.google.com/document/d/1pHzQ2J75AZyT24Qg-HyZof79cASTXFOhqWIEDW_vVqU/edit) | Состояние и приоритет решений |
| 1 | [07_CURRENT — Project Governance](https://docs.google.com/document/d/1m0TmticLfJYsnNG2aXt4tH6dNrjozMvRIahlCOhlicM/edit) | Решения, согласования, ограничения |
| 1 | [03_CURRENT — SRS v0.5](https://docs.google.com/document/d/1EwjqQ3z_lO2lyDCQHhm-NIiDxgZzPrKOXAWR3tC-C4M/edit) | Функции, роли, статусы, MVP-поведение |
| 1 | [02_CURRENT — Scope / MVP Roadmap](https://docs.google.com/document/d/1-xAngGqyIBJg-Whyv7fMYKvwBa3mRonWtSp-O9mq5Mg/edit) | Границы работ |
| 1 | [01_CURRENT — Product Vision](https://docs.google.com/document/d/14sg_0c10ZQUVQ__hJt9tGyyN1PvRF6fs0TMZjm2GL88/edit) | Для чего создаётся продукт |
| 1 | [04_CURRENT — Data & Integration](https://docs.google.com/document/d/1Wf8EA76i6qBqY4lfiTLAfSLhuyZVnHKyDQLOpZCnCkU/edit) | Сущности, связь с 1С и открытые контракты |
| 1 | [05_CURRENT — E2E Processes](https://docs.google.com/document/d/1aOeKYmlmh5hiNltnwIpsLnk7LtlhJ93ldlHVCTVG7Us/edit) | Переходы пользователей и состояний |
| 1 | [06_CURRENT — Risk Register](https://docs.google.com/document/d/1HhduY9BWRwk-Ayxw7jID2aH76JWInbyo9gu8NzHzUOc/edit) | Риски и зависимости |
| 1 | [Frontend Startup CURRENT](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit) | Исходный FE-00…FE-12; текущая исполняемая последовательность — 09_FRONTEND CURRENT |
| 1 | [UX/UI CURRENT Index](https://docs.google.com/document/d/1RWrqveia84o487bcXwXh00rXoiSMZBKAJJ9FdpZRVkA/edit) | Актуальные DS/Figma/HTML источники |
| 1 | [Liquid Glass Visual Contract CURRENT](https://docs.google.com/document/d/1VgaR8sfpRWeYVhDlN9jGkehLnXbCTiNQSBSEZCVWmGI/edit) | Approved visual references, Glass status, QA gate |
| 2 | [FOS V2 аудит и контроль](https://docs.google.com/document/d/1whIXylrjwaUQU-9-o2kfdgwSVG1U-sY3CRJvvoTsYX0/edit) | История мастеров и технические ограничения |
| History | [Frontend V3 handoff 02.11](https://drive.google.com/file/d/1OGMVP_T3bqBHp9W6SLvRYVTX6TGlQXqX/view) | Исторический срез, НЕ заменяет CURRENT |

## Figma — только CURRENT страницы

- [Файл Flexomir OS](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS)
- [Primary Design System V2](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-60) — основные токены и правила
- [FOS V2 Technical Component Masters](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1688-532) — связанные технические компоненты
- [Manager UX CURRENT](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2495-8870) — основной текущий frontend-поток
- [Manager / Заказы](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2633-20095) — вспомогательный пилот; актуальные ссылки — в карте экранов
- [Manager / Компании](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20095) — вспомогательный модуль; реализация и ограничения — в карте экранов
- [Manager / Поддержка](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20172) — отдельный модуль
- [Client UX](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-6815) — действующие сценарии клиента; приоритет у подтверждённых решений и текущих мастеров

## Внешние технические источники (не продуктовая норма)

- [Manrope / Google Fonts](https://github.com/google/fonts/tree/main/ofl/manrope) — шрифт утверждённой Figma, локально `src/assets/fonts/Manrope-variable.ttf` + `OFL-Manrope.txt`; runtime без внешнего font request. Добавлен для PR #16 parity, не новая DS-типографика.

- [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Codex Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference)
- [Superpowers (obra)](https://github.com/obra/superpowers) — установку и доступные skills проверяй на фактической версии, а не по старому туториалу

**Трекер:** в `docs/DECISIONS.md` фиксируй новое утверждение и открытое противоречие вместе с ссылкой и датой; не копируй все страницы из Drive в репозиторий.
