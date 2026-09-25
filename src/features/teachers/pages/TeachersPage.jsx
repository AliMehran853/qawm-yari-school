import { useState, useMemo } from 'react'
import { Plus, Users, Search, X } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import Card from '../../../components/ui/Card'
import TeacherForm from '../components/TeacherForm'
import TeacherList from '../components/TeacherList'
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
} from '../useTeachers'
import { toFaNum } from '../../../utils/number'

export default function TeachersPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')

  const { data: teachers, isLoading } = useTeachers()
  const createMut = useCreateTeacher()
  const updateMut = useUpdateTeacher()
  const deleteMut = useDeleteTeacher()

  const filtered = useMemo(() => {
    if (!teachers) return []
    const q = search.trim().toLowerCase()
    if (!q) return teachers
    return teachers.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.phone?.includes(q) ||
        t.address?.toLowerCase().includes(q)
    )
  }, [teachers, search])

  function handleAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(teacher) {
    setEditing(teacher)
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

  async function handleDelete(teacher) {
    if (!confirm(`معلم «${teacher.name}» حذف شود؟`)) return
    try {
      await deleteMut.mutateAsync(teacher.id)
    } catch (e) {}
  }

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
            معلمان
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            مدیریت کادر آموزشی مکتب
          </p>
        </div>

        <Button
          onClick={handleAdd}
          className="shrink-0"
          aria-label="افزودن معلم"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">افزودن معلم</span>
        </Button>
      </div>

      {/* ─── جستجو ─── */}
      {teachers?.length > 0 && (
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام، شماره یا آدرس..."
            className="input pr-10 pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              aria-label="پاک کردن جستجو"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* ─── کارت اصلی ─── */}
      <Card flat className="overflow-hidden p-0">
        {isLoading ? (
          <div className="py-16 text-center">
            <div
              className="spinner text-brand-700 mx-auto"
              style={{ width: 28, height: 28 }}
            />
            <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
          </div>
        ) : teachers?.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Users}
              title="هنوز معلمی ثبت نشده"
              description="برای شروع، اولین معلم را اضافه کن"
              action={
                <Button onClick={handleAdd}>
                  <Plus size={18} />
                  <span>افزودن معلم</span>
                </Button>
              }
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Search}
              title="نتیجه‌ای پیدا نشد"
              description={`هیچ معلمی با «${search}» مطابقت ندارد`}
            />
          </div>
        ) : (
          <TeacherList
            teachers={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      {/* ─── تعداد ─── */}
      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          {toFaNum(filtered.length)} معلم
          {search && teachers.length !== filtered.length && (
            <> از {toFaNum(teachers.length)}</>
          )}
        </p>
      )}

      {/* ─── فرم ─── */}
      <TeacherForm
        open={formOpen}
        teacher={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />
    </PageWrapper>
  )
}