import { useState } from 'react'
import { usePreviewNavigation } from '@/components/layout/usePreviewNavigation'
import { PageHeader } from '@/components/ui/page-header'
import { HeaderAction } from '@/components/ui/header-action'
import { MoreAction } from '@/components/ui/overflow-menu'
import { useLayoutDemo, type DemoLayout, type LayoutUploadValue } from '@/demo/LayoutDemoProvider'
import { LayoutRow } from './LayoutRow'
import { LayoutDetail } from './LayoutDetail'
import { LayoutUploadForm } from './LayoutUploadForm'

/** One browser composition; library/select/replace differ only by context and allowed action. */
export function LayoutBrowser({ mode = 'library', onChoose, onExit, empty = false, errorFixture = false }: {
  mode?: 'library' | 'select' | 'replace'; onChoose?: (layout: DemoLayout) => void; onExit?: () => void; empty?: boolean; errorFixture?: boolean
}) {
  const demo = useLayoutDemo()
  const nav = usePreviewNavigation('list', onExit)
  const [upload, setUpload] = useState<LayoutUploadValue>({ title: '', description: '', sourceName: '', previewName: '' })
  const layouts = empty ? [] : demo.layouts
  const layout = layouts.find(item => nav.path === 'detail/' + item.id)
  const uploading = nav.path === 'upload'
  const title = layout?.title ?? (uploading ? 'Загрузить макет' : 'Мои макеты')
  function save() {
    if (!upload.title.trim() || !upload.sourceName || errorFixture) return
    const added = demo.add(upload); setUpload({ title: '', description: '', sourceName: '', previewName: '' }); nav.replace('detail/' + added.id)
  }
  return <div className="fos-cabinet fos-layout-browser" data-testid={mode === 'library' ? 'layout-browser' : 'layout-picker'} data-mode={mode} onKeyDown={event => {
    if (event.key === 'Escape' && !event.defaultPrevented) { event.stopPropagation(); if (nav.path === 'list') nav.exit(); else nav.back() }
  }}>
    <PageHeader title={title} autoFocus={mode !== 'library' || nav.path !== 'list'} subtitle={layout && mode === 'library' ? layout.meta : !layout && !uploading && mode !== 'library' ? mode === 'select' ? 'Выберите макет для нового заказа.' : 'Выберите другой макет для заказа.' : undefined}
      breadcrumbs={nav.path === 'list' ? [{ label: 'Мои макеты' }] : [{ label: 'Мои макеты', onSelect: nav.back }, { label: title }]}
      actions={<><HeaderAction action={layout ? mode === 'library' ? 'save' : 'choose' : uploading ? 'save' : 'add'}
        accessibleName={layout ? mode === 'library' ? 'Сохранить макет' : 'Выбрать макет' : uploading ? 'Сохранить макет в демосессии' : 'Добавить макет'} data-focus-key="layout-add"
        disabled={layout ? mode === 'library' : uploading ? !upload.title.trim() || !upload.sourceName || errorFixture : false}
        onAction={layout ? () => { if (mode !== 'library') { onChoose?.(layout); nav.exit() } } : uploading ? save : () => nav.open('upload')} /><MoreAction disabled /></>} />
    {layout ? <LayoutDetail layout={layout} picker={mode !== 'library'} /> : uploading ? <LayoutUploadForm value={upload} onChange={setUpload} error={errorFixture ? 'Демо: файл не отправлен. Серверное хранилище не подключено.' : undefined} /> : <>
      <ul className="fos-cabinet__rows fos-layout-list" aria-label="Мои макеты">{layouts.map(item => <li key={item.id}><LayoutRow layout={item} onOpen={() => nav.open('detail/' + item.id)} /></li>)}</ul>
      {!layouts.length && <p className="fos-cabinet__empty" role="status" data-testid="layouts-empty">Макетов пока нет.</p>}
    </>}
    <p className="fos-cabinet__notice" data-testid="layout-preview-notice">UI preview · только демосессия. Файлы не загружены на сервер; изменения исчезнут при перезагрузке.</p>
  </div>
}
