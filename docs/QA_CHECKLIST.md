# Flexomir OS — независимый QA / Owner gate

Заполнять для каждого значимого изменения. Если пункт невозможно проверить, отмечать `NOT RUN + причина`, не засчитывать автоматом.

## 0. Компонентный QA и необязательный HTML motion gate (OWNER уточнение 04.11)

- [ ] Найдены CURRENT Client UX V2 / Manager UX V2, Figma master ID, props, состояния, реальные роли/контексты; ARCHIVE / SUPERSEDED исключены, CANDIDATE ≠ APPROVED.
- [ ] Если компонент обычный (поле, строка, шапка) — реализован напрямую в React по Figma без дублирования целого HTML экрана.
- [ ] Если эффект сложный (Glass/press/Sidebar/Tabs/overflow/Select) — есть **изолированная** HTML-лаборатория, отдельная визуальная приёмка Owner `GLASS_HTML_OWNER_APPROVED` **до React-порта эффекта**.
- [ ] React-компонент поддерживает Figma variants, disabled, focus, keyboard/touch, а не заменяет мастера лабораторной кнопкой.
- [ ] Зафиксирован props/usage contract; один shared component используется Client и Manager, а не две копии.
- [ ] Проверены 1440/1024/768/390/320, overflow, disabled, keyboard/focus, touch, reduced motion/forced colors, cross-browser/fallback где актуально.
- [ ] React визуально сверен с Figma; после motion approval дополнительно с HTML oracle. Owner COMPONENT gate и SCREEN gate отмечены отдельно.
- [ ] Первый пилот: [HeaderAction FE-01](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view); package A без GL-01B и бизнес-логики, package B после Owner review. Client MyOrders mobile caption conflict OPEN.

## 1. Источники и продукт

- [ ] Сверены даты/статусы CURRENT SRS, Scope, Governance, Figma nodeId и DS masters; исторические копии не выдаются за нормы.
- [ ] Сценарий принадлежит текущей роли и MVP; видимые действия имеют подтверждённые Trigger→Effect→Feedback→Next State.
- [ ] Не изобретены поля/статусы 1С, backend actions/permissions, routes и ложный success.
- [ ] Проверены company/tenant isolation, authorization boundary и негативные сценарии в доступном окружении.
- [ ] Для shared change пройден список затронутых Client/Manager/Glass usages.

## 2. Техническое качество

- [ ] `git status`, branch, diff и чужие изменения проверены; работа в основной папке или явно согласованном worktree.
- [ ] Стек, зависимости и лицензии подтверждены; lockfile актуален, секреты не добавлены.
- [ ] Build/typecheck/lint/unit/interaction tests выполнены **фактическими** командами проекта, результаты записаны.
- [ ] Проверены Loading, Empty, Error, disabled, stale data, long strings, race/duplicate actions, Back/forward/deeplink.
- [ ] Повторная проверка после фиксирования замечаний; regression list выполнен независимо от автора.

## 3. Визуально/адаптивно

- [ ] После HTML gate: снимки реального React в браузере **1440, 1024, 768, 390, 320** сопоставлены как с одобренным HTML, так и с Desktop/Tablet/Mobile CURRENT Figma.
- [ ] Side-by-side сравнение с CURRENT Figma и принятыми material references; расхождения перечислены, самовольного redesign нет.
- [ ] Сетка, типографика, токены, иконки, отступы, состояния, пустоты, длинные названия, overlay, sticky, scroll корректны.
- [ ] Нет horizontal overflow, clipping, сломанных touch targets и перекрытий при 320 и 768.
- [ ] Keyboard/focus/Escape/ARIA/reduced motion/contrast проверены по возможностям окружения.
- [ ] Glass: рефракция реального DOM, если заявлена, подтверждена тестом и визуально; fallback Chromium/Firefox/WebKit и производительность отдельно, не выдавать CSS-блики за настоящий refract.

## 4. Контроль интеграции и чистоты

- [ ] Поля в UI, DTO и API mapping размечены APPROVED vs OPEN, согласованы с Алексеем где необходимо.
- [ ] Удалены мёртвые/несогласованные состояния, временные console/debug controls, дубли компонентов, unused imports.
- [ ] Отсутствуют сломанные роуты, некорректные props, непроверенные зависимости и скрытые cross-role регрессии.
- [ ] PR содержит scope, изменённые файлы, команды тестов, screenshots, риски, rollback/план исправления.
- [ ] Отдельно отмечено: `CODE_DONE / QA_VERIFIED / OWNER_ACCEPTED / APP_INTEGRATED`.
- [ ] Тяжёлые отчёты, видео и снимки прогонов остаются в игнорируемых `output/`, `test-results/`, `playwright-report/`; актуальные результаты не подменены историческими.

## Отчёт по факту

- Ветка/commit/PR:
- Test environment (OS, Node, browser, viewport):
- Команды и результаты (pass/fail/skipped):
- Screenshots/diff:
- Воспроизведённые ошибки/фиксы:
- Тесты, которые не запускались, почему:
- Объём регрессии:
- Итог: **NOT_STARTED / FAILED / VERIFIED / OWNER_PENDING / INTEGRATED**.
