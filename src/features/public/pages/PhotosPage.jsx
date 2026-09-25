import { useState, useMemo } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { useGallery } from '../../gallery/useGallery'
import Lightbox from '../../gallery/components/Lightbox'
import { toFaNum } from '../../../utils/number'

const CATEGORIES = [
  { value: null, label: 'همه' },
  { value: 'school', label: 'مکتب' },
  { value: 'events', label: 'مراسم' },
  { value: 'classes', label: 'صنوف' },
  { value: 'achievements', label: 'افتخارات' },
  { value: 'other', label: 'سایر' },
]

export default function PhotosPage() {
  const [filter, setFilter] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const { data: items, isLoading } = useGallery(filter)

  const counts = useMemo(() => {
    if (!items) return {}
    const c = { all: items.length }
    items.forEach((i) => {
      c[i.category] = (c[i.category] || 0) + 1
    })
    return c
  }, [items])

  function handleNavigate(direction) {
    if (lightboxIndex === null || !items) return
    let next = lightboxIndex + direction
    if (next < 0) next = items.length - 1
    if (next >= items.length) next = 0
    setLightboxIndex(next)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-700">
          گالری تصاویر
        </h1>
        <p className="text-gray-500 mt-2">عکس‌های مکتب و رویدادها</p>
      </div>

      {items?.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((c) => {
            const count = c.value === null ? counts.all : counts[c.value] || 0
            if (c.value !== null && count === 0) return null
            return (
              <button
                key={c.value || 'all'}
                onClick={() => setFilter(c.value)}
                className={`px-4 py-1.5 rounded-full text-sm transition flex items-center gap-1.5 ${
                  filter === c.value
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
                }`}
              >
                <span>{c.label}</span>
                <span className="text-[10px] opacity-70 fa-num">({toFaNum(count)})</span>
              </button>
            )
          })}
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="spinner text-brand-700 mx-auto" style={{ width: 28, height: 28 }} />
        </div>
      ) : !items || items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <ImageIcon size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">عکسی موجود نیست</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer group relative"
            >
              <img
                src={item.image_url}
                alt={item.title || ''}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {item.title && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition">
                  <p className="text-white text-xs font-medium line-clamp-1">
                    {item.title}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {lightboxIndex !== null && items && (
        <Lightbox
          items={items}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  )
}