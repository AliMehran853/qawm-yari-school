import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { login } from '../features/auth/useAuth'
import { useAuthStore } from '../store/authStore'
import { useSettings } from '../features/settings/useSettings'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const setUser = useAuthStore((s) => s.setUser)
  const setProfile = useAuthStore((s) => s.setProfile)
  const { data: settings } = useSettings()
  const navigate = useNavigate()

  const schoolName = settings?.school_name || 'مکتب قوم یاری'
  const location =
    settings?.district && settings?.province
      ? `${settings.district}، ${settings.province}`
      : 'ولسوالی ورس، بامیان'

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const { data, error, profile } = await login(username, password)
    setLoading(false)

    if (error) {
      toast.error(error)
      return
    }

    if (data?.user) setUser(data.user)
    if (profile) setProfile(profile)

    toast.success('خوش آمدید')
    navigate('/panel/dashboard')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cream px-4 py-8"
      dir="rtl"
    >
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-6">
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt={schoolName}
              className="w-16 h-16 mx-auto rounded-2xl object-cover shadow-card mb-4"
            />
          ) : (
            <div className="w-16 h-16 mx-auto bg-brand-700 rounded-2xl flex items-center justify-center mb-4 shadow-card">
              <span className="text-white font-bold text-2xl">
                {schoolName.charAt(0)}
              </span>
            </div>
          )}
          <h1 className="text-xl font-bold text-brand-700">{schoolName}</h1>
          <p className="text-xs text-gray-500 mt-1">{location}</p>
        </div>

        <div className="card p-6">
          <h2 className="text-center text-sm font-medium text-gray-700 mb-5">
            ورود به سیستم
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="نام کاربری"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              dir="ltr"
              placeholder="admin"
              className="text-left"
            />

            <Input
              label="رمز عبور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              dir="ltr"
              placeholder="••••••••"
              className="text-left"
            />

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? 'در حال ورود...' : 'ورود'}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <a href="/" className="text-xs text-brand-700 hover:text-brand-800">
              بازگشت به سایت مکتب
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} {schoolName}
        </p>
      </div>
    </div>
  )
}