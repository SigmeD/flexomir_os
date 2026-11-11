# FOS02 Account hover — implementation plan

**Goal:** подключить принятый Owner Account hover на ordinary/production обеих ролей. Начальный G-01 разрешал DEV-пилот; затем Owner принял описанный сценарий. Standing поручение подключать/сливать принятые задачи действует. [Контракт и QA](FOS02_ACCOUNT_PREVIEW_2026-11-11.md).

**Architecture:** AccountMenu передаёт explicit actionPreview=account-hover-v0.3 общему FosPopup. PreviewId отделён от activatedId; action selectedId по-прежнемуnever. Одна прежняя Rows/GlassMaterial, пять frozen-файлов/CSS не меняются. Другиеpopup остаются без actionPreview и сохраняют прежнюю семантику.

**Stack/workspace:** React19/TypeScript/Vite, установленный Radix DropdownMenu, Playwright; обычная feat/fos02-account-hover-pilot от mainbc880b1, без нового worktree. Выполнение inline и независимый review.

## 1. Source/решение/RED

- [x] Figma3042:2806, Current Drive, исходное FOS02, frozenmanifest и consumers проверены;14baselineflows/20PNG сохранены.
- [x] docs/DECISIONS.md: G-01 DEV-пилот разрешён ответом «давай попробуем».
- [x] tests/fos02-account-preview.spec.ts + playwright.fos02.config.ts: RED before code3missing-lensfailures.
- [x] После «Принято» обновлено ожидание ordinary: RED1missing-lens failure до подключения.

## 2. Общий adapter / подключение

- [x] src/components/ui/fos-popup.tsx: action-only opt-in, separate previewId/activatedId, pointer eligibility, disable/leave/key/close cleanup и optical variable reset; один existinglens, immediate activation.
- [x] В принятом Account отменён только Radix default pointer focus; keyboard roving/outline/activation сохраняются.
- [x] src/components/layout/AccountMenu.tsx: обычный explicit actionPreview без DEV/query gate, Client/Manager shared AppShell.
- [x] Frozen5 исходников/manifest/frozenCSS не менялись; source3files, общий FosPopup.css содержит разрешённый240ms presence.

## 3. QA и независимая проверка

- [x] `npx playwright test --config=playwright.fos02.config.ts --workers=2` —29PASS/11conditionalSKIP/0fail/0flaky,4проекта.
- [x] `npx playwright test --config=playwright.fos02-regression.config.ts --workers=2` —61PASS/3conditionalSKIP/0fail/0flaky.
- [x] `npm run build` PASS238modules; `FOS02_PRODUCTION=1 npx playwright test --config=playwright.fos02.config.ts --grep 'accepted Account|presence eases'` —7PASS/1SKIP,8cases,16role/query combinations и native smoothing.
- [x] Acceptedpilot и новые ordinary captures раздельно:60rawPNG/30states каждого; geometry baseline/hover/keyboard сверена; автор просмотрел1440/320. СтарыеDEVproduction результаты не считаются rolloutproof.
- [x] Независимый source/evidence review PASSWITHRISKS, frozen5/5; по independently authoredscript16assertions исполненыrootиз-заchildCLIlimit, reviewerпроверилJSON/8PNG. Executor указан честно.

- [x] Owner попросил более плавный hover: coupled240ms presence, stale cleanup guard, native midpoint/reentry/reduced tests; independent authored12checksPASS(root executor), glassblur audit без materialchange.

## 4. Поставка

- [x] LIVE docs обновлены для принятого ordinary/production scope; один будущий PR на весь инкремент.
- [ ] Commit/push, один PR и CI фактическогоhead; source во время стабильного QA не менять.
- [ ] После успешногоCI выполнить уже разрешённый merge/main sync, подтвердитьSHA/tree/remoteheadcleanup и обновитьDriveCURRENT.
- [ ] Следующая задача отдельной веткой от свежегоorigin/main. Полная M8visualacceptance, DatePicker07 и API/ACL/1С не закрываются Account-поставкой.
