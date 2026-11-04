# GL-02B — адаптивное меню NavigationDrawer (CURRENT / 04.11.2026)

**Статус:** CODE CANDIDATE. Сборка/браузерные тесты и визуальная приёмка отдельно. PR #5: https://github.com/SigmeD/flexomir_os/pull/5. Не объединять без проверки результата и явного Owner approval.

## Источник

- CURRENT **Client UX V2**, Figma Mobile overlay frame [1962:3854](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1962-3854), Tablet overlay [1962:3834](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1962-3834).
- CURRENT **Manager UX V2**, Orders Tablet `2495:9000`, Mobile `2495:9097`: общий Menu Button внутри FOS V2 Shell. **Открытый Drawer менеджера в текущих пилотных фреймах не представлен**; не считать клиентский контент автоматически утверждённым менеджерским продуктовым экраном.
- Figma canonical `FOS V2 / Navigation Drawer` `1368:499`; Menu Button icon `1368:371`; FOS shared Navigation Item `634:511`, Glass Lens `1578:493`.
- Исключены ARCHIVE, SUPERSEDED, UX PROPOSED.

## Не путать с полноэкранным Drawer

Текущий паттерн — **компактное плавающее меню с правой привязкой под 72px header**. Не боковая выезжающая панель.

| Параметр | Mobile 390 | Tablet 768 |
|---|---:|---:|
| Panel | 296 × 229 | 320 × 229 |
| X / Y | 74 / 72 | 428 / 72 |
| Right inset | 20px | 20px |
| Padding / radius | 16 / 20px | 16 / 20px |
| Navigation rows | 3 × 44, gap4 | 3 × 44, gap4 |
| Inner nav width | 264 | 288 |

При ширине 320px панель адаптируется до 280px. Scrim: black opacity 0.16. Стекло: нейтральное белое полупрозрачное покрытие с backdrop blur20 и лёгкой тенью/кромкой; **не синяя заливка**. Divider 1px, footer 13px Manrope. В текущих drawer-пилотах Figma навигация без иконок, в отличие от desktop Sidebar.

## Компонентный контракт

- `NavigationDrawer` берёт `items`, `activeId`, `onSelect`, `ariaLabel`, `footerText` от родителя. Сам не вызывает API/роутинг/1С, не создаёт заказов.
- Один **принятый** `SidebarNav` с нейтральным `GlassLens`: hover меняет только цвет; выбранная линза перемещается после выбора; text max 1.043× и icon max 1.022× только по мере движения линзы (в drawer icons необязательны и в текущем Figma отсутствуют).
- Меню-триггер: видимая Figma Menu 20×20 с тремя полосками 16×1.5px, увеличенная невидимая область нажатия 44×44 для touch/a11y.
- `role=dialog`, `aria-modal=true`, `aria-expanded/controls`, активный пункт в фокусе при открытии, Tab/Shift+Tab внутри, Escape/outside click/selection закрывают; восстановление фокуса на триггер; фон `inert`, scroll lock body и documentElement.
- Открытие/закрытие — локальная CSS-анимация (предварительная, **не утверждена Owner**). Reduced-motion/forced colors/fallback отдельно.
- Preview: `/?view=navigation-drawer`. Тестовый переключатель ролей **только в лаборатории**.

## Разделение статусов и рисков

- React code — в отдельном PR, **main не затронут** до merge.
- Browser/TS QA — CI workflow `.github/workflows/navigation-drawer-qa.yml`, результаты должны быть зафиксированы отдельно. Owner visual gate не подменяется CI.
- Менеджерские пункты (в текущей Instance «Клиенты») противоречат названию «Компании» в структурном разделе Manager V2; отдельное PO/Owner решение.
- В Figma Manager Shell встречается Role=Client при user text «Менеджер» — отдельный нерешённый дефект исходных мастеров.
- Manager footer — в demo «Менеджер · тестовый режим» как **заглушка**, без передачи в действующий продукт.
- Реальная навигация, responsive AppShell, deep links, разрешения, 1C/API, тесты Firefox/WebKit и на реальных устройствах — последующие стадии.
- Адаптив 1024+ использует desktop Sidebar; GL-02B Drawer реализуется для Tablet/Mobile, не заменяя его.
