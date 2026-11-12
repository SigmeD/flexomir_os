import { useRef, type ReactNode } from 'react'

/** Native selection/drop only. Caller renders its Figma composition and owns selected metadata. */
export function LocalFileControl({ label, disabled = false, onFile, children, className, state, clickable = false }: {
  label: string; disabled?: boolean; onFile: (file: File) => void; children: (open: () => void) => ReactNode; className?: string; state?: string
  clickable?: boolean
}) {
  const input = useRef<HTMLInputElement>(null)
  function select(file?: File) { if (file && !disabled) onFile(file) }
  return <div className={className} data-state={state} onClick={event => { if (clickable && !disabled && !(event.target as HTMLElement).closest('button,input,a,label')) input.current?.click() }} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); select(event.dataTransfer.files[0]) }}>
    <input ref={input} hidden type="file" aria-label={label} disabled={disabled} onChange={event => { select(event.target.files?.[0]); event.target.value = '' }} />
    {children(() => input.current?.click())}
  </div>
}
