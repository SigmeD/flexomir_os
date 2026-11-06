import { useState } from 'react'
import { CabinetPage, type CabinetSection } from '@/components/layout/CabinetPage'
import { usePreviewNavigation } from '@/components/layout/usePreviewNavigation'
import { PageHeader } from '@/components/ui/page-header'
import { HeaderAction } from '@/components/ui/header-action'
import { MoreAction } from '@/components/ui/overflow-menu'
import { FOSInput } from '@/components/ui/fos-controls'
import { CompanyRow } from '@/components/companies/CompanyRow'
import { CompanyOrders, type CompanyFilters } from '@/components/companies/CompanyOrders'
import { OrderDetail } from '@/components/orders/OrderDetail'
import { DEMO_COMPANIES, companyOrders } from '@/demo/company-fixtures'

export function ManagerCompaniesScreen({ empty = false, onNavigate }: { empty?: boolean; onNavigate?: (section: CabinetSection) => void }) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, CompanyFilters>>({})
  const nav = usePreviewNavigation()
  const [, companyId, orderId] = nav.path.split('/')
  const companies = empty ? [] : DEMO_COMPANIES
  const company = companies.find(item => item.id === companyId)
  const order = company && companyOrders(company).find(item => item.id === orderId)
  return <CabinetPage role="manager" section="clients" onNavigate={onNavigate}>
    {company && order?.detail ? <OrderDetail role="manager" order={order} detail={order.detail} onBack={nav.back} /> : <>
      <PageHeader title={company ? 'Заказы клиента' : 'Клиенты'} autoFocus={Boolean(company)} breadcrumbs={company ? [{ label: 'Клиенты', onSelect: nav.back }, { label: 'Заказы клиента' }] : [{ label: 'Клиенты' }]}
        actions={<><HeaderAction action="add" accessibleName={company ? 'Добавить заказ компании' : 'Добавить компанию'} disabled /><MoreAction disabled /></>} />
      {company ? <CompanyOrders company={company} filters={filters[company.id] ?? { search: '', status: '' }} onFilters={value => setFilters(current => ({ ...current, [company.id]: value }))} onOpen={id => nav.open('company/' + company.id + '/' + id)} /> : <>
        <FOSInput wrapperClassName="fos-companies__search" label="Поиск компании" placeholder="Название компании" value={search} onChange={event => setSearch(event.target.value)} />
        <ul className="fos-cabinet__rows" aria-label="Компании">{companies.filter(item => item.name.toLowerCase().includes(search.trim().toLowerCase())).map(item => <li key={item.id}><CompanyRow company={item} onOpen={() => nav.open('company/' + item.id)} /></li>)}</ul>
        {!companies.some(item => item.name.toLowerCase().includes(search.trim().toLowerCase())) && <p className="fos-cabinet__empty" role="status" data-testid="companies-empty">Компаний не найдено.</p>}
        <p className="fos-sr-only">Синтетические компании и заказы. Добавление компании не входит в MVP. Данные не получены из 1С.</p>
      </>}
    </>}
  </CabinetPage>
}
