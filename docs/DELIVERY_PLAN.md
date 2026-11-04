# Flexomir OS — план frontend и Liquid Glass

План основан на [Frontend Startup CURRENT](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit) и [Glass Visual Contract](https://docs.google.com/document/d/1VgaR8sfpRWeYVhDlN9jGkehLnXbCTiNQSBSEZCVWmGI/edit). Этот локальный список — рабочий срез, не отдельное продуктовое утверждение.

Импортирован из пакета владельца 04.11.2026; внешние источники в этой задаче не перечитывались. Локальные этапы ниже исправлены по фактическому Git и сборке. Новая задача выполняется в основной папке; worktree и параллельные агенты требуют отдельного основания и согласия по `AGENTS.md`.

| Этап | Результат | Контрольный гейт | На 04.11.2026 |
| --- | --- | --- | --- |
| FE-00/01 | Инвентаризация файлов, Git, React, источников Drive/Figma/Glass | Проверка состояния до изменений | Локальная FE-00 выполнена; Drive/Figma FE-01 TODO |
| FE-02 | Один Git, первоначальный commit, решение о приватности | Owner согласовал remote, нет потери данных | Commit `cd0656a` опубликован; PUBLIC/PRIVATE OPEN; worktree не создавался |
| FE-03 | Использовать существующий React baseline | TypeScript/build, затем запуск и браузерный QA | Build PASS 04.11; отдельного lint нет; dev/browser NOT RUN в этой задаче |
| FE-04/05 | Source map Figma → HTML → React, токены, готовые компоненты Figma, разделение UI/данных | HTML по CURRENT Figma до React, с Owner gate | TODO / Manager Orders первым |
| FE-06 | Manager «Заказы» — интерактивный HTML-превью на основе текущего ZIP и Figma | Форма/иконки/типографика/сетка/адаптивы как в Figma; Liquid Glass только эффект | HTML_CANDIDATE / OWNER_HTML_APPROVED OPEN |
| FE-07 | HTML visual QA: 1440/1024/768/390/320 и Owner review | OWNER_HTML_APPROVED до React | TODO / React BLOCKED |
| FE-08 | Отдельная задача React-агенту на принятый HTML, затем остальные экраны партиями | React build/visual/a11y/regression + Owner + PR | BLOCKED до OWNER_HTML_APPROVED |
| FE-09 | Glass React поток и интерфейс подключения | Дизайн/поведение не подменены | Код Glass/Select есть в repo, build PASS; свежий browser QA и Owner OPEN |
| FE-10/11 | Контрактный пакет и согласование с Алексеем | Точные типы/ACL/1C mapping APPROVED или OPEN | TODO |
| FE-12 | Сквозная регрессия и handoff | Отдельные CODE/QA/OWNER/INTEGRATION статусы | TODO |

## Новое процессное решение OWNER / 04.11.2026

Предыдущий план «сразу Figma→React» заменён HTML-first визуальным gate. Источник формы/параметров — текущие компоненты Figma, а материал/свет/анимация — согласованные Liquid Glass эталоны. Копирование лабораторной текстовой Primary-кнопки вместо фигмовской иконковой недопустимо. Текущий `Flexomir_Orders_Review.html` — непринятый архивный кандидат, нужен gap-аудит по node `2633:20095` и новый HTML gate. Существующий React/Vite Glass полигон сохраняется, код/screens не изменяются.

## Liquid Glass — отдельные поставки

| ID | Цель | Основание | Gate |
| --- | --- | --- | --- |
| GL-01 | React Primary Button | Visual HTML 2.1.5 согласован | Порт + press/touch/keyboard + visual side-by-side |
| GL-02 | React Sidebar Lens | Visual HTML 2.2.5 C согласован | One-lens motion, click selection, performance |
| GL-03 | React Horizontal Tabs | Visual HTML 2.3.3c согласован | One-lens spring, semantics, responsive |
| GL-04 | Select / material lens | React-полигон с отчётом агента, Owner approval OPEN | Repro build/test, один moving indicator, a11y/browser/fallback, Owner |
| GL-05 | Dropdown/Overflow | Research/contract не закрыт | Только подтверждённые действия, Owner + cross-browser |

## Правило готовности

Этапы экрана выдавать отдельно: `FIGMA_SOURCE` → `HTML_CANDIDATE` → `HTML_QA` → `OWNER_HTML_APPROVED` → `REACT_TASK` → `REACT_PORTED` → `REACT_QA` → `OWNER_REACT_APPROVED` → `APP_INTEGRATED`. До HTML gate задача на React экран запрещена; после React gate только PR/интеграция. Исследовательский React Glass полигон не заменяет приёмку HTML. Backend/APIs/1C контуры отдельно.

## Приоритет на старте

1. FE-01 — CURRENT Drive/Figma перед продуктовой работой; локальную инвентаризацию повторить только при изменении состояния.
2. FE-02/03 — закрыть вопрос приватности и браузерной проверки существующего приложения; не создавать Git/React заново.
3. FE-06 + FE-07 — один HTML-пилот Manager «Заказы» по Figma: Liquid Glass как слой, без изменения формы кнопок/компонентов; D1440/1024/T768/M390/320, Owner visual acceptance. GL-01…GL-05 — отдельная лаборатория, не продуктовый React-экран. Параллельное выполнение и worktree только по согласованию.
4. Только после `OWNER_HTML_APPROVED` — постановка отдельной задачи Codex на React, затем QA/review/PR и Owner React acceptance; после этого FE-08 по партиям.
