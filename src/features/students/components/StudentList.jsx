import {
  Pencil,
  Trash2,
  Phone,
  MessageCircle,
  Trophy,
  BarChart3,
} from 'lucide-react'
import { toFaNum } from '../../../utils/number'
import { normalizeWhatsApp, openWhatsApp } from '../../../utils/whatsapp'

function getRankStyle(rank) {
  if (rank === 1)
    return {
      bg: 'bg-gradient-to-br from-gold-400 to-gold-600',
      text: 'text-white',
      icon: 'text-white',
      label: 'اول',
    }
  if (rank === 2)
    return {
      bg: 'bg-gradient-to-br from-gray-300 to-gray-500',
      text: 'text-white',
      icon: 'text-white',
      label: 'دوم',
    }
  if (rank === 3)
    return {
      bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
      text: 'text-white',
      icon: 'text-white',
      label: 'سوم',
    }
  return {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    icon: 'text-gray-400',
    label: '',
  }
}

export default function StudentList({
  students,
  onEdit,
  onDelete,
  onViewGrades,
  showRanks = false,
}) {
  if (!students || students.length === 0) return null

  function handleWhatsApp(student, e) {
    e?.stopPropagation()
    const number = student.whatsapp || student.phone
    const normalized = normalizeWhatsApp(number)
    if (!normalized) {
      alert('شماره واتساپ این دانش‌آموز ثبت نشده است')
      return
    }
    openWhatsApp(number, `سلام، والد محترم ${student.name} عزیز.`)
  }

  function hasWhatsApp(s) {
    return !!normalizeWhatsApp(s.whatsapp || s.phone)
  }

  return (
    <>
      {/* ─── موبایل ─── */}
      <div className="lg:hidden divide-y divide-gray-100">
        {students.map((s) => {
          const canWA = hasWhatsApp(s)
          const rankStyle = s.rank ? getRankStyle(s.rank) : null

          return (
            <div key={s.id} className="p-4 flex items-center gap-3">
              {showRanks && s.rank && (
                <div
                  className={`${rankStyle.bg} w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-md`}
                >
                  <Trophy size={11} className={rankStyle.icon} />
                  <span className={`text-xs font-bold fa-num ${rankStyle.text}`}>
                    {toFaNum(s.rank)}
                  </span>
                </div>
              )}

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
                  {showRanks && s.average !== null && (
                    <span className="text-[10px] text-gray-500 fa-num">
                      معدل {toFaNum(s.average)}
                    </span>
                  )}
                </div>
                {s.father_name && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    ولد {s.father_name}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => onViewGrades(s)}
                  className="p-2 hover:bg-brand-50 text-brand-700 rounded-lg transition"
                  aria-label="مشاهده نمرات"
                  title="نمرات"
                >
                  <BarChart3 size={16} />
                </button>
                {canWA && (
                  <button
                    onClick={(e) => handleWhatsApp(s, e)}
                    className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition"
                    aria-label="واتساپ"
                  >
                    <MessageCircle size={16} />
                  </button>
                )}
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
          )
        })}
      </div>

      {/* ─── دسکتاپ ─── */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {showRanks && <th className="w-16 text-center">رتبه</th>}
              <th className="w-16 text-center">عکس</th>
              <th className="text-center">نام و تخلص</th>
              <th className="text-center">نام پدر</th>
              <th className="text-center">نام پدرکلان</th>
              <th className="text-center">صنف</th>
              {showRanks && <th className="text-center">معدل</th>}
              <th className="text-center">تماس</th>
              <th className="w-40 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const canWA = hasWhatsApp(s)
              const rankStyle = s.rank ? getRankStyle(s.rank) : null

              return (
                <tr key={s.id}>
                  {showRanks && (
                    <td className="text-center">
                      {s.rank ? (
                        <div
                          className={`${rankStyle.bg} w-10 h-10 mx-auto rounded-xl flex flex-col items-center justify-center shadow-md`}
                        >
                          <Trophy size={11} className={rankStyle.icon} />
                          <span
                            className={`text-xs font-bold fa-num ${rankStyle.text}`}
                          >
                            {toFaNum(s.rank)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  )}

                  <td className="text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-gold-50 text-gold-700 flex items-center justify-center overflow-hidden">
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

                  <td className="font-medium text-gray-900 text-center">
                    {s.name}
                  </td>
                  <td className="text-gray-700 text-center">
                    {s.father_name || '—'}
                  </td>
                  <td className="text-gray-700 text-center">
                    {s.grandfather_name || '—'}
                  </td>
                  <td className="text-center">
                    <span className="badge badge-brand">
                      صنف {toFaNum(s.grade)}
                    </span>
                  </td>

                  {showRanks && (
                    <td className="text-center">
                      {s.average !== null ? (
                        <span className="font-bold text-sm fa-num text-brand-800">
                          {toFaNum(s.average)}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  )}

                  <td className="text-center">
                    {s.phone ? (
                      <span className="fa-num inline-block" dir="ltr">
                        {toFaNum(s.phone)}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onViewGrades(s)}
                        className="p-2 hover:bg-brand-50 text-brand-700 rounded-lg transition"
                        aria-label="نمرات"
                        title="مشاهده نمرات"
                      >
                        <BarChart3 size={15} />
                      </button>
                      {canWA && (
                        <button
                          onClick={(e) => handleWhatsApp(s, e)}
                          className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition"
                          aria-label="واتساپ"
                          title="واتساپ"
                        >
                          <MessageCircle size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(s)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                        aria-label="ویرایش"
                        title="ویرایش"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(s)}
                        className="p-2 hover:bg-red-50 text-danger rounded-lg transition"
                        aria-label="حذف"
                        title="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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