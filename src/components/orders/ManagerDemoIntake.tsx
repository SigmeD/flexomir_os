import { useId } from 'react'
import { FOSAction } from '@/components/ui/fos-controls'

/** Manager command remains unavailable until Alexey's agreed API/ACL/1C contract. */
export function ManagerDemoIntake({ state = 'pending', onStateChange, demoEnabled = false }: {
  state?: 'pending' | 'success' | 'error'
  onStateChange?: (state: 'pending' | 'success' | 'error') => void
  demoEnabled?: boolean
}) {
  const explanationId = useId()
  const labels = { pending: 'Ожидаем ответ в демонстрации', success: 'Демо-обработка завершена', error: 'Ошибка демо-обработки' }
  return <section className="fos-manager-intake" aria-label="Демонстрационный приём заказа">
    <p role="status" aria-live="polite">{labels[state]}. Локальная демонстрация; запрос в 1С не выполняется.</p>
    <FOSAction hierarchy="primary" disabled title="Команда 1С не подключена" aria-describedby={explanationId}>Создать заказ</FOSAction>
    {demoEnabled && <div className="fos-manager-intake__demo-controls" aria-label="Состояние демонстрации">
      {(['pending', 'success', 'error'] as const).map(next => <FOSAction key={next} aria-pressed={state === next} onClick={() => onStateChange?.(next)}>{labels[next]}</FOSAction>)}
    </div>}
    <span id={explanationId} className="fos-sr-only">Создание производственного документа не выполняется.</span>
  </section>
}
