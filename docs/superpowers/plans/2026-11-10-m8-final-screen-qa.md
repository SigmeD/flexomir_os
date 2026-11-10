# M8 — заключительная проверка экранов

## Уточнение Owner10.11 — размеры полей

- Проверить FOS masters и все CSS-потребители полей: одинаковые контроли отделить от намеренно разных композиций и textarea.
- Сохранить существующие FOSDateField/FOSInput; общую строку OrderDateFields подключить к созданию и просмотру заказа Client/Manager. Desktop506px как Client New; tablet одиночное поле на всю ширину, пара в две колонки; mobile в одну колонку.
- Удалить расходящиеся ограничения506/720 и локальную сетку дат. Состояния, права, данные, статусы и frozenFE11 не менять.
- Проверить ширины1440/1024/768/390/320, сравнить свежие screenshots и соседние формы, выполнить build и подходящую существующую регрессию. Обновить LIVE docs в том же PR31; merge отдельно.

> Исполнение в текущей сессии по executing-plans; независимый reviewer проверяет результат отдельно. Основная рабочая папка, обычная ветка, без worktree.

**Цель:** обновить проверку утверждённых Client/Manager сценариев после PR #30 и устранить только воспроизводимые отклонения от действующих требований и мастеров.

**База:** origin/main `9d1f5bca738e667dc3d63a7a1f0ce9a2f1ec18da`; ветка `feat/m8-final-screen-qa`. Исходная задача M8 — issue #21; предыдущие проверки не выдаются за текущие.

**Архитектура:** существующие shared React-компоненты и fixture navigation. Figma только читается. Актуальные Owner delta (14/18/500, FE11 selection-only, responsive action dock) выше старых screen instances. Frozen Motion/Glass sources и manifest не меняются. Backend/API/ACL/1С, Auth design и неподтверждённые действия не реализуются.

**Стек:** React19 / TypeScript / Vite, существующий Playwright + axe, PNG screenshots и локальный HTML-обзор.

## A. Источники и инвентаризация

- [x] Проверить Git/worktrees/stash/PR и создать одну ветку от свежей origin/main; четыре stash сохранить.
- [x] Прочитать CURRENT Drive plan/UX index/SRS/E2E/Glass и локальные map/registry/decisions. Старые OPEN сверять с merged PR и новыми решениями.
- [x] Создать отдельную Figma audit session `0afae8b2-6da2-4635-a892-97f2392f3d58`; проверить фактические IDs, контекст CURRENT/PROPOSED и размеры.
- [x] Зафиксировать реестр сравнения: screen/state/role → Figma frame/master/Owner delta → shared React consumer → viewport → следующий переход. Обновлён существующий SCREEN_MAP,23 семейства/69 точных frames.

## B. Свежие визуальные доказательства

- [x] Получить 69 новых Figma PNG для реальных экранных семейств D1440/T768/M390; старые captures не использовать как новые.
- [x] Снять React в совпадающих размерах и состояниях, дождаться шрифтов/стабильного layout; сформировать пары Figma↔React. Exact renderBounds crop, без resize, raw PNG сохранены.
- [x] Покрыть Orders list/detail/completed/New/Item, Manager draft, Companies/linked orders, Support list/new/detail и Layouts library/detail/upload/picker. UI-only и candidate scope отмечены отдельно.
- [x] Проверить 1024/320 и короткие высоты/keyboard/touch/scroll/focus в текущих suites; M7 final159/159 PASS. Для ширин без Figma frame pixel parity не заявляется.
- [x] Разнести confirmed P2, Owner delta, synthetic data, OPEN source/contract в отчёте и SCREEN_MAP. Ссылки на node/evidence сохранены.

## C. Исправления только после воспроизведения

Подтверждённый P2 / M8-01: browser title на всех 69 captures = «Flexomir V3 | Glass Filter — website-glass proof». CURRENT продукт и README называются Flexomir OS. Источник — единственный index.html, исправление только title на «Flexomir OS». CSS, React layout и маршруты не меняются; отдельный зеркальный unit test не нужен. Проверка: реальный title после reload Client/Manager/Layouts/Support и production build.

Подтверждённый P2 / M8-02: Client Support Detail 634:8137 использует FOS Breadcrumbs/Support Detail с parent «Поддержка», React показывает «Мои обращения». Manager Detail 2606:22577 требует «Мои обращения». Исправление — только label variant в существующем SupportScreen/PageHeader при открытом Client ticket; общий nav.back и focus return сохраняются. Regression test в m7-support.spec.ts проверяет реальный breadcrumb→свой список→focus opener для обеих ролей. New Ticket остаётся в прежнем scoped candidate контракте.

M8-QA-01: первый M7 checkpoint152/153 PASS, WebKit Account alignment test не открыл demo panel после goto. Snapshot показывает видимый закрытый trigger, helper уже ждёт скрытую кнопку роли. Причина — мгновенная isVisible до mount React в openDemoControls. Исправление только test helper: web-first ожидание trigger ИЛИ уже открытой panel перед проверкой состояния. Продуктовый код/таймауты/assertions не ослабляются; повторить исходный WebKit case3 раза и полный финальный suite.

- [x] Подтвердить M8-01/02, минимально исправить title/Client breadcrumb; RED1/2→GREEN6/6, свежие пары обоих Support adapters.
- [x] Не добавлять новые бизнес-функции по candidate frames; Manager agreed-date и остальные решения оставить OPEN до явного решения Owner/PO.
- [x] Проверить LAY03 parent context/active Макеты/Item draft/возврат в пятиразмерном cross-browser M7 и свежих парах; старый disabled-peer статус не возвращён.

## D. Проверки и независимый review

- [x] `npm run build` — TypeScript/Vite PASS.
- [x] M7 final159/159 PASS Chromium/Firefox/WebKit, все пять ширин; JSON/logs в отдельном output/m8-final. Исходные FAIL сохранены.
- [x] Итоговая full regression520 PASS/4 expected skips/0 FAIL; flaky0,8.5m. M7 final159/159 PASS. Исходные диагностические FAIL сохранены, auto retry не добавлен.
- [x] Frozen contract в первом full checkpoint PASS, diff защищённых файлов пуст; повторный полный suite остаётся отдельным checkpoint.
- [x] Независимый read-only reviewer проверил исходный diff и 12 реальных пар D/T/M: PASS WITH RISKS, без новых findings. Не заявляет просмотр всех 69 или собственный runtime. Первая попытка другого reviewer прервалась до работы по лимиту, не засчитана.

## E. Поставка

- [x] Обновлены существующие SCREEN_MAP/PROJECT_STATE/DELIVERY_PLAN/HANDOFF/DECISIONS/SOURCES и registry для Support label variant; отдельный отчёт содержит факты и OPEN.
- [ ] Одна ветка/один PR с кодом проверок, необходимыми исправлениями и LIVE docs; CI на фактическом head. Merge отдельно.
- [ ] Синхронизировать существующий Drive CURRENT: M8 IMPLEMENTED/QA VERIFIED отдельно от Owner visual acceptance. Issue #21 не закрывать автоматически без его DoD.

**Приёмка:** актуальные доказательства по утверждённым screen families; нет неразобранных P0/P1; каждый спорный пункт имеет источник/влияние/владельца; функциональная, визуальная и техническая проверки разделены. Итог — конкретный результат для Owner review; M9 начинается по готовности согласованных API Алексея.
