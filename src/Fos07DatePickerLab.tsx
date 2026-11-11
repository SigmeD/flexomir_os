import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { FOSDatePicker } from './components/ui/fos-date-picker'
import { FOSAction, FOSDateField } from './components/ui/fos-controls'
import { OrderDateFields } from './components/orders/OrderDateFields'
import './styles.css'
import './fos07-datepicker-lab.css'

function DatePickerLab() {
  const [value, setValue] = useState('2026-11-16'), [changes, setChanges] = useState(0)
  const [role, setRole] = useState<'client' | 'manager'>('client')
  const [reject, setReject] = useState(false), [submitted, setSubmitted] = useState('')
  return <main className="fos07-lab">
    <header><p>FLEXOMIR OS · ПИЛОТ №07 · G-04 OPEN</p><h1>Календарь выбора даты</h1>
      <p>Один компонент для обоих кабинетов. Обычные формы заказов пока используют прежний календарь.</p>
    </header>
    <nav aria-label="Кабинет пилота">
      <FOSAction hierarchy={role === 'client' ? 'primary' : 'secondary'} onClick={() => setRole('client')} aria-pressed={role === 'client'}>Клиент</FOSAction>
      <FOSAction hierarchy={role === 'manager' ? 'primary' : 'secondary'} onClick={() => setRole('manager')} aria-pressed={role === 'manager'}>Менеджер</FOSAction>
    </nav>
    <section className="fos07-lab__surface" aria-label="Общие поля даты">
      <h2>{role === 'client' ? 'Кабинет клиента' : 'Кабинет менеджера'}</h2>
      <form onSubmit={event => { event.preventDefault(); setSubmitted(String(new FormData(event.currentTarget).get('requestedDate'))) }}>
        <OrderDateFields>
          <FOSDatePicker label="Желаемый срок" name="requestedDate" value={value} required min="2026-11-10" max="2026-11-20"
            onValueChange={next => { setChanges(count => count + 1); if (!reject) setValue(next) }} helper="Для проверки ограничений: 10–20 ноября 2026." />
          <FOSDatePicker label="Согласованный срок" name="agreedDate" value="" readOnly onValueChange={() => { throw Error('Readonly changed') }} />
        </OrderDateFields>
        <div className="fos07-lab__actions"><FOSAction hierarchy="primary" type="submit">Проверить форму</FOSAction><FOSAction type="reset">Сбросить</FOSAction></div>
        <dl className="fos07-lab__data"><dt>Значение YYYY-MM-DD</dt><dd data-testid="date-value">{value || 'пусто'}</dd><dt>Событий изменения</dt><dd data-testid="change-count">{changes}</dd><dt>Данные формы</dt><dd data-testid="form-value">{submitted || 'не проверялись'}</dd></dl>
      </form>
    </section>
    <section className="fos07-lab__surface" aria-label="Состояния">
      <h2>Состояния и сравнение</h2>
      <OrderDateFields>
        <FOSDatePicker label="Недоступная дата" value="2026-11-16" disabled onValueChange={() => { throw Error('Disabled changed') }} />
        <FOSDatePicker label="Дата с ошибкой" value="" error="Проверьте дату" onValueChange={() => {}} />
        <FOSDateField label="Нативный календарь" defaultValue="2026-11-16" />
        <FOSDatePicker label="Без ограничений" value={value} onValueChange={setValue} />
        <FOSDatePicker label="Прошлый диапазон" value="" min="2020-11-10" max="2020-11-20" onValueChange={() => {}} />
        <FOSDatePicker label="Будущий диапазон" value="" min="2030-11-10" max="2030-11-20" onValueChange={() => {}} />
      </OrderDateFields>
      <label className="fos07-lab__check"><input type="checkbox" checked={reject} onChange={event => setReject(event.target.checked)} /> Отклонять изменение родителем</label>
    </section>
  </main>
}

// This entry is served only by Vite DEV; ordinary production routing is unchanged.
if (import.meta.env.DEV) createRoot(document.getElementById('root')!).render(<StrictMode><DatePickerLab /></StrictMode>)

