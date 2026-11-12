import { useState } from 'react'
import { HeaderAction } from '@/components/ui/header-action'
import { FOSAction } from '@/components/ui/fos-controls'
import { SectionAddItem } from '@/components/orders/SectionAddItem'
import type { ActionPalette } from '@/components/ui/action-palette'
import './NeutralActionsLab.css'
import { MediaCapturePilot } from '@/components/messaging/MediaCapturePilot'

function Samples({ palette, surfaceLabel }: { palette: ActionPalette; surfaceLabel: string }) {
  const neutral = palette !== 'reference'
  const prefix = neutral ? 'neutral' : 'reference'
  const [count, setCount] = useState(0)
  const activate = () => setCount(value => value + 1)
  return <section className="neutral-lab__sample" aria-label={`${neutral ? 'Нейтральный вариант' : 'Текущий вариант'} · ${surfaceLabel}`}>
    <h3>{neutral ? 'Единое семейство · OWNER OPEN' : 'Reference-палитра · для сравнения'}</h3>
    <div className="neutral-lab__controls">
      <SectionAddItem palette={palette} onClick={activate} data-testid={`${prefix}-plus`} />
      <HeaderAction palette={palette} action="save" accessibleName={neutral ? 'Нейтральный Save' : 'Текущий Save'} onAction={activate} data-testid={`${prefix}-header`} />
      <FOSAction palette={palette} hierarchy="primary" onClick={activate} data-testid={`${prefix}-primary`}>Основное действие</FOSAction>
      <FOSAction palette={palette} onClick={activate} data-testid={`${prefix}-secondary`}>Вторичное действие</FOSAction>
      <FOSAction palette={palette} hierarchy="tertiary" shape="icon" size="compact" aria-label="Закрыть пример" onClick={activate} data-testid={`${prefix}-icon`}><span aria-hidden="true">×</span></FOSAction>
      <FOSAction palette={palette} hierarchy="primary" disabled onClick={activate} data-testid={`${prefix}-disabled`}>Недоступно</FOSAction>
      <HeaderAction palette={palette} action="save" accessibleName={neutral ? 'Нейтральный Save недоступен' : 'Текущий Save недоступен'} disabled />
      <SectionAddItem palette={palette} disabled />
    </div>
    <p role="status" data-testid={`${prefix}-count`}>Нажатий: {count}</p>
  </section>
}

/** DEV-only Owner comparison. Shared controls; clicks have no product side effects. */
export function NeutralActionsLab() {
  return <main className="neutral-lab" data-testid="neutral-actions-lab">
    {new URLSearchParams(window.location.search).get('mediaPilot') === '1' && <MediaCapturePilot />}
    <header><p>FLEXOMIR OS · КНОПКИ СИСТЕМЫ</p><h1>Единое семейство кнопок</h1>
      <p>Сравнение общего Plus, HeaderAction и FOSAction. Нажатия меняют только счётчик стенда. Палитра и материалы ожидают визуальной приёмки.</p>
      <a href="/?view=client-orders">Client New: «Добавить заказ» → общий Plus</a>
      <p><a href="/?view=plus-motion">Новый спокойный preset: Plus и Secondary · один контур / одна тень</a></p>
    </header>
    {(['paper', 'pattern'] as const).map(background => <section key={background} className={`neutral-lab__surface neutral-lab__surface--${background}`} data-testid={`neutral-${background}`} aria-label={background === 'paper' ? 'Светлый фон' : 'Контрастный фон'}>
      <h2>{background === 'paper' ? 'Светлый фон приложения' : 'Фон для проверки прозрачности'}</h2>
      <Samples palette="reference" surfaceLabel={background} /><Samples palette="neutral" surfaceLabel={background} />
    </section>)}
  </main>
}
