export type CaptureKind = 'audio' | 'video'
export interface CaptureState { phase: 'idle' | 'requesting' | 'recording' | 'ready' | 'error'; kind: CaptureKind; startedAt?: number; file?: File; error?: string }

/** Browser capture lifecycle. No upload, gesture policy or numeric recording limits. */
export class MediaCapture {
  private state: CaptureState = { phase: 'idle', kind: 'audio' }
  private listeners = new Set<() => void>()
  private recorder?: MediaRecorder
  private stream?: MediaStream
  private generation = 0
  private disposed = false
  constructor(private devices: Pick<MediaDevices,'getUserMedia'> | undefined = navigator.mediaDevices) {}
  read = () => this.state
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  private update(state: CaptureState) { this.state = state; for (const listener of [...this.listeners]) listener() }
  private release() { this.stream?.getTracks().forEach(track => track.stop()); this.stream = undefined }
  async start(kind: CaptureKind) {
    if (this.disposed || this.state.phase === 'requesting' || this.state.phase === 'recording') return
    const generation = ++this.generation
    this.update({ phase: 'requesting',kind })
    if (!this.devices?.getUserMedia || typeof MediaRecorder === 'undefined') { this.update({ phase: 'error',kind,error: 'Запись не поддерживается. Введите текст или выберите файл.' }); return }
    try {
      const stream = await this.devices.getUserMedia({ audio: true, video: kind === 'video' })
      if (generation !== this.generation || this.disposed) { stream.getTracks().forEach(track => track.stop()); return }
      this.stream = stream
      // Runtime codec negotiation, not a production file-policy allowlist (D04).
      const candidates = kind === 'audio' ? ['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4'] : ['video/webm','video/mp4']
      const mimeType = candidates.find(type => MediaRecorder.isTypeSupported(type))
      if (!mimeType) { this.release(); this.update({phase:'error',kind,error:'Этот формат записи не поддерживается. Введите текст или выберите файл.'}); return }
      const recorder = new MediaRecorder(stream,{mimeType}), chunks: Blob[] = []
      this.recorder = recorder
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data) }
      recorder.onerror = () => { if (generation !== this.generation) return; this.cancel(); this.update({ phase: 'error',kind,error: 'Запись прервана. Повторите попытку или выберите файл.' }) }
      recorder.onstop = () => {
        if (generation !== this.generation || this.disposed) return
        this.release()
        const blob = new Blob(chunks,{ type: recorder.mimeType })
        if (!blob.size) { this.update({ phase: 'error',kind,error: 'Запись пуста. Повторите попытку.' }); return }
        const extension = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('ogg') ? 'ogg' : 'webm'
        this.update({ phase: 'ready',kind,file: new File([blob],`local-${kind}.${extension}`,{ type: blob.type }) })
      }
      for (const track of stream.getTracks()) track.onended = () => {
        if (generation === this.generation && this.state.phase === 'recording') { this.cancel(); this.update({ phase: 'error',kind,error: 'Устройство отключено. Запись остановлена.' }) }
      }
      recorder.start()
      this.update({ phase: 'recording',kind,startedAt: Date.now() })
    } catch (reason) {
      if (generation !== this.generation || this.disposed) return
      this.release()
      const name = reason instanceof DOMException ? reason.name : ''
      this.update({ phase: 'error',kind,error: name === 'NotAllowedError' ? 'Доступ к микрофону или камере запрещён. Можно ввести текст или выбрать файл.' : name === 'NotFoundError' ? 'Микрофон или камера не найдены.' : 'Не удалось начать запись. Введите текст или выберите файл.' })
    }
  }
  stop(): Promise<void> {
    const recorder = this.recorder
    if (!recorder || recorder.state === 'inactive') return Promise.resolve()
    return new Promise(resolve => {
      recorder.addEventListener('stop',() => resolve(),{ once: true })
      recorder.stop()
      // Dataavailable/stop deliver the completed Blob after capture has stopped.
      this.release()
    })
  }
  cancel = () => {
    ++this.generation
    if (this.recorder && this.recorder.state !== 'inactive') this.recorder.stop()
    this.release(); this.recorder = undefined
    this.update({ phase: 'idle',kind: this.state.kind })
  }
  dispose() { this.disposed = true; this.cancel(); this.listeners.clear() }
}
