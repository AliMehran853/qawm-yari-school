import { useEffect } from 'react'
import {
  AlertTriangle,
  Trash2,
  LogOut,
  AlertCircle,
  Info,
  CheckCircle2,
  X,
} from 'lucide-react'
import Button from '../ui/Button'

const VARIANTS = {
  danger: {
    icon: Trash2,
    iconBg: 'from-red-500 to-red-600',
    iconColor: 'text-white',
    confirmBtn: 'bg-red-600 hover:bg-red-700 text-white',
    ring: 'ring-red-100',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'from-orange-400 to-orange-600',
    iconColor: 'text-white',
    confirmBtn: 'bg-orange-500 hover:bg-orange-600 text-white',
    ring: 'ring-orange-100',
  },
  info: {
    icon: Info,
    iconBg: 'from-brand-500 to-brand-700',
    iconColor: 'text-white',
    confirmBtn: 'bg-brand-700 hover:bg-brand-800 text-white',
    ring: 'ring-brand-100',
  },
  success: {
    icon: CheckCircle2,
    iconBg: 'from-emerald-500 to-emerald-600',
    iconColor: 'text-white',
    confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    ring: 'ring-emerald-100',
  },
}

export default function ConfirmDialog({
  open,
  title,
  message,
  description,
  confirmText = 'تأیید',
  cancelText = 'انصراف',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) {
  // ─── Keyboard ───
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape' && !loading) onCancel()
      if (e.key === 'Enter' && !loading) onConfirm()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onCancel, onConfirm, loading])

  if (!open) return null

  const v = VARIANTS[variant] || VARIANTS.danger
  const Icon = v.icon

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center animate-fade-in p-0 sm:p-4"
      dir="rtl"
      onClick={() => !loading && onCancel()}
    >
      <div
        className="bg-white w-full sm:max-w-sm sm:rounded-3xl rounded-t-3xl shadow-modal animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══ دکمه بستن (بالا) ═══ */}
        <div className="flex justify-end p-3 pb-0">
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition disabled:opacity-40"
            aria-label="بستن"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* ═══ محتوا ═══ */}
        <div className="px-6 pt-2 pb-5 text-center">
          {/* آیکن */}
          <div
            className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${v.iconBg} flex items-center justify-center shadow-lg ring-4 ${v.ring} mb-4`}
          >
            <Icon size={28} className={v.iconColor} />
          </div>

          {/* عنوان */}
          {title && (
            <h2 className="text-lg font-bold text-gray-900 leading-snug">
              {title}
            </h2>
          )}

          {/* متن اصلی */}
          {message && (
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              {message}
            </p>
          )}

          {/* توضیح اضافه */}
          {description && (
            <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* ═══ دکمه‌ها ═══ */}
        <div className="border-t border-gray-100 p-4 grid grid-cols-2 gap-2 bg-gray-50/50">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${v.confirmBtn}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>در حال انجام...</span>
              </>
            ) : (
              <>
                <Icon size={15} />
                <span>{confirmText}</span>
              </>
            )}
          </button>

          <button
            onClick={onCancel}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-100 text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{cancelText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}