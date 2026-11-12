# Flexomir OS — правила работы Codex

## CURRENT / 13.11.2026 — COMM-DOCS merged

PR #46 MERGED по прямому поручению Owner «сделай merge в main/origin». SHA приложения `479c59188b5ee0b2bda4dd3150b75803cf3d3886`, проверенный PR head `ea3f2b858d661592948c76760be6459c6c2bde28`, CI **6/6 SUCCESS**. Дерево squash совпадает с PR head. Новые post-merge build PASS, smoke **8/8**, bundled production1440/320 **2/2 PASS**, pageerrors=[]. Remote head удалён автоматически, локальная feat/comm-docs-20261112 сохранена; рабочая ветка main. Последующая синхронизация Markdown — только метаданные, не новый код приложения. Duplicate payload, Owner visual/D09, physical devices и production API/read/ACL/1С остаются OPEN. [Отчёт](docs/COMM_DOCS_2026-11-12.md), [состояние](docs/PROJECT_STATE.md). Датированные pre-merge записи ниже — история.

## CURRENT / 12.11.2026 — №06 merged

PR #44 слит по прямому поручению Owner «вливай в main/origin». Продуктовый main `6d3fa83e14d1581017ae19a4451ec0181e9d126a`, проверенный PR head `7c5b017228dbef58f7bb85d6211257b1519556f0`, CI7/7SUCCESS. Новые post-merge проверки: build PASS, FOS06 60/60, frozen2/2, production Review4/4. Remote head удалён; локальная ветка сохранена. Из13пунктов10 реализованы и слиты, №11 закрыт без реализации, №10/13 backlog. Полная M8 приёмка, backend/API/ACL/1С, PR #40 и CMP отдельно. [Состояние](docs/PROJECT_STATE.md), [отчёт №06](docs/FOS06_ITEM_ACTIONS_DELIVERY_2026-11-12.md). Датированные SHA ниже — история, не текущая очередь.

## Состояние после merge / 10.11.2026

PR #31 слит по прямому поручению Owner; продуктовый main — `a400b9dc73ad77b01b37932fa4c5abbd57d134e0`, проверенный PR head — `f991bd77d16f0552f10e1cb8e0014d7d95a84850`, обе CI успешны. PR #29/#30 тоже уже слиты. Клиентское readonly-поле согласованного срока и общая строка дат находятся в main; фиксация менеджером, переход в «В работе» и реальные API/1С остаются OPEN. Перед новой задачей сверять фактические Git/PR/Drive, не переиспользовать ветки слитых PR.

Датированные SHA и статусы прошлых поставок ниже — исторические факты. Действующие правила, роли, frozen FE11 и Owner-решения сохраняют силу. Краткое состояние — [PROJECT_STATE](docs/PROJECT_STATE.md), порядок дальнейшей работы — [DELIVERY_PLAN](docs/DELIVERY_PLAN.md).

## CURRENT / 10.11.2026 — Owner popup pilot accepted / rollout

- `navigation/item` и `popup/item` используют одну базовую роль Manrope 14px/18px Medium 500. React source: `--fos-type-menu-item`; алиасы `--fos-type-navigation-item` и `--fos-type-popup-item`. Не дублировать font-size/line-height/font-weight в CSS потребителей и не создавать локальные исключения.
- Это разрешение на базовую типографику пунктов Sidebar/Drawer/Account/More/GlassSelect, не на изменение утверждённых GlassLens/Motion Engine, optical scale или материалов. Заголовки, подписи, профильные identity/data и trigger typography имеют отдельные роли.
- Owner принял пилот и action-adapter ответом «да подтверждаю»; разрешены rollout/cleanup и синхронизация затронутых Figma masters в PR #30. Все popup consumers подключаются через `FosPopup`, form fields — через канонический `FOSSelect`. Figma menu role14/18/500 синхронизирована; закрытые field/identity roles сохранены. Это не приёмка всех экранов и не разрешение merge. [Охват, QA и оставшиеся gates](docs/FE11_POPUP_REAUDIT_2026-11-10.md).

## CURRENT / 09.11.2026 — FE-11 Motion approval and freeze (Owner instruction)

