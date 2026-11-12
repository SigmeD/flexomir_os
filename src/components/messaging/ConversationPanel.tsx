import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, useSyncExternalStore, type Ref } from 'react'
import { MessageComposer } from './MessageComposer'
import { MessageThread, type MessageThreadHandle, type MessageEditState } from './MessageThread'
import { localConversation, localDraft, saveLocalDraft, localAttachment, saveLocalAttachment, localRecording, saveLocalRecording } from './local-communication'
import type { ConversationMessage, ConversationPhase } from './message-model'

export interface ConversationState { dirty:boolean; canSave:boolean; busy:boolean }
export interface ConversationHandle { commit:()=>Promise<boolean> }
export function ConversationPanel({ context, actor, author, canReply, seed = [], requireText = false, phase = 'open', ref, onStateChange }: { context: string; actor: string; author: string; canReply: boolean; seed?: readonly ConversationMessage[]; requireText?: boolean; phase?:ConversationPhase; ref?:Ref<ConversationHandle>; onStateChange?:(state:ConversationState)=>void }) {
  const adapter = localConversation(context,seed)
  const messages = useSyncExternalStore(adapter.subscribe,adapter.read)
  useLayoutEffect(()=>adapter.setPhase(phase),[adapter,phase])
  const [text,setText] = useState(() => localDraft(context,actor))
  const [attachment,setAttachment] = useState(() => localAttachment(context,actor))
  const [recordingDraft,setRecordingDraft] = useState(() => localRecording(context,actor))
  const initial=useRef({version:adapter.version(actor),text,attachment,recordingDraft})
  const thread=useRef<MessageThreadHandle>(null)
  const [busy,setBusy]=useState(false),[editState,setEditState]=useState<MessageEditState>({dirty:false,canCommit:true,busy:false})
  const version=adapter.version(actor)
  const dirty=version!==initial.current.version || text.trim()!==initial.current.text.trim() || attachment!==initial.current.attachment || recordingDraft!==initial.current.recordingDraft || editState.dirty
  useEffect(()=>{onStateChange?.({dirty,canSave:editState.canCommit,busy:busy||editState.busy})},[dirty,editState.canCommit,editState.busy,busy,onStateChange])
  useImperativeHandle(ref,()=>({commit:async()=>Boolean(await thread.current?.commit())}))
  return <MessageThread ref={thread} onEditStateChange={setEditState} messages={messages} ownActor={actor} actions={{update:async(id,draft)=>adapter.update(id,draft,actor),remove:async id=>adapter.remove(id,actor),reason:message=>adapter.mutationReason(message,actor),read:ids=>adapter.markRead(ids,actor)}}>
    {canReply && <MessageComposer text={text} onBusyChange={setBusy} requiredText={requireText} recordingDraft={recordingDraft} onRecordingDraftChange={file => { setRecordingDraft(file); saveLocalRecording(context,actor,file) }} attachment={attachment} onAttachmentChange={file => { setAttachment(file); saveLocalAttachment(context,actor,file) }} canSubmit={!requireText || Boolean(text.trim())} onTextChange={next => { setText(next); saveLocalDraft(context,actor,next) }}
      onSubmit={async (draft,id) => { await adapter.submit(id,draft,actor,author) }} />}
  </MessageThread>
}
