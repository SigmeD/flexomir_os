# Flexomir OS — handoff между сессиями Codex

> Заполнено 04.11.2026, Codex. Проверять текущий Git перед доверием этому снимку.

## Контекст

- Задача: изучить и подключить правила владельца к существующему проекту; поток — настройка процесса, без продуктовых изменений.
- Прочитаны все 11 файлов архива `D:/downloads/Flexomir_OS_Codex_Agent_Rules_2026-11-04.zip` и три самостоятельных файла. AGENTS/README/CODEX_SETUP совпадают с архивом по тексту; дубли в репозиторий не добавлялись.
- Официальные инструкции [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [config](https://learn.chatgpt.com/docs/config-file/config-reference) и [приоритет конфигурации](https://learn.chatgpt.com/docs/config-file/config-basic) прочитаны, Context7 `/openai/codex` использован. Drive/Figma не перечитывались: [SOURCES](SOURCES.md) хранит ссылки с этой оговоркой.

## Проверенное состояние

- `D:/Projects/flexomir_os`, `main`, одна рабочая папка, исходный HEAD `cd0656a`; начало задачи с чистым деревом. GitHub PUBLIC, remote согласован ранее. Worktree не создавался.
- Подключены `AGENTS.md`, `.codex/config.toml`, `docs/CODEX_SETUP.md`, `SOURCES`, `PROJECT_STATE`, `DELIVERY_PLAN`, `DECISIONS`, `QA_CHECKLIST`, этот HANDOFF. README объединяет общую точку входа и прежние инструкции Glass-полигона; код, тесты, зависимости и контрольные суммы не менялись.
- В правила сохранены Context7, согласие на worktree, ревизия документов каждые 14 дней и исключение тяжёлых тестовых артефактов. Следующая ревизия 18.11.2026.
- `npm run build` PASS (tsc + Vite, 41 module); Git/версии/наличие навыков/trusted проверены. Node `v24.11.1`, npm `11.6.2`, Git `2.56.0.windows.4`, Codex `0.166.0`.
- Проверки подключения: локальные ссылки Markdown и пути в инструкциях, diff без ошибок, исходники/тесты/lockfile без изменений, размер AGENTS в пределах стандартного лимита 32 KiB, тестовые артефакты не включены в Git. Итоговые команды и commit — в Git и ответе этой сессии.
- NOT RUN: браузерный/оптический QA, сравнение с Figma, продуктовые гейты, автоматическая загрузка файлов новой сессией. Это задача подключения документации; прежние тестовые результаты не объявлены свежими.
- Старый автономный HTML Manager Orders НЕ ПРИНЯТ по пакету; не переносить как baseline. Glass/Select Owner gate OPEN.

## Решения и риски

- Новых продуктовых APPROVED решений нет. API/1С/status mapping, Manager «Новые», ACL и маршруты требуют согласования с Алексеем и Owner/PO.
- OPEN: текущий PUBLIC репозиторий против требования пакета о приватности; Current источники пока не перепроверены; Tabs Desktop / Select mobile против unified dropdown; причины непринятия HTML; лицензия и свежий browser QA Glass.
- Модель, global config, auth, sandbox, plugins и видимость GitHub не менялись. Две проектные настройки reasoning записаны; применять их к уже активному запросу не заявлялось.

## Следующий шаг для нового Codex

- Открыть новую сессию в этом проекте, сверить реально загруженные инструкции/настройки; затем `git status`, remote, branch, package scripts.
- При следующей согласованной продуктовой задаче прочитать CURRENT index и релевантные Drive/Figma источники до изменения Screens/Glass.
- Не повторять Git init, scaffold или установку Superpowers: приложение и навыки уже есть. Приватность решает владелец; worktree — только с его согласием.
- План: [DELIVERY_PLAN](DELIVERY_PLAN.md); открытые вопросы: [DECISIONS](DECISIONS.md); приёмка: [QA_CHECKLIST](QA_CHECKLIST.md).
