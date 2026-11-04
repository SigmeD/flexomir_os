# Flexomir OS — план frontend и Liquid Glass

План основан на [Frontend Startup CURRENT](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit) и [Glass Visual Contract](https://docs.google.com/document/d/1VgaR8sfpRWeYVhDlN9jGkehLnXbCTiNQSBSEZCVWmGI/edit). Этот локальный список — рабочий срез, не отдельное продуктовое утверждение.

Импортирован из пакета владельца 04.11.2026; внешние источники в этой задаче не перечитывались. Локальные этапы ниже исправлены по фактическому Git и сборке. Новая задача выполняется в основной папке; worktree и параллельные агенты требуют отдельного основания и согласия по `AGENTS.md`.

| Этап | Результат | Контрольный гейт | На 04.11.2026 |
| --- | --- | --- | --- |
| FE-00/01 | Инвентаризация файлов, Git, React, источников Drive/Figma/Glass | Проверка состояния до изменений | Локальная FE-00 выполнена; Drive/Figma FE-01 TODO |
| FE-02 | Один Git, первоначальный commit, решение о приватности | Owner согласовал remote, нет потери данных | Commit `cd0656a` опубликован; PUBLIC/PRIVATE OPEN; worktree не создавался |
| FE-03 | Использовать существующий React baseline | TypeScript/build, затем запуск и браузерный QA | 04.11 при слиянии: build PASS, 80 E2E PASS (Chromium 1440/390); отдельного lint нет |
| FE-04/05 | Компонентная карта Client/Manager V2; FE-01 HeaderAction контракт | Один reusable primitive, разделение Figma masters и React API | Аудит 95/57 сделан; [HeaderAction контракт](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view) DRAFT / Owner review |
| FE-06 | Пилот общий HeaderAction; базовая геометрия и motion имеют отдельные гейты | Figma geometry, disabled/a11y, Client/Manager dev-story | Shared HeaderAction, lab и тесты уже в main; E2E PASS; сверка контрактов и Owner gates остаётся OPEN |
| FE-07 | Liquid Glass press для HeaderAction после визуальной оценки GL-01B | Side-by-side HTML oracle vs React и browser QA | GL-01B OWNER_OPEN, Package B BLOCKED |
| FE-08 | Manager Orders React из общих компонентов, затем Client reuse и другие экраны | React + Figma visual QA / product QA / Owner | TODO; не нужен отдельный HTML-дубль |
| FE-09 | Glass React поток и интерфейс подключения | Дизайн/поведение не подменены | Glass/Select, SidebarNav и neutral tone в main; 80 E2E PASS; отдельные material/optics и Owner gates OPEN |
| FE-10/11 | Контрактный пакет и согласование с Алексеем | Точные типы/ACL/1C mapping APPROVED или OPEN | TODO |
| FE-12 | Сквозная регрессия и handoff | Отдельные CODE/QA/OWNER/INTEGRATION статусы | TODO |

## CURRENT решение Owner / 04.11.2026 — ПОСЛЕ компонентного аудита

Отменена универсальная стадия «полный HTML каждого экрана». Контроль: **Figma → реестр компонентов → контракт → (HTML лаборатория только сложному motion/optics/menus с Owner visual gate) → React-компонент → independent component QA → React-экран → screen QA/Owner → PR**. Glass задаёт материал/движение, Figma — форму/размеры/иконки/контент. Исходный `Flexomir_Orders_Review.html` не считается эталоном; GL-01B motion пока не утверждён. Начинаем с [HeaderAction](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view), не с переноса целого экрана. Текстовая ActionButton `835:259` — отдельная будущая задача; не консолидировать с Icon+Label/Compact header.

## Liquid Glass — отдельные поставки

| ID | Цель | Основание | Gate |
| --- | --- | --- | --- |
| GL-01 | React Primary Button | Visual HTML 2.1.5 согласован | Порт + press/touch/keyboard + visual side-by-side |
| GL-02 | React Sidebar Lens | Visual HTML 2.2.5 C согласован | One-lens motion, click selection, performance |
| GL-03 | React Horizontal Tabs | Visual HTML 2.3.3c согласован | One-lens spring, semantics, responsive |
| GL-04 | Select / material lens | React-полигон с отчётом агента, Owner approval OPEN | Repro build/test, один moving indicator, a11y/browser/fallback, Owner |
| GL-05 | Dropdown/Overflow | Research/contract не закрыт | Только подтверждённые действия, Owner + cross-browser |

## Правило готовности

Этапы: `FIGMA_MAPPED → CONTRACT_READY → (GLASS_HTML_OWNER_APPROVED для сложного эффекта) → REACT_COMPONENT → COMPONENT_QA → REACT_SCREEN → SCREEN_QA/OWNER → PR/INTEGRATED`. Обычный компонент не требует HTML. Glass motion нельзя считать принятой по одной сборке. Backend/API/1C контуры отдельно.

## Приоритет на старте

1. FE-01 — CURRENT Drive/Figma перед продуктовой работой; локальную инвентаризацию повторить только при изменении состояния.
2. FE-02/03 — закрыть вопрос приватности и браузерной проверки существующего приложения; не создавать Git/React заново.
3. FE-06 — HeaderAction Package A: два презентационных варианта, native button, disabled, keyboard/touch, QA D1440/1024/T768/M390/M320, DEV story для двух ролей, без GL-01B и без прод-роутинга. Не изменять Client/Manager screens.
4. После Owner visual approval GL-01B — FE-07 Package B: точечный press + material, повторная QA. Далее FE-08 Manager Orders из общего React, без экранной HTML-копии.
