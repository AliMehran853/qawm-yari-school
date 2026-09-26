import { useState } from 'react'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  AlertCircle,
  UserCircle,
} from 'lucide-react'
import { toast } from 'sonner'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../../../store/authStore'
import { ROLE_LABELS } from '../../../config/roles'

export default function AccountPage() {
  const profile = useAuthStore((s) => s.profile)
  const user = useAuthStore((s) => s.user)
  const setProfile = useAuthStore((s) => s.setProfile)

  // ─── نام کامل ───
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [fullNameSaving, setFullNameSaving] = useState(false)

  // ─── نام کاربری ───
  const [newUsername, setNewUsername] = useState(profile?.username || '')
  const [usernameSaving, setUsernameSaving] = useState(false)

  // ─── رمز ───
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)

  // ═══ تغییر نام کامل ═══
  async function handleFullNameChange(e) {
    e.preventDefault()

    const clean = fullName.trim()
    if (!clean) {
      toast.error('نام کامل نمی‌تواند خالی باشد')
      return
    }
    if (clean.length < 2) {
      toast.error('نام کامل حداقل ۲ کاراکتر باشد')
      return
    }
    if (clean === profile?.full_name) {
      toast.info('نام تغییر نکرده')
      return
    }

    setFullNameSaving(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: clean })
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      toast.success('نام کامل تغییر کرد')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'خطا در تغییر نام')
    } finally {
      setFullNameSaving(false)
    }
  }

  // ═══ تغییر نام کاربری ═══
  async function handleUsernameChange(e) {
    e.preventDefault()

    const clean = newUsername.toLowerCase().trim()

    if (!clean) {
      toast.error('نام کاربری نمی‌تواند خالی باشد')
      return
    }
    if (clean === profile?.username) {
      toast.info('نام کاربری تغییر نکرده')
      return
    }
    if (!/^[a-z0-9_.-]+$/.test(clean)) {
      toast.error(
        'نام کاربری فقط حروف کوچک انگلیسی، عدد، نقطه، خط تیره یا زیرخط'
      )
      return
    }
    if (clean.length < 3) {
      toast.error('نام کاربری حداقل ۳ کاراکتر باشد')
      return
    }

    setUsernameSaving(true)
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', clean)
        .neq('id', profile.id)
        .maybeSingle()

      if (existing) {
        toast.error('این نام کاربری قبلاً استفاده شده')
        setUsernameSaving(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ username: clean })
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      toast.success('نام کاربری تغییر کرد')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'خطا در تغییر نام کاربری')
    } finally {
      setUsernameSaving(false)
    }
  }

  // ═══ تغییر رمز ═══
  async function handlePasswordChange(e) {
    e.preventDefault()

    if (!currentPassword) {
      toast.error('رمز فعلی را وارد کن')
      return
    }
    if (!newPassword) {
      toast.error('رمز جدید را وارد کن')
      return
    }
    if (newPassword.length < 6) {
      toast.error('رمز جدید حداقل ۶ کاراکتر باشد')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('تکرار رمز جدید مطابقت ندارد')
      return
    }
    if (newPassword === currentPassword) {
      toast.error('رمز جدید با رمز فعلی یکسان است')
      return
    }

    setPasswordSaving(true)
    try {
      const authEmail = user?.email
      if (!authEmail) {
        toast.error('اطلاعات ورود پیدا نشد')
        setPasswordSaving(false)
        return
      }

      // تأیید رمز فعلی
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: currentPassword,
      })

      if (signInError) {
        toast.error('رمز فعلی اشتباه است')
        setPasswordSaving(false)
        return
      }

      // تغییر رمز
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      toast.success('رمز عبور با موفقیت تغییر کرد')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'خطا در تغییر رمز')
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
          حساب من
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          اطلاعات حساب کاربری
        </p>
      </div>

      {/* ─── اطلاعات کاربر ─── */}
      <Card className="mb-4 bg-gradient-to-l from-brand-50 to-white border-brand-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg">
            {profile?.full_name?.charAt(0) || '?'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-base sm:text-lg text-gray-900 truncate">
              {profile?.full_name}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 flex-wrap">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} />
                {ROLE_LABELS[profile?.role] || profile?.role}
              </span>
              <span className="font-mono text-gray-500" dir="ltr">
                @{profile?.username}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ═══ ۱. نام کامل ═══ */}
      <Card flat className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <UserCircle size={18} className="text-brand-700" />
          <div>
            <h2 className="font-bold text-sm sm:text-base text-gray-900">
              نام کامل
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              نامی که در پنل و بالای داشبورد نمایش داده می‌شود
            </p>
          </div>
        </div>

        <form onSubmit={handleFullNameChange} className="space-y-3">
          <div>
            <label className="input-label">نام و تخلص</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input"
              placeholder="مثلاً: علی مهران"
            />
          </div>

          <Button
            type="submit"
            disabled={fullNameSaving || fullName === profile?.full_name}
            className="w-full sm:w-auto"
          >
            <Save size={16} />
            <span>{fullNameSaving ? 'در حال ذخیره...' : 'ذخیره نام'}</span>
          </Button>
        </form>
      </Card>

      {/* ═══ ۲. نام کاربری ═══ */}
      <Card flat className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-brand-700" />
          <div>
            <h2 className="font-bold text-sm sm:text-base text-gray-900">
              نام کاربری
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              برای ورود به سیستم استفاده می‌شود
            </p>
          </div>
        </div>

        <form onSubmit={handleUsernameChange} className="space-y-3">
          <div>
            <label className="input-label">نام کاربری</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              dir="ltr"
              className="input text-left font-mono"
              placeholder="admin"
              autoComplete="off"
            />
            <p className="input-hint">
              حروف کوچک انگلیسی، عدد، نقطه یا خط تیره — حداقل ۳ کاراکتر
            </p>
          </div>

          <Button
            type="submit"
            disabled={usernameSaving || newUsername === profile?.username}
            className="w-full sm:w-auto"
          >
            <Save size={16} />
            <span>
              {usernameSaving ? 'در حال ذخیره...' : 'ذخیره نام کاربری'}
            </span>
          </Button>
        </form>
      </Card>

      {/* ═══ ۳. رمز عبور ═══ */}
      <Card flat className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className="text-brand-700" />
          <div>
            <h2 className="font-bold text-sm sm:text-base text-gray-900">
              تغییر رمز عبور
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              برای امنیت، ابتدا رمز فعلی را وارد کن
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="input-label">رمز عبور فعلی</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                dir="ltr"
                className="input text-left pl-11"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="input-label">رمز عبور جدید</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                dir="ltr"
                className="input text-left pl-11"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="input-hint">حداقل ۶ کاراکتر</p>
          </div>

          <div>
            <label className="input-label">تکرار رمز جدید</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                dir="ltr"
                className="input text-left pl-11"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={
              passwordSaving ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
            className="w-full sm:w-auto"
          >
            <Lock size={16} />
            <span>
              {passwordSaving ? 'در حال تغییر...' : 'تغییر رمز عبور'}
            </span>
          </Button>
        </form>
      </Card>

      {/* ═══ هشدار ═══ */}
      <Card className="bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h3 className="font-bold text-amber-900 text-sm">
              نکته امنیتی مهم
            </h3>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              رمز عبور خود را در جای امن ذخیره کن. اگر آن را فراموش کنی،
              باید از طریق پنل Supabase آن را بازنشانی کنی. هرگز رمز را با
              کسی به اشتراک نگذار.
            </p>
          </div>
        </div>
      </Card>
    </PageWrapper>
  )
}