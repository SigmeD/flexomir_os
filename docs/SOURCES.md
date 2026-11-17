# Flexomir OS — источники проекта

Назначение: карта действующих источников и их приоритета. Ответственный: Codex/frontend. Статус: действующий указатель. Содержательная проверка: 17.11.2026 (блок №2).

17.11, блок №2 motion: исходная запись Owner `C:\Users\Max\Documents\Bandicam\bandicam 2026-11-17 16-27-08-593.mp4` просмотрена покадрово для скачка H1 в library «Макеты». Исходник не изменён; игнорируемая локальная копия и кадры — `output/playwright/block2-h1/`. Подтверждение причины дано измерениями runtime CSS/DOM и исходным `layouts.css`; внешняя спецификация [W3C CSS View Transitions](https://www.w3.org/TR/css-view-transitions-1/) использована для проверки механизма snapshots. Owner visual acceptance исправления OPEN. [Факт](CONTRACTS_AND_EVIDENCE.md#evidence-block2-motion-pilot-2026-11-17).

16.11, блок №1 T1–T5: прямое поручение Owner в текущем диалоге реализовать локальный файл `D:\downloads\FLEXOMIR_OS_2026-11-16_BLOCK_1_AGENT_TASK.md` и приложенные пять PNG является более поздним разрешением на frontend-работу, чем начальный заголовок «только анализ» внутри пакета. Прочитаны CURRENT E2E/SRS/Frontend/CMP, GitHub PR #54 и issue #21, Figma Client Detail `1838:6565`, Completed `1846:2942`, Confirm `1916:3661` read-only. Запись звука Bandicam предоставлена, но автоматическая расшифровка в окружении недоступна; неподтверждённое аудиосодержание не превращалось в новое требование. [Реализация и ограничения](CONTRACTS_AND_EVIDENCE.md#evidence-order-lifecycle-block1-2026-11-16).

Клиентский статус, технический Frontend CURRENT и CMP CURRENT повторно прочитаны 16.11.2026 после merge [PR #51](https://github.com/SigmeD/flexomir_os/pull/51) и документационного [PR #52](https://github.com/SigmeD/flexomir_os/pull/52). В них отражены приёмка и поставка UA-03 DEV-стенда, открытый перенос роли в продукт, полная M8 и API-гейты. Figma и нормативные документы при этой синхронизации не изменялись; их прежние чтения не считаются новой проверкой.

16.11, UA-03 DEV-стенд: Figma read-only session `910feb3c-9d8a-4aad-8448-d4c04ac22da4` проверила Artwork Source634:445, Layout Upload Panel1438:474 и Signed Documents3391:3551. Первые два имеют разные исходные высоты и текстовые роли; подписные бланки используют верхнюю часть Artwork Source без library/help. Общая презентационная роль и исправленный пример ошибки приняты Owner на [React-стенде](../tests/fixtures/ua03-upload-review.html) и слиты в PR #51; Figma canvas не менялся. Красный контур ошибки и перенос в продукт OPEN. [Карта и QA](CONTRACTS_AND_EVIDENCE.md#evidence-ua03-upload-review-stand-2026-11-16).

## Как выбирать источник

14.11, прямое уточнение Owner по Screenshot_7: тонкие линии сохранять в DEV-пилоте, но проверить также светло-серые заливки полей позади DocumentPreview. [Read-only оптический аудит](CONTRACTS_AND_EVIDENCE.md#evidence-ui-unification-2026-11-13-documentpreview-физика-стекла-и-светлая-заливка-полей--аудит-14112026) опирается на [RP Photonics / Fresnel](https://www.rp-photonics.com/fresnel_equations.html), [W3C Filter Effects](https://www.w3.org/TR/filter-effects/) и [W3C Backdrop Filters](https://drafts.fxtf.org/filter-effects-2/), текущий React/CSS и обратимые DOM-пробы настоящего заказа. Новых решений о frozen/production нет, Figma canvas не менялся.

14.11, прямое уточнение Owner по Screenshot_5/6: критерием DocumentPreview служит видимость **линий реальных полей и строк**, пересекающих обе боковые грани, а не только текста/фона. [Изолированная проба и DEV-кандидат](CONTRACTS_AND_EVIDENCE.md#evidence-ui-unification-2026-11-13-documentpreview-тонкие-линии-настоящих-полей--dev-проба-14112026) используют существующий FOSInput и FosSummaryRow; Owner visual acceptance и production approval не получены. [liquid-glass-react](https://github.com/rdev/liquid-glass-react) прочитан как внешний референс по указанию Owner, зависимость не добавлена.

14.11, прямое решение Owner в текущем диалоге: **DEV PILOT APPROVED / PRODUCTION NOT APPROVED** для полупрозрачного фона DocumentPreview60/75/85% при сохранении непрозрачных PDF-страниц, текста и controls. [Локальный контракт и доказательства](CONTRACTS_AND_EVIDENCE.md#evidence-ui-unification-2026-11-13-documentpreview-dev-пилот-полупрозрачной-панели--14112026). Принятый Figma viewport3534:3630 и frozen FE11 не менялись; Owner visual acceptance новой версии не получена.

14.11, новое [задание Owner по полям под DocumentPreview в PR #49](https://github.com/SigmeD/flexomir_os/pull/49#issuecomment-6876775202) уточняет прежний визуальный критерий: проверять настоящие поля, геометрию и перекрытие, сохранять сплошной PDF viewport до решения Owner. [Новый аудит](CONTRACTS_AND_EVIDENCE.md#evidence-ui-unification-2026-11-13-documentpreview-реальные-поля-под-стеклом--14112026) основан на текущем коде, runtime DOM и собственных кадрах 1440×1000; Figma/Drive canvas этим шагом не изменялись.

14.11, повторный аудит шрифтов: Owner [Screenshot_3](../output/ui-unification/documents-fix/references/owner-typography.png), SHA256 `afde58bac1a92246152a101de4d5a12046513676187eef0bfab0c35c1d9e02a5`; исходник в корне сохранён. Figma read-only: accepted DocumentPreview3534:5364, signed section instance3534:5383 и row3534:5383;3464:3731, OrderRow685:195, order-compose1782:6074. В принятом кадре signed title16/22/600, meta12/18/400, badge10/14/600, heading20/28/600. Внешние документы и Figma canvas не менялись. [Карта, измерения, QA](CONTRACTS_AND_EVIDENCE.md#evidence-ui-unification-2026-11-13-повторный-аудит-типографики-по-screenshot_3--14112026).

14.11, подписные бланки/стекло: текущие Owner Screenshot_1/2 сохранены отдельно в output/ui-unification/documents-fix/references с SHA в контракте. Figma read-only:3391:3551 (files body variants),3441:3719 (header action),3534:3626/3630 (shell/viewport),3534:5364/5482 (принятый показ),685:195 (Orders states). Figma canvas не менялся. Прямое новое поручение Owner разрешает только тестовый дубль стекла перед приёмкой; original не исправлять по прежнему U06 approval. MDN SVG filter-region docs получены через Context7. [Причины, доказательства и аудит](CONTRACTS_AND_EVIDENCE.md#evidence-ui-unification-2026-11-13-последующее-уточнение-owner-бланки-и-тестовый-дубль-стекла).

Продолжение после ответа Owner «принято продолжай»: read-only Figma OrderRow685:195 и LayoutRow1313:2182 (варианты Wide/Compact, Default/Hover/Pressed/Focus) сопоставлены с принятым runtime. Физика/материал сохранены по runtime/frozen reference, новые визуальные значения из Figma не переносились. Для виртуального времени тестов использована официальная Playwright1.64.1 Clock/Route документация через Context7. [Scope и доказательства](CONTRACTS_AND_EVIDENCE.md#evidence-ui-unification-2026-11-13-u05-и-контрольный-u06-после-приёмки).

Для текущего issue #21 проверены первая вкладка [Frontend «Читать сначала»](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit?tab=t.aiwyg425dkrn) и [CMP t.0](https://docs.google.com/document/d/15MSDck4Ktrjn34xiWvFhkF77VpbM1DJZUvdKQ-Iu84Q/edit?tab=t.0), current SRS, первые вкладки инструкции агенту и клиентского статуса. Figma ClientRow634:316 прочитан read-only: старый Body14/20/400 отличается от более нового Owner поручения16/22/600; canvas не синхронизирован. [Точный scope чтения и недоступные вложения](CONTRACTS_AND_EVIDENCE.md#evidence-ui-unification-2026-11-13-источники-и-база).

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
