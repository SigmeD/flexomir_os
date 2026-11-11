import { FosButtonRoot } from '@/components/ui/fos-button-root'
import type { DemoLayout } from '@/demo/LayoutDemoProvider'
import { ArtworkThumbnail } from '@/components/ui/artwork-thumbnail'
import chevron from '@/assets/orders/chevron.svg'
import './layouts.css'

/** Layout Row 1313:2182. Domain stays separate from Orders despite shared visual rhythm. */
export function LayoutRow({ layout, onOpen }: { layout: DemoLayout; onOpen: () => void }) {
  return <FosButtonRoot family="row" type="button" className="fos-cabinet__row fos-layout-row" data-testid={'layout-row-' + layout.id} data-focus-key={'layout-' + layout.id} onClick={onOpen}>
    <ArtworkThumbnail label={layout.sourceName ? 'МАКЕТ' : 'PNG'} />
    <span className="fos-cabinet__row-copy"><strong>{layout.title}</strong><small>{layout.meta}</small></span><img className="fos-cabinet__chevron" src={chevron} alt="" />
  </FosButtonRoot>
}
