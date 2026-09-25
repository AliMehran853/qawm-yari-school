import { Pencil, Trash2, Phone } from 'lucide-react'
import { toFaNum } from '../../../utils/number'

export default function StudentList({ students, onEdit, onDelete }) {
  if (!students || students.length === 0) return null

  return (
    <>
      {/* ─── موبایل: کارت ─── */}
      <div className="lg:hidden divide-y divide-gray-100">
        {students.map((s) => (
          <div key={s.id} className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center shrink-0 overflow-hidden">
              {s.photo_url ? (
                <img
                  src={s.photo_url}
                  alt={s.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="font-bold">
                  {s.name?.charAt(0) || '؟'}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-gray-900 truncate">
                  {s.name}
                </h3>
                <span className="badge badge-brand text-[10px] shrink-0">
                  صنف {toFaNum(s.grade)}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                {s.father_name && (
                  <span className="truncate">ولد {s.father_name}</span>
                )}
                {s.phone && (
                  <span className="flex items-center gap-1 shrink-0" dir="ltr">
                    <Phone size={11} />
                    <span className="fa-num">{toFaNum(s.phone)}</span>
                  </span>
                )}
              </div>
              {s.student_code && (
                <p className="text-[10px] text-gray-400 font-mono mt-0.5" dir="ltr">
                  {s.student_code}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(s)}
                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                aria-label="ویرایش"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(s)}
                className="p-2 hover:bg-red-50 text-danger rounded-lg transition"
                aria-label="حذف"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── دسکتاپ: جدول ─── */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="w-14"></th>
              <th>کد</th>
              <th>نام و تخلص</th>
              <th>نام پدر</th>
              <th>صنف</th>
              <th>تماس</th>
              <th className="w-24 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="w-9 h-9 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center overflow-hidden">
                    {s.photo_url ? (
                      <img
                        src={s.photo_url}
                        alt={s.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-bold text-sm">
                        {s.name?.charAt(0) || '؟'}
                      </span>
                    )}
                  </div>
                </td>
                <td
                  className="font-mono text-xs text-gray-500"
                  dir="ltr"
                >
                  {s.student_code || '—'}
                </td>
                <td className="font-medium text-gray-900">{s.name}</td>
                <td className="text-gray-600">{s.father_name || '—'}</td>
                <td>
                  <span className="badge badge-brand">
                    صنف {toFaNum(s.grade)}
                  </span>
                </td>
                <td className="fa-num" dir="ltr">
                  {s.phone ? toFaNum(s.phone) : '—'}
                </td>
                <td>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(s)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                      aria-label="ویرایش"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(s)}
                      className="p-2 hover:bg-red-50 text-danger rounded-lg transition"
                      aria-label="حذف"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}