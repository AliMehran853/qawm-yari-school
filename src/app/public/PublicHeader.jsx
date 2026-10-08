import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, LogIn } from 'lucide-react'
import { useSettings } from '../../features/settings/useSettings'
import { cn } from '../../utils/cn'

const NAV_ITEMS = [
  { to: '/', label: 'خانه' },
  { to: '/about', label: 'درباره مکتب' },
  { to: '/staff', label: 'کادر آموزشی' },
  { to: '/classes', label: 'صنوف' },
  { to: '/schedule', label: 'تقسیم اوقات' },
  { to: '/news', label: 'اخبار' },
  { to: '/photos', label: 'گالری' },
  { to: '/library', label: 'کتابخانه' },
  { to: '/contact', label: 'تماس' },
]

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { data: settings } = useSettings()

  const schoolName = settings?.school_name || 'مکتب قوم یاری'
  const locationText =
    settings?.district && settings?.province
      ? `${settings.district}، ${settings.province}`
      : 'ولسوالی ورس، بامیان'

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* لوگو */}
          <Link to="/" className="flex items-center gap-3 min-w-0">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={schoolName}
                className="w-10 h-10 rounded-xl object-cover border shadow-sm shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                {schoolName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-brand-900 truncate">
                {schoolName}
              </h1>
              <p className="text-[10px] text-gray-500 truncate">
                {locationText}
              </p>
            </div>
          </Link>

          {/* ناوبری دسکتاپ */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-gray-600 hover:text-brand-700 hover:bg-gray-50'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* دکمه ورود + منوی موبایل */}
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-white bg-gradient-to-l from-brand-600 to-brand-800 hover:from-brand-700 hover:to-brand-900 px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <LogIn size={14} />
              <span>ورود به پنل</span>
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition"
              aria-label="منو"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* منوی موبایل */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 animate-slide-up">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition',
                  isActive
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-gray-600 hover:bg-gray-50'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 px-3 py-3 mt-2 rounded-xl text-sm font-medium text-white bg-gradient-to-l from-brand-600 to-brand-800 transition"
          >
            <LogIn size={16} />
            <span>ورود به پنل</span>
          </Link>
        </nav>
      )}
    </header>
  )
}