import { useId } from 'react'
import { FOSAction } from '@/components/ui/fos-controls'
import { LocalFileControl } from '@/components/ui/local-file-control'
import uploadIcon from '@/assets/orders/upload.svg'
import './artwork-source.css'

interface ArtworkSelection { artworkMode: 'UPLOAD' | 'LIBRARY' | 'HELP'; fileName: string; unavailableArtwork?: string; layoutId?: string; layoutName?: string }
/** Artwork Source 634:445. File selection is local; no fabricated upload/storage success. */
export function ArtworkSource({ value, onChange, disabled = false, error, onOpenLibrary }: { value: ArtworkSelection; onChange: (patch: ArtworkSelection) => void; disabled?: boolean; error?: string; onOpenLibrary?: () => void }) {
  const id = useId()
  return <section className="fos-artwork-source" aria-labelledby={id + '-title'}>
    <h2 id={id + '-title'}>Макет этой позиции</h2>
    {value.artworkMode !== 'HELP' && <>
      <LocalFileControl label="Выбрать файл макета" disabled={disabled} onFile={file => onChange({ artworkMode: 'UPLOAD', fileName: file.name, layoutId: undefined, layoutName: undefined })} className="fos-artwork-source__dropzone" state={error ? 'error' : value.fileName || value.layoutId ? 'selected' : 'empty'}>
        {open => <><FOSAction disabled={disabled} onClick={open}><img src={uploadIcon} alt="" />{value.fileName ? 'Заменить файл' : 'Загрузить'}</FOSAction>
        <p data-testid={value.artworkMode === 'LIBRARY' ? 'artwork-library-selection' : undefined}>{value.artworkMode === 'LIBRARY' && value.layoutName ? 'Выбран демомакет: ' + value.layoutName : value.fileName ? 'Выбран локально: ' + value.fileName : <><span className="fos-artwork-source__desktop-hint">Выберите файл или перетащите сюда</span><span className="fos-artwork-source__mobile-hint">Выберите файл с устройства</span></>}</p>
        <small>{value.artworkMode === 'LIBRARY' ? 'Только демосессия · сервер не подключён' : value.fileName ? 'Файл не загружен на сервер' : 'Форматы и размер файла уточняются'}</small></>}
      </LocalFileControl>
      {value.unavailableArtwork && <p className="fos-artwork-source__notice">Исходный макет недоступен: {value.unavailableArtwork}. Выберите файл заново или запросите помощь.</p>}
    </>}
    <div className="fos-artwork-source__options">
      {value.artworkMode !== 'HELP' && <FOSAction size="compact" disabled={disabled || !onOpenLibrary} onClick={onOpenLibrary} data-artwork-library title={onOpenLibrary ? 'Выбор синтетического макета в демосессии' : 'Библиотека компании не подключена'}>Мои макеты</FOSAction>}
      <label><input type="checkbox" disabled={disabled} checked={value.artworkMode === 'HELP'} onChange={event => onChange({ artworkMode: event.target.checked ? 'HELP' : 'UPLOAD', fileName: '', layoutId: undefined, layoutName: undefined })} />Нужна помощь с макетом</label>
    </div>
    {error && <p className="fos-field__error" role="alert">{error}</p>}
  </section>
}
