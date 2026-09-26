import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import FileUploader from '../../../components/ui/FileUploader'

const CATEGORIES = [
  { value: 'book', label: 'کتاب' },
  { value: 'jozve', label: 'جزوه' },
  { value: 'form', label: 'فرم' },
  { value: 'guide', label: 'راهنما' },
  { value: 'other', label: 'سایر' },
]

const FILE_TYPES = [
  { value: 'pdf', label: 'PDF' },
  { value: 'doc', label: 'Word' },
  { value: 'image', label: 'تصویر' },
  { value: 'other', label: 'سایر' },
]

export default function DocumentForm({
  open,
  doc,
  onClose,
  onSubmit,
  loading,
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [fileType, setFileType] = useState('pdf')
  const [category, setCategory] = useState('book')
  const [grade, setGrade] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (doc) {
      setTitle(doc.title || '')
      setDescription(doc.description || '')
      setFileUrl(doc.file_url || '')
      setFileType(doc.file_type || 'pdf')
      setCategory(doc.category || 'book')
      setGrade(doc.grade || '')
    } else {
      setTitle('')
      setDescription('')
      setFileUrl('')
      setFileType('pdf')
      setCategory('book')
      setGrade('')
    }
    setErrors({})
  }, [doc, open])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!title.trim()) errs.title = 'عنوان الزامی است'
    if (!fileUrl.trim()) errs.fileUrl = 'آپلود فایل الزامی است'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      file_url: fileUrl.trim(),
      file_type: fileType,
      category,
      grade: grade ? Number(grade) : null,
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
            {doc ? 'ویرایش سند' : 'افزودن سند جدید'}
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
            placeholder="مثلاً: کتاب ریاضی صنف ۷"
            error={errors.title}
          />

          <div>
            <FileUploader
              value={fileUrl}
              onChange={(url) => {
                setFileUrl(url)
                if (errors.fileUrl)
                  setErrors((er) => ({ ...er, fileUrl: '' }))
              }}
              folder="documents"
              label="فایل سند *"
              maxSizeMB={10}
            />
            {errors.fileUrl && (
              <p className="input-error-text mt-1">{errors.fileUrl}</p>
            )}
          </div>

          <div>
            <label className="input-label">نوع فایل</label>
            <div className="grid grid-cols-4 gap-2">
              {FILE_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setFileType(t.value)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition border ${
                    fileType === t.value
                      ? 'bg-brand-700 text-white border-brand-700'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="input-label">دسته‌بندی</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition border ${
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

          <div>
            <label className="input-label">صنف (اختیاری)</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="input"
            >
              <option value="">همه صنوف</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                <option key={g} value={g}>
                  صنف {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">توضیحات (اختیاری)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[70px] resize-y"
              placeholder="توضیح کوتاه درباره سند..."
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