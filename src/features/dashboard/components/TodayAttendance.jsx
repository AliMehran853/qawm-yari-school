import { Check, X, Clock, FileText, CalendarCheck } from 'lucide-react'
import { toFaNum } from '../../../utils/number'

const ITEMS = [
  { key: 'present', label: 'حاضر', icon: Check, color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'absent', label: 'غایب', icon: X, color: 'text-red-600', bg: 'bg-red-50' },
  { key: 'late', label: 'تاخیر', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  { key: 'excused', label: 'رخصت', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
]

export default function TodayAttendance({ stats }) {
  if (!stats) return null

  if (stats.total === 0) {
    return (
      <div className="text-center py-6">
        <CalendarCheck size={32} className="mx-auto text-gray-300 mb-2" />
        <p className="text-sm text-gray-500">
          امروز حضوری ثبت نشده
        </p>
        <p className="text-xs text-gray-400 mt-1 fa-num">{stats.date}</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3 fa-num">
        تاریخ: {stats.date} — {toFaNum(stats.total)} رکورد
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {ITEMS.map((item) => {
          const Icon = item.icon
          const value = stats[item.key] || 0
          return (
            <div
              key={item.key}
              className={`${item.bg} rounded-xl p-3 text-center`}
            >
              <Icon size={16} className={`mx-auto ${item.color} mb-1`} />
              <p className={`text-xl font-bold fa-num ${item.color}`}>
                {toFaNum(value)}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{item.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}