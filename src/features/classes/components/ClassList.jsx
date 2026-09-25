import { Pencil, Trash2, Users } from 'lucide-react'
import { toFaNum } from '../../../utils/number'

export default function ClassList({ classes, onEdit, onDelete }) {
  if (!classes || classes.length === 0) return null

  return (
    <>
      {/* ─── موبایل: کارت ─── */}
      <div className="lg:hidden divide-y divide-gray-100">
        {classes.map((c) => (
          <div key={c.id} className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
              <span className="font-bold text-lg fa-num">{toFaNum(c.grade)}</span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900">
                صنف {toFaNum(c.grade)}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="fa-num">سال {toFaNum(c.year)}</span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  <span className="fa-num">{toFaNum(c.capacity)}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(c)}
                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                aria-label="ویرایش"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(c)}
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
              <th>صنف</th>
              <th>سال تعلیمی</th>
              <th>ظرفیت</th>
              <th className="w-24 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id}>
                <td className="font-medium text-gray-900">
                  صنف {toFaNum(c.grade)}
                </td>
                <td className="fa-num">{toFaNum(c.year)}</td>
                <td className="fa-num text-gray-600">{toFaNum(c.capacity)}</td>
                <td>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(c)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                      aria-label="ویرایش"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(c)}
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