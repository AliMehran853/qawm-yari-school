import { Pencil, Trash2, Phone, Calendar, MessageCircle } from 'lucide-react'
import { toFaNum } from '../../../utils/number'
import { normalizeWhatsApp, openWhatsApp } from '../../../utils/whatsapp'

export default function TeacherList({ teachers, onEdit, onDelete }) {
  if (!teachers || teachers.length === 0) return null

  function handleWhatsApp(teacher) {
    const number = teacher.whatsapp || teacher.phone
    const normalized = normalizeWhatsApp(number)
    if (!normalized) {
      alert('شماره واتساپ این معلم ثبت نشده است')
      return
    }
    openWhatsApp(number, `سلام استاد ${teacher.name} عزیز.`)
  }

  function hasWhatsApp(t) {
    return !!normalizeWhatsApp(t.whatsapp || t.phone)
  }

  return (
    <>
      {/* ─── موبایل: کارت ─── */}
      <div className="lg:hidden divide-y divide-gray-100">
        {teachers.map((t) => {
          const canWA = hasWhatsApp(t)
          return (
            <div key={t.id} className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 overflow-hidden">
                {t.photo_url ? (
                  <img
                    src={t.photo_url}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="font-bold text-lg">
                    {t.name?.charAt(0) || '؟'}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {t.name}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                  {t.phone && (
                    <span className="flex items-center gap-1" dir="ltr">
                      <Phone size={12} />
                      <span className="fa-num">{toFaNum(t.phone)}</span>
                    </span>
                  )}
                  {t.hire_date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{t.hire_date}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {canWA && (
                  <button
                    onClick={() => handleWhatsApp(t)}
                    className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition"
                    aria-label="واتساپ"
                  >
                    <MessageCircle size={16} />
                  </button>
                )}
                <button
                  onClick={() => onEdit(t)}
                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                  aria-label="ویرایش"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(t)}
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

      {/* ─── دسکتاپ: جدول ─── */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="w-16"></th>
              <th>نام و تخلص</th>
              <th>شماره تماس</th>
              <th>تاریخ استخدام</th>
              <th>آدرس</th>
              <th className="w-32 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => {
              const canWA = hasWhatsApp(t)
              return (
                <tr key={t.id}>
                  <td>
                    <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center overflow-hidden">
                      {t.photo_url ? (
                        <img
                          src={t.photo_url}
                          alt={t.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-bold">
                          {t.name?.charAt(0) || '؟'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="font-medium text-gray-900">{t.name}</td>
                  <td className="fa-num" dir="ltr">
                    {t.phone ? toFaNum(t.phone) : '—'}
                  </td>
                  <td className="fa-num">{t.hire_date || '—'}</td>
                  <td className="text-gray-500 text-sm truncate max-w-[200px]">
                    {t.address || '—'}
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      {canWA && (
                        <button
                          onClick={() => handleWhatsApp(t)}
                          className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition"
                          aria-label="واتساپ"
                        >
                          <MessageCircle size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(t)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                        aria-label="ویرایش"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(t)}
                        className="p-2 hover:bg-red-50 text-danger rounded-lg transition"
                        aria-label="حذف"
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