import {
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  BookOpen,
  Sparkles,
  GraduationCap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { useSettings } from '../../settings/useSettings'

// ─── عکس مکتب ───
import schoolPicture from '../../../assets/pictures/school-picture1.webp'

export default function AboutPage() {
  const { data: settings } = useSettings()

  const schoolName = settings?.school_name || 'مکتب قوم یاری'
  const fullName = settings?.school_full_name || 'لیسه قوم یاری'
  const description = settings?.description
  const address = settings?.address || 'ولسوالی ورس، ولایت بامیان'

  // اطلاعات سریع
  const infoItems = [
    {
      icon: MapPin,
      label: 'موقعیت',
      value: address,
      color: 'brand',
    },
    settings?.established_year && {
      icon: Calendar,
      label: 'سال تأسیس',
      value: `سال ${settings.established_year} شمسی`,
      color: 'gold',
    },
    settings?.principal_name && {
      icon: User,
      label: 'آمر مکتب',
      value: settings.principal_name,
      color: 'accent',
    },
    {
      icon: BookOpen,
      label: 'نوع مکتب',
      value: 'لیسه دولتی',
      color: 'info',
    },
    settings?.phone && {
      icon: Phone,
      label: 'شماره تماس',
      value: settings.phone,
      link: `tel:${settings.phone}`,
      color: 'brand',
      ltr: true,
    },
    settings?.email && {
      icon: Mail,
      label: 'ایمیل',
      value: settings.email,
      link: `mailto:${settings.email}`,
      color: 'info',
      ltr: true,
    },
  ].filter(Boolean)

  return (
    <>
      {/* ═══ Hero کوچک ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={schoolPicture}
            alt={schoolName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay-mobile sm:hidden" />
          <div className="absolute inset-0 bg-gradient-to-l from-brand-950/90 via-brand-900/75 to-brand-800/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white/95 text-xs px-3 py-1.5 rounded-full border border-white/20 mb-4">
              <Sparkles size={12} className="text-gold-300" />
              <span>درباره مکتب</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white drop-shadow-lg">
              {schoolName}
            </h1>

            {fullName && (
              <p className="text-white/85 mt-3 text-base sm:text-lg font-light">
                {fullName}
              </p>
            )}

            <p className="text-white/70 mt-4 text-sm leading-relaxed max-w-lg">
              آشنایی با تاریخچه، اهداف و فعالیت‌های آموزشی مکتب
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* ═══ معرفی کامل ═══ */}
      <section className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
        {description ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
                <GraduationCap size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">
                  معرفی مکتب
                </h2>
                <div className="w-10 h-0.5 bg-gradient-to-l from-brand-500 to-gold-500 rounded-full mt-1" />
              </div>
            </div>

            <p className="text-gray-700 leading-loose text-sm sm:text-base whitespace-pre-wrap">
              {description}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] p-8 text-center">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              اطلاعات مکتب هنوز ثبت نشده است
            </p>
          </div>
        )}
      </section>

      {/* ═══ اطلاعات سریع ═══ */}
      <section className="max-w-4xl mx-auto px-4 mt-8 sm:mt-10">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} className="text-brand-700" />
          <h2 className="font-bold text-lg sm:text-xl text-gray-900">
            اطلاعات سریع
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {infoItems.map((item, idx) => (
            <InfoCard key={idx} {...item} />
          ))}
        </div>
      </section>

      {/* ═══ CTA تماس ═══ */}
      <section className="max-w-4xl mx-auto px-4 mt-10 sm:mt-12 mb-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-brand-700 via-brand-800 to-brand-900 shadow-[0_20px_50px_-12px_rgba(67,56,202,0.4)]">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 30%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 1.5px, transparent 1.5px)',
                backgroundSize: '40px 40px, 60px 60px',
              }}
            />
          </div>

          <div className="relative p-7 sm:p-10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              سؤال یا درخواستی دارید؟
            </h2>
            <p className="text-white/80 mt-2 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              برای ثبت‌نام فرزندتان یا هرگونه سؤال با ما در تماس باشید
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-6 bg-white text-brand-800 hover:bg-white/95 px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Phone size={18} />
              <span>تماس با ما</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function InfoCard({ icon: Icon, label, value, link, color = 'brand', ltr }) {
  const styles = {
    brand: {
      card: 'border-brand-100 bg-gradient-to-br from-brand-50/60 to-white',
      icon: 'bg-gradient-to-br from-brand-500 to-brand-700',
      label: 'text-brand-600',
      value: 'text-brand-900',
    },
    gold: {
      card: 'border-gold-100 bg-gradient-to-br from-gold-50/60 to-white',
      icon: 'bg-gradient-to-br from-gold-400 to-gold-600',
      label: 'text-gold-700',
      value: 'text-gold-800',
    },
    accent: {
      card: 'border-accent-100 bg-gradient-to-br from-accent-50/60 to-white',
      icon: 'bg-gradient-to-br from-accent-500 to-accent-600',
      label: 'text-accent-600',
      value: 'text-accent-600',
    },
    info: {
      card: 'border-blue-100 bg-gradient-to-br from-blue-50/60 to-white',
      icon: 'bg-gradient-to-br from-sky-400 to-blue-600',
      label: 'text-blue-700',
      value: 'text-blue-900',
    },
  }
  const s = styles[color] || styles.brand

  const content = (
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-2xl ${s.icon} flex items-center justify-center shrink-0 shadow-md`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-xs ${s.label} font-medium mb-0.5`}>{label}</p>
        <p
          className={`text-sm font-bold ${s.value} leading-snug break-words`}
          dir={ltr ? 'ltr' : 'rtl'}
        >
          {value}
        </p>
      </div>
    </div>
  )

  if (link) {
    return (
      <a
        href={link}
        className={`block rounded-2xl border ${s.card} p-4 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200`}
      >
        {content}
      </a>
    )
  }

  return <div className={`rounded-2xl border ${s.card} p-4`}>{content}</div>
}