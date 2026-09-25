import { NavLink, useNavigate, Link } from 'react-router-dom'
import { LogOut, X, Menu, Home } from 'lucide-react'

import { useAuthStore } from '../store/authStore'
import { useUiStore } from '../store/uiStore'
import { logout } from '../features/auth/useAuth'
import { getMenuByRole } from '../config/menu'
import { ROLE_LABELS } from '../config/roles'
import { useSettings } from '../features/settings/useSettings'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import OfflineBanner from '../components/feedback/OfflineBanner'
import { cn } from '../utils/cn'

export default function Layout({ children }) {
  const profile = useAuthStore((s) => s.profile)
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const { data: settings } = useSettings()
  const navigate = useNavigate()
  const isOnline = useOnlineStatus()

  const menu = getMenuByRole(profile?.role)
  const roleLabel = ROLE_LABELS[profile?.role] || ''

  const schoolName = settings?.school_name || 'مکتب قوم یاری'
  const location =
    settings?.district && settings?.province
      ? `${settings.district}، ${settings.province}`
      : 'ولسوالی ورس، بامیان'

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      {/* ─── بنر آفلاین ─── */}
      <OfflineBanner isOnline={isOnline} />

      {/* ─── Topbar موبایل ─── */}
      <header
        className={`lg:hidden sticky z-30 bg-brand-700 text-white px-4 py-3 flex items-center justify-between shadow-md ${
          isOnline ? 'top-0' : 'top-10'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-brand-800"
          aria-label="باز کردن منو"
        >
          <Menu size={22} />
        </button>
        <div className="text-center min-w-0 flex-1">
          <h1 className="font-bold text-base leading-tight truncate">
            {schoolName}
          </h1>
          <p className="text-[10px] text-white/70 truncate">{location}</p>
        </div>
        <Link
          to="/"
          className="p-2 rounded-lg hover:bg-brand-800"
          aria-label="سایت عمومی"
          title="بازگشت به سایت"
        >
          <Home size={20} />
        </Link>
      </header>

      {/* ─── Sidebar دسکتاپ ─── */}
      <aside className="hidden lg:flex fixed top-0 right-0 h-screen w-64 bg-white border-l border-gray-200 flex-col z-20">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={schoolName}
                className="w-10 h-10 rounded-lg object-cover border"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-brand-700 text-white flex items-center justify-center font-bold">
                {schoolName.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-bold text-brand-700 truncate">
                {schoolName}
              </h1>
              <p className="text-[10px] text-gray-500 truncate">{location}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {menu.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        <div className="border-t border-gray-200 p-3 space-y-1">
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name}
            </p>
            <p className="text-xs text-gray-500">{roleLabel}</p>
          </div>

          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm"
          >
            <Home size={18} />
            <span>بازگشت به سایت</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-danger hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={18} />
            <span className="text-sm">خروج</span>
          </button>
        </div>
      </aside>

      {/* ─── Sidebar موبایل (Drawer) ─── */}
      {sidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 right-0 h-screen w-72 bg-white z-50 flex flex-col shadow-2xl">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {settings?.logo_url ? (
                  <img
                    src={settings.logo_url}
                    alt={schoolName}
                    className="w-9 h-9 rounded-lg object-cover border shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-brand-700 text-white flex items-center justify-center font-bold shrink-0">
                    {schoolName.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-sm font-bold text-brand-700 truncate">
                    {schoolName}
                  </h1>
                  <p className="text-[10px] text-gray-500 truncate">
                    {location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg shrink-0"
                aria-label="بستن"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
              {menu.map((item) => (
                <NavItem
                  key={item.to}
                  item={item}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </nav>

            <div className="border-t p-3 space-y-1">
              <div className="px-3 py-2 mb-1">
                <p className="text-sm font-medium truncate">
                  {profile?.full_name}
                </p>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>

              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm"
              >
                <Home size={18} />
                <span>بازگشت به سایت</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-danger hover:bg-red-50 rounded-lg"
              >
                <LogOut size={18} />
                <span className="text-sm">خروج</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ─── محتوا ─── */}
      <main
        className={`lg:mr-64 min-h-screen ${isOnline ? '' : 'pt-10 lg:pt-0'}`}
      >
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}

function NavItem({ item, onClick }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition',
          isActive
            ? 'bg-brand-50 text-brand-700 font-medium'
            : 'text-gray-700 hover:bg-gray-50'
        )
      }
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </NavLink>
  )
}