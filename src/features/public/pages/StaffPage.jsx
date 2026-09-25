import { Users, Phone, MessageCircle } from 'lucide-react'
import { useTeachers } from '../../teachers/useTeachers'
import { useSettings } from '../../settings/useSettings'
import { normalizeWhatsApp, openWhatsApp } from '../../../utils/whatsapp'
import { toFaNum } from '../../../utils/number'

export default function StaffPage() {
  const { data: teachers, isLoading } = useTeachers()
  const { data: settings } = useSettings()

  function handleWhatsApp(t) {
    const number = t.whatsapp || t.phone
    const normalized = normalizeWhatsApp(number)
    if (!normalized) return
    openWhatsApp(
      number,
      `سلام استاد ${t.name} عزیز.\nاز سایت ${settings?.school_name || 'مکتب'} تماس می‌گیرم.`
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-700">
          کادر آموزشی
        </h1>
        <p className="text-gray-500 mt-2">معلمان و کادر مکتب</p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 28, height: 28 }}
          />
          <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
        </div>
      ) : !teachers || teachers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">اطلاعات معلمان هنوز ثبت نشده</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 text-center hover:shadow-card transition"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-brand-50 text-brand-700 flex items-center justify-center overflow-hidden mb-3">
                {t.photo_url ? (
                  <img
                    src={t.photo_url}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="font-bold text-2xl">
                    {t.name?.charAt(0) || '؟'}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-gray-900">{t.name}</h3>

              {t.hire_date && (
                <p className="text-xs text-gray-500 mt-1 fa-num">
                  از سال {toFaNum(t.hire_date.split('/')[0])}
                </p>
              )}

              {t.address && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                  {t.address}
                </p>
              )}

              {(t.whatsapp || t.phone) && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => handleWhatsApp(t)}
                    className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition"
                  >
                    <MessageCircle size={13} />
                    <span>واتساپ</span>
                  </button>
                  {t.phone && (
                    <a
                      href={`tel:${t.phone}`}
                      className="flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <Phone size={13} />
                      <span>تماس</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}