# Flexomir OS — CURRENT источники

## Проверка размеров и смены статуса —10.11.2026

Figma read-only session88ca34e1-ac28-461b-ac35-576d4803d425: FOS Date Field1169:437 (Default1169:383 / Readonly1169:433, control44px); Client New1810:12510/1837:6359/1810:12545 (506/728/350px); Client Detail1838:6565/1838:6810/1838:7031 (старый desktop720px); Manager draft2569:24648/24851/25041 (506/350/350px). Новое прямое указание Owner о едином размере выше старой readonly ширины.

Заново прочитаны существующие CURRENT frontend plan и E2E v0.2. E2E различает сохранение договорённостей, «Создать заказ» в1С и последующий sync; точный production status mapping остаётся OPEN. Поля/textarea остальных форм проверены в коде; Figma Support Description2412:10665 подтверждает отдельный textarea146px с label (control120px), не базовое однострочное поле44px. Raw refs прошлого M8 использовались как изображения для сравнения; свежие измерения узлов и browser captures отдельно в [аудите](M8_FINAL_AUDIT_2026-11-10.md).

## M8 final audit — 10.11.2026

Проверены существующие Drive CURRENT frontend plan, UX/UI source index, SRS v0.5, E2E v0.2 и Glass contract. Поздние Owner решения/merged PR #29/#30 выше старых candidate notes. База fresh origin/main 9d1f5bc, четыре stash сохранены, активных PR на старте нет.

Figma file7rvIYc6yj3OA7gxmf1xJbv, audit session 0afae8b2-6da2-4635-a892-97f2392f3d58:69 новых isolated renders по точным IDs/размерам из scripts/m8-screen-manifest.json. Node ancestry и CURRENT/PILOT/CANDIDATE проверены. Figma не изменялась. Для Support Detail 634:8137 получен design context с render; frame/master Breadcrumbs подтверждён на обеих ролях.

Raw PNG output/m8-final/figma, реальные browser captures/pairs и index ignored/local. Script сохраняет исходные exports, crop вычислен из exact render bounds, картинки не растягиваются. Совпадение fixture copy/record count не требуется; Owner deltas и source conflicts отражены отдельно. [итоговый аудит M8](M8_FINAL_AUDIT_2026-11-10.md).

## Предыдущие checkpoints (история)

## FE11 popup rollout — 10.11.2026

Источник задания: `D:/downloads/FLEXOMIR_FE11_POPUP_UNIFICATION_REAUDIT_2026-11-09.md`. Более новые прямые решения Owner: сохранить 14/18/500; «да подтверждаю» принимает пилот/action behavior и открывает D/E. PR #29 MERGED03238af, эта поставка — PR #30 от main a9ffa8a.

Drive frontend CURRENT и Glass contract проверены; existing CURRENT план синхронизируется со статусом PR, не заменяется новым документом. Context7 `/radix-ui/primitives`: onSelect/default close, asChild/focus; implementation отдельно проверена read-only reviewer.

Figma file `7rvIYc6yj3OA7gxmf1xJbv`, session `22e569f5-2dee-46de-92de-c4b03269602b`: адресный sync Navigation634:511, Account3042:2806, Header Overflow1914:655…676/2015:6085/2016:898/2033:1145 и Select1148:311 description. Новый shared Menu/Item style14/18/500;10Account dividers скрыты, identity/field text не менялись. Реиспользованы Drawer shell effects; motion reference f527bcb не заменяется Figma effects. До/после renders и ledger `output/design-system-state-fe11-2026-11-10.json` ignored.

Старое native-like соглашение не переписано: на мастерах добавлен датированный Owner delta, исходные descriptions сохранены ниже. Утверждённые SRS/Scope/Governance не редактировались; новый opening contract прослеживается через [отчёт FE11](FE11_POPUP_REAUDIT_2026-11-10.md). Пять attachments исходного задания не выдаются за просмотренные; собственные baseline и 43fresh rollout screenshots сняты отдельно.

## История предыдущих сверок

## Post-FE11 lifecycle QA — 09.11.2026

Источник — прямое поручение Owner продолжить QA после утверждения frozen reference. Baseline `3bb9faf`, PR #29. До исправлений воспроизведены три failures; browser focus trace показал закрывающееся account menu как источник focus-steal. Переиспользована проверенная в этой сессии Radix Content onCloseAutoFocus/onInteractOutside семантика. Context7 Playwright TestProject grepInvert сверено для touch-проекта. Figma/визуальный master/engine не изменялись. [Отчёт](FE11_POPUP_PILOT_2026-11-09.md).

## FE11-v0.2 approval / controlled transfer — 09.11.2026

