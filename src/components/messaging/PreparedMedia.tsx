import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { useEffect, useRef, useState } from 'react'
import play from '@/assets/messaging/play.svg'

export function PreparedMedia({ file }: { file: File }) {
  const [url,setUrl] = useState(''), [error,setError] = useState('')
  const audio = useRef<HTMLAudioElement>(null)
  useEffect(() => { const next = URL.createObjectURL(file); setUrl(next); setError(''); return () => URL.revokeObjectURL(next) },[file])
  return <div className="fos-message-media">
    {file.type.startsWith('video/') ? <video src={url || undefined} controls aria-label="Просмотр записи" onError={() => setError('Не удалось воспроизвести запись в этом браузере.')} />
      : <><FosButtonRoot family="utility" type="button" className="fos-message-action" aria-label="Прослушать запись" onClick={() => { void audio.current?.play().catch(() => setError('Не удалось воспроизвести запись.')) }}><img src={play} alt="" /></FosButtonRoot><span>Голосовое</span><audio ref={audio} src={url || undefined} onError={() => setError('Не удалось воспроизвести запись в этом браузере.')} /></>}
    {error && <p role="alert">{error}</p>}
  </div>
}
