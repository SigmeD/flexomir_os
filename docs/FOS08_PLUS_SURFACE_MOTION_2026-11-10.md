# FOS08/09 — RCA и контрольный Plus: анимация самой поверхности

Последнее решение Owner по Screenshot_6: откатить отдельные настройки Plus и использовать ТОЧНО анимацию показанного Secondary. Специальный hover без scale и рост штрихов14→16 отменены. Plus и Secondary используют один preset и одну формулу pressure/hover: material scale1.012, content scale1.02, та же тень, press/release. Без shape-specific коэффициентов. Дополнительный внешний rim/shadow на target44 остаётся убран. Отдельный тест сравнивает реальные hover matrices/content/shadow двух controls.

Owner Screenshot_4: дополнительный hover-ободок воспроизведён RED-тестом. Причина — outer shadow 0/3/2.5px на target44, отдельно от glass34. Neutral SectionAddItem теперь по умолчанию использует quiet preset; legacy оставлен только для сравнения. Тот же preset установлен на DEV neutral Secondary. Обычный palette=reference и production не мигрируют. Никакой второй тени/обводки на target44; клавиатурный focus-visible сохраняется.

> **OWNER VISUAL NOT ACCEPTED.** Тот же Wave B / Draft PR34. Последнее уточнение Owner по Screenshot_3: спокойный neutral matte preset, один внешний контур, одна мягкая тень, лёгкий hover/text scale и упругое сжатие. «Без роликов» — итог сдаётся через живой DEV-стенд и статичные состояния. HeaderAction и глобальный rollout до приёмки закрыты.

## Действующее решение

Figma SectionAdd1986:774 задаёт hit44 / glass34 / glyph24. Новый Owner-текст уточняет материал и motion; Figma masters не редактируются. Frozen FE11-v0.2, glass-motion.ts и существующий GlassLens остаются read-only.

Source-of-change для двойного контура: FOSAction button border + sidebar coat border на существующем GlassLens, а reference shadow добавляла inset rim. Предыдущая проба поверхности также давала избыточный объём. Убраны именно лишние paint layers в новом consumer preset: lighting=native отключает sidebar coat; shadow=none отключает тени GlassLens; на material root остаётся один border и одна внешняя тень. Без копирования/переопределения frozen CSS.

FosActionMaterial хранит fixed preset; FOSAction/SectionAddItem не собирают low-level параметры. Цвета — ахроматический RGB: белый прозрачный backing, серый rim, чёрная тень. Dome0, без новых pointer-glints. Plain existing GlassLens sheen сохраняется; новый оптический engine не создаётся.

useActionSurface — адаптер двух существующих Track/spring (pressure/hover), без своего RAF-интегратора. В opt-in режиме legacy content RAF useDirectionalPress не запускается. Hover: surface1.012, content1.02, мягкая тень; hit target не двигается. Press: лёгкое сжатие реальной поверхности и тени, малый tilt≤.6deg. Release сохраняет spring velocity. Короткий tap/Enter получает минимальный контакт100ms, touch не зависит от hover. Cancel/lostcapture/blur/media/disabled/unmount очищают pressure. Reduced-motion: identity и статический outline; forced colors — системный border/цвета.

Карта: SectionAdd1986:774 → SectionAddItem EXTEND surfaceMotion → FOSAction REUSE (DEV neutral round secondary); Action835:259 → FOSAction EXTEND materialPreset в контрольном Secondary → FosActionMaterial CREATE consumer preset → FosGlassMaterial/GlassLens REUSE. Потребители: PlusMotionLab (Plus+Secondary рядом с прежними вариантами), Client Plus с DEV-флагом actionPalette=neutral-pilot. HeaderAction DEFER; neutral-actions sample row использует quiet preset для neutral Plus/Secondary; reference palette, обычные экраны и production сохраняют прежнее поведение. Ссылка из старого neutral-actions ведёт к новому эталону.

