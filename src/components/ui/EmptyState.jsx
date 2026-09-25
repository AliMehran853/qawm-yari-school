import { Inbox } from 'lucide-react'

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'چیزی نیست',
  description = '',
  action = null,
}) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-400" />
      </div>
      <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}