import { useState } from 'react'
import { FOSAction, FOSInput } from '@/components/ui/fos-controls'
import { PageHeader } from '@/components/ui/page-header'
import './auth-candidate.css'

type AuthStep = 'email' | 'code' | 'verified'

/** Owner design open: UI-only candidate, with no account lookup, email, session, or trusted-device storage. */
export function AuthCandidateScreen() {
  const [step, setStep] = useState<AuthStep>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [trustedDevice, setTrustedDevice] = useState(false)

  function continueWithEmail() {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setMessage('Проверьте формат электронной почты.')
      return
    }
    setMessage('Демо-экран проверки клиента. Письмо или код не отправлялись.')
    setStep('code')
  }

  function verifyCode() {
    if (!/^\d{6}$/.test(code)) {
      setMessage('Введите шестизначный код для проверки состояния интерфейса.')
      return
    }
    setMessage('Код принят только в локальной демонстрации. Сессия не создана.')
    setStep('verified')
  }

  return <main className="fos-auth-candidate" data-testid="auth-candidate">
    <PageHeader title="Вход в кабинет" breadcrumbs={[{ label: 'Вход' }]} />
    <section className="fos-auth-candidate__panel" aria-labelledby="auth-candidate-title">
      <h2 id="auth-candidate-title">Вход по электронной почте</h2>
      <p className="fos-auth-candidate__notice">Кандидат UI · Auth design Owner OPEN. Здесь нет проверки аккаунтов, отправки писем и серверной авторизации.</p>
      {step === 'email' && <>
        <FOSInput label="Электронная почта" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.currentTarget.value)} />
        <FOSAction hierarchy="primary" onClick={continueWithEmail}>Продолжить</FOSAction>
      </>}
      {step === 'code' && <>
        <p>Если адрес относится к импортированному клиенту, следующий шаг будет показан здесь.</p>
        <FOSInput label="Код из письма" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={event => setCode(event.currentTarget.value)} />
        <label className="fos-auth-candidate__trusted"><input type="checkbox" checked={trustedDevice} onChange={event => setTrustedDevice(event.currentTarget.checked)} /> Доверенное устройство (только макет; не сохраняется)</label>
        <div className="fos-auth-candidate__actions">
          <FOSAction hierarchy="primary" onClick={verifyCode}>Проверить код</FOSAction>
          <FOSAction onClick={() => setMessage('Демо-запрос повтора показан; письмо или код не отправлялись.')}>Запросить повторно</FOSAction>
          <FOSAction onClick={() => { setMessage('Демо-состояние: код не принят. Реальная проверка не подключена.'); setCode('') }}>Показать неверный код</FOSAction>
          <FOSAction onClick={() => { setMessage('Демо-состояние: срок действия кода истёк.'); setCode('') }}>Показать истёкший код</FOSAction>
        </div>
      </>}
      {step === 'verified' && <div className="fos-auth-candidate__actions" aria-label="Переход в демо-кабинет">
        <p>Выберите демонстрационный экран. Это не подтверждает личность и не выдаёт права.</p>
        <FOSAction onClick={() => { window.location.href = '/?view=client-orders&demoTools=1' }}>Открыть Client demo</FOSAction>
        <FOSAction onClick={() => { window.location.href = '/?view=manager-orders&demoTools=1' }}>Открыть Manager demo</FOSAction>
      </div>}
      <p className="fos-auth-candidate__feedback" role="status" aria-live="polite">{message}</p>
      {step !== 'email' && <FOSAction onClick={() => { setStep('email'); setCode(''); setMessage('') }}>Изменить адрес</FOSAction>}
    </section>
  </main>
}
