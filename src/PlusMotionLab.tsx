import { useState } from 'react'
import { SectionAddItem } from './components/orders/SectionAddItem'
import { FOSAction } from './components/ui/fos-controls'
import './PlusMotionLab.css'

/** One control, two adapters. DEV only; no product state or new optical primitive. */
export function PlusMotionLab() {
  const [disabled, setDisabled] = useState(false)
  const [count, setCount] = useState(0)
  const zoom = new URLSearchParams(window.location.search).get('inspect') === '4'
  return <main className="plus-motion-lab" data-testid="plus-motion-lab" data-inspect={zoom ? '4' : '1'}>
    <h1>Plus · поверхность стекла</h1>
    <p>DEV · OWNER VISUAL NOT ACCEPTED · {zoom ? 'Оптический просмотр: живой DOM ×4' : 'Реальный размер: hit 44 / glass 34'}</p>
    <p>Один контур, одна мягкая тень. Hover → лёгкое увеличение. Нажатие → упругое сжатие. Space, Enter и touch.</p>
    <div className="plus-motion-lab__grid">
      {(['legacy', 'surface'] as const).map(mode => <section key={mode} aria-label={mode === 'legacy' ? 'Прежняя реакция' : 'Контрольный Plus'}>
        <h2>{mode === 'legacy' ? 'До · только содержимое' : 'После · поверхность и свет'}</h2>
        <div className="plus-motion-lab__stage"><div className="plus-motion-lab__sample">
          <SectionAddItem palette="neutral-pilot" surfaceMotion={mode === 'surface' ? 'pressure-pilot' : 'legacy'} disabled={disabled} data-testid={`${mode}-plus`} onClick={() => setCount(value => value + 1)} />
        </div></div>
      </section>)}
    </div>
    <section aria-label="Сравнение Secondary"><h2>Secondary · тот же material preset</h2>
      <div className="plus-motion-lab__actions"><FOSAction palette="neutral-pilot" data-testid="legacy-secondary">До · вторичное действие</FOSAction>
        <FOSAction palette="neutral-pilot" materialPreset="neutral-action-pilot" disabled={disabled} data-testid="surface-secondary" onClick={() => setCount(value => value + 1)}>После · вторичное действие</FOSAction></div>
    </section>
    <label><input type="checkbox" checked={disabled} onChange={event => setDisabled(event.target.checked)} /> Disabled</label>
    <p role="status">Нажатий: {count}</p>
    <a href={zoom ? '/?view=plus-motion' : '/?view=plus-motion&inspect=4'}>{zoom ? 'Размер 1:1' : 'Оптический просмотр ×4'}</a>
    <p><a href="/?view=client-orders&actionPalette=neutral-pilot&plusMotion=pressure-pilot">Проверка в Client New</a></p>
  </main>
}
