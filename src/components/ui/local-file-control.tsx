import { useRef, type ReactNode } from 'react'

/** Native selection/drop only. Caller renders its Figma composition and owns selected metadata. */
export function LocalFileControl({ label, disabled = false, onFile, children, className, state }: {
  label: string; disabled?: boolean; onFile: (file: File) => void; children: (open: () => void) => ReactNode; className?: string; state?: string
}) {
  const input = useRef<HTMLInputElement>(null)
  function select(file?: File) { if (file && !disabled) onFile(file) }
  return <div className={className} data-state={state} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); select(event.dataTransfer.files[0]) }}>
    <input ref={input} hidden type="file" aria-label={label} disabled={disabled} onChange={event => { select(event.target.files?.[0]); event.target.value = '' }} />
    {children(() => input.current?.click())}
  </div>
}
