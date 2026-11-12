/** UI-only payload. Files remain in memory; this is not a server DTO. */
export interface MessageDraft { text: string; file?: File }
export interface ConversationMessage extends MessageDraft {
  id: string
  author: string
  actor: string
  time: string
  local?: boolean
  /** Local receipt/capability fixtures; real values must come from the agreed API. */
  readBy?: readonly string[]
  locked?: boolean
}
export type ConversationPhase = 'open' | 'work' | 'readonly'
export function messageMutationReason(message: ConversationMessage, actor: string, phase: ConversationPhase = 'open') {
  if (message.actor !== actor) return 'Изменять можно только свои сообщения'
  if (phase === 'readonly') return 'Переписка доступна только для чтения'
  if (message.locked) return 'Сообщение зафиксировано при переходе заказа в работу'
  if (message.readBy?.some(reader => reader !== actor)) return 'Сообщение уже прочитано другим участником'
  return undefined
}
export const hasMessage = (draft: MessageDraft) => Boolean(draft.text.trim() || draft.file?.size)

/** One adapter per company/object. Explicit acknowledgement is local, never server delivery. */
export function createLocalConversation(seed: readonly ConversationMessage[] = []) {
  let messages = [...seed]
  const listeners = new Set<() => void>()
  const versions = new Map<string,number>()
  let phase: ConversationPhase = 'open'
  const notify = () => { for (const listener of [...listeners]) listener() }
  const changed = (actor: string) => { versions.set(actor,(versions.get(actor) ?? 0)+1); notify() }
  function mutable(id: string, actor: string) {
    const message = messages.find(message => message.id === id)
    if (!message) throw new Error('Сообщение не найдено')
    const reason = messageMutationReason(message,actor,phase)
    if (reason) throw new Error(reason)
    return message
  }
  return {
    read: () => messages,
    version: (actor: string) => versions.get(actor) ?? 0,
    mutationReason: (message: ConversationMessage, actor: string) => messageMutationReason(message,actor,phase),
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
    setPhase(next: ConversationPhase) {
      if (next === phase) return
      phase = next
      // Freeze the existing set ONCE, not every render/reopen. New Work messages stay editable until read.
      messages = next === 'work' ? messages.map(message => ({ ...message, locked: true })) : [...messages]
      notify()
    },
    markRead(ids: readonly string[], actor: string) {
      if (!actor) return
      let changed = false
      const next = messages.map(message => {
        if (!ids.includes(message.id) || message.actor === actor || message.readBy?.includes(actor)) return message
        changed = true
        return { ...message, readBy: [...(message.readBy ?? []),actor] }
      })
      if (changed) { messages = next; notify() }
    },
    async update(id: string, draft: MessageDraft, actor: string) {
      mutable(id,actor) // Recheck at commit, including a read/status event received after opening the editor.
      if (!hasMessage(draft)) throw new Error('Добавьте текст или непустой файл')
      messages = messages.map(message => message.id === id ? { ...message, text: draft.text.trim(), file: draft.file } : message)
      changed(actor)
      return messages
    },
    async remove(id: string, actor: string) {
      mutable(id,actor)
      messages = messages.filter(message => message.id !== id)
      changed(actor)
      return messages
    },
    async submit(id: string, draft: MessageDraft, actor: string, author: string) {
      if (!hasMessage(draft)) throw new Error('Добавьте текст или непустой файл')
      if (messages.some(message => message.id === id)) return messages
      if (phase === 'readonly') throw new Error('Переписка доступна только для чтения')
      messages = [...messages, {
        text: draft.text.trim(), file: draft.file, id, actor, author, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }), local: true, readBy: [],
      }]
      changed(actor)
      return messages
    },
  }
}
