import { Link } from 'react-router-dom'
import { Bell, Pin, ArrowLeft } from 'lucide-react'
import { formatJalali } from '../../../utils/date'

const PRIORITY_COLOR = {
  normal: 'bg-gray-100 text-gray-700',
  important: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
}

const PRIORITY_LABEL = {
  normal: 'عادی',
  important: 'مهم',
  urgent: 'فوری',
}

export default function RecentAnnouncements({ announcements }) {
  if (!announcements || announcements.length === 0) {
    return (
      <div className="text-center py-6">
        <Bell size={32} className="mx-auto text-gray-300 mb-2" />
        <p className="text-sm text-gray-500">اعلانی نیست</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {announcements.map((a) => (
        <div
          key={a.id}
          className="border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition"
        >
          <div className="flex items-start gap-2 mb-1.5">
            {a.pinned && <Pin size={11} className="text-brand-600 mt-0.5 shrink-0" />}
            <span
              className={`badge ${
                PRIORITY_COLOR[a.priority] || PRIORITY_COLOR.normal
              } text-[10px]`}
            >
              {PRIORITY_LABEL[a.priority] || 'عادی'}
            </span>
            <span className="text-[10px] text-gray-400 mr-auto fa-num">
              {formatJalali(a.created_at, 'yyyy/MM/dd')}
            </span>
          </div>
          <h4 className="font-medium text-sm text-gray-900 leading-snug line-clamp-1">
            {a.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {a.body}
          </p>
        </div>
      ))}

      <Link
        to="/panel/announcements"
        className="flex items-center justify-center gap-1.5 text-xs text-brand-700 hover:text-brand-800 font-medium pt-2"
      >
        <span>مشاهده همه اعلانات</span>
        <ArrowLeft size={13} />
      </Link>
    </div>
  )
}