# Flexomir OS · GL-03 · Compact Glass Pill Tabs

**Дата:** 04.11.2026  
**Статус:** `UX_DIRECTION_OWNER_APPROVED` → `HTML_CANDIDATE + SCOPED_CHROMIUM_QA_VERIFIED` → `OWNER_VISUAL_OPEN`  
**Область:** только фильтрация **списка заказов** на D1440/L1024/T768/M390/M320. Не замена всех Select в приложении.

## 1. Решение и причина

Owner подтвердил компактные скруглённые Pill Tabs вместо слишком широких старых Tabs **и вместо Select/Dropdown для фильтрации заказов на планшете/мобильном**. Убрать необходимость нового сложного оптического движка для выпадающего Select. На мобильном нужен горизонтальный свайп/прокрутка вкладок. Компонент должен работать при переменном числе фильтров в будущих версиях MVP.

Это новое **UX-решение** и направление для проектирования, но ещё **не утверждённый Figma-мастер, не исправленная SRS, не production React**. Исходные компоненты SidebarNav / HeaderAction / NavigationDrawer / GlassSelect не менялись.

## 2. Приоритетные источники

1. CURRENT Governance / component-first process: `07_Flexomir_OS_Project_Governance_v0.1_CURRENT`. Для **новой сложной анимации** допускается предварительная отдельная HTML-лаборатория, React-компонент — только после визуальной приёмки такой лаборатории. Старое правило «HTML для каждого экрана» заменено обновлением Owner.
2. CURRENT SRS v0.5: `03_Flexomir_OS_Requirements_SRS_v0.5_CURRENT`, реальный бизнес-контракт статусов/1C не переименовывать. Отдельный UX baseline ранее фиксировал Desktop Tabs + Tablet/Mobile native Select — требует точного Change Control и согласования ПО/владельца.
3. Визуальный эталон: утверждённый HTML `FLEXOMIR_OS_V3_STAGE2_3_3c_ACCEPTED_TABS_2026-11-03.html` (Drive `1l0NY3u2nLaSEtWksLVHK3wXEfUPYMgim`) — один горизонтальный spring и изменение ширины, текст увеличивается только когда линза приближается к выбранному элементу, hover не выбирает.
4. Общая React-оптика: принятый `FosGlassMaterial` + `GlassLens` и нейтральный `tone=neutral` из GL-02A.3 в `main`. Не создавать второй рендерер, отдельные оптические SVG/Canvas или копию исходной Sidebar Lens в production.
5. CURRENT Figma V2 — остаётся актуальным источником экрана, но **в части геометрии/расположения фильтра будет пересогласован после просмотра HTML-пилота**. Прямой read-only Figma-запрос 04.11 не прошёл из-за лимита MCP Starter; не объявлять размеры мастера проверенными.

## 3. UI contract — кандидат на Owner visual review

| Свойство | Концепт GL-03 |
|---|---|
| Внешний вид | Compact Pill — нейтральное стекло, полностью скруглённая активная капсула |
| Высота стеклянной линзы | 38px (КАНДИДАТ, не текущий DS token) |
| Область нажатия | 44px по высоте (в том числе touch) |
| Ширина | По тексту + 30px внутренних отступов; не растягивать равномерно |
| Интервал между вкладками | 4px (кандидат) |
| Активный элемент | Одна линза, нейтральные кромка/блики/тень; текст ≲1.043× |
| Hover | Только оттенок текста; выбранный фильтр не меняется |
| Click / Enter / Space | Выбор фильтра, движение одной линзы по X и изменение width |
| Мобильные D/T/M | Одна строка, native horizontal scroll, touch pan-x |
| Автопозиционирование | При выборе скрытого фильтра прокрутить минимально, без навязчивого центрирования |
| Данные | Массив `{id,label,disabled?}` и `value/onValueChange`, стабильные IDs |
| Изменение фильтров | Количество/названия не зашиваются в компонент; нет ограничений в component API |
| Удаление активного | В демо fallback «Все заказы». В продукте по бизнес-правилу, согласовать с PO |
| Семантика | В контексте фильтрации одной таблицы/списка — `role=group`, кнопки `aria-pressed`; не ложный `tablist` без `tabpanel` |
| Accessibility | Ровинг-фокус; Left/Right/Home/End меняют фокус, Enter/Space — фильтр; focus-visible; reduced motion/forced colors |

**Примечание о статусах:** «Все заказы», «Черновики», «На рассмотрении», «В работе», «Завершённые» — пользовательский набор для демонстрации. `В работе` / `На производстве` — нерешённое расхождение названия; никакой новой стадии 1C этим прототипом не вводится. Один фильтр может отображать несколько внутренних статусов.

## 4. Архитектура React после визуального gate

```text
OrderFilterDefinition[] / selectedFilter / onFilterChange
                   │
              GlassPillFilters
          ┌────────┴────────┐
  HorizontalScrollRail   PillFilterItem[]
          │                      │
  Single FosGlassMaterial     DOM label
          │
  Shared GlassLens / Neutral theme (GL-02A.3)
          │
  Horizontal spring on X + width
```

