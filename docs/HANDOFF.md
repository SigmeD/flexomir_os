# Flexomir OS — передача работы

Текущий follow-up08/09: [план](FOS08_09_NEUTRAL_ACTION_PILOT_2026-11-10.md), [отчёт](FOS08_09_REPORT_2026-11-10.md), DEV ?view=neutral-actions; Client Plus opt-in actionPalette=neutral-pilot. Три existing components, один palette token source, shared material/helper. Reference/default и production не мигрируют. Новый локальный QA:36/36,full566 +4skip,build/prod PASS,source14/frozen5,8 snapshots; independent READY. Safari helper onBlur исправлен, формулы/FE11 неизменны. Owner palette gate OPEN, actual-head CI — в PR34;97de0bd CI2/2 SUCCESS. Не менять tracked files во время browser QA.

Последний follow-up Owner: «принимай общим компонентом» относится к размеру статуса14/12. Реализованы PageHeader.subtitleRole=status и --fos-type-order-status-size; OrderComposer/OrderDetail Client+Manager используют роль во всех режимах. Secondary/context и menu14/18/500 не меняются. Placement остаётся DEV pilot. Проверено отдельно: typography32/32, focused48/48, shared86/86, build/production PASS,30 captures, source7/7, frozen5/5. Первые параллельные прогоны имели test selector error и browser crashes; selector исправлен, итоговые последовательные suites PASS, продуктовый source не менялся. Доказательства/ограничения — в аудите. Новый CI сверять в PR #34; старый QA его не подменяет.

Уточнение после просмотра: Owner поручил подпись «Черновик»; изменён только текст, существующий Manager test обновлён, 2/2 и build PASS. Полные тесты исходного пилота относятся к 2d8a45b; новый head CI сверять в PR #34. После второго просмотра Owner поручил поднять подпись: подготовлен PageHeader below-title только в DEV pilot, desktop Y128→108, Company151; новые QA48/48 и82/82, build/production PASS, 30 PNG, review READY. Подробности и оставшиеся gates — в [аудите](FOS03_HEADER_AUDIT_2026-11-10.md). Actual-head CI сверять в PR #34, Owner visual acceptance OPEN.

FOS03, 10.11: `feat/fos03-manager-spacing-pilot`, база 7b17db6; [план](FOS03_MANAGER_SPACING_PILOT_2026-11-10.md), [отчёт](FOS03_REPORT_2026-11-10.md). Изменены OrderComposer/order-compose.css: DEV + Manager opt-in. Итог: focused 48/48, full 544 PASS + 4 skip, build PASS, 30 PNG и production probe PASS, frozen 5/5. Во время browser QA не менять tracked files: WS trace подтвердил Vite full-reload от review script. Сравнение `/output/playwright/fos03/index.html`, пилот `/?view=manager-orders&composeSpacing=pilot` → «Добавить заказ». Следующее действие — проверить actual-head CI в Draft PR и получить Owner visual acceptance до rollout. PR #33 остаётся отдельным Draft, четыре CI успешны; ветка и четыре stash сохранены. При разрешённой интеграции объединить LIVE docs без потери A.

Обновлено 10.11.2026 после merge [PR #31](https://github.com/SigmeD/flexomir_os/pull/31).

## База для следующей задачи

- Рабочая папка: D:\Projects\flexomir_os. Продуктовый main/origin/main: a400b9dc73ad77b01b37932fa4c5abbd57d134e0.
- Проверенный PR head: f991bd77d16f0552f10e1cb8e0014d7d95a84850. После squash дерево файлов совпало с main, сборка на main прошла.
- Remote feat/m8-final-screen-qa удалена автоматически. Local feature branch и четыре старых stash сохранены; не удалять их без отдельного поручения.
- Документальные исправления после merge готовятся отдельно в docs/post-merge-current-2026-11-10. Фактические branch/status/PR перед продолжением сверять в Git и GitHub.

## Что уже сделано

В main находятся общие popup/select из PR #30 и техническая проверка экранов из PR #31. Поля дат создания/просмотра используют OrderDateFields/FOSDateField. Клиент видит «Согласованный срок» в новом заказе пустым и в просмотре — из данных заказа, всегда только для чтения.

Для проверки клиентского просмотра можно открыть DEMO-003: желаемый срок 16.11.2026, согласованный 20.11.2026. Это fixtures, а не результат работающего согласования или обмена с 1С.

Исправлены browser title, Client Support breadcrumb и тестовые ожидание демопанели/outside-click. При закрытии меню сохранены строгие проверки inert, pointer-events и фокуса.

## Доказательства

Обе CI-проверки PR head f991bd77 успешны: Orders Core UI QA run42824002319 и FE-S03 M7 UI QA run42824002316. Локальные проверки даты — 40 Chromium + 8 Firefox/WebKit; outside-click — 12 повторов и полный popup-набор 35/35. Полный результат 520/4 относится к раннему head 51d93be и не является новым полным прогоном.

- [Итоговый аудит M8](M8_FINAL_AUDIT_2026-11-10.md) — проверки, исходные ошибки и ограничения review.
- output/m8-final — 69 исходных Figma↔React сравнений; manifest в scripts/m8-screen-manifest.json.
- output/m8-client-agreed-date — последние 18 снимков и 30 измерений полей.
- output/m8-merge — trace и результаты исправленного popup-теста.

Артефакты локальные и исключены из Git. Не выдавать их за доступные на любом checkout и не подменять новые проверки старыми.

## Следующая работа и открытые вопросы

Сначала сверить [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit) и [локальный план](DELIVERY_PLAN.md). Ближайшее решение — действие менеджера для фиксации срока и точный переход в «В работе». Клиентское отображение уже реализовано; новый статус при сохранении даты не добавлять.

CURRENT E2E различает сохранение договорённостей и «Создать заказ» для передачи в 1С. Production-команда пока отключена. Фиксация менеджером, публикация черновика, event→status, Auth и реальные API/ACL/storage остаются открытыми. После необходимых M8-гейтов — M9 по готовым API Алексея.

Не повторять merge PR #29–31 и не переиспользовать их старые ветки. Новая реализация начинается от свежего origin/main. Frozen FE11 reference f527bcb, manifest и роль меню 14/18/500 сохраняются. Требования, Figma masters и серверные контракты не менять при уборке документов.

Ревизия: 10.11.2026. Следующая: 24.11.2026.
