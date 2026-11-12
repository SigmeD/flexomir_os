import { LocalFileControl } from '@/components/ui/local-file-control'
import { FOSAction } from '@/components/ui/fos-controls'
import uploadIcon from '@/assets/orders/upload.svg'
import './documents.css'

/** 3476:3570 shares native picker/drop with artwork, without library/help semantics. */
export function FileDropzone({ disabled, onFile }: { disabled: boolean; onFile: (file: File) => void }) {
  return <LocalFileControl label="Загрузить первый подписной бланк" disabled={disabled} onFile={onFile} className="fos-file-dropzone" clickable>
    {open => <><FOSAction disabled={disabled} onClick={open}><img src={uploadIcon} alt="" />Загрузить</FOSAction>
      <p>Выберите файл или перетащите сюда</p><small>Форматы и размер файлов уточняются</small></>}
  </LocalFileControl>
}
