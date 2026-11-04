# Flexomir OS — общий материал стекла

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

Итог: build и оптический gate PASS; **38/38 Select**, **30 material PASS +2 Chromium-specific skip**. Axe0 violations в проверенной области; incomplete раскрыты в отчёте. Контраст пунктов обычного ≥4.83:1, матового ≥9.79:1. [Сводка](output/playwright/fos-material/summary.json).

Firefox и WebKit используют штатный frosted fallback без преломления. Reduced-motion отключает перелёт и наклон; forced-colors использует системную поверхность. Проверены именно движки Playwright на Windows, не физические устройства Safari/iOS.

## Границы пробы

Учебные заказы без API, 1С и сохранения настроек. Бизнес-логика, статусы, Sidebar, Tabs, утверждённая кнопка, Overflow Menu и Figma не изменялись. По умолчанию остаётся обычный Select; матовый97% — opt-in для сравнения. Точное совпадение со сложным renderer прототипов не заявляется: ограничения штатной библиотеки перечислены в отчёте материала.

[Исходный аудит и контрольные суммы](STAGE_234k_AUDIT.md). Ревизия: **2026-11-03**, следующая: **2026-11-17**.
