# Flexomir OS — передача работы

## Продолжать с принятого FOS02 /11.11

Ветка feat/fos02-account-hover-pilot от main/originbc880b1; PR35MERGED. Owner разрешил DEV-пилот, затем после объяснения сценария/hover подтвердил «Принято». По standing поручению подключать/сливать принятое Account actionPreview=account-hover-v0.3 включён на ordinary/production обеих ролей; без query gate. Другие popup прежние; frozen5/5 неизменны; Account presence240ms в общем FosPopup.css. [Контракт/QA](FOS02_ACCOUNT_PREVIEW_2026-11-11.md): targeted29/11skip, regression61/3skip, production7PASS/1SKIP, buildPASS, independently authored16checks выполненыroot и reviewPASSWITHRISKS. Следующее: один PR/CI фактическогоhead, разрешённый merge/main sync/remote cleanup/Drive. Сохранять Screenshot_1.png untracked и4stash. СтарыеDEVproduction7PASS/1SKIP не заменяют новыйproduction rollout.

## Продолжать с принятого rollout /11.11

Ветка feat/fos12-artwork-source-pilot, PR #35 расширен по замечанию Owner. FOS12 принят наf509eba; Owner явно разрешил подключение FOS03/FOS12 и merge после QA. Код уже обычный: status gap8 у Composer/Detail обеих ролей, Manager32/24, ArtworkSource states в Client/Manager/production. Spacing60/Artwork52/build/production4 и независимый runtime19 PASS; полная700/финальный CI — в новом PR head. [Отчёт](ACCEPTED_UI_ROLLOUT_2026-11-11.md).

После успешных проверок выполнить разрешённый merge, main/origin sync, remote cleanup и новую обычную ветку от свежего origin/main. Screenshot_1.png — пользовательский untracked, не менять/не коммитить; локальные ветки/stash сохранить. Ниже — предшествующие ограничения пилота, заменённые новым решением Owner.

## Продолжать здесь — FOS12 /11.11

Активная ветка `feat/fos12-artwork-source-pilot`, база main398a93b, PR33/34 MERGED. Пилот12 — общий ArtworkSource, только Client DEV artworkStates=pilot. [Отчёт](FOS12_REPORT_2026-11-11.md), [контракт](FOS12_ARTWORK_STATES_PILOT_2026-11-11.md), [галерея](http://127.0.0.1:5173/output/playwright/fos12/review/index.html).

44 целевых+8 fixture,104 регрессионных, build, production2/2 PASS. Independent14 runtime checks/frozen5/5 PASS WITH RISKS. FUNCTIONAL/TECHNICAL local PASS, VISUAL Owner OPEN. Следующее — Draft PR/CI и Owner reference; rollout/merge не разрешены автоматически. Hidden native input в HELP disabled, checkbox не размонтируется и сохраняет focus. Storage/API/model не добавлены. Другие пункты03/02/05/07 и06/10/11/13 остаются отдельными.

Ниже — основания предыдущей поставки; её ветку не переиспользовать.

11.11.2026 Owner поручил «Сливай pr». PR #33 MERGED, main `b2b858f93e68c0543babe6564adb5224820cad91`; head `25eb159`, CI4/4. Удалённая ветка PR #33 удалена GitHub автоматически; локальные ветки и четыре stash сохранены.

Поставка PR #34 включает main после PR #33. Семь конфликтов workflow/LIVE docs разрешены с сохранением обеих поставок; общие исходники объединены автоматически. В workflow сохранены проверки Wave A, кнопок и FOS03. [Wave A](NEXT_SCOPE_A_REPORT_2026-11-10.md), [кнопки](FOS08_09_REPORT_2026-11-10.md).

Причина чувствительности быстрого клика: 180 мс wall-time envelope и ограничение шага frozen spring до32мс при редких кадрах. Исходное падение и диагностика сохранены в `output/pr-merge`. Амплитуда проверяется управляемыми кадрами без ослабления порогов; production-код анимации не менялся. Сборка PASS, motion54 PASS/2 штатных SKIP, frozen5/5; независимое ревью разрешения конфликтов и теста PASS WITH RISKS. Финальные QA/CI head и merge SHA — в [PR #34](https://github.com/SigmeD/flexomir_os/pull/34), post-merge статус — в [Drive CURRENT](https://docs.google.com/document/d/1fzILzuOPgP6PEn1K5RaR9-XTw6RW6gJYELJp02Bt9BE/edit). Owner разрешил объединение после успешных проверок.

Рабочая папка — D:/Projects/flexomir_os, ветка `feat/fos03-manager-spacing-pilot`. FOS03 принят только в DEV-пилоте `composeSpacing=pilot`, версия интерфейса `6007e60`; обычные маршруты не переключать автоматически.

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