- **Общий `FosGlassMaterial` — источник стеклянного материала и преломления**. Дополнить без нарушения вертикального Sidebar привязку горизонтальной координаты и ширины через адаптер движения. Никакого отдельного CSS-рисования стекла в production.
- **Фильтры — UI-представление**, не реальные order statuses. Mapping фильтра к 1C/status fields находится в продуктовой логике; с Алексеем согласовать контракт, когда появится интеграция.
- **`GlassSelect` не удаляем**. Новый пилот заменяет Select лишь в заказной фильтрации после принятия компонента и обновления экрана/требований. Прочие Select могут использоваться в формах и других сценариях.
- Общее название *Glass Pill Tabs* — визуальная метка. Для фильтра по статусу DOM семантика кнопок; для настоящих вкладок нужна отдельная `tablist`-семантика и панель.

## 5. План и контрольные точки

1. **Discovery / source audit** — выполнено. Зафиксировано UX-решение, проверены Governance/SRS/Vision/исходный HTML и наличие React `FosGlassMaterial`.
2. **Изолированный HTML-прототип** — выполнено. Файл `GL03_Compact_Glass_Pill_Tabs_Candidate_2026-11-04.html`, без сетевых ресурсов/API/1C, с пятью демонстрационными фильтрами и тестовым добавлением/удалением до 12 шт. Модель линзы — CSS-приближение нейтрального материала; не выдавать за реальную DOM-refraction.
3. **Независимый Chromium QA HTML** — 103/103 PASS (1440/1024/768/390/320, 1 линза, визуальная геометрия, 44px touch area, выбор/доращивание spring, добавление/удаление, scroll/reveal, keyboard, touch gesture via Chrome DevTools, reduced motion, no JS errors). Реальные Safari/Firefox и физические устройства — OPEN. Скриншоты 1440, 1024, 768, 390, 320.
4. **OWNER_HTML_VISUAL_GATE — OPEN.** Оценить пропорции, плотность, нейтральность стекла, анимацию/читаемость, swipe на 390/320 и сценарий 3/5/10+ фильтров. Внести правку **в пилот**, если потребуется.
5. **Figma staging / SRS addendum + PO gate — OPEN.** Синхронизировать master, один D/T/M экран, актуализировать responsive требования, согласовать название/набор и mapping фильтров. Не изменять продуктовые статусы/1C молча. Figma MCP лимит сейчас блокирует live write.
6. **React component branch после Owner gate — OPEN.** Реализовать shared `GlassPillFilters` на принятом материале с управляемым списком/filterId и доступной прокруткой; отдельная ветка/PR, scoped browser QA и регрессия SidebarNav, HeaderAction, NavigationDrawer.
7. **One-screen integration / QA — OPEN.** Обновить один целевой экран заказов на D/T/M, сравнить с Figma, проверить связь фильтра с данными, права/ACL/состояния. После успешного Owner QA — распространение на Manager/Client экраны; только затем исключение Select в этом месте.

## 6. Риски/неоткрытые решения

- Новый UX расходится с прежним mobile Select контрактом; Owner уже согласовал направление, но нормативные документы и конкретный Figma master ещё не синхронизированы.
- Большое число фильтров: горизонтальное листание снижает обзорность; для 10–12 проверьте, нужна ли группировка на продуктовом уровне. Максимум 12 — ограничение **только демонстрационной панели тестирования**, не предполагаемый предел бизнес-статусов.
- Мобильные подписи могут оказаться длиннее в реальной локализации; проверка реального набора и читаемости требуется.
- Браузерные тесты Chromium не доказывают одинаковую графику Safari/WebKit или производительность на телефонах.
- PR #5 (NavigationDrawer) — отдельная работа. Не смешивать GL-03 с GL-02B, не менять общую линзу ради Tabs без регрессионного QA.

## GL-03 / Soft shadow + scrollport clearance — Owner iteration 04.11.2026

- **Visual defect (Owner screenshot):** a horizontal clipping edge cut off the active pill shadow. Root cause: `overflow-x:auto` on the horizontal swipe rail also clips overflow in the perpendicular axis, even with `overflow-y:hidden`. Shadow softness alone cannot fix this.
- **Minimal GL-03-scoped fix:** preserve 38px optical capsule and 44px tap target, give the scrollport 7px top and 12px bottom internal optical clearance. Its outer vertical budget grows 19px; this must be included in future Client/Manager page layout and spacing QA. The spring X/width tracks and shared `FosGlassMaterial` are untouched.
- **Reusable appearance token, opt-in:** `src/components/ui/fos-glass-shadow-tokens.css` defines `--fos-glass-shadow-soft` for future glass surfaces. It is consumed only by `glass-pill-tabs.css` until Owner visually approves and each other consumer passes isolated regression. Never apply the softer shadow to SidebarNav / Drawer / HeaderAction globally merely because it exists.
- **Independent checks:** full Chromium build, 1440/768/390/320 scrollport clearances while moving among selected filters; no page horizontal overflow or duplicate GlassLens; the current accepted SidebarNav/HeaderAction regressions must remain green. Real browser screenshots + Owner React visual gate before merge or dissemination.
