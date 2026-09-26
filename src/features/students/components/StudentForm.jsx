import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import ImageUploader from '../../../components/ui/ImageUploader'

const STATUS_OPTIONS = [
  { value: 'active', label: 'فعال' },
  { value: 'graduated', label: 'فارغ' },
  { value: 'left', label: 'ترک تحصیل' },
  { value: 'transferred', label: 'انتقالی' },
]

export default function StudentForm({
  open,
  student,
  onClose,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState({
    name: '',
    father_name: '',
    grandfather_name: '',
    dob: '',
    grade: 1,
    admission_year: 1404,
    phone: '',
    whatsapp: '',
    address: '',
    photo_url: '',
    status: 'active',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || '',
        father_name: student.father_name || '',
        grandfather_name: student.grandfather_name || '',
        dob: student.dob || '',
        grade: student.grade || 1,
        admission_year: student.admission_year || 1404,
        phone: student.phone || '',
        whatsapp: student.whatsapp || '',
        address: student.address || '',
        photo_url: student.photo_url || '',
        status: student.status || 'active',
        notes: student.notes || '',
      })
    } else {
      setForm({
        name: '',
        father_name: '',
        grandfather_name: '',
        dob: '',
        grade: 1,
        admission_year: 1404,
        phone: '',
        whatsapp: '',
        address: '',
        photo_url: '',
        status: 'active',
        notes: '',
      })
    }
    setErrors({})
  }, [student, open])

  if (!open) return null

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'نام الزامی است'
    if (!form.grade) errs.grade = 'صنف الزامی است'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    onSubmit({
      name: form.name.trim(),
      father_name: form.father_name.trim() || null,
      grandfather_name: form.grandfather_name.trim() || null,
      dob: form.dob.trim() || null,
      grade: Number(form.grade),
      admission_year: Number(form.admission_year) || null,
      phone: form.phone.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      address: form.address.trim() || null,
      photo_url: form.photo_url.trim() || null,
      status: form.status,
      notes: form.notes.trim() || null,
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl shadow-modal animate-slide-up max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 sticky top-0 bg-white z-10 sm:rounded-t-2xl">
          <h2 className="font-bold text-base sm:text-lg">
            {student ? 'ویرایش دانش‌آموز' : 'ثبت دانش‌آموز جدید'}
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
          <Input
            label="نام و تخلص *"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            autoFocus
            required
            placeholder="مثلاً: علی احمدی"
            error={errors.name}
          />

          <Input
            label="نام پدر"
            value={form.father_name}
            onChange={(e) => set('father_name', e.target.value)}
            placeholder="مثلاً: محمد"
          />

          <Input
            label="نام پدرکلان"
            value={form.grandfather_name}
            onChange={(e) => set('grandfather_name', e.target.value)}
            placeholder="مثلاً: عبدالله"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">صنف *</label>
              <select
                value={form.grade}
                onChange={(e) => set('grade', e.target.value)}
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
              label="سال شمولیت"
              type="number"
              value={form.admission_year}
              onChange={(e) => set('admission_year', e.target.value)}
              dir="ltr"
              className="text-left"
              placeholder="1404"
            />
          </div>

          <Input
            label="تاریخ تولد"
            value={form.dob}
            onChange={(e) => set('dob', e.target.value)}
            placeholder="مثلاً: 1390/05/12"
            hint="شمسی (اختیاری)"
          />

          <Input
            label="شماره تماس والد"
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            dir="ltr"
            className="text-left"
            placeholder="0700123456"
          />

          <Input
            label="شماره واتساپ (اختیاری)"
            type="tel"
            value={form.whatsapp}
            onChange={(e) => set('whatsapp', e.target.value)}
            dir="ltr"
            className="text-left"
            placeholder="0700123456"
            hint="اگر خالی باشد، از شماره تماس استفاده می‌شود"
          />

          <Input
            label="آدرس (اختیاری)"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="ولسوالی ورس، قریه ..."
          />

          <ImageUploader
            value={form.photo_url}
            onChange={(url) => set('photo_url', url)}
            folder="students"
            label="عکس دانش‌آموز (اختیاری)"
            aspect="square"
            maxSizeKB={300}
            maxInputMB={5}
          />

          <div>
            <label className="input-label">وضعیت</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="input"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">یادداشت (اختیاری)</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              className="input min-h-[70px] resize-y"
              placeholder="هر توضیح اضافی..."
              rows={2}
            />
          </div>

          <div className="flex gap-2 sm:gap-3 pt-2 pb-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
              size="lg"
            >
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