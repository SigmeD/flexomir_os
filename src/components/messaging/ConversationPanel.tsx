import { useState, useSyncExternalStore } from 'react'
import { MessageComposer } from './MessageComposer'
import { MessageThread } from './MessageThread'
import { localConversation, localDraft, saveLocalDraft, localAttachment, saveLocalAttachment, localRecording, saveLocalRecording } from './local-communication'
import type { ConversationMessage } from './message-model'

export function ConversationPanel({ context, actor, author, canReply, seed = [], requireText = false }: { context: string; actor: string; author: string; canReply: boolean; seed?: readonly ConversationMessage[]; requireText?: boolean }) {
  const adapter = localConversation(context,seed)
  const messages = useSyncExternalStore(adapter.subscribe,adapter.read)
  const [text,setText] = useState(() => localDraft(context,actor))
  const [attachment,setAttachment] = useState(() => localAttachment(context,actor))
  const [recordingDraft,setRecordingDraft] = useState(() => localRecording(context,actor))
  return <MessageThread messages={messages} ownActor={actor}>
    {canReply && <MessageComposer text={text} requiredText={requireText} recordingDraft={recordingDraft} onRecordingDraftChange={file => { setRecordingDraft(file); saveLocalRecording(context,actor,file) }} attachment={attachment} onAttachmentChange={file => { setAttachment(file); saveLocalAttachment(context,actor,file) }} canSubmit={!requireText || Boolean(text.trim())} onTextChange={next => { setText(next); saveLocalDraft(context,actor,next) }}
      onSubmit={async (draft,id) => { await adapter.submit(id,draft,actor,author) }} />}
  </MessageThread>
}
