import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

export default function TeacherForm({ open, teacher, onClose, onSubmit, loading }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [hireDate, setHireDate] = useState('')
  const [address, setAddress] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (teacher) {
      setName(teacher.name || '')
      setPhone(teacher.phone || '')
      setWhatsapp(teacher.whatsapp || '')
      setHireDate(teacher.hire_date || '')
      setAddress(teacher.address || '')
      setPhotoUrl(teacher.photo_url || '')
      setNotes(teacher.notes || '')
    } else {
      setName('')
      setPhone('')
      setWhatsapp('')
      setHireDate('')
      setAddress('')
      setPhotoUrl('')
      setNotes('')
    }
    setNameError('')
  }, [teacher, open])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('نام معلم الزامی است')
      return
    }
    onSubmit({
      name: name.trim(),
      phone: phone.trim() || null,
      whatsapp: whatsapp.trim() || null,
      hire_date: hireDate.trim() || null,
      address: address.trim() || null,
      photo_url: photoUrl.trim() || null,
      notes: notes.trim() || null,
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl shadow-modal animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 sticky top-0 bg-white z-10 sm:rounded-t-2xl">
          <h2 className="font-bold text-base sm:text-lg">
            {teacher ? 'ویرایش معلم' : 'افزودن معلم جدید'}
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
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (nameError) setNameError('')
            }}
            required
            autoFocus
            placeholder="مثلاً: محمد احمدی"
            error={nameError}
          />

          <Input
            label="شماره تماس"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            dir="ltr"
            className="text-left"
            placeholder="0700123456"
          />

          <Input
            label="شماره واتساپ (اختیاری)"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            dir="ltr"
            className="text-left"
            placeholder="0700123456"
            hint="اگر خالی باشد، از شماره تماس استفاده می‌شود"
          />

          <Input
            label="تاریخ استخدام"
            value={hireDate}
            onChange={(e) => setHireDate(e.target.value)}
            placeholder="مثلاً: 1400/03/15"
            hint="به صورت شمسی وارد کن"
          />

          <Input
            label="آدرس (اختیاری)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="ولسوالی ورس، قریه ..."
          />

          <Input
            label="لینک عکس (اختیاری)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            dir="ltr"
            className="text-left"
            placeholder="https://..."
          />

          <div>
            <label className="input-label">یادداشت (اختیاری)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input min-h-[80px] resize-y"
              placeholder="هر توضیح اضافی..."
              rows={3}
            />
          </div>

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