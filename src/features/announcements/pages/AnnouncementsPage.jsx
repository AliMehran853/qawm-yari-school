import { useState, useMemo } from 'react'
import { Plus, Bell, Pin } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import AnnouncementForm from '../components/AnnouncementForm'
import AnnouncementList from '../components/AnnouncementList'
import AnnouncementShareModal from '../components/AnnouncementShareModal'
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  useTogglePin,
} from '../useAnnouncements'
import { useAuthStore } from '../../../store/authStore'
import { ROLES } from '../../../config/roles'
import { toFaNum } from '../../../utils/number'

const FILTERS = [
  { value: 'all', label: 'همه' },
  { value: 'pinned', label: 'سنجاق‌شده' },
  { value: 'urgent', label: 'فوری' },
  { value: 'important', label: 'مهم' },
  { value: 'normal', label: 'عادی' },
]

export default function AnnouncementsPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('all')
  const [shareOpen, setShareOpen] = useState(false)
  const [shareTarget, setShareTarget] = useState(null)

  const profile = useAuthStore((s) => s.profile)
  const isAdmin = profile?.role === ROLES.ADMIN

  const { data: announcements, isLoading } = useAnnouncements()
  const createMut = useCreateAnnouncement()
  const updateMut = useUpdateAnnouncement()
  const deleteMut = useDeleteAnnouncement()
  const pinMut = useTogglePin()

  const filtered = useMemo(() => {
    if (!announcements) return []
    if (filter === 'all') return announcements
    if (filter === 'pinned') return announcements.filter((a) => a.pinned)
    return announcements.filter((a) => a.priority === filter)
  }, [announcements, filter])

  const counts = useMemo(() => {
    if (!announcements) return {}
    return {
      all: announcements.length,
      pinned: announcements.filter((a) => a.pinned).length,
      urgent: announcements.filter((a) => a.priority === 'urgent').length,
      important: announcements.filter((a) => a.priority === 'important').length,
      normal: announcements.filter((a) => a.priority === 'normal').length,
    }
  }, [announcements])

  function handleAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(announcement) {
    setEditing(announcement)
    setFormOpen(true)
  }

  function handleShare(announcement) {
    setShareTarget(announcement)
    setShareOpen(true)
  }

  async function handleSubmit(values) {
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, updates: values })
    } else {
      await createMut.mutateAsync({
        ...values,
        author_id: profile?.id || null,
      })
    }
    setFormOpen(false)
  }

  async function handleDelete(announcement) {
    if (!confirm(`اعلان «${announcement.title}» حذف شود؟`)) return
    try {
      await deleteMut.mutateAsync(announcement.id)
    } catch (e) {}
  }

  async function handleTogglePin(announcement) {
    await pinMut.mutateAsync({
      id: announcement.id,
      pinned: !announcement.pinned,
    })
  }

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
            اعلانات
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            {isAdmin
              ? 'اطلاع‌رسانی به دانش‌آموزان، والدین و معلمان'
              : 'اعلانات مکتب'}
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={handleAdd}
            className="shrink-0"
            aria-label="اعلان جدید"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">اعلان جدید</span>
          </Button>
        )}
      </div>

      {/* ─── فیلترها ─── */}
      {announcements?.length > 0 && (
        <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
          <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
            {FILTERS.map((f) => {
              const count = counts[f.value] || 0
              if (f.value !== 'all' && count === 0) return null
              return (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-1.5 ${
                    filter === f.value
                      ? 'bg-brand-700 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
                  }`}
                >
                  {f.value === 'pinned' && <Pin size={12} />}
                  <span>{f.label}</span>
                  <span
                    className={`text-[10px] fa-num ${
                      filter === f.value ? 'opacity-80' : 'opacity-60'
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
      ) : announcements?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <EmptyState
            icon={Bell}
            title="هنوز اعلانی منتشر نشده"
            description={
              isAdmin
                ? 'برای شروع، اولین اعلان را منتشر کن'
                : 'به‌زودی اعلانات اینجا نمایش داده می‌شود'
            }
            action={
              isAdmin ? (
                <Button onClick={handleAdd}>
                  <Plus size={18} />
                  <span>اعلان جدید</span>
                </Button>
              ) : null
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <EmptyState
            icon={Bell}
            title="اعلانی در این دسته نیست"
            description="فیلتر دیگری انتخاب کن"
          />
        </div>
      ) : (
        <AnnouncementList
          announcements={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
          onShare={handleShare}
          canManage={isAdmin}
        />
      )}

      {/* ─── تعداد ─── */}
      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          {toFaNum(filtered.length)} اعلان
          {filter !== 'all' && announcements.length !== filtered.length && (
            <> از {toFaNum(announcements.length)}</>
          )}
        </p>
      )}

      {/* ─── فرم ─── */}
      {isAdmin && (
        <AnnouncementForm
          open={formOpen}
          announcement={editing}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
          loading={createMut.isPending || updateMut.isPending}
        />
      )}

      {/* ─── مودال اشتراک ─── */}
      <AnnouncementShareModal
        open={shareOpen}
        announcement={shareTarget}
        onClose={() => setShareOpen(false)}
      />
    </PageWrapper>
  )
}