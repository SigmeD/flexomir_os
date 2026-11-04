# Glass Select — тема, материал и проверка

2026-11-03. Техническая проверка выполнена; визуальная приёмка пользователем **OPEN**.

[Обычный Select](http://127.0.0.1:5173/?glass=current) · [матовый97%](http://127.0.0.1:5173/?glass=matte) · [отдельная линза](http://127.0.0.1:5173/?view=material).

## Первопричина

Исходный Select предназначен для тёмного демо: Tailwind `text-white` / `text-white/80` перекрывали наследуемый тёмный текст светлой страницы. Tailwind работал корректно. Root не задавал явную тему; библиотека дополнительно учитывает class/data-theme и ОС. Popup находится в body portal, поэтому локальные переменные контейнера не охватывали его.

Отсутствие изгиба имело отдельную причину: stock Select использовал GlassSurface — штатный frosted фон без displacement. Позднее подключённый Glass создавал refraction, но материал ещё задавался отдельно от общего Flexomir. Теперь Select использует единый FosGlassMaterial на готовом GlassLens, проверенный сначала отдельно над HTML-заказами. [Разбор эталонов, устройство, параметры и оптические доказательства](fos-glass-material.md).

## DevTools: фактические правила

| Свойство | До исправления | Сейчас | Источник сейчас |
| --- | --- | --- | --- |
| color trigger/option | white / white80% | rgb(21,56,76) | --gs-foreground, общие селекторы glass-select.css |
| trigger background | white5% | rgba(239,247,251,.94); matte #F9FBFC/.97 | --gs-trigger / --gs-matte-surface |
| border trigger | white12% | rgb(98,133,153) | --gs-border |
| opacity | Текст1; popup0/1 | То же | inline GlassSelectContent |
| color-scheme | normal, тема неявная | light; явный dark тоже поддержан | index.html data-theme и root theme Select |
| popup backdrop | blur без изгиба | Один url(#filter) blur(3px) saturate(1.5) brightness(1.05); matte blur10 | Неизменённый GlassLens в glass.tsx |
| матовый центр | Отдельный слой чтения | Общий coat FosGlassMaterial, #F9FBFC/68% либо97% | fos-glass-material.css + root theme tokens |
| popup shadow | Несколько прежних декоративных правил | Одна мягкая внешняя тень | --fos-menu-shadow |

[Исходные matched rules](../output/playwright/glass-select-theme/before/devtools.json) сохранены как доказательство первопричины. Актуальные Chromium CDP: [обычный](../output/playwright/glass-select-theme/fos-current/devtools.json), [матовый](../output/playwright/glass-select-theme/fos-matte/devtools.json). Содержат computed color/background/opacity/color-scheme, inline styles, селекторы, файлы и строки правил. Native UA-проверка библиотеки не узнаёт стандартный HeadlessChrome; QA использует профиль Desktop Chrome, чтобы действительно включать refraction.

## Общая настройка

Цветовые переменные находятся на root и наследуются body portal. Приоритет .dark/.light, затем data-theme, затем ОС согласован с Website Glass. Нет индивидуальных цветов для отдельных пунктов.

Весь материал находится в FosGlassMaterial. Select передаёт strength/blur/dome и параметры общей темы: обычный68%/rim12px, матовый97%/rim2px, dark94%/rim2px. Резкие labels расположены выше оптики; scroll viewport не имеет собственной матовой подложки. Уменьшенная кромка dark предотвращает широкие светлые полосы на светлом хосте. `tint` публично сохранён: default.6, alpha центра масштабируется на tint/.6; прежняя внутренняя формула Glass больше не применяется. Нестандартный tint требует отдельной проверки контраста.

Controlled value/onValueChange, uncontrolled defaultValue, строковые подписи, placeholder, портал, outside click, Escape, Arrow/Home/End, preventDefault потребителя, фокус и прокрутка сохранены. Матовый остаётся opt-in. Статусы/данные/выражение фильтрации и утверждённые соседние компоненты не менялись.

## Итог проверки

- `npm run build`: PASS.
- `npm run test:e2e -- --workers=2`: **38 passed,0 failed,0 skipped**, Chromium1440×900 и390×844. Финальный прогон сравнивал14 PNG без обновления эталонов.
- `npm run test:material`: **30 passed,0 failed,2 skipped**, Chromium desktop/mobile, Firefox и WebKit. Два skip относятся только к Chromium-specific forced-colors emulation.
- `npm run verify:material-optics`: PASS. Настоящий разделитель смещён на1px при неизменных DOM rects. Сравниваются strength0/.1/.6 и диагностический SVG scale0.
- Все5 статусов: точные количества5/2/2/1/0; Escape/outside click/keyboard/API/scroll — PASS. Ошибок консоли в проверенных сценариях нет.
- Reduced-motion: перемещение сразу к цели без анимации/наклона. Firefox/WebKit: живой frosted fallback, доступный Select, выбор с клавиатуры и axe. Проверены движки Playwright Windows, не реальные Safari/iOS.

| Контраст из фактических computed colors | Минимум |
| --- | --- |
| Светлый trigger | 9.99:1 |
| Placeholder | 5.22:1 |
| Светлые пункты обычного, включая hover/focus | 4.83:1 |
| Матовые пункты, включая hover/focus | 9.79:1 |
| Dark пункты, включая hover/focus | 9.10:1 |
| Граница trigger | 3.19:1 |

Консервативный расчёт берёт чёрный/белый фон под общим верхним coat чтения, его alpha и фон hover/focus. Это ограничивает любую композицию нижних бликов и backdrop. Область текста начинается за полной частью coat (14px от края при rim12px); расчёт не относится к декоративной кромке. Focus outline2px с контрастом≥3:1 проверен отдельно.

Axe:0 violations в scope Select/portal, contrast rules включены. `incomplete` для градиентов и aria-controls не скрыты: существование listbox проверяется отдельно, контраст рассчитан отдельно. Доступность остальной страницы и screen reader вручную не проверялись. [Сводка измерений](../output/playwright/fos-material/summary.json), [полный Select JSON](../output/playwright/glass-select-theme/results.json), [полный material JSON](../output/playwright/fos-material/results.json).

## Актуальные снимки

- Обычный desktop: [закрыт](../output/playwright/glass-select-theme/fos-current/closed.png), [открыт](../output/playwright/glass-select-theme/fos-current/open.png).
- Матовый desktop: [закрыт](../output/playwright/glass-select-theme/fos-matte/closed.png), [открыт](../output/playwright/glass-select-theme/fos-matte/open.png).
- Mobile: [обычный открыт](../tests/glass-select-visual.spec.ts-snapshots/select-light-open-chromium-390-win32.png), [матовый открыт](../tests/glass-select-visual.spec.ts-snapshots/select-matte-97-open-chromium-390-win32.png).
- [Dark палитра на светлом хосте](../tests/glass-select-visual.spec.ts-snapshots/select-dark-open-chromium-1440-win32.png), [keyboard focus](../tests/glass-select-visual.spec.ts-snapshots/select-light-focus-chromium-1440-win32.png).
- [Одна настроенная линза над HTML-заказами](../output/playwright/fos-material/reference/fos-material.png).

Снимки открытого Select просмотрены: текст резкий, тень не обрезана, matte97% скрывает надписи заказов. Обычный вариант намеренно прозрачнее. Эталоны — техническая база сравнения, не утверждение владельцем дизайна. Исходные снимки до исправления сохранены отдельно в before.

`glass.tsx`, `glass-motion.ts`, `src/styles.css` сохранены побайтно. Контрольные суммы — в [аудите](../STAGE_234k_AUDIT.md); полный список изменённых файлов этой задачи — в [отчёте материала](fos-glass-material.md#изменённые-файлы-этой-задачи).

Ревизия: **2026-11-03**, следующая: **2026-11-17**.
