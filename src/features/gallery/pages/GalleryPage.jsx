import { useState, useMemo, useEffect } from 'react'
import {
  Plus,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import GalleryForm from '../components/GalleryForm'
import GalleryGrid from '../components/GalleryGrid'
import Lightbox from '../components/Lightbox'
import {
  useGallery,
  useGalleryCounts,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
} from '../useGallery'
import { PAGE_SIZE } from '../galleryApi'
import { useConfirm } from '../../../hooks/useConfirm'
import { toFaNum } from '../../../utils/number'

const CATEGORIES = [
  { value: null, label: 'همه' },
  { value: 'school', label: 'مکتب' },
  { value: 'events', label: 'مراسم' },
  { value: 'classes', label: 'صنوف' },
  { value: 'achievements', label: 'افتخارات' },
  { value: 'other', label: 'سایر' },
]

export default function GalleryPage() {
  const [filter, setFilter] = useState(null)
  const [page, setPage] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const confirm = useConfirm()

  const { data, isLoading, isFetching } = useGallery({ category: filter, page })
  const { data: counts } = useGalleryCounts()
  const createMut = useCreateGalleryItem()
  const updateMut = useUpdateGalleryItem()
  const deleteMut = useDeleteGalleryItem()

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

  function handleAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(item) {
    setEditing(item)
    setFormOpen(true)
  }

  async function handleSubmit(values) {
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, updates: values })
    } else {
      await createMut.mutateAsync(values)
    }
    setFormOpen(false)
    if (!editing) setPage(0)
  }

  // ⭐ حذف با مودال قشنگ
  async function handleDelete(item) {
    const confirmed = await confirm({
      title: 'حذف عکس',
      message: `آیا از حذف عکس «${item.title || 'بدون عنوان'}» مطمئن هستید؟`,
      description: 'این عمل قابل بازگشت نیست و عکس از سرور پاک می‌شود.',
      confirmText: 'حذف کن',
      cancelText: 'انصراف',
      variant: 'danger',
    })

    if (!confirmed) return

    try {
      await deleteMut.mutateAsync(item.id)
      if (items.length === 1 && page > 0) {
        setPage(page - 1)
      }
    } catch (e) {}
  }

  function handleNavigate(direction) {
    if (lightboxIndex === null || !items) return
    let next = lightboxIndex + direction
    if (next < 0) next = items.length - 1
    if (next >= items.length) next = 0
    setLightboxIndex(next)
  }

  return (
    <PageWrapper>
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
            گالری تصاویر
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            عکس‌های مکتب، مراسم و رویدادها
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0" aria-label="افزودن عکس">
          <Plus size={18} />
          <span className="hidden sm:inline">افزودن عکس</span>
        </Button>
      </div>

      {counts && counts.all > 0 && (
        <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
          <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
            {CATEGORIES.map((c) => {
              const count =
                c.value === null ? counts.all : counts[c.value] || 0
              if (c.value !== null && count === 0) return null
              return (
                <button
                  key={c.value || 'all'}
                  onClick={() => setFilter(c.value)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-1.5 ${
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
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 28, height: 28 }}
          />
          <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
        </div>
      ) : !counts || counts.all === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <EmptyState
            icon={ImageIcon}
            title="هنوز عکسی اضافه نشده"
            description="برای شروع، اولین عکس را اضافه کن"
            action={
              <Button onClick={handleAdd}>
                <Plus size={18} />
                <span>افزودن عکس</span>
              </Button>
            }
          />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <EmptyState
            icon={ImageIcon}
            title="عکسی در این دسته نیست"
            description="فیلتر دیگری انتخاب کن"
          />
        </div>
      ) : (
        <>
          <div
            className={`transition-opacity ${
              isFetching ? 'opacity-60' : 'opacity-100'
            }`}
          >
            <GalleryGrid
              items={items}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onItemClick={setLightboxIndex}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
            <p className="text-xs text-gray-500 text-center sm:text-right fa-num">
              نمایش {toFaNum(items.length)} از {toFaNum(total)} عکس
              {totalPages > 1 && (
                <>
                  {' '}
                  — صفحه {toFaNum(page + 1)} از {toFaNum(totalPages)}
                </>
              )}
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition"
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
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition"
                  aria-label="صفحه بعد"
                >
                  <ChevronLeft size={16} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <GalleryForm
        open={formOpen}
        item={editing}
        totalCount={counts?.all || 0}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />

      {lightboxIndex !== null && items && (
        <Lightbox
          items={items}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={handleNavigate}
        />
      )}
    </PageWrapper>
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