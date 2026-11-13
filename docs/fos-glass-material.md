# FosGlassMaterial — исходники и критерии

Назначение: низкоуровневый материал, исходники и исторические доказательства. Ответственный: Codex/frontend. Актуальная проверка 14.11.2026. Frozen engine FE11-v0.2 принят Owner; текущие consumers и приёмка U06 описаны в [едином контракте](UI_UNIFICATION_2026-11-13.md#u06-перенос-семейств-после-приёмки-пилота). Доказательства от 03.11 ниже — история, не текущая очередь.

## Текущий API потребителей

Экраны и общие адаптеры выбирают назначение через `FosMaterialSurface variant=...`: document-preview, navigation/reference, segment/reference, popup, account-trigger, date-cell, action/round/quiet/header и demo-panel. Optical values/defaults принадлежат одному внутреннему preset source; публичные `style`, blur/strength/rim и другие optical overrides отсутствуют. Варианты navigation дополнительно принимают только существующие `layoutTop`, `travelY`, `onTravelFrame`. Нативные class/ARIA/data/content сохраняются. Неизвестные и унаследованные имена presets отклоняются до рендера материала.

Прямой `FosGlassMaterial` остаётся внутри semantic adapter, frozen `FosPopupRows` и низкоуровневого `GlassMaterialLab`. Это явные границы ответственности: optics lab проверяет сырой engine API, а frozen источник нельзя менять ради миграции. Физика, формулы и manifest прежние. Подробные props/states/consumers и before/after находятся в едином контракте выше.

## Хранение доказательств

Все ссылки этого документа в `../output/` ведут на локальные результаты от 03.11.2026. Они исключены из Git и отсутствуют в свежем клоне. Результаты и HTML-эталоны при уборке 04.11.2026 сохранены; новая сборка и браузерные проверки не выполнялись. Версионируемые PNG в `tests/glass-select-visual.spec.ts-snapshots/` — входные эталоны сравнения, а не результаты нового прогона.

Для новых доказательств сначала запустить приложение по [README](../README.md#запуск-и-проверки). Команды ниже выполняются в другом терминале из корня проекта. Репортёры и оптический скрипт используют фиксированные пути: перед повторным запуском сохранить нужные прежние результаты отдельно и записать дату, commit и команду нового прогона. Старый отчёт не подтверждает новый прогон.

| Что получить | Команда | Локальный результат |
| --- | --- | --- |
| Пиксельные измерения оптики | `npm run verify:material-optics` | `output/playwright/fos-material/optics/` |
| Material: браузерные проверки | `npm run test:material` | `output/playwright/fos-material/results.json` |
| Select: функциональные и визуальные проверки | `npm run test:e2e -- --workers=2` | `output/playwright/glass-select-theme/results.json` и снимки в `output/playwright/glass-select/` |
| Select: новые CDP-данные и снимки | `node scripts/inspect-glass-select.cjs review-current` и `node scripts/inspect-glass-select.cjs review-matte` | Отдельные каталоги `review-current/`, `review-matte/` в `output/playwright/glass-select-theme/` |
| Сравнение с исходными HTML | `node scripts/capture-fos-material-reference.cjs` | `output/playwright/fos-material/reference/` |

Последняя команда требует двух файлов по жёстко заданным путям: `D:/downloads/Flexomir_Lens_225.html` и `D:/downloads/Flexomir_V3_Liquid_Glass_215_REUPLOAD (1).html`. Они существуют на этой машине, но не поставляются с репозиторием. На другой машине сначала получить утверждённые эталоны по [карте источников](SOURCES.md), сверить SHA256 ниже и обеспечить эти пути. Это ограничение скрипта; при отсутствии файлов сравнение с HTML — `NOT RUN`, остальные проверки выполняются отдельно.

`summary.json` — сохранённая сводка прежнего прогона; отдельного генератора в репозитории нет. Новые команды дают собственные JSON и не пересоздают эту сводку автоматически. Каталог `before/` содержит исторические данные до исправления: текущим кодом их воспроизвести нельзя. Эти доказательства сохранены, а завершённые пошаговые планы убраны; их история доступна в Git.

## Эталоны

| Источник | Что используем | Что исключаем |
| --- | --- | --- |
| `D:/downloads/Flexomir_Lens_225.html` | Высота линзы 48px, радиус18px; выбранная строка, пружинный перелёт и наклон; направленный свет слева | `scene-backdrop`, диагностические линии/сетка, `getImageData/putImageData` и Canvas-рефракция нарисованной сцены |
| `D:/downloads/Flexomir_V3_Liquid_Glass_215_REUPLOAD (1).html` | Более новый эталон взаимодействия: единое направление резких иконки/подписи к контакту, рост отклика от удержания, reduced-motion | Canvas/WebGL сцена, SDF-шейдер и пиксельный renderer |
| `D:/downloads/flexomir_glass_2_1_4.html` | Только сравнение с 2.1.5 | Старое раздельное смещение glyph3.65px и label2.12px; hover-примесь к движению содержимого |

2.1.5 исправляет это на почти одинаковые смещения glyph4.00/3.00px и label3.93/2.94px. Hover не двигает содержимое, удержание насыщается за850мс через `0.18 + 0.82*(1-exp(-ms/370))`. Эти параметры описывают взаимодействие кнопки, а не новый оптический движок. Утверждённая кнопка не меняется.

## Отделённые параметры Sidebar2.2.5

| Группа | Значения из исходника |
| --- | --- |
| Форма | Один rounded rect; высота48px, radius18px, внешние поля по4px |
| Направленный свет | key-x17%, light-y28%, sweep-y22%; белый свет0.29; кромка слева0.61, справа0.18 |
| Кромка | border rgba(133,169,191,.38), верхний блик white.92, нижняя холодная линия rgba(98,151,181,.16) |
| Тень | x1.6px; y4–5px/blur3/alpha.075 и y8/blur13/alpha.045 |
| Движение | k265, damping `2*sqrt(k)*.93`; время440мс по умолчанию; tilt от скорости `clamp(-velocity*.033,-3.6,3.6)` |
| Пружина наклона | k190, damping27; scale не более1.009 |
| Текст потребителя | label1.043, icon1.022, badge1.038 — не часть общего оптического материала |
| Исходная Canvas-оптика | Сдвиг по нормали `6.8*rim + .35`px и band13px; переносится как ориентир, не код renderer |

## Проверка архивов

В `D:/downloads` найдены `Flexomir_Stage234k_WebsiteGlass_React_Source.zip` (исходный React-пилот/аудит) и `FLEXOMIR_MANAGER_HANDOFF_2026-10-31.zip` (Manager/UX handoff, не исходник оптического материала). `liquid-glass-tab-bar.zip` — отдельный сторонний renderer; он не используется. Отдельного Flexomir Liquid Glass ZIP с 2.2.5/2.1.5 в этой папке не найдено; предоставленные HTML и GIF2.2.5 доступны напрямую. Бизнес-документы и Figma не меняются.

Контрольные суммы SHA256:

```text
Flexomir_Lens_225.html
A8F5D2EB459DA78DC87484FCD03C31FEE4D4A856C2489E632CD6192A9DC24990
Flexomir_V3_Liquid_Glass_215_REUPLOAD (1).html
B70CBAE2FDC13F67F77109FA990BE1146AB64E610F3D1A3026DB1468CC045DB2
flexomir_glass_2_1_4.html
BC8356BF2DB31AC242AF039CDB9AFEF5843530A16BC88C6D86FFB22D72F5C958
```

## Установленный Website Glass

`Glass` даёт автоматическое измерение размера и встроенный фон/кромку; `GlassLens` — отдельную линзу заданного размера со стандартным `style`; `GlassSurface` — frosted fallback без displacement. Все используют существующий `glass.tsx`. Native Canvas строит только карту смещений, не изображение DOM. Источник `feDisplacementMap` — live backdrop.

Выбран `GlassLens`: размер адаптер получает от ResizeObserver; резкое содержимое располагает поверх него отдельным DOM-слотом. Внешний свет/тени задаются общим материалом. Никаких собственных SVG-фильтров, displacement-карт или Canvas-сцен.

Конкретные ограничения установленной версии:

1. Оба native strength0 оставляют `scale=8`, а не0. Адаптер в нулевом режиме использует стандартный `style.backdropFilter` без url; остальной pipeline тот же: Chromium blur/saturate/brightness, fallback blur не менее6px/saturate без brightness. SVG движка не переписывается.
2. Strength одновременно управляет величиной сдвига и шириной кромки. Независимого band/splay API нет; точное совпадение Canvas-профиля2.2.5 не обещается.
3. Направленное вдавливание/жидкий counterflow из2.1.5 не доступны как props. Перенос их SDF был бы альтернативным движком и не выполняется. Пружинный перенос/наклон материала возможен готовыми `Track/spring` из glass-motion.
4. Реальное SVG backdrop-преломление проверяется в Chromium. В Firefox/WebKit проверяется реальный frosted fallback, а не имитация преломления.

## Реализация и проверка по порядку

Одна линза над настоящими строками заказов, без Select/меню/синтетической сетки. Сначала сравнить strength0/0.1/0.6 по положению реальных линий и текста в PNG, с неизменёнными DOM rects. Затем настроить свет/матовость/движение по2.2.5. Только после успешной проверки использовать тот же адаптер внутри Select, сохранив клавиатуру, фильтрацию и calm97% preview. Визуальное совпадение с эталоном не объявлять утверждённым автоматически.

Эта последовательность выполнена. [Отдельная линза](http://127.0.0.1:5173/?view=material) использует настоящие `article/strong` и обычные границы строк из существующего массива заказов. Оптический этап `phase=optics` отключает оформление адаптера и blur в Chromium, чтобы отдельно увидеть изгиб, а не принять рамку/размытие за преломление.

| Измерение | strength0 | strength0.1 | strength0.6 |
| --- | --- | --- | --- |
| Положение настоящего синеватого разделителя в PNG сцены, y | 77px | 77px | 78px |
| Доминирующая локальная особенность текста, x | 27.34px | 32.73px | 33.01px |
| DOM-координаты линзы, линии и текста | Одинаковые | Одинаковые | Одинаковые |

Изолированная диагностика при strength0.6 с `feDisplacementMap.scale=0` **только в тестовом браузере** возвращает линию на77px. Следовательно, настоящий разделитель сдвигается на1px именно SVG-фильтром, а не тенью. Профиль текста меняется на5.67px; это расстояние между доминирующими особенностями локального профиля, **не сопоставление одного и того же штриха буквы**. При0.1 эта конкретная линия ещё не попадает в изменившуюся часть кромки; монотонный сдвиг всех пикселей не обещается. У сильной линзы возможны обрезание и дробление текста под самой кромкой — свойство штатного профиля; меню использует отдельный резкий foreground.

Исходные PNG: [нулевой](../output/playwright/fos-material/optics/strength-0.png), [0.1](../output/playwright/fos-material/optics/strength-0-1.png), [0.6](../output/playwright/fos-material/optics/strength-0-6.png), [диагностика scale0](../output/playwright/fos-material/optics/native-scale-zero.png). [Полные профили и геометрия](../output/playwright/fos-material/optics/metrics.json). Изменение HTML-подписи дополнительно проверяется по PNG-участку, полностью находящемуся внутри линзы; карта смещений при этом остаётся прежней. `pngjs` используется только для чтения пикселей доказательства.

## Настройка общего материала

`FosGlassMaterial` измеряет собственный размер через ResizeObserver и создаёт ровно один native GlassLens. `children` находятся в отдельном резком DOM-слоте. Существующий декоративный coat библиотеки получает общий свет/цвет; дополнительного стеклянного элемента или второго backdrop-filter нет. Единственный общий `!important` заменяет inline background этого coat, не касается SVG.

Параметры адаптера: `strength`, `blur`, `dome`, `radius`; `lighting="native"|"sidebar"`; `centerOpacity`, `centerColor`, `rimWidth`; `shadow="native"|"reference"|"menu"|"none"`; `motion="none"|"travel"`, `travelY`. Цвет, alpha и ширина кромки принимают CSS-переменные темы. В лаборатории:261×48px/radius18, strength.1, blur1.5, dome0, центр16%, reference shadow. Режим `menu` даёт одну мягкую внешнюю тень; геометрия Select определяется содержимым.

Пружины — готовые `Track/spring` библиотеки с параметрами из2.2.5. Повторный клик меняет live target работающего драйвера, сохраняя скорость. Регрессионный тест с Playwright clock обнаружил прежний сброс скорости (ошибка следующего шага2.89px) и проходит после исправления. Это перенос параметров движения, не побитовое совпадение временной кривой исходного Canvas-demo: его speed slider/полный renderer не переносились.

[Исходный Sidebar2.2.5](../output/playwright/fos-material/reference/sidebar-225.png), [кнопка2.1.5](../output/playwright/fos-material/reference/button-215.png), [настроенный материал](../output/playwright/fos-material/reference/fos-material.png), [измерения и trace движения](../output/playwright/fos-material/reference/comparison.json). Сравнены исходные HTML, а не перерисованные изображения. Размер, radius, левый источник17% и значения теней совпадают; итоговая композиция света/преломления остаётся приближением в пределах API Website Glass.

## Select использует этот же адаптер

`GlassSelectContent` делегирует материал `FosGlassMaterial`, сохраняя портал, события, выбор, фокус, прокрутку и keyboard API. Foreground viewport не имеет собственного матового слоя/фильтра. Root theme передаёт общие цветовые параметры в body portal:

| Профиль | Центр | Кромка чтения | Native strength / blur / dome |
| --- | --- | --- | --- |
| Светлый обычный | #F9FBFC /68% | 12px | .62 /3px /.08 |
| Светлый матовый | #F9FBFC /97% | 2px | .08 /10px /0 |
| Тёмный обычный | rgb(18,34,45) /94% | 2px | .62 /3px /.08 |

`tint` остаётся публичным параметром Select с default.6. У GlassLens нет native tint prop: адаптер умножает alpha читаемого центра на `tint/.6`, с ограничением0..1. Это явная адаптация API, а не прежняя внутренняя формула Glass (`max(tint*.4,.04)`). Нестандартные значения tint требуют отдельной проверки контраста; приведённые проверки относятся к default.6.

Матовый97% сохраняется opt-in. Обычный вариант намеренно показывает больше фона для сравнения. Новые настройки не распространялись на утверждённые компоненты. [Отчёт Select и DevTools](glass-select-check.md).

## Проверки и воспроизведение

Финальный прогон: build PASS, optics gate PASS; Select **38/38 PASS**, material **30 PASS/2 SKIP/0 FAIL**. Пропуски только forced-colors вне Chromium. Консервативный минимум текста пунктов: обычный4.83:1, matte9.79:1, dark9.10:1. Axe0 violations в scope Select/portal; incomplete по градиенту/aria-controls раскрыты в отчёте Select. [Сводка](../output/playwright/fos-material/summary.json).

- `npm run verify:material-optics`: проверяет настоящий разделитель, локальный текстовый профиль, одинаковые DOM rects и чистую консоль.
- `npm run test:material`: Chromium1440/390, Firefox и WebKit. Нулевая/активная оптика, live HTML внутри линзы, resize, пружина/быстрый retarget, reduced-motion, доступный Select/fallback. Forced-colors эмулируется только в двух Chromium-профилях; два соответствующих случая Firefox/WebKit явно пропускаются.
- `npm run test:e2e -- --workers=2`: все статусы, public API, keyboard, axe, контраст и14 PNG Select. Визуальные эталоны открытого состояния обновлены под общий адаптер после осмотра; закрытые состояния не изменились.
- `node scripts/capture-fos-material-reference.cjs`: сохраняет реальные исходные HTML-эталоны, адаптер и измерения движения.
- `node scripts/inspect-glass-select.cjs fos-current` / `fos-matte`: CDP computed styles и matched rules, axe, закрытый/открытый снимки. Снимок делается до диагностических color-contrast проб axe.

Playwright отчёты и traces имеют отдельные outputDir. Vite не следит за `output`, `test-results`, tsbuildinfo и документацией: прежнее наблюдение вызывало лишние навигации в середине тестов. Запись контрольного HTML-артефакта проверена:0 перезагрузок страницы. Это настройка среды QA, не изменение интерфейса.

Документация проверена через Context7; Website Glass в каталоге не найден после двух запросов, поэтому API сверены с [официальной страницей Glass](https://websiteglass.com/docs/components/glass) и установленным исходником. Конфигурация watcher сверена через Context7 `/vitejs/vite/v6.4.5`. Native refraction Chromium и frosted fallback Firefox/WebKit соответствуют опубликованным ограничениям библиотеки. Реальные Safari/iOS и screen reader вручную не проверялись.

## Изменённые файлы этой задачи

- Новые `src/components/ui/fos-glass-material.{tsx,css}`, `src/GlassMaterialLab.tsx`, `src/glass-material-lab.css`.
- `src/App.tsx` — только вход в отдельную лабораторию с теми же заказами; данные/выражение фильтрации сохранены.
- `src/components/ui/glass-select.{tsx,css}` — делегирование материала и параметры общей темы.
- `tests/fos-glass-material.spec.ts`, `playwright.material.config.ts`, default `playwright.config.ts`; helper контраста, matte test и6 открытых PNG Select.
- `scripts/verify-fos-material-optics.cjs`, `scripts/lib/material-pixels.cjs`, `scripts/capture-fos-material-reference.cjs`, актуализированный CDP-скрипт.
- `package.json`/lock — pngjs и типы как devDependencies, команды проверок; `vite.config.ts` — исключение артефактов из watcher.
- README и отчёты — инструкции и доказательства; завершённый пошаговый план сохранён в истории Git.

Независимая read-only ревизия повторно проверила жизненный цикл драйверов, fallback, границы pixel test, общий материал Select и консервативный расчёт контраста; оставшихся блокирующих замечаний нет. Это техническая проверка, не визуальная приёмка владельцем.

Ревизия документа: 2026-11-04. Следующая: 2026-11-18. Результаты runtime QA выше относятся к 03.11.2026.
