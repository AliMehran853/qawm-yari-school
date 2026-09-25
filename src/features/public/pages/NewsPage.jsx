import { useState, useMemo } from 'react'
import { Bell, Pin } from 'lucide-react'
import { useAnnouncements } from '../../announcements/useAnnouncements'
import { formatJalali } from '../../../utils/date'
import { toFaNum } from '../../../utils/number'

const PRIORITY_STYLE = {
  normal: { label: 'عادی', badge: 'badge-gray', bar: 'bg-gray-400' },
  important: { label: 'مهم', badge: 'badge-warning', bar: 'bg-orange-500' },
  urgent: { label: 'فوری', badge: 'badge-danger', bar: 'bg-red-500' },
}

export default function NewsPage() {
  const [filter, setFilter] = useState('all')
  const { data: announcements, isLoading } = useAnnouncements()

  const filtered = useMemo(() => {
    if (!announcements) return []
    if (filter === 'all') return announcements
    if (filter === 'pinned') return announcements.filter((a) => a.pinned)
    return announcements.filter((a) => a.priority === filter)
  }, [announcements, filter])

  const counts = useMemo(() => {
    if (!announcements) return {}
    return {
      all: announcements.length,
      pinned: announcements.filter((a) => a.pinned).length,
      urgent: announcements.filter((a) => a.priority === 'urgent').length,
      important: announcements.filter((a) => a.priority === 'important').length,
    }
  }, [announcements])

  const filters = [
    { value: 'all', label: 'همه' },
    { value: 'pinned', label: 'سنجاق‌شده' },
    { value: 'urgent', label: 'فوری' },
    { value: 'important', label: 'مهم' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-700">
          اخبار و اعلانات
        </h1>
        <p className="text-gray-500 mt-2">آخرین اطلاعیه‌های مکتب</p>
      </div>

      {announcements?.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {filters.map((f) => {
            const count = counts[f.value] || 0
            if (f.value !== 'all' && count === 0) return null
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 rounded-full text-sm transition flex items-center gap-1.5 ${
                  filter === f.value
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
                }`}
              >
                {f.value === 'pinned' && <Pin size={12} />}
                <span>{f.label}</span>
                <span className="text-[10px] opacity-70 fa-num">({toFaNum(count)})</span>
              </button>
            )
          })}
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="spinner text-brand-700 mx-auto" style={{ width: 28, height: 28 }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Bell size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">اعلانی موجود نیست</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const style = PRIORITY_STYLE[a.priority] || PRIORITY_STYLE.normal
            return (
              <div
                key={a.id}
                className={`relative bg-white rounded-2xl border border-gray-200 p-5 ${
                  a.pinned ? 'ring-1 ring-brand-200' : ''
                }`}
              >
                <div className={`absolute top-5 right-0 w-1 h-10 rounded-l-full ${style.bar}`} />

                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {a.pinned && <Pin size={12} className="text-brand-600" />}
                  <span className={`badge ${style.badge} text-[10px]`}>{style.label}</span>
                  <span className="text-[11px] text-gray-400 mr-auto fa-num">
                    {formatJalali(a.created_at, 'yyyy/MM/dd')}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 leading-snug">{a.title}</h3>
                <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap leading-relaxed">
                  {a.body}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}