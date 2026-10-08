import { useState, useMemo } from 'react'
import {
  Plus,
  GraduationCap,
  Search,
  X,
  Users,
  Trophy,
} from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import StudentForm from '../components/StudentForm'
import StudentList from '../components/StudentList'
import StudentGradesModal from '../components/StudentGradesModal'
import {
  useStudents,
  useStudentsWithRanks,
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
  const [showRanks, setShowRanks] = useState(true)
  const [viewingStudent, setViewingStudent] = useState(null) // ⭐ جدید

  const { data: allStudents, isLoading: loadingAll } = useStudents({
    grade: null,
    status: 'active',
  })

  const { data: rankedStudents, isLoading: loadingRanked } =
    useStudentsWithRanks(gradeFilter)

  const students = gradeFilter ? rankedStudents : allStudents

  const createMut = useCreateStudent()
  const updateMut = useUpdateStudent()
  const deleteMut = useDeleteStudent()

  const countsByGrade = useMemo(() => {
    if (!allStudents) return {}
    const counts = {}
    allStudents.forEach((s) => {
      counts[s.grade] = (counts[s.grade] || 0) + 1
    })
    return counts
  }, [allStudents])

  const totalCount = allStudents?.length || 0
  const currentGradeCount = gradeFilter
    ? countsByGrade[gradeFilter] || 0
    : totalCount

  const filtered = useMemo(() => {
    if (!students) return []
    const q = search.trim().toLowerCase()
    if (!q) return students
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.father_name?.toLowerCase().includes(q) ||
        s.grandfather_name?.toLowerCase().includes(q) ||
        s.phone?.includes(q)
    )
  }, [students, search])

  const isLoading = gradeFilter ? loadingRanked : loadingAll

  function handleAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(student) {
    setEditing(student)
    setFormOpen(true)
  }

  // ⭐ کلیک روی دکمه نمرات
  function handleViewGrades(student) {
    setViewingStudent(student)
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
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
            دانش‌آموزان
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            {gradeFilter
              ? `لیست دانش‌آموزان صنف ${toFaNum(gradeFilter)} — مرتب بر اساس رتبه`
              : 'مدیریت دانش‌آموزان مکتب'}
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0" aria-label="افزودن">
          <Plus size={18} />
          <span className="hidden sm:inline">ثبت دانش‌آموز</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 shadow-lg">
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
              <Users size={26} className="text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium">
                کل دانش‌آموزان مکتب
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-white fa-num leading-none mt-1">
                {toFaNum(totalCount)}
              </p>
              <p className="text-white/70 text-[11px] mt-1">دانش‌آموز فعال</p>
            </div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl p-5 shadow-lg transition-all ${
            gradeFilter
              ? 'bg-gradient-to-br from-gold-400 to-gold-600'
              : 'bg-gradient-to-br from-gray-100 to-gray-200'
          }`}
        >
          {gradeFilter && (
            <>
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            </>
          )}

          <div className="relative flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${
                gradeFilter
                  ? 'bg-white/25 backdrop-blur-sm border-white/30'
                  : 'bg-white border-gray-200'
              }`}
            >
              <GraduationCap
                size={26}
                className={gradeFilter ? 'text-white' : 'text-gray-400'}
              />
            </div>
            <div>
              <p
                className={`text-xs font-medium ${
                  gradeFilter ? 'text-white/85' : 'text-gray-500'
                }`}
              >
                {gradeFilter
                  ? `دانش‌آموزان صنف ${toFaNum(gradeFilter)}`
                  : 'یک صنف را انتخاب کن'}
              </p>
              <p
                className={`text-3xl sm:text-4xl font-bold fa-num leading-none mt-1 ${
                  gradeFilter ? 'text-white' : 'text-gray-400'
                }`}
              >
                {gradeFilter ? toFaNum(currentGradeCount) : '—'}
              </p>
              <p
                className={`text-[11px] mt-1 ${
                  gradeFilter ? 'text-white/75' : 'text-gray-400'
                }`}
              >
                {gradeFilter
                  ? `از مجموع ${toFaNum(totalCount)} دانش‌آموز`
                  : 'برای دیدن رتبه‌بندی، روی یک صنف کلیک کن'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          <FilterChip
            active={gradeFilter === null}
            onClick={() => setGradeFilter(null)}
            count={totalCount}
          >
            همه
          </FilterChip>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => {
            const count = countsByGrade[g] || 0
            return (
              <FilterChip
                key={g}
                active={gradeFilter === g}
                onClick={() => setGradeFilter(g)}
                count={count}
                dim={count === 0}
              >
                صنف {toFaNum(g)}
              </FilterChip>
            )
          })}
        </div>
      </div>

      {gradeFilter && students && students.length > 0 && (
        <div className="mb-4 flex items-center justify-between gap-3 p-3 bg-brand-50/60 border border-brand-100 rounded-xl">
          <div className="flex items-center gap-2 min-w-0">
            <Trophy size={16} className="text-gold-600 shrink-0" />
            <p className="text-xs sm:text-sm text-brand-800">
              {showRanks ? 'لیست بر اساس رتبه مرتب شده' : 'نمایش بدون رتبه'}
            </p>
          </div>
          <button
            onClick={() => setShowRanks((v) => !v)}
            className={`relative w-12 h-6 rounded-full transition shrink-0 ${
              showRanks ? 'bg-gold-500' : 'bg-gray-300'
            }`}
            aria-label="تغییر نمایش رتبه"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition ${
                showRanks ? 'left-0.5' : 'left-6'
              }`}
            />
          </button>
        </div>
      )}

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
            placeholder="جستجوی نام، پدر، پدرکلان یا شماره..."
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

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
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
              title={
                gradeFilter
                  ? `صنف ${toFaNum(gradeFilter)} دانش‌آموزی ندارد`
                  : 'هنوز دانش‌آموزی ثبت نشده'
              }
              description={
                gradeFilter
                  ? 'برای این صنف، اولین دانش‌آموز را ثبت کن'
                  : 'برای شروع، اولین دانش‌آموز را اضافه کن'
              }
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
            onViewGrades={handleViewGrades}
            showRanks={gradeFilter && showRanks}
          />
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          {toFaNum(filtered.length)} دانش‌آموز نمایش داده می‌شود
          {search && students.length !== filtered.length && (
            <> از {toFaNum(students.length)}</>
          )}
        </p>
      )}

      <StudentForm
        open={formOpen}
        student={editing}
        defaultGrade={gradeFilter}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />

      {/* ⭐ مودال نمرات */}
      <StudentGradesModal
        open={!!viewingStudent}
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
      />
    </PageWrapper>
  )
}

function FilterChip({ active, onClick, count, dim = false, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-1.5 ${
        active
          ? 'bg-brand-700 text-white shadow-sm'
          : dim
          ? 'bg-gray-50 border border-gray-200 text-gray-400 hover:border-gray-300'
          : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
      }`}
    >
      <span>{children}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] fa-num font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center ${
            active
              ? 'bg-white/25 text-white'
              : dim
              ? 'bg-gray-200 text-gray-500'
              : 'bg-brand-50 text-brand-700'
          }`}
        >
          {toFaNum(count)}
        </span>
      )}
    </button>
  )
}