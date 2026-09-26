import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import ImageUploader from '../../../components/ui/ImageUploader'

const CATEGORIES = [
  { value: 'school', label: 'مکتب' },
  { value: 'events', label: 'مراسم و رویدادها' },
  { value: 'classes', label: 'صنوف' },
  { value: 'achievements', label: 'افتخارات' },
  { value: 'other', label: 'سایر' },
]

export default function GalleryForm({
  open,
  item,
  totalCount = 0,
  onClose,
  onSubmit,
  loading,
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('school')
  const [eventDate, setEventDate] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (item) {
      setTitle(item.title || '')
      setDescription(item.description || '')
      setImageUrl(item.image_url || '')
      setCategory(item.category || 'school')
      setEventDate(item.event_date || '')
    } else {
      setTitle('')
      setDescription('')
      setImageUrl('')
      setCategory('school')
      setEventDate('')
    }
    setErrors({})
  }, [item, open])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!imageUrl.trim()) errs.imageUrl = 'آپلود عکس الزامی است'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    onSubmit({
      title: title.trim() || null,
      description: description.trim() || null,
      image_url: imageUrl.trim(),
      category,
      event_date: eventDate.trim() || null,
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
            {item ? 'ویرایش عکس' : 'افزودن عکس جدید'}
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
            <ImageUploader
              value={imageUrl}
              onChange={(url) => {
                setImageUrl(url)
                if (errors.imageUrl)
                  setErrors((er) => ({ ...er, imageUrl: '' }))
              }}
              folder="gallery"
              label="عکس *"
              aspect="square"
              maxSizeKB={500}
              maxInputMB={10}
              currentTotal={totalCount}
              maxTotal={200}
            />
            {errors.imageUrl && (
              <p className="input-error-text mt-1">{errors.imageUrl}</p>
            )}
          </div>

          <div>
            <label className="input-label">دسته‌بندی</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition border ${
                    category === c.value
                      ? 'bg-brand-700 text-white border-brand-700'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="عنوان (اختیاری)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلاً: مراسم افتتاح سال تعلیمی"
          />

          <div>
            <label className="input-label">توضیحات (اختیاری)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[70px] resize-y"
              placeholder="توضیح کوتاه درباره عکس..."
              rows={2}
            />
          </div>

          <Input
            label="تاریخ رویداد (اختیاری)"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            placeholder="مثلاً: 1404/06/15"
            hint="شمسی"
          />

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