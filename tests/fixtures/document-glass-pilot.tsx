import {useState} from 'react'
import {createRoot} from 'react-dom/client'
import {DocumentPreviewDialog} from '@/components/documents/DocumentPreviewDialog'
import {FOSAction,FOSInput,FOSTextarea} from '@/components/ui/fos-controls'
import {FosSummaryRow} from '@/components/ui/fos-summary-row'
import '@/styles.css'

const file=new File(['id,value\n1,synthetic\n'],'synthetic.csv',{type:'text/csv'})
function PreviewFixture(){
  const [open,setOpen]=useState(true)
  const stripes=new URLSearchParams(location.search).get('pattern')==='stripes'
  return <>
    <style>{`body{margin:0;background:white;color:#273343;font-family:Manrope,system-ui,sans-serif}main{max-width:1050px;margin:64px auto;padding:0 36px}section{margin:48px 0}.fields{display:grid;grid-template-columns:1fr 1fr;gap:24px}.stripes{position:fixed;inset:0;background:repeating-linear-gradient(0deg,#000 0 1px,#fff 1px 8px);pointer-events:none}.document{margin-top:16px}.document small{display:block;margin-top:8px}h2{font-size:20px;line-height:28px;font-weight:600}.fos-field__control--note{height:120px}`}</style>
    <main>
      <h1>Новый заказ · тестовые данные</h1><FOSAction onClick={()=>setOpen(true)}>Открыть просмотр</FOSAction>
      <section><h2>Продукция</h2><p>Позиция ещё не добавлена. Добавьте первую позицию.</p></section>
      <section><h2>Общие данные заказа</h2><div className="fields"><FOSInput label="Желаемый срок" value="" placeholder="ДД.ММ.ГГГГ" readOnly/><FOSInput label="Согласованный срок" value="" readOnly/></div></section>
      <section><h2>Подписные бланки</h2>{[1,2].map(n=><FosSummaryRow key={n} className="fos-document-row document" surface="card" leading={<span className="fos-document-kind">Файл</span>} onClick={()=>setOpen(true)}><span>synthetic.csv<small>Выбран локально · не загружен</small></span></FosSummaryRow>)}</section>
      <section><h2>Комментарии</h2><FOSTextarea label="Сообщение" value="" placeholder="Сообщение…" readOnly/></section>
    </main>
    {stripes&&<div className="stripes"/>}
    {open&&<DocumentPreviewDialog file={file} canDownload onClose={()=>setOpen(false)} onDelete={()=>setOpen(false)}/>}
  </>
}
createRoot(document.getElementById('root')!).render(<PreviewFixture/> )
