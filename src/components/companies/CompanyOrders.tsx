import { FOSInput, FOSSelect, FOSTextarea } from '@/components/ui/fos-controls'
import { OrdersList } from '@/components/orders/OrdersList'
import { companyOrders, type DemoCompany } from '@/demo/company-fixtures'

/** Figma company summary and linked orders are one composition, not separate screens. */
export interface CompanyFilters { search: string; status: string }
export function CompanyOrders({ company, onOpen, filters, onFilters }: { company: DemoCompany; onOpen: (id: string) => void; filters: CompanyFilters; onFilters: (filters: CompanyFilters) => void }) {
  const { search, status } = filters
  const orders = companyOrders(company)
  const visible = orders.filter(order => order.id.toLowerCase().includes(search.trim().toLowerCase()) && (!status || order.statusLabel === status))
  return <div className="fos-company-orders">
    {company.legalName.length > 70 ? <FOSTextarea label="Компания" value={company.legalName} readOnly /> : <FOSInput label="Компания" value={company.legalName} readOnly />}
    <div className="fos-company-orders__filters">
      <FOSInput label="Поиск заказа" placeholder="Номер заказа" value={search} onChange={event => onFilters({ ...filters, search: event.target.value })} />
      <FOSSelect label="Статус" emptyIsPlaceholder={false} value={status} onChange={event => onFilters({ ...filters, status: event.target.value })}><option value="">Все статусы</option>{[...new Set(orders.map(order => order.statusLabel))].map(label => <option key={label}>{label}</option>)}</FOSSelect>
      <FOSSelect label="Сортировка" emptyIsPlaceholder={false} value="" disabled title="Порядок задаётся демонстрационными данными"><option value="">Сначала новые</option></FOSSelect>
    </div>
    <OrdersList orders={visible} total={orders.length} idPrefix="company" onOpen={onOpen} />
  </div>
}
