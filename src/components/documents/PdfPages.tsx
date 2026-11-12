import { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions, type PDFDocumentLoadingTask, type RenderTask } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl

/** Render only page content, never annotations/actions/embedded scripts or file-supplied HTML. */
export default function PdfPages({ file, onCount }: { file: File; onCount: (count: number) => void }) {
  const host = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(''), [loading, setLoading] = useState(true)
  useEffect(() => {
    let disposed = false, loadingTask: PDFDocumentLoadingTask | undefined, renderTask: RenderTask | undefined
    setError(''); setLoading(true)
    async function load() {
      try {
        const bytes = new Uint8Array(await file.arrayBuffer())
        if (disposed) return
        if (new TextDecoder().decode(bytes.slice(0,5)) !== '%PDF-') throw new Error('Invalid PDF')
        loadingTask = getDocument({ data: bytes, enableXfa: false, stopAtErrors: true })
        const pdf = await loadingTask.promise
        if (disposed) return
        onCount(pdf.numPages)
        for (let number = 1; number <= pdf.numPages; number++) {
          const page = await pdf.getPage(number)
          if (disposed) return
          const canvas = document.createElement('canvas'), viewport = page.getViewport({ scale: 1.5 })
          canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height)
          canvas.setAttribute('role','img'); canvas.setAttribute('aria-label',`Страница ${number}`)
          host.current?.append(canvas)
          const context = canvas.getContext('2d')
          if (!context) throw new Error('Canvas unavailable')
          renderTask = page.render({ canvas, canvasContext: context, viewport })
          await renderTask.promise
          const content = await page.getTextContent()
          if (disposed) return
          const alternative = document.createElement('p')
          alternative.className = 'fos-sr-only'
          alternative.textContent = content.items.map(item => 'str' in item ? item.str : '').join(' ')
          host.current?.append(alternative)
          page.cleanup()
        }
        if (!disposed) setLoading(false)
      } catch { if (!disposed) { setError('Не удалось открыть PDF. Документ повреждён, защищён или не поддерживается.'); setLoading(false) } }
    }
    void load()
    const root = host.current
    return () => { disposed = true; renderTask?.cancel(); void loadingTask?.destroy(); root?.replaceChildren() }
  }, [file, onCount])
  return <>{loading && <p role="status">Открываем PDF…</p>}{error && <p role="alert">{error}</p>}<div ref={host} className="fos-pdf-pages" /></>
}
