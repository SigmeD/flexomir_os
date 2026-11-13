import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FosMaterialSurface } from '@/components/ui/fos-material-surface'
import { FOSAction } from '@/components/ui/fos-controls'
import closeIcon from '@/assets/messaging/close.svg'
import downloadIcon from '@/assets/layouts/download.svg'
import { Trash2 } from 'lucide-react'
import './documents.css'

const PdfPages = lazy(() => import('./PdfPages'))
export function DocumentPreviewDialog({ file, canDownload, onClose, onDelete }: { file: File; canDownload: boolean; onClose: () => void; onDelete?: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null), id = useId()
  const [url, setUrl] = useState(''), [count, setCount] = useState(0)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null, root = dialog.current
    const oldOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    root?.showModal()
    const next = URL.createObjectURL(file); setUrl(next)
    return () => { URL.revokeObjectURL(next); root?.close(); document.documentElement.style.overflow = oldOverflow; previous?.focus({ preventScroll: true }) }
  }, [file])
  return createPortal(<dialog ref={dialog} className="fos-document-dialog" aria-labelledby={id} onCancel={event => { event.preventDefault(); event.stopPropagation(); onClose() }}>
    <FosMaterialSurface variant="document-preview" className="fos-document-shell" contentClassName="fos-document-content">
      <header><div><h2 id={id} tabIndex={0} title={file.name}>{file.name}</h2><p>Подписной бланк · выбран локально</p></div><FOSAction hierarchy="tertiary" shape="icon" className="fos-document-close" aria-label="Закрыть" onClick={onClose}><img src={closeIcon} alt="" /></FOSAction></header>
      <div className="fos-document-viewport" tabIndex={0} role="region" aria-label="Страницы документа">
        {file.type === 'application/pdf' || /\.pdf$/i.test(file.name) ? <Suspense fallback={<p role="status">Открываем PDF…</p>}><PdfPages file={file} onCount={setCount} /></Suspense>
          : <p>Предпросмотр этого формата недоступен. {canDownload ? 'Можно скачать исходный файл.' : ''}</p>}
      </div>
      <footer><span>{count ? `${count} ${count === 1 ? 'страница' : count < 5 ? 'страницы' : 'страниц'}` : 'Предпросмотр'}</span><div className="fos-document-actions">{canDownload && url && <a href={url} download={file.name}><img src={downloadIcon} alt="" />Скачать</a>}{onDelete && <FOSAction hierarchy="tertiary" shape="icon" aria-label="Удалить документ" title="Удалить документ" onClick={onDelete}><Trash2 size={20} strokeWidth={1.5} aria-hidden="true" /></FOSAction>}</div></footer>
    </FosMaterialSurface>
  </dialog>, document.body)
}
