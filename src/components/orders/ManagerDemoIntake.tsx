import { useId } from 'react'

/** FOS Manager detail 2500:9701; no local substitute for agreed ACL/1C commands. */
export function ManagerDemoIntake() {
  const explanationId = useId()
  return <section className="fos-order-composer__section" aria-label="Демонстрационный приём заказа">
    <h2>Приём заказа · демо</h2>
    <label className="fos-order-field fos-order-composer__date">Согласованный срок (менеджер)<input type="date" disabled aria-describedby={explanationId} /></label>
    <p id={explanationId} className="fos-order-editor__hint">Редактирование срока и права действий ожидают согласованного API-контракта. Интеграция с 1С не подключена; документ не создаётся.</p>
    <button className="fos-order-action" type="button" disabled aria-describedby={explanationId}>Создать заказ</button>
  </section>
}
