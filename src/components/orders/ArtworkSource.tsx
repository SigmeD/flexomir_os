import { useId, type DragEvent } from 'react'
import { FOSAction } from '@/components/ui/fos-controls'
import { LocalFileControl } from '@/components/ui/local-file-control'
import uploadIcon from '@/assets/orders/upload.svg'
import './artwork-source.css'

interface ArtworkSelection { artworkMode: 'UPLOAD' | 'LIBRARY' | 'HELP'; fileName: string; unavailableArtwork?: string; layoutId?: string; layoutName?: string }
export type ArtworkSourcePresentation = 'reference' | 'states'
/** Artwork Source 634:445. File selection is local; no fabricated upload/storage success. */
export function ArtworkSource({ value, onChange, disabled = false, error, onOpenLibrary, presentation = 'reference' }: { value: ArtworkSelection; onChange: (patch: ArtworkSelection) => void; disabled?: boolean; error?: string; onOpenLibrary?: () => void; presentation?: ArtworkSourcePresentation }) {
  const id = useId()
  const pilot = presentation === 'states'
  const state = value.artworkMode === 'HELP' ? 'help'
    : value.artworkMode === 'LIBRARY' && value.layoutId && value.layoutName ? 'library'
    : value.fileName ? 'local' : value.unavailableArtwork ? 'unavailable' : 'empty'
  const library = pilot && state === 'library'
  const controlState = error ? 'error' : state === 'local' || state === 'library' ? 'selected' : 'empty'
  const selectFile = (file: File) => onChange({ artworkMode: 'UPLOAD', fileName: file.name, layoutId: undefined, layoutName: undefined, unavailableArtwork: undefined })
  const stopDrop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); event.stopPropagation() }
  const options = (openFile?: () => void) => <div className="fos-artwork-source__options" onDragOver={pilot ? stopDrop : undefined} onDrop={pilot ? stopDrop : undefined}>
    {value.artworkMode !== 'HELP' && (library
      ? <FOSAction size="compact" disabled={disabled} onClick={openFile}>Выбрать файл</FOSAction>
      : <FOSAction size="compact" disabled={disabled || !onOpenLibrary} onClick={onOpenLibrary} data-artwork-library title={onOpenLibrary ? 'Выбор синтетического макета в демосессии' : 'Библиотека компании не подключена'}>Мои макеты</FOSAction>)}
    <label><input type="checkbox" disabled={disabled} checked={value.artworkMode === 'HELP'} onChange={event => onChange({ artworkMode: event.target.checked ? 'HELP' : 'UPLOAD', fileName: '', layoutId: undefined, layoutName: undefined, unavailableArtwork: undefined })} />Нужна помощь с макетом</label>
  </div>
  const content = (openFile: () => void) => <>
    <FOSAction disabled={disabled || (library && !onOpenLibrary)} onClick={library ? onOpenLibrary : openFile} data-artwork-library={library ? '' : undefined} aria-describedby={pilot ? `${id}-selection ${id}-hint` : undefined}>
      {!library && <img src={uploadIcon} alt="" />}
      {library ? 'Заменить макет' : pilot && state === 'unavailable' ? 'Выбрать файл' : value.fileName ? 'Заменить файл' : 'Загрузить'}
    </FOSAction>
    <p id={id + '-selection'} aria-live={pilot ? 'polite' : undefined} aria-atomic={pilot ? true : undefined} data-testid={value.artworkMode === 'LIBRARY' ? 'artwork-library-selection' : undefined}>
      {library ? 'Выбран из библиотеки: ' + value.layoutName
        : pilot && state === 'unavailable' ? 'Исходный макет недоступен: ' + value.unavailableArtwork
        : value.artworkMode === 'LIBRARY' && value.layoutName ? 'Выбран демомакет: ' + value.layoutName
        : value.fileName ? 'Выбран локально: ' + value.fileName
        : <><span className="fos-artwork-source__desktop-hint">Выберите файл или перетащите сюда</span><span className="fos-artwork-source__mobile-hint">Выберите файл с устройства</span></>}
    </p>
    <small id={id + '-hint'}>{pilot && state === 'unavailable' ? 'Выберите файл заново, макет из библиотеки или запросите помощь.' : value.artworkMode === 'LIBRARY' ? 'Только демосессия · сервер не подключён' : value.fileName ? 'Файл не загружен на сервер' : 'Форматы и размер файла уточняются'}</small>
  </>
  return <section className="fos-artwork-source" aria-labelledby={id + '-title'} data-artwork-presentation={pilot ? 'pilot' : undefined} data-artwork-state={pilot ? state : undefined}>
    <h2 id={id + '-title'}>Макет этой позиции</h2>
    {(pilot || value.artworkMode !== 'HELP') && <>
      <LocalFileControl label="Выбрать файл макета" disabled={disabled || value.artworkMode === 'HELP'} onFile={selectFile} className={pilot ? 'fos-artwork-source__control' : 'fos-artwork-source__dropzone'} state={pilot ? controlState : error ? 'error' : value.fileName || value.layoutId ? 'selected' : 'empty'}>
        {open => pilot ? <>{value.artworkMode !== 'HELP' && <div className="fos-artwork-source__dropzone" data-state={controlState}>{content(open)}</div>}{options(open)}</> : content(open)}
      </LocalFileControl>
      {!pilot && value.unavailableArtwork && <p className="fos-artwork-source__notice">Исходный макет недоступен: {value.unavailableArtwork}. Выберите файл заново или запросите помощь.</p>}
    </>}
    {!pilot && options()}
    {error && <p className="fos-field__error" role="alert">{error}</p>}
  </section>
}
