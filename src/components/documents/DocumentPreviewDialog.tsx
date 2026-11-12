import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FosGlassMaterial } from '@/components/ui/fos-glass-material'
import { FOSAction } from '@/components/ui/fos-controls'
import closeIcon from '@/assets/messaging/close.svg'
import downloadIcon from '@/assets/layouts/download.svg'
import './documents.css'

const PdfPages = lazy(() => import('./PdfPages'))
export function DocumentPreviewDialog({ file, canDownload, onClose }: { file: File; canDownload: boolean; onClose: () => void }) {
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
    <FosGlassMaterial className="fos-document-shell" contentClassName="fos-document-content" radius={22} blur={5} strength={.022} dome={0} tone="neutral" shadow="none" centerOpacity={0} rimWidth={1.25}>
      <header><div><h2 id={id} tabIndex={0} title={file.name}>{file.name}</h2><p>Подписной бланк · выбран локально</p></div><FOSAction hierarchy="tertiary" shape="icon" className="fos-document-close" aria-label="Закрыть" onClick={onClose}><img src={closeIcon} alt="" /></FOSAction></header>
      <div className="fos-document-viewport" tabIndex={0} role="region" aria-label="Страницы документа">
        {file.type === 'application/pdf' || /\.pdf$/i.test(file.name) ? <Suspense fallback={<p role="status">Открываем PDF…</p>}><PdfPages file={file} onCount={setCount} /></Suspense>
          : <p>Предпросмотр этого формата недоступен. {canDownload ? 'Можно скачать исходный файл.' : ''}</p>}
      </div>
      <footer><span>{count ? `${count} ${count === 1 ? 'страница' : count < 5 ? 'страницы' : 'страниц'}` : 'Предпросмотр'}</span>{canDownload && url && <a href={url} download={file.name}><img src={downloadIcon} alt="" />Скачать</a>}</footer>
    </FosGlassMaterial>
  </dialog>, document.body)
}
