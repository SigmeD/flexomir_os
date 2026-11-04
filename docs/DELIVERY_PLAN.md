# Flexomir OS — план frontend и Liquid Glass

План основан на [Frontend Startup CURRENT](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit) и [Glass Visual Contract](https://docs.google.com/document/d/1VgaR8sfpRWeYVhDlN9jGkehLnXbCTiNQSBSEZCVWmGI/edit). Этот локальный список — рабочий срез, не отдельное продуктовое утверждение.

Импортирован из пакета владельца 04.11.2026; внешние источники в этой задаче не перечитывались. Локальные этапы ниже исправлены по фактическому Git и сборке. Новая задача выполняется в основной папке; worktree и параллельные агенты требуют отдельного основания и согласия по `AGENTS.md`.

| Этап | Результат | Контрольный гейт | На 04.11.2026 |
| --- | --- | --- | --- |
| FE-00/01 | Инвентаризация файлов, Git, React, источников Drive/Figma/Glass | Проверка состояния до изменений | Локальная FE-00 выполнена; Drive/Figma FE-01 TODO |
| FE-02 | Один Git, первоначальный commit, решение о приватности | Owner согласовал remote, нет потери данных | Commit `cd0656a` опубликован; PUBLIC/PRIVATE OPEN; worktree не создавался |
| FE-03 | Использовать существующий React baseline | TypeScript/build, затем запуск и браузерный QA | Build PASS 04.11; отдельного lint нет; dev/browser NOT RUN в этой задаче |
| FE-04/05 | Source map Figma → React, AppShell, shared primitives, typed mock adapter | Минимальное изменение, без новых контрактов API | TODO |
| FE-06 | Manager «Заказы» — реальный React-пилот | Сравнение с CURRENT Figma и Owner review | TODO / HTML-история отклонена |
| FE-07 | QA пилота на 1440/1024/768/390/320 | Browser + visual + a11y + regression | TODO |
| FE-08 | Последующие утверждённые Manager screens по партиям | Каждый пакет — PR + QA + Owner | BLOCKED до пилота |
| FE-09 | Glass React поток и интерфейс подключения | Дизайн/поведение не подменены | Код Glass/Select есть в repo, build PASS; свежий browser QA и Owner OPEN |
| FE-10/11 | Контрактный пакет и согласование с Алексеем | Точные типы/ACL/1C mapping APPROVED или OPEN | TODO |
| FE-12 | Сквозная регрессия и handoff | Отдельные CODE/QA/OWNER/INTEGRATION статусы | TODO |

## Liquid Glass — отдельные поставки

| ID | Цель | Основание | Gate |
| --- | --- | --- | --- |
| GL-01 | React Primary Button | Visual HTML 2.1.5 согласован | Порт + press/touch/keyboard + visual side-by-side |
| GL-02 | React Sidebar Lens | Visual HTML 2.2.5 C согласован | One-lens motion, click selection, performance |
| GL-03 | React Horizontal Tabs | Visual HTML 2.3.3c согласован | One-lens spring, semantics, responsive |
| GL-04 | Select / material lens | React-полигон с отчётом агента, Owner approval OPEN | Repro build/test, один moving indicator, a11y/browser/fallback, Owner |
| GL-05 | Dropdown/Overflow | Research/contract не закрыт | Только подтверждённые действия, Owner + cross-browser |

## Правило готовности

Этапы выдавать отдельно: `REFERENCE_APPROVED` → `REACT_PORTED` → `QA_VERIFIED` → `OWNER_ACCEPTED` → `APP_INTEGRATED`. У экрана/материала статусы разные. Только после подтверждённого pilot gate расширять общий код на связанные экраны. Backend/APIs/1C контуры отдельно; не включать автоматически.

## Приоритет на старте

1. FE-01 — CURRENT Drive/Figma перед продуктовой работой; локальную инвентаризацию повторить только при изменении состояния.
2. FE-02/03 — закрыть вопрос приватности и браузерной проверки существующего приложения; не создавать Git/React заново.
3. FE-06 + FE-07 — один экран Manager «Заказы»; GL-01…GL-05 — отдельный поток ответственности. Параллельное выполнение и worktree только по отдельному согласованию.
4. Интеграция — через review/PR; затем FE-08 по партиям.
