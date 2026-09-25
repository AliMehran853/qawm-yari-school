import { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import Card from '../../../components/ui/Card'
import SubjectForm from '../components/SubjectForm'
import SubjectList from '../components/SubjectList'
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from '../useSubjects'
import { toFaNum } from '../../../utils/number'

export default function SubjectsPage() {
  const [gradeFilter, setGradeFilter] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data: subjects, isLoading } = useSubjects(gradeFilter)
  const createMut = useCreateSubject()
  const updateMut = useUpdateSubject()
  const deleteMut = useDeleteSubject()

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
    if (!confirm(`مضمون «${subject.name}» حذف شود؟`)) return
    try {
      await deleteMut.mutateAsync(subject.id)
    } catch (e) {
      // toast خودکار نمایش داده می‌شود
    }
  }

  return (
    <PageWrapper>
      {/* ─── هدر صفحه: ریسپانسیو ─── */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
            مضامین
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            مدیریت مضامین هر صنف
          </p>
        </div>

        {/* دکمه افزودن: در موبایل فقط آیکن، در دسکتاپ با متن */}
        <Button
          onClick={handleAdd}
          className="shrink-0"
          size="md"
          aria-label="افزودن مضمون"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">افزودن مضمون</span>
        </Button>
      </div>

      {/* ─── فیلتر صنف: اسکرول افقی ─── */}
      <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
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
        ) : subjects?.length === 0 ? (
          <div className="p-6">
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
        ) : (
          <SubjectList
            subjects={subjects}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      {/* ─── نمایش تعداد در پایین ─── */}
      {subjects?.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          {toFaNum(subjects.length)} مضمون نمایش داده می‌شود
        </p>
      )}

      {/* ─── فرم ─── */}
      <SubjectForm
        open={formOpen}
        subject={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />
    </PageWrapper>
  )
}

// چیپ فیلتر قابل استفاده مجدد
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