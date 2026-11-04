# Flexomir OS — подготовка Codex на Windows

**Локальная папка:** `D:\Projects\flexomir_os`. Пакет сам ничего не устанавливал. Ниже он адаптирован к проверенному состоянию на **04.11.2026**; существующие Git, React и Superpowers сохраняются.

## Проверено в этой установке

- Git `2.56.0.windows.4`, Node `v24.11.1`, npm `11.6.2`, Codex CLI `0.166.0`.
- `origin`: `https://github.com/SigmeD/flexomir_os.git`, ветка `main`, исходный коммит `cd0656a` опубликован. Репозиторий PUBLIC; вопрос приватности открыт, настройка доступа не изменялась.
- React/TypeScript/Vite приложение уже существует; `npm run build` PASS. Зависимости повторно не устанавливались, второй scaffold не создавался.
- Навыки `using-superpowers`, `brainstorming`, `writing-plans`, `using-git-worktrees`, `verification-before-completion` есть в `C:/Users/Max/.codex/skills/superpowers/<имя>/SKILL.md` и доступны в каталоге навыков текущей сессии. Marketplace-установка этим не подтверждается и не требовалась.
- Пользовательский `C:/Users/Max/.codex/config.toml` уже содержит `model_reasoning_effort = "high"`, модель `gpt-6.1-sol` и доверие для `d:/projects/flexomir_os`. Глобальный конфиг не изменялся. Это сведения о файле, не доказательство фактических настроек активного запроса.
- Проектный `.codex/config.toml` добавлен с двумя параметрами из пакета. Их поддержку проверили по [официальному справочнику](https://learn.chatgpt.com/docs/config-file/config-reference); слой проекта применяется для доверенного проекта по [порядку конфигурации](https://learn.chatgpt.com/docs/config-file/config-basic). Загрузка нового слоя новой сессией ещё не проверена.
- Корневой `AGENTS.md` установлен и прочитан в текущей сессии. Автоматическое обнаружение в следующей сессии проверять по [инструкции OpenAI](https://learn.chatgpt.com/docs/agent-configuration/agents-md).
- Глобальный и проектный `AGENTS.md` вместе с разделителем занимают 32 243 байта при стандартном лимите 32 KiB. Повторы QA сокращены, полный checklist сохранён отдельно. При расширении инструкций проверять общий размер, чтобы конец файла не отсекался.

## 1. Прежде всего проверка окружения

Открой PowerShell и последовательно выполни **read-only** команды:

```powershell
Set-Location 'D:\Projects\flexomir_os'
Get-ChildItem -Force | Select-Object Name, Mode, Length
Get-Command git, node, npm, codex -ErrorAction SilentlyContinue | Select-Object Name, Source
if (Test-Path .git) {
  git status --short --branch
  git remote -v
  git branch --show-current
  git worktree list
  git log -5 --oneline
}
if (Test-Path package.json) { Get-Content package.json }
```

**Не выполнять автоматически:** удаление файлов, `git init` поверх неизвестного каталога, `git add -A`, force-push/reset, создание второго приложения, замену README/AGENTS без сравнения. Для рабочего репозитория начни с `git status`. GitHub и remote уже выбраны владельцем; менять платформу или видимость только по его решению. `.gitignore` исключает secrets/.env, node_modules и результаты тестовых прогонов. По умолчанию работать в основной папке; worktree — только после объяснения пользы, пути, ветки и согласия владельца.

## 2. Установка Superpowers, только если навыки отсутствуют

В текущем окружении навыки уже доступны — повторная установка не нужна. Инструкция ниже оставлена для нового рабочего места.

**Предпочтительно — официальный marketplace:**

- **Codex App:** Plugins в боковой панели → `Superpowers` (раздел Coding) → `+` и шаги установки.
- **Codex CLI:** в интерактивной сессии введи `/plugins`, найди `superpowers`, выбери `Install Plugin`.
- Перезапусти сессию Codex и попроси: «Проверь, видны ли навыки using-superpowers, brainstorming, writing-plans, using-git-worktrees, verification-before-completion; перечисли реальные источники skills». Установку нельзя считать завершённой только от упоминания в `AGENTS.md`.

Официальный источник: https://github.com/obra/superpowers (внутри есть Codex App/CLI инструкции). Для альтернативной ручной установки следуй **текущей** инструкции автора; не копируй устаревшие команды установки из случайных блогов. Superpowers лучше устанавливать **один раз в профиле пользователя** Codex, а не класть его исходники в репозиторий Flexomir. Не соединять чужие плагины и рабочие репозитории.

## 3. Режим рассуждения

В комплекте `.codex/config.toml`:

```toml
model_reasoning_effort = "high"
model_reasoning_summary = "concise"
```

В зависимости от Codex и модели уровни могут различаться. Убедись, что проект отмечен доверенным и проектный конфиг реально загружен; если у тебя уже есть настройки — перенеси две строки аккуратно, не перезаписывая остальные. Не устанавливай `model`, auth/provider или sandbox вручную из этого шаблона. Для простых команд high не требует длинных объяснений; для спорных архитектурных решений агент обязан представить **сжатое обоснование вариантов и рисков**, а не поток скрытых внутренних мыслей.

Официальный справочник: https://learn.chatgpt.com/docs/config-file/config-reference .

## 4. Проверка AGENTS.md

Codex читает `AGENTS.md` на старте проекта/сессии. Открой **именно** `D:\Projects\flexomir_os` в Codex, перезапусти сессию и спроси:

> «Прочитай проектные AGENTS.md и README.md. Не меняй файлы. Назови реальные пути инструкций, CURRENT источники Drive/Figma, два параллельных потока, FE-00, все блокеры, статус старого HTML. Проверь наличие Superpowers и фактическую модель/уровень reasoning. Составь безопасный read-only план инвентаризации Git/React».

Сверь ответы со статусом в `docs/PROJECT_STATE.md`. Не запускай установку зависимостей или scaffold до сверки существующего кода.

## 5. После Git bootstrap (только по согласованию)

- Один репозиторий Flexomir OS, не два независимых frontend приложения.
- `feature/frontend-screens` и `feature/glass-components` — возможные обычные ветки. Отдельные `git worktree` только при необходимости и явном согласии владельца; нельзя редактировать один каталог двум агентам одновременно.
- Сохранить существующие React/TypeScript/Vite и `package-lock.json`; пересмотр сборщика не входит в подключение правил. Для нового рабочего места сначала клонировать этот репозиторий.
- Использовать фактические scripts из `package.json`: `dev`, `build`, `preview`, `test:e2e`, `test:a11y`, `test:visual`, `test:material`, `verify:material-optics`. Не обещать отсутствующие отдельные `lint`/`typecheck`.
- Передать Алексею принятый пилот с PR, типами, data adapter, статусами контрактов и QA.

## 6. Установка прошла успешно, когда

- [ ] Codex открывает именно нужный каталог и правильно перечисляет AGENTS+README и источники.
- [ ] Показывает доступные Superpowers навыки (или честно говорит, что plugin пока не установлен).
- [ ] Указывает действующую конфигурацию reasoning без выдумывания.
- [x] Реальный Git/status/remote проверен; чужие файлы сохранены.
- [x] Использован существующий React baseline, сборка проверена; второй scaffold не создавался.