- Сначала доработать и показать Motion Engine / GlassLens на тестовом стенде. Перенос в общие Liquid Glass компоненты и подключение каждого типа меню — только после явного подтверждения Owner и с регрессией.
- Новый сценарий `FLEXOMIR_FE11_NAVIGATION_DRAWER_LENS_SCENARIO_2026-11-09.md` заменяет прежнее popup hover-preview направление: hover/focus не двигают линзу; выбор по click/Enter/Space/tap; оптический scale определяется фактическим пересечением движущейся линзы с подписью.
- После явного утверждения зафиксировать версию, эталон, Git SHA и статус `OWNER APPROVED / FROZEN` в документации и реестре. До этого статус — `OWNER OPEN`, даже если тесты проходят.
- Замороженные Motion Engine, GlassLens, параметры физики/материала, hover/click и типографические трансформации запрещено менять без отдельного разрешения Owner. При дефекте сначала показать первопричину, влияние и предлагаемый fix; не обходить эталон локальными CSS и копиями движка.
- Owner явно подтвердил v0.2: «да теперь все верно, подтверждаю». Эталон — commit `f527bcb`, статус `OWNER APPROVED / FROZEN`; [freeze manifest](docs/FE11_MOTION_FROZEN_V0_2.json). Контроллер перенесён без изменения формулы и физики в `FosPopupRows`; временный lab-контроллер и render-slot удалены. Для Drawer/Account/GlassSelect выполняются отдельные адаптерные проверки; это не автоматическая приёмка всех экранов. Нативный FOSSelect и исключённый Order More требуют отдельного этапа.

## CURRENT / 06.11.2026 — Git hygiene: ветки, PR и завершение инкремента (Owner APPROVED)