## Сокращённый публичный API — предложение после визуальной приёмки

| Назначение | Предлагаемый контракт |
| --- | --- |
| Primary | FOSAction variant=primary |
| Secondary | FOSAction variant=secondary |
| Plus/icon | FOSAction variant=icon-circle |
| Header | HeaderAction variant=neutral, action=save/add/... |
| Disabled | disabled boolean у любого варианта, не отдельный visual variant |

Форма/материал/радиус/тень — внутри preset. Существующие hierarchy/shape/palette сохраняются до согласованной миграции; не добавляем второй публичный способ конфигурации во все экраны заранее. Текущие pilot props нужны для изоляции DEV, не предложены как окончательный массовый API.

## Проверки и доказательства

- RED исходной поверхности: scaleY1 при press; output/plus-motion-red.log. RED двойного contour preset: output/plus-preset-red.log.
- Новые проверки измеряют actual material matrix/bbox/rendered pixels; один border/shadow на Plus и Secondary, native input, quicktap/key, release samples, capture/media/disabled, scoped rollout.
- Обычный HeadlessChrome попадает в frosted через существующий UA classifier. Дополнительный явный desktop-UA fixture проверяет Chromium SVG refraction, без изменения primitive. Firefox/WebKit — штатный fallback. Mode фиксируется в наблюдениях.
- Итоговые статичные PNG/performance: output/playwright/plus-motion/static/index.html, observations.json; воспроизведение: node scripts/plus-motion-review.cjs при DEV5173. Видео больше не записываются.
- Исходные результаты ac7e5dc и предыдущей глубокой surface-пробы — история, не QA нового quiet preset. Первый полный прогон остановлен после нового Owner direction; не выдаётся за успешную финальную регрессию.

Критерий сдачи: actual motion/pixels и lifecycle во всех4 проектах; targeted shared regression/build/prod isolation; source hashes/frozen5; независимый QA; Owner visual acceptance отдельно. Точный итог проверок — в PROJECT_STATE/HANDOFF. Технический PASS не закрывает OWNER NOT ACCEPTED и не разрешает rollout/merge.

## Источники и причина

База ac7e5dc, все6 CI SUCCESS; это техническая проверка предыдущего пилота, не визуальная приёмка. Основная папка/ветка прежние, main не меняется. Новое явное Owner-требование о поверхности выше прежней достаточности data-pressed/content-transform. Геометрия Figma SectionAdd1986:774 остаётся44 hit /34 glass /24 icon; Motion-эталон теперь создаётся по этому заданию. Frozen FE11-v0.2, GlassLens и glass-motion.ts read-only.

| Значение/узел до исправления | Реальный потребитель | Почему материал не живёт |
| --- | --- | --- |
| --fos-action-shift-x/y, --fos-action-scale | .fos-action__motion (span с содержимым) | .fos-action__glass — сосед, не получает transform; сам стеклянный DOM остаётся identity |
| --fos-action-light-x/y | Записаны на content span в begin; материал их не читает | Нет hover move handler и связи с --fos-key-x/--fos-light-y |
| scale=1-power*.025 | Содержимое; power сразу0 на release | Нет упругого pressure/release канала поверхности |
| --ha-shift/scale | Glyph; legacy псевдо-блики отключены у neutral | Новый FosGlassMaterial к этим значениям не подключён |
| FosGlassMaterial motion=none | Собственные idle tracks, baseline light28/sweep22/shadow4 | Travel предназначен для линзы навигации, не команды; подключать travelY к press неверно |
| FOSAction material shadow=none + общий hover tint.48 | Смена равномерной заливки | Неподвижный край, тень и блик; часть ощущения объёма отсутствует |

Реальное baseline-воспроизведение и PNG: output/playwright/plus-motion/baseline/observations.json; default/hover-left/hover-right/pressed/release. У материала transform=none, ключ/блик постоянны; изменяется content transform.
