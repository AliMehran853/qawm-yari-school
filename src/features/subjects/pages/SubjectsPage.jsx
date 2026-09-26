import { useState, useMemo } from 'react'
import { Plus, BookOpen, Search, X, Pencil, Trash2 } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import SubjectForm from '../components/SubjectForm'
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from '../useSubjects'
import { toFaNum } from '../../../utils/number'

export default function SubjectsPage() {
  const [gradeFilter, setGradeFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  // همه را یک بار می‌گیریم، فیلتر سمت کلاینت
  const { data: allSubjects, isLoading } = useSubjects(null)
  const createMut = useCreateSubject()
  const updateMut = useUpdateSubject()
  const deleteMut = useDeleteSubject()

  // شمارش هر صنف
  const countsByGrade = useMemo(() => {
    if (!allSubjects) return {}
    const c = {}
    allSubjects.forEach((s) => {
      c[s.grade] = (c[s.grade] || 0) + 1
    })
    return c
  }, [allSubjects])

  // فیلتر و جستجو
  const filtered = useMemo(() => {
    if (!allSubjects) return []
    let list = allSubjects
    if (gradeFilter) list = list.filter((s) => s.grade === gradeFilter)
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.code?.toLowerCase().includes(q)
      )
    }
    return list
  }, [allSubjects, gradeFilter, search])

  function handleAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(subject) {
    setEditing(subject)
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

  async function handleDelete(subject) {
    if (!confirm(`مضمون «${subject.name}» از صنف ${subject.grade} حذف شود؟`))
      return
    try {
      await deleteMut.mutateAsync(subject.id)
    } catch (e) {}
  }

  return (
    <PageWrapper>
      {/* ═══ هدر ═══ */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
            مضامین
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            مدیریت مضامین هر صنف
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus size={18} />
          <span className="hidden sm:inline">افزودن مضمون</span>
        </Button>
      </div>

      {/* ═══ جستجو ═══ */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی نام یا کد مضمون..."
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

      {/* ═══ فیلتر صنف ═══ */}
      <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          <FilterChip
            active={gradeFilter === null}
            onClick={() => setGradeFilter(null)}
          >
            همه
            <span className="text-[10px] opacity-70 fa-num">
              ({toFaNum(allSubjects?.length || 0)})
            </span>
          </FilterChip>

          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => {
            const count = countsByGrade[g] || 0
            return (
              <FilterChip
                key={g}
                active={gradeFilter === g}
                onClick={() => setGradeFilter(g)}
              >
                صنف {toFaNum(g)}
                <span className="text-[10px] opacity-70 fa-num">
                  ({toFaNum(count)})
                </span>
              </FilterChip>
            )
          })}
        </div>
      </div>

      {/* ═══ محتوا ═══ */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 28, height: 28 }}
          />
          <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
        </div>
      ) : !allSubjects || allSubjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <EmptyState
            icon={BookOpen}
            title="هنوز مضمونی ثبت نشده"
            description="برای شروع، اولین مضمون را اضافه کن"
            action={
              <Button onClick={handleAdd}>
                <Plus size={18} />
                <span>افزودن مضمون</span>
              </Button>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <EmptyState
            icon={Search}
            title="نتیجه‌ای پیدا نشد"
            description={
              search
                ? `هیچ مضمونی با «${search}» مطابقت ندارد`
                : 'این صنف مضمونی ندارد'
            }
            action={
              gradeFilter ? (
                <Button onClick={handleAdd}>
                  <Plus size={18} />
                  <span>افزودن مضمون به صنف {toFaNum(gradeFilter)}</span>
                </Button>
              ) : null
            }
          />
        </div>
      ) : (
        <>
          {/* Grid کارت‌ها */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((s) => (
              <SubjectCard
                key={s.id}
                subject={s}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* تعداد */}
          <p className="text-xs text-gray-400 text-center mt-5">
            {toFaNum(filtered.length)} مضمون
            {gradeFilter && (
              <>
                {' '}
                در صنف {toFaNum(gradeFilter)}
              </>
            )}
            {search && (
              <>
                {' '}
                از {toFaNum(allSubjects.length)}
              </>
            )}
          </p>
        </>
      )}

      {/* ═══ فرم ═══ */}
      <SubjectForm
        open={formOpen}
        subject={editing}
        defaultGrade={gradeFilter}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />
    </PageWrapper>
  )
}

/* ─── چیپ فیلتر ─── */
function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-1.5 ${
        active
          ? 'bg-brand-700 text-white shadow-sm'
          : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
      }`}
    >
      {children}
    </button>
  )
}

/* ─── کارت مضمون ─── */
function SubjectCard({ subject, onEdit, onDelete }) {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-card transition-all p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
          <BookOpen size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-gray-900 leading-snug truncate">
            {subject.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="badge badge-brand text-[10px]">
              صنف {toFaNum(subject.grade)}
            </span>
            {subject.code && (
              <span
                className="text-[10px] text-gray-400 font-mono"
                dir="ltr"
              >
                {subject.code}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={() => onEdit(subject)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            aria-label="ویرایش"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(subject)}
            className="p-2 text-danger hover:bg-red-50 rounded-lg transition"
            aria-label="حذف"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}