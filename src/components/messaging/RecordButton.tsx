import { useEffect, useRef } from 'react'
import { FosButtonRoot } from '@/components/ui/fos-button-root'
import type { CaptureKind, CaptureState, MediaCapture } from './media-capture'
import micIcon from '@/assets/messaging/microphone.svg'
import videoIcon from '@/assets/messaging/video.svg'
import stopIcon from '@/assets/messaging/stop.svg'

const HOLD_DELAY_MS = 300
type Hold = { source: number | string; timer: ReturnType<typeof setTimeout>; started: boolean }

/** Owner: tap switches mode; hold captures; release prepares, never sends. */
export function RecordButton({ capture, mode, onModeChange, state, disabled }: {
  capture?: MediaCapture; mode: CaptureKind; onModeChange: (mode: CaptureKind) => void; state: CaptureState; disabled: boolean
}) {
  const hold = useRef<Hold>(undefined), suppressClick = useRef(false)
  const active = state.phase === 'requesting' || state.phase === 'recording'
  function abort() {
    if (hold.current) { clearTimeout(hold.current.timer); hold.current = undefined; suppressClick.current = true }
    if (capture?.read().phase === 'recording' || capture?.read().phase === 'requesting') capture.cancel()
  }
  useEffect(() => {
    const hidden = () => { if (document.hidden) abort() }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') abort() }
    window.addEventListener('blur', abort)
    document.addEventListener('visibilitychange', hidden)
    document.addEventListener('keydown', escape)
    return () => { window.removeEventListener('blur', abort); document.removeEventListener('visibilitychange', hidden); document.removeEventListener('keydown', escape); abort() }
  }, [capture])
  useEffect(() => { if (disabled) abort() }, [disabled])
  function begin(source: number | string) {
    if (disabled || !capture || hold.current || active) return
    suppressClick.current = false
    const next: Hold = { source, started: false, timer: setTimeout(() => {
      if (hold.current !== next) return
      next.started = true
      void capture.start(mode)
    }, HOLD_DELAY_MS) }
    hold.current = next
  }
  function finish(source: number | string) {
    const current = hold.current
    if (!current || current.source !== source) return undefined
    clearTimeout(current.timer); hold.current = undefined
    if (current.started) {
      suppressClick.current = true
      if (capture?.read().phase === 'requesting') capture.cancel()
      else if (capture?.read().phase === 'recording') void capture.stop()
    }
    return current.started
  }
  const toggle = () => onModeChange(mode === 'audio' ? 'video' : 'audio')
  return <FosButtonRoot family="utility" type="button" className="fos-message-action fos-record-button" data-mode={mode} data-recording={active || undefined}
    aria-label={active ? 'Остановить запись' : mode === 'audio' ? 'Переключить на видео; удерживать для записи голоса' : 'Переключить на голос; удерживать для записи видео'}
    title={active ? 'Отпустите, чтобы завершить запись' : 'Нажмите для смены режима, удерживайте для записи'} disabled={disabled}
    onPointerDown={event => {
      if (event.button !== 0 || !event.isPrimary) return
      event.currentTarget.focus({ preventScroll: true })
      begin(event.pointerId)
      try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* Synthetic/ended pointer has no native capture. */ }
    }}
    onPointerUp={event => { finish(event.pointerId) }}
    onPointerCancel={abort}
    onLostPointerCapture={event => { if (hold.current?.source === event.pointerId) abort() }}
    onContextMenu={event => event.preventDefault()}
    onKeyDown={event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); if (!event.repeat) begin(event.key) } }}
    onKeyUp={event => {
      if (event.key !== ' ' && event.key !== 'Enter') return
      event.preventDefault()
      const started = finish(event.key)
      if (started === false) toggle()
    }}
    onBlur={abort}
    onClick={() => {
      if (suppressClick.current) { suppressClick.current = false; return }
      if (active) { if (state.phase === 'requesting') capture?.cancel(); else void capture?.stop() }
      else toggle()
    }}>
    <span className="fos-record-glyphs" aria-hidden="true"><img draggable={false} data-record-icon="audio" src={micIcon} alt="" /><img draggable={false} data-record-icon="video" src={videoIcon} alt="" /><img draggable={false} data-record-icon="stop" src={stopIcon} alt="" /></span>
  </FosButtonRoot>
}
