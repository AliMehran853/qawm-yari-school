import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

export default function ClassForm({ open, classItem, onClose, onSubmit, loading }) {
  const [grade, setGrade] = useState(1)
  const [capacity, setCapacity] = useState(20)
  const [year, setYear] = useState(1404)

  useEffect(() => {
    if (classItem) {
      setGrade(classItem.grade || 1)
      setCapacity(classItem.capacity || 20)
      setYear(classItem.year || 1404)
    } else {
      setGrade(1)
      setCapacity(20)
      setYear(1404)
    }
  }, [classItem, open])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      grade: Number(grade),
      capacity: Number(capacity),
      year: Number(year),
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-modal animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 sticky top-0 bg-white z-10 sm:rounded-t-2xl">
          <h2 className="font-bold text-base sm:text-lg">
            {classItem ? 'ویرایش صنف' : 'افزودن صنف جدید'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="input-label">شماره صنف</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="input"
              required
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                <option key={g} value={g}>
                  صنف {g}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="سال تعلیمی"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            dir="ltr"
            className="text-left"
            hint="مثلاً ۱۴۰۴"
          />

          <Input
            label="ظرفیت"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            dir="ltr"
            className="text-left"
            hint="حداکثر تعداد دانش‌آموزان این صنف"
          />

          <div className="flex gap-2 sm:gap-3 pt-2 pb-2">
            <Button type="submit" disabled={loading} className="flex-1" size="lg">
              {loading ? 'در حال ذخیره...' : 'ذخیره'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} size="lg">
              انصراف
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}