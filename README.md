# Flexomir OS — Frontend

Документация проверена по текущей задаче: **06.11.2026**. Следующая ревизия: **20.11.2026**.

> **CURRENT 06.11.2026:** FE-S01 (Client/Manager list + shared detail) в main через PR #14, база `884e78f`. FE-S02 / #15 в ветке `feat/fe-s02-order-compose-flow`: New/Edit/стандартное Duplicate → общий Manager demo. Статус QA/PR — в [PROJECT_STATE](docs/PROJECT_STATE.md), каноническая очередь — [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit). Пожелания встречи 06.11 (подписной, новые реквизиты/вложения/audio/video) исключены. Backend/API/1С — Алексей.

Рабочая система типографии для клиента и менеджера: заказы, компании, позиции и поддержка, с последующей интеграцией API и 1С. Границы MVP определяют утверждённые CURRENT требования. Рабочая папка: `D:\Projects\flexomir_os`.

**Проверено 04.11.2026:** Git подключён к [SigmeD/flexomir_os](https://github.com/SigmeD/flexomir_os), `main` опубликована. Уже существует React/TypeScript/Vite Glass-полигон; `npm run build` проходит. Это ещё не принятый продуктовый экран Manager «Заказы». Не создавать рядом второе приложение.

## Начать здесь

- [Правила Codex](AGENTS.md): источники, процесс, Context7, Git и QA.
- [Текущее состояние](docs/PROJECT_STATE.md) и [передача контекста](docs/HANDOFF.md).
- [Источники Drive/Figma](docs/SOURCES.md), [план поставки](docs/DELIVERY_PLAN.md) и [решения и блокеры](docs/DECISIONS.md).
- [Настройка Codex](docs/CODEX_SETUP.md) и [критерии QA](docs/QA_CHECKLIST.md).

Screens (OWNER уточнение 04.11): текущие Client UX V2 и Manager UX V2 → карта общих компонентов → узкий React-контракт → React-компоненты и QA → сборка экранов по Figma. HTML-проверка нужна только нестандартному Liquid Glass motion/menus, до переноса конкретного эффекта; **не** каждому экрану. Первый контракт: [HeaderAction](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view), без бизнес-логики/React экранов до отдельных задач.

Внешние продуктовые статусы перенесены из пакета правил от 04.11.2026. При аудите перечитаны CURRENT Baseline, Frontend Startup, UX/UI Index и Glass Visual Contract; Figma и полная нормативная сверка FE-01 ещё впереди. Репозиторий по последней проверке PUBLIC, а пакет предполагает приватный: [открытый вопрос](docs/DECISIONS.md).

## Актуальный порядок (Owner 04.11, после компонентного аудита)

`CURRENT Figma / FOS Masters → component contract → (HTML + Owner visual gate, если сложный motion) → shared React component + QA → React screen из готовых компонентов → screen QA/Owner → PR`.

НЕ переводить обычные экраны целиком в HTML. История «каждый экран через HTML» заменена новым решением, см. [AGENTS](AGENTS.md) и [HeaderAction contract](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view). Manager Orders HTML GL-01B — изолированный тест motion, а не новая архитектура экранов. Различать icon+caption HeaderAction и прямоугольную текстовую ActionButton.

## Текущий Glass-полигон

Локальная проба в существующем React-приложении. Визуальная приёмка пользователем **OPEN**.

- [Одна линза над настоящими HTML-заказами](http://127.0.0.1:5173/?view=material).
- Контроль оптики: [strength=0](http://127.0.0.1:5173/?view=material&phase=optics&strength=0), [0.1](http://127.0.0.1:5173/?view=material&phase=optics&strength=0.1), [0.6](http://127.0.0.1:5173/?view=material&phase=optics&strength=0.6).
- Тот же материал в Select: [обычный](http://127.0.0.1:5173/?glass=current), [матовый 97%](http://127.0.0.1:5173/?glass=matte).

`FosGlassMaterial` — один адаптер готового Website Glass `GlassLens`. Он задаёт форму, направленный свет, матовый центр, кромку, тень и движение. Собственных displacement-карт, SVG-фильтров или нарисованного фона нет. `glass.tsx`, `glass-motion.ts` и глобальный `src/styles.css` сохранены побайтно.

[Материал: эталоны, ограничения, результаты и снимки](docs/fos-glass-material.md) · [Select: первопричина и DevTools](docs/glass-select-check.md).

## Запуск и проверки

После запуска: [Клиент / Мои заказы](http://127.0.0.1:5173/?view=client-orders), [Менеджер / Заказы](http://127.0.0.1:5173/?view=manager-orders), [общие компоненты заказов](http://127.0.0.1:5173/?view=orders-components). В FE-S02 Client Add открывает Composer; «Завершённые» → DEMO-007 → Ещё → «Дублировать заказ». Новая позиция: Add в шапке; сохранённая позиция: Save; возврат без правок — More → «Отменить ввод/изменения». К списку ведут desktop breadcrumbs или «Заказы» в общей навигации; из формы позиции сначала Save/явный Cancel. Дата/комментарий заказа сохраняются в памяти при вводе, отдельной footer Save нет.

Для сквозной демонстрации откройте [Client + инструменты смены роли](http://127.0.0.1:5173/?view=client-orders&demoTools=1). После Send переключите роль кнопкой «Демо: менеджер» **в той же странице**, откройте новый DEMO-ID в «Все заказы». Новая вкладка/перезагрузка начинают отдельный набор данных. «Сбросить демо» возвращает исходные fixtures. Переключатель — отдельный demo harness, в обычной экранной композиции скрыт. Это не авторизация и не синхронизация с сервером. `&fixture=empty` проверяет пустой набор. PR #16 Draft, визуальная приёмка и merge заблокированы до Owner gate; [матрица переходов](docs/SCREEN_MAP_M4_2026-11-06.md#fe-s02--проверка-переходов-figma--react), [компоненты и OPEN отличия](docs/COMPONENT_REGISTRY_2026-11-06.md).

Draft/Item сохраняются только в памяти, ID позиции стабилен при редактировании; положительных Delete Draft/Item нет. Валидация полей, варианты формы/материала и способ печати — UX DEMO, не required-field/API/1С-контракт. Желаемая дата и общий комментарий необязательны в демо. Файл отображается как выбранный локально, библиотека отключена; HELP — исключительный режим. У менеджера изменение согласованного срока и «Создать заказ» disabled до контрактов.

```powershell
cd D:\Projects\flexomir_os
npm install
npm run dev
```

```powershell
npx playwright install chromium firefox webkit
npm run build
npm run verify:material-optics
npm run test:material
npm run test:e2e -- --workers=2
npx playwright test --config=playwright.orders.config.ts --workers=2
```

Оптический тест измеряет положение настоящего разделителя заказов и изменение текстового профиля при неизменных DOM-координатах. Сравнительные PNG и метрики: `output/playwright/fos-material/`. Тесты Select включают фильтрацию, клавиатуру, axe, контраст и 14 визуальных эталонов в двух viewport. Эталоны обновляются только отдельной командой `npm run test:visual -- --update-snapshots`; обычная проверка их не меняет. Эталон теста не означает утверждение дизайна пользователем.

Предыдущий отчёт от 03.11.2026: build и оптический gate PASS; **38/38 Select**, **30 material PASS +2 Chromium-specific skip**. Axe0 violations в проверенной области; incomplete раскрыты в отчёте. Контраст пунктов обычного ≥4.83:1, матового ≥9.79:1. Эти браузерные результаты не запускались повторно при подключении правил 04.11; свежая проверка — только `npm run build`. Метрики находятся локально в `output/playwright/fos-material/summary.json` и не публикуются в Git.

Отчёты `output/`, `test-results/`, `playwright-report/`, видео и снимки прогонов исключены через `.gitignore`. Небольшие эталоны в `tests/*-snapshots/` сохраняются как входные данные визуальных тестов. Отдельных npm-команд `lint` и `typecheck` пока нет; проверка TypeScript входит в `npm run build`.

Ссылки отчётов в `output/` работают только там, где сохранены локальные доказательства; свежий клон их не содержит. [Хранение и повторное получение доказательств](docs/fos-glass-material.md#хранение-доказательств): команды, внешние HTML-эталоны и границы воспроизводимости. Завершённые планы Glass удалены из рабочего дерева; их история остаётся в Git, действующие ограничения — в отчётах и плане поставки.

Firefox и WebKit используют штатный frosted fallback без преломления. Reduced-motion отключает перелёт и наклон; forced-colors использует системную поверхность. Проверены именно движки Playwright на Windows, не физические устройства Safari/iOS.

## Границы пробы

Учебные заказы без API, 1С и сохранения настроек. Бизнес-логика, статусы, Sidebar, Tabs, утверждённая кнопка, Overflow Menu и Figma не изменялись. По умолчанию остаётся обычный Select; матовый97% — opt-in для сравнения. Точное совпадение со сложным renderer прототипов не заявляется: ограничения штатной библиотеки перечислены в отчёте материала.

[Исходный аудит и контрольные суммы](STAGE_234k_AUDIT.md). Ревизия: **2026-11-04**, следующая: **2026-11-18**.
