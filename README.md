# Flexomir OS — Frontend

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
```

Оптический тест измеряет положение настоящего разделителя заказов и изменение текстового профиля при неизменных DOM-координатах. Сравнительные PNG и метрики: `output/playwright/fos-material/`. Тесты Select включают фильтрацию, клавиатуру, axe, контраст и 14 визуальных эталонов в двух viewport. Эталоны обновляются только отдельной командой `npm run test:visual -- --update-snapshots`; обычная проверка их не меняет. Эталон теста не означает утверждение дизайна пользователем.

Предыдущий отчёт от 03.11.2026: build и оптический gate PASS; **38/38 Select**, **30 material PASS +2 Chromium-specific skip**. Axe0 violations в проверенной области; incomplete раскрыты в отчёте. Контраст пунктов обычного ≥4.83:1, матового ≥9.79:1. Эти браузерные результаты не запускались повторно при подключении правил 04.11; свежая проверка — только `npm run build`. Метрики находятся локально в `output/playwright/fos-material/summary.json` и не публикуются в Git.

Отчёты `output/`, `test-results/`, `playwright-report/`, видео и снимки прогонов исключены через `.gitignore`. Небольшие эталоны в `tests/*-snapshots/` сохраняются как входные данные визуальных тестов. Отдельных npm-команд `lint` и `typecheck` пока нет; проверка TypeScript входит в `npm run build`.

Ссылки отчётов в `output/` работают только там, где сохранены локальные доказательства; свежий клон их не содержит. [Хранение и повторное получение доказательств](docs/fos-glass-material.md#хранение-доказательств): команды, внешние HTML-эталоны и границы воспроизводимости. Завершённые планы Glass удалены из рабочего дерева; их история остаётся в Git, действующие ограничения — в отчётах и плане поставки.

Firefox и WebKit используют штатный frosted fallback без преломления. Reduced-motion отключает перелёт и наклон; forced-colors использует системную поверхность. Проверены именно движки Playwright на Windows, не физические устройства Safari/iOS.

## Границы пробы

Учебные заказы без API, 1С и сохранения настроек. Бизнес-логика, статусы, Sidebar, Tabs, утверждённая кнопка, Overflow Menu и Figma не изменялись. По умолчанию остаётся обычный Select; матовый97% — opt-in для сравнения. Точное совпадение со сложным renderer прототипов не заявляется: ограничения штатной библиотеки перечислены в отчёте материала.

[Исходный аудит и контрольные суммы](STAGE_234k_AUDIT.md). Ревизия: **2026-11-04**, следующая: **2026-11-18**.
