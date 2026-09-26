import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

export default function SubjectForm({
  open,
  subject,
  defaultGrade,
  onClose,
  onSubmit,
  loading,
}) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [grade, setGrade] = useState(1)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (subject) {
      setName(subject.name || '')
      setCode(subject.code || '')
      setGrade(subject.grade || 1)
    } else {
      setName('')
      setCode('')
      setGrade(defaultGrade || 1)
    }
    setErrors({})
  }, [subject, open, defaultGrade])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!name.trim()) errs.name = 'نام مضمون الزامی است'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    onSubmit({
      name: name.trim(),
      code: code.trim() || null,
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
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-modal animate-slide-up max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
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
            <p className="input-hint">
              مضمون برای کدام صنف ثبت می‌شود؟
            </p>
          </div>

          <Input
            label="نام مضمون *"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors((er) => ({ ...er, name: '' }))
            }}
            autoFocus
            required
            placeholder="مثلاً: ریاضی"
            error={errors.name}
          />

          <Input
            label="کد مضمون (اختیاری)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            dir="ltr"
            className="text-left"
            placeholder="MATH"
            hint="برای شناسایی سریع‌تر"
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