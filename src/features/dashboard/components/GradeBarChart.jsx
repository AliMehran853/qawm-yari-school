import { toFaNum } from '../../../utils/number'

export default function GradeBarChart({ data }) {
  if (!data || data.length === 0) return null

  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="space-y-2">
      {data.map((item) => {
        const width = (item.count / max) * 100
        return (
          <div key={item.grade} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-14 shrink-0 fa-num">
              صنف {toFaNum(item.grade)}
            </span>
            <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-l from-brand-500 to-brand-700 rounded-md transition-all duration-500"
                style={{ width: `${width}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-end pl-2 text-xs text-gray-700 font-bold fa-num pointer-events-none">
                {toFaNum(item.count)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}