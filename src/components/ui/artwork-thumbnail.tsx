import './artwork-thumbnail.css'

/** FOS Artwork Thumbnail 674:102; text-only synthetic placeholder, never a real file preview. */
export function ArtworkThumbnail({ label = 'МАКЕТ', size = 60, className = '' }: { label?: string; size?: 60 | 52; className?: string }) {
  return <span className={['fos-artwork-thumbnail', className].filter(Boolean).join(' ')} data-size={size} aria-hidden="true">{label}</span>
}
