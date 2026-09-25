import AnnouncementCard from './AnnouncementCard'

export default function AnnouncementList({
  announcements,
  onEdit,
  onDelete,
  onTogglePin,
  onShare,
  canManage = true,
}) {
  if (!announcements || announcements.length === 0) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      {announcements.map((a) => (
        <AnnouncementCard
          key={a.id}
          announcement={a}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          onShare={onShare}
          canManage={canManage}
        />
      ))}
    </div>
  )
}