# Flexomir OS — текущее состояние проекта

## CURRENT / 06.11.2026 — завершено слияние, следующая задача M4

- Проверено: `origin/main` `89b043f9ae7e70a36a1eea8f5c98cd621e037aa9`; PR #5, #9, #10 закрыты как MERGED. Первый экран Manager Orders, AppShell и NavigationDrawer уже в React; **Client React-экраны ещё не реализованы**. Полный Manager/Client MVP не готов.
- **M4: AUDIT DONE / OWNER REVIEW OPEN.** Сверены CURRENT Figma DS/Client/Manager, CURRENT Scope/SRS/E2E и `origin/main` `89b043f`. Подробный реестр: [M4 screen map](SCREEN_MAP_M4_2026-11-06.md). Client: **0 собственных React-экранов**, общий `AppShell` есть, но не подключён к клиенту; Manager: `AppShell` готов, список «Все заказы» частично реализован, остальные модули не созданы. Подтверждённые UX не подменяются пилотами/архивами. Следующее React-задание агенту: **FE-S01 (#12): блок A Client Shell + «Мои заказы», блок B read-only OrderDetail для Client + Manager; одна ветка от main и один React PR с LIVE docs** на synthetic fixtures; Owner вопросы по auth, «Клиенты/Компании», queue и full My Layouts остаются OPEN.
- **ДАЛЬШЕ:** M5 каркасы и основные экраны обоих кабинетов → M6 сквозной заказ между ролями → M7 оставшиеся утверждённые MVP-разделы → M8 UX/UI-полировка → M9 итоговый QA. Данные пока синтетические.
- **Правило:** LIVE-документация обновляется в той же задаче, что код/решение; Drive-план, локальный статус, реестр компонентов, решение и handoff поддерживаются без вторых «актуальных» планов. Успешный CI/merge не равен продуктовой приёмке.
- **Границы:** frontend/React — наша работа, backend/API/1С — ответственность Алексея. [Действующий план](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit).

**Рабочий план:** [09_Frontend Development Plan CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit). Владелец 06.11 ограничил нашу работу React/frontend: компоненты, экраны, интерактивность, адаптивность, тесты и UI-интеграция с готовым API. Backend, создание API, server ACL и обмен с 1С — за Алексеем; не ставить эти работы в наш frontend-бэклог. Figma — DS + источник свойств компонентов, НЕ команда реализовать ~230 отдельных кадров.

## Последнее — 06.11.2026: PR #9 слит в main

- PR #9 слит в `origin/main` (`0fc653667ac4acba675fe702920b476a2fda5ac8`) после пяти успешных CI-проверок на `aaaa4304`. PR #5 уже в main (`7372685`); оба preview-маршрута сохранены.
- Общий `AppShell` подключает существующий Drawer к Manager Orders ниже 1024px, SidebarNav — от 1024px. Glass primitives, API/1С и бизнес-контракты не изменены; отсутствующие разделы остаются disabled.
- Свежая локальная проверка: build PASS, combined Chromium **148/148**, финальный экранный Chromium **26/26**, Firefox/WebKit **26/26**, пять размеров и открытое меню T/M. [Протокол, команды, снимки и ограничения](FE08_MANAGER_ORDERS_M3_QA_2026-11-06.md).
- Статус: `CODE_DONE / QA_VERIFIED / MERGED / OWNER_SCREEN_OPEN`. Слияние разрешено прямым поручением владельца; визуальная приёмка и релиз этим не объявляются. Сейчас завершается только слияние PR #9/#10; следующий этап — единая карта экранов Client + Manager в существующем Drive-плане. Название «Клиенты / Компании» остаётся Owner/PO OPEN.
- Существующие локальные аудитные правки и удаления скриншотов сохранены отдельно от коммитов задачи. Ниже — прежние снимки; актуальный этап задаёт этот блок и [Drive CURRENT M0–M9](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit).

**Локальный снимок:** 04.11.2026. **Источник свежих изменений:** [Frontend Startup CURRENT](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit). На новой сессии проверить изменения в Drive и фактический Git.

## Объединение веток — 04.11.2026

- По прямому поручению владельца все локальные и origin-ветки включены в `main`, включая ветку компонентного процесса. Ветки и рабочие папки не удаляются.
- В `origin/main` на `e6fad06` код HeaderAction, SidebarNav и нейтрального стекла уже присутствовал через squash. Конфликты исходных веток разрешены без изменения этих исходников, тестов, зависимостей и CI; сохранена полная история коммитов.
- До слияния и повторно после разрешения конфликтов: `npm run build` PASS (TypeScript + Vite, 50 modules), `npm run test:e2e -- --workers=2` — **80 PASS**, Chromium 1440/390. Проверены 60 локальных Markdown-ссылок и якорей, broken=0; staged diff без whitespace errors. Статус технической интеграции: `QA_VERIFIED`. Material/optics и CURRENT Drive/Figma в задаче слияния NOT RUN; новые продуктовые approvals не выдавались.
- Единственные исходные незакоммиченные изменения — удаления `Screenshot_1.png` и `Screenshot_2.png`; они сохранены вне коммитов. Рабочая папка `D:/Projects/flexomir_os`, дополнительных worktree нет.
- Ниже сохранён контекст предыдущих задач. Указания «код не изменён» и DRAFT относятся к подготовке соответствующей документации; фактически shared-компоненты уже существуют. Дальше нужна сверка их контрактов и Owner gates, затем Manager Orders.

## CURRENT / OWNER 04.11 — компонентный процесс (заменяет обязательный HTML для каждого экрана)

- Сверены CURRENT Client UX V2, Manager UX V2 и общие FOS masters: 95 мастер-семейств, 57 общих [карта](https://drive.google.com/file/d/1vK7eRlBXxDxTAdfKQhdFA8qRVJ6H_FOr/view). Архивы и superseded не используются.
- Новый путь: Figma → компонентный контракт → **HTML только для сложного материала/движения/меню** и Owner gate → React shared primitive → QA → React screens → Figma visual QA/Owner. Схема «каждый экран HTML» УСТАРЕЛА.
- FE-01 [HeaderAction contract](https://drive.google.com/file/d/1zjVFLtIc-cDFXF0ZXyM5ld6mmAWS3HEi/view) DRAFT: 68×68 icon+label desktop, Compact48 T/M, одна семья Client/Manager; текстовая ActionButton — отдельный компонент. Не исправлять мобильную подпись, противоречащую SRS, самостоятельно.
- Исходный Agent Package A: геометрия + состояния/disabled + a11y + тестовое dev-preview; **без** GL-01B motion, без бизнес-логики. Package B после Owner motion approval. На момент подготовки этой ветки код ещё не менялся; теперь документация и существующие реализации включены в main, без нового Owner approval.

## История локальной проверки и уборки 04.11.2026

- Рабочая папка `D:\Projects\flexomir_os`, одна рабочая папка Git; уборка документов ведётся в `docs/filesystem-cleanup` от `eb6173e`. `origin`: `https://github.com/SigmeD/flexomir_os.git`. До уборки уже отсутствовали отслеживаемые `Screenshot_1.png` и `Screenshot_2.png`; эти удаления оставлены без изменений и не включаются в уборку документации.
- `gh repo view SigmeD/flexomir_os --json nameWithOwner,visibility,defaultBranchRef,url`: PUBLIC, основная ветка `main`. Приватность из пакета не выполнена; доступ без решения владельца не менялся.
- Уже существует React 19 / TypeScript / Vite приложение, `src/App.tsx`, `src/GlassMaterialLab.tsx`, Glass/Select primitives, тесты и lockfile. Это Glass-полигон с DEMO-заказами, а не принятый продуктовый Manager Orders.
- Последняя сборка при подключении правил 04.11: `npm run build` PASS, TypeScript (`tsc -b`) и Vite production build, 41 module. При аудите и уборке файлов сборка повторно не запускалась. Зафиксированные версии: Node `v24.11.1`, npm `11.6.2`, Git `2.56.0.windows.4`, Codex CLI `0.166.0`. Отдельных npm scripts `lint` и `typecheck` нет.
- Браузерные тесты/оптический gate в этой задаче NOT RUN: менялись только инструкции и документация. Старые результаты от 03.11 доступны в [документе материала](fos-glass-material.md) и [Select](glass-select-check.md), не считаются свежей проверкой.
- Отчёты `output/`, `test-results/`, `playwright-report/`, зависимости, сборка и кэши исключены `.gitignore`. Версионируемые PNG-эталоны тестов сохранены; тяжёлые видео/PNG прогонов не отправляются.
- Подключены корневой `AGENTS.md`, `.codex/config.toml`, карта источников, QA, реестр решений, план и handoff из пакета владельца с поправками на факты. Superpowers skills доступны; проект уже trusted. Автоматическая загрузка новых файлов в следующей сессии ещё не проверена.

## Продуктовые источники: частичная CURRENT-сверка

04.11 перечитаны CURRENT Baseline (изменён 03.11 в 16:54 UTC), Frontend Startup (20:44 UTC), UX/UI Index (19:19 UTC) и Glass Visual Contract (20:45 UTC). Направление и открытые гейты ниже подтверждены этими документами. Figma и адресная нормативная сверка SRS/Scope/Governance/Data/E2E ещё не выполнены; FE-01 целиком не закрыт.

- Исторические схемы «сразу Figma→React» и «полный HTML каждого экрана перед React» заменены уточнением Owner 04.11: component-first, HTML только сложным motion/optics/menus.
- Прежний автономный HTML-пилот НЕ ПРИНЯТ; не использовать как baseline.
- Primary Button 2.1.5, Sidebar Lens 2.2.5 C, Horizontal Tabs 2.3.3c указаны как визуально согласованные изолированные HTML-эталоны. React-порт и продуктовая интеграция — отдельные гейты.
- Select/Dropdown и `FosGlassMaterial`: Owner gate OPEN; код в этом репозитории есть, его существование не означает продуктовую приёмку.
- Карта ссылок и Figma node IDs — в [SOURCES](SOURCES.md). Документ хранит происхождение пакета; частичная свежая проверка указана выше.

## На очереди

1. **FE-01:** проверить CURRENT Drive/Figma по первой продуктовой задаче; локальная часть FE-00 выполнена.
2. **FE-02/03:** решить вопрос PUBLIC/PRIVATE; использовать существующий React и build, не повторять bootstrap. Запуск и браузерный QA проверять отдельно.
3. **FE-04/05/06:** карта компонентов и FE-01 HeaderAction DRAFT, затем Agent Package A (base React icon action, QA, не трогать экраны).
4. **FE-07:** после визуального Owner approval GL-01B — motion Package B; Figma/HTML/React side-by-side QA.
5. **GL-01…GL-05 (параллельно):** React-порт визуальных эталонов, затем Select/Dropdown по контракту.
6. После компонентного и motion QA + Owner — React Manager Orders, review, PR; не создавать отдельный HTML всего экрана без специфического обоснования.

## Блокеры и открытые решения

- Требование пакета о приватности расходится с последним проверенным PUBLIC GitHub; решение владельца OPEN. CURRENT Drive сверён частично, Figma не инспектировалась.
- Детальные причины непринятия прежнего HTML не оформлены; выполнить gap-аудит, не копировать его.
- SRS Client Orders: Tabs Desktop / Select Tablet-Mobile; единый Dropdown предложен, но не утверждён.
- Критерий Manager «Новые», real API/1C field/status mapping, permitted actions и маршруты требуют подтверждений.
- Website Glass: локальный build проверен; браузерные/оптические тесты требуют свежего прогона для продуктового гейта. Лицензия и браузерная совместимость — отдельные проверки.

## Предыдущее изменение — уборка

- 04.11.2026, Codex, `docs/filesystem-cleanup`, исходная точка `eb6173e`: файловый аудит и уборка документации по поручению владельца. Удалены три завершённых Glass-плана; история остаётся в Git. Действующие ограничения, SHA256, отчёты, локальные доказательства и 14 PNG-эталонов сохранены.
- В README и отчётах обозначены локальные ссылки в `output/`, внешние HTML по путям `D:/downloads/`, порядок получения новых доказательств и границы воспроизводимости. Текущий план поставки и продуктовые решения не менялись.
- При read-only аудите: 55 локальных Markdown-ссылок разрешались, 21 из них вела в игнорируемый `output/`; 20 локальных импортов разрешались; 18 прямых зависимостей совпадали с lockfile/установкой; дублей рабочих файлов по SHA256 не найдено. `git fsck --full` не выявил повреждений, сообщил о двух dangling blobs. Это результаты аудита, не runtime QA.
- Статус уборки и проверка итогового diff — в [HANDOFF](HANDOFF.md). Следующее: закончить FE-01 и перейти к одному React-пилоту Manager «Заказы»; ожидание финальной оптики Glass его не блокирует.
