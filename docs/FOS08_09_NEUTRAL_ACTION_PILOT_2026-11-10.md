# FOS08/09 — план нейтральных Action, волна B

Текущее Owner-решение Screenshot_6: Plus повторяет анимацию выбранного Secondary через общий quiet preset. Отдельные поправки Plus отменены; [актуальные результаты](FOS08_09_REPORT_2026-11-10.md). Это DEV-пилот, не приёмка/rollout всех controls.

Owner явно отклонил визуальный результат ac7e5dc: **FOS08/09 — OWNER VISUAL NOT ACCEPTED**. Текущий этап — только контрольный Plus с анимацией самой поверхности; [RCA, границы и план](FOS08_PLUS_SURFACE_MOTION_2026-11-10.md). DEV `?view=plus-motion`; Client New требует DEV-флаг `actionPalette=neutral-pilot`. HeaderAction и остальные FOSAction сохраняют прежнюю реакцию до приёмки Plus. Motion использует существующие Track/spring и один FosGlassMaterial, frozen FE11/GlassLens не меняются. Предыдущие QA/CI ниже относятся к прежнему source и не означают визуальную приёмку.

> Выполнение: superpowers:executing-plans, последовательно с проверяемыми этапами. Owner поручил продолжить очередь 03→08/09. Это DEV-пилот палитры, не разрешение менять frozen FE11 или распространять материал на все экраны.

**Цель:** сравнить существующий и нейтральный Plus/HeaderAction/FOSAction при сохранении размеров, общего press helper, иерархии, доступности и обычных consumers.

**База:** основная папка, ветка `feat/fos03-manager-spacing-pilot`, head97de0bd, main7b17db6. Продолжаем одну волну B (03/08/09) в PR34, без новой параллельной ветки/worktree и без merge. PR33 остаётся отдельным Draft. Рабочий код чист; Screenshot_1.png/2.png Owner сохраняются вне поставки. Решение о размере статуса14/12 сохраняется.

**Источники:** исходное ТЗ10.11, FOS08/09; Drive CURRENT modified2026-11-10T14:09:37.549Z перечитан, WaveB и visual gates прежние. Figma file7rvIYc6yj3OA7gxmf1xJbv, session60c656a0-46b4-4e51-bbdd-b5a771a70efe. Primary masters/variant/context/screenshots прочитаны, canvas не изменён.

## Карта до JSX и границы

| Figma → React | Решение | Вариант / потребители |
| --- | --- | --- |
| SectionAdd1986:774, круг1986:775, Plus1548:452 → SectionAddItem | EXTEND palette, REUSE FOSAction + FosGlassMaterial + useDirectionalPress | Legacy SVG/default остаётся; neutral только DEV Client New и стенд. Hit44, circle34, glyph24/штрих14 |
| HeaderAction1953:4168 / Save1941:673; Compact2173:1425 → HeaderAction | EXTEND palette, REUSE существующий FosGlassMaterial для нейтральной поверхности и текущий press helper | Wrapper68/compact48, circle48, glyph24, подпись12/16; только DEV стенд |
| FOSAction835:259, Secondary835:243 → FOSAction | EXTEND palette/round geometry, REUSE current material/helper | Pill44/compact40 и hierarchy primary/secondary/tertiary сохраняются; round44/circle34 для SectionAdd |
| Accepted neutral FosGlassMaterial → все три | REUSE без правки пяти frozen файлов/manifest | tone neutral; один material layer, прежний spring/helper, без копий SVG filters и engine |

Source observations: SectionAdd — статический SVG34 и CSS Plus, без press helper. HeaderAction — синие gradient/shadow pigments в отдельной CSS coat. FOSAction Secondary уже tone neutral, но centerColor240248255 и shadow/border цветные; Primary hover синий. Это воспроизведённые источники, не доказательство принятой новой палитры.

