import { UserPlus, Pencil, UserX } from 'lucide-react'
import { toFaNum } from '../../../utils/number'

export default function GradeSubjectsList({
  items,
  onAssignClick,
  onUnassignClick,
}) {
  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-500">
          برای این صنف مضمونی ثبت نشده است
        </p>
      </div>
    )
  }

  return (
    <>
      {/* ─── موبایل: کارت ─── */}
      <div className="lg:hidden divide-y divide-gray-100">
        {items.map(({ subject, assignment, teacher }) => (
          <div key={subject.id} className="p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {subject.name}
              </h3>
              {teacher ? (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 overflow-hidden">
                    {teacher.photo_url ? (
                      <img
                        src={teacher.photo_url}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-bold">
                        {teacher.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 truncate">
                    {teacher.name}
                  </span>
                </div>
              ) : (
                <span className="badge badge-warning text-[10px] mt-1 inline-block">
                  معلم تعیین نشده
                </span>
              )}
            </div>

            {teacher ? (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onAssignClick({ subject, assignment, teacher })}
                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                  aria-label="تغییر"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onUnassignClick(assignment.id, subject.grade)}
                  className="p-2 hover:bg-red-50 text-danger rounded-lg transition"
                  aria-label="حذف"
                >
                  <UserX size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAssignClick({ subject, assignment: null, teacher: null })}
                className="btn btn-primary btn-sm shrink-0"
              >
                <UserPlus size={14} />
                <span>تعیین</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ─── دسکتاپ: جدول ─── */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>مضمون</th>
              <th>کد</th>
              <th>معلم</th>
              <th className="w-32 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ subject, assignment, teacher }) => (
              <tr key={subject.id}>
                <td className="font-medium text-gray-900">{subject.name}</td>
                <td
                  className="text-gray-500 font-mono text-xs"
                  dir="ltr"
                >
                  {subject.code || '—'}
                </td>
                <td>
                  {teacher ? (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 overflow-hidden">
                        {teacher.photo_url ? (
                          <img
                            src={teacher.photo_url}
                            alt={teacher.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold">
                            {teacher.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">
                        {teacher.name}
                      </span>
                    </div>
                  ) : (
                    <span className="badge badge-warning">
                      تعیین نشده
                    </span>
                  )}
                </td>
                <td>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() =>
                        onAssignClick({ subject, assignment, teacher })
                      }
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                      aria-label={teacher ? 'تغییر' : 'تعیین'}
                    >
                      {teacher ? <Pencil size={15} /> : <UserPlus size={15} />}
                    </button>
                    {assignment && (
                      <button
                        onClick={() =>
                          onUnassignClick(assignment.id, subject.grade)
                        }
                        className="p-2 hover:bg-red-50 text-danger rounded-lg transition"
                        aria-label="حذف"
                      >
                        <UserX size={15} />
                      </button>
                    )}
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