# FE11 — повторный аудит popup и пилот общего API

**Статус:** PILOT IMPLEMENTED / QA VERIFIED; Owner visual/action acceptance и массовый rollout OPEN. Merge не разрешён.
**База:** `a9ffa8a`, ветка `feat/fe11-popup-unification-reaudit`. Предыдущий PR #29 уже слит в `03238af`.
**Поставка:** [Draft PR #30](https://github.com/SigmeD/flexomir_os/pull/30), code/test checkpoint `4bc4a5d1e6174e2f5f7c51784ecbbfded07ef8c9`. CI проверяется на фактическом PR head; merge не выполнен.
**Задание:** `D:/downloads/FLEXOMIR_FE11_POPUP_UNIFICATION_REAUDIT_2026-11-09.md`.
**План и полный список потребителей:** [план пилота](superpowers/plans/2026-11-10-fe11-popup-reaudit.md).

## Решения и границы

Owner повторно подтвердил **14/18/500** в этой сессии. Значение 13/18/600 в исходном файле не применяется. Общие typography tokens и profile identity roles сохранены.

Проверены Drive frontend CURRENT и Glass contract; Figma read-only: Navigation Item `634:511`, Account Menu `3038:2667`, Select Field `1148:311`. Старые Account separators/type и native-like field visuals в Figma расходятся с новым Owner-направлением; Figma не менялась. Render references сохранены локально в `output/playwright/fe11-reaudit/figma-*.png`. Пять Owner screenshots, упомянутых в задании, не были приложены к этому сообщению; они не выдаются за просмотренные. Вместо них сняты свежие baseline состояния текущего кода.

В обычных маршрутах прежние адаптеры остаются до приёмки. Пилот включён **только в dev** через `popupPilot=1`. Компания в заказе менеджера, фильтры компаний, disabled sorting, существующий GlassSelect и Drawer не мигрируются автоматически. Backend/API/1С/ACL не менялись.

## Воспроизведение и причины

| ID | Проверка на новой базе | Исправление / состояние |
| --- | --- | --- |
| R1 | Старые 15/20/500 уже отсутствуют: до этой задачи пункты используют общую14/18/500 | Сохраняем подтверждённую роль; не воспроизводим устаревшее описание как новый дефект |
| R2 | Account содержит три Radix separators; видны на baseline | В пилоте список без separators; legacy остаётся только в default режиме до rollout |
| R3 | Account hardcoded profile lens присутствует при первом открытии | Actions mode не принимает selectedId; до действия нет линзы/aria-selected |
| R4 | Shape/Material — native SELECT высотой44px. Отдельный OS popup не захвачен | Пилот открывает React listbox; синий OS popup не вызывается. Form state остаётся у настоящего select |
| R5 | More использует default Surface с hover driver, без Rows | Пилот использует FosPopup actions с нейтральной Surface и Rows, прежними callback/focus/confirm |
| R6 | Drawer уже использует принятые Surface + Rows | Эталон без изменений; перенос на public API после приёмки |
| R7 | GlassSelect и FOSSelect имеют разные семантические контракты | Новый узкий FOSGlassSelect; старый FOSSelect и остальные поля не заменены |

## Компоненты и контракты

- `FosPopup` — публичная композиция Surface + Rows, modes actions/listbox/navigation; данные пунктов, заголовок, размеры и callbacks. Consumer не выбирает hover driver/material. Actions не допускает selectedId в TypeScript.
- `AccountMenu` — в пилоте тот же identity block, команда профиля и disabled company/logout; без линий и постоянной активной строки. Radix владеет dismiss/focus.
- `OverflowMenu` — тот же MoreAction и массив команд; прежние delete/confirm/cancel/duplicate callbacks. Меняется открытая поверхность.
- `FOSGlassSelect` — тот же Field/44px trigger, native proxy для value/onChange/required/FormData/reset. `onChange` получает настоящий select event. Focus/blur/key events типизированы для видимой кнопки, autofocus также относится к ней. Контракт только single string value; native multiple/size API не объявляется поддержанным.
- Controlled value и ошибки читаются из принятого родителем значения, а не временного значения proxy во время change. Readonly не открывается, сохраняет submitted value и пропускает required validation как readonly input. Disabled не участвует в FormData.

**Action-adapter candidate / OWNER OPEN:** действие выполняется штатно, без искусственной задержки. Линза не имеет выдуманной начальной позиции: первая активация создаёт feedback в нажатой строке, travel origin отсутствует. Навигационный callback может размонтировать host раньше видимого завершения feedback. Политику требуется принять отдельно; её нельзя представить как already-approved travelling action animation.

Для Select есть настоящее предыдущее значение. Реализовано закрытие после фактической остановки существующей линзы: commit данных сразу, удержание только popup, без таймеров и повторного исполнения callbacks. Observer сверяет `settled/off` и реальные top/height с точностью0.75px; generation отменяет stale completion при повторном выборе, Escape/outside/reset/disable/unmount. Escape/outside сохраняют уже принятое значение и закрывают popup. Same-value/rejected selection не создают искусственного ожидания.

## Визуальные материалы

Свежие screenshots сняты и просмотрены. Имена содержат роль/ширину; файлы локальные/ignored.

| Состояние | До | Пилот |
| --- | --- | --- |
| Account Desktop | [baseline](../output/playwright/fe11-reaudit/before-account-1440.png) | [Client1440](../output/playwright/fe11-reaudit/after-client-account-1440.png), [Manager1440](../output/playwright/fe11-reaudit/after-manager-account-1440.png) |
| Account Mobile | [baseline](../output/playwright/fe11-reaudit/before-account-390.png) | [Client390](../output/playwright/fe11-reaudit/after-client-account-390.png), [Manager320](../output/playwright/fe11-reaudit/after-manager-account-320.png) |
| More | [baseline390](../output/playwright/fe11-reaudit/before-more-390.png) | [Desktop](../output/playwright/fe11-reaudit/after-more-1440.png), [Mobile](../output/playwright/fe11-reaudit/after-more-390.png) |
| Поля | [закрытый native baseline](../output/playwright/fe11-reaudit/before-item-390.png) | [Shape390](../output/playwright/fe11-reaudit/after-shape-390.png), [Material320](../output/playwright/fe11-reaudit/after-material-320.png) |
| Drawer reference | [baseline](../output/playwright/fe11-reaudit/before-drawer.png) | [без изменения engine](../output/playwright/fe11-reaudit/after-reference-drawer-390.png) |

Сравнение по регионам: identity/trigger/header/body layout сохранены; в Account исчезли линии и фиктивная активная карточка. More получил общий rim/material, hover lens удалён. Закрытые поля сохраняют44px, label/body роли и chevron; открытые списки используют ту же нейтральную оболочку. Снимки есть на1440/1024/768/390/320. Это browser review кандидата, не Owner acceptance и не pixel parity с устаревшим Figma.

## Проверки и независимый review

- Baseline RED: три pilot cases FAIL, обычный маршрут PASS (`output/fe11-reaudit-red.log`).
- Исправлены найденные в процессе reset sync, длинный label overflow, видимые focus/blur callbacks, controlled rejection error и readonly validity. Исходные FAIL сохранены в diagnostic logs.
- До дополнительной проверки close-after-rest: cross-browser **64/64 PASS**, обе роли/пять ширин, keyboard/typeahead/Escape/outside/Tab, readonly/disabled, required/error, FormData/reset, controlled accept/reject, save/reopen Item и axe без color-contrast rule (`output/fe11-reaudit-verified.log`). Контраст отдельно не объявляется проверенным.
- Build PASS; normalized frozen fingerprints **5/5 MATCH** (`output/playwright/fe11-reaudit/fingerprints.json`); `git diff` пяти engine sources + manifest пуст.
- Независимый read-only adversarial reviewer нашёл два контрактных дефекта и два edge cases; они получили отдельные тесты и исправления. Последняя static review исправлений PASS; runtime выполнял основной агент.
- Итоговая cross-browser проверка: **80/80 PASS (1.8m)**, включая same lens identity, настоящий travel/rest, Escape/outside/reopen, rapid retarget, reduced-motion/forced-colors (`output/fe11-reaudit-final.log`). Отдельное покадровое доказательство — **4/4 PASS** с JSON attachments `popup-motion-frames` (`output/playwright/fe11-reaudit/motion-evidence/`). Сэмплы подтверждают уменьшение old label и увеличение new label по мере прохождения линзы.
- Первый полный прогон до окончательного motion adapter: **491 PASS / 1 FAIL / 4 expected skips** (`output/fe11-reaudit-full.log`). Единственный FAIL — старый filter keyboard first-Tab до ожидания React trigger. Изолированно исходный тест5/5 PASS; добавлено web-first ожидание видимого trigger перед Tab, логика UI не менялась.
- Второй полный checkpoint:499 PASS /1 FAIL /4 expected skips (`output/fe11-reaudit-full-final.log`); второй старый GlassSelect theme test также отправлял первый Tab до появления React trigger. Исправлены оба web-first ожидания; оба теста затем10/10 PASS в пяти повторениях (`output/fe11-reaudit-readiness-fixed.log`). Проверки фокуса не ослаблены, UI код GlassSelect не менялся.
- **Итоговый полный прогон:500 PASS /4 expected skips /0 FAIL (6.2m)**, `output/fe11-reaudit-full-verified.log`, artifacts `output/playwright/fe11-reaudit/full-verified/`. Это результат актуального source; ранние диагностические FAIL не скрываются.
- Покадровые JSON сохранены отдельно: `motion-evidence/{chromium-fe11,firefox-fe11,webkit-fe11,touch-fe11}-frames.json` —79/142/95/78 сэмплов соответственно. Адаптер не меняет engine и не исполняет change повторно при закрытии.
- Проверены локальные ссылки отчёта/плана, `git diff --check`; новый re-audit config добавлен в существующий M7 CI job. Статус GitHub CI на отправленном head проверяется отдельно; локальный PASS не выдаётся за завершённый CI.

## Следующий gate

Показать пилот Owner на реальных Client/Manager экранах: `http://127.0.0.1:5173/?view=client-orders&popupPilot=1` и `?view=manager-orders&popupPilot=1`. Проверить Account/More, добавить заказ → позицию → Shape/Material. Для чистого эталона открыть тот же маршрут без флага.

Только после явной приёмки — миграция остальных согласованных потребителей, cleanup legacy API/CSS, Figma sync и отдельный merge gate. Новая версия не помечается APPROVED автоматически.