Источник approval: прямой ответ Owner «да теперь все верно, подтверждаю» на стенд v0.2. Reference commit `f527bcb`; [manifest](FE11_MOTION_FROZEN_V0_2.json) фиксирует source hashes. Context7: Radix Primitives Content onInteractOutside/onCloseAutoFocus и Root non-modal contract — для исправления адаптерного Escape→reopen, без изменения motion. Figma masters не менялись. [Результат/границы/QA](FE11_POPUP_PILOT_2026-11-09.md).

## FE-11 v0.2 selection-only and freeze policy — 09.11.2026

Новый Owner источник: `D:/downloads/FLEXOMIR_FE11_NAVIGATION_DRAWER_LENS_SCENARIO_2026-11-09.md` и прямое поручение о порядке стенд→подтверждение→общий React→адаптеры→QA→freeze. Это заменяет hover-preview из предыдущего MD. Видео `bandicam 2026-11-09 22-11-25-875.mp4` найдено; прямой просмотр не выполнен. Проверен текстовый сценарий и живой стенд с покадровыми данными. Figma/material/spring не менялись. [Версия/источники/approval](FE11_POPUP_PILOT_2026-11-09.md).

## FE-11 pilot — 09.11.2026

Новый источник Owner: `D:/downloads/FLEXOMIR_FE11_UNIFIED_LIQUID_GLASS_POPUPS_2026-11-09.md`; форма `D:/Projects/flexomir_os/Форма бургер меню.png` просмотрена. Видео 20-13-48 найдено, покадровая проверка не выполнена. Read-only GitHub PR #29 OPEN Draft подтверждён; origin/main `01721e1`. Использованы DS/FOS ссылки, проверенные ранее в этой сессии; Figma в этом пилоте заново не запрашивалась, masters не редактировались. [Границы/источники/QA](FE11_POPUP_PILOT_2026-11-09.md).

## FE-DEBUG-2026-11-09 — checked 09.11.2026

Task brief: `D:/downloads/FLEXOMIR_OS_CODEX_FRONTEND_FIXES_2026-11-09.md`; user evidence: six Bandicam recordings and numbered images `1.png`–`12.png` under `D:/Business_Profit/Syntecore/Флексомир/Фронт/Фиксы 09.11/` (read-only). Read current Drive frontend plan, UX/UI source index, SRS v0.5, Data & Integration, E2E, Liquid Glass contract, and Account/Profile 08.11 update before coding. Read-only Figma context: AppShell `637:180`, Sidebar Account Footer `3123:1214`, Adaptive GlassLens `1578:453/493`, Drawer `1962:3834/3854`, More `1914:655..676`, Profile Page Actions `3215:1357`. Figma was not edited. The CURRENT references explicitly use a frosted Drawer and white More menu; cross-menu material consolidation therefore remains an Owner visual decision. Context7 React docs were fetched for current effect/event cleanup patterns. All external screenshots/videos remain outside Git.

## FE-ACTION-08NOV / FOSAction and responsive work dock — checked 09.11.2026

Read-only Figma mapping: Action `835:259`, Secondary Default/Hover/Pressed `835:243/245/247`; Work Action Dock `3143:1219`; adapter `3144:2851`; App Shell `637:180`; Account Trigger `3037:2656`; Avatar80 `3177:1314`; Profile Page Actions `3215:1357`; HeaderAction `1953:4168`; shared header `2302:2138`. Source task: `D:/downloads/Flexomir_Codex_Task_02.md`; user-provided existing-style references: `Screenshot_1.png` and `Screenshot_2.png` (kept untracked). Figma masters were not edited. Current Drive frontend plan was checked before implementation; it identified FE-ACTION-08NOV as next task after FE-PROFILE-01. Context7 Playwright v1.64.1 documentation was fetched for responsive viewport and bounding-box/screenshot verification. Owner visual acceptance is OPEN.

## FE-PROFILE-01 / Account Menu + Profile — проверено 09.11.2026

Task brief: `D:/downloads/FLEXOMIR_CODEX_01_PROFILE_INTEGRATION.md`. Read-only CURRENT Figma mapping: FOS V2 Account Menu `3038:2667`; DS V2 Sidebar Account Footer `3123:1214`; App Shell `637:180`; Profile Page Actions `3215:1357`; Profile Avatar `3177:1314`; WIP profile `2963:1169`; unsaved Confirm Dialog master `3098:1663`. These are WIP/reference nodes; Owner visual acceptance remains OPEN. The current Drive frontend plan and the user-supplied scope constrain implementation to React/frontend, with no backend/API/1C or ACL change.

Technical references were fetched through Context7 for React effect cleanup (local object URL lifecycle) and Playwright projects/viewport/file chooser behavior. No Figma node, SRS, scope or product decision was modified. Role fixtures are synthetic and persistence is demo-session only.

## FE-DEBUG-02 / issue #25 — layout references checked 08.11.2026

