import { useEffect, useRef, useState, type HTMLAttributes } from 'react'
import type { OverflowContextPoint } from '@/components/ui/overflow-menu'

export function useMessageContext() {
  const [selected,setSelected] = useState<{id:string;point:OverflowContextPoint} | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const origin = useRef<{x:number;y:number}>({x:0,y:0})
  const held = useRef(false)
  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = undefined }
  useEffect(() => clear,[])
  function bind(id: string): HTMLAttributes<HTMLElement> {
    return {
      onContextMenu:event=>{event.preventDefault();clear();setSelected({id,point:{x:event.clientX,y:event.clientY,opener:event.currentTarget}})},
      onKeyDown:event=>{
        if (event.key === 'ContextMenu' || event.key === 'F10' && event.shiftKey) {
          event.preventDefault();const box=event.currentTarget.getBoundingClientRect()
          setSelected({id,point:{x:box.left+Math.min(24,box.width),y:box.top+Math.min(24,box.height),opener:event.currentTarget}})
        }
      },
      onPointerDown:event=>{
        held.current=false;clear()
        if (event.pointerType !== 'touch' || !event.isPrimary || (event.target as HTMLElement).closest('button,a,audio,video,input,textarea')) return
        const opener=event.currentTarget,x=event.clientX,y=event.clientY;origin.current={x,y}
        timer.current=setTimeout(()=>{held.current=true;setSelected({id,point:{x,y,opener}})},500)
      },
      onPointerMove:event=>{if(Math.hypot(event.clientX-origin.current.x,event.clientY-origin.current.y)>10)clear()},
      onPointerUp:event=>{clear();if(held.current)event.preventDefault()},
      onPointerCancel:()=>{clear();if(held.current)setSelected(null)},
      onClickCapture:event=>{if(held.current){event.preventDefault();event.stopPropagation();held.current=false}},
    }
  }
  return {selected,bind,close:()=>setSelected(null)}
}
