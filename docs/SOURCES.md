# Flexomir OS — источники проекта

FOS05 / 12.11: Owner выбрал «А- вариант. Только у полей показывают причина блокировки». G-02 APPROVED, `dirty && valid` сохраняется. [Draft PR #43](https://github.com/SigmeD/flexomir_os/pull/43), проверенный код `848dbc6`, [контракт и CI](FOS05_REPEAT_ITEM_SAVE_2026-11-12.md#доставка-и-ci). Drive CURRENT синхронизирован 12.11; Figma634:445/1782:6025 ранее прочитаны metadata-only, canvas не менялась. Текущее уточнение обновляет документы по Git/PR/CI и не является новым UI-QA или приёмкой. После №05 — №13 + №10 с Алексеем.

Owner FOS07 rollout /11.11: «да, отлично применяй» после просмотра компактного календаря и Account-style линзы. Это приёмка G-04 и разрешение общего подключения. Figma не менялась; [контракт/consumer map](FOS07_DATEPICKER_PILOT_2026-11-11.md), поставка [PR #41](https://github.com/SigmeD/flexomir_os/pull/41) MERGED, merge `e6a04fd748dbb16702610b3d7898b8ba1d3f87a5`, проверенный head `85ad6ef147a246b03652b92e70e50925d948870d`, CI5/5SUCCESS.

№07 /11.11: новое поручение Owner реализовать B2.5–B2.8. CURRENT Date Field1169:437 и popup1914:655 перечитаны с context/screenshot; metadata FOS Masters1688:532 не содержит отдельного календарного мастера. Figma read-only session c31bae2e-08a1-47a8-88ea-057e57b78f2d; canvas не менялась. Context7 /gpbl/react-day-picker/v9.14.0 и APG DatePicker dialog использованы для библиотечной/keyboard части. [Карта, ссылки и ограничения](FOS07_DATEPICKER_PILOT_2026-11-11.md).

Ревизия сводок: 11.11.2026. Следующая — 25.11.2026. Этой правкой сверены GitHub, локальный Git и существующий Drive CURRENT; нормативные SRS/Scope/Governance и Figma canvas не изменялись.

## Как выбирать источник

Требования и одобренные решения Owner/PO определяют логику, права и данные. Утверждённые Primary DS/FOS masters и CURRENT UX определяют компоненты и состояния. Новое подтверждённое решение важнее устаревшего кадра; CURRENT-кандидат сам по себе не является approval. Факты реализации/CI/merge проверяются в GitHub, очередность — в Drive CURRENT.

Локальная точка входа: [состояние](PROJECT_STATE.md), [план](DELIVERY_PLAN.md), [решения](DECISIONS.md), [реестр компонентов](COMPONENT_REGISTRY_2026-11-06.md). Датированные источники ниже не означают, что каждый из них заново прочитан этой документационной правкой.

Последние подтверждённые источники изменений:

- Owner принял hover Account и сглаживание, затем прямо поручил распространение на dropdown. PR #36/#37 MERGED. CURRENT Figma11.11: Account3042:2806, More1914:655, Select1148:311, Drawer1962:3834 с Nav634:511/Lens1578:493. Геометрия/материал сохранены; runtime adapter уточнён новым решением. [Контракт и доказательства](POPUP_HOVER_ROLLOUT_2026-11-11.md).
- Owner по Screenshot_3 подтвердил placeholder только в пустом поле. CURRENT Select1148:311/292 перечитан11.11; PR #38 MERGED. Пустые значения фильтров отделены от placeholder явным existing contract. [Контракт](SELECT_PLACEHOLDER_2026-11-11.md).
- Owner принял ArtworkSource на f509eba и поручил rollout FOS03/FOS12; PR #35 MERGED. [Результат](ACCEPTED_UI_ROLLOUT_2026-11-11.md).
- Клиентские даты и общие размеры полей приняты в PR #31; manager commit/event→status остаются OPEN. Date Field1169:437, Default1169:383 и Readonly1169:433 проверялись10.11. [Аудит M8](M8_FINAL_AUDIT_2026-11-10.md).
- [Исходная декомпозиция 13 пунктов](NEXT_SCOPE_13_2026-11-10.md) хранит основания и варианты; актуальные статусы — в DELIVERY_PLAN, не в старой очереди.
- [Очистка Git](GIT_BRANCH_CLEANUP_2026-11-11.md) подтверждена PR/head/merge ancestry, совпадением дерева PR #7/#8, bundle verify и ls-remote. Исторические ветки повторно не сливались.

Frozen reference f527bcb, hashes и необходимая доказательная база сохраняются в [manifest](FE11_MOTION_FROZEN_V0_2.json) и профильных контрактах. Материалы output — локальные, исключены из Git; наличие машинного пути проверяется перед использованием.

## Google Drive / документы

| Приоритет | Источник | Для чего читать |
| --- | --- | --- |
| 0 | [Основная папка Flexomir-V](https://drive.google.com/drive/folders/1-0UKiK1h1MT2lXS8oy5NL89_0MUuYcnn) | Общая рабочая база |
| 0 | [Frontend Development Plan CURRENT M0–M9](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit) | Действующая очередь, поставки PR #37/#38 и следующий DatePicker07 |
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
