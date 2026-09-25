import GalleryCard from './GalleryCard'

export default function GalleryGrid({
  items,
  onEdit,
  onDelete,
  onItemClick,
  canManage = true,
}) {
  if (!items || items.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((item, idx) => (
        <GalleryCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={() => onItemClick?.(idx)}
          canManage={canManage}
        />
      ))}
    </div>
  )
}