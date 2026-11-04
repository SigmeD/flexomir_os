# GL-02B — адаптивное меню NavigationDrawer (CURRENT / 04.11.2026)

**Статус:** CODE CANDIDATE после Owner уточнений. Новые тесты/визуальная приёмка отдельно. Предыдущие 68/68 относились к версии ДО этих изменений; их нельзя выдавать за результат текущей ветки. PR #5: https://github.com/SigmeD/flexomir_os/pull/5. Не объединять без проверки результата и явного Owner approval.

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

При ширине 320px панель адаптируется до 280px. Scrim: black opacity 0.16. Стекло: нейтральное белое полупрозрачное покрытие с backdrop blur20 и лёгкой тенью/кромкой; **не синяя заливка**. Divider 1px, footer 13px Manrope. **Owner 04.11.2026 утвердил отклонение от icon-less Mobile/Tablet Figma**: навигационные SVG-иконки и их движения должны быть теми же, что в Desktop Sidebar. Реальные CURRENT Figma mobile overlays пока без иконок — это документированное требование на обновление дизайн-мастера после визуальной приёмки.

## Компонентный контракт

- `NavigationDrawer` берёт `items`, `activeId`, `onSelect`, `onSelectionSettled`, `closeOnSelection`, `ariaLabel`, `footerText` от родителя. Сам не вызывает API/роутинг/1С, не создаёт заказов. Закрытие после движения линзы остаётся поведением по умолчанию для реальной навигации. В изолированном стенде новый Owner режим «оставить меню открытым до outside-click/Escape/trigger» включён по умолчанию, и его можно сравнить с обычным закрытием по завершении движения.
- Один **принятый** `SidebarNav` с нейтральным `GlassLens`: hover меняет только цвет; выбранная линза перемещается после выбора; text max 1.043× и icon max 1.022× только по мере движения линзы. **Иконки теперь показаны и в Drawer — общий SVG-компонент, 19×19 и gap12, без новой библиотеки и дубликатов.** Пункты обоих React-стендов импортируются из единого файла `src/navigation-demo-items.ts`.
- Меню-триггер: видимая Figma Menu 20×20 с тремя полосками 16×1.5px, увеличенная невидимая область нажатия 44×44 для touch/a11y.
- `role=dialog`, `aria-modal=true`, `aria-expanded/controls`, активный пункт в фокусе при открытии, Tab/Shift+Tab внутри, Escape/outside click/trigger закрывают всегда; `selection` закрывает только в режиме `closeOnSelection=true` **после полного прихода общей линзы**, при `false` меню остаётся открытым для последовательных выборов. Фокус возвращается на триггер; фон `inert`, scroll lock body и documentElement.
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

## Изменения после первого QA и Owner review

- В конце 04.11.2026 Owner прямо согласовал **единые иконки** для мобильного меню и десктопа. Это более новое принятое решение, чем icon-less прототип Drawer в Figma; пометить текущий мастер как требующий синхронизации, не менять без проверки.
- В ответ на UX-запрос «выбирать пункты до клика вне панели» введён параметр `closeOnSelection`. Функциональные тесты и React-визуальная приёмка для этой версии должны быть повторены. Базовая продакшен-политика остаётся закрывать после завершения линзы; stay-open — текущая демонстрационная политика в лаборатории.
- Не смешивать статусы: предыдущий CI 68/68 относится к старому состоянию PR #5; новая версия проверяется отдельно. `SidebarNav`, `HeaderAction` и исходные masters не изменены.
