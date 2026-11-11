import { FosButtonRoot } from '@/components/ui/fos-button-root'
import type { DemoCompany } from '@/demo/company-fixtures'
import chevron from '@/assets/orders/chevron.svg'
import './companies.css'

/** Client Row 1189:984 / Default 634:316, entire row opens linked orders. */
export function CompanyRow({ company, onOpen }: { company: DemoCompany; onOpen: () => void }) {
  return <FosButtonRoot family="row" type="button" className="fos-cabinet__row fos-company-row" data-testid={'company-row-' + company.id}
    data-focus-key={company.id} onClick={onOpen}>
    <span className="fos-cabinet__row-copy"><span>{company.name}</span><small>Карточка клиента · заказы</small></span>
    <img className="fos-cabinet__chevron" src={chevron} alt="" />
  </FosButtonRoot>
}
