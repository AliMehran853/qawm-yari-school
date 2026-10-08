import { useState, useMemo } from 'react'
import { Calendar, Printer, AlertCircle } from 'lucide-react'
import { useSchedule } from '../../schedule/useSchedule'
import { useSettings } from '../../settings/useSettings'
import ScheduleGrid from '../../schedule/components/ScheduleGrid'
import { toFaNum } from '../../../utils/number'
import {
  DEFAULT_PERIOD_COUNTS,
  DEFAULT_PERIOD_TIMES,
} from '../../../lib/scheduleConstants'

export default function PublicSchedulePage() {
  const [grade, setGrade] = useState(1)
  const { data: schedule, isLoading } = useSchedule(grade)
  const { data: settings } = useSettings()

  const schoolName = settings?.school_name || 'مکتب قوم یاری'
  const periodTimes = settings?.period_times || DEFAULT_PERIOD_TIMES
  const periodCounts = settings?.period_counts || DEFAULT_PERIOD_COUNTS
  const periodsCount = periodCounts[grade] || 6

  const scheduleMap = useMemo(() => {
    const map = {}
    ;(schedule || []).forEach((item) => {
      map[`${item.grade}-${item.day}-${item.period}`] = item
    })
    return map
  }, [schedule])

  const filledCount = (schedule || []).filter((s) => s.subject).length

  function handlePrint() {
    window.print()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
      {/* ═══ هدر ═══ */}
      <div className="text-center mb-8 no-print">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-brand-100 mb-4">
          <Calendar size={14} />
          <span>برنامه هفتگی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-700">
          تقسیم اوقات درسی
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          برنامه هفتگی صنوف {schoolName}
        </p>
      </div>

      {/* ═══ انتخاب صنف ═══ */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center no-print">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
          <button
            key={g}
            onClick={() => setGrade(g)}
            className={`px-4 py-2 rounded-full text-sm transition fa-num ${
              grade === g
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
            }`}
          >
            صنف {toFaNum(g)}
          </button>
        ))}
      </div>

      {/* ═══ عنوان چاپی ═══ */}
      <div className="mb-4 text-center">
        <h2 className="text-lg sm:text-xl font-bold text-brand-800">
          تقسیم اوقات درسی صنف {toFaNum(grade)}
        </h2>
        <p className="text-xs text-gray-500 mt-1">{schoolName}</p>
        <div className="w-20 h-0.5 bg-gradient-to-l from-brand-500 to-gold-500 rounded-full mx-auto mt-2" />
      </div>

      {/* ═══ محتوا ═══ */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 28, height: 28 }}
          />
          <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
        </div>
      ) : filledCount === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <AlertCircle size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            برنامه این صنف هنوز توسط مکتب ثبت نشده است
          </p>
        </div>
      ) : (
        <ScheduleGrid
          grade={grade}
          periodsCount={periodsCount}
          periodTimes={periodTimes}
          scheduleMap={scheduleMap}
          readOnly
        />
      )}

      {/* ═══ دکمه چاپ ═══ */}
      {filledCount > 0 && (
        <div className="mt-6 text-center no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-gradient-to-l from-brand-600 to-brand-800 hover:from-brand-700 hover:to-brand-900 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
          >
            <Printer size={16} />
            <span>چاپ برنامه</span>
          </button>
        </div>
      )}
    </div>
  )
}