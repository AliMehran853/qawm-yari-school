import { WifiOff } from 'lucide-react'

export default function OfflineBanner({ isOnline }) {
  if (isOnline) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] bg-orange-500 text-white px-4 py-2.5 text-center text-sm font-medium shadow-lg animate-slide-up"
      dir="rtl"
    >
      <div className="flex items-center justify-center gap-2">
        <WifiOff size={16} />
        <span>اتصال اینترنت قطع است — فقط مشاهده ممکن است</span>
      </div>
    </div>
  )
}