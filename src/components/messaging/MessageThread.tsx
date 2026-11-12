import { useEffect, useState, type ReactNode } from 'react'
import type { ConversationMessage } from './message-model'
import './messaging.css'

function MessageAttachment({ file }: { file: File }) {
  const [url, setUrl] = useState('')
  useEffect(() => { const next = URL.createObjectURL(file); setUrl(next); return () => URL.revokeObjectURL(next) }, [file])
  if (file.type.startsWith('audio/')) return <audio controls src={url || undefined} aria-label={file.name} />
  if (file.type.startsWith('video/')) return <video controls src={url || undefined} aria-label={file.name} />
  return <a href={url} download={file.name}>{file.name}</a>
}
export function MessageThread({ messages, ownActor, children, showHistory = true }: { messages: readonly ConversationMessage[]; ownActor: string; children?: ReactNode; showHistory?: boolean }) {
  return <div className="fos-comments">
    {showHistory && messages.length > 0 && <div className="fos-message-thread" data-testid="message-thread" role="log" aria-label="История сообщений">{messages.map(message => <article key={message.id} className="fos-message" data-own={message.actor === ownActor}>
      <p className="fos-message-author">{message.author}</p><div className="fos-message-surface"><p>{message.text}</p>{message.file && <MessageAttachment file={message.file} />}<small>{message.time}{message.local ? ' · Только в демосессии' : ''}</small></div>
    </article>)}</div>}
    {children}
  </div>
}
