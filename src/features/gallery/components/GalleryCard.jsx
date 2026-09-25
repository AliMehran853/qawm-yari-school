import { useState } from 'react'
import { Pencil, Trash2, Image as ImageIcon } from 'lucide-react'

const CATEGORY_LABEL = {
  school: 'مکتب',
  events: 'مراسم',
  classes: 'صنوف',
  achievements: 'افتخارات',
  other: 'سایر',
}

export default function GalleryCard({
  item,
  onEdit,
  onDelete,
  onClick,
  canManage = true,
}) {
  const [status, setStatus] = useState('loading') // 'loading' | 'loaded' | 'error'

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-card transition">
      {/* عکس */}
      <div
        className="aspect-square bg-gray-100 cursor-pointer overflow-hidden relative"
        onClick={() => onClick?.(item)}
      >
        {/* حالت لودینگ یا خطا */}
        {status !== 'loaded' && (
          <div className="absolute inset-0 flex items-center justify-center">
            {status === 'loading' ? (
              <div className="w-8 h-8 border-2 border-gray-300 border-t-brand-700 rounded-full animate-spin" />
            ) : (
              <ImageIcon size={32} className="text-gray-400" />
            )}
          </div>
        )}

        {/* عکس اصلی */}
        <img
          src={item.image_url}
          alt={item.title || ''}
          className={`w-full h-full object-cover transition duration-500 group-hover:scale-105 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      </div>

      {/* اطلاعات پایین */}
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className="badge badge-brand text-[10px]">
            {CATEGORY_LABEL[item.category] || 'سایر'}
          </span>
          {item.event_date && (
            <span className="text-[10px] text-gray-400 fa-num">
              {item.event_date}
            </span>
          )}
        </div>

        {item.title && (
          <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
            {item.title}
          </h3>
        )}

        {item.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* دکمه‌های مدیریت */}
      {canManage && (
        <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
            className="w-8 h-8 bg-white/95 backdrop-blur rounded-lg shadow flex items-center justify-center text-blue-600 hover:bg-white"
            aria-label="ویرایش"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(item)
            }}
            className="w-8 h-8 bg-white/95 backdrop-blur rounded-lg shadow flex items-center justify-center text-danger hover:bg-white"
            aria-label="حذف"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  )
}