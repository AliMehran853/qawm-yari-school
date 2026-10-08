import { useState } from 'react'
import { Users, CheckCircle2, UserCheck } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import Card from '../../../components/ui/Card'
import GradeSubjectsList from '../components/GradeSubjectsList'
import AssignTeacherModal from '../components/AssignTeacherModal'
import AssignAllModal from '../components/AssignAllModal'
import {
  useAssignments,
  useAssignTeacher,
  useUnassignTeacher,
  useAssignAll,
} from '../useAssignments'
import { useTeachers } from '../../teachers/useTeachers'
import { toFaNum } from '../../../utils/number'

// ═══ صنف‌هایی که یک معلم برای همه مضامین دارند ═══
const GRADES_WITH_SINGLE_TEACHER = [1, 2, 3]

export default function AssignmentsPage() {
  const [selectedGrade, setSelectedGrade] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [assignAllOpen, setAssignAllOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  const { data: items, isLoading } = useAssignments(selectedGrade)
  const { data: teachers } = useTeachers()
  const assignMut = useAssignTeacher()
  const unassignMut = useUnassignTeacher()
  const assignAllMut = useAssignAll()

  const assignedCount = items?.filter((i) => i.teacher).length || 0
  const totalCount = items?.length || 0

  // ─── آیا این صنف یک معلم برای همه دارد؟ ───
  const usesSingleTeacher = GRADES_WITH_SINGLE_TEACHER.includes(selectedGrade)

  // ─── معلم‌های فعلی این صنف ───
  const currentTeacherIds = [
    ...new Set((items || []).filter((i) => i.teacher).map((i) => i.teacher.id)),
  ]

  // ─── آیا همه مضامین یک معلم دارند؟ ───
  const allHaveSameTeacher =
    totalCount > 0 &&
    assignedCount === totalCount &&
    currentTeacherIds.length === 1

  function handleAssignClick(item) {
    setCurrentItem(item)
    setModalOpen(true)
  }

  function handleAssignAllClick() {
    setAssignAllOpen(true)
  }

  async function handleAssign(values) {
    await assignMut.mutateAsync(values)
    setModalOpen(false)
  }

  async function handleAssignAll(values) {
    const subjectIds = (items || []).map((i) => i.subject.id)
    await assignAllMut.mutateAsync({
      teacher_id: values.teacher_id,
      grade: selectedGrade,
      subject_ids: subjectIds,
    })
    setAssignAllOpen(false)
  }

  async function handleClearAll() {
    const subjectIds = (items || []).map((i) => i.subject.id)
    await assignAllMut.mutateAsync({
      teacher_id: null,
      grade: selectedGrade,
      subject_ids: subjectIds,
    })
    setAssignAllOpen(false)
  }

  async function handleUnassign(id, grade) {
    if (!confirm('این تعیین حذف شود؟')) return
    try {
      await unassignMut.mutateAsync({ id, grade })
    } catch (e) {}
  }

  async function handleUnassignFromModal(id, grade) {
    if (!confirm('این تعیین حذف شود؟')) return
    try {
      await unassignMut.mutateAsync({ id, grade })
      setModalOpen(false)
    } catch (e) {}
  }

  return (
    <PageWrapper>
      {/* ═══ هدر ═══ */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
            تعیین معلم
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            {usesSingleTeacher
              ? 'برای این صنف، یک معلم برای همه مضامین تعیین می‌شود'
              : 'برای هر مضمون، معلم مسئول را تعیین کن'}
          </p>
        </div>

        {/* ⭐ دکمه تعیین همه — فقط برای صنوف ۱ تا ۳ */}
        {usesSingleTeacher &&
          items &&
          items.length > 0 &&
          teachers &&
          teachers.length > 0 && (
            <Button
              onClick={handleAssignAllClick}
              className="shrink-0 bg-gradient-to-l from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 border-none"
              aria-label="تعیین یک معلم برای همه"
            >
              <UserCheck size={18} />
              <span className="hidden sm:inline">تعیین یک معلم برای همه</span>
            </Button>
          )}
      </div>

      {/* ═══ انتخاب صنف ═══ */}
      <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition fa-num ${
                selectedGrade === g
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
              }`}
            >
              صنف {toFaNum(g)}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ پیام اطلاعاتی برای صنوف ۴ به بالا ═══ */}
      {!usesSingleTeacher && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-800 leading-relaxed">
            📚 در صنوف ۴ تا ۱۲، هر مضمون معلم جداگانه دارد. برای هر مضمون جداگانه
            معلم تعیین کن.
          </p>
        </div>
      )}

      {/* ═══ پیشرفت ═══ */}
      {totalCount > 0 && (
        <div className="mb-4 flex items-center gap-3 text-xs sm:text-sm flex-wrap">
          <div className="flex items-center gap-1.5 text-gray-600">
            <CheckCircle2 size={16} className="text-brand-600" />
            <span className="fa-num">
              {toFaNum(assignedCount)} از {toFaNum(totalCount)}
            </span>
            <span>تعیین شده</span>
          </div>

          {assignedCount === totalCount && (
            <span className="badge badge-success">کامل</span>
          )}

          {allHaveSameTeacher && items[0]?.teacher && (
            <span className="badge badge-gold text-[10px]">
              همه توسط یک معلم: {items[0].teacher.name}
            </span>
          )}
        </div>
      )}

      {/* ═══ کارت اصلی ═══ */}
      <Card flat className="overflow-hidden p-0">
        {isLoading ? (
          <div className="py-16 text-center">
            <div
              className="spinner text-brand-700 mx-auto"
              style={{ width: 28, height: 28 }}
            />
            <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
          </div>
        ) : !teachers || teachers.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Users}
              title="اول معلم اضافه کن"
              description="قبل از تعیین معلم به مضامین، باید معلم‌ها را ثبت کنی"
            />
          </div>
        ) : (
          <GradeSubjectsList
            items={items || []}
            onAssignClick={handleAssignClick}
            onUnassignClick={handleUnassign}
          />
        )}
      </Card>

      {/* ═══ مودال تعیین تکی ═══ */}
      <AssignTeacherModal
        open={modalOpen}
        subject={currentItem?.subject}
        currentTeacher={currentItem?.teacher}
        teachers={teachers || []}
        onClose={() => setModalOpen(false)}
        onAssign={handleAssign}
        onUnassign={handleUnassignFromModal}
        loading={assignMut.isPending || unassignMut.isPending}
      />

      {/* ⭐ مودال تعیین همه — فقط صنوف ۱-۳ */}
      {usesSingleTeacher && (
        <AssignAllModal
          open={assignAllOpen}
          grade={selectedGrade}
          subjectsCount={totalCount}
          currentTeacherIds={currentTeacherIds}
          teachers={teachers || []}
          onAssign={handleAssignAll}
          onClearAll={handleClearAll}
          onClose={() => setAssignAllOpen(false)}
          loading={assignAllMut.isPending}
        />
      )}
    </PageWrapper>
  )
}