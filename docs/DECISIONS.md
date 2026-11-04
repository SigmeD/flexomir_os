# Flexomir OS — реестр решений и вопросов

Утверждать решения может только уполномоченный Owner/PO по действующему процессу. Запись агента ≠ approval. Каждый новый пункт: дата, источник, статус, затронутые файлы/экраны, зависимости, кто подтверждает.

Реестр перенесён из пакета владельца от 04.11.2026. Продуктовые статусы `OWNER DIRECTION` и `VISUAL REFERENCE APPROVED` — сведения пакета, а не новая проверка или утверждение агентом: CURRENT Drive/Figma в этой задаче не перечитывались. Локальные Git/build факты проверены отдельно.

| ID | Решение/вопрос | Статус на 04.11 | Источник / замечание |
| --- | --- | --- | --- |
| FE-DEC-01 | История: схема «каждый экран через HTML gate» заменена компонентным процессом 04.11 после повторного аудита | SUPERSEDED 04.11 / COMPONENT-FIRST CURRENT | [Frontend Startup](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit) |
| FE-DEC-02 | Первый микроинкремент — общий HeaderAction (Client + Manager), а не HTML-дубль Manager Orders; React-компонент и QA отдельно от будущего экрана | OWNER DIRECTION 04.11 / CONTRACT DRAFT | [HeaderAction](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view) |
| FE-DEC-03 | Прежний самостоятельный HTML-пилот «Заказы» не подходит; оставить как есть | REJECTED AS BASELINE | [UX/UI CURRENT Index](https://docs.google.com/document/d/1RWrqveia84o487bcXwXh00rXoiSMZBKAJJ9FdpZRVkA/edit) |
| FE-DEC-04 | Screens и Liquid Glass разрабатываются параллельно с отдельными зонами ответственности | OWNER DIRECTION | [Frontend Startup](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit) |
| FE-DEC-05 | Старый обязательный HTML-first для каждого экрана отменён: HTML только для сложной оптики/взаимодействия до React-порта эффекта; статичные shared components сразу в React по Figma | OWNER APPROVED уточнение 04.11 | [Governance](https://docs.google.com/document/d/1m0TmticLfJYsnNG2aXt4tH6dNrjozMvRIahlCOhlicM/edit), [HeaderAction](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view) |
| FE-OPEN-05 | Client My Orders T/M Figma Compact48 vs SRS «постоянная подпись» | OPEN / Owner+PO | [HeaderAction contract](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view); не менять SRS автоматически |
| FE-OPEN-06 | GL-01B press Owner acceptance; Manager Figma Add enabled vs локальный HTML disabled | OPEN / Owner+PO on business action | Package A только базовый HeaderAction без motion/реального создания заказа |
| GL-DEC-01 | Visual эталоны Primary 2.1.5, Sidebar 2.2.5 C, Tabs 2.3.3c визуально согласованы как HTML reference | VISUAL REFERENCE APPROVED, NOT REACT | [Glass Contract](https://docs.google.com/document/d/1VgaR8sfpRWeYVhDlN9jGkehLnXbCTiNQSBSEZCVWmGI/edit) |
| GL-DEC-02 | FosGlassMaterial/Website Glass React есть локально; build PASS 04.11, старые QA-результаты не перепроверены | LOCAL CODE + BUILD VERIFIED / OWNER OPEN | `src/components/ui/fos-glass-material.tsx`, `npm run build`; [Glass Contract](https://docs.google.com/document/d/1VgaR8sfpRWeYVhDlN9jGkehLnXbCTiNQSBSEZCVWmGI/edit) |
| FE-OPEN-01 | Реальный Git/React каталог, remote/branches/worktrees | RESOLVED LOCALLY 04.11 | `D:/Projects/flexomir_os`, `main`, `origin` GitHub, `cd0656a`, одна рабочая папка; build PASS |
| FE-OPEN-02 | Manager «Новые», status mapping, API/1C, ACL, permitted actions | OPEN / ALEKSEY + PO | [SRS](https://docs.google.com/document/d/1EwjqQ3z_lO2lyDCQHhm-NIiDxgZzPrKOXAWR3tC-C4M/edit), [Data Spec](https://docs.google.com/document/d/1Wf8EA76i6qBqY4lfiTLAfSLhuyZVnHKyDQLOpZCnCkU/edit) |
| GL-OPEN-01 | Desktop Client tabs vs tablet/mobile Select по SRS; unified dropdown кандидат | CONFLICT / OWNER + PO | [SRS](https://docs.google.com/document/d/1EwjqQ3z_lO2lyDCQHhm-NIiDxgZzPrKOXAWR3tC-C4M/edit), [Glass Contract](https://docs.google.com/document/d/1VgaR8sfpRWeYVhDlN9jGkehLnXbCTiNQSBSEZCVWmGI/edit) |
| FE-OPEN-03 | Причины несоответствия отклонённого HTML-пилота | OPEN / OWNER VISUAL GATE | Сделать Figma-vs-pilot gap-аудит |
| FE-OPEN-04 | Пакет предполагает приватный Git, но текущий GitHub PUBLIC | OPEN / OWNER | `gh repo view` 04.11 подтвердил PUBLIC; видимость не менялась. Решение не блокирует локальные правила |
| OPS-DEC-01 | Отправлять проект без тяжёлых отчётов/видео/PNG прогонов | OWNER DIRECTION 04.11 | Прямое указание владельца в этой сессии; `.gitignore` исключает `output/`, `test-results/`, `playwright-report/` |
| OPS-DEC-02 | Основная папка и обычные ветки по умолчанию; worktree только с согласия | OWNER DIRECTION | Инструкции владельца в этой сессии; имеют приоритет над шаблоном пакета |
| OPS-DEC-03 | Подключить пакет правил с актуализацией фактов, сохранив код и действующие ограничения | OWNER REQUEST 04.11 | `Flexomir_OS_Codex_Agent_Rules_2026-11-04.zip` и три самостоятельных файла; `AGENTS.md`, `.codex/config.toml`, документация |
| OPS-DEC-04 | Объединить все локальные и удалённые ветки в main | OWNER REQUEST 04.11 | Прямое поручение «смерджи все ветки в main»; история исходных веток сохраняется, существующие удаления скриншотов остаются незакоммиченными; это не новое продуктовое approval |

## Новый запрос на решение (шаблон)

- Дата / ID / инициатор:
- Контекст и практическая проблема:
- Текущие источники и точные ссылки:
- Варианты и последствия (UX, API/1C, сроки, компоненты, QA):
- Предпочтительный вариант и почему:
- Кто должен утвердить и к какому моменту:
- Решение/статус (OPEN / PROPOSED / APPROVED / REJECTED), ссылка на подтверждение:
- Изменённые документы/коммиты/последующие задачи:
