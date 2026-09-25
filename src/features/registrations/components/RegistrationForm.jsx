import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

export default function RegistrationForm({ open, registration, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '',
    father_name: '',
    grandfather_name: '',
    dob: '',
    birth_certificate_no: '',
    previous_school: '',
    address: '',
    phone: '',
    whatsapp: '',
    photo_url: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (registration) {
      setForm({
        name: registration.name || '',
        father_name: registration.father_name || '',
        grandfather_name: registration.grandfather_name || '',
        dob: registration.dob || '',
        birth_certificate_no: registration.birth_certificate_no || '',
        previous_school: registration.previous_school || '',
        address: registration.address || '',
        phone: registration.phone || '',
        whatsapp: registration.whatsapp || '',
        photo_url: registration.photo_url || '',
        notes: registration.notes || '',
      })
    } else {
      setForm({
        name: '',
        father_name: '',
        grandfather_name: '',
        dob: '',
        birth_certificate_no: '',
        previous_school: '',
        address: '',
        phone: '',
        whatsapp: '',
        photo_url: '',
        notes: '',
      })
    }
    setErrors({})
  }, [registration, open])

  if (!open) return null

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'نام الزامی است'
    if (!form.father_name.trim()) errs.father_name = 'نام پدر الزامی است'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    onSubmit({
      name: form.name.trim(),
      father_name: form.father_name.trim(),
      grandfather_name: form.grandfather_name.trim() || null,
      dob: form.dob.trim() || null,
      birth_certificate_no: form.birth_certificate_no.trim() || null,
      previous_school: form.previous_school.trim() || null,
      address: form.address.trim() || null,
      phone: form.phone.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      photo_url: form.photo_url.trim() || null,
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
            {registration ? 'ویرایش ثبت‌نام' : 'ثبت‌نام صنف اول'}
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
            label="نام پدر *"
            value={form.father_name}
            onChange={(e) => set('father_name', e.target.value)}
            required
            placeholder="مثلاً: محمد"
            error={errors.father_name}
          />

          <Input
            label="نام پدرکلان"
            value={form.grandfather_name}
            onChange={(e) => set('grandfather_name', e.target.value)}
            placeholder="مثلاً: عبدالله"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="تاریخ تولد"
              value={form.dob}
              onChange={(e) => set('dob', e.target.value)}
              placeholder="1398/05/12"
              hint="شمسی"
            />
            <Input
              label="شماره تذکره"
              value={form.birth_certificate_no}
              onChange={(e) => set('birth_certificate_no', e.target.value)}
              dir="ltr"
              className="text-left"
              placeholder="مثلاً: 1234"
            />
          </div>

          <Input
            label="مکتب قبلی (اختیاری)"
            value={form.previous_school}
            onChange={(e) => set('previous_school', e.target.value)}
            placeholder="اگر از مکتب دیگری منتقل می‌شود"
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

          <Input
            label="لینک عکس (اختیاری)"
            value={form.photo_url}
            onChange={(e) => set('photo_url', e.target.value)}
            dir="ltr"
            className="text-left"
            placeholder="https://..."
          />

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
            <Button type="submit" disabled={loading} className="flex-1" size="lg">
              {loading ? 'در حال ذخیره...' : 'ثبت‌نام'}
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