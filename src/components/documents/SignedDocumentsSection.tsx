import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { useId, useRef, useState, useSyncExternalStore } from 'react'
import { addLocalDocument, removeLocalDocument, readLocalDocuments, subscribeLocalDocuments, type LocalDocument } from '@/components/messaging/local-communication'
import { FileDropzone } from './FileDropzone'
import { DocumentPreviewDialog } from './DocumentPreviewDialog'
import chevron from '@/assets/orders/chevron.svg'
import { SectionAddItem } from '@/components/orders/SectionAddItem'
import { LocalFileControl } from '@/components/ui/local-file-control'
import './documents.css'

/** Capability input is explicit. No localized status inference or invented item association/version. */
export function SignedDocumentsSection({ context, canAdd, canPreview = true, canDownload = true }: { context: string; canAdd: boolean; canPreview?: boolean; canDownload?: boolean }) {
  const id = useId(), files = useSyncExternalStore(subscribeLocalDocuments, () => readLocalDocuments(context)), [selected, setSelected] = useState<LocalDocument>()
  const addButton = useRef<HTMLButtonElement>(null)
  const [error, setError] = useState('')
  function add(file: File) {
    if (!canAdd) return
    if (!file.size) { setError('Пустой файл нельзя добавить. Выберите другой файл.'); return }
    addLocalDocument(context,file); setError('')
  }
  return <section className="fos-signed-documents" aria-labelledby={id} onDragOver={event => event.preventDefault()} onDrop={event => event.preventDefault()}>
    <div className="fos-order-composer__section-heading"><h2 id={id}>Подписные бланки</h2>{canAdd && <LocalFileControl label="Выбрать подписной бланк" onFile={add}>{open => <SectionAddItem ref={addButton} icon="file" accessibleName="Добавить подписной бланк" onClick={open} />}</LocalFileControl>}</div>
    {canAdd && !files.length && <FileDropzone disabled={false} onFile={add} />}
    {error && <p className="fos-field__error" role="alert">{error}</p>}
    {files.length > 0 && <ul>{files.map(document => <li key={document.id}><FosButtonRoot family="row" type="button" disabled={!canPreview} aria-label={'Открыть документ ' + (/\.pdf$/i.test(document.file.name) ? 'PDF ' : 'Файл ') + document.file.name + ' Выбран локально · не загружен'} onClick={event => { event.currentTarget.focus({preventScroll:true}); setSelected(document) }}>
      <span className="fos-document-kind">{/\.pdf$/i.test(document.file.name) ? 'PDF' : 'Файл'}</span>{' '}<span className="fos-document-name">{document.file.name}{' '}<small>Выбран локально · не загружен</small></span><img src={chevron} alt="" />
    </FosButtonRoot></li>)}</ul>}
    {!canAdd && !files.length && <p className="fos-message-meta">Бланки не добавлены</p>}
    {selected && canPreview && <DocumentPreviewDialog key={selected.id} file={selected.file} canDownload={canDownload} onClose={() => setSelected(undefined)} onDelete={canAdd ? () => { removeLocalDocument(context,selected.id); setSelected(undefined); requestAnimationFrame(() => addButton.current?.focus({preventScroll:true})) } : undefined} />}
  </section>
}
