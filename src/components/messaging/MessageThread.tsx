import { useEffect, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from 'react'
import { hasMessage, messageMutationReason, type ConversationMessage, type MessageDraft } from './message-model'
import { OverflowMenu } from '@/components/ui/overflow-menu'
import { FOSAction } from '@/components/ui/fos-controls'
import { MessageComposer, type MessageComposerHandle } from './MessageComposer'
import { useMessageContext } from './use-message-context'
import './messaging.css'

function MessageAttachment({ file }: { file: File }) {
  const [url, setUrl] = useState('')
  useEffect(() => { const next = URL.createObjectURL(file); setUrl(next); return () => URL.revokeObjectURL(next) }, [file])
  if (file.type.startsWith('audio/')) return <audio controls src={url || undefined} aria-label={file.name} />
  if (file.type.startsWith('video/')) return <video controls src={url || undefined} aria-label={file.name} />
  return <a href={url} download={file.name}>{file.name}</a>
}
export interface MessageEditState { dirty: boolean; canCommit: boolean; busy: boolean }
export interface MessageThreadHandle { commit: () => Promise<boolean> }
export interface MessageActions {
  update: (id:string,draft:MessageDraft)=>Promise<unknown>
  remove: (id:string)=>Promise<unknown>
  reason: (message:ConversationMessage)=>string | undefined
  read: (ids:readonly string[])=>void
}
export function MessageThread({ messages, ownActor, children, showHistory = true, actions, ref, onEditStateChange }: { messages: readonly ConversationMessage[]; ownActor: string; children?: ReactNode; showHistory?: boolean; actions?: MessageActions; ref?:Ref<MessageThreadHandle>; onEditStateChange?:(state:MessageEditState)=>void }) {
  const root=useRef<HTMLDivElement>(null), editor=useRef<MessageComposerHandle>(null), menu=useMessageContext()
  const [editing,setEditing]=useState<(MessageDraft & {id:string;recording?:File})>(),[editBusy,setEditBusy]=useState(false)
  const [feedback,setFeedback]=useState(''),[error,setError]=useState('')
  const original=messages.find(message=>message.id===editing?.id)
  const reason=original ? actions?.reason(original) ?? messageMutationReason(original,ownActor) : undefined
  const editedDraft=editing && {text:editing.text,file:editing.recording ?? editing.file}
  const dirty=Boolean(editedDraft && original && (editedDraft.text!==original.text || editedDraft.file!==original.file))
  const canCommit=!dirty || Boolean(editedDraft && hasMessage(editedDraft) && !reason && actions)
  useEffect(()=>{onEditStateChange?.({dirty,canCommit,busy:editBusy})},[dirty,canCommit,editBusy,onEditStateChange])
  useEffect(()=>()=>onEditStateChange?.({dirty:false,canCommit:true,busy:false}),[onEditStateChange])
  useImperativeHandle(ref,()=>({commit:async()=>!dirty || Boolean(await editor.current?.submit())}))
  function focusMessage(id?:string) {
    requestAnimationFrame(()=>{
      const target=id ? Array.from(root.current?.querySelectorAll<HTMLElement>('[data-message-id]') ?? []).find(element=>element.dataset.messageId===id) : root.current?.querySelector<HTMLElement>('[data-testid=message-composer] textarea')
      target?.focus({preventScroll:true})
    })
  }
  useEffect(()=>{
    if (!actions || !root.current) return
    const targets=Array.from(root.current.querySelectorAll<HTMLElement>('[data-message-id]'))
    const readVisible=()=>{
      if (document.visibilityState !== 'visible' || !document.hasFocus() || root.current?.closest('[inert],[hidden]') || document.querySelector('dialog[open],[aria-modal=true]')) return
      const visible=targets.filter(element=>{const b=element.getBoundingClientRect();return b.width>0&&b.height>0&&b.top<innerHeight&&b.bottom>0})
        .map(element=>element.dataset.messageId!).filter(id=>{const m=messages.find(message=>message.id===id);return m&&m.actor!==ownActor&&!m.readBy?.includes(ownActor)})
      if(visible.length)actions.read(visible)
    }
    const observer=new IntersectionObserver(readVisible)
    targets.forEach(element=>observer.observe(element))
    document.addEventListener('visibilitychange',readVisible);document.addEventListener('focusin',readVisible);window.addEventListener('focus',readVisible)
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',readVisible);document.removeEventListener('focusin',readVisible);window.removeEventListener('focus',readVisible)}
  },[messages,ownActor,actions])
  const selected=messages.find(message=>message.id===menu.selected?.id)
  const selectedReason=selected ? actions?.reason(selected) ?? messageMutationReason(selected,ownActor) : undefined
  async function copy(text:string) {
    try { if(!navigator.clipboard) throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(text);setFeedback('Текст скопирован');setError('') }
    catch { setError('Не удалось скопировать текст. Выделите его и скопируйте вручную.') }
  }
  return <div className="fos-comments" ref={root}>
    {showHistory && messages.length > 0 && <div className="fos-message-thread" data-testid="message-thread" role="log" aria-label="История сообщений">{messages.map(message => <article key={message.id} className="fos-message" data-message-id={message.id} data-read-by={message.readBy?.join(',')??''} data-own={message.actor === ownActor} tabIndex={0} aria-haspopup="menu" {...(editing?.id===message.id ? {} : menu.bind(message.id))}>
      <p className="fos-message-author">{message.author}</p><div className="fos-message-surface">{editing?.id===message.id ? <div data-testid="message-editor" className="fos-message-editor">
        <MessageComposer key={message.id} ref={editor} intent="save" autoFocus label="Редактирование сообщения" text={editing.text} onTextChange={text=>setEditing(current=>current&&({...current,text}))} attachment={editing.file} onAttachmentChange={file=>setEditing(current=>current&&({...current,file}))} onRecordingDraftChange={recording=>setEditing(current=>current&&current.recording!==recording?{...current,recording}:current)} onBusyChange={setEditBusy} submitLabel="Сохранить сообщение" canSubmit={dirty&&canCommit} error={reason} clearOnSuccess={false}
          onSubmit={async draft=>{await actions?.update(message.id,draft);setEditing(undefined);focusMessage(message.id)}} />
        <FOSAction disabled={editBusy} onClick={()=>{setEditing(undefined);focusMessage(message.id)}}>Отменить</FOSAction>
      </div> : <><p>{message.text}</p>{message.file && <MessageAttachment file={message.file} />}</>}<small>{message.time}{message.local ? ' · Только в демосессии' : ''}</small></div>
    </article>)}</div>}
    <OverflowMenu label="Действия сообщения" context={{point:menu.selected?.point ?? null,onClose:menu.close}} items={selected ? [
      {id:'delete',label:'Удалить',disabled:!actions||Boolean(selectedReason),reason:selectedReason,focusAfter:'consumer',onSelect:()=>{void actions?.remove(selected.id).then(()=>{setError('');focusMessage()}).catch(reason=>setError(String(reason.message ?? reason))) }},
      {id:'edit',label:'Редактировать',disabled:!actions||Boolean(selectedReason),reason:selectedReason,focusAfter:'consumer',onSelect:()=>{setEditing({id:selected.id,text:selected.text,file:selected.file});setError('')}},
      {id:'copy',label:'Копировать',disabled:!selected.text,reason:!selected.text?'В сообщении нет текста':undefined,onSelect:()=>{void copy(selected.text)}},
    ] : []} />
    {feedback && <p className="fos-message-meta" role="status">{feedback}</p>}{error && <p className="fos-field__error" role="alert">{error}</p>}
    {children}
  </div>
}
