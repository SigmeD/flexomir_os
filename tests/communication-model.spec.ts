import { test, expect } from '@playwright/test'
import { createLocalConversation } from '../src/components/messaging/message-model'
import { localConversation, localDraft, resetLocalCommunication, saveLocalDraft, localRecording, saveLocalRecording } from '../src/components/messaging/local-communication'
import { demoItemErrors, emptyDemoItem } from '../src/demo/order-compose-model'

test('Q05/Q08 optional demo numeric schema rejects invalid supplied counts without requiring legacy fields',()=>{
  const item={...emptyDemoItem(),name:'Test',quantity:'1',shape:'Круглая',width:'1',height:'1',material:'Бумага',printMethod:'flex' as const,artworkMode:'HELP' as const}
  expect(demoItemErrors(item)).toEqual({})
  for(const value of ['0','-1','1.5','9007199254740992','text','  ']) expect(demoItemErrors({...item,inkCount:value,labelsPerRoll:value})).toEqual({inkCount:'Введите положительное целое число',labelsPerRoll:'Введите положительное целое число'})
  expect(demoItemErrors({...item,inkCount:'4',labelsPerRoll:'250'})).toEqual({})
})

test('Q11–12 adapter acknowledges one operation and notifies both subscribers', async () => {
  const adapter = createLocalConversation()
  let first = 0, second = 0
  const unsubscribe = adapter.subscribe(() => first++)
  adapter.subscribe(() => second++)
  await adapter.submit('stable-id', { text: 'one' }, 'client', 'Клиент')
  await adapter.submit('stable-id', { text: 'one' }, 'client', 'Клиент')
  expect(adapter.read()).toHaveLength(1)
  expect(first).toBeGreaterThan(0); expect(second).toBeGreaterThan(0)
  unsubscribe()
  const previous = first
  await adapter.submit('second', { text: 'two' }, 'manager', 'Менеджер')
  expect(first).toBe(previous)
  await expect(adapter.submit('empty', { text: '  ' }, 'client', 'Клиент')).rejects.toThrow()
  expect(adapter.read()).toHaveLength(2)
})

test('Q12 object/company and author draft isolation, session reset', async () => {
  resetLocalCommunication()
  const a = localConversation('company-A/order-1')
  await a.submit('1', { text: 'A' }, 'client', 'Клиент')
  expect(localConversation('company-B/order-1').read()).toHaveLength(0)
  saveLocalDraft('company-A/order-1', 'client', 'private draft')
  expect(localDraft('company-A/order-1', 'manager')).toBe('')
  expect(localDraft('company-A/order-1', 'client')).toBe('private draft')
  const recording = new File(['real local bytes'],'draft.webm',{type:'audio/webm'})
  saveLocalRecording('company-A/order-1','client',recording)
  expect(localRecording('company-A/order-1','client')).toBe(recording)
  expect(localRecording('company-A/order-1','manager')).toBeUndefined()
  expect(localRecording('company-B/order-1','client')).toBeUndefined()
  resetLocalCommunication()
  expect(localConversation('company-A/order-1').read()).toHaveLength(0)
  expect(localDraft('company-A/order-1', 'client')).toBe('')
  expect(localRecording('company-A/order-1','client')).toBeUndefined()
})
