import { createRoot } from 'react-dom/client'
import { OrderCard } from '../../src/components/orders/OrderCard'
import '../../src/styles.css'
import '../../src/components/orders/orders-page.css'
import '../../src/components/ui/fos-controls.css'

createRoot(document.getElementById('root')!).render(<div className="fos-orders-page">
  <OrderCard number="STATIC" title="Исторический заказ" company="Компания" statusLabel="Завершён" />
</div>)
