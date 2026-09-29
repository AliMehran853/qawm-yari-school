import { toFaNum } from '../../../utils/number'

export default function GradeBarChart({ data }) {
  if (!data || data.length === 0) return null

  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="space-y-2.5">
      {data.map((item) => {
        const isEmpty = item.count === 0
        const width = (item.count / max) * 100
        const isNarrow = width < 15 // اگر نوار باریک است

        return (
          <div key={item.grade} className="flex items-center gap-3">
            {/* شماره صنف */}
            <span
              className={`text-xs w-14 shrink-0 fa-num text-left ${
                isEmpty ? 'text-gray-400' : 'text-gray-600 font-medium'
              }`}
            >
              صنف {toFaNum(item.grade)}
            </span>

            {/* نوار یا حالت خالی */}
            <div className="flex-1 h-7 bg-gray-50 rounded-lg overflow-hidden relative border border-gray-100">
              {isEmpty ? (
                /* صنف خالی — بدون نوار */
                <div className="h-full flex items-center justify-end pr-3">
                  <span className="text-xs text-gray-400 fa-num">
                    ۰
                  </span>
                </div>
              ) : (
                <>
                  {/* نوار رنگی */}
                  <div
                    className="h-full bg-gradient-to-l from-brand-500 to-brand-700 rounded-lg transition-all duration-500 flex items-center justify-end"
                    style={{ width: `${width}%` }}
                  >
                    {/* اگر نوار پهن است، عدد داخل نوار */}
                    {!isNarrow && (
                      <span className="text-white text-xs font-bold fa-num pl-2.5 drop-shadow-md">
                        {toFaNum(item.count)}
                      </span>
                    )}
                  </div>

                  {/* اگر نوار باریک است، عدد بیرون نوار */}
                  {isNarrow && (
                    <span
                      className="absolute top-1/2 -translate-y-1/2 text-brand-800 text-xs font-bold fa-num pr-1"
                      style={{
                        right: `calc(${width}% + 8px)`,
                      }}
                    >
                      {toFaNum(item.count)}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}