- **Одна бизнес-задача / функциональный инкремент = одна рабочая ветка + один PR** с React-кодом, тестами и необходимыми LIVE-документами. Внутри допустимы несколько коротких этапов/коммитов и короткий handoff между ними. Не создавать новую ветку/PR только потому, что добавился экран, компонент или обновился документ. FE-S01 завершён в PR #14 (main 884e78f); действующий FE-S02 / issue #15 — одна ветка `feat/fe-s02-order-compose-flow` и один PR A/B/C. Пожелания встречи 06.11 (CR-REP, подписной, новые реквизиты/файлы/audio/video) отложены до согласования PO/заказчика/Алексея и в FE-S02 не входят. Актуальный номер PR сверять в GitHub/Drive.
- **Ветка только от свежего `origin/main`** после `fetch` и read-only проверки `git status --short --branch`, `git worktree list`, активных PR и remote. Старую ветку от MERGED PR не переиспользовать и не сливать повторно для «синхронизации».
- **Параллельная ветка** допустима только при независимом объёме, отдельном владельце и понятных границах файлов, согласованных Owner. Не допускать двух агентов одновременно к `src/App.tsx`, общим CSS и Glass-компонентам без coordination.
- **После завершения инкремента:** PR → build/CI/QA → Owner gate (где требуется) → merge в `main` → подтвердить SHA и присутствие результата в `main` → удалить REMOTE head branch / `fetch --prune` → обновить CURRENT Drive и релевантные локальные docs. В Settings GitHub включить **Automatically delete head branches**. Если нет прав, сообщить Owner; не утверждать, что настройка включена.
- **Не путать наличие ветки и отсутствие merge.** При squash/rebase `ahead/behind` может оставаться ненулевым; проверяй `merged_at`, SHA и наличие фактических изменений. Закрытый **без merge** PR — отдельная проверка уникальных коммитов/содержимого перед удалением, не удаляй по статусу CLOSED.
- **Безопасность:** никогда не удалять `main`, защищённые/активные ветки, ветки открытых PR, занятые worktree, локальные ветки с незакоммиченными изменениями. Не использовать `reset --hard`, `git clean`, force-push и автоматическое массовое удаление. Вопросы по локальным веткам согласуй; cleanup удалённых merged-веток проводить только после read-only доказательства.
- **Защита `main`:** запрет force push/delete, обязательные PR и разумные обязательные CI checks через Branch Protection/Ruleset после проверки возможностей репозитория и утверждения Owner. Нельзя по ошибке блокировать выпуск несуществующим check.
- **Один отчёт по инкременту:** `готово / QA / Owner / merged / какие ветки удалены / что осталось`. Документацию синхронизировать в том же PR, а post-merge статус в существующем Drive CURRENT. Не дробить процесс на самостоятельные документационные PR.
- **Разовая уборка имеющихся исторических веток:** [GIT-01 / issue #13](https://github.com/SigmeD/flexomir_os/issues/13). Пока проверка и удаление не выполнены, НЕ заявлять, что репозиторий очищен.

## CURRENT 06.11.2026 — SDLC от общего к частному и LIVE-документация

- **Фактическая база:** `origin/main` `89b043f9ae7e70a36a1eea8f5c98cd621e037aa9`; PR #5, #9 и #10 MERGED. PR #9 — первый частичный Manager Orders на React, НЕ готовый весь кабинет. Подробный актуальный порядок M4–M9 — [CURRENT Drive-план](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit).
- **Новый порядок Owner:** M4 инвентаризация готовых DS/архитектуры/экранов Client+Manager и единая карта → M5 каркасы/основные React-экраны обеих ролей → M6 сквозной демосценарий заказа → M7 оставшиеся подтверждённые MVP-разделы → M8 системная UX/UI-полировка и рефакторинг → M9 интеграционная готовность/общий QA. Минимальная корректность, адаптивность, доступность и регрессия обязательны на каждом этапе; некритичная «оптика» не блокирует охват.
- **LIVE DOCS / Definition of Done:** изменения в React/UX/архитектуре и их документационные правки — одна поставка. Обнови `docs/PROJECT_STATE.md` (что сделано/сейчас/далее), `docs/DELIVERY_PLAN.md` + [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit) (актуальный этап), `docs/COMPONENT_REGISTRY_2026-11-06.md` (изменённые shared components), `docs/HANDOFF.md` (незакрытое/следующий шаг), `docs/DECISIONS.md` (только подтверждённые решения и OPEN), `docs/SOURCES.md` (если изменены источники). Обновляй только относящееся к задаче; не создавай второй CURRENT-план. Синхронизируй GitHub SHA/PR/CI и Drive после merge. Не помечай ACCEPTED/RELEASED без соответствующего gate.
- Не меняй утверждённые SRS/Scope/Governance/дизайн-мастера без решения их владельца. Backend, API и 1С — зона Алексея; наша зона только React/frontend и подключение к готовому контрактному API.

## CURRENT / 06.11.2026 — Frontend-only ownership and execution plan (Owner instruction)

**Canonical frontend execution plan:** [Drive / 09_FRONTEND_CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit). Before selecting the next frontend task, read its stage, status, owner, gate and blockers; use GitHub for actual code/CI/PR state. This replaces older 04.11 FE-08=TODO and Figma-frame-first descriptions as the ACTIVE work sequence without erasing historical notes.

- **OUR SCOPE = React frontend only:** reusable visual/domain components, UI composition, routing, filters and interactive states, responsive design, accessibility, browser/visual QA, fixtures, and connecting the frontend client to an already-designed, agreed, available API. No new API/server implementation from the frontend workstream.
- **ALEXEY OWNS:** backend, data/business logic, server-side authorization and ACL, API design/implementation, integrations and exchange with 1C, server validation and integration testing. Any 1C-side specialist configuration is in that technical stream, NOT ours. Frontend can ask for API contract/fixtures/error shapes but must not silently take over those tasks.
- **FIGMA IS THE DESIGN SYSTEM:** use approved DS V2/FOS technical masters and established React components as visual source. Do NOT copy ~230 Figma responsive/UX frames into ~230 separate React screens; use the frames only to understand scenarios and state coverage. UX PROPOSED/ARCHIVE is not auto-approved scope. For accepted Glass primitives, keep their existing shared material/motion; do not fork.
- **OWNER UI decision:** filter label `В работе` is accepted by Owner without additional UX approval. Actual mapping between API/1C statuses is the responsibility of the backend/PO contract, not a frontend label decision.
- **STATUS DISCIPLINE:** distinguish component accepted, code written, CI passed, Owner screen accepted, merged, backend-ready and production-ready. PR #9 is merged into main at 0fc653667ac4acba675fe702920b476a2fda5ac8 after five successful CI workflows on aaaa4304. NavigationDrawer is integrated into Manager Orders through AppShell. Technical merge does not imply product or release acceptance. The canonical Drive plan and current Owner instructions determine the next task.

> **Область действия:** только репозиторий Flexomir OS (`D:\Projects\flexomir_os`) и его подтверждённые worktree. Не переносить решения из других проектов.
> **Назначение:** это обязательный процесс работы, а не самостоятельный источник новых продуктовых требований. Перед каждым значимым изменением проверяй актуальные источники.

## 0. Правило первого запуска и каждой новой сессии

1. Прочитай этот `AGENTS.md`, `README.md`, `docs/PROJECT_STATE.md`, `docs/DELIVERY_PLAN.md`, `docs/DECISIONS.md`, `docs/SOURCES.md` и последний `docs/HANDOFF.md`. При наличии вложенных `AGENTS.md` учти их для соответствующей области.
2. Сделай read-only инвентаризацию: `pwd`, файловое дерево (только значимые пути), `git status --short --branch`, `git remote -v`, `git worktree list`, `git log -5 --oneline` (если это репозиторий), `package.json`, lockfile, scripts, node/tool versions, уже установленные компоненты и тесты. Не инициализируй Git, не ставь пакеты и не меняй файлы, пока не проверено существующее состояние.
3. Выборочно перечитай документы **CURRENT** в Google Drive по текущей задаче. Проверь даты изменения, статус решений и противоречия. Figma: действующий Primary Design System V2 → FOS Technical Masters → CURRENT экраны нужной роли. Если Drive/Figma недоступны, честно укажи, что не проверено; не замещай документы памятью или старыми чатами.
4. Сверь текущий этап с реальными файлами и Git, а не только с этим текстом. Сформулируй в 5–10 строк: **цель → текущее состояние → релевантные источники → план → риски/зависимости → критерии приёмки**. Для простой задачи — сокращённо.
5. Сначала определи, относится ли задача к **Screens**, **Glass** или **Backend/Integration**. Не смешивай ответственность и не редактируй общие файлы другой ветки без согласованного интерфейса.

**Сейчас (проверено 04.11.2026):** Git подключён к `https://github.com/SigmeD/flexomir_os.git`, ветка `main`, исходный коммит `cd0656a` отправлен в GitHub. Репозиторий PUBLIC; требование пакета о приватности остаётся открытым, видимость без решения владельца не менять. В каталоге уже есть React/TypeScript/Vite Glass-полигон; `npm run build` выполнен успешно. Не создавать второй scaffold. Экран Manager «Заказы» — первая продуктовая цель; прежний автономный HTML-пилот НЕ ПРИНЯТ и не является эталоном. Screens и Glass — отдельные потоки ответственности; параллельные агенты автоматически не запускаются. Источники Drive/Figma из пакета ещё не перепроверены в этой сессии; перед продуктовой работой свериться с ними.

## 1. Для чего мы делаем продукт

Flexomir OS — система типографии для клиента и менеджера: заказы, позиции, компании, документы/макеты, статусы, поддержка, интеграция с 1С. Цель — функциональный адаптивный React по согласованным сценариям для поэтапной интеграции. Не подменять продукт декоративным демо или новыми функциями; MVP, роли, права и статусы задают CURRENT SRS/Scope/Data Integration и решения Owner/PO.

**Ответственность:** Owner/PM — решения, UX/UI, приёмка; Screens-agent — React layout, view states, маршруты/навигация, mocks, responsive/QA; Glass-agent — переиспользуемые React visual/material/motion primitives; Алексей — backend, модель данных, API, интеграция с 1С, серверная безопасность и QA. Общие поля, статусы, права, маршруты и ошибки сверяй с Алексеем перед изменением контрактов.

## 2. Иерархия источников и защита от потери контекста

- **Единая живая база:** [Google Drive / Флексомир-V](https://drive.google.com/drive/folders/1-0UKiK1h1MT2lXS8oy5NL89_0MUuYcnn). Полная карта — `docs/SOURCES.md`.
- Актуальное утверждённое решение Owner/PO, нормы CURRENT SRS/Scope/Governance, Data & Integration, E2E → утверждённая Primary DS → действующие FOS Masters → соответствующие CURRENT Figma-экраны → проверенный код/тесты. Технические заметки, архивные чаты и автономный HTML ниже в иерархии. **Более новое не означает автоматически утверждённое.** При противоречии — `DECISION BLOCKED` и варианты решения, не «тихая» замена.
- `README.md` — локальный вход в приложение и запуск, **не замена Drive**. `docs/PROJECT_STATE.md` — краткая последняя локальная сводка; `docs/DELIVERY_PLAN.md` — текущие этапы/гейты; `docs/DECISIONS.md` — локальный индекс принятых и открытых решений с ссылками на первоисточник; `docs/HANDOFF.md` — передача между сессиями. В начале сессии перепроверь записи на устаревание.
- Документацию читать **адресно**: сначала CURRENT index, затем 2–5 релевантных источников и при необходимости оригинальные договорённости. Не загружать весь Drive и все экраны Figma в контекст.
- Если есть новый CURRENT в Drive, актуализируй локальный индекс; не перезаписывай утверждённые документы по собственной догадке. Не менять SRS/Scope/Governance без явного поручения.

## 3. Процесс: анализ → решение → минимальное изменение → QA → распространение

Для существенной задачи:

1. **Интент и ограничения.** Какую проблему пользователя решаем, где в MVP, какой измеримый результат? Проверить сущности, права, входные данные и ожидаемое действие.
2. **Source-of-change.** Определи первопричину и правильный уровень: Product/SRS → Data/API → UX interaction → Design System/master → shared React primitive → конкретный экран. Не скрывай системный дефект локальным CSS-хаком.
3. **Исследование при необходимости.** Для нового, спорного или нестандартного паттерна изучи зрелые решения, официальные документации и компромиссы **до** выбора подхода. Отделяй подтверждённое внешними источниками от гипотезы. Для обычной локальной правки не устраивай длительный ресёрч без практической пользы.
4. **Варианты и решение.** При значимых альтернативах дай 2–3 варианта по критериям UX, стоимость, риски, поддерживаемость, сроки и совместимость; рекомендуй один с обоснованием, но не утверждай изменение продуктового решения самостоятельно. Оцени `KEEP / REDESIGN / REMOVE / DEFER`. Не выдумывай сущности/действия/статусы «для красоты»; при нехватке основания ставь `LOGIC GAP`.
5. **План на проверяемые шаги.** Файлы/компоненты, зависимости, тесты и критерии приёмки каждого шага. Для новой функции — сначала решение/дизайн, затем план, затем выполнение; не выдавать набросок за финальный продукт.
6. **Минимальное изменение.** Основная папка проекта и обычная Git-ветка по умолчанию; worktree — только с согласия владельца по правилам ниже. Один источник истины и одна небольшая вертикальная часть. Существующий код сохраняй; не удаляй чужие изменения. Сначала сравни с утверждённым эталоном.
7. **Тесты и независимая проверка.** Проверить функциональность, продуктовую семантику, техническую целостность, дизайн/адаптивность, a11y, регрессию, безопасность данных и cleanup. Повторно проверить связанные области, затронутые shared изменением.
8. **Доставка.** Обновить локальное состояние и релевантные документы, оставить PR/diff, тестовые доказательства, открытые пункты и handoff. Только после Owner gate — масштабирование.

**Не выполнять механически:** если задача неверно поставлена, предложи улучшение и укажи последствия. Если решение утверждено — выполни в рамках согласованного; не используй «инициативу» для изменения бизнес-логики.

## 3.1. КОМПОНЕНТЫ СНАЧАЛА / HTML ТОЛЬКО ДЛЯ СЛОЖНЫХ ВЗАИМОДЕЙСТВИЙ (OWNER 04.11, CURRENT)

После аудита CURRENT Client UX V2 + CURRENT Manager UX V2 старое требование «создать HTML-копию **каждого** экрана перед React» **ЗАМЕНЕНО**. React-экраны собираются из переиспользуемых компонентов по действующей Figma; дополнительный HTML нужен только для нестандартной визуальной динамики (Primary press, Sidebar lens, Tabs lens, dropdown/overflow optics) **перед переносом именно этой динамики в React**.

1. Актуальные Owner/PO/SRS → Primary DS → FOS Masters → **CURRENT Client UX V2 или Manager UX V2** → [аудит 95 мастеров](https://drive.google.com/file/d/1vK7eRlBXxDxTAdfKQhdFA8qRVJ6H_FOr/view). Не брать `ARCHIVE`, `SUPERSEDED`, `UX PROPOSED` как автоматически утверждённое MVP.
2. На один компонент — один маленький контракт: Figma ID, props, variants, действия/disabled, D1440/L1024/T768/M390/M320, keyboard/touch/reduced-motion и потребители Client/Manager. Нормализуй Figma instances в общие React-компоненты, не копируй разметку на каждый экран.
3. Для анимационной оптики сначала изолированный HTML proof и **Owner visual approval конкретного эффекта**; для обычных полей, карточек и статичных строк HTML не требуется. Отдельно зафиксируй `FIGMA_MAPPED → CONTRACT_READY → (GLASS_HTML_OWNER_APPROVED, где требуется) → REACT_COMPONENT → COMPONENT_QA → REACT_SCREEN → SCREEN_QA/OWNER → PR`.
4. Базовый визуальный React-компонент может быть подготовлен **без неутверждённой motion**; не объявляй его финальным Glass-вариантом и не переносись сразу на экраны. Каждый shared change требует Client/Manager регрессии.
5. **Первый микрошаг FE-01:** [HeaderAction контракт](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view). Не смешивай HeaderAction Figma `1953:4168/2173:1425` с текстовой ActionButton `835:259`. Десктоп 68×68 icon+caption, T/M 48×48 compact (по конкретным Figma instances); плюс 48px. Реализация только по отдельной узкой задаче.
6. **Agent Package A:** общий HeaderAction с двумя презентациями, disabled/onAction, a11y, isolated dev-story и независимым QA — без GL-01B motion, маршрутов/API/1С. **Agent Package B:** GL-01B press и материал лишь после отдельной оценки Owner. GL-01B motion сейчас `OWNER_OPEN`.
7. КОНФЛИКТ: Client My Orders T/M CURRENT Figma показывает Compact48, CURRENT SRS говорит «постоянная подпись на всех ширинах». Поддержи обе презентации, не меняй SRS и не выбирай экранную политику за Owner/PO. Manager Figma Add=enabled, HTML-pilot Add disabled: тестовый enabled только в лаборатории, не оживлять бизнес-действие без разрешения.
8. Не переписывай Figma/Client UX, SRS, статусы, ACL, API/1С; не создавай второй scaffold; PR в отдельной ветке, не в `main`. GitHub PUBLIC — не размещать клиентские сведения.

## 4. Superpowers и режим углублённого анализа

- Проверяй доступность Superpowers по `docs/CODEX_SETUP.md`. На 04.11.2026 навыки из `C:/Users/Max/.codex/skills/superpowers/` доступны в текущей сессии; переустановка не нужна. Это не доказывает marketplace-установку или загрузку новой сессией.
- Если активен — используй соответствующие навыки **Superpowers**: `brainstorming` (неясная задача / новая концепция), `writing-plans` (существенный план), `using-git-worktrees` (изоляция), `test-driven-development` (логика), `systematic-debugging` (дефект), `verification-before-completion` (доказательства), `requesting-code-review` (независимый ревью), `finishing-a-development-branch` (передача). Подчиняй навыки текущим решениям проекта и доступным инструментам.
- **Think before code:** в сложной задаче проверь предположения, зависимости, альтернативы, отказы, границы и негативные сценарии. Показывай краткие основания и выводы, не скрытые рассуждения.
- В `.codex/config.toml` предусмотрен `model_reasoning_effort = "high"`. Реальный уровень зависит от выбранной модели/клиента; при несовместимости исправить конфигурацию, а не считать параметр работающим.
- Superpowers не заменяет Figma/Drive/сборку/тесты и не даёт права менять бизнес-решения. Если plugin отсутствует — соблюдай этот процесс вручную, отметь ограничение один раз.
- Не запрашивай согласование на каждый очевидный технический шаг. Эскалируй только существенные изменения scope, публичных контрактов, опасные операции Git, платные зависимости и конфликты требований.

## 5. Git, параллельные агенты, безопасность

- До изменения кода: `git status`, remote, branch, worktree, наличие чужих незакоммиченных правок. **Не считать наличие пути `D:\Projects\flexomir_os` доказательством Git или React.**
- Если репозитория нет — проинвентаризируй каталог и предложи безопасный bootstrap; Git remote/платформу/первую ветку согласовать. Не выполнять `git init`, `git add -A`, `push`, `force`, `reset --hard`, массовые удаления и перезапись без проверки и разрешения, когда возможна потеря данных.
- По умолчанию работай в основной папке проекта с обычными ветками Git. Новая задача или план не требуют worktree. Предлагай его при конкретной пользе: независимая параллельная работа, одновременное сравнение веток, срочное исправление без вмешательства в незавершённую работу или отдельный эксперимент.
- Перед созданием worktree проверь существующие рабочие папки и изменения; объясни пользу, предложи ветку и полный путь, укажи, откуда открывать и запускать проект, и дождись согласия владельца. Повторное согласие не нужно, если этот worktree уже явно разрешён. Навык не заменяет согласие. Не перемещай и не удаляй существующие worktree без разрешения; не переключай ветки с потерей изменений.
- При согласованном разделении потоков возможны `feature/frontend-screens` и `feature/glass-components`. На Windows worktree размещать вне исходного каталога. Не запускать параллельных агентов без явной задачи на делегирование. Если работа делегирована, не давать двум агентам одновременно редактировать одну ветку/дерево; определить владельца shared-файлов до PR.
- Объединение только через review/PR и прогон тестов; никаких автоматических merge в main и прямых публикаций без явного разрешения.
- Не коммитить `.env`, токены, доступы, пользовательские/коммерческие данные. Не копировать секреты в логи, промпты, демо-fixtures и скриншоты. Права доступа проверяются сервером, скрытие кнопки не защищает tenant.
- По указанию владельца тяжёлые отчёты, видео и PNG прогонов в `output/playwright/`, `test-results/`, `playwright-report/` остаются локальными и исключаются через `.gitignore`. Не добавляй их принудительно. Небольшие версионируемые эталоны `tests/*-snapshots/` — входные данные визуальных тестов; сохранять отдельно от результатов прогонов.

## 5.1. Context7 и сопровождение документов

- Для вопросов и работы, зависящих от API библиотеки, фреймворка, SDK, CLI или облачного сервиса, получай текущую документацию через Context7 MCP, даже для знакомого инструмента. Сначала `resolve-library-id` с названием и полным вопросом, затем `query-docs` с выбранным ID. Исключение — пользователь уже дал точный `/org/project` ID. Выбирать по совпадению, релевантности, репутации, числу примеров и benchmark; учитывать версию. Если результаты не подходят — уточнить запрос. Не нужен для общего рефакторинга, скриптов с нуля, бизнес-логики, ревью без зависимости от API и общих концепций программирования.
- При возобновлении работы проверяй дату ревизии документации. Через 14 дней выполняй её в рамках работы: короткий вход, простой язык, объединение повторов, удаление ненужных завершённых планов и устаревших отчётов; история остаётся в Git. Сохраняй действующие требования, ограничения, инструкции запуска/проверки, контрольные суммы и нужные доказательства приёмки.
- После переноса или удаления проверяй ссылки. При ревизии удаляй устаревшие или заменённые скриншоты/видео, сохраняй актуальные; новые доказательства не подменять старыми результатами. Не менять код или защищённые области под видом документации. Дату ревизии и следующую через 14 дней указывать в `README.md`.

## 6. Специфика Screens и Liquid Glass

**Screens — OWNER уточнение 04.11:** сначала карта общих компонентов и точный контракт, затем React-компонент/QA, затем сборка экранов по CURRENT Figma. HTML — только для сложных эффектов/меню, которые надо визуально принять до переноса **эффекта**, не каждого экрана. Первый пилот — HeaderAction (контракт https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view), далее Manager Orders. Client UX не менять массово; бизнес-семантика отдельно.

**Glass:** отдельная ветка, одна оптическая основа `FosGlassMaterial` / Website Glass GlassLens **если подтверждены исходники, лицензия, совместимость и качество**. Визуально согласованные изолированные эталоны Primary Button 2.1.5, Sidebar Lens 2.2.5 C, Horizontal Tabs 2.3.3c переносить в React без самовольного редизайна. Для Select/Dropdown — отдельный visual gate; движущийся hover/focus indicator не должен выбирать значение до click/Enter. Не копировать Canvas/WebGL процедурную сцену, не создавать второй оптический движок. Заявленные тесты чужого полигона перепроверять в реальной ветке, а не ставить собственный `QA PASS`.

**Конфликт CURRENT:** SRS Client Orders: Desktop ≥1440 Tabs, Tablet/Mobile Select; единый dropdown на всех ширинах пока **не утверждён**. Не заменять им экранные сценарии по собственной инициативе.

**Алексей / интеграция:** API/DTO, идентификаторы, значения и переходы статусов 1С, «Новые», фильтры/сортировка, компания/tenant, права, публикация/сохранение, ошибки и retry — не угадывать. Используй типизированные **явно DEMO** fixtures, отдельный data adapter, статус неизвестного контракта `OPEN`. Видимая кнопка должна иметь `trigger → effect → state/data change → feedback → next state`; если действия не согласованы, disabled/demo и честная маркировка, без фальшивого успеха.

## 7. Проверки: «визуальная + функциональная + обратная регрессия»

- Выполняй [QA checklist](docs/QA_CHECKLIST.md): фактические diff/typecheck/lint/build и unit/interaction tests, UX/ACL/tenant, loading/empty/error, запрещённые действия, фильтры, навигация, dirty forms. Отсутствующий инструмент — `NOT RUN`, не `PASS`.
- Visual: для каждого React-компонента/экрана на **1440 / 1024 / 768 / 390 / 320** сравнить с CURRENT Figma. Для сложных эффектов отдельно проверить HTML oracle + React side-by-side после Owner motion approval. Проверить длинные строки/zoom, overflow, hover/focus/pressed/disabled, scroll/overlay, Client/Manager usages.
- A11y: keyboard/focus-visible/Esc/ARIA/screen reader, touch, reduced-motion, контраст и отсутствие trap. Glass: Chromium и Firefox/WebKit fallback; memory/performance при доступности.
- Регрессия: независимо проверить затронутые Screens/Glass, Client/Manager, mobile и routing, позитивные/негативные сценарии и контрпример к своему решению.
- Evidence: команды, вывод, screenshots, версии и ограничения. `CODE_DONE` ≠ `QA_VERIFIED` ≠ `OWNER_ACCEPTED` ≠ `APP_INTEGRATED`. HTML или один Chromium viewport не дают full QA.
- Перед гейтом проверить cleanup, имена/API/props/импорты/routes/unused/usages и документы по checklist. Не удалять нужные DEMO fixtures или принятые эталоны под видом cleanup.

## 8. Формат результата, решение об остановке и контекст

После содержательной задачи сообщи без длинного отчёта:

**Цель → Сделано → Проверено (доказательства) → Не проверено/риски → Изменённые файлы/ветка/PR → Следующее действие.**

- Обнови `docs/PROJECT_STATE.md` после значимого сдвига; `docs/DELIVERY_PLAN.md` — при смене этапа; `docs/DECISIONS.md` — при новом решении/конфликте; `docs/HANDOFF.md` — перед завершением большой сессии. Не переписывай историю и не присваивай `APPROVED` без основания.
- Существенное решение: кратко проблема, варианты, выбор, риски и проверка; сообщай основания и вывод, не скрытые рассуждения.
- Если столкнулся с блокером, останови только **затронутую** область. Продолжай независимые задачи, не обходи блокер вымышленными контрактами.
- Отдельно фиксируй статус `TODO / IN_PROGRESS / CODE_DONE / QA_VERIFIED / OWNER_ACCEPTED / INTEGRATED / BLOCKED`.
- Перед завершением проверь результат по источнику, работоспособность, регрессию, побочные эффекты и доказательства утверждений.

**Один принцип:** проект должен оставаться цельной системой. Не решай локальную проблему ценой расхождения с требованиями, Figma, другими ролями, Glass, backend или состоянием Git.
