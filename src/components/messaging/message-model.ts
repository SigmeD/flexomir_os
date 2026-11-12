/** UI-only payload. Files remain in memory; this is not a server DTO. */
export interface MessageDraft { text: string; file?: File }
export interface ConversationMessage extends MessageDraft {
  id: string
  author: string
  actor: string
  time: string
  local?: boolean
}
export const hasMessage = (draft: MessageDraft) => Boolean(draft.text.trim() || draft.file?.size)

/** One adapter per company/object. Explicit acknowledgement is local, never server delivery. */
export function createLocalConversation(seed: readonly ConversationMessage[] = []) {
  let messages = [...seed]
  const listeners = new Set<() => void>()
  return {
    read: () => messages,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
    async submit(id: string, draft: MessageDraft, actor: string, author: string) {
      if (!hasMessage(draft)) throw new Error('Добавьте текст или непустой файл')
      if (!messages.some(message => message.id === id)) messages = [...messages, {
        ...draft, text: draft.text.trim(), id, actor, author, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }), local: true,
      }]
      for (const listener of [...listeners]) listener()
      return messages
    },
  }
}