Read-only Figma verification: Primary DS V2 `634:60` → FOS App Shell `637:180` / content slot `637:119` → Client My Orders Desktop `634:6825` (and mobile `634:7714`), Support Mobile `634:8314`, Layouts Mobile `634:8277`; shared Page Header `2302:2138`, Order Row `685:195`. Figma confirms 72px desktop content inset for My Orders and 16px compact inset for Support/Layouts. The 1440px container limit is from the current React baseline and remains an Owner visual candidate, not a Figma token. No Figma file or master was changed.

## M8 / FE-S05 — адресная CURRENT сверка 08.11.2026

Read in this task: Owner PR #22 comment / issue #21, canonical Drive frontend CURRENT (modified 07.11.2026), SRS v0.5, Scope MVP v0.3, Primary DS V2 `634:60`, FOS Technical Masters `1688:532`, Client UX V2 `634:6815`, Manager UX V2 `2495:8870`. The Screen Map links CURRENT source nodes and test/screenshot evidence. Figma was read-only; no requirements/master was changed. Current Figma page/section hierarchy and representative Client/Manager frames were inspected; comparison images are local/ignored.

## FE-DEBUG-01 / issue #23 — CURRENT sources, 08.11.2026

Owner issue [FE-DEBUG-01](https://github.com/SigmeD/flexomir_os/issues/23), fresh base `origin/main bc734d29163cb84c5751437839b75044b98eb29b`, canonical Drive frontend development plan (read in-session), existing OrderDemoWorkspace/Client/Manager routes and tests. Technical references were checked through Context7: [React Activity](https://react.dev/reference/react/Activity) for preserving hidden role state, and [Playwright assertions](https://playwright.dev/docs/test-assertions) for web-first cross-browser checks. No new Figma master or product rule was introduced; the approved stand wrapper remains subject to Owner UI review.

Code/test delivery: [Draft PR #24](https://github.com/SigmeD/flexomir_os/pull/24), code/test head `e1a906910a77c372edd6edc1d10fbd2b2a66f97f`. All six GitHub Actions workflows succeeded on this SHA; the follow-up commit updates documentation only.

## FE-S03 — historical CURRENT verification 06.11.2026

Перед реализацией прочитаны issue #17 (updated 19:45:50Z), CURRENT frontend plan (modified 19:46:49Z), SRS v0.5 (modified 12:54:47Z), Scope v0.3 (modified 30.10 18:27:41Z). Git fetch подтвердил main351157c и отсутствие открытых PR перед созданием единственного PR #18. Более новые исторические/candidate вставки не повышались до approved требований.

Figma read-only: DS634:60 → FOS1688:532 → Manager02.1 2634:20095, Manager03.1 2634:20172, Client Support1340:4351, Layout CORE1340:4350 и selection2044:7200. Проверены masters/component sets/variants и prototype reactions; конкретные IDs и переходы — Component Registry/Screen Map. Файл дизайна не изменён. Доступная Figma session: 8ccea704-78f9-4e4c-bc02-d793b8e18024.

27 свежих CURRENT PNG (D/T/M: companies, support-list/detail, layouts-list/detail/upload и select-list/detail/upload) хранятся локально output/fe-s03/figma; без временных asset URLs в runtime. scripts/m7-figma-comparison.cjs строит native-pixel пары в output/fe-s03/comparison, убирая только экспортные поля тени 24px слева/16px сверху. Размер узла проверяется до сравнения; PNG не масштабируются. В Git входят только SVG рабочего UI из high-fidelity design context; тяжёлые evidence остаются ignored.

Технические docs получены через Context7: official React controlled forms/state/Activity и Playwright v1.64.1 screenshot/assertions. React Activity сохраняет состояние посещённых разделов и отключает effects скрытых экранов; это не security boundary. Server ACL не проверен и не реализован.


**Правило:** сначала проверяй доступность и даты документов, затем адресно читай релевантные разделы. Ссылки ниже — точки входа, не слепо утверждённые снимки. Не переносить решения из других проектов.

**Происхождение:** пакет `Flexomir_OS_Codex_Agent_Rules_2026-11-04.zip` и предоставленные владельцем `AGENTS.md`, `CODEX_SETUP.md`, `README (1).md` в `D:/downloads/`. Содержимое трёх отдельных файлов совпадает с соответствующими файлами архива. Импорт и сверка локального состояния — 04.11.2026. Содержимое Drive/Figma в этой задаче не перечитывалось; статусы из пакета требуют CURRENT-проверки перед продуктовой работой. Сам импорт не подтверждает доступность ссылок или новые approvals.

## Google Drive / документы

| Приоритет | Источник | Для чего читать |
| --- | --- | --- |
| 0 | [Основная папка Flexomir-V](https://drive.google.com/drive/folders/1-0UKiK1h1MT2lXS8oy5NL89_0MUuYcnn) | Общая рабочая база |
| 0 | [Frontend Development Plan CURRENT M0–M9](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit) | Действующий план этапов; перечитан 06.11.2026 для интеграции Drawer в PR #9 |
| 1 | [00_CURRENT — Baseline](https://docs.google.com/document/d/1pHzQ2J75AZyT24Qg-HyZof79cASTXFOhqWIEDW_vVqU/edit) | Состояние и приоритет решений |
| 1 | [07_CURRENT — Project Governance](https://docs.google.com/document/d/1m0TmticLfJYsnNG2aXt4tH6dNrjozMvRIahlCOhlicM/edit) | Решения, согласования, ограничения |
| 1 | [03_CURRENT — SRS v0.5](https://docs.google.com/document/d/1EwjqQ3z_lO2lyDCQHhm-NIiDxgZzPrKOXAWR3tC-C4M/edit) | Функции, роли, статусы, MVP-поведение |
| 1 | [02_CURRENT — Scope / MVP Roadmap](https://docs.google.com/document/d/1-xAngGqyIBJg-Whyv7fMYKvwBa3mRonWtSp-O9mq5Mg/edit) | Границы работ |
| 1 | [01_CURRENT — Product Vision](https://docs.google.com/document/d/14sg_0c10ZQUVQ__hJt9tGyyN1PvRF6fs0TMZjm2GL88/edit) | Для чего создаётся продукт |
| 1 | [04_CURRENT — Data & Integration](https://docs.google.com/document/d/1Wf8EA76i6qBqY4lfiTLAfSLhuyZVnHKyDQLOpZCnCkU/edit) | Сущности, связь с 1С и открытые контракты |
| 1 | [05_CURRENT — E2E Processes](https://docs.google.com/document/d/1aOeKYmlmh5hiNltnwIpsLnk7LtlhJ93ldlHVCTVG7Us/edit) | Переходы пользователей и состояний |
| 1 | [06_CURRENT — Risk Register](https://docs.google.com/document/d/1HhduY9BWRwk-Ayxw7jID2aH76JWInbyo9gu8NzHzUOc/edit) | Риски и зависимости |
| 1 | [Frontend Startup CURRENT](https://docs.google.com/document/d/18C7-AiVGNWirt7xaTPbW734ZEvBDM2MwFPYB690mDwk/edit) | Исходный FE-00…FE-12; текущая исполняемая последовательность — 09_FRONTEND CURRENT |
| 1 | [UX/UI CURRENT Index](https://docs.google.com/document/d/1RWrqveia84o487bcXwXh00rXoiSMZBKAJJ9FdpZRVkA/edit) | Актуальные DS/Figma/HTML источники |
| 1 | [Liquid Glass Visual Contract CURRENT](https://docs.google.com/document/d/1VgaR8sfpRWeYVhDlN9jGkehLnXbCTiNQSBSEZCVWmGI/edit) | Approved visual references, Glass status, QA gate |
| 2 | [FOS V2 аудит и контроль](https://docs.google.com/document/d/1whIXylrjwaUQU-9-o2kfdgwSVG1U-sY3CRJvvoTsYX0/edit) | История мастеров и технические ограничения |
| History | [Frontend V3 handoff 02.11](https://drive.google.com/file/d/1OGMVP_T3bqBHp9W6SLvRYVTX6TGlQXqX/view) | Исторический срез, НЕ заменяет CURRENT |

## Figma — только CURRENT страницы

- [Файл Flexomir OS](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS)
- [Primary Design System V2](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-60) — основные токены и правила
- [FOS V2 Technical Component Masters](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=1688-532) — связанные технические компоненты
- [Manager UX CURRENT](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2495-8870) — основной текущий frontend-поток
- [Manager / Заказы](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2633-20095) — первый пилот
- [Manager / Компании](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20095) — следующий модуль после gate
- [Manager / Поддержка](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=2634-20172) — отдельный модуль
- [Client UX](https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-6815) — отдельная роль и пакет; не затрагивать без запроса

## Внешние технические источники (не продуктовая норма)

- [Manrope / Google Fonts](https://github.com/google/fonts/tree/main/ofl/manrope) — шрифт утверждённой Figma, локально `src/assets/fonts/Manrope-variable.ttf` + `OFL-Manrope.txt`; runtime без внешнего font request. Добавлен для PR #16 parity, не новая DS-типографика.

- [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Codex Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference)
- [Superpowers (obra)](https://github.com/obra/superpowers) — установку и доступные skills проверяй на фактической версии, а не по старому туториалу

**Трекер:** в `docs/DECISIONS.md` фиксируй новое утверждение и открытое противоречие вместе с ссылкой и датой; не копируй все страницы из Drive в репозиторий.
