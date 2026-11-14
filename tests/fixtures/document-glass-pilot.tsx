import {useState} from 'react'
import {createRoot} from 'react-dom/client'
import {DocumentPreviewDialog} from '@/components/documents/DocumentPreviewDialog'
import {FOSAction,FOSInput,FOSTextarea} from '@/components/ui/fos-controls'
import {FosSummaryRow,FosSummaryRowCopy} from '@/components/ui/fos-summary-row'
import {ArtworkThumbnail} from '@/components/ui/artwork-thumbnail'
import {FosSectionHeading} from '@/components/ui/fos-section-heading'
import '@/styles.css'

const file=new File(['id,value\n1,synthetic\n'],'synthetic.csv',{type:'text/csv'})
function PreviewFixture(){
  const [open,setOpen]=useState(true)
  const pattern=new URLSearchParams(location.search).get('pattern')
  return <>
    <style>{`body{margin:0;background:white;color:#273343;font-family:Manrope,system-ui,sans-serif}main{max-width:1050px;margin:64px auto;padding:0 36px}section{margin:48px 0}.fields{display:grid;grid-template-columns:1fr 1fr;gap:24px}.stripes{position:fixed;inset:0;background:repeating-linear-gradient(0deg,#000 0 1px,#fff 1px 8px);pointer-events:none}.checker{position:fixed;inset:0;background:repeating-conic-gradient(#111 0% 25%,#eee 0% 50%) 50%/8px 8px;pointer-events:none}.document{margin-top:16px}.fos-field__control--note{height:120px}`}</style>
    <main>
      <h1>Новый заказ · тестовые данные</h1><FOSAction onClick={()=>setOpen(true)}>Открыть просмотр</FOSAction>
      <section><FosSectionHeading>Продукция</FosSectionHeading><p>Позиция ещё не добавлена. Добавьте первую позицию.</p></section>
      <section><FosSectionHeading>Общие данные заказа</FosSectionHeading><div className="fields"><FOSInput label="Желаемый срок" value="" placeholder="ДД.ММ.ГГГГ" readOnly/><FOSInput label="Согласованный срок" value="" readOnly/></div></section>
      <section><FosSectionHeading>Подписные бланки</FosSectionHeading>{[1,2].map(n=><FosSummaryRow key={n} className="fos-document-row document" surface="card" leading={<ArtworkThumbnail label="Файл"/>} aria-label="Открыть документ Файл synthetic.csv Выбран локально · не загружен" onClick={()=>setOpen(true)}>{' '}<FosSummaryRowCopy titleAs="span" classes={{title:'fos-document-name'}} title={<>synthetic.csv{' '}</>} metadata="Выбран локально · не загружен"/></FosSummaryRow>)}</section>
      <section><FosSectionHeading>Комментарии</FosSectionHeading><FOSTextarea label="Сообщение" value="" placeholder="Сообщение…" readOnly/></section>
    </main>
    {pattern==='stripes'&&<div className="stripes"/>}
    {pattern==='checker'&&<div className="checker"/>}
    {open&&<DocumentPreviewDialog file={file} canDownload onClose={()=>setOpen(false)} onDelete={()=>setOpen(false)}/>}
  </>
}
createRoot(document.getElementById('root')!).render(<PreviewFixture/> )
