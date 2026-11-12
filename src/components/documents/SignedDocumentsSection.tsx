import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { useId, useState, useSyncExternalStore } from 'react'
import { addLocalDocument, readLocalDocuments, subscribeLocalDocuments, type LocalDocument } from '@/components/messaging/local-communication'
import { FileDropzone } from './FileDropzone'
import { DocumentPreviewDialog } from './DocumentPreviewDialog'
import chevron from '@/assets/orders/chevron.svg'
import './documents.css'

/** Capability input is explicit. No localized status inference or invented item association/version. */
export function SignedDocumentsSection({ context, canAdd, canPreview = true, canDownload = true }: { context: string; canAdd: boolean; canPreview?: boolean; canDownload?: boolean }) {
  const id = useId(), files = useSyncExternalStore(subscribeLocalDocuments, () => readLocalDocuments(context)), [selected, setSelected] = useState<LocalDocument>()
  const [error, setError] = useState('')
  function add(file: File) {
    if (!canAdd) return
    if (!file.size) { setError('Пустой файл нельзя добавить. Выберите другой файл.'); return }
    addLocalDocument(context,file); setError('')
  }
  return <section className="fos-signed-documents" aria-labelledby={id} onDragOver={event => event.preventDefault()} onDrop={event => event.preventDefault()}>
    <div className="fos-order-composer__section-heading"><h2 id={id}>Подписные бланки</h2></div>
    {/* D08: canonical file-add variant must come from PR40 after explicit incorporation decision. */}
    {canAdd && <FileDropzone disabled={!canAdd} onFile={add} />}
    {error && <p className="fos-field__error" role="alert">{error}</p>}
    {files.length > 0 && <ul>{files.map(document => <li key={document.id}><FosButtonRoot family="row" type="button" disabled={!canPreview} aria-label={'Открыть документ ' + document.file.name} onClick={event => { event.currentTarget.focus({preventScroll:true}); setSelected(document) }}>
      <span className="fos-document-kind">{/\.pdf$/i.test(document.file.name) ? 'PDF' : 'Файл'}</span><span className="fos-document-name">{document.file.name}<small>Выбран локально · не загружен</small></span><img src={chevron} alt="" />
    </FosButtonRoot></li>)}</ul>}
    {!canAdd && !files.length && <p className="fos-message-meta">Бланки не добавлены</p>}
    {selected && canPreview && <DocumentPreviewDialog key={selected.id} file={selected.file} canDownload={canDownload} onClose={() => setSelected(undefined)} />}
  </section>
}
