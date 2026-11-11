## 1. Основные прогрессы

Owner принял FOS12 на head `f509ebaad65d334caee66b9f61918c67f8fa3705` ответом «Принято». Затем поручил подключить принятый вариант после замечания к Manager DEMO-002 и явно разрешил: «все принятые задачи подключай и сливай в main/origin». После слияния требуется отдельная ветка следующей задачи от свежего origin/main.

В том же [PR #35](https://github.com/SigmeD/flexomir_os/pull/35) подключены принятые FOS03 и FOS12. ArtworkSource стал единым вариантом Client/Manager/production; DEV-флаг и reference-ветка удалены. Manager32/24 включён на обычном создании заказа. Статус под заголовком подключён общим PageHeader в Composer и readonly Detail обеих ролей, включая случай со скриншота.

## 2. Какие задачи решались

Причина замечания: PageHeader ниже68px action-row добавлял28px до статуса вместо8px от48px H1. Ранее below-title был только в Manager DEV-пилоте. Теперь `subtitleRole=status` выбирает below-title по умолчанию; secondary/context в библиотеке сохраняют прежнюю композицию. Никаких negative margin, translate, копий Header или изменений кнопок/линзы.

Освобождённые20px компенсированы в общих композициях: desktop Composer body25px, Detail26px, Manager Detail24px. Для обычных коротких заголовков поле компании/продукция остаются на прежнем Y; compact overrides сохранены. На2048/1440/1024 statusY108, gap8, Manager Detail bodyY150 и Composer151. Длинные заголовки переносятся без пересечения actions.

| Источник → компонент | Подключение |
| --- | --- |
| Принятый FOS03 на6007e60, Owner Screenshot_1, CURRENT Manager Detail2560:10872, PageHeader2302:2138 | PageHeader status→below-title; Composer/Detail обеих ролей; Manager32/24 через data-order-role, без query/DEV |
| Принятый FOS12 наf509eba, Artwork634:445, Action835:243 | Один ArtworkSource без presentation API/legacy DOM; Client/Manager New/Edit/Repeat, production |
| LocalFileControl/FOSAction/FE11 | Переиспользованы без изменения native contract/material/physics и Save dirty&&valid |

Новые проверки автора:

- RED Manager DEMO-002: expected8, actual28. RED обычного FOS12: принятый states отсутствует. Обе причины исправлены на shared уровне.
- Отступы/длинный H1/secondary isolation/Manager0/1/N/private Save/адаптивы —60/60 PASS, Chromium/Firefox/WebKit/touch, включая2048 и пять стандартных ширин.
- Artwork states/native chooser/drop/cancel/HELP focus/disabled/error —52/52 PASS в четырёх проектах.
- Build PASS,238 modules. Production-preview:4/4 маршрута (обе роли, обычный URL/старый query) используют принятые состояния и status gap8, page errors0.
- 25/25 component PNG побайтово совпали с принятым FOS12-f509eba на пяти ширинах. Новые60 raw PNG сохранены отдельно от пилота; page errors/overflow0. Approved-source изображения не подменялись.
- Независимый review PASS WITH RISKS:19 собственных Chromium assertions, Manager DEMO-0022048/320, ordinary ArtworkSource обеих ролей, picker/ESC/focus;4 снимка. Frozen5/5 пересчитан независимо и автором.
- Первый полный прогон700:694 PASS/4 SKIP/2 FAIL старых assertions, ожидавших удаления input вHELP. Принятый контракт сохраняет hidden+disabled input ради фокуса; после снятияHELP он enabled. Старый тест актуализирован, весь Compose12/12 PASS. Полный повтор700 и CI нового head выполняются; фактический результат фиксируется в PR и Drive CURRENT.
- Повторный независимый review тестовой правки: PASS WITH RISKS, production blockers нет. В capture script метрика названа repeatGeometryMatches: повтор обычного URL проверяет повторяемость геометрии, а сохранение принятого вида доказывает отдельное сравнение25 PNG с f509eba.
- Финальный стабильный полный прогон на8b0f082:696 PASS/4 штатных SKIP/0 unexpected/0 flaky,547.66s. Предшествующий повтор695/4/1 был прерван Vite reload scripts/fos12-artwork-review.cjs ровно11:35:30Minsk/08:35:30UTC; companies10/10 отдельно PASS. Во время финального полного прогона файлы не менялись. Журналы сохранены отдельно.
- CI на8b0f082: Orders Core42988302691 и Accepted Artwork/Spacing42988302870 SUCCESS; M742988302669 прерван общим бюджетом20мин на последнем наборе124 проверок профиля. Все предыдущие шаги M7 SUCCESS. Бюджет задания увеличен до25мин; состав, пороги, браузеры и проверки сохранены. CI итогового коммита должен завершиться успешно до merge; это не обход failed assertion.

В новом тесте исправлена тестовая предпосылка: Client не содержит DEMO-002, используется существующий DEMO-003. Timeout неправильного fixture не объявляется продуктовым дефектом; исходный trace сохранён. Набор60 после исправления полностью повторён.

Доказательства локальные: output/playwright/{order-spacing-red,order-spacing-green,accepted-rollout}, output/accepted-rollout-full.log и accepted-rollout-full.json. Независимые изображения — accepted-rollout/independent. Скриншот Owner Screenshot_1.png остаётся untracked и не меняется; локальная копия в accepted-rollout/reference. Figma session2c676138-03dc-417a-b3d3-8895cb5c33ea прочитала CURRENT Manager Detail; canvas не менялась. Полная визуальная приёмка всех экранов не заявляется.

## 3. Что в процессе

- Frontend/Codex: дождаться CI фактического PR head после исправления бюджета M7, затем выполнить уже разрешённый merge/main sync и проверить результат — текущая поставка11.11, календарная оценка не утверждена. Полная локальная регрессия завершена696/4/0.
- Frontend/Codex: удалить remote head после подтверждённого merge/auto-delete, сохранить локальные ветки и stash; создать обычную ветку следующего пункта от свежего origin/main — после merge.
- Owner/PO/Алексей: Save UX05, права/статусы06, API/storage10/11/13 и согласованный срок менеджера остаются отдельными решениями. Account02/DatePicker07 — отдельные пилоты; frozen engine не менять без отдельного решения. Даты не назначены.

## 4. Основные договорённости

- Принятые варианты подключаются в продуктовый frontend и production-сборку, затем сливаются — frontend/Codex по прямому поручению Owner. Это не реализация backend/1С/storage и не разрешение неутверждённого hover-изменения FE11.
- Один текущий инкремент/PR #35 сохраняет код, тесты и LIVE docs; финальные title/body отражают rollout и замечание Owner, а не прежний DEV-only scope.
- После merge фактические SHA/CI/QA и следующая очередь синхронизируются в существующем [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit). Предыдущая main398a93b и пилотf509eba — история исходных проверок, не финальный merge SHA.
