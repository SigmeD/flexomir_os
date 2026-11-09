import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useRef } from 'react'
import type { DemoProfileIdentity } from '@/demo/profile-model'
import { FosPopupSurface } from '@/components/ui/fos-popup-surface'
import { FosPopupRows } from '@/components/ui/fos-popup-rows'
import { FosGlassMaterial } from '@/components/ui/fos-glass-material'
import './account-menu.css'

export function AccountMenu({
  identity,
  photoPreview,
  placement,
  onOpenProfile,
}: {
  identity: DemoProfileIdentity
  photoPreview: string | null
  placement: 'sidebar' | 'header'
  onOpenProfile: () => void
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const initials = identity.displayName.trim().split(/\s+/u)[0]?.slice(0, 1).toLocaleUpperCase('ru-RU') || ''
  const secondary = identity.companyName || identity.email
  const triggerLabel = `${identity.displayName} — открыть меню аккаунта`
  const trigger = placement === 'sidebar'
    ? <button ref={triggerRef} type="button" className="fos-account-footer" data-testid="account-menu-trigger">
        <FosGlassMaterial aria-hidden="true" className="fos-account-footer__glass" radius={15} strength={0} blur={9} tone="neutral" shadow="none" centerOpacity={0.24} centerColor="255 255 255" />
        <span className="fos-account-avatar" aria-hidden="true">{photoPreview ? <img src={photoPreview} alt="" /> : initials}</span>
        <span className="fos-account-footer__name">{identity.displayName}</span>
      </button>
    : <button ref={triggerRef} type="button" className="fos-account-trigger" data-testid="account-menu-trigger" aria-label={triggerLabel}>
        <span aria-hidden="true">{photoPreview ? <img src={photoPreview} alt="" /> : initials}</span>
      </button>

  return <DropdownMenu.Root modal={false}>
    <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        asChild
        data-testid="account-menu"
        aria-label="Меню аккаунта"
        side={placement === 'sidebar' ? 'top' : 'bottom'}
        align={placement === 'sidebar' ? 'start' : 'end'}
        sideOffset={12}
        alignOffset={placement === 'sidebar' ? 16 : 0}
        collisionPadding={16}
        onInteractOutside={event => {
          // An exiting non-modal layer can observe the pointer that reopens its
          // trigger. The trigger owns toggling; do not dismiss that same click.
          const target = event.detail.originalEvent.target
          if (target instanceof Node && triggerRef.current?.contains(target)) event.preventDefault()
        }}
      >
        <FosPopupSurface hoverLens={false} sidebarMaterial className="fos-account-menu" contentClassName="fos-account-menu__content">
          <div className="fos-account-menu__identity">
            <span className="fos-account-avatar" aria-hidden="true">{photoPreview ? <img src={photoPreview} alt="" /> : initials}</span>
            <span className="fos-account-menu__copy">
              <strong>{identity.displayName}</strong>
              <small>{secondary}</small>
            </span>
          </div>
          <DropdownMenu.Separator className="fos-account-menu__separator" />
          <FosPopupRows selectedId="profile">
          <DropdownMenu.Item data-popup-item="profile" className="fos-account-menu__item" onSelect={onOpenProfile}><span data-popup-label="">Настройки профиля</span></DropdownMenu.Item>
          <DropdownMenu.Separator className="fos-account-menu__separator" />
          <DropdownMenu.Item data-popup-item="company" className="fos-account-menu__item" disabled><span data-popup-label="">Настройки компании</span></DropdownMenu.Item>
          <DropdownMenu.Separator className="fos-account-menu__separator" />
          <DropdownMenu.Item data-popup-item="logout" className="fos-account-menu__item fos-account-menu__item--logout" disabled><span data-popup-label="">Выйти</span></DropdownMenu.Item>
          </FosPopupRows>
        </FosPopupSurface>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
}
