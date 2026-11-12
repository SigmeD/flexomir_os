import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { LocalFileControl } from '@/components/ui/local-file-control'
import sendIcon from '@/assets/messaging/send.svg'
import attachIcon from '@/assets/messaging/attach.svg'
import micIcon from '@/assets/messaging/microphone.svg'
import videoIcon from '@/assets/messaging/video.svg'
import stopIcon from '@/assets/messaging/stop.svg'
import closeIcon from '@/assets/messaging/close.svg'
import type { MediaCapture, CaptureState } from './media-capture'
import { PreparedMedia } from './PreparedMedia'
import { hasMessage, type MessageDraft } from './message-model'
import './messaging.css'

/** Shared 3388:3329. Host owns context, validation and delivery. D03 recording gesture is gated. */
const idleCapture: CaptureState = { phase: 'idle', kind: 'audio' }
const noCapture = () => idleCapture
const noSubscription = () => () => {}
export function MessageComposer({ text, onTextChange, onSubmit, canSubmit = true, readOnly = false, label = 'Сообщение', placeholder = 'Сообщение…', allowFiles = true, submitLabel = 'Отправить сообщение локально', error: hostError, clearOnSuccess = true, capture, attachment, onAttachmentChange, requiredText = false, onBlur }: {
  text: string; onTextChange: (text: string) => void
  onSubmit: (draft: MessageDraft, operationId: string) => Promise<void>
  canSubmit?: boolean; readOnly?: boolean; label?: string; placeholder?: string; allowFiles?: boolean; submitLabel?: string; error?: string; clearOnSuccess?: boolean
  /** Isolated callback pilot only until D03 approves the product recording gesture. */
  capture?: MediaCapture
  attachment?: File; onAttachmentChange?: (file?: File) => void
  requiredText?: boolean; onBlur?: () => void
}) {
  const id = useId(), input = useRef<HTMLTextAreaElement>(null)
  const [internalFile, setInternalFile] = useState<File>()
  const file = onAttachmentChange ? attachment : internalFile
  const setFile = onAttachmentChange ?? setInternalFile
  const [mode, setMode] = useState<'audio' | 'video'>('audio')
  const [pending, setPending] = useState(false), [error, setError] = useState('')
  const busy = useRef(false), operation = useRef<string | undefined>(undefined)
  const recording = useSyncExternalStore(capture?.subscribe ?? noSubscription,capture?.read ?? noCapture)
  const active = recording.phase === 'recording' || recording.phase === 'requesting'
  const prepared = recording.phase === 'ready' ? recording.file : undefined
  const [elapsed,setElapsed] = useState(0)
  useEffect(() => {
    if (!active) return
    setMode(recording.kind); setElapsed(0)
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - (recording.startedAt ?? Date.now()))/1000)),500)
    return () => clearInterval(timer)
  },[active,recording.kind,recording.startedAt])
  useEffect(() => {
    if (!capture) return
    const hide = () => { if (document.hidden) capture.cancel() }
    document.addEventListener('visibilitychange',hide)
    return () => { document.removeEventListener('visibilitychange',hide); capture.cancel() }
  },[capture])
  useEffect(() => { if (readOnly) capture?.cancel() },[readOnly,capture])
  const payload = { text, file: prepared ?? file }, ready = hasMessage(payload)
  useLayoutEffect(() => { const el = input.current; if (el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 200) + 'px' } }, [text])
  function change(next: string) { operation.current = undefined; setError(''); onTextChange(next) }
  async function submit() {
    if (busy.current || active || readOnly || !canSubmit || !ready) return
    busy.current = true; setPending(true); setError('')
    operation.current ??= crypto.randomUUID()
    try { await onSubmit(payload, operation.current); if (clearOnSuccess) onTextChange(''); setFile(undefined); capture?.cancel(); operation.current = undefined }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Не удалось отправить. Повторите попытку.') }
    finally { busy.current = false; setPending(false); input.current?.focus() }
  }
  const displayedError = error || hostError || recording.error
  return <div className="fos-message-input" data-testid="message-composer" data-state={pending ? 'Sending' : displayedError ? 'Error' : active ? recording.kind === 'video' ? 'VideoRecording' : 'AudioRecording' : prepared ? recording.kind === 'video' ? 'VideoReady' : 'AudioReady' : file ? 'FileReady' : ready ? 'Text' : mode === 'video' ? 'EmptyVideo' : 'Empty'}>
    <div className="fos-message-composer" aria-busy={pending}>
      {active || prepared ? <FosButtonRoot family="utility" type="button" className="fos-message-action" disabled={pending || readOnly} aria-label="Удалить запись" onClick={() => capture?.cancel()}><img src={closeIcon} alt="" /></FosButtonRoot> : <LocalFileControl label="Прикрепить файл к сообщению" disabled={readOnly || pending || !allowFiles} onFile={selected => {
        if (!selected.size) { setError('Файл пуст. Выберите другой файл.'); return }
        operation.current = undefined; setFile(selected); setError('')
      }}>{open => <FosButtonRoot family="utility" type="button" className="fos-message-action" aria-label="Прикрепить файл" disabled={readOnly || pending || !allowFiles} onClick={open}><img src={attachIcon} alt="" /></FosButtonRoot>}</LocalFileControl>}
      {active ? <p className="fos-recording-status" role="status">{recording.phase === 'requesting' ? 'Ожидаем разрешение…' : `Запись ${recording.kind === 'video' ? 'видео' : 'голоса'} · ${elapsed} с`}</p>
        : prepared ? <PreparedMedia file={prepared} /> : <textarea ref={input} id={id} rows={1} aria-label={label} placeholder={placeholder} value={text} readOnly={readOnly || pending} required={requiredText} onBlur={onBlur}
        aria-describedby={displayedError ? id + '-error' : undefined} onChange={event => change(event.target.value)} />}
      {active ? <FosButtonRoot family="utility" type="button" className="fos-message-action" aria-label="Остановить запись" disabled={recording.phase === 'requesting'} onClick={() => void capture?.stop()}><img src={stopIcon} alt="" /></FosButtonRoot> : ready || pending ? <FosButtonRoot family="utility" className="fos-message-action" type="button" aria-label={submitLabel} disabled={readOnly || pending || !canSubmit || !ready} onClick={() => void submit()}><img src={sendIcon} alt="" /></FosButtonRoot>
        : <FosButtonRoot family="utility" className="fos-message-action" type="button" aria-label={mode === 'audio' ? 'Переключить на видео' : 'Переключить на голос'} disabled={readOnly || pending} onClick={() => setMode(current => current === 'audio' ? 'video' : 'audio')} title="Переключить режим; запись пока недоступна"><img src={mode === 'audio' ? micIcon : videoIcon} alt="" /></FosButtonRoot>}
    </div>
    {file && <div className="fos-message-prepared"><span>{file.name} · выбран локально</span><FosButtonRoot family="utility" type="button" disabled={pending || readOnly} onClick={() => { setFile(undefined); operation.current = undefined }} aria-label="Убрать вложение">×</FosButtonRoot></div>}
    {pending && <p className="fos-message-meta" role="status">Отправка…</p>}
    {displayedError && <p id={id + '-error'} className="fos-field__error" role="alert">{displayedError}</p>}
  </div>
}
