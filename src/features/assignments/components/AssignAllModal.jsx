import { useState, useMemo, useEffect } from 'react'
import {
  X,
  Search,
  Check,
  UserCheck,
  Users,
  AlertCircle,
  Trash2,
} from 'lucide-react'
import Button from '../../../components/ui/Button'
import { toFaNum } from '../../../utils/number'

export default function AssignAllModal({
  open,
  grade,
  subjectsCount,
  currentTeacherIds,
  teachers,
  onAssign,
  onClearAll,
  onClose,
  loading,
}) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    // وقتی باز می‌شود، معلم فعلی (اگر همه یکسان) را انتخاب کن
    if (open && currentTeacherIds && currentTeacherIds.length === 1) {
      setSelectedId(currentTeacherIds[0])
    } else if (open) {
      setSelectedId(null)
    }
    setSearch('')
  }, [open, currentTeacherIds])

  const filtered = useMemo(() => {
    if (!teachers) return []
    const q = search.trim().toLowerCase()
    if (!q) return teachers
    return teachers.filter((t) => t.name?.toLowerCase().includes(q))
  }, [teachers, search])

  const hasCurrentAssignment = currentTeacherIds?.length > 0

  if (!open) return null

  function handleSubmit() {
    if (!selectedId) return
    onAssign({
      teacher_id: selectedId,
      grade,
    })
  }

  function handleClear() {
    if (
      !confirm(
        `تمام تعیین‌های معلم برای صنف ${grade} پاک شود؟\nهمه مضامین بدون معلم می‌شوند.`
      )
    )
      return
    onClearAll({ grade })
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
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shrink-0 shadow-md">
              <UserCheck size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-base text-gray-900">
                تعیین یک معلم برای همه
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                صنف {toFaNum(grade)} — {toFaNum(subjectsCount)} مضمون
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition shrink-0"
            aria-label="بستن"
          >
            <X size={18} />
          </button>
        </div>

        {/* ═══ پیام اطلاعاتی ═══ */}
        <div className="p-3 bg-brand-50/50 border-b border-brand-100">
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="text-brand-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-brand-800 leading-relaxed">
              این معلم برای <strong>همه {toFaNum(subjectsCount)} مضمون</strong>{' '}
              این صنف تعیین می‌شود. تعیین‌های قبلی این صنف پاک می‌شوند.
            </p>
          </div>
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
              placeholder="جستجوی معلم..."
              className="input pr-9 py-2 text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* ═══ لیست معلمان ═══ */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6 text-center">
              <Users size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">
                {search ? 'نتیجه‌ای پیدا نشد' : 'معلمی ثبت نشده'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((t) => {
                const isActive = selectedId === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`w-full flex items-center gap-3 p-3 text-right transition ${
                      isActive ? 'bg-brand-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 ${
                        isActive ? 'border-brand-500' : 'border-gray-200'
                      }`}
                    >
                      {t.photo_url ? (
                        <img
                          src={t.photo_url}
                          alt={t.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {t.name?.charAt(0) || '؟'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {t.name}
                      </p>
                      {t.position && t.position !== 'teacher' && (
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {t.position === 'principal'
                            ? 'آمر'
                            : t.position === 'head_teacher'
                            ? 'سرمعلم'
                            : t.position === 'staff'
                            ? 'ملازم / خدمه'
                            : ''}
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
          {hasCurrentAssignment && (
            <button
              onClick={handleClear}
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-danger hover:bg-red-50 py-2 rounded-lg transition"
            >
              <Trash2 size={13} />
              <span>پاک کردن همه تعیین‌ها</span>
            </button>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedId}
              className="flex-1"
              size="lg"
            >
              <UserCheck size={16} />
              <span>
                {loading
                  ? 'در حال ذخیره...'
                  : `تعیین برای همه ${toFaNum(subjectsCount)} مضمون`}
              </span>
            </Button>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              انصراف
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}