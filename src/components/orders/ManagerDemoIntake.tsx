import { useId } from 'react'
import { FOSAction } from '@/components/ui/fos-controls'

/** Manager command remains unavailable until Alexey's agreed API/ACL/1C contract. */
export function ManagerDemoIntake() {
  const explanationId = useId()
  return <section className="fos-manager-intake" aria-label="Демонстрационный приём заказа">
    <p id={explanationId} className="fos-sr-only">Создание заказа недоступно в демонстрации. Документ 1С не создаётся.</p>
    <FOSAction hierarchy="primary" disabled title="Недоступно в демонстрации" aria-describedby={explanationId}>Создать заказ</FOSAction>
  </section>
}
