import { useEffect } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'

const CATEGORY_LABEL = {
  school: 'مکتب',
  events: 'مراسم',
  classes: 'صنوف',
  achievements: 'افتخارات',
  other: 'سایر',
}

export default function Lightbox({ items, currentIndex, onClose, onNavigate }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate(-1)
      if (e.key === 'ArrowLeft') onNavigate(1)
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onNavigate])

  if (currentIndex === null || !items[currentIndex]) return null

  const item = items[currentIndex]

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[100] flex flex-col animate-fade-in"
      dir="rtl"
      onClick={onClose}
    >
      {/* نوار بالا */}
      <div
        className="flex items-center justify-between p-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0 flex-1">
          {item.title && (
            <h3 className="font-medium truncate">{item.title}</h3>
          )}
          <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
            <span>{CATEGORY_LABEL[item.category] || 'سایر'}</span>
            {item.event_date && (
              <>
                <span>•</span>
                <span className="fa-num">{item.event_date}</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"
          aria-label="بستن"
        >
          <X size={20} />
        </button>
      </div>

      {/* عکس */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4 relative">
        <img
          src={item.image_url}
          alt={item.title || ''}
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />

        {/* دکمه‌های ناوبری */}
        {items.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigate(-1)
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white"
              aria-label="قبلی"
            >
              <ChevronRight size={22} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigate(1)
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white"
              aria-label="بعدی"
            >
              <ChevronLeft size={22} />
            </button>
          </>
        )}
      </div>

      {/* توضیحات پایین */}
      {item.description && (
        <div
          className="p-4 text-white/80 text-sm text-center max-w-2xl mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {item.description}
        </div>
      )}

      {/* شمارنده */}
      {items.length > 1 && (
        <div className="p-3 text-center text-white/50 text-xs fa-num">
          {currentIndex + 1} از {items.length}
        </div>
      )}
    </div>
  )
}