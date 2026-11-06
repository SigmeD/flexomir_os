import { useId, useRef } from 'react'
import { FOSAction } from '@/components/ui/fos-controls'
import uploadIcon from '@/assets/orders/upload.svg'
import './artwork-source.css'

interface ArtworkSelection { artworkMode: 'UPLOAD' | 'LIBRARY' | 'HELP'; fileName: string; unavailableArtwork?: string }
/** Artwork Source 634:445. File selection is local; no fabricated upload/storage success. */
export function ArtworkSource({ value, onChange, disabled = false, error }: { value: ArtworkSelection; onChange: (patch: ArtworkSelection) => void; disabled?: boolean; error?: string }) {
  const input = useRef<HTMLInputElement>(null), id = useId()
  function selectFile(file?: File) { if (file && !disabled) onChange({ artworkMode: 'UPLOAD', fileName: file.name }) }
  return <section className="fos-artwork-source" aria-labelledby={id + '-title'}>
    <h2 id={id + '-title'}>Макет этой позиции</h2>
    {value.artworkMode !== 'HELP' && <>
      <div className="fos-artwork-source__dropzone" data-state={error ? 'error' : value.fileName ? 'selected' : 'empty'} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); selectFile(event.dataTransfer.files[0]) }}>
        <input ref={input} hidden type="file" aria-label="Выбрать файл макета" disabled={disabled} onChange={event => selectFile(event.target.files?.[0])} />
        <FOSAction disabled={disabled} onClick={() => input.current?.click()}><img src={uploadIcon} alt="" />{value.fileName ? 'Заменить файл' : 'Загрузить'}</FOSAction>
        <p>{value.fileName ? 'Выбран локально: ' + value.fileName : <><span className="fos-artwork-source__desktop-hint">Выберите файл или перетащите сюда</span><span className="fos-artwork-source__mobile-hint">Выберите файл с устройства</span></>}</p>
        <small>{value.fileName ? 'Файл не загружен на сервер' : 'Форматы и размер файла уточняются'}</small>
      </div>
      {value.unavailableArtwork && <p className="fos-artwork-source__notice">Исходный макет недоступен: {value.unavailableArtwork}. Выберите файл заново или запросите помощь.</p>}
    </>}
    <div className="fos-artwork-source__options">
      {value.artworkMode !== 'HELP' && <FOSAction disabled title="Библиотека компании не подключена">Мои макеты</FOSAction>}
      <label><input type="checkbox" disabled={disabled} checked={value.artworkMode === 'HELP'} onChange={event => onChange({ artworkMode: event.target.checked ? 'HELP' : 'UPLOAD', fileName: '' })} />Нужна помощь с макетом</label>
    </div>
    {error && <p className="fos-field__error" role="alert">{error}</p>}
  </section>
}
