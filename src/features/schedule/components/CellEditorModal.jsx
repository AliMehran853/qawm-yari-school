import { useState, useEffect, useMemo } from 'react'
import { X, Search, BookOpen, Check, Trash2 } from 'lucide-react'
import Button from '../../../components/ui/Button'
import { toFaNum } from '../../../utils/number'
import { DAY_LABELS } from '../../../lib/scheduleConstants'

export default function CellEditorModal({
  open,
  grade,
  day,
  period,
  current,
  subjects,
  assignments,
  onSave,
  onClose,
  saving,
}) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    setSelectedId(current?.subject_id || null)
    setSearch('')
  }, [current, open, day, period])

  // ─── پیدا کردن معلم برای مضمون انتخاب‌شده ───
  const teacherForSelected = useMemo(() => {
    if (!selectedId || !assignments) return null
    const assign = assignments.find((a) => a.subject?.id === selectedId)
    return assign?.teacher || null
  }, [selectedId, assignments])

  // ─── فیلتر مضامین ───
  const filtered = useMemo(() => {
    if (!subjects) return []
    const q = search.trim().toLowerCase()
    if (!q) return subjects
    return subjects.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) || s.code?.toLowerCase().includes(q)
    )
  }, [subjects, search])

  if (!open) return null

  function handleSave() {
    if (!selectedId) return
    onSave({
      grade,
      day,
      period,
      subject_id: selectedId,
      teacher_id: teacherForSelected?.id || null,
    })
  }

  function handleClear() {
    if (!current?.subject_id) return
    if (!confirm('این خانه پاک شود؟')) return
    onSave({
      grade,
      day,
      period,
      subject_id: null,
      teacher_id: null,
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center animate-fade-in"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-modal animate-slide-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══ هدر ═══ */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10 sm:rounded-t-2xl">
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-base text-gray-900">
              انتخاب مضمون
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              صنف {toFaNum(grade)} — {DAY_LABELS[day]} — زنگ {toFaNum(period)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition shrink-0"
            aria-label="بستن"
          >
            <X size={18} />
          </button>
        </div>

        {/* ═══ جستجو ═══ */}
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
              placeholder="جستجوی مضمون..."
              className="input pr-9 py-2 text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* ═══ لیست مضامین ═══ */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6 text-center">
              <BookOpen size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">
                {search ? 'نتیجه‌ای پیدا نشد' : 'مضمونی ثبت نشده'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((s) => {
                const isActive = selectedId === s.id
                const assignment = assignments?.find(
                  (a) => a.subject?.id === s.id
                )
                const teacher = assignment?.teacher

                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`w-full flex items-center gap-3 p-3 text-right transition ${
                      isActive ? 'bg-brand-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white'
                          : 'bg-brand-50 text-brand-700'
                      }`}
                    >
                      <BookOpen size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {s.name}
                      </p>
                      {teacher ? (
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {teacher.name}
                        </p>
                      ) : (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          بدون معلم
                        </p>
                      )}
                    </div>
                    {isActive && (
                      <Check size={18} className="text-brand-700 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ═══ دکمه‌ها ═══ */}
        <div className="border-t border-gray-100 p-3 space-y-2 sm:rounded-b-2xl">
          {current?.subject_id && (
            <button
              onClick={handleClear}
              disabled={saving}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-danger hover:bg-red-50 py-2 rounded-lg transition"
            >
              <Trash2 size={13} />
              <span>پاک کردن این خانه</span>
            </button>
          )}
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving || !selectedId}
              className="flex-1"
            >
              {saving ? 'در حال ذخیره...' : 'ذخیره'}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={saving}>
              انصراف
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}