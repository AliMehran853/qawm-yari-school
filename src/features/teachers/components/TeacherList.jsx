import {
  Pencil,
  Trash2,
  Phone,
  Calendar,
  MessageCircle,
  Eye,
} from 'lucide-react'
import { toFaNum } from '../../../utils/number'
import { normalizeWhatsApp, openWhatsApp } from '../../../utils/whatsapp'

const POSITION_BADGE = {
  principal: { label: 'آمر', style: 'badge-gold' },
  head_teacher: { label: 'سرمعلم', style: 'badge-brand' },
  teacher: null,
  staff: { label: 'ملازم', style: 'badge-gray' },
}

export default function TeacherList({
  teachers,
  onView,
  onEdit,
  onDelete,
}) {
  if (!teachers || teachers.length === 0) return null

  function handleWhatsApp(teacher, e) {
    e.stopPropagation()
    const number = teacher.whatsapp || teacher.phone
    const normalized = normalizeWhatsApp(number)
    if (!normalized) return
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
          const posBadge = POSITION_BADGE[t.position]
          return (
            <div
              key={t.id}
              onClick={() => onView(t)}
              className="p-4 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer"
            >
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
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-gray-900 truncate">
                    {t.name}
                  </h3>
                  {posBadge && (
                    <span className={`badge ${posBadge.style} text-[9px]`}>
                      {posBadge.label}
                    </span>
                  )}
                </div>
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
                      <span className="fa-num">{t.hire_date}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {canWA && (
                  <button
                    onClick={(e) => handleWhatsApp(t, e)}
                    className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition"
                    aria-label="واتساپ"
                  >
                    <MessageCircle size={16} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(t)
                  }}
                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                  aria-label="ویرایش"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(t)
                  }}
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
              <th className="w-16 text-center">عکس</th>
              <th className="text-center">نام و تخلص</th>
              <th className="text-center">سمت</th>
              <th className="text-center">شماره تماس</th>
              <th className="text-center">تاریخ استخدام</th>
              <th className="text-center">آدرس</th>
              <th className="w-32 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => {
              const canWA = hasWhatsApp(t)
              const posBadge = POSITION_BADGE[t.position]
              return (
                <tr
                  key={t.id}
                  onClick={() => onView(t)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-brand-50 text-brand-700 flex items-center justify-center overflow-hidden">
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
                  <td className="font-medium text-gray-900 text-center">
                    {t.name}
                  </td>
                  <td className="text-center">
                    {posBadge ? (
                      <span className={`badge ${posBadge.style}`}>
                        {posBadge.label}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">معلم</span>
                    )}
                  </td>
                  <td className="text-center">
                    {t.phone ? (
                      <span className="fa-num inline-block" dir="ltr">
                        {toFaNum(t.phone)}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="fa-num text-center">
                    {t.hire_date || '—'}
                  </td>
                  <td className="text-gray-500 text-sm text-center">
                    {t.address || '—'}
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      {canWA && (
                        <button
                          onClick={(e) => handleWhatsApp(t, e)}
                          className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition"
                          aria-label="واتساپ"
                          title="واتساپ"
                        >
                          <MessageCircle size={15} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(t)
                        }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                        aria-label="ویرایش"
                        title="ویرایش"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(t)
                        }}
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