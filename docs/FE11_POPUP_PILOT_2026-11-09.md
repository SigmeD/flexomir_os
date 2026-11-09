# FE-11 — пилот общих Liquid Glass popup

## CURRENT — post-FE11 dismissal/focus QA / 09.11.2026

Owner поручил закрыть оставшиеся QA-сбои после freeze и подготовить PR #29 к экранной приёмке. Это отдельное разрешение на lifecycle-исправления More; визуальная миграция More на FE11-v0.2 по-прежнему не выполнялась.

**Первопричины и исправления:**

- Закрытый popup оставался интерактивным во время exit-анимации. Roving focus мог перехватить pointer/focus у нового экрана. Общий Surface помечает closed-состояние inert и не принимает pointer; сама анимация/материал не изменены.
- После выбора Profile отложенный Radix close-autofocus мог отнять фокус у действий профиля. Account adapter передаёт владение фокусом экрану при profile action. FOSAction/useDirectionalPress не менялись.
- More повторно закрывался от того же pointerdown на trigger, который открывал его во время завершения предыдущего popup. Trigger-aware onInteractOutside предотвращает только это ложное outside dismissal.
- Escape в More после модального подтверждения терял return-focus из-за накопленного outside-interaction состояния. Адаптер различает Escape, outside click и consumer-owned focus; Escape возвращает trigger, внешний input сохраняет свой фокус.
- Отдельный read-only проход выявил возврат focus на body после отмены удаления. Новый failing regression подтвердил это; OrderComposer теперь сам возвращает focus на доступный More при Cancel/close/Escape диалога. Проверка удаления, отмены и сохранности другого черновика с новым focus-assert прошла во всех четырёх браузерных проектах.

Все три исходно падавших сценария воспроизведены до изменения и прошли после него. Добавлены регрессии exit/inert, immediate reopen, outside-field focus, Profile focus/Space/blur. Тест press/focus отделён от нативного OS file chooser; photo selection покрыта существующими Profile tests.

