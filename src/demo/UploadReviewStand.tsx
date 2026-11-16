import { useState } from 'react'
import { ArtworkSource } from '@/components/orders/ArtworkSource'
import { LayoutUploadPanel } from '@/components/layouts/LayoutUploadForm'
import { FileDropzone } from '@/components/documents/FileDropzone'
import { FOSAction } from '@/components/ui/fos-controls'
import './upload-review-stand.css'

type DemoState = 'empty' | 'selected' | 'error'
type UploadKind = 'artwork' | 'layout' | 'signed'
type ArtworkValue = { artworkMode: 'UPLOAD' | 'LIBRARY' | 'HELP'; fileName: string; layoutId?: string; layoutName?: string; unavailableArtwork?: string }

const examples: Record<UploadKind, string> = {
  artwork: 'Этикетка_100x150.pdf',
  layout: 'Исходник_этикетки.ai',
  signed: 'Подписной_бланк.pdf',
}
const kinds: { id: UploadKind; title: string; context: string; figma: string }[] = [
  { id: 'artwork', title: 'Макет позиции', context: 'Заказ · Client / Manager', figma: '634:445' },
  { id: 'layout', title: 'Исходный файл макета', context: 'Библиотека макетов', figma: '1438:474' },
  { id: 'signed', title: 'Подписной бланк', context: 'Документы заказа', figma: '3391:3551' },
]

/** DEV-only visual comparison. Product components and their file-selection behavior stay untouched. */
export function UploadReviewStand() {
  const [state, setState] = useState<DemoState>('empty')
  const [files, setFiles] = useState<Partial<Record<UploadKind, string>>>({})
  const [artwork, setArtwork] = useState<ArtworkValue>({ artworkMode: 'UPLOAD', fileName: '' })

  function selectFile(kind: UploadKind, file: File) {
    setFiles(current => ({ ...current, [kind]: file.name }))
    if (kind === 'artwork') setArtwork({ artworkMode: 'UPLOAD', fileName: file.name })
    setState('selected')
  }

  function renderUpload(kind: UploadKind) {
    const name = state === 'selected' ? files[kind] || examples[kind] : ''
    const error = state === 'error' ? 'Пример ошибки выбора файла' : undefined
    if (kind === 'artwork') {
      const value: ArtworkValue = state === 'selected'
        ? (artwork.fileName || artwork.artworkMode === 'LIBRARY' ? artwork : { artworkMode: 'UPLOAD', fileName: name })
        : state === 'empty' && artwork.artworkMode === 'HELP' ? artwork : { artworkMode: 'UPLOAD', fileName: '' }
      return <ArtworkSource value={value} onChange={next => {
        setArtwork(next)
        if (next.artworkMode === 'UPLOAD') setFiles(current => ({ ...current, artwork: next.fileName }))
        setState(next.artworkMode === 'HELP' || next.fileName === '' && next.artworkMode === 'UPLOAD' ? 'empty' : 'selected')
      }} error={error} onOpenLibrary={() => { setArtwork({ artworkMode: 'LIBRARY', fileName: '', layoutId: 'demo-layout', layoutName: 'Этикетка 100×150' }); setState('selected') }} />
    }
    if (kind === 'layout') return <LayoutUploadPanel fileName={name} error={error} onFile={file => selectFile(kind, file)} />
    return <>
      <div className="ua03-stand__signed-label">Подписные бланки</div>
      <FileDropzone disabled={false} onFile={file => selectFile(kind, file)} />
      {state === 'selected' && <p className="ua03-stand__note">Выбран локально: {name}. В продукте файл показывается отдельной строкой документов.</p>}
      {state === 'error' && <p className="ua03-stand__note">У FileDropzone пока нет собственного error-варианта. Стенд его не имитирует.</p>}
    </>
  }

  return <main className="ua03-stand">
    <header className="ua03-stand__header">
      <div className="ua03-stand__eyebrow">M8 / UA-03 · DEV стенд</div>
      <h1>Единая роль загрузки</h1>
      <p>Сравнение действующих React-компонентов с кандидатом общей визуальной основы. Выбор файла остаётся локальным; серверная загрузка и ограничения форматов здесь не моделируются.</p>
      <nav aria-label="Источники дизайна" className="ua03-stand__sources">
        {kinds.map(kind => <a key={kind.id} href={`https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=${kind.figma.replace(':', '-')}`} target="_blank" rel="noreferrer">Figma {kind.figma}</a>)}
      </nav>
    </header>

    <div className="ua03-stand__controls" role="group" aria-label="Состояние для сравнения">
      {([['empty', 'Пусто'], ['selected', 'Выбран локально'], ['error', 'Ошибка']] as const).map(([id, label]) =>
        <FOSAction key={id} size="compact" hierarchy={state === id ? 'primary' : 'secondary'} aria-pressed={state === id} onClick={() => { if (id !== 'selected') setArtwork({ artworkMode: 'UPLOAD', fileName: '' }); setState(id) }}>{label}</FOSAction>)}
      <FOSAction size="compact" hierarchy="tertiary" onClick={() => { setFiles({}); setArtwork({ artworkMode: 'UPLOAD', fileName: '' }); setState('empty') }}>Сбросить демо</FOSAction>
    </div>

    <div className="ua03-stand__legend" aria-hidden="true"><span>Как сейчас</span><span>Кандидат общей основы</span></div>
    {kinds.map(kind => <section className="ua03-stand__case" key={kind.id} aria-labelledby={`ua03-${kind.id}`}>
      <div className="ua03-stand__case-head"><div><h2 id={`ua03-${kind.id}`}>{kind.title}</h2><p>{kind.context}</p></div><span>Figma {kind.figma}</span></div>
      <div className="ua03-stand__comparison">
        <div className="ua03-stand__sample" data-presentation="current"><p className="ua03-stand__sample-title">Как сейчас</p>{renderUpload(kind.id)}</div>
        <div className="ua03-stand__sample" data-presentation="candidate"><p className="ua03-stand__sample-title">Кандидат</p>{renderUpload(kind.id)}</div>
      </div>
    </section>)}
    <footer className="ua03-stand__footer">Для согласования: одинаковые ли зона выбора, кнопка, отступы и подсказки в пустом и ошибочном состояниях? Действия «Мои макеты»/«Нужна помощь», карточка выбранного файла библиотеки и строки подписных документов сохраняют свои сценарии.</footer>
  </main>
}
