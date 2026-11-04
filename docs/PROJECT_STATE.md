# Flexomir OS — текущее состояние проекта

**Локальный снимок:** 04.11.2026. **Источник свежих изменений:** [Frontend Startup CURRENT](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit). На новой сессии проверить изменения в Drive и фактический Git.

## Решение OWNER 04.11.2026 — обязательный HTML visual gate

- Новый процесс: Figma CURRENT + FOS/Primary DS → HTML-превью → HTML QA D1440/L1024/T768/M390/M320 → `OWNER_HTML_APPROVED` → **отдельная** задача Codex на React → React QA/Owner gate → PR. Старое требование «сразу Figma→React» заменено.
- Принцип: Figma определяет компоненты, форму, размер, иконки, типографику и адаптивы; Glass эталоны определяют материал/свет/анимацию. Manager Primary остаётся фигурой иконковой кнопки Figma, а не текстовой демонстрацией 2.1.5.
- Первый экран Manager «Заказы»: архив `Flexomir_Orders_HTML (1).zip` / `Flexomir_Orders_Review.html` доступен как **непринятый** HTML-кандидат. Следующая стадия — gap-анализ Figma node `2633:20095`, HTML доработка, Owner HTML review. `React Manager Orders BLOCKED` до неё.
- Git React/Vite/Glass-полигон существует отдельно. Это обновление документации; исходный UI и backend не модифицированы. Правило также внесено в [AGENTS](../AGENTS.md), [план](DELIVERY_PLAN.md) и [QA](QA_CHECKLIST.md).

## Проверено локально 04.11.2026

- Рабочая папка `D:\Projects\flexomir_os`, одна рабочая папка Git, ветка `main`; при начале задачи незакоммиченных изменений не было. `origin`: `https://github.com/SigmeD/flexomir_os.git`. Начальный коммит `cd0656a` отправлен, локальный и удалённый SHA сверены в предыдущей задаче этой сессии.
- `gh repo view SigmeD/flexomir_os --json nameWithOwner,visibility,defaultBranchRef,url`: PUBLIC, основная ветка `main`. Приватность из пакета не выполнена; доступ без решения владельца не менялся.
- Уже существует React 19 / TypeScript / Vite приложение, `src/App.tsx`, `src/GlassMaterialLab.tsx`, Glass/Select primitives, тесты и lockfile. Это Glass-полигон с DEMO-заказами, а не принятый продуктовый Manager Orders.
- `npm run build` PASS: TypeScript (`tsc -b`) и Vite production build, 41 module. Node `v24.11.1`, npm `11.6.2`, Git `2.56.0.windows.4`, Codex CLI `0.166.0`. Отдельных npm scripts `lint` и `typecheck` нет.
- Браузерные тесты/оптический gate в этой задаче NOT RUN: менялись только инструкции и документация. Старые результаты от 03.11 доступны в [документе материала](fos-glass-material.md) и [Select](glass-select-check.md), не считаются свежей проверкой.
- Отчёты `output/`, `test-results/`, `playwright-report/`, зависимости, сборка и кэши исключены `.gitignore`. Версионируемые PNG-эталоны тестов сохранены; тяжёлые видео/PNG прогонов не отправляются.
- Подключены корневой `AGENTS.md`, `.codex/config.toml`, карта источников, QA, реестр решений, план и handoff из пакета владельца с поправками на факты. Superpowers skills доступны; проект уже trusted. Автоматическая загрузка новых файлов в следующей сессии ещё не проверена.

## Сведения из пакета владельца, CURRENT ещё не перечитан

- Историческая схема от 03.11 «Figma → React» заменена 04.11 на Figma → HTML visual preview → Owner HTML approval → отдельная React-задача.
- Прежний автономный HTML-пилот НЕ ПРИНЯТ; не использовать как baseline.
- Primary Button 2.1.5, Sidebar Lens 2.2.5 C, Horizontal Tabs 2.3.3c указаны как визуально согласованные изолированные HTML-эталоны. React-порт и продуктовая интеграция — отдельные гейты.
- Select/Dropdown и `FosGlassMaterial`: Owner gate OPEN; код в этом репозитории есть, его существование не означает продуктовую приёмку.
- Источники и Figma node IDs перенесены в [SOURCES](SOURCES.md). Содержимое, доступность и даты Drive/Figma в задаче подключения локальных правил не проверялись.

## На очереди

1. **FE-01:** проверить CURRENT Drive/Figma по первой продуктовой задаче; локальная часть FE-00 выполнена.
2. **FE-02/03:** решить вопрос PUBLIC/PRIVATE; использовать существующий React и build, не повторять bootstrap. Запуск и браузерный QA проверять отдельно.
3. **FE-04/05/06:** source-to-screen matrix, Figma gap-audit прежнего HTML, исправленный HTML Manager Orders, сохранение фигмовских компонентов и Glass motion слоя.
4. **FE-07:** HTML QA + Owner visual gate 1440/1024/768/390/320; React task только после `OWNER_HTML_APPROVED`.
5. **GL-01…GL-05 (параллельно):** React-порт визуальных эталонов, затем Select/Dropdown по контракту.
6. После HTML Owner approval — React-задача, React QA, повторное Owner approval, интеграционный PR + согласованные UI/API contracts, затем следующие экраны.

## Блокеры и открытые решения

- Требование пакета о приватности расходится с фактическим PUBLIC GitHub; решение владельца OPEN. CURRENT Drive/Figma пока не перечитан.
- Детальные причины непринятия прежнего HTML не оформлены; выполнить gap-аудит, не копировать его.
- SRS Client Orders: Tabs Desktop / Select Tablet-Mobile; единый Dropdown предложен, но не утверждён.
- Критерий Manager «Новые», real API/1C field/status mapping, permitted actions и маршруты требуют подтверждений.
- Website Glass: локальный build проверен; браузерные/оптические тесты требуют свежего прогона для продуктового гейта. Лицензия и браузерная совместимость — отдельные проверки.

## Последнее изменение

- 04.11.2026, Codex, `main`, исходная точка `cd0656a`: подключение правил владельца, без изменения кода приложения, тестов или зависимостей.
- Проверки: Git/remote/worktree, версии, доступность навыков, доверие проекта, build, сверка самостоятельных файлов с архивом. Проверки документов и состава Git — в [HANDOFF](HANDOFF.md).
- Следующее: новая сессия в этом проекте для проверки автоматической загрузки, затем адресная CURRENT-сверка перед согласованной продуктовой задачей.
