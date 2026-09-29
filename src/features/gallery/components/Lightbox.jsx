import { useEffect, useRef, useState } from 'react'
import { X, ChevronRight, ChevronLeft, Loader2, ZoomIn } from 'lucide-react'

const CATEGORY_LABEL = {
  school: 'مکتب',
  events: 'مراسم',
  classes: 'صنوف',
  achievements: 'افتخارات',
  other: 'سایر',
}

export default function Lightbox({ items, currentIndex, onClose, onNavigate }) {
  const [loading, setLoading] = useState(true)
  const [zoomed, setZoomed] = useState(false)
  const touchStartX = useRef(null)
  const touchEndX = useRef(null)

  const currentItem = items?.[currentIndex]

  // ─── Keyboard ───
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

  // ─── Reset loading when image changes ───
  useEffect(() => {
    setLoading(true)
    setZoomed(false)
  }, [currentIndex])

  // ─── Touch swipe ───
  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    touchEndX.current = e.changedTouches[0].clientX

    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) onNavigate(1) // swipe left → next
      else onNavigate(-1) // swipe right → prev
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  if (!currentItem) return null

  const hasMultiple = items.length > 1

  return (
    <div
      className="fixed inset-0 bg-black z-[100] flex flex-col"
      dir="rtl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ═══ نوار بالا ═══ */}
      <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition shrink-0"
          aria-label="بستن"
        >
          <X size={20} />
        </button>

        <div className="flex-1 min-w-0 text-center">
          {currentItem.title && (
            <h3 className="text-white font-medium text-sm sm:text-base truncate">
              {currentItem.title}
            </h3>
          )}
          <div className="flex items-center justify-center gap-2 mt-0.5 text-[11px] text-white/60">
            <span>{CATEGORY_LABEL[currentItem.category] || 'سایر'}</span>
            {currentItem.event_date && (
              <>
                <span>•</span>
                <span className="fa-num">{currentItem.event_date}</span>
              </>
            )}
            {hasMultiple && (
              <>
                <span>•</span>
                <span className="fa-num">
                  {currentIndex + 1} / {items.length}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="w-10 h-10 shrink-0" />
      </div>

      {/* ═══ ناحیه عکس ═══ */}
      <div className="flex-1 relative flex items-center justify-center p-3 sm:p-6 min-h-0">
        {/* دکمه قبلی */}
        {hasMultiple && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(-1)
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition"
            aria-label="قبلی"
          >
            <ChevronRight size={22} />
          </button>
        )}

        {/* عکس */}
        <div className="relative w-full h-full flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={32} className="text-white animate-spin" />
            </div>
          )}

          <img
            src={currentItem.image_url}
            alt={currentItem.title || ''}
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
            onClick={() => setZoomed((v) => !v)}
            className={`max-w-full max-h-full object-contain rounded-lg transition-all duration-300 cursor-zoom-in ${
              loading ? 'opacity-0' : 'opacity-100'
            } ${zoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'}`}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
            }}
          />

          {!zoomed && !loading && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
              <ZoomIn size={11} />
              <span>برای بزرگ‌نمایی کلیک کن</span>
            </div>
          )}
        </div>

        {/* دکمه بعدی */}
        {hasMultiple && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(1)
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition"
            aria-label="بعدی"
          >
            <ChevronLeft size={22} />
          </button>
        )}
      </div>

      {/* ═══ توضیحات ═══ */}
      {currentItem.description && !zoomed && (
        <div className="px-4 pb-4 max-w-3xl mx-auto w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 max-h-[100px] overflow-y-auto">
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed text-center">
              {currentItem.description}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}