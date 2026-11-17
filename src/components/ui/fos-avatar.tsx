import './fos-avatar.css'

export function FosAvatar({ name, photoUrl, size = 'small', className, testId, label, decorative = false }: {
  name: string
  photoUrl?: string | null
  size?: 'small' | 'large'
  className?: string
  testId?: string
  label?: string
  decorative?: boolean
}) {
  const initial = name.trim().split(/\s+/u)[0]?.slice(0, 1).toLocaleUpperCase('ru-RU') || ''
  return <span className={['fos-avatar', className].filter(Boolean).join(' ')} data-size={size} data-testid={testId}
    aria-hidden={decorative || undefined} aria-label={decorative ? undefined : label ?? (photoUrl ? 'Фотография пользователя' : `Инициалы ${name}`)}>
    {photoUrl ? <img src={photoUrl} alt="" /> : initial}
  </span>
}
