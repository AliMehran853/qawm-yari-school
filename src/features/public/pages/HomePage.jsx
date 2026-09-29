import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Users,
  School,
  Bell,
  ArrowLeft,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  BookOpen,
} from 'lucide-react'

// ─── عکس Hero ───
import heroImage from '../../../assets/pictures/Hero-school.webp'

import { useSettings } from '../../settings/useSettings'
import { useTeachers } from '../../teachers/useTeachers'
import { useClasses } from '../../classes/useClasses'
import { useAnnouncements } from '../../announcements/useAnnouncements'
import { useGallery, useGalleryCounts } from '../../gallery/useGallery'
import { formatJalali } from '../../../utils/date'
import { toFaNum } from '../../../utils/number'

export default function HomePage() {
  const { data: settings } = useSettings()
  const { data: teachers } = useTeachers()
  const { data: classes } = useClasses()
  const { data: announcements } = useAnnouncements()
  const { data: gallery } = useGallery({ page: 0 })
  const { data: galleryCounts } = useGalleryCounts()

  const schoolName = settings?.school_name || 'مکتب قوم یاری'
  const fullName = settings?.school_full_name || 'لیسه قوم یاری'
  const address = settings?.address || 'ولسوالی ورس، بامیان'
  const tagline =
    settings?.hero_tagline ||
    'لیسه‌ای فعال در قلب ورس که نسل آینده را آموزش می‌دهد.'

  const recentAnnouncements = (announcements || []).slice(0, 3)
  const previewPhotos = (gallery?.items || []).slice(0, 4)

  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={schoolName}
            className="w-full h-full object-cover object-[center_70%]"
            loading="eager"
          />
          <div className="absolute inset-0 hero-overlay-mobile sm:hidden" />
          <div className="absolute inset-0 hero-overlay hidden sm:block" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 lg:py-24 min-h-[480px] sm:min-h-[560px] flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white/95 text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-white/20 mb-5">
              <Sparkles size={14} className="text-gold-300" />
              <span>لیسه دولتی — ولسوالی ورس</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] text-white drop-shadow-lg">
              {schoolName}
            </h1>

            {fullName && (
              <p className="text-white/85 mt-3 text-base sm:text-lg lg:text-xl font-light">
                {fullName}
              </p>
            )}

            <p className="text-white/80 mt-5 leading-relaxed text-sm sm:text-base max-w-xl">
              {tagline}
            </p>

            <div className="flex items-center gap-2 mt-5 text-sm text-white/70">
              <MapPin size={16} />
              <span>{address}</span>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-white text-brand-900 hover:bg-white/95 px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>درباره مکتب</span>
                <ArrowLeft size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all"
              >
                <span>تماس با ما</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* ═══ آمار سریع ═══ */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 sm:-mt-16 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <QuickStat
            icon={GraduationCap}
            label="صنف"
            value={classes?.length ? toFaNum(classes.length) : '۱۲'}
            color="brand"
          />
          <QuickStat
            icon={Users}
            label="معلم"
            value={teachers ? toFaNum(teachers.length) : '—'}
            color="gold"
          />
          <QuickStat
            icon={Bell}
            label="اعلان"
            value={announcements ? toFaNum(announcements.length) : '۰'}
            color="accent"
          />
          <QuickStat
            icon={ImageIcon}
            label="عکس"
            value={
              galleryCounts?.all
                ? toFaNum(galleryCounts.all)
                : gallery?.total
                ? toFaNum(gallery.total)
                : '۰'
            }
            color="info"
          />
        </div>
      </section>

      {/* ═══ اخبار اخیر ═══ */}
      {recentAnnouncements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-16 sm:mt-20">
          <SectionHeader
            title="آخرین اخبار و اعلانات"
            link="/news"
            linkLabel="مشاهده همه"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {recentAnnouncements.map((a) => (
              <NewsCard key={a.id} announcement={a} />
            ))}
          </div>
        </section>
      )}

      {/* ═══ گالری پیش‌نمایش (فشرده) ═══ */}
      {previewPhotos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-16 sm:mt-20">
          <SectionHeader
            title="گالری تصاویر"
            link="/photos"
            linkLabel="مشاهده همه"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {previewPhotos.map((p) => (
              <Link
                key={p.id}
                to="/photos"
                className="group relative rounded-2xl overflow-hidden bg-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 aspect-square"
              >
                <img
                  src={p.image_url}
                  alt={p.title || ''}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                {p.title && (
                  <div className="absolute bottom-2 right-2 left-2 text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 transition line-clamp-1">
                    {p.title}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {galleryCounts?.all > 4 && (
            <div className="text-center mt-5 sm:hidden">
              <Link
                to="/photos"
                className="inline-flex items-center gap-2 text-sm text-brand-700 hover:text-brand-800 font-medium border border-brand-200 bg-brand-50 px-4 py-2 rounded-xl transition"
              >
                <ImageIcon size={14} />
                <span>مشاهده همه ({toFaNum(galleryCounts.all)})</span>
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ═══ دعوت به تماس ═══ */}
      <section className="max-w-7xl mx-auto px-4 mt-16 sm:mt-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-gold-500 via-gold-500 to-gold-600 shadow-hero">
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

          <div className="relative p-8 sm:p-12 lg:p-14 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-5">
              <BookOpen size={28} className="text-white" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              به مکتب ما بپیوندید
            </h2>
            <p className="text-white/90 mt-3 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
              برای ثبت‌نام فرزندتان یا هرگونه سؤال، تیم ما آماده پاسخگویی است
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-7 bg-white text-gold-700 hover:bg-white/95 px-7 py-3.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>تماس با ما</span>
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════════════
   کارت آمار
   ═══════════════════════════════════════ */
function QuickStat({ icon: Icon, label, value, color }) {
  const styles = {
    brand: {
      bar: 'from-brand-400 to-brand-600',
      iconBg: 'bg-brand-50',
      iconColor: 'text-brand-700',
      label: 'text-brand-600',
      ring: 'hover:ring-brand-200',
    },
    gold: {
      bar: 'from-gold-400 to-gold-600',
      iconBg: 'bg-gold-50',
      iconColor: 'text-gold-700',
      label: 'text-gold-700',
      ring: 'hover:ring-gold-200',
    },
    accent: {
      bar: 'from-accent-400 to-accent-600',
      iconBg: 'bg-accent-50',
      iconColor: 'text-accent-600',
      label: 'text-accent-600',
      ring: 'hover:ring-accent-100',
    },
    info: {
      bar: 'from-sky-400 to-blue-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-700',
      label: 'text-blue-700',
      ring: 'hover:ring-blue-200',
    },
  }
  const s = styles[color] || styles.brand

  return (
    <div
      className={`relative bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:ring-4 ${s.ring} transition-all duration-300 overflow-hidden`}
    >
      <div
        className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-l ${s.bar}`}
      />
      <div
        className={`absolute -top-8 -left-8 w-24 h-24 rounded-full ${s.iconBg} opacity-40 blur-2xl pointer-events-none`}
      />

      <div className="relative">
        <div
          className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center mb-3`}
        >
          <Icon size={20} className={s.iconColor} />
        </div>

        <p className="text-2xl sm:text-3xl font-bold text-gray-900 fa-num leading-none">
          {value}
        </p>

        <p className={`text-xs sm:text-sm ${s.label} mt-1.5 font-medium`}>
          {label}
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   هدر بخش
   ═══════════════════════════════════════ */
function SectionHeader({ title, link, linkLabel }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        <div className="w-12 h-1 bg-gradient-to-l from-brand-500 to-gold-500 rounded-full mt-2" />
      </div>
      {link && (
        <Link
          to={link}
          className="group flex items-center gap-1 text-xs sm:text-sm text-brand-700 hover:text-brand-800 font-medium"
        >
          <span>{linkLabel}</span>
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </Link>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   کارت خبر
   ═══════════════════════════════════════ */
function NewsCard({ announcement }) {
  const PRIORITY_STYLE = {
    normal: {
      label: 'عادی',
      badge: 'badge-gray',
      accent: 'from-gray-400 to-gray-500',
    },
    important: {
      label: 'مهم',
      badge: 'badge-warning',
      accent: 'from-orange-400 to-orange-600',
    },
    urgent: {
      label: 'فوری',
      badge: 'badge-danger',
      accent: 'from-red-400 to-red-600',
    },
  }
  const style = PRIORITY_STYLE[announcement.priority] || PRIORITY_STYLE.normal

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div
        className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-l ${style.accent}`}
      />

      <div className="flex items-center gap-2 mb-3">
        <span className={`badge ${style.badge} text-[10px]`}>{style.label}</span>
        <span className="text-[10px] text-gray-400 mr-auto fa-num">
          {formatJalali(announcement.created_at, 'yyyy/MM/dd')}
        </span>
      </div>

      <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-700 transition">
        {announcement.title}
      </h3>
      <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">
        {announcement.body}
      </p>
    </div>
