# Flexomir OS — Frontend

Рабочая система типографии для клиента и менеджера: заказы, компании, позиции и поддержка, с последующей интеграцией API и 1С. Границы MVP определяют утверждённые CURRENT требования. Рабочая папка: `D:\Projects\flexomir_os`.

**Проверено 04.11.2026:** Git подключён к [SigmeD/flexomir_os](https://github.com/SigmeD/flexomir_os), `main` опубликована. Уже существует React/TypeScript/Vite Glass-полигон; `npm run build` проходит. Это ещё не принятый продуктовый экран Manager «Заказы». Не создавать рядом второе приложение.

## Начать здесь

- [Правила Codex](AGENTS.md): источники, процесс, Context7, Git и QA.
- [Текущее состояние](docs/PROJECT_STATE.md) и [передача контекста](docs/HANDOFF.md).
- [Источники Drive/Figma](docs/SOURCES.md), [план поставки](docs/DELIVERY_PLAN.md) и [решения и блокеры](docs/DECISIONS.md).
- [Настройка Codex](docs/CODEX_SETUP.md) и [критерии QA](docs/QA_CHECKLIST.md).

Screens: реальные React-экраны из CURRENT Figma, первый пилот — Manager «Заказы». Старый автономный HTML-пилот не принят. Glass: отдельный компонентный поток, перенос согласованных визуальных эталонов с собственной приёмкой Select/Dropdown. Backend, API и 1С согласуются с Алексеем; неизвестные контракты остаются `OPEN`. Ответственность разделяется, параллельные агенты и worktree автоматически не создаются.

Внешние продуктовые статусы перенесены из пакета правил от 04.11.2026; Drive/Figma при этой настройке не перечитывались. Перед продуктовым изменением проверить CURRENT. Репозиторий сейчас PUBLIC, а пакет предполагает приватный: [открытый вопрос](docs/DECISIONS.md).

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

Firefox и WebKit используют штатный frosted fallback без преломления. Reduced-motion отключает перелёт и наклон; forced-colors использует системную поверхность. Проверены именно движки Playwright на Windows, не физические устройства Safari/iOS.

## Границы пробы

Учебные заказы без API, 1С и сохранения настроек. Бизнес-логика, статусы, Sidebar, Tabs, утверждённая кнопка, Overflow Menu и Figma не изменялись. По умолчанию остаётся обычный Select; матовый97% — opt-in для сравнения. Точное совпадение со сложным renderer прототипов не заявляется: ограничения штатной библиотеки перечислены в отчёте материала.

[Исходный аудит и контрольные суммы](STAGE_234k_AUDIT.md). Ревизия: **2026-11-04**, следующая: **2026-11-18**.
