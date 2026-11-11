import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { FOSAction, FOSInput, FOSTextarea } from '@/components/ui/fos-controls'
import { LocalFileControl } from '@/components/ui/local-file-control'
import { ArtworkThumbnail } from '@/components/ui/artwork-thumbnail'
import type { LayoutUploadValue } from '@/demo/LayoutDemoProvider'
import upload from '@/assets/orders/upload.svg'
import preview from '@/assets/layouts/preview.svg'
import uploadTrailing from '@/assets/layouts/upload.svg'
import './layouts.css'

/** One Layout Upload Panel for LAY07/08/09; no invented network progress or success. */
export function LayoutUploadPanel({ fileName, onFile, error }: { fileName: string; onFile: (file: File) => void; error?: string }) {
  return <section className="fos-layout-upload" aria-label="Исходный файл">
    <h2>Исходный файл</h2>
    <LocalFileControl label="Выбрать исходный файл" onFile={onFile} className={'fos-layout-upload__zone' + (fileName ? ' fos-layout-upload__zone--selected' : '')} state={error ? 'error' : fileName ? 'selected' : 'empty'}>
      {open => fileName ? <><ArtworkThumbnail /><div className="fos-layout-upload__file"><strong>{fileName}</strong><small>Выбран локально · не загружен на сервер</small></div><FOSAction onClick={open}>Заменить файл</FOSAction></> : <>
        <FOSAction onClick={open}><img src={upload} alt="" />Загрузить</FOSAction><p><span className="fos-layout-upload__desktop">Выберите файл или перетащите сюда</span><span className="fos-layout-upload__mobile">Выберите файл с устройства</span></p><small>Форматы и размер файла уточняются</small>
      </>}
    </LocalFileControl>
    {fileName && <p className="fos-sr-only">Выбран локально: {fileName}</p>}
    {error && <p className="fos-field__error" role="alert">{error}</p>}
  </section>
}
export function LayoutUploadForm({ value, onChange, error }: { value: LayoutUploadValue; onChange: (value: LayoutUploadValue) => void; error?: string }) {
  return <div className="fos-layout-upload-form" data-testid="layout-upload-form">
    <LayoutUploadPanel fileName={value.sourceName} onFile={file => onChange({ ...value, sourceName: file.name })} error={error} />
    <div className="fos-layout-upload-form__metadata">
      <FOSInput label="Название макета" value={value.title} placeholder="Например, Этикетка 100×150" onChange={event => onChange({ ...value, title: event.target.value })} />
      <div className="fos-layout-preview-field"><span>Превью макета</span><LocalFileControl label="Выбрать превью макета" onFile={file => onChange({ ...value, previewName: file.name })}>
        {open => <FosButtonRoot family="field" type="button" className="fos-layout-preview-field__button" onClick={open}><img src={preview} alt="" /><span>{value.previewName || 'Добавить превью'}</span><img src={uploadTrailing} alt="" /></FosButtonRoot>}
      </LocalFileControl></div>
      <FOSTextarea wrapperClassName="fos-layout-upload-form__description" label="Описание (необязательно)" value={value.description} placeholder="Добавьте описание, если необходимо" onChange={event => onChange({ ...value, description: event.target.value })} />
    </div>
  </div>
}
