import { useEffect } from 'react'
import { X, FileText } from 'lucide-react'

export default function TextModal({ open, title, text, onClose }) {
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center animate-fade-in p-0 sm:p-4"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl animate-slide-up max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-white" />
            </div>
            <h2 className="font-bold text-base sm:text-lg text-gray-900 truncate">
              {title || 'متن کامل'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition shrink-0"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        {/* متن کامل */}
        <div className="p-5 overflow-y-auto">
          <p className="text-gray-700 leading-loose whitespace-pre-wrap text-sm sm:text-base">
            {text}
          </p>
        </div>

        {/* دکمه بستن */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full btn btn-primary py-3 rounded-xl font-medium"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  )
}