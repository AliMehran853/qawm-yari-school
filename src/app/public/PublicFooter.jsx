import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, LogIn } from 'lucide-react'
import { useSettings } from '../../features/settings/useSettings'

export default function PublicFooter() {
  const { data: settings } = useSettings()

  const schoolName = settings?.school_name || 'مکتب قوم یاری'
  const fullName = settings?.school_full_name || ''
  const address = settings?.address || 'ولسوالی ورس، بامیان، افغانستان'
  const phone = settings?.phone
  const email = settings?.email
  const tagline =
    settings?.hero_tagline ||
    'مکتبی فعال در قلب ورس که نسل آینده را آموزش می‌دهد.'
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {/* ═══ معرفی ═══ */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={schoolName}
                  className="w-12 h-12 rounded-xl object-cover shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold text-lg shadow-md">
                  {schoolName.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-base truncate">{schoolName}</h3>
                {fullName && (
                  <p className="text-xs text-white/60 truncate">{fullName}</p>
                )}
              </div>
            </div>

            {/* متن کوتاه — نه description کامل */}
            <p className="text-sm text-white/70 leading-relaxed">
              {tagline}
            </p>
          </div>

          {/* ═══ دسترسی سریع ═══ */}
          <div>
            <h3 className="font-bold mb-4 text-white">دسترسی سریع</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-white/70 hover:text-white hover:translate-x-[-3px] inline-block transition-all"
                >
                  خانه
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white/70 hover:text-white hover:translate-x-[-3px] inline-block transition-all"
                >
                  درباره مکتب
                </Link>
              </li>
              <li>
                <Link
                  to="/staff"
                  className="text-white/70 hover:text-white hover:translate-x-[-3px] inline-block transition-all"
                >
                  کادر آموزشی
                </Link>
              </li>
              <li>
                <Link
                  to="/classes"
                  className="text-white/70 hover:text-white hover:translate-x-[-3px] inline-block transition-all"
                >
                  صنوف و مضامین
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-white/70 hover:text-white hover:translate-x-[-3px] inline-block transition-all"
                >
                  اخبار و اعلانات
                </Link>
              </li>
              <li>
                <Link
                  to="/photos"
                  className="text-white/70 hover:text-white hover:translate-x-[-3px] inline-block transition-all"
                >
                  گالری تصاویر
                </Link>
              </li>
              <li>
                <Link
                  to="/library"
                  className="text-white/70 hover:text-white hover:translate-x-[-3px] inline-block transition-all"
                >
                  کتابخانه
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-white/70 hover:text-white transition flex items-center gap-1.5 pt-1"
                >
                  <LogIn size={13} />
                  <span>ورود به پنل</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ═══ تماس ═══ */}
          <div>
            <h3 className="font-bold mb-4 text-white">تماس با ما</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="shrink-0 mt-0.5 text-white/60" />
                <span className="text-white/70 leading-relaxed">
                  {address}
                </span>
              </li>
              {phone && (
                <li className="flex items-center gap-2.5">
                  <Phone size={16} className="shrink-0 text-white/60" />
                  <a
                    href={`tel:${phone}`}
                    className="text-white/70 hover:text-white transition"
                    dir="ltr"
                  >
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2.5">
                  <Mail size={16} className="shrink-0 text-white/60" />
                  <a
                    href={`mailto:${email}`}
                    className="text-white/70 hover:text-white transition break-all"
                    dir="ltr"
                  >
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ═══ خط پایین ═══ */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-xs text-white/50">
            © {year} {fullName || schoolName} — تمام حقوق محفوظ است
          </p>
        </div>
      </div>
    </footer>
  )
}