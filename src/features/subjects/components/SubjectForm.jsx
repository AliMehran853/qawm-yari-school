import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

export default function SubjectForm({ open, subject, onClose, onSubmit, loading }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [grade, setGrade] = useState(1)
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (subject) {
      setName(subject.name || '')
      setCode(subject.code || '')
      setGrade(subject.grade || 1)
    } else {
      setName('')
      setCode('')
      setGrade(1)
    }
    setNameError('')
  }, [subject, open])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('نام مضمون الزامی است')
      return
    }
    onSubmit({
      name: name.trim(),
      code: code.trim(),
      grade: Number(grade),
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
        {/* هدر */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 sticky top-0 bg-white z-10 sm:rounded-t-2xl">
          <h2 className="font-bold text-base sm:text-lg">
            {subject ? 'ویرایش مضمون' : 'افزودن مضمون جدید'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <Input
            label="نام مضمون"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (nameError) setNameError('')
            }}
            required
            autoFocus
            placeholder="مثلاً: ریاضی"
            error={nameError}
          />

          <Input
            label="کد مضمون (اختیاری)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            dir="ltr"
            placeholder="MATH"
            className="text-left"
            hint="برای شناسایی سریع‌تر مضمون"
          />

          <div>
            <label className="input-label">صنف</label>
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

          {/* دکمه‌ها */}
          <div className="flex gap-2 sm:gap-3 pt-2 pb-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
              size="lg"
            >
              {loading ? 'در حال ذخیره...' : 'ذخیره'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              size="lg"
            >
              انصراف
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}