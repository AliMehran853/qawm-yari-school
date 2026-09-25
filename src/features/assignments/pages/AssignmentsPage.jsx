import { useState } from 'react'
import { Users, CheckCircle2 } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import EmptyState from '../../../components/ui/EmptyState'
import Card from '../../../components/ui/Card'
import GradeSubjectsList from '../components/GradeSubjectsList'
import AssignTeacherModal from '../components/AssignTeacherModal'
import {
  useAssignments,
  useAssignTeacher,
  useUnassignTeacher,
} from '../useAssignments'
import { useTeachers } from '../../teachers/useTeachers'
import { toFaNum } from '../../../utils/number'

export default function AssignmentsPage() {
  const [selectedGrade, setSelectedGrade] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  const { data: items, isLoading } = useAssignments(selectedGrade)
  const { data: teachers } = useTeachers()
  const assignMut = useAssignTeacher()
  const unassignMut = useUnassignTeacher()

  const assignedCount = items?.filter((i) => i.teacher).length || 0
  const totalCount = items?.length || 0

  function handleAssignClick(item) {
    setCurrentItem(item)
    setModalOpen(true)
  }

  async function handleAssign(values) {
    await assignMut.mutateAsync(values)
    setModalOpen(false)
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
      {/* ─── هدر ─── */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
          تعیین معلم
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          برای هر مضمون، معلم مسئول را تعیین کن
        </p>
      </div>

      {/* ─── انتخاب صنف ─── */}
      <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition ${
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

      {/* ─── پیشرفت ─── */}
      {totalCount > 0 && (
        <div className="mb-4 flex items-center gap-3 text-xs sm:text-sm">
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

      {/* ─── مودال تعیین ─── */}
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
    </PageWrapper>
  )
}