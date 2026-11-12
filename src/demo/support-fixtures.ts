import type { CabinetRole } from '@/components/layout/CabinetPage'

/** Presentation data only: status text is not an approved server enum. */
export interface DemoSupportTicket {
  id: string; owner: CabinetRole; subject: string; description: string; statusText: string; date: string
  reply?: { message: string; date: string }
  /** Local File only; never serialized as an uploaded name. */
  file?: File
}
export function supportFixtures(role: CabinetRole): readonly DemoSupportTicket[] {
  const subjects = role === 'client' ? ['Не открывается макет', 'Вопрос по заказу', 'Ошибка загрузки файла'] : ['Не работает фильтр заказов', 'Ошибка в списке заказов', 'Вопрос по разделу клиентов']
  return subjects.map((subject, index) => ({
    id: role + '-0' + (index + 1), owner: role, subject,
    description: role === 'client' ? 'При открытии демонстрационного макета появляется пустой экран.' : 'В списке заказов фильтр «Все» показывает только новые заказы.',
    statusText: index === 0 ? 'Есть ответ поддержки' : 'Демонстрационное обращение', date: '06.11.2026 · 14:20',
    reply: index === 0 ? { message: 'Спасибо, зафиксировали. Проверяем проблему. Это синтетический ответ команды Flexomir OS.', date: '06.11.2026 · 14:34' } : undefined,
  }))
}
