import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState, useSyncExternalStore, type Ref } from 'react'
import { LocalFileControl } from '@/components/ui/local-file-control'
import sendIcon from '@/assets/messaging/send.svg'
import attachIcon from '@/assets/messaging/attach.svg'
import closeIcon from '@/assets/messaging/close.svg'
import saveIcon from '@/assets/orders/save.svg'
import { MediaCapture, type CaptureState } from './media-capture'
import { RecordButton } from './RecordButton'
import { PreparedMedia } from './PreparedMedia'
import { hasMessage, type MessageDraft } from './message-model'
import './messaging.css'

/** Shared 3388:3329. Host owns context, validation and delivery. Owner approved hold gesture. */
const idleCapture: CaptureState = { phase: 'idle', kind: 'audio' }
const noCapture = () => idleCapture
const noSubscription = () => () => {}
export interface MessageComposerHandle { submit: () => Promise<boolean> }
export function MessageComposer({ text, onTextChange, onSubmit, canSubmit = true, readOnly = false, label = 'Сообщение', placeholder = 'Сообщение…', allowFiles = true, submitLabel = 'Отправить сообщение локально', error: hostError, clearOnSuccess = true, capture: suppliedCapture, attachment, onAttachmentChange, recordingDraft, onRecordingDraftChange, requiredText = false, onBlur, ref, intent = 'send', autoFocus = false, onBusyChange }: {
  text: string; onTextChange: (text: string) => void
  onSubmit: (draft: MessageDraft, operationId: string) => Promise<void>
  canSubmit?: boolean; readOnly?: boolean; label?: string; placeholder?: string; allowFiles?: boolean; submitLabel?: string; error?: string; clearOnSuccess?: boolean
  /** Optional controller injection for the isolated lifecycle harness. */
  capture?: MediaCapture
  attachment?: File; onAttachmentChange?: (file?: File) => void
  /** Host keeps the original prepared File private to its context and actor. */
  recordingDraft?: File; onRecordingDraftChange?: (file?: File) => void
  requiredText?: boolean; onBlur?: () => void
  ref?: Ref<MessageComposerHandle>; intent?: 'send' | 'save'; autoFocus?: boolean; onBusyChange?: (busy: boolean) => void
}) {
  const id = useId(), input = useRef<HTMLTextAreaElement>(null)
  const [ownedCapture, setOwnedCapture] = useState<MediaCapture>()
  const initialRecording = useRef(recordingDraft)
  const capture = suppliedCapture ?? ownedCapture
  const [keyboardFocus, setKeyboardFocus] = useState(true)
  useEffect(() => {
    if (suppliedCapture) return
    const next = new MediaCapture()
    if (initialRecording.current) next.restore(initialRecording.current)
    setOwnedCapture(next)
    return () => next.dispose()
  }, [suppliedCapture])
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'Tab') setKeyboardFocus(true) }
    const pointer = () => setKeyboardFocus(false)
    document.addEventListener('keydown', keyboard, true); document.addEventListener('pointerdown', pointer, true)
    return () => { document.removeEventListener('keydown', keyboard, true); document.removeEventListener('pointerdown', pointer, true) }
  }, [])
  const [internalFile, setInternalFile] = useState<File>()
  const file = onAttachmentChange ? attachment : internalFile
  const setFile = onAttachmentChange ?? setInternalFile
  const [mode, setMode] = useState<'audio' | 'video'>('audio')
  const [pending, setPending] = useState(false), [error, setError] = useState('')
  const busy = useRef(false), operation = useRef<string | undefined>(undefined)
  const recording = useSyncExternalStore(capture?.subscribe ?? noSubscription,capture?.read ?? noCapture)
  const active = recording.phase === 'recording' || recording.phase === 'requesting'
  useEffect(() => { onBusyChange?.(pending || active) },[pending,active,onBusyChange])
  useEffect(() => () => onBusyChange?.(false),[onBusyChange])
  const prepared = recording.phase === 'ready' ? recording.file : undefined
  useEffect(() => {
    if (!capture) return
    if (recording.phase === 'ready') onRecordingDraftChange?.(recording.file)
    else if (recording.phase === 'idle') onRecordingDraftChange?.(undefined)
  }, [capture,recording.phase,recording.file,onRecordingDraftChange])
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
    if (busy.current || active || readOnly || !canSubmit || !ready) return false
    busy.current = true; setPending(true); setError('')
    operation.current ??= crypto.randomUUID()
    try { await onSubmit(payload, operation.current); if (clearOnSuccess) onTextChange(''); setFile(undefined); onRecordingDraftChange?.(undefined); capture?.cancel(); operation.current = undefined; return true }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Не удалось отправить. Повторите попытку.'); return false }
    finally { busy.current = false; setPending(false); input.current?.focus() }
  }
  useImperativeHandle(ref, () => ({submit}))
  const displayedError = error || hostError || recording.error
  return <div className="fos-message-input" data-testid="message-composer" data-keyboard-focus={keyboardFocus || undefined} data-state={pending ? 'Sending' : displayedError ? 'Error' : active ? recording.kind === 'video' ? 'VideoRecording' : 'AudioRecording' : prepared ? recording.kind === 'video' ? 'VideoReady' : 'AudioReady' : file ? 'FileReady' : ready ? 'Text' : mode === 'video' ? 'EmptyVideo' : 'Empty'}>
    <div className="fos-message-composer" aria-busy={pending}>
      {active || prepared ? <FosButtonRoot family="utility" type="button" className="fos-message-action" disabled={pending || readOnly} aria-label="Удалить запись" onClick={() => capture?.cancel()}><img src={closeIcon} alt="" /></FosButtonRoot> : <LocalFileControl label="Прикрепить файл к сообщению" disabled={readOnly || pending || !allowFiles} onFile={selected => {
        if (!selected.size) { setError('Файл пуст. Выберите другой файл.'); return }
        operation.current = undefined; setFile(selected); setError('')
      }}>{open => <FosButtonRoot family="utility" type="button" className="fos-message-action" aria-label="Прикрепить файл" disabled={readOnly || pending || !allowFiles} onClick={open}><img src={attachIcon} alt="" /></FosButtonRoot>}</LocalFileControl>}
      {active ? <p className="fos-recording-status" role="status">{recording.phase === 'requesting' ? 'Ожидаем разрешение…' : `Запись ${recording.kind === 'video' ? 'видео' : 'голоса'} · ${elapsed} с`}</p>
        : prepared && !requiredText ? <PreparedMedia file={prepared} /> : <textarea autoFocus={autoFocus} ref={input} id={id} rows={1} aria-label={label} placeholder={placeholder} value={text} readOnly={readOnly || pending} required={requiredText} onBlur={onBlur}
        aria-describedby={displayedError ? id + '-error' : undefined} onChange={event => change(event.target.value)} />}
      {active || (!ready && !pending) ? <RecordButton capture={capture} mode={mode} onModeChange={setMode} state={recording} disabled={readOnly || pending} />
        : <FosButtonRoot family="utility" className="fos-message-action" type="button" aria-label={submitLabel} disabled={readOnly || pending || !canSubmit || !ready} onClick={() => void submit()}><img src={intent === 'save' ? saveIcon : sendIcon} alt="" /></FosButtonRoot>}
    </div>
    {prepared && requiredText && <div className="fos-message-prepared"><PreparedMedia file={prepared} /></div>}
    {file && <div className="fos-message-prepared"><span>{file.name} · выбран локально</span><FosButtonRoot family="utility" type="button" disabled={pending || readOnly} onClick={() => { setFile(undefined); operation.current = undefined }} aria-label="Убрать вложение">×</FosButtonRoot></div>}
    {pending && <p className="fos-message-meta" role="status">Отправка…</p>}
    {displayedError && <p id={id + '-error'} className="fos-field__error" role="alert">{displayedError}</p>}
  </div>
}
