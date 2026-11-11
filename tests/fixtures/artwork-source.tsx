import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArtworkSource } from '../../src/components/orders/ArtworkSource'
import { emptyDemoItem } from '../../src/demo/order-compose-model'
import '../../src/styles.css'

function Fixture() {
  const params = new URLSearchParams(location.search)
  const [disabled, setDisabled] = useState(params.get('disabled') === '1')
  const [value, setValue] = useState(() => params.get('state') === 'library'
    ? { ...emptyDemoItem(), artworkMode: 'LIBRARY' as const, layoutId: 'fixture-layout', layoutName: 'Синтетический макет' }
    : emptyDemoItem())
  const [changes, setChanges] = useState(0), [opens, setOpens] = useState(0)
  return <div style={{ maxWidth: 506, margin: 24 }}>
    <h1>Проверка контракта ArtworkSource</h1>
    <label><input type="checkbox" checked={disabled} onChange={event => setDisabled(event.target.checked)} />Заблокировать поле</label>
    <ArtworkSource value={value} disabled={disabled} error={params.get('error') === '1' ? 'Тестовая ошибка поля' : undefined}
      onOpenLibrary={params.get('library') === 'off' ? undefined : () => setOpens(count => count + 1)}
      onChange={patch => { setChanges(count => count + 1); setValue(current => ({ ...current, ...patch })) }} />
    <output data-testid="changes">{changes}</output><output data-testid="library-opens">{opens}</output>
  </div>
}
createRoot(document.getElementById('fixture')!).render(<Fixture />)