**Проверки:** build PASS; полный Chromium1440/390 прогон — **458 passed / 4 ожидаемых skips / 0 failed**, включая визуальные snapshots. Freeze-contract PASS; все пять frozen файлов и useDirectionalPress не изменены. Чистый critical cross-browser повтор — **35/35 PASS**; дополнительный Cancel-focus regression на итоговой форме — **4/4 PASS**. Матрица — Chromium/Firefox/WebKit/touch, responsive Account1440/1024/768/390/320 и основные Client/Manager сценарии. Итоговый повтор полного набора на delivery commit и live CI — [PR29 checks](https://github.com/SigmeD/flexomir_os/pull/29/checks).

CI: Orders Core включает новые lifecycle/freeze/adapter/session-draft тесты; M7 UI QA дополнен сериализованным cross-browser popup набором. Новых release-required check names не создавалось. Экранная приёмка Owner и merge остаются OPEN; внешний независимый reviewer не назначался. Отдельный авторский read-only browser/adversarial проход фиксируется в этом же отчёте, не выдаётся за внешнее review.

## CURRENT — FE11-v0.2 / OWNER APPROVED / FROZEN

Owner: «да теперь все верно, подтверждаю». Точный утверждённый исходник и реестр сохранены в Git commit `f527bcb`; [machine-readable freeze manifest](FE11_MOTION_FROZEN_V0_2.json) содержит исходные SHA-256, нормализованные LF fingerprints и hashes формулы/параметров.

Shared implementation checkpoint: `2c303654906365d7cca255aaef5e28ce9ff4ca05`, Draft PR #29. Последующие metadata/whitespace коммиты не изменяют замороженный контроллер.

Контроллер перенесён в `src/components/ui/fos-popup-rows.tsx`. Формула frame и JSX-параметры материала совпадают с эталоном; `FosGlassMaterial`, его CSS и `glass-motion` не изменены. Проверка `tests/fe11-frozen-contract.spec.ts` защищает также общий Rows/CSS от неутверждённых правок. Самостоятельного lab-контроллера больше нет: стенд и продуктовые адаптеры используют одну реализацию, временный render-slot удалён.

| Потребитель | Реализация и семантика | Статус |
| --- | --- | --- |
| NavigationDrawer / lab / Client / Manager | Один Surface + Rows, dialog/focus trap/body lock и route-after-rest остаются в адаптере | Перенесён; frozen scenario |
| AccountMenu / header+footer / обе роли | Тот же Surface + Rows, Radix menu, identity/разделители/disabled; profile — начальная визуальная опора без выдуманного ARIA selected | Перенесён; per-adapter QA |
| GlassSelect / body portal | Тот же Surface + Rows, listbox/value/keyboard/scroll; focus и hover не выбирают значение; выбор закрывает список по его контракту | Перенесён; per-adapter QA |
| Native FOSSelect | Нативный field master 1148:311 с required/validation/onChange | Отдельный контрактный этап, не заменялся автоматически по приёмке стенда |
| Order More | Существующая legacy surface/lens | EXCLUDED из визуальной миграции; последующие lifecycle-исправления описаны в CURRENT выше |
| ConfirmDialog | Alertdialog | Вне popup migration |

Рисунок оболочки, материал и оптика общие. Размеры строк остаются адаптерными (Drawer44, Account56, Select согласно своему контролу); выделен один движущийся материал, отдельный материал оболочки статичен. Поэтому два SVG displacement map в Chromium означают shell + lens, а не две активные линзы. Semantics, trigger placement и business callbacks не перенесены в visual primitive.

Обнаружен адаптерный lifecycle-дефект Account, который существовал до этого переноса: при Escape → быстрый повторный клик старый non-modal Radix layer воспринимал pointerdown на trigger как outside уже открывающегося меню и немедленно закрывал его. CLI trace зафиксировал expanded false→true→false и `dismissableLayer.pointerDownOutside` между ними. Минимальное исправление: ref trigger + `Content.onInteractOutside.preventDefault()` только для этого trigger. Утверждённые motion/scale/material не менялись. Старый responsive Account тест после исправления прошёл в Chromium1440 и390. Документация Radix проверена через Context7: Content onInteractOutside/onCloseAutoFocus и Root contract.

В Select исправлен только layout adapter: clamp к viewport, flip вверх, доступная высота scroll. Светлый фильм совпадает с общим white72/blur20; dark использует существующую палитру. Контраст light hover проверен ≥4.5:1 через существующий brand color, без изменения движка.

### QA после переноса

- Build PASS; freeze-contract PASS. Финальный FE-11 cross-browser прогон212: **201 passed / 3 Firefox browserContext.close protocol errors / 8 ожидаемых skips**. Все три Firefox случая затем повторены одним worker: **3/3 PASS**. Исходный прогон сохраняется как нестабильный, не выдан за полностью зелёный. Chromium, Firefox, WebKit и touch Chromium прошли сценарные проверки; app assertions в трёх случаях завершились до ошибки teardown браузера.
- Полный прогон до окончательного исправления Account: **444 passed / 8 failed / 4 skips** из456. Account failures (2) затем исправлены и проверены отдельно в Chromium1440/390 и четырёх browser проектах. M7 context320 прошёл отдельно. FOSAction Space press-state failure воспроизведён отдельно и не относится к popup motion. Два сценария Order More (удаление и возврат фокуса) повторились на двух проектах и остаются вне текущего scope. Этот полный прогон не считается зелёным; оставшиеся подтверждённые направления — исключённый More и отдельный FOSAction.
- Снимки новых адаптеров просмотрены; Select baseline обновлён под утверждённую общую оболочку, проверка visual snapshot 8/8. Это технические эталоны, не автоматическая приёмка новых экранов Owner.
- Адверсальный проход в отдельном Playwright CLI: длинный список12 строк, End меняет focus на «Статус12» без изменения value «Статус1»; после активации и открытия одна движущаяся линза; длинный label не создаёт page overflow; сокращение до1 строки и до0 удаляет линзу без ошибок. Console: 0 errors / 0 warnings. DOM-мутации использованы только как QA стресс в fixture, не в продукте.
- Покадровые проверки hover→leave→activation→partial/full overlap, rapid retarget, keyboard/touch, reduced-motion/forced-colors сохраняются. Авторский адверсальный QA выполнен; отдельного независимого внешнего reviewer не было. Статус всего релиза/ветки `READY WITH WARNINGS`, а не production acceptance.

Freeze эталона не разрешает менять его при будущих адаптациях. При дефекте сначала первопричина/влияние/предлагаемое изменение и отдельное Owner разрешение. Нативные fields, Order More, Figma masters и итоговая экранная приёмка остаются отдельными решениями. Merge в main не выполняется.

Поставляемый checkpoint сохраняет накопленные frontend/typography/FE-DEBUG правки существующей ветки вместе с FE-11; root PNG владельца и тяжёлые output-артефакты не добавляются. Накопленный до этой итерации diff More сохраняется без новой FE11-v0.2 миграции. Draft PR #29 остаётся единственным PR этого инкремента.

## История до Owner approval — motion candidate v0.2 / OWNER OPEN

Новое Owner-поручение и `D:/downloads/FLEXOMIR_FE11_NAVIGATION_DRAWER_LENS_SCENARIO_2026-11-09.md` заменяют прежний hover-preview сценарий ниже. Теперь hover меняет только цвет, keyboard focus — контур; только click/Enter/Space/tap ретаргетирует одну линзу. Увеличение всех реально пересекаемых DOM-label/icon определяется перекрытием с фактической позицией spring. Старая подпись уменьшается постепенно, новая не растёт до касания.

Первопричина предыдущего поведения: `FosPopupRows` использует pointerId/focusId как targetId, а scale рассчитывает только для этой цели; поэтому hover двигал линзу, а выбор преждевременно обнулял увеличение старой подписи. Это соответствовало предыдущему MD, но противоречит новому сценарию. Сам spring менять не потребовалось.

Один источник кандидата — `src/lab/DrawerLensCandidate.tsx`, подключён только в `NavigationDrawerLab` через семантически нейтральный `renderNavigation` slot. Он не содержит копии spring/Track, использует существующий `FosGlassMaterial.onTravelFrame`, постоянный DOM-узел линзы и неизменённые материал/физику Sidebar. Новых CSS-переопределений, таймеров масштаба или RAF в реализации нет. Общие popup engine и реальные экраны сохраняют предыдущее поведение до отдельного утверждения переноса; их расхождение со стендом на этом этапе намеренное и не считается завершённой миграцией.

### Порядок approval и freeze

1. v0.2 — LAB ONLY / OWNER OPEN: показать hover→leave→click, промежуточные кадры, keyboard/touch/rapid-click.
2. Получить явное подтверждение Owner с указанием версии и эталона; до него не писать `OWNER APPROVED / FROZEN`.
3. После разрешения перенести именно принятый контроллер в общий popup-компонент без копии motion/CSS/линзы. По каждому типу меню — отдельная проверка; Order More по-прежнему исключён.
4. Функциональный/визуальный/регрессионный/адверсальный QA; записать версию, source hashes, approval reference и Git SHA в этот реестр и реестр компонентов. Изменять frozen engine/материал/параметры/scale только по отдельному Owner разрешению после анализа причины и влияния.

Стенд: `http://127.0.0.1:5173/?view=navigation-drawer`; надпись `FE-11 v0.2 / OWNER OPEN`. Кадры и запись тестов — `output/playwright/fe11-scenario/`; test attachments `geometry-frames` фиксируют реальную позицию, scales, selection и сохранность DOM-узла на каждом кадре. Тесты проверяют ранние кадры до касания, частичное пересечение и финал. Видеофайл Owner `bandicam 2026-11-09 22-11-25-875.mp4` найден, прямой покадровый просмотр не выполнен; поведение проверено по текстовому сценарию и живому стенду.

QA v0.2: 107 passed / 5 ожидаемых modality skips, 0 failed в Chromium/Firefox/WebKit/touch Chromium. Команда: `npx playwright test --config=playwright.fe11.config.ts --workers=2 --output=output/playwright/fe11-scenario/results`. Промежуточные кадры проверены на всех четырёх проектах; пять ширин 1440/1024/768/390/320, высота600, Client/Manager, keyboard/touch/rapid retarget, Escape/restore/route-after-rest/reduced-motion/forced-colors. Отдельный Sidebar regression 14/14 PASS Chromium; build PASS, diff-check PASS (только Git CRLF notices). Первый тестовый замер сравнивал позиции во время popup-enter, затем исправлен на ожидание завершения существующей анимации; конечный прогон полностью зелёный.

Просмотрен снимок hover: линза остаётся под Orders, неактивная Support меняет лишь цвет; материал/геометрия соответствуют предыдущему пилоту. Короткая запись сценария: `output/playwright/fe11-scenario/v0.2-chromium-motion.webm`; покадровые JSON находятся в attachments `geometry-frames`. Авторские адверсальные проверки (rapid/duplicate/interrupt/Escape/пересечение/DOM identity) прошли; независимый адверсальный QA и Owner visual approval OPEN. Полная интеграционная регрессия после переноса остаётся отдельным этапом. Git freeze commit отсутствует, миграции на остальные popup нет.

### Fingerprints кандидата (не approval / не freeze)

| Source | SHA-256 |
| --- | --- |
| `src/lab/DrawerLensCandidate.tsx` | `ED1E4A60C97DFF7F7CB2A3D42907AE500E83466720F17A5D7035F972F61D701B` |
| `src/components/ui/fos-glass-material.tsx` | `77F91E9D26CA33347A7EE627C20F9995210883C2CEDA1165347742DCDAC99E12` |
| `src/components/ui/fos-glass-material.css` | `03C3CF371D182C0C3426BA7F731408B27F71AE50DC479C5407E8EA9AE3314BE9` |
| `src/components/ui/glass-motion.ts` | `CB76E61997FB73FE82E9768152F2244153E61755EF6C8F4D1504AFAEEF527F50` |

Последние три файла не отличаются от Git HEAD; физика/material не менялись. Approval reference: отсутствует; frozen Git SHA: отсутствует. Фиксировать их только после утверждения и согласованного переноса/QA.

## Предыдущий пилот v0.1 — исторический checkpoint, hover-preview superseded

Статус: PILOT IMPLEMENTED / OWNER VISUAL OPEN. Дата: 09.11.2026. Дальнейшая миграция выполняется после одобрения пилота по разделам C–D ТЗ.

## Источники и границы

- Постановка Owner: `D:/downloads/FLEXOMIR_FE11_UNIFIED_LIQUID_GLASS_POPUPS_2026-11-09.md`; визуальный эталон Sidebar 2.2.5 C / нейтральный `FosGlassMaterial`, форма `Форма бургер меню.png` просмотрена.
- CURRENT ссылки DS/FOS и Drive сверялись в этой сессии в ходе предыдущих frontend/typography работ: Drawer `1962:3834/3854`, lens `1578:493`, Account `3038:2667`, Overflow `1914:655`. В этом пилоте live Figma заново не запрашивалась и не менялась. Старые белые Account/Overflow masters расходятся с новым направлением Owner; это изменение направления, а не право переписать masters.
- Видео `C:/Users/Max/Documents/Bandicam/bandicam 2026-11-09 20-13-48-493.mp4` найдено. События и временные отметки использованы из MD; прямой покадровый просмотр видео не выполнен.
- `git fetch origin` выполнен; `origin/main=01721e1ce6577951ee12d3e35359a22f911224a2`; PR #29 OPEN Draft, head `1648282bd6aa0898a006a80c9ceca36dcaa0d57a`. Продолжена существующая ветка `feat/fe-debug-2026-11-09`; одно рабочее дерево. Незакоммиченные FE-DEBUG/typography изменения и исходные PNG сохранены.
- «Ещё» заказа исключено из этой итерации. Его уже существовавший незакоммиченный diff сохранён, новые изменения его файлов не вносились. ConfirmDialog остаётся alertdialog.

## Инвентаризация и первопричины

| Потребитель | Семантика / размещение | Найденная реализация | Текущий этап |
| --- | --- | --- | --- |
| NavigationDrawer, Client/Manager AppShell и lab | dialog, собственный body portal; hamburger anchor, trap, inert/body lock | Surface уже общая, но линза и preview жили внутри SidebarNav. Старый hoverLens смешивал pointer/focus; оптика текста и механизм popup были разными | Пилот: общий FosPopupRows + существующий FosPopupSurface |
| AccountMenu, header/footer | Radix menu + portal + collision handling | Уже обёрнут в Surface; общий старый popup driver масштабирует всю строку сразу при hover, отдельно от приближения линзы | OWNER OPEN: следующий адаптер после пилота |
| GlassSelect, сейчас App/lab | listbox, собственный portal, placement, клавиатура/value | Surface уже подключена, но selected/focus и старый hover driver различаются; portal font исправлен typography task | OWNER OPEN: миграция после пилота |
| FOSSelect: CompanyOrders, OrderComposer, OrderItemForm, OrdersComponentsLab | Нативный select | Системный список браузера не рисуется общим React popup | Инвентаризирован; будущая миграция после одобрения и проверки listbox-контракта |
| OverflowMenu / CompletedOrderMenu / формы заказа | Radix menu + portal | Использует прежний Surface API | Исключено ТЗ. Будущий адаптер подключит Rows без изменения пунктов и действий |
| ConfirmDialog | alertdialog, отдельный portal | Не является меню | Вне миграции |

## Компоненты и API

| Источник / состояние | React | API / потребители | Решение |
| --- | --- | --- | --- |
| Sidebar 2.2.5 C material + lens proximity | `FosPopupRows` → `FosGlassMaterial` | `selectedId`, DOM children с `data-popup-item`, disabled, slots `data-popup-label/icon`; никаких бизнес-моделей | CREATE общий визуальный список, пилот Drawer |
| FOS Drawer geometry/material + новое Owner-направление | `FosPopupSurface` | Opt-in `sidebarMaterial`, `hoverLens=false`; ref/ARIA/placement остаются у адаптера | EXTEND существующий источник; legacy consumers пока сохранены |
| Drawer dialog | `NavigationDrawer` | items, activeId, onSelect, onSelectionSettled, closeOnSelection | REUSE поведение, переключить визуальный список; неизменная семантика |

Один `FosGlassMaterial` движется по списку. Его существующий spring и `onTravelFrame` управляют оптическим масштабом одного DOM-label (+4.3%) и icon (+2.2%). Нет второго текста, собственного RAF/spring в Rows или нового motion-двигателя. Фон popup матируется на внешней границе (white72%, blur20); тот же материал даёт световую кромку/тень без второго blur. Отдельный статичный материал оболочки не является второй движущейся линзой.

Preview отделён от selected: pointer/focus меняет цель линзы; click/Enter/Space вызывает адаптер. Pointer leave возвращает selected; touch не устанавливает hover; клавиатурные стрелки/Home/End перемещают focus. Sidebar source и его click-only политика в этой итерации не изменены. Font token из typography task используется без повторного определения.

Popup располагается под hamburger, переворачивается вверх при нехватке места; max-height ограничен viewport. Trap/Escape/restore focus/body lock/ожидание фактического rest перед route commit сохранены.

## Проверка и визуальные доказательства

Команды: `npm run build` PASS; `npx playwright test --config=playwright.fe11.config.ts --workers=2`: 101 passed, 2 Firefox context-close protocol errors, 5 ожидаемых modality skips. Оба Firefox случая повторены отдельно в одном worker: 2/2 PASS. Это нестабильность browser teardown, исходный прогон не объявляется полностью зелёным. Дополнительный Client Orders + Manager Orders + SidebarNav regression: 35/35 PASS Chromium. `git diff --check` PASS (только предупреждения Git о CRLF).

Пакет включает предыдущие сценарии Drawer и новые проверки hover→leave, rapid retarget, совпадения положения линзы со строкой, масштаба текста, keyboard preview без commit, touch/reopen, пяти ширин 1440/1024/768/390/320 при высоте600, flip anchor и реальных Client/Manager shell. Reduced-motion, forced-colors, focus trap, body restore и duplicate tap покрывает существующий Drawer suite.

Артефакты локальные, ignored: `output/playwright/fe11-pilot/`. Пилот для просмотра: `http://127.0.0.1:5173/?view=navigation-drawer`; реальные экраны `?view=client-orders` / `?view=manager-orders` на ширине390.

Просмотрены Chromium hover и реальные Client/Manager снимки. С эталоном совпадают popup radius20/padding16, высота строки44/gap4, нейтральная линза и типографика навигации. Расположение привязано к hamburger; линза на hover стоит под preview-строкой при сохранённом `aria-current` на выбранной. Фоновая матовость восстановлена после визуально найденного дефекта вложенного backdrop; отдельная проверка геометрии ловит ранее найденный сдвиг линзы из-за CSS specificity. Before/after в одинаковых состояниях не подготовлены: старые снимки не выдаются за новую baseline-пару.

## Гейты и дальнейшая миграция

| Область | Статус |
| --- | --- |
| NavigationDrawer пилот | IMPLEMENTED; Chromium/Firefox/WebKit/touch проверки выполнены, два Firefox teardown сбоя прошли повторно; Owner visual OPEN |
| AccountMenu | OWNER OPEN, миграция остановлена до одобрения пилота |
| GlassSelect / native FOSSelect | OWNER OPEN, следующий адаптер после Account |
| Order More | EXCLUDED, будущий opt-in без изменения бизнес-действий |
| DS/FOS master update | OPEN, отдельно согласовать; не выполнено |
| Независимый адверсальный аудит / полная регрессия после миграции | OPEN; авторская проверка не считается независимой |
| Merge | Не выполнен; PR #29 Draft |

После одобрения пилота Account и Select переходят на один Rows через семантические адаптеры; старый Surface hover-driver удаляется лишь после миграции разрешённых потребителей и решения по исключённому More. Проверить disabled/0/1/N/длинные строки/внутренний scroll и nested поповеры на адаптерах. Текущий пилот не объявляет эти ещё не мигрированные сценарии принятыми.
