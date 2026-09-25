import { Calendar, X } from 'lucide-react'
import { format } from 'date-fns-jalali'

export default function DatePicker({ value, onChange, recentDates = [] }) {
  const today = format(new Date(), 'yyyy/MM/dd')

  function isValidDate(str) {
    // فرمت: 1404/06/15
    return /^\d{4}\/\d{2}\/\d{2}$/.test(str)
  }

  return (
    <div className="space-y-2">
      <label className="input-label">تاریخ</label>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Calendar
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="1404/06/15"
            dir="ltr"
            className="input pr-9 text-center font-mono fa-num"
          />
        </div>

        {value && (
          <button
            onClick={() => onChange('')}
            className="p-2 hover:bg-gray-100 rounded-lg shrink-0"
            aria-label="پاک کردن"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {!isValidDate(value) && value && (
        <p className="input-error-text">فرمت تاریخ درست نیست</p>
      )}

      {/* دکمه‌های سریع */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onChange(today)}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition shrink-0 ${
            value === today
              ? 'bg-brand-700 text-white'
              : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
          }`}
        >
          امروز
        </button>

        {recentDates
          .filter((d) => d !== today)
          .map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onChange(d)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition shrink-0 font-mono fa-num ${
                value === d
                  ? 'bg-brand-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {d}
            </button>
          ))}
      </div>
    </div>
  )
}