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
  BookOpen,
  GraduationCap,
  Loader2,
} from 'lucide-react'
import { toFaNum } from '../../../utils/number'
import { normalizeWhatsApp, openWhatsApp } from '../../../utils/whatsapp'
import { useTeacherDetails } from '../useTeachers'

const POSITION_CONFIG = {
  principal: {
    label: 'آمر',
    icon: Crown,
    gradient: 'from-gold-400 to-gold-600',
    bg: 'from-gold-50 to-white',
    border: 'border-gold-200',
  },
  head_teacher: {
    label: 'سرمعلم',
    icon: Star,
    gradient: 'from-brand-500 to-brand-700',
    bg: 'from-brand-50 to-white',
    border: 'border-brand-200',
  },
  teacher: {
    label: 'معلم',
    icon: User,
    gradient: 'from-emerald-500 to-emerald-700',
    bg: 'from-emerald-50 to-white',
    border: 'border-emerald-200',
  },
  staff: {
    label: 'ملازم / خدمه',
    icon: Briefcase,
    gradient: 'from-gray-500 to-gray-700',
    bg: 'from-gray-50 to-white',
    border: 'border-gray-200',
  },
}

export default function TeacherDetailModal({ open, teacher, onClose, onEdit }) {
  const { data: details, isLoading } = useTeacherDetails(
    open ? teacher?.id : null
  )

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

  const data = details || teacher

  const config = POSITION_CONFIG[data.position] || POSITION_CONFIG.teacher
  const PosIcon = config.icon

  const hasWhatsApp = !!normalizeWhatsApp(data.whatsapp || data.phone)
  const isTeaching = (data.assignments_count || 0) > 0

  function handleWhatsApp() {
    const number = data.whatsapp || data.phone
    if (!normalizeWhatsApp(number)) return
    openWhatsApp(number, `سلام ${data.name} عزیز.`)
  }

  function handleEditClick() {
    onClose()
    setTimeout(() => {
      onEdit(data)
    }, 100)
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
        <div
          className={`relative bg-gradient-to-br ${config.bg} border-b ${config.border} pt-6 pb-20 px-5 sm:rounded-t-3xl`}
        >
          <button
            onClick={onClose}
            className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition z-10"
            aria-label="بستن"
          >
            <X size={18} className="text-gray-600" />
          </button>

          <div className="text-center mb-4">
            <div
              className={`inline-flex items-center gap-1.5 bg-gradient-to-l ${config.gradient} text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md`}
            >
              <PosIcon size={13} />
              <span>{config.label}</span>
            </div>
          </div>

          <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-white border-4 border-white shadow-xl">
            {data.photo_url ? (
              <img
                src={data.photo_url}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}
              >
                <span className="text-white font-bold text-4xl">
                  {data.name?.charAt(0) || '؟'}
                </span>
              </div>
            )}
          </div>

          <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-900 mt-4">
            {data.name}
          </h2>

          {data.hire_date && (
            <p className="text-center text-xs text-gray-500 mt-1.5 fa-num">
              از سال {toFaNum(data.hire_date.split('/')[0])}
            </p>
          )}
        </div>

        <div className="p-5 space-y-3">
          {isLoading ? (
            <div className="bg-gradient-to-bl from-brand-700 to-brand-900 rounded-2xl p-6 shadow-lg text-center">
              <Loader2
                size={22}
                className="text-white animate-spin mx-auto"
              />
              <p className="text-xs text-white/70 mt-2">
                در حال بارگذاری...
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-bl from-brand-700 to-brand-900 rounded-2xl p-4 shadow-lg relative overflow-hidden">
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <BookOpen size={14} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    خلاصه تدریس
                  </h3>
                  {!isTeaching && (
                    <span className="text-[10px] text-white/60 mr-auto">
                      تدریسی ثبت نشده
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 border border-white/20 text-center">
                    <BookOpen
                      size={12}
                      className="text-white/70 mx-auto mb-1"
                    />
                    <p className="text-lg font-bold text-white fa-num leading-none">
                      {toFaNum(data.subjects_count || 0)}
                    </p>
                    <p className="text-[9px] text-white/70 mt-0.5">مضمون</p>
                  </div>

                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 border border-white/20 text-center">
                    <GraduationCap
                      size={12}
                      className="text-white/70 mx-auto mb-1"
                    />
                    <p className="text-lg font-bold text-white fa-num leading-none">
                      {toFaNum(data.grades_count || 0)}
                    </p>
                    <p className="text-[9px] text-white/70 mt-0.5">صنف</p>
                  </div>

                  <div
                    className={`rounded-xl p-2.5 text-center ${
                      isTeaching
                        ? 'bg-gradient-to-br from-gold-400 to-gold-600 border-2 border-gold-300'
                        : 'bg-white/15 border border-white/20'
                    }`}
                  >
                    <BookOpen
                      size={12}
                      className={
                        isTeaching ? 'text-white' : 'text-white/70'
                      }
                    />
                    <p
                      className={`text-lg font-bold fa-num leading-none mt-1 ${
                        isTeaching ? 'text-white' : 'text-white/70'
                      }`}
                    >
                      {toFaNum(data.assignments_count || 0)}
                    </p>
                    <p
                      className={`text-[9px] mt-0.5 ${
                        isTeaching ? 'text-white/90' : 'text-white/60'
                      }`}
                    >
                      تعیین کل
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLoading &&
            details?.byGrade &&
            Object.keys(details.byGrade).length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                  <h3 className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                    <GraduationCap size={13} className="text-brand-700" />
                    <span>مضامین تدریسی</span>
                    <span className="text-[10px] text-gray-500 font-normal mr-auto fa-num">
                      {toFaNum(Object.keys(details.byGrade).length)} صنف
                    </span>
                  </h3>
                </div>

                <div className="divide-y divide-gray-100 max-h-[240px] overflow-y-auto">
                  {Object.entries(details.byGrade)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([grade, items]) => (
                      <div key={grade} className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white text-xs font-bold fa-num shadow-sm">
                            {toFaNum(grade)}
                          </span>
                          <span className="text-xs font-medium text-gray-700">
                            صنف {toFaNum(grade)}
                          </span>
                          <span className="text-[10px] text-gray-400 mr-auto fa-num">
                            {toFaNum(items.length)} مضمون
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pr-9">
                          {items.map((item) => (
                            <span
                              key={item.id}
                              className="text-[10px] text-brand-800 bg-brand-50 border border-brand-100 px-2 py-1 rounded-full"
                            >
                              {item.subject?.name || '—'}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {data.phone && (
            <InfoRow
              icon={Phone}
              label="شماره تماس"
              value={toFaNum(data.phone)}
              ltr
            />
          )}

          {data.whatsapp && data.whatsapp !== data.phone && (
            <InfoRow
              icon={MessageCircle}
              label="شماره واتساپ"
              value={toFaNum(data.whatsapp)}
              ltr
            />
          )}

          {data.hire_date && (
            <InfoRow
              icon={Calendar}
              label="تاریخ استخدام"
              value={data.hire_date}
            />
          )}

          {data.address && (
            <InfoRow icon={MapPin} label="آدرس" value={data.address} />
          )}

          {data.notes && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <FileText size={15} className="text-gray-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-gray-500 mb-0.5">یادداشت</p>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {data.notes}
                </p>
              </div>
            </div>
          )}

          {!data.phone &&
            !data.address &&
            !data.hire_date &&
            !data.notes &&
            !isTeaching &&
            !isLoading && (
              <div className="text-center py-6">
                <UserCircle
                  size={40}
                  className="mx-auto text-gray-300 mb-2"
                />
                <p className="text-sm text-gray-500">
                  اطلاعات تکمیلی ثبت نشده است
                </p>
              </div>
            )}
        </div>

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
            {data.phone && (
              <a
                href={`tel:${data.phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-l from-brand-600 to-brand-800 hover:from-brand-700 hover:to-brand-900 text-white text-sm font-medium py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                <Phone size={16} />
                <span>تماس</span>
              </a>
            )}
          </div>

          <button
            onClick={handleEditClick}
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