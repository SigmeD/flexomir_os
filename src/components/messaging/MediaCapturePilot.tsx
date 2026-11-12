import { useEffect, useState } from 'react'
import { MediaCapture } from './media-capture'
import { MessageComposer } from './MessageComposer'
import { MessageThread } from './MessageThread'
import type { ConversationMessage } from './message-model'
import { FOSAction } from '@/components/ui/fos-controls'

/** Isolated callback harness allowed by D03. These are not approved product gestures. */
export function MediaCapturePilot() {
  const [capture,setCapture] = useState<MediaCapture>(), [text,setText] = useState(''), [messages,setMessages] = useState<ConversationMessage[]>([])
  useEffect(() => { const next = new MediaCapture(); setCapture(next); return () => next.dispose() },[])
  return <section className="fos-media-pilot" aria-label="Изолированные callbacks записи">
    <h2>Запись · D03 OPEN</h2><p>Только локальные callbacks. Жесты приложения не включены; файл не отправляется на сервер.</p>
    <FOSAction disabled={Boolean(text.trim())} onClick={() => void capture?.start('audio')}>Callback: начать аудио</FOSAction>
    <FOSAction disabled={Boolean(text.trim())} onClick={() => void capture?.start('video')}>Callback: начать видео</FOSAction>
    <MessageThread messages={messages} ownActor="tester"><MessageComposer capture={capture} text={text} onTextChange={setText} onSubmit={async (draft,id) => { setMessages(current => current.some(message => message.id === id) ? current : [...current,{ ...draft,id,actor:'tester',author:'Локальный тест',time:'Демосессия',local:true }]) }} /></MessageThread>
  </section>
}
