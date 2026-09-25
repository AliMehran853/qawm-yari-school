import { useState } from 'react'
import { Plus, School } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import Card from '../../../components/ui/Card'
import ClassForm from '../components/ClassForm'
import ClassList from '../components/ClassList'
import {
  useClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
} from '../useClasses'
import { toFaNum } from '../../../utils/number'

export default function ClassesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data: classes, isLoading } = useClasses()
  const createMut = useCreateClass()
  const updateMut = useUpdateClass()
  const deleteMut = useDeleteClass()

  function handleAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(classItem) {
    setEditing(classItem)
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

  async function handleDelete(classItem) {
    if (!confirm(`صنف ${classItem.grade} حذف شود؟`)) return
    try {
      await deleteMut.mutateAsync(classItem.id)
    } catch (e) {}
  }

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
            صنوف
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            مدیریت صنوف مکتب
          </p>
        </div>

        <Button
          onClick={handleAdd}
          className="shrink-0"
          aria-label="افزودن صنف"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">افزودن صنف</span>
        </Button>
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
        ) : classes?.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={School}
              title="هنوز صنفی ثبت نشده"
              description="برای شروع، اولین صنف را اضافه کن"
              action={
                <Button onClick={handleAdd}>
                  <Plus size={18} />
                  <span>افزودن صنف</span>
                </Button>
              }
            />
          </div>
        ) : (
          <ClassList
            classes={classes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      {/* ─── تعداد ─── */}
      {classes?.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          {toFaNum(classes.length)} صنف
        </p>
      )}

      {/* ─── فرم ─── */}
      <ClassForm
        open={formOpen}
        classItem={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />
    </PageWrapper>
  )
}