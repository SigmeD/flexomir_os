import { useEffect, useRef, useState } from 'react'
import { HeaderAction } from '@/components/ui/header-action'
import './HeaderActionLensLab.css'

type Background = 'light' | 'dark'

/** Issue #64: opt-in visual comparison only. Product HeaderAction consumers remain unchanged. */
export function HeaderActionLensLab() {
  const [clicks, setClicks] = useState({ original: 0, candidate: 0 })
  const [feedback, setFeedback] = useState<Record<Background, boolean>>({ light: false, dark: false })
  const feedbackTimers = useRef<Partial<Record<Background, number>>>({})

  useEffect(() => () => {
    Object.values(feedbackTimers.current).forEach(timer => window.clearTimeout(timer))
  }, [])

  function activateCandidate(background: Background) {
    setClicks(current => ({ ...current, candidate: current.candidate + 1 }))
    window.clearTimeout(feedbackTimers.current[background])
    setFeedback(current => ({ ...current, [background]: true }))
    feedbackTimers.current[background] = window.setTimeout(() => {
      setFeedback(current => ({ ...current, [background]: false }))
      delete feedbackTimers.current[background]
    }, 220)
  }

  return <main className="ha-lens-lab">
    <header className="ha-lens-lab__intro">
      <p>FLEXOMIR OS / DEV PILOT / ISSUE #64</p>
      <h1>Primary HeaderAction · «Отправить»</h1>
      <span>Один компонент, два материала. Нажатия меняют только счётчик стенда.</span>
    </header>
    {(['light', 'dark'] as const).map(background => <section key={background} className={`ha-lens-lab__panel ha-lens-lab__panel--${background}`} aria-label={`${background === 'light' ? 'Светлый' : 'Тёмный'} фон`}>
      <h2>{background === 'light' ? 'Светлый фон приложения' : 'Тёмный фон для проверки прозрачности'}</h2>
      <div className="ha-lens-lab__compare">
        <div className="ha-lens-lab__sample">
          <span>Original</span>
          <HeaderAction action="send" accessibleName="Отправить, исходная кнопка" data-testid={`lens-original-${background}`} onAction={() => setClicks(current => ({ ...current, original: current.original + 1 }))} />
        </div>
        <div className="ha-lens-lab__sample">
          <span>Candidate</span>
          <HeaderAction action="send" accessibleName="Отправить, кандидат" className="fos-ha--lens-pilot" data-testid={`lens-candidate-${background}`} data-feedback={feedback[background] ? 'true' : undefined} onAction={() => activateCandidate(background)} />
        </div>
      </div>
      <div className="ha-lens-lab__compare ha-lens-lab__compare--disabled">
        <div className="ha-lens-lab__sample">
          <span>Original · disabled</span>
          <HeaderAction action="send" accessibleName="Отправить, исходная кнопка недоступна" disabled data-testid={`lens-original-disabled-${background}`} />
        </div>
        <div className="ha-lens-lab__sample">
          <span>Candidate · disabled</span>
          <HeaderAction action="send" accessibleName="Отправить, кандидат недоступен" className="fos-ha--lens-pilot" disabled data-testid={`lens-candidate-disabled-${background}`} />
        </div>
      </div>
    </section>)}
    <p role="status" className="ha-lens-lab__count">Нажатий: Original {clicks.original} · Candidate {clicks.candidate}</p>
  </main>
}
