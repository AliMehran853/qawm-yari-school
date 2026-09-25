import { toFaNum } from '../../../utils/number'

export default function GradeEntryTable({
  items,
  scores,
  onChange,
  maxScore,
}) {
  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-500">
          برای این صنف دانش‌آموزی ثبت نشده است
        </p>
      </div>
    )
  }

  function validate(value) {
    if (value === '') return null
    const n = Number(value)
    if (isNaN(n)) return 'عدد وارد کن'
    if (n < 0) return 'منفی نمی‌شود'
    if (n > maxScore) return `حداکثر ${maxScore}`
    return null
  }

  return (
    <>
      {/* ─── موبایل: کارت ─── */}
      <div className="lg:hidden divide-y divide-gray-100">
        {items.map((item, idx) => {
          const value = scores[item.student.id] ?? ''
          const error = validate(value)
          return (
            <div key={item.student.id} className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.student.photo_url ? (
                    <img
                      src={item.student.photo_url}
                      alt={item.student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold">
                      {item.student.name?.charAt(0) || '؟'}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {toFaNum(idx + 1)}. {item.student.name}
                  </p>
                  {item.student.father_name && (
                    <p className="text-xs text-gray-500">
                      ولد {item.student.father_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  value={value}
                  onChange={(e) => onChange(item.student.id, e.target.value)}
                  placeholder={`از ${maxScore}`}
                  min={0}
                  max={maxScore}
                  step="0.25"
                  className={`input text-center font-bold text-lg fa-num ${
                    error ? 'input-error' : ''
                  }`}
                  dir="ltr"
                />
                <span className="text-xs text-gray-400 shrink-0">
                  / {toFaNum(maxScore)}
                </span>
              </div>

              {error && (
                <p className="input-error-text mt-1">{error}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* ─── دسکتاپ: جدول ─── */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>نام و تخلص</th>
              <th>نام پدر</th>
              <th className="w-40">نمره</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const value = scores[item.student.id] ?? ''
              const error = validate(value)
              return (
                <tr key={item.student.id}>
                  <td className="text-gray-400 fa-num">{toFaNum(idx + 1)}</td>
                  <td className="font-medium text-gray-900">
                    {item.student.name}
                  </td>
                  <td className="text-gray-600 text-sm">
                    {item.student.father_name || '—'}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={value}
                        onChange={(e) => onChange(item.student.id, e.target.value)}
                        placeholder="—"
                        min={0}
                        max={maxScore}
                        step="0.25"
                        className={`input py-1.5 text-center font-bold fa-num ${
                          error ? 'input-error' : ''
                        }`}
                        dir="ltr"
                      />
                      <span className="text-xs text-gray-400 shrink-0">
                        / {toFaNum(maxScore)}
                      </span>
                    </div>
                    {error && (
                      <p className="input-error-text mt-1">{error}</p>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}