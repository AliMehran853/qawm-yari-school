import { useState, useEffect } from 'react'
import { X, Upload, Link as LinkIcon } from 'lucide-react'
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

  // ─── حالت انتخاب: آپلود یا لینک ───
  const [sourceMode, setSourceMode] = useState('upload') // 'upload' | 'link'

  useEffect(() => {
    if (doc) {
      setTitle(doc.title || '')
      setDescription(doc.description || '')
      setFileUrl(doc.file_url || '')
      setFileType(doc.file_type || 'pdf')
      setCategory(doc.category || 'book')
      setGrade(doc.grade || '')
      // اگر URL وارد شده و از Supabase نیست → حالت link
      if (doc.file_url && !doc.file_url.includes('supabase.co')) {
        setSourceMode('link')
      } else {
        setSourceMode('upload')
      }
    } else {
      setTitle('')
      setDescription('')
      setFileUrl('')
      setFileType('pdf')
      setCategory('book')
      setGrade('')
      setSourceMode('upload')
    }
    setErrors({})
  }, [doc, open])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!title.trim()) errs.title = 'عنوان الزامی است'
    if (!fileUrl.trim()) {
      errs.fileUrl =
        sourceMode === 'upload'
          ? 'آپلود فایل الزامی است'
          : 'لینک فایل الزامی است'
    }

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

  // ─── تشخیص خودکار نوع فایل از URL ───
  function detectFileType(url) {
    const lower = url.toLowerCase()
    if (lower.includes('.pdf') || lower.includes('pdf')) return 'pdf'
    if (
      lower.includes('.doc') ||
      lower.includes('.docx') ||
      lower.includes('word')
    )
      return 'doc'
    if (
      lower.match(/\.(jpg|jpeg|png|gif|webp)/) ||
      lower.includes('image')
    )
      return 'image'
    return 'pdf'
  }

  function handleLinkChange(value) {
    setFileUrl(value)
    if (errors.fileUrl) setErrors((er) => ({ ...er, fileUrl: '' }))
    // تشخیص خودکار نوع فایل از URL
    if (value && value.startsWith('http')) {
      const detected = detectFileType(value)
      setFileType(detected)
    }
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
        {/* ═══ هدر ═══ */}
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
          {/* ═══ عنوان ═══ */}
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

          {/* ═══ انتخاب منبع ═══ */}
          <div>
            <label className="input-label">منبع فایل</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSourceMode('upload')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition ${
                  sourceMode === 'upload'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Upload size={16} />
                <span>آپلود فایل</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('link')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition ${
                  sourceMode === 'link'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <LinkIcon size={16} />
                <span>لینک خارجی</span>
              </button>
            </div>
          </div>

          {/* ═══ محتوای بر اساس حالت ═══ */}
          {sourceMode === 'upload' ? (
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
              <p className="input-hint">
                فایل روی سرور مکتب ذخیره می‌شود — ظرفیت محدود
              </p>
            </div>
          ) : (
            <div>
              <label className="input-label">لینک فایل *</label>
              <div className="relative">
                <LinkIcon
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => handleLinkChange(e.target.value)}
                  dir="ltr"
                  className={`input pr-10 text-left ${
                    errors.fileUrl ? 'input-error' : ''
                  }`}
                  placeholder="https://example.com/book.pdf"
                />
              </div>
              {errors.fileUrl && (
                <p className="input-error-text mt-1">{errors.fileUrl}</p>
              )}
              <p className="input-hint">
                فایل روی سرور دیگری میزبانی می‌شود — سرور مکتب سبک می‌ماند
              </p>

              {/* پیش‌نمایش لینک */}
              {fileUrl && fileUrl.startsWith('http') && (
                <div className="mt-2 p-2.5 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
                  <LinkIcon
                    size={13}
                    className="text-blue-600 shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-blue-900 font-medium">
                      لینک وارد شده
                    </p>
                    <p
                      className="text-[10px] text-blue-700 break-all mt-0.5"
                      dir="ltr"
                    >
                      {fileUrl}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ نوع فایل ═══ */}
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

          {/* ═══ دسته‌بندی ═══ */}
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

          {/* ═══ صنف ═══ */}
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

          {/* ═══ توضیحات ═══ */}
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

          {/* ═══ دکمه‌ها ═══ */}
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