import { Outlet } from 'react-router-dom'
import PublicHeader from './PublicHeader'
import PublicFooter from './PublicFooter'
import OfflineBanner from '../../components/feedback/OfflineBanner'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export default function PublicLayout() {
  const isOnline = useOnlineStatus()

  return (
    <div className="min-h-screen flex flex-col bg-cream" dir="rtl">
      <OfflineBanner isOnline={isOnline} />
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}