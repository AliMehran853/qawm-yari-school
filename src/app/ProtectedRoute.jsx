import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children, allow = [] }) {
  const { user, profile, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream" dir="rtl">
        <div className="text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 32, height: 32 }}
          />
          <p className="text-gray-500 mt-4 text-sm">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream" dir="rtl">
        <div className="spinner text-brand-700" />
      </div>
    )
  }

  if (allow.length > 0 && !allow.includes(profile.role)) {
    return <Navigate to="/panel/dashboard" replace />
  }

  return children
}