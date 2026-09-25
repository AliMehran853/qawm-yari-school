import { useState, useMemo } from 'react'
import { Plus, GraduationCap, Search, X } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import Card from '../../../components/ui/Card'
import StudentForm from '../components/StudentForm'
import StudentList from '../components/StudentList'
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from '../useStudents'
import { toFaNum } from '../../../utils/number'

export default function StudentsPage() {
  const [gradeFilter, setGradeFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data: students, isLoading } = useStudents({
    grade: gradeFilter,
    status: 'active',
  })
  const createMut = useCreateStudent()
  const updateMut = useUpdateStudent()
  const deleteMut = useDeleteStudent()

  const filtered = useMemo(() => {
    if (!students) return []
    const q = search.trim().toLowerCase()
    if (!q) return students
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.father_name?.toLowerCase().includes(q) ||
        s.student_code?.toLowerCase().includes(q) ||
        s.phone?.includes(q)
    )
  }, [students, search])

  function handleAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(student) {
    setEditing(student)
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

  async function handleDelete(student) {
    if (!confirm(`دانش‌آموز «${student.name}» حذف شود؟`)) return
    try {
      await deleteMut.mutateAsync(student.id)
    } catch (e) {}
  }

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
            دانش‌آموزان
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            مدیریت دانش‌آموزان مکتب
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0" aria-label="افزودن">
          <Plus size={18} />
          <span className="hidden sm:inline">ثبت دانش‌آموز</span>
        </Button>
      </div>

      {/* ─── فیلتر صنف ─── */}
      <div className="mb-3 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          <FilterChip
            active={gradeFilter === null}
            onClick={() => setGradeFilter(null)}
          >
            همه
          </FilterChip>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
            <FilterChip
              key={g}
              active={gradeFilter === g}
              onClick={() => setGradeFilter(g)}
            >
              صنف {toFaNum(g)}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* ─── جستجو ─── */}
      {students?.length > 0 && (
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام، پدر، کد یا شماره..."
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
        ) : students?.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={GraduationCap}
              title="هنوز دانش‌آموزی ثبت نشده"
              description="برای شروع، اولین دانش‌آموز را اضافه کن"
              action={
                <Button onClick={handleAdd}>
                  <Plus size={18} />
                  <span>ثبت دانش‌آموز</span>
                </Button>
              }
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Search}
              title="نتیجه‌ای پیدا نشد"
              description={`هیچ دانش‌آموزی با «${search}» مطابقت ندارد`}
            />
          </div>
        ) : (
          <StudentList
            students={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      {/* ─── تعداد ─── */}
      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          {toFaNum(filtered.length)} دانش‌آموز
          {search && students.length !== filtered.length && (
            <> از {toFaNum(students.length)}</>
          )}
        </p>
      )}

      {/* ─── فرم ─── */}
      <StudentForm
        open={formOpen}
        student={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />
    </PageWrapper>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition ${
        active
          ? 'bg-brand-700 text-white shadow-sm'
          : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
      }`}
    >
      {children}
    </button>
  )
}