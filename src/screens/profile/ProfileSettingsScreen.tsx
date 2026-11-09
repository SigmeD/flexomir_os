import { useRef, useState } from 'react'
import { FOSAction, FOSInput } from '@/components/ui/fos-controls'
import { HeaderAction } from '@/components/ui/header-action'
import { PageHeader } from '@/components/ui/page-header'
import { MoreAction } from '@/components/ui/overflow-menu'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useLocalPhotoPreview, type DemoProfileDraft, type DemoProfileIdentity } from '@/demo/profile-model'
import './profile-settings.css'

export function ProfileSettingsScreen({
  identity,
  draft,
  dirty,
  saving,
  saveError,
  saveStatus,
  onDraftChange,
  onSave,
}: {
  identity: DemoProfileIdentity
  draft: DemoProfileDraft
  dirty: boolean
  saving: boolean
  saveError: string
  saveStatus: string
  onDraftChange: (next: DemoProfileDraft) => void
  onSave: () => Promise<boolean>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const preview = useLocalPhotoPreview(draft.photoPendingRemoval ? null : draft.photoFile)

  async function save() { await onSave() }

  return <div className="fos-profile-page" data-testid="profile-settings-screen">
      <div className="fos-profile-page__content">
        <header className="fos-profile-page__header">
          <div className="fos-profile-page__breadcrumb">Настройка профиля</div>
          <PageHeader title="Настройки профиля" actions={
            <div className="fos-profile-actions" data-testid="profile-page-actions">
              <HeaderAction
                action="save"
                accessibleName="Сохранить"
                presentation="icon-label"
                data-testid="profile-save"
                disabled={!dirty || saving}
                aria-busy={saving || undefined}
                onAction={save}
              />
              <MoreAction
                className="fos-more fos-more--icon-label fos-profile-actions__more"
                data-testid="profile-more"
                aria-label="Ещё"
                disabled
              />
            </div>
          } />
        </header>

        <section className="fos-profile-card" aria-label="Параметры профиля">
          <div className="fos-profile-photo">
            <h2>Фотография пользователя</h2>
            <div className="fos-profile-photo__row">
              <div className="fos-profile-avatar" data-testid="profile-avatar" aria-label={preview ? 'Фотография пользователя' : `Инициалы ${identity.displayName}`}>
                {preview ? <img src={preview} alt="" /> : <span>{draft.displayName.trim().split(/\s+/u)[0]?.slice(0, 1).toLocaleUpperCase('ru-RU') || ''}</span>}
              </div>
              <div className="fos-profile-photo__actions">
                <input
                  ref={inputRef}
                  className="fos-profile-photo__input"
                  data-testid="profile-photo-input"
                  type="file"
                  aria-label="Загрузить фото"
                  onChange={event => {
                    const file = event.currentTarget.files?.[0]
                    if (file) onDraftChange({ ...draft, photoFile: file, photoPendingRemoval: false })
                    event.currentTarget.value = ''
                  }}
                />
                <FOSAction onClick={() => inputRef.current?.click()}>
                  {preview ? 'Изменить фото' : 'Загрузить фото'}
                </FOSAction>
                {draft.photoPendingRemoval
                  ? <FOSAction onClick={() => onDraftChange({ ...draft, photoPendingRemoval: false })}>Восстановить фотографию</FOSAction>
                  : preview && <FOSAction onClick={() => setConfirmDelete(true)}>Удалить фото</FOSAction>}
              </div>
            </div>
          </div>

          <div className="fos-profile-card__divider" />
          <div className="fos-profile-fields">
            <FOSInput
              label="Имя пользователя"
              value={draft.displayName}
              onChange={event => onDraftChange({ ...draft, displayName: event.currentTarget.value })}
              autoComplete="name"
              data-testid="profile-name"
            />
            <FOSInput label="E-mail" value={identity.email} readOnly autoComplete="email" />
          </div>
        </section>

        <p className="fos-profile-demo-note">Изменения сохраняются только до перезагрузки страницы.</p>
        {saving && <p className="fos-profile-status" role="status">Сохраняем изменения демонстрационного профиля.</p>}
        {saveError && <p className="fos-profile-error" role="alert">{saveError}</p>}
        {!saving && !saveError && saveStatus && <p className="fos-profile-status" role="status" aria-live="polite" data-testid="profile-save-status">{saveStatus}</p>}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Удалить фотографию?"
        confirmLabel="ОК"
        cancelLabel="Отмена"
        onConfirm={() => {
          onDraftChange({ ...draft, photoPendingRemoval: true })
          setConfirmDelete(false)
        }}
        onCancel={() => setConfirmDelete(false)}
      />
  </div>
}