Варианты: общий rollout сейчас (нарушает visual gate); экранные CSS override (дублируют источник); opt-in palette в существующих компонентах + изолированный стенд (выбран). Palette guard внутри компонентов DEV-only, default/reference сохраняет прежний вид. Общие нейтральные color tokens живут в одном scoped CSS. Primary остаётся тёмной, Secondary прозрачной, Disabled различимым. Новые значения — PROPOSED / OWNER OPEN, не новая утверждённая DS.

## Малые проверяемые задачи

- [x] Git/Drive/Figma, masters/variants/screenshots, границы/freeze и consumers проверены.
- [x] Baseline: Client New Plus и текущие control states; сохранить raw screenshots/геометрию и hashes.
- [x] RED: нейтральный Plus должен иметь один общий material layer и directional press, фактически SVG; новый DEV lab отсутствует.
- [x] Shared palette: один ActionPalette contract и scoped tokens; HeaderAction/FOSAction opt-in; default без визуальной миграции.
- [x] SectionAdd: собрать neutral round из FOSAction (44/34/24), переиспользовать Plus и helper; DEV Client New opt-in, Manager не мигрировать.
- [x] Стенд `?view=neutral-actions`: reference/neutral, Primary/Secondary/disabled, два фона, lab counters, keyboard/touch/press; без бизнес-операций.
- [x] GREEN: five widths1440/1024/768/390/320; browser engines/touch; keyboard/Escape/cancel/disabled, forced colors, reduced motion, fallback, geometry/overflow/axe/contrast; ordinary consumers и реальный production probe.
- [x] Build и подходящие shared regressions последовательно (предыдущие параллельные suites давали browser crashes); independent read-only QA, freeze5/5, raw before/after и LIVE docs в этом PR.
- [ ] Owner принимает палитру/материал контрольных Plus/HeaderAction/FOSAction; только затем распространение/синхронизация DS по разрешённой поставке.

**Файлы:** action-palette.ts/css; существующие HeaderAction, FOSAction, SectionAddItem; DEV NeutralActionsLab.tsx/css и App dev entry; OrderComposer только opt-in Client Plus; focused tests/config и соответствующий CI step/artifacts. Не менять физические формулы/параметры useDirectionalPress, glass-motion, GlassLens, frozen material или menu14/18/500. После воспроизведения Safari pointerdown→blur уточнён только логический onBlur guard общего helper: captured pointer завершается up/cancel/lostcapture, keyboard blur по-прежнему завершает keyboard press.

**Проверка источника:** старые Figma frames сохраняют dark Primary/light Secondary. Пилот — новое нейтральное покрытие по заданию08/09, не утверждение pixel parity с прежней окраской. Disabled/readability и отсутствие второго shader слоя проверяются отдельно. Backend/API/1С, статусные переходы, дата, ACL, storage не затрагиваются.

## Приёмка и rollback

Компонентный pilot ≠ Owner accepted screen ≠ merged. Normal UI/reference и production не включают palette. Откат — убрать DEV opt-in callsites/route; existing defaults независимы. До Owner visual acceptance обе задачи08/09 остаются OWNER OPEN даже при green QA. Разрешение на merge отдельно.

Уточнение проверки: initial mask/forced-color defects исправлены source-level; native hit-test круглой44 цели не включает квадратный угол6/6, тест использует подтверждённую точку12/12. Lost capture проверяется после gotpointercapture, не до его обработки браузером. Независимый WebKit probe подтвердил нейтральный Plus и существующий HeaderAction. Все36 component tests PASS перед финальным touch tap/full прогоном.

Итог:36/36 focused (включая tap),566 PASS/4skip full,build/production PASS,8 raw PNG,source14/14/frozen5/5. Independent palette/helper review READY; Owner palette gate и новый CI отдельно. scripts/fos0809-review.cjs воспроизводит snapshots/production probes/hashes. [Полный результат](FOS08_09_REPORT_2026-11-10.md).
