/** Date-only values never pass through UTC or toISOString. */
export function dateFromISO(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return
  const [year, month, day] = value.split('-').map(Number)
  if (year < 1 || year > 9999) return
  const date = new Date(0)
  date.setHours(12, 0, 0, 0)
  date.setFullYear(year, month - 1, day)
  if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) return date
}
export function dateToISO(date: Date): string {
  return [String(date.getFullYear()).padStart(4, '0'), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}
export function displayDate(value: string): string {
  return dateFromISO(value) ? value.split('-').reverse().join('.') : ''
}
export function inputDate(value: string): string | undefined {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return
  const iso = value.split('.').reverse().join('-')
  return dateFromISO(iso) ? iso : undefined
}
export const russianDate = (date: Date) => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date).replace(/ г\.$/, '')

