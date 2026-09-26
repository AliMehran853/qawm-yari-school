import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'

// ⚠️ ایمیل Auth برای همیشه ثابت است — از نام کاربری ساخته نمی‌شود
const AUTH_EMAIL = 'admin@qawmyari.local'

async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('خطا در لود پروفایل:', error)
    return null
  }
  return data
}

export function useAuthInit() {
  const setUser = useAuthStore((s) => s.setUser)
  const setProfile = useAuthStore((s) => s.setProfile)
  const setLoading = useAuthStore((s) => s.setLoading)
  const clear = useAuthStore((s) => s.clear)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        const profile = await loadProfile(session.user.id)
        if (profile) setProfile(profile)
      }
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user)
          const profile = await loadProfile(session.user.id)
          if (profile) setProfile(profile)
        } else {
          clear()
        }
        setLoading(false)
      }
    )

    return () => sub.subscription.unsubscribe()
  }, [setUser, setProfile, setLoading, clear])
}

// ─── ورود ───
// فقط نام کاربری "admin" را می‌پذیرد — چون فقط یک مدیر داریم
export async function login(username, password) {
  const cleanUsername = username.toLowerCase().trim()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: AUTH_EMAIL,
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login')) {
      return { error: 'نام کاربری یا رمز عبور اشتباه است' }
    }
    return { error: error.message }
  }

  // حالا چک کن نام کاربری واردشده با profile.username مطابقت دارد
  const profile = await loadProfile(data.user.id)

  if (!profile) {
    return { error: 'پروفایل کاربر پیدا نشد' }
  }

  // اگر نام کاربری اشتباه بود، خارج شو
  if (profile.username !== cleanUsername) {
    await supabase.auth.signOut()
    return { error: 'نام کاربری یا رمز عبور اشتباه است' }
  }

  return { data, profile }
}

export async function logout() {
  await supabase.auth.signOut()
}