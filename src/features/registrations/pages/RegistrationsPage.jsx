import { useState, useMemo } from 'react'
import { Plus, ClipboardList, Search, X } from 'lucide-react'
import { toast } from 'sonner'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import Input from '../../../components/ui/Input'
import RegistrationForm from '../components/RegistrationForm'
import RegistrationCard from '../components/RegistrationCard'
import {
  useRegistrations,
  useCreateRegistration,
  useUpdateRegistration,
  useDeleteRegistration,
  useApproveRegistration,
  useRejectRegistration,
} from '../useRegistrations'
import { useAuthStore } from '../../../store/authStore'
import { CURRENT_YEAR } from '../../../lib/constants'
import { toFaNum } from '../../../utils/number'

const FILTERS = [
  { value: null, label: 'همه' },
  { value: 'pending', label: 'در انتظار' },
  { value: 'approved', label: 'تأیید شده' },
  { value: 'rejected', label: 'رد شده' },
]

export default function RegistrationsPage() {
  const [filter, setFilter] = useState('pending')
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const profile = useAuthStore((s) => s.profile)
  const { data: registrations, isLoading } = useRegistrations(filter)
  const createMut = useCreateRegistration()
  const updateMut = useUpdateRegistration()
  const deleteMut = useDeleteRegistration()
  const approveMut = useApproveRegistration()
  const rejectMut = useRejectRegistration()

  const filtered = useMemo(() => {
    if (!registrations) return []
    const q = search.trim().toLowerCase()
    if (!q) return registrations
    return registrations.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.father_name?.toLowerCase().includes(q) ||
        r.phone?.includes(q)
    )
  }, [registrations, search])

  function handleAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(reg) {
    setEditing(reg)
    setFormOpen(true)
  }

  async function handleSubmit(values) {
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, updates: values })
    } else {
      await createMut.mutateAsync({
        ...values,
        year: CURRENT_YEAR,
        status: 'pending',
      })
    }
    setFormOpen(false)
  }

  async function handleDelete(reg) {
    if (!confirm(`ثبت‌نام «${reg.name}» حذف شود؟`)) return
    try {
      await deleteMut.mutateAsync(reg.id)
    } catch (e) {}
  }

  async function handleApprove(reg) {
    if (!confirm(`ثبت‌نام «${reg.name}» تأیید شود؟\nیک شاگرد با کد خودکار ساخته می‌شود.`))
      return
    try {
      await approveMut.mutateAsync({ id: reg.id, reviewerId: profile?.id })
    } catch (e) {}
  }

  function openReject(reg) {
    setRejectModal(reg)
    setRejectReason('')
  }

  async function handleRejectConfirm() {
    if (!rejectReason.trim()) {
      toast.error('دلیل رد را وارد کن')
      return
    }
    try {
      await rejectMut.mutateAsync({
        id: rejectModal.id,
        reason: rejectReason.trim(),
        reviewerId: profile?.id,
      })
      setRejectModal(null)
      setRejectReason('')
    } catch (e) {}
  }

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
            ثبت‌نام صنف اول
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            ثبت‌نام شاگردان جدید برای سال {toFaNum(CURRENT_YEAR)}
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0" aria-label="ثبت‌نام جدید">
          <Plus size={18} />
          <span className="hidden sm:inline">ثبت‌نام جدید</span>
        </Button>
      </div>

      {/* ─── فیلتر ─── */}
      <div className="mb-3 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value || 'all'}
              onClick={() => setFilter(f.value)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition ${
                filter === f.value
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── جستجو ─── */}
      {registrations?.length > 0 && (
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام، پدر یا شماره..."
            className="input pr-10 pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              aria-label="پاک کردن"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* ─── محتوا ─── */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div className="spinner text-brand-700 mx-auto" style={{ width: 28, height: 28 }} />
          <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <EmptyState
            icon={ClipboardList}
            title={
              filter === 'pending'
                ? 'ثبت‌نام در انتظاری نیست'
                : search
                ? 'نتیجه‌ای پیدا نشد'
                : 'هنوز ثبت‌نامی وجود ندارد'
            }
            description={
              filter === 'pending' && !search
                ? 'همه ثبت‌نام‌ها بررسی شده‌اند'
                : 'برای شروع، ثبت‌نام جدید بساز'
            }
            action={
              filter !== 'pending' && !search ? (
                <Button onClick={handleAdd}>
                  <Plus size={18} />
                  <span>ثبت‌نام جدید</span>
                </Button>
              ) : null
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((r) => (
            <RegistrationCard
              key={r.id}
              registration={r}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={openReject}
              isProcessing={approveMut.isPending || rejectMut.isPending}
            />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          {toFaNum(filtered.length)} ثبت‌نام
        </p>
      )}

      {/* ─── فرم ─── */}
      <RegistrationForm
        open={formOpen}
        registration={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />

      {/* ─── مودال رد ─── */}
      {rejectModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fade-in"
          dir="rtl"
          onClick={() => setRejectModal(null)}
        >
          <div
            className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-modal animate-slide-up p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-1">رد ثبت‌نام</h2>
            <p className="text-sm text-gray-500 mb-4">
              ثبت‌نام «{rejectModal.name}» رد شود؟
            </p>

            <div>
              <label className="input-label">دلیل رد *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="input min-h-[80px] resize-y"
                placeholder="مثلاً: مدارک ناقص"
                rows={3}
                autoFocus
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleRejectConfirm}
                disabled={rejectMut.isPending || !rejectReason.trim()}
                variant="danger"
                className="flex-1"
              >
                {rejectMut.isPending ? 'در حال رد...' : 'رد کن'}
              </Button>
              <Button variant="outline" onClick={() => setRejectModal(null)}>
                انصراف
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}