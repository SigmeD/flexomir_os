import { useEffect, useState, useSyncExternalStore } from 'react'
import { MediaCapture } from './media-capture'
import { MessageComposer } from './MessageComposer'
import { MessageThread } from './MessageThread'
import { createLocalConversation } from './message-model'
import { FOSAction } from '@/components/ui/fos-controls'

/** Isolated callbacks remain available for lifecycle checks alongside the approved hold gesture. */
export function MediaCapturePilot() {
  const [capture,setCapture] = useState<MediaCapture>(), [text,setText] = useState(''), [adapter]=useState(()=>createLocalConversation())
  const messages=useSyncExternalStore(adapter.subscribe,adapter.read)
  useEffect(() => { const next = new MediaCapture(); setCapture(next); return () => next.dispose() },[])
  return <section className="fos-media-pilot" aria-label="Изолированные callbacks записи">
    <h2>Запись · локальная проверка</h2><p>Проверка записи через callbacks или удержание кнопки. Файл не отправляется на сервер.</p>
    <FOSAction disabled={Boolean(text.trim())} onClick={() => void capture?.start('audio')}>Callback: начать аудио</FOSAction>
    <FOSAction disabled={Boolean(text.trim())} onClick={() => void capture?.start('video')}>Callback: начать видео</FOSAction>
    <MessageThread messages={messages} ownActor="tester" actions={{update:(id,draft)=>adapter.update(id,draft,'tester'),remove:id=>adapter.remove(id,'tester'),reason:message=>adapter.mutationReason(message,'tester'),read:ids=>adapter.markRead(ids,'tester')}}><MessageComposer capture={capture} text={text} onTextChange={setText} onSubmit={async (draft,id) => { await adapter.submit(id,draft,'tester','Локальный тест') }} /></MessageThread>
  </section>
}
