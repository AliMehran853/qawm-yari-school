import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

const PRIORITIES = [
  { value: 'normal', label: 'عادی' },
  { value: 'important', label: 'مهم' },
  { value: 'urgent', label: 'فوری' },
]

const AUDIENCES = [
  { value: 'all', label: 'همه' },
  { value: 'teachers', label: 'معلمان' },
  { value: 'students', label: 'دانش‌آموزان' },
  { value: 'parents', label: 'والدین' },
]

export default function AnnouncementForm({
  open,
  announcement,
  onClose,
  onSubmit,
  loading,
}) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [priority, setPriority] = useState('normal')
  const [audience, setAudience] = useState('all')
  const [pinned, setPinned] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title || '')
      setBody(announcement.body || '')
      setPriority(announcement.priority || 'normal')
      setAudience(announcement.audience || 'all')
      setPinned(announcement.pinned || false)
    } else {
      setTitle('')
      setBody('')
      setPriority('normal')
      setAudience('all')
      setPinned(false)
    }
    setErrors({})
  }, [announcement, open])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!title.trim()) errs.title = 'عنوان الزامی است'
    if (!body.trim()) errs.body = 'متن اعلان الزامی است'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    onSubmit({
      title: title.trim(),
      body: body.trim(),
      priority,
      audience,
      pinned,
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
            {announcement ? 'ویرایش اعلان' : 'اعلان جدید'}
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
            label="عنوان *"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (errors.title) setErrors((er) => ({ ...er, title: '' }))
            }}
            autoFocus
            placeholder="مثلاً: تعطیلی روز پنجشنبه"
            error={errors.title}
          />

          <div>
            <label className="input-label">متن اعلان *</label>
            <textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value)
                if (errors.body) setErrors((er) => ({ ...er, body: '' }))
              }}
              placeholder="متن کامل اعلان را اینجا بنویس..."
              className={`input min-h-[120px] resize-y ${
                errors.body ? 'input-error' : ''
              }`}
              rows={5}
            />
            {errors.body && <p className="input-error-text">{errors.body}</p>}
          </div>

          {/* اولویت */}
          <div>
            <label className="input-label">اولویت</label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((p) => {
                const active = priority === p.value
                const colors = {
                  normal: active
                    ? 'bg-gray-700 text-white border-gray-700'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
                  important: active
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50',
                  urgent: active
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-red-700 border-red-200 hover:bg-red-50',
                }
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`py-2 px-2 rounded-lg border text-xs font-medium transition ${colors[p.value]}`}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* مخاطب */}
          <div>
            <label className="input-label">مخاطب</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="input"
            >
              {AUDIENCES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {/* سنجاق */}
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="w-4 h-4 accent-brand-700"
            />
            <span className="text-sm text-gray-700">
              سنجاق در بالای لیست
            </span>
          </label>

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