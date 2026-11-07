import './artwork-thumbnail.css'

/** FOS Artwork Thumbnail 674:102; text-only synthetic placeholder, never a real file preview. */
export function ArtworkThumbnail({ label = 'МАКЕТ', size = 60 }: { label?: string; size?: 60 | 52 }) {
  return <span className="fos-artwork-thumbnail" data-size={size} aria-hidden="true">{label}</span>
}
