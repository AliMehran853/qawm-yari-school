import {
  Pin,
  PinOff,
  Pencil,
  Trash2,
  Bell,
  Share2,
  MessageCircle,
} from 'lucide-react'
import { formatJalali } from '../../../utils/date'
import { toFaNum } from '../../../utils/number'

const PRIORITY_STYLE = {
  normal: {
    badge: 'badge-gray',
    label: 'عادی',
    border: 'border-gray-200',
    bar: 'bg-gray-400',
  },
  important: {
    badge: 'badge-warning',
    label: 'مهم',
    border: 'border-orange-200',
    bar: 'bg-orange-500',
  },
  urgent: {
    badge: 'badge-danger',
    label: 'فوری',
    border: 'border-red-200',
    bar: 'bg-red-500',
  },
}

const AUDIENCE_LABEL = {
  all: 'همه',
  teachers: 'معلمان',
  students: 'دانش‌آموزان',
  parents: 'والدین',
}

export default function AnnouncementCard({
  announcement,
  onEdit,
  onDelete,
  onTogglePin,
  onShare,
  canManage = true,
}) {
  const style = PRIORITY_STYLE[announcement.priority] || PRIORITY_STYLE.normal
  const date = formatJalali(announcement.created_at, 'yyyy/MM/dd')
  const time = formatJalali(announcement.created_at, 'HH:mm')

  return (
    <div
      className={`relative rounded-xl border bg-white p-4 sm:p-5 transition hover:shadow-card ${
        style.border
      } ${announcement.pinned ? 'ring-1 ring-brand-300' : ''}`}
    >
      {/* نوار رنگی کنار */}
      <div
        className={`absolute top-4 right-0 w-1 h-12 rounded-l-full ${style.bar}`}
      />

      {/* هدر کارت */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {announcement.pinned && (
              <Pin size={12} className="text-brand-600 shrink-0" />
            )}
            <span className={`badge ${style.badge}`}>{style.label}</span>
            <span className="badge badge-gray text-[10px]">
              {AUDIENCE_LABEL[announcement.audience] || 'همه'}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 leading-snug">
            {announcement.title}
          </h3>
        </div>

        {/* عملیات مدیر */}
        {canManage && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onTogglePin(announcement)}
              className={`p-1.5 rounded-lg transition ${
                announcement.pinned
                  ? 'text-brand-700 bg-brand-50 hover:bg-brand-100'
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
              aria-label={announcement.pinned ? 'برداشتن سنجاق' : 'سنجاق'}
            >
              {announcement.pinned ? <PinOff size={15} /> : <Pin size={15} />}
            </button>
            <button
              onClick={() => onEdit(announcement)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              aria-label="ویرایش"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete(announcement)}
              className="p-1.5 text-danger hover:bg-red-50 rounded-lg transition"
              aria-label="حذف"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      {/* متن */}
      <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
        {announcement.body}
      </p>

      {/* پایین: تاریخ + دکمه اشتراک */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <Bell size={11} />
          <span className="fa-num">
            {date} — {time}
          </span>
        </div>

        <button
          onClick={() => onShare(announcement)}
          className="flex items-center gap-1 text-[11px] text-green-700 hover:bg-green-50 px-2.5 py-1 rounded-lg transition font-medium"
        >
          <MessageCircle size={13} />
          <span>ارسال در واتساپ</span>
        </button>
      </div>
    </div>
  )
}