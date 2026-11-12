import { createLocalConversation, type ConversationMessage } from './message-model'

const conversations = new Map<string, ReturnType<typeof createLocalConversation>>()
const drafts = new Map<string, string>()
const attachments = new Map<string, File>()
const recordings = new Map<string, File>()
export interface LocalDocument { id: string; file: File }
const documents = new Map<string, readonly LocalDocument[]>()
const emptyDocuments: readonly LocalDocument[] = []
const documentListeners = new Set<() => void>()
export function localConversation(context: string, seed: readonly ConversationMessage[] = []) {
  let adapter = conversations.get(context)
  if (!adapter) { adapter = createLocalConversation(seed); conversations.set(context, adapter) }
  return adapter
}
export const localDraft = (context: string, actor: string) => drafts.get(JSON.stringify([context,actor])) ?? ''
export const saveLocalDraft = (context: string, actor: string, text: string) => { drafts.set(JSON.stringify([context,actor]),text) }
export const localAttachment = (context: string, actor: string) => attachments.get(JSON.stringify([context,actor]))
export const saveLocalAttachment = (context: string, actor: string, file?: File) => { const key = JSON.stringify([context,actor]); if (file) attachments.set(key,file); else attachments.delete(key) }
export const localRecording = (context: string, actor: string) => recordings.get(JSON.stringify([context,actor]))
export const saveLocalRecording = (context: string, actor: string, file?: File) => { const key = JSON.stringify([context,actor]); if (file) recordings.set(key,file); else recordings.delete(key) }
export const readLocalDocuments = (context: string) => documents.get(context) ?? emptyDocuments
export function addLocalDocument(context: string, file: File) {
  documents.set(context,[...readLocalDocuments(context),{ id: crypto.randomUUID(), file }]); for (const listener of [...documentListeners]) listener()
}
export function removeLocalDocument(context: string, id: string) {
  documents.set(context,readLocalDocuments(context).filter(document => document.id !== id))
  for (const listener of [...documentListeners]) listener()
}
export function subscribeLocalDocuments(listener: () => void) { documentListeners.add(listener); return () => { documentListeners.delete(listener) } }
/** Called before the demo workspace remounts and reuses its object IDs. */
export function resetLocalCommunication() { conversations.clear(); drafts.clear(); attachments.clear(); recordings.clear(); documents.clear(); for (const listener of [...documentListeners]) listener() }
