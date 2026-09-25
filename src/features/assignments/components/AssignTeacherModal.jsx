import { useState, useMemo } from 'react'
import { X, Search, Check } from 'lucide-react'
import Button from '../../../components/ui/Button'
import { toFaNum } from '../../../utils/number'

export default function AssignTeacherModal({
  open,
  subject,
  currentTeacher,
  teachers,
  onClose,
  onAssign,
  onUnassign,
  loading,
}) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(currentTeacher?.id || null)

  const filtered = useMemo(() => {
    if (!teachers) return []
    const q = search.trim().toLowerCase()
    if (!q) return teachers
    return teachers.filter((t) => t.name?.toLowerCase().includes(q))
  }, [teachers, search])

  if (!open || !subject) return null

  function handleSubmit() {
    if (!selectedId) return
    onAssign({
      teacher_id: selectedId,
      subject_id: subject.id,
      grade: subject.grade,
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-modal animate-slide-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-base sm:text-lg truncate">
              تعیین معلم
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {subject.name} — صنف {toFaNum(subject.grade)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition shrink-0"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        {/* جستجو */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی معلم..."
              className="input pr-9 text-sm py-2"
            />
          </div>
        </div>

        {/* لیست معلمان */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500">معلمی پیدا نشد</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((t) => {
                const active = selectedId === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`w-full flex items-center gap-3 p-3 text-right transition ${
                      active ? 'bg-brand-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 overflow-hidden">
                      {t.photo_url ? (
                        <img
                          src={t.photo_url}
                          alt={t.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-bold">
                          {t.name?.charAt(0) || '؟'}
                        </span>
                      )}
                    </div>
                    <span className="flex-1 font-medium text-gray-900 truncate">
                      {t.name}
                    </span>
                    {active && (
                      <Check size={18} className="text-brand-700 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* دکمه‌ها */}
        <div className="border-t border-gray-200 p-3 sm:p-4 space-y-2">
          {currentTeacher && (
            <button
              onClick={() => onUnassign(currentTeacher.id, subject.grade)}
              className="w-full text-sm text-danger hover:bg-red-50 py-2 rounded-lg transition"
              disabled={loading}
            >
              حذف تعیین فعلی
            </button>
          )}
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedId || selectedId === currentTeacher?.id}
              className="flex-1"
            >
              {loading ? 'در حال ذخیره...' : 'تعیین'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              انصراف
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}