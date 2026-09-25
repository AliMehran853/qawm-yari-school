import { useState, useMemo } from 'react'
import { Plus, Image as ImageIcon } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import GalleryForm from '../components/GalleryForm'
import GalleryGrid from '../components/GalleryGrid'
import Lightbox from '../components/Lightbox'
import {
  useGallery,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
} from '../useGallery'
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
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const { data: items, isLoading } = useGallery(filter)
  const createMut = useCreateGalleryItem()
  const updateMut = useUpdateGalleryItem()
  const deleteMut = useDeleteGalleryItem()

  const counts = useMemo(() => {
    if (!items) return {}
    const c = { all: items.length }
    items.forEach((i) => {
      c[i.category] = (c[i.category] || 0) + 1
    })
    return c
  }, [items])

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
  }

  async function handleDelete(item) {
    if (!confirm('این عکس حذف شود؟')) return
    try {
      await deleteMut.mutateAsync(item.id)
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
      {/* ─── هدر ─── */}
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

      {/* ─── فیلتر ─── */}
      {items?.length > 0 && (
        <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
          <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
            {CATEGORIES.map((c) => {
              const count = c.value === null ? counts.all : counts[c.value] || 0
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
                  <span
                    className={`text-[10px] fa-num ${
                      filter === c.value ? 'opacity-80' : 'opacity-60'
                    }`}
                  >
                    ({toFaNum(count)})
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── محتوا ─── */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 28, height: 28 }}
          />
          <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
        </div>
      ) : items?.length === 0 ? (
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
      ) : (
        <GalleryGrid
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onItemClick={setLightboxIndex}
        />
      )}

      {/* ─── تعداد ─── */}
      {items?.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          {toFaNum(items.length)} عکس
        </p>
      )}

      {/* ─── فرم ─── */}
      <GalleryForm
        open={formOpen}
        item={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />

      {/* ─── Lightbox ─── */}
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