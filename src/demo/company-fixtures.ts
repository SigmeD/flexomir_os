import { DEMO_ORDERS } from './order-fixtures'

/** Explicit synthetic relationships, not an API model or access-control implementation. */
export interface DemoCompany { id: string; name: string; legalName: string; orderIds: readonly string[] }
export const DEMO_COMPANIES: readonly DemoCompany[] = [
  { id: 'company-01', name: 'Компания 01', legalName: 'Компания 01', orderIds: ['DEMO-001', 'DEMO-003'] },
  { id: 'company-02', name: 'Компания 02 — демонстрационный полиграфический комплекс Центрального региона', legalName: 'Компания 02 — демонстрационный полиграфический комплекс Центрального региона, подразделение этикеточных материалов', orderIds: ['DEMO-002', 'DEMO-005'] },
  { id: 'company-03', name: 'Компания 03', legalName: 'Компания 03', orderIds: ['DEMO-004', 'DEMO-006'] },
]
export function companyOrders(company: DemoCompany) {
  return DEMO_ORDERS.filter(order => company.orderIds.includes(order.id))
}
