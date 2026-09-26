import { useEffect, useState, useRef } from 'react'
import { WifiOff, Wifi } from 'lucide-react'

export default function OfflineBanner({ isOnline }) {
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState('offline')
  const prevOnlineRef = useRef(null)

  useEffect(() => {
    // ─── اولین بار — فقط وضعیت را ذخیره کن، بنر نشان نده ───
    if (prevOnlineRef.current === null) {
      prevOnlineRef.current = isOnline
      return
    }

    // ─── اگر تغییری نکرد، کاری نکن ───
    if (prevOnlineRef.current === isOnline) return

    // ─── وضعیت عوض شد ───
    prevOnlineRef.current = isOnline

    if (!isOnline) {
      // رفت به آفلاین
      setMode('offline')
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 5000)
      return () => clearTimeout(timer)
    } else {
      // برگشت به آنلاین
      setMode('online')
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline])

  if (!visible) return null

  if (mode === 'online') {
    return (
      <div
        className="fixed top-0 left-0 right-0 z-[100] bg-green-500 text-white px-4 py-2.5 text-center text-sm font-medium shadow-lg animate-slide-up"
        dir="rtl"
      >
        <div className="flex items-center justify-center gap-2">
          <Wifi size={16} />
          <span>اتصال اینترنت برقرار شد</span>
        </div>
      </div>
    )
  }

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