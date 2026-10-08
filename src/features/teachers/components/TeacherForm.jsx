import { useState, useEffect, useRef } from 'react'
import { X, Info, Crown, Star, User, Users, Briefcase } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import ImageUploader from '../../../components/ui/ImageUploader'
import { useTeachers } from '../useTeachers'

const POSITIONS = [
  {
    value: 'principal',
    label: 'آمر',
    icon: Crown,
    unique: true,
  },
  {
    value: 'head_teacher',
    label: 'سرمعلم',
    icon: Star,
    unique: true,
  },
  {
    value: 'teacher',
    label: 'معلم',
    icon: Users,
    unique: false,
  },
  {
    value: 'staff',
    label: 'ملازم / خدمه',
    icon: Briefcase,
    unique: false,
  },
]

export default function TeacherForm({
  open,
  teacher,
  onClose,
  onSubmit,
  loading,
}) {
  const { data: allTeachers } = useTeachers()

  const [name, setName] = useState('')
  const [position, setPosition] = useState('teacher')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [hireDate, setHireDate] = useState('')
  const [address, setAddress] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [nameError, setNameError] = useState('')
  const [autoFillNotice, setAutoFillNotice] = useState('')

  const lastMatchedNameRef = useRef('')

  useEffect(() => {
    if (teacher) {
      setName(teacher.name || '')
      setPosition(teacher.position || 'teacher')
      setPhone(teacher.phone || '')
      setWhatsapp(teacher.whatsapp || '')
      setHireDate(teacher.hire_date || '')
      setAddress(teacher.address || '')
      setPhotoUrl(teacher.photo_url || '')
      setNotes(teacher.notes || '')
    } else {
      setName('')
      setPosition('teacher')
      setPhone('')
      setWhatsapp('')
      setHireDate('')
      setAddress('')
      setPhotoUrl('')
      setNotes('')
    }
    setNameError('')
    setAutoFillNotice('')
    lastMatchedNameRef.current = ''
  }, [teacher, open])

  useEffect(() => {
    if (teacher) return
    if (!allTeachers || !name) return

    const trimmed = name.trim().toLowerCase()
    if (trimmed.length < 3) return
    if (lastMatchedNameRef.current === trimmed) return

    const timeout = setTimeout(() => {
      const match = allTeachers.find(
        (t) => t.name?.toLowerCase().trim() === trimmed
      )

      if (match && match.position && match.position !== position) {
        setPosition(match.position)
        lastMatchedNameRef.current = trimmed
        const label = POSITIONS.find((p) => p.value === match.position)?.label
        setAutoFillNotice(
          `«${match.name}» قبلاً ثبت شده — سمت «${label}» انتخاب شد`
        )
      } else {
        lastMatchedNameRef.current = trimmed
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [name, allTeachers, teacher, position])

  function handlePositionChange(newPosition) {
    setPosition(newPosition)

    const posInfo = POSITIONS.find((p) => p.value === newPosition)

    if (posInfo?.unique && !teacher && allTeachers) {
      const existing = allTeachers.find((t) => t.position === newPosition)

      if (existing) {
        const confirmed = confirm(
          `«${existing.name}» قبلاً به عنوان ${posInfo.label} ثبت شده است.\n\nاطلاعات ایشان بارگذاری شود؟`
        )

        if (confirmed) {
          setName(existing.name || '')
          setPhone(existing.phone || '')
          setWhatsapp(existing.whatsapp || '')
          setHireDate(existing.hire_date || '')
          setAddress(existing.address || '')
          setPhotoUrl(existing.photo_url || '')
          setNotes(existing.notes || '')
          setAutoFillNotice(
            `اطلاعات «${existing.name}» بارگذاری شد — لطفاً بررسی کنید`
          )
        }
      }
    }
  }

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('نام الزامی است')
      return
    }
    onSubmit({
      name: name.trim(),
      position,
      phone: phone.trim() || null,
      whatsapp: whatsapp.trim() || null,
      hire_date: hireDate.trim() || null,
      address: address.trim() || null,
      photo_url: photoUrl.trim() || null,
      notes: notes.trim() || null,
    })
  }

  const currentPos = POSITIONS.find((p) => p.value === position)

  const uniqueWarning = (() => {
    if (!currentPos?.unique || teacher) return null
    if (!allTeachers) return null
    const existing = allTeachers.find((t) => t.position === position)
    return existing ? existing.name : null
  })()

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
          <div>
            <label className="input-label">سمت *</label>

            <div className="grid grid-cols-2 gap-2">
              {POSITIONS.map((p) => {
                const Icon = p.icon
                const isActive = position === p.value
                const isUnique = p.unique

                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handlePositionChange(p.value)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all text-right ${
                      isActive
                        ? p.value === 'principal'
                          ? 'border-gold-500 bg-gold-50'
                          : 'border-brand-500 bg-brand-50'
                        : 'border-gray-200 bg-white hover:border-brand-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? p.value === 'principal'
                            ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-white'
                            : 'bg-gradient-to-br from-brand-500 to-brand-700 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0 flex-1 text-right">
                      <p
                        className={`text-xs font-medium truncate ${
                          isActive ? 'text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {p.label}
                      </p>
                      {isUnique && (
                        <p className="text-[9px] text-gray-400 mt-0.5">
                          یک نفر
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {uniqueWarning && (
              <div className="mt-2 flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  این سمت قبلاً توسط «{uniqueWarning}» پر شده است.
                </p>
              </div>
            )}
          </div>

          <Input
            label="نام و تخلص *"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (nameError) setNameError('')
              if (autoFillNotice) setAutoFillNotice('')
            }}
            required
            autoFocus
            placeholder="مثلاً: محمد احمدی"
            error={nameError}
          />

          {autoFillNotice && (
            <div className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg -mt-2">
              <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-800 leading-relaxed">
                {autoFillNotice}
              </p>
            </div>
          )}

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
            hint="شمسی"
          />

          <Input
            label="آدرس (اختیاری)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="ولسوالی ورس، قریه ..."
          />

          <ImageUploader
            value={photoUrl}
            onChange={(url) => setPhotoUrl(url)}
            folder="teachers"
            label="عکس (اختیاری)"
            aspect="square"
            maxSizeKB={300}
            maxInputMB={5}
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