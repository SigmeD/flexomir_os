import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { GlassSelect, GlassSelectTrigger, GlassSelectContent, GlassSelectItem } from '../../src/components/ui/glass-select'
import '../../src/styles.css'

function Fixture() {
  const [value, setValue] = useState<string>()
  const [cancel, setCancel] = useState(true)
  const [clicks, setClicks] = useState(0)
  const [pendingValue, setPendingValue] = useState('1')
  const [changes, setChanges] = useState(0)
  const reject = new URLSearchParams(location.search).has('reject')
  return <main>
    <h1>Проверка API Select</h1>
    <label><input type="checkbox" checked={cancel} onChange={e => setCancel(e.target.checked)} /> Отменить выбор</label>
    <div data-testid="filter-control">
      <GlassSelect value={value} onValueChange={setValue}>
        <GlassSelectTrigger placeholder="Выберите статус" aria-label="Статус заказа" />
        <GlassSelectContent aria-label="Варианты статуса">
          <GlassSelectItem value="one">Первый</GlassSelectItem>
          <GlassSelectItem value="two" onClick={event => { setClicks(n => n + 1); if (cancel) event.preventDefault() }}>Второй</GlassSelectItem>
        </GlassSelectContent>
      </GlassSelect>
    </div>
    <output data-testid="fixture-value">{value ?? 'none'}</output>
    <output data-testid="fixture-clicks">{clicks}</output>
    <div data-testid="long-select">
      <GlassSelect defaultValue="1">
        <GlassSelectTrigger placeholder="Длинный список" />
        <GlassSelectContent>
          {Array.from({ length: 12 }, (_, i) => <GlassSelectItem key={i} value={String(i + 1)}>{`Статус ${i + 1}`}</GlassSelectItem>)}
        </GlassSelectContent>
      </GlassSelect>
    </div>
    <div data-testid="pending-select">
      <GlassSelect value={pendingValue} onValueChange={next => { setChanges(n => n + 1); if (!reject) setPendingValue(next) }}>
        <GlassSelectTrigger aria-label="Проверка завершения выбора" />
        <GlassSelectContent>
          {Array.from({ length: 6 }, (_, i) => <GlassSelectItem key={i} value={String(i + 1)}>{`Вариант ${i + 1}`}</GlassSelectItem>)}
        </GlassSelectContent>
      </GlassSelect>
    </div>
    <output data-testid="pending-changes">{changes}</output>
    <input aria-label="Следующее поле" />
  </main>
}

createRoot(document.getElementById('root')!).render(<Fixture />)
