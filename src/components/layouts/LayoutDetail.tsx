import type { DemoLayout } from '@/demo/LayoutDemoProvider'
import { FOSAction, FOSTextarea } from '@/components/ui/fos-controls'
import download from '@/assets/layouts/download.svg'
import view from '@/assets/layouts/view.svg'
import './layouts.css'

export function LayoutDetail({ layout, picker = false }: { layout: DemoLayout; picker?: boolean }) {
  return <section className={'fos-layout-detail' + (picker ? ' fos-layout-detail--picker' : '')} data-testid="layout-detail" aria-label="Детали макета">
    {picker ? <><p>{layout.meta}</p><div className="fos-layout-preview">ПРЕВЬЮ МАКЕТА</div></> : <>
      <div className="fos-layout-detail__preview"><div className="fos-layout-preview">Превью макета</div></div>
      <div className="fos-layout-detail__metadata">
        <div className="fos-layout-detail__action"><span>Исходный файл{layout.sourceName && <small>{layout.sourceName} · выбран локально</small>}</span><FOSAction hierarchy="tertiary" disabled title="Серверное хранение и скачивание не подключены"><img src={download} alt="" />Скачать</FOSAction></div>
        <FOSTextarea label="Описание (необязательно)" value={layout.description} placeholder="Не добавлено" readOnly />
        <div className="fos-layout-detail__action"><span>История изменений</span><FOSAction hierarchy="tertiary" disabled title="UX PROPOSED 2101:7959 / Scope OPEN"><img src={view} alt="" />Посмотреть</FOSAction></div>
      </div>
    </>}
  </section>
}
