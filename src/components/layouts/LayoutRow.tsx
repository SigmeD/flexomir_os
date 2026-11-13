import { FosSummaryRow, FosSummaryRowCopy } from '@/components/ui/fos-summary-row'
import type { DemoLayout } from '@/demo/LayoutDemoProvider'
import { ArtworkThumbnail } from '@/components/ui/artwork-thumbnail'
import './layouts.css'

/** Layout Row 1313:2182. Domain stays separate from Orders despite shared visual rhythm. */
export function LayoutRow({ layout, onOpen }: { layout: DemoLayout; onOpen: () => void }) {
  return <FosSummaryRow type="button" className="fos-layout-row" data-testid={'layout-row-' + layout.id} data-focus-key={'layout-' + layout.id} onClick={onOpen}
    leading={<ArtworkThumbnail label={layout.sourceName ? 'МАКЕТ' : 'PNG'} />}>
    <FosSummaryRowCopy className="fos-cabinet__row-copy" title={layout.title} metadata={layout.meta} />
  </FosSummaryRow>
}
