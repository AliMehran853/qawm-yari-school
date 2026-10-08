import { useState, useMemo } from 'react'
import {
  Plus,
  Users,
  Search,
  X,
  Crown,
  Star,
  Briefcase,
} from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import TeacherForm from '../components/TeacherForm'
import TeacherList from '../components/TeacherList'
import TeacherDetailModal from '../components/TeacherDetailModal'
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
  const [viewing, setViewing] = useState(null)
  const [search, setSearch] = useState('')

  const { data: teachers, isLoading } = useTeachers()
  const createMut = useCreateTeacher()
  const updateMut = useUpdateTeacher()
  const deleteMut = useDeleteTeacher()

  // ─── شمارش‌ها ───
  const stats = useMemo(() => {
    const list = teachers || []
    return {
      total: list.length,
      teachers: list.filter((t) => t.position === 'teacher' || !t.position)
        .length,
      headTeacher: list.filter((t) => t.position === 'head_teacher').length,
      principal: list.filter((t) => t.position === 'principal').length,
      staff: list.filter((t) => t.position === 'staff').length,
    }
  }, [teachers])

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

  // ─── کلیک روی معلم ───
  function handleView(teacher) {
    setViewing(teacher)
  }

  async function handleSubmit(values) {
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, updates: values })
    } else {
      await createMut.mutateAsync(values)
    }
    setFormOpen(false)
    setEditing(null)
  }

  async function handleDelete(teacher) {
    if (!confirm(`معلم «${teacher.name}» حذف شود؟`)) return
    try {
      await deleteMut.mutateAsync(teacher.id)
    } catch (e) {}
  }

  return (
    <PageWrapper>
      {/* ═══ هدر ═══ */}
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

      {/* ═══ کارت‌های آمار ═══ */}
      {teachers?.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          <StatCard
            icon={Users}
            label="معلمان"
            value={stats.teachers}
            gradient="from-emerald-500 to-emerald-700"
            desc="کادر تدریسی"
          />
          <StatCard
            icon={Star}
            label="سرمعلم"
            value={stats.headTeacher}
            gradient="from-brand-500 to-brand-700"
            desc="مسئول آموزش"
            unique
          />
          <StatCard
            icon={Crown}
            label="آمر"
            value={stats.principal}
            gradient="from-gold-400 to-gold-600"
            desc="مسئول مکتب"
            unique
          />
          <StatCard
            icon={Briefcase}
            label="ملازم / خدمه"
            value={stats.staff}
            gradient="from-gray-500 to-gray-700"
            desc="کارمندان"
          />
        </div>
      )}

      {/* ═══ جستجو ═══ */}
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
              aria-label="پاک کردن"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* ═══ لیست معلمان ═══ */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
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
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* ═══ تعداد ═══ */}
      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          {toFaNum(filtered.length)} معلم
          {search && teachers.length !== filtered.length && (
            <> از {toFaNum(teachers.length)}</>
          )}
        </p>
      )}

      {/* ═══ فرم افزودن/ویرایش ═══ */}
      <TeacherForm
        open={formOpen}
        teacher={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />

      {/* ═══ مودال جزئیات ═══ */}
      <TeacherDetailModal
        open={!!viewing}
        teacher={viewing}
        onClose={() => setViewing(null)}
        onEdit={handleEdit}
      />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════
   کارت آمار
   ═══════════════════════════════════════ */
function StatCard({ icon: Icon, label, value, gradient, desc, unique }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
    >
      <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/15 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Icon size={18} className="text-white" />
          </div>
          {unique && value > 0 && (
            <span className="text-[9px] font-bold bg-white/25 text-white px-2 py-0.5 rounded-full">
              {value === 1 ? '✓' : '!'}
            </span>
          )}
        </div>

        <p className="text-3xl font-bold text-white fa-num leading-none">
          {toFaNum(value)}
        </p>
        <p className="text-xs font-medium text-white/90 mt-1">{label}</p>
        {desc && <p className="text-[10px] text-white/60 mt-0.5">{desc}</p>}
      </div>
    </div>
  )
}