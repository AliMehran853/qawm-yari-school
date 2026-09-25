import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'

const usernameToEmail = (username) =>
  `${username.toLowerCase().trim()}@qawmyari.local`

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
    let mounted = true

    // ۱. سریع چک کن session داریم یا نه
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return

      if (session?.user) {
        setUser(session.user)
        // ⚡️ فوراً loading را خاموش کن — UI نمایش داده شود
        setLoading(false)

        // پروفایل را در پس‌زمینه لود کن
        loadProfile(session.user.id).then((profile) => {
          if (mounted && profile) setProfile(profile)
        })
      } else {
        // کاربر لاگین نیست
        setLoading(false)
      }
    })

    // ۲. تغییرات Auth
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return

        if (session?.user) {
          setUser(session.user)
          setLoading(false)
          const profile = await loadProfile(session.user.id)
          if (mounted && profile) setProfile(profile)
        } else {
          clear()
        }
      }
    )

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [setUser, setProfile, setLoading, clear])
}

export async function login(username, password) {
  const email = usernameToEmail(username)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login')) {
      return { error: 'نام کاربری یا رمز عبور اشتباه است' }
    }
    return { error: error.message }
  }

  const profile = await loadProfile(data.user.id)
  if (!profile) {
    return { error: 'پروفایل کاربر پیدا نشد' }
  }

  return { data, profile }
}

export async function logout() {
  await supabase.auth.signOut()
}