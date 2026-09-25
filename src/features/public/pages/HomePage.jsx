import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Users,
  School,
  Bell,
  ArrowLeft,
  Image as ImageIcon,
  MapPin,
  CalendarCheck,
} from 'lucide-react'

import { useSettings } from '../../settings/useSettings'
import { useTeachers } from '../../teachers/useTeachers'
import { useClasses } from '../../classes/useClasses'
import { useAnnouncements } from '../../announcements/useAnnouncements'
import { useGallery } from '../../gallery/useGallery'
import { formatJalali } from '../../../utils/date'
import { toFaNum } from '../../../utils/number'

export default function HomePage() {
  const { data: settings } = useSettings()
  const { data: teachers } = useTeachers()
  const { data: classes } = useClasses()
  const { data: announcements } = useAnnouncements()
  const { data: gallery } = useGallery()

  const schoolName = settings?.school_name || 'مکتب قوم یاری'
  const fullName = settings?.school_full_name || ''
  const address = settings?.address || 'ولسوالی ورس، بامیان'

  const recentAnnouncements = (announcements || [])
    .slice(0, 3)
  const previewPhotos = (gallery || []).slice(0, 6)

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative bg-gradient-to-bl from-brand-700 to-brand-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px, 60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            {settings?.logo_url && (
              <img
                src={settings.logo_url}
                alt={schoolName}
                className="w-16 h-16 rounded-2xl object-cover mb-4 shadow-lg"
              />
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {schoolName}
            </h1>
            {fullName && (
              <p className="text-white/80 mt-2 text-base sm:text-lg">{fullName}</p>
            )}
            <p className="text-white/70 mt-4 leading-relaxed text-sm sm:text-base">
              {settings?.description ||
                'مکتب قوم یاری یکی از مکاتب فعال در ولسوالی ورس، ولایت بامیان است که در خدمت دانش‌آموزان این منطقه می‌باشد.'}
            </p>

            <div className="flex items-center gap-2 mt-5 text-sm text-white/80">
              <MapPin size={16} />
              <span>{address}</span>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/about"
                className="btn bg-white text-brand-700 hover:bg-white/90"
                size="lg"
              >
                <span>درباره مکتب</span>
                <ArrowLeft size={18} />
              </Link>
              <Link
                to="/contact"
                className="btn border border-white/30 text-white hover:bg-white/10"
                size="lg"
              >
                <span>تماس با ما</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── آمار سریع ─── */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
            color="blue"
          />
          <QuickStat
            icon={ImageIcon}
            label="عکس"
            value={gallery ? toFaNum(gallery.length) : '۰'}
            color="purple"
          />
        </div>
      </section>

      {/* ─── اخبار اخیر ─── */}
      {recentAnnouncements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12 sm:mt-16">
          <SectionHeader
            title="آخرین اخبار و اعلانات"
            link="/news"
            linkLabel="مشاهده همه"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {recentAnnouncements.map((a) => (
              <NewsCard key={a.id} announcement={a} />
            ))}
          </div>
        </section>
      )}

      {/* ─── گالری ─── */}
      {previewPhotos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12 sm:mt-16">
          <SectionHeader
            title="گالری تصاویر"
            link="/photos"
            linkLabel="مشاهده همه"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previewPhotos.map((p) => (
              <Link
                key={p.id}
                to="/photos"
                className="aspect-square rounded-xl overflow-hidden bg-gray-100 group"
              >
                <img
                  src={p.image_url}
                  alt={p.title || ''}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="max-w-7xl mx-auto px-4 mt-12 sm:mt-16">
        <div className="rounded-2xl bg-gradient-to-l from-gold-500 to-gold-600 text-white p-6 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            به مکتب ما بپیوندید
          </h2>
          <p className="text-white/90 mt-2 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            برای ثبت‌نام فرزندتان یا هرگونه سؤال با ما تماس بگیرید
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-5 bg-white text-gold-700 hover:bg-white/90 px-5 py-2.5 rounded-lg font-medium transition"
          >
            <span>تماس با ما</span>
            <ArrowLeft size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}

function QuickStat({ icon: Icon, label, value, color }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-700',
    gold: 'bg-gold-50 text-gold-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-card">
      <div
        className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}
      >
        <Icon size={20} />
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 fa-num">
        {value}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

function SectionHeader({ title, link, linkLabel }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
        {title}
      </h2>
      {link && (
        <Link
          to={link}
          className="flex items-center gap-1 text-xs sm:text-sm text-brand-700 hover:text-brand-800 font-medium"
        >
          <span>{linkLabel}</span>
          <ArrowLeft size={14} />
        </Link>
      )}
    </div>
  )
}

function NewsCard({ announcement }) {
  const PRIORITY_STYLE = {
    normal: { label: 'عادی', badge: 'badge-gray' },
    important: { label: 'مهم', badge: 'badge-warning' },
    urgent: { label: 'فوری', badge: 'badge-danger' },
  }
  const style = PRIORITY_STYLE[announcement.priority] || PRIORITY_STYLE.normal

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-card transition">
      <div className="flex items-center gap-2 mb-2">
        <span className={`badge ${style.badge} text-[10px]`}>{style.label}</span>
        <span className="text-[10px] text-gray-400 mr-auto fa-num">
          {formatJalali(announcement.created_at, 'yyyy/MM/dd')}
        </span>
      </div>
      <h3 className="font-bold text-gray-900 leading-snug line-clamp-2">
        {announcement.title}
      </h3>
      <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">
        {announcement.body}
      </p>
    </div>
  )
}