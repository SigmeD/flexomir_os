# Flexomir OS — независимый QA / Owner gate

Заполнять для каждого значимого изменения. Если пункт невозможно проверить, отмечать `NOT RUN + причина`, не засчитывать автоматом.

## 0. Обязательная визуальная приёмка HTML перед React (OWNER 04.11.2026)

- [ ] Для экрана найдены CURRENT Figma nodeIds, Primary Design System V2, FOS Masters, утверждённые правила.
- [ ] HTML-превью воспроизводит **структуру, размеры, иконки, типографику, смысл действий и адаптивы** Figma. Liquid Glass — только материал/свет/animation, а не замена компонентам.
- [ ] Превью интерактивное и проверено на 1440/1024/768/390/320, включая hover/pressed/disabled, focus, keyboard/touch, reduced-motion, длинные названия и overflow.
- [ ] Расхождения с Figma перечислены и устранены либо согласованы. Приложены воспроизводимая версия HTML и screenshots/diff без постороннего контента.
- [ ] Есть явное решение Owner `OWNER_HTML_APPROVED` по **данной версии** HTML. Если REWORK — править HTML, React-задача BLOCKED.
- [ ] После HTML APPROVED создана **отдельная** React-задача с Figma nodeIds, версией HTML, props/компонентами, states, DEMO/API mapping, responsive/motion и QA.
- [ ] React-перенос отдельно прошёл технический/визуальный QA и Owner review; принятие HTML не считается принятием React.

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
