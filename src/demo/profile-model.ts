import { useEffect, useState } from 'react'

export type ProfileRole = 'client' | 'manager'

export interface DemoProfileIdentity {
  role: ProfileRole
  displayName: string
  email: string
  companyName?: string
  photoFile: File | null
}

export interface DemoProfileDraft {
  displayName: string
  photoFile: File | null
  photoPendingRemoval: boolean
}

export const DEMO_PROFILE_IDENTITIES: Record<ProfileRole, DemoProfileIdentity> = {
  client: {
    role: 'client',
    displayName: 'Мария Иванова',
    email: 'client@example.test',
    companyName: 'Компания 01',
    photoFile: null,
  },
  manager: {
    role: 'manager',
    displayName: 'Александр Петров',
    email: 'manager@example.test',
    photoFile: null,
  },
}

export function profileInitials(displayName: string): string {
  return displayName.trim().split(/\s+/u)[0]?.slice(0, 1).toLocaleUpperCase('ru-RU') || ''
}

export function isProfileDraftDirty(draft: DemoProfileDraft, saved: DemoProfileIdentity): boolean {
  return draft.displayName !== saved.displayName || draft.photoFile !== saved.photoFile || draft.photoPendingRemoval
}

/** Local previews live only as long as their source File; no file data is persisted. */
export function useLocalPhotoPreview(file: File | null): string | null {
  const [preview, setPreview] = useState<string | null>(null)
  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])
  return preview
}
