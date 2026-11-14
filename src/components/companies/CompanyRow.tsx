import { FosSummaryRow, FosSummaryRowCopy } from '@/components/ui/fos-summary-row'
import type { DemoCompany } from '@/demo/company-fixtures'
import './companies.css'

/** Client Row 1189:984 / Default 634:316, entire row opens linked orders. */
export function CompanyRow({ company, onOpen }: { company: DemoCompany; onOpen: () => void }) {
  return <FosSummaryRow density="compact" type="button" className="fos-company-row" data-testid={'company-row-' + company.id}
    data-focus-key={company.id} onClick={onOpen}>
    <FosSummaryRowCopy className="fos-cabinet__row-copy" titleAs="span" title={company.name} metadata="Карточка клиента · заказы" classes={{ title:'fos-cabinet__row-title' }} />
  </FosSummaryRow>
}
