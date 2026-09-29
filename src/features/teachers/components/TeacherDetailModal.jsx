import { useEffect } from 'react'
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  FileText,
  Pencil,
  Crown,
  Star,
  User,
  Briefcase,
  UserCircle,
} from 'lucide-react'
import { toFaNum } from '../../../utils/number'
import { normalizeWhatsApp, openWhatsApp } from '../../../utils/whatsapp'

const POSITION_CONFIG = {
  principal: {
    label: 'آمر',
    icon: Crown,
    gradient: 'from-gold-400 to-gold-600',
    bg: 'from-gold-50 to-white',
    border: 'border-gold-200',
    badge: 'badge-gold',
  },
  head_teacher: {
    label: 'سرمعلم',
    icon: Star,
    gradient: 'from-brand-500 to-brand-700',
    bg: 'from-brand-50 to-white',
    border: 'border-brand-200',
    badge: 'badge-brand',
  },
  teacher: {
    label: 'معلم',
    icon: User,
    gradient: 'from-emerald-500 to-emerald-700',
    bg: 'from-emerald-50 to-white',
    border: 'border-emerald-200',
    badge: 'badge-success',
  },
  staff: {
    label: 'ملازم / خدمه',
    icon: Briefcase,
    gradient: 'from-gray-500 to-gray-700',
    bg: 'from-gray-50 to-white',
    border: 'border-gray-200',
    badge: 'badge-gray',
  },
}

export default function TeacherDetailModal({ open, teacher, onClose, onEdit }) {
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open || !teacher) return null

  const config = POSITION_CONFIG[teacher.position] || POSITION_CONFIG.teacher
  const PosIcon = config.icon

  const hasWhatsApp = !!normalizeWhatsApp(teacher.whatsapp || teacher.phone)

  function handleWhatsApp() {
    const number = teacher.whatsapp || teacher.phone
    if (!normalizeWhatsApp(number)) return
    openWhatsApp(number, `سلام ${teacher.name} عزیز.`)
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center animate-fade-in p-0 sm:p-4"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-modal animate-slide-up max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══ هدر رنگی ═══ */}
        <div
          className={`relative bg-gradient-to-br ${config.bg} border-b ${config.border} pt-6 pb-20 px-5 sm:rounded-t-3xl`}
        >
          {/* دکمه بستن */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition"
            aria-label="بستن"
          >
            <X size={18} className="text-gray-600" />
          </button>

          {/* بج سمت */}
          <div className="text-center mb-4">
            <div
              className={`inline-flex items-center gap-1.5 bg-gradient-to-l ${config.gradient} text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md`}
            >
              <PosIcon size={13} />
              <span>{config.label}</span>
            </div>
          </div>

          {/* عکس */}
          <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-white border-4 border-white shadow-xl">
            {teacher.photo_url ? (
              <img
                src={teacher.photo_url}
                alt={teacher.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}
              >
                <span className="text-white font-bold text-4xl">
                  {teacher.name?.charAt(0) || '؟'}
                </span>
              </div>
            )}
          </div>

          {/* نام */}
          <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-900 mt-4">
            {teacher.name}
          </h2>

          {teacher.hire_date && (
            <p className="text-center text-xs text-gray-500 mt-1.5 fa-num">
              از سال {toFaNum(teacher.hire_date.split('/')[0])}
            </p>
          )}
        </div>

        {/* ═══ اطلاعات ═══ */}
        <div className="p-5 space-y-3">
          {/* شماره تماس */}
          {teacher.phone && (
            <InfoRow
              icon={Phone}
              label="شماره تماس"
              value={toFaNum(teacher.phone)}
              ltr
            />
          )}

          {/* واتساپ */}
          {teacher.whatsapp && teacher.whatsapp !== teacher.phone && (
            <InfoRow
              icon={MessageCircle}
              label="شماره واتساپ"
              value={toFaNum(teacher.whatsapp)}
              ltr
            />
          )}

          {/* تاریخ استخدام کامل */}
          {teacher.hire_date && (
            <InfoRow
              icon={Calendar}
              label="تاریخ استخدام"
              value={teacher.hire_date}
            />
          )}

          {/* آدرس */}
          {teacher.address && (
            <InfoRow icon={MapPin} label="آدرس" value={teacher.address} />
          )}

          {/* یادداشت */}
          {teacher.notes && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <FileText size={15} className="text-gray-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-gray-500 mb-0.5">یادداشت</p>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {teacher.notes}
                </p>
              </div>
            </div>
          )}

          {!teacher.phone && !teacher.address && !teacher.hire_date && !teacher.notes && (
            <div className="text-center py-6">
              <UserCircle size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">
                اطلاعات تکمیلی برای این معلم ثبت نشده است
              </p>
            </div>
          )}
        </div>

        {/* ═══ دکمه‌ها ═══ */}
        <div className="border-t border-gray-100 p-4 space-y-2">
          <div className="flex gap-2">
            {hasWhatsApp && (
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                <MessageCircle size={16} />
                <span>واتساپ</span>
              </button>
            )}
            {teacher.phone && (
              <a
                href={`tel:${teacher.phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-l from-brand-600 to-brand-800 hover:from-brand-700 hover:to-brand-900 text-white text-sm font-medium py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                <Phone size={16} />
                <span>تماس</span>
              </a>
            )}
          </div>

          <button
            onClick={() => {
              onClose()
              onEdit(teacher)
            }}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-brand-300 hover:bg-brand-50 text-gray-700 hover:text-brand-700 text-sm font-medium py-3 rounded-xl transition-all"
          >
            <Pencil size={15} />
            <span>ویرایش اطلاعات</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, ltr }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-brand-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-gray-500">{label}</p>
        <p
          className="text-sm font-medium text-gray-900 break-words"
          dir={ltr ? 'ltr' : 'rtl'}
          style={ltr ? { textAlign: 'right' } : undefined}
        >
          {value}
        </p>
      </div>
    </div>
  )
}