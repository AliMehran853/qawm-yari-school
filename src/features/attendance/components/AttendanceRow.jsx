import { Check, X as XIcon, Clock, FileText } from 'lucide-react'

const STATUSES = [
  {
    value: 'present',
    label: 'حاضر',
    icon: Check,
    active: 'bg-green-500 text-white border-green-500',
    idle: 'bg-white text-green-700 border-green-200 hover:bg-green-50',
  },
  {
    value: 'absent',
    label: 'غایب',
    icon: XIcon,
    active: 'bg-red-500 text-white border-red-500',
    idle: 'bg-white text-red-700 border-red-200 hover:bg-red-50',
  },
  {
    value: 'late',
    label: 'تاخیر',
    icon: Clock,
    active: 'bg-orange-500 text-white border-orange-500',
    idle: 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50',
  },
  {
    value: 'excused',
    label: 'رخصت',
    icon: FileText,
    active: 'bg-blue-500 text-white border-blue-500',
    idle: 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50',
  },
]

export default function AttendanceRow({ item, index, onChange }) {
  const { student, status, note } = item

  return (
    <div className="p-3 sm:p-4 border-b border-gray-100 last:border-0">
      {/* اطلاعات شاگرد */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center shrink-0 overflow-hidden">
          {student.photo_url ? (
            <img
              src={student.photo_url}
              alt={student.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="font-bold text-sm">
              {student.name?.charAt(0) || '؟'}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate text-sm">
            <span className="text-gray-400 fa-num">{index + 1}.</span>{' '}
            {student.name}
          </p>
          {student.father_name && (
            <p className="text-[11px] text-gray-500 truncate">
              ولد {student.father_name}
            </p>
          )}
        </div>
      </div>

      {/* دکمه‌های وضعیت */}
      <div className="grid grid-cols-4 gap-1.5">
        {STATUSES.map((s) => {
          const Icon = s.icon
          const isActive = status === s.value
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => onChange(student.id, 'status', s.value)}
              className={`flex items-center justify-center gap-1 py-2 px-1 rounded-lg border text-xs font-medium transition ${
                isActive ? s.active : s.idle
              }`}
              aria-label={s.label}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          )
        })}
      </div>

      {/* یادداشت (فقط وقتی غایب/تاخیر/رخصت) */}
      {status !== 'present' && (
        <input
          type="text"
          value={note || ''}
          onChange={(e) => onChange(student.id, 'note', e.target.value)}
          placeholder="یادداشت (اختیاری)..."
          className="input mt-2 text-xs py-1.5"
        />
      )}
    </div>
  )
}