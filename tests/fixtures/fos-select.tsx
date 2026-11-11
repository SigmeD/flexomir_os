import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { FOSSelect } from '../../src/components/ui/fos-controls'
import '../../src/styles.css'

function Fixture() {
  const [disabled, setDisabled] = useState(false), [readOnly, setReadOnly] = useState(false)
  const [event, setEvent] = useState(''), [data, setData] = useState(''), [changes, setChanges] = useState(0)
  const [value, setValue] = useState(() => new URLSearchParams(location.search).has('empty') ? '' : 'a'), [focusEvent, setFocusEvent] = useState('')
  const params = new URLSearchParams(location.search)
  const long = params.has('long'), controlled = params.has('controlled'), reject = params.has('reject')
  return <div style={{ padding: 20, maxWidth: 360, marginTop: long ? 100 : 0 }}>
    <form onSubmit={event => { event.preventDefault(); setData(JSON.stringify([...new FormData(event.currentTarget)])) }}>
      <FOSSelect name="choice" label="Выбор" helper="Подсказка" aria-describedby="extra-note" value={controlled ? value : undefined} defaultValue={controlled ? undefined : ''} required={!params.has('optional')} emptyIsPlaceholder={!params.has('filter')} disabled={disabled} readOnly={readOnly}
        autoFocus={params.has('autofocus')} onFocus={event => setFocusEvent('focus:' + event.currentTarget.tagName)} onBlur={event => setFocusEvent('blur:' + event.currentTarget.tagName)}
        onChange={event => { setEvent(event.target.tagName + ':' + event.target.value); setChanges(count => count + 1); if (controlled && !reject) setValue(event.target.value) }}>
        <option value="">Выберите значение</option><option value="a">Альфа</option><option disabled value="b">Бета</option><option>Гамма</option>
        <optgroup label="Недоступная группа" disabled><option value="d">Дельта</option></optgroup>
        {params.has('label') && <option value="long">Очень длинное название материала для проверки поля на узком экране без переноса текста за его границы</option>}
        {long && Array.from({ length: 50 }, (_, index) => <option key={index} value={'item-' + index}>Вариант {index}</option>)}
      </FOSSelect>
      <p id="extra-note">Описание поля</p>
      <button type="submit">Отправить</button><button type="reset">Сбросить</button>
    </form>
    <button onClick={() => setDisabled(value => !value)}>Disabled</button><button onClick={() => setReadOnly(value => !value)}>Readonly</button>
    <output data-testid="change-event">{event}</output><output data-testid="change-count">{changes}</output><output data-testid="form-data">{data}</output>
    <output data-testid="focus-event">{focusEvent}</output>
    <label style={long ? { position: 'fixed', bottom: 0, left: 0 } : { display: 'block', marginTop: 300 }}>Следующее поле<input /></label>
  </div>
}
createRoot(document.getElementById('fixture')!).render(<Fixture />)
