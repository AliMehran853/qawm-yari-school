import { Plus, BookOpen } from 'lucide-react'
import { SCHEDULE_DAYS } from '../../../lib/scheduleConstants'
import { toFaNum } from '../../../utils/number'

export default function ScheduleGrid({
  grade,
  periodsCount,
  periodTimes,
  scheduleMap,
  onCellClick,
  readOnly = false,
}) {
  const periods = Array.from({ length: periodsCount }, (_, i) => i + 1)

  function getCellData(day, period) {
    return scheduleMap[`${grade}-${day}-${period}`] || null
  }

  function getPeriodTime(period) {
    return periodTimes?.find((t) => t.period === period)
  }

  return (
    <>
      {/* ═══ دسکتاپ: جدول ═══ */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-card">
          {/* هدر — روزها */}
          <thead>
            <tr className="bg-gradient-to-l from-brand-700 to-brand-800">
              <th className="p-3 text-center text-white text-xs font-bold border-l border-brand-600 w-24">
                زنگ
              </th>
              {SCHEDULE_DAYS.map((day) => (
                <th
                  key={day.value}
                  className="p-3 text-center text-white text-sm font-bold border-l border-brand-600 last:border-l-0"
                >
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {periods.map((p) => {
              const time = getPeriodTime(p)
              return (
                <tr key={p} className="border-b border-gray-100 last:border-b-0">
                  {/* ستون زنگ */}
                  <td className="p-2 text-center bg-gray-50 border-l border-gray-200 align-middle">
                    <p className="font-bold text-gray-900 text-sm fa-num">
                      زنگ {toFaNum(p)}
                    </p>
                    {time && (
                      <p className="text-[10px] text-gray-500 fa-num mt-0.5 leading-tight">
                        {time.start}
                        <br />
                        {time.end}
                      </p>
                    )}
                  </td>

                  {/* روزها */}
                  {SCHEDULE_DAYS.map((day) => {
                    const cell = getCellData(day.value, p)
                    return (
                      <td
                        key={day.value}
                        className="p-1.5 border-l border-gray-100 last:border-l-0 align-middle"
                      >
                        <ScheduleCell
                          cell={cell}
                          readOnly={readOnly}
                          onClick={() =>
                            !readOnly && onCellClick(day.value, p, cell)
                          }
                        />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ═══ موبایل: کارت روزها ═══ */}
      <div className="lg:hidden space-y-4">
        {SCHEDULE_DAYS.map((day) => (
          <div
            key={day.value}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-card"
          >
            {/* هدر روز */}
            <div className="bg-gradient-to-l from-brand-700 to-brand-800 px-4 py-3">
              <h3 className="font-bold text-white text-center">{day.label}</h3>
            </div>

            {/* لیست زنگ‌ها */}
            <div className="divide-y divide-gray-100">
              {periods.map((p) => {
                const time = getPeriodTime(p)
                const cell = getCellData(day.value, p)
                return (
                  <div key={p} className="flex items-stretch">
                    {/* شماره و ساعت */}
                    <div className="w-20 shrink-0 bg-gray-50 border-l border-gray-200 p-2 flex flex-col items-center justify-center">
                      <p className="font-bold text-gray-900 text-xs fa-num">
                        زنگ {toFaNum(p)}
                      </p>
                      {time && (
                        <p className="text-[9px] text-gray-500 fa-num mt-0.5">
                          {time.start}
                        </p>
                      )}
                    </div>

                    {/* محتوای سلول */}
                    <div className="flex-1 p-2">
                      <ScheduleCell
                        cell={cell}
                        readOnly={readOnly}
                        onClick={() =>
                          !readOnly && onCellClick(day.value, p, cell)
                        }
                        mobile
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ═══════════════════════════════════════
   سلول برنامه
   ═══════════════════════════════════════ */
function ScheduleCell({ cell, readOnly, onClick, mobile }) {
  // ─── سلول خالی ───
  if (!cell || !cell.subject) {
    if (readOnly) {
      return (
        <div
          className={`flex items-center justify-center rounded-lg bg-gray-50 border border-dashed border-gray-200 ${
            mobile ? 'py-2.5' : 'py-4'
          }`}
        >
          <span className="text-xs text-gray-400">—</span>
        </div>
      )
    }
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 bg-white hover:border-brand-400 hover:bg-brand-50/40 transition group ${
          mobile ? 'py-2.5' : 'py-4'
        }`}
      >
        <Plus size={14} className="text-gray-400 group-hover:text-brand-600" />
        <span className="text-xs text-gray-400 group-hover:text-brand-600">
          افزودن
        </span>
      </button>
    )
  }

  // ─── سلول پر ───
  const content = (
    <div
      className={`w-full rounded-lg bg-gradient-to-br from-brand-50 to-white border border-brand-100 p-2 text-center transition ${
        !readOnly ? 'hover:border-brand-300 hover:shadow-sm cursor-pointer' : ''
      }`}
    >
      <p className="font-bold text-xs sm:text-sm text-brand-800 truncate leading-tight">
        {cell.subject.name}
      </p>
      {cell.teacher ? (
        <div className="flex items-center justify-center gap-1 mt-1">
          {cell.teacher.photo_url && (
            <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
              <img
                src={cell.teacher.photo_url}
                alt={cell.teacher.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <p className="text-[9px] sm:text-[10px] text-gray-500 truncate leading-tight">
            {cell.teacher.name}
          </p>
        </div>
      ) : (
        <p className="text-[9px] text-gray-400 mt-1">بدون معلم</p>
      )}
    </div>
  )

  if (readOnly) return content

  return (
    <button onClick={onClick} className="w-full">
      {content}
    </button>
  )
}