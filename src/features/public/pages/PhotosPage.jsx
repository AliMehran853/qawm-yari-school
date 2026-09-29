import { useState, useMemo, useEffect } from 'react'
import {
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { useGallery, useGalleryCounts } from '../../gallery/useGallery'
import { PAGE_SIZE } from '../../gallery/galleryApi'
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
  const [page, setPage] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const { data, isLoading, isFetching } = useGallery({
    category: filter,
    page,
  })
  const { data: counts } = useGalleryCounts()

  const items = data?.items || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  useEffect(() => {
    setPage(0)
  }, [filter])

  function goToPage(newPage) {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

      {/* فیلتر */}
      {counts && counts.all > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((c) => {
            const count =
              c.value === null ? counts.all : counts[c.value] || 0
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
                <span className="text-[10px] opacity-70 fa-num">
                  ({toFaNum(count)})
                </span>
              </button>
            )
          })}
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 28, height: 28 }}
          />
        </div>
      ) : !counts || counts.all === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <ImageIcon size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">عکسی موجود نیست</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <ImageIcon size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">عکسی در این دسته نیست</p>
        </div>
      ) : (
        <>
          <div
            className={`transition-opacity ${
              isFetching ? 'opacity-60' : 'opacity-100'
            }`}
          >
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
          </div>

          {/* تعداد و صفحه */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
            <p className="text-xs text-gray-500 fa-num">
              نمایش {toFaNum(items.length)} از {toFaNum(total)} عکس
              {totalPages > 1 && (
                <> — صفحه {toFaNum(page + 1)} از {toFaNum(totalPages)}</>
              )}
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50 flex items-center justify-center disabled:opacity-40 transition"
                  aria-label="صفحه قبل"
                >
                  <ChevronRight size={16} className="text-gray-600" />
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers(page, totalPages).map((p, idx) => {
                    if (p === '...') {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
                        >
                          …
                        </span>
                      )
                    }
                    const isActive = p === page
                    return (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition fa-num ${
                          isActive
                            ? 'bg-brand-700 text-white shadow-sm'
                            : 'border border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50'
                        }`}
                      >
                        {toFaNum(p + 1)}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50 flex items-center justify-center disabled:opacity-40 transition"
                  aria-label="صفحه بعد"
                >
                  <ChevronLeft size={16} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </>
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

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i)
  }

  const pages = []
  pages.push(0)

  if (current > 2) pages.push('...')

  for (
    let i = Math.max(1, current - 1);
    i <= Math.min(total - 2, current + 1);
    i++
  ) {
    pages.push(i)
  }

  if (current < total - 3) pages.push('...')

  pages.push(total - 1)

  return pages
}