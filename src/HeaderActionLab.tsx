import { useState } from 'react'
import { HeaderAction } from '@/components/ui/header-action'
import './HeaderActionLab.css'

/** Isolated component fixture. No backend, routing or mutations. */
export function HeaderActionLab() {
  const [managerClicks, setManagerClicks] = useState(0)
  const [clientClicks, setClientClicks] = useState(0)

  return (
    <main className="ha-lab">
      <header className="ha-lab__intro">
        <p className="ha-lab__eyebrow">FLEXOMIR OS / COMPONENT LAB</p>
        <h1>HeaderAction · GL-01D</h1>
        <p>Общий компонент для кабинета менеджера и клиента. Только тестовые нажатия, без создания заказа и API.</p>
      </header>
      <section className="ha-lab__card" aria-label="Менеджер — Заказы">
        <header className="ha-lab__header">
          <h2>Заказы</h2>
          <div className="ha-lab__actions">
            <HeaderAction
              action="add" accessibleName="Добавить"
              data-testid="header-action-add"
              onAction={() => setManagerClicks(x => x + 1)}
            />
          </div>
        </header>
        <p role="status" data-testid="header-action-count">Нажатий: {managerClicks}</p>
        <p className="ha-lab__help">Нажимайте по краям круга, удерживайте и отпускайте. Свет не оставляет следа.</p>
        <div className="ha-lab__disabled-state">
          <span>Отдельная проверка состояния disabled</span>
          <HeaderAction
            action="add" accessibleName="Добавить (недоступно)"
            data-testid="header-action-disabled"
            disabled
            onAction={() => { throw new Error('Disabled HeaderAction was activated') }}
          />
        </div>
      </section>
      <section className="ha-lab__card" aria-label="Клиент — Мои заказы">
        <header className="ha-lab__header">
          <h2>Мои заказы</h2>
          <div className="ha-lab__actions">
            <HeaderAction
              action="add" accessibleName="Новый заказ"
              data-testid="header-action-client"
              onAction={() => setClientClicks(x => x + 1)}
            />
          </div>
        </header>
        <p role="status" data-testid="header-action-client-count">Нажатий: {clientClicks}</p>
      </section>
    </main>
  )
}
