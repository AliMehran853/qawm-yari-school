import {
  Users,
  Phone,
  MessageCircle,
  Crown,
  Star,
  Briefcase,
} from 'lucide-react'
import { useTeachers } from '../../teachers/useTeachers'
import { useSettings } from '../../settings/useSettings'
import { normalizeWhatsApp, openWhatsApp } from '../../../utils/whatsapp'
import { toFaNum } from '../../../utils/number'

export default function StaffPage() {
  const { data: teachers, isLoading } = useTeachers()
  const { data: settings } = useSettings()

  const schoolName = settings?.school_name || 'مکتب قوم یاری'

  const principal = teachers?.find((t) => t.position === 'principal')
  const headTeacher = teachers?.find((t) => t.position === 'head_teacher')

  const teachingStaff = (teachers || []).filter(
    (t) =>
      t.position === 'teacher' ||
      (!t.position && t.position !== 'principal')
  )

  const staffMembers = (teachers || []).filter((t) => t.position === 'staff')

  function handleWhatsApp(t) {
    const number = t.whatsapp || t.phone
    const normalized = normalizeWhatsApp(number)
    if (!normalized) return
    openWhatsApp(
      number,
      `سلام ${t.name} عزیز.\nاز سایت ${schoolName} تماس می‌گیرم.`
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      {/* ─── هدر ─── */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-brand-100 mb-4">
          <Users size={14} />
          <span>تیم مکتب</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-700">
          کادر آموزشی
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          معلمان و کادر مکتب {schoolName}
        </p>
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
          <p className="text-gray-500">اطلاعات کادر هنوز ثبت نشده</p>
        </div>
      ) : (
        <>
          {/* ═══ ۱. آمر ═══ */}
          {principal && (
            <section className="mb-10 sm:mb-14">
              <div className="max-w-md mx-auto">
                <SectionLabel
                  icon={Crown}
                  text="آمر مکتب"
                  color="gold"
                  centered
                />
                <FeaturedCard
                  person={principal}
                  badge="آمر مکتب"
                  badgeIcon={Crown}
                  variant="principal"
                  onWhatsApp={() => handleWhatsApp(principal)}
                />
              </div>
            </section>
          )}

          {/* ═══ ۲. سرمعلم ═══ */}
          {headTeacher && (
            <section className="mb-10 sm:mb-14">
              <div className="max-w-md mx-auto">
                <SectionLabel
                  icon={Star}
                  text="سرمعلم"
                  color="brand"
                  centered
                />
                <FeaturedCard
                  person={headTeacher}
                  badge="سرمعلم"
                  badgeIcon={Star}
                  variant="head"
                  onWhatsApp={() => handleWhatsApp(headTeacher)}
                />
              </div>
            </section>
          )}

          {/* ═══ ۳. معلمان ═══ */}
          {teachingStaff.length > 0 && (
            <section className="mb-10 sm:mb-14">
              <SectionLabel
                icon={Users}
                text="معلمان"
                count={teachingStaff.length}
                color="brand"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachingStaff.map((t) => (
                  <TeacherCard
                    key={t.id}
                    teacher={t}
                    onWhatsApp={() => handleWhatsApp(t)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ═══ ۴. ملازمان و خدمه ═══ */}
          {staffMembers.length > 0 && (
            <section>
              <SectionLabel
                icon={Briefcase}
                text="ملازمان و خدمه"
                count={staffMembers.length}
                color="gray"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {staffMembers.map((t) => (
                  <StaffCard
                    key={t.id}
                    person={t}
                    onWhatsApp={() => handleWhatsApp(t)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   برچسب بخش
   ═══════════════════════════════════════ */
function SectionLabel({ icon: Icon, text, count, color = 'brand', centered }) {
  const colors = {
    gold: 'from-gold-400 to-gold-600',
    brand: 'from-brand-500 to-brand-700',
    gray: 'from-gray-400 to-gray-600',
  }

  if (centered) {
    // حالت وسط‌چین برای کارت‌های ویژه
    return (
      <div className="flex flex-col items-center gap-2 mb-5">
        <div
          className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-md`}
        >
          <Icon size={18} className="text-white" />
        </div>
        <h2 className="font-bold text-xl sm:text-2xl text-gray-900">{text}</h2>
        <div className="w-12 h-1 bg-gradient-to-l from-brand-500 to-gold-500 rounded-full" />
      </div>
    )
  }

  // حالت معمولی (سمت راست)
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-md`}
      >
        <Icon size={16} className="text-white" />
      </div>
      <h2 className="font-bold text-lg sm:text-xl text-gray-900">{text}</h2>
      {count !== undefined && (
        <span className="badge badge-gray text-[10px] fa-num">
          {toFaNum(count)} نفر
        </span>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   کارت ویژه (آمر و سرمعلم)
   ═══════════════════════════════════════ */
function FeaturedCard({
  person,
  badge,
  badgeIcon: BadgeIcon,
  variant,
  onWhatsApp,
}) {
  const hasContact = person.whatsapp || person.phone

  const styles =
    variant === 'principal'
      ? {
          card: 'border-gold-200 from-gold-50/60 via-white to-white',
          badge: 'bg-gradient-to-l from-gold-400 to-gold-600 text-white',
          avatarBorder: 'border-gold-200',
          nameColor: 'text-gold-900',
          avatarSize: 'w-28 h-28 sm:w-36 sm:h-36',
          nameSize: 'text-xl sm:text-2xl',
          glow: 'shadow-[0_20px_50px_-12px_rgba(245,158,11,0.35)]',
        }
      : {
          card: 'border-brand-200 from-brand-50/60 via-white to-white',
          badge: 'bg-gradient-to-l from-brand-500 to-brand-700 text-white',
          avatarBorder: 'border-brand-200',
          nameColor: 'text-brand-900',
          avatarSize: 'w-24 h-24 sm:w-32 sm:h-32',
          nameSize: 'text-lg sm:text-xl',
          glow: 'shadow-[0_20px_50px_-12px_rgba(67,56,202,0.35)]',
        }

  return (
    <div
      className={`relative rounded-3xl border-2 bg-gradient-to-br ${styles.card} p-6 sm:p-8 text-center overflow-hidden ${styles.glow}`}
    >
      <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-white/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-white/40 blur-3xl pointer-events-none" />

      <div className="relative">
        <div
          className={`inline-flex items-center gap-1.5 ${styles.badge} text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md mb-5`}
        >
          <BadgeIcon size={13} />
          <span>{badge}</span>
        </div>

        <div
          className={`${styles.avatarSize} mx-auto rounded-full overflow-hidden bg-white border-4 ${styles.avatarBorder} shadow-xl mb-4`}
        >
          {person.photo_url ? (
            <img
              src={person.photo_url}
              alt={person.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-bold text-4xl">
                {person.name?.charAt(0) || '؟'}
              </span>
            </div>
          )}
        </div>

        <h3
          className={`${styles.nameSize} font-bold ${styles.nameColor} leading-snug`}
        >
          {person.name}
        </h3>

        {person.hire_date && (
          <p className="text-xs text-gray-500 mt-1.5 fa-num">
            از سال {toFaNum(person.hire_date.split('/')[0])}
          </p>
        )}

        {person.address && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
            {person.address}
          </p>
        )}

        {hasContact && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={onWhatsApp}
              className="flex items-center gap-1.5 text-xs font-medium text-white bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <MessageCircle size={14} />
              <span>واتساپ</span>
            </button>
            {person.phone && (
              <a
                href={`tel:${person.phone}`}
                className="flex items-center gap-1.5 text-xs font-medium text-white bg-gradient-to-l from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <Phone size={14} />
                <span>تماس</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   کارت معلم
   ═══════════════════════════════════════ */
function TeacherCard({ teacher: t, onWhatsApp }) {
  const hasContact = t.whatsapp || t.phone

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-card hover:-translate-y-1 hover:border-brand-200 transition-all duration-300">
      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md mb-3">
        {t.photo_url ? (
          <img
            src={t.photo_url}
            alt={t.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
            <span className="text-brand-700 font-bold text-2xl">
              {t.name?.charAt(0) || '؟'}
            </span>
          </div>
        )}
      </div>

      <h3 className="font-bold text-gray-900 leading-snug line-clamp-1">
        {t.name}
      </h3>

      {t.hire_date && (
        <p className="text-[11px] text-gray-500 mt-1.5 fa-num">
          از سال {toFaNum(t.hire_date.split('/')[0])}
        </p>
      )}

      {t.address && (
        <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
          {t.address}
        </p>
      )}

      {hasContact && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <button
            onClick={onWhatsApp}
            className="flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition"
          >
            <MessageCircle size={12} />
            <span>واتساپ</span>
          </button>
          {t.phone && (
            <a
              href={`tel:${t.phone}`}
              className="flex items-center gap-1 text-[11px] font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition"
            >
              <Phone size={12} />
              <span>تماس</span>
            </a>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   کارت ملازم / خدمه
   ═══════════════════════════════════════ */
function StaffCard({ person: t, onWhatsApp }) {
  const hasContact = t.whatsapp || t.phone

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-card hover:border-gray-300 transition-all duration-300">
      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm mb-3">
        {t.photo_url ? (
          <img
            src={t.photo_url}
            alt={t.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-bold text-lg">
              {t.name?.charAt(0) || '؟'}
            </span>
          </div>
        )}
      </div>

      <h3 className="font-medium text-sm text-gray-900 leading-snug line-clamp-1">
        {t.name}
      </h3>

      <p className="text-[10px] text-gray-400 mt-1">ملازم / خدمه</p>

      {hasContact && (
        <button
          onClick={onWhatsApp}
          className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition"
        >
          <MessageCircle size={11} />
          <span>واتساپ</span>
        </button>
      )}
    </div>
  )
}