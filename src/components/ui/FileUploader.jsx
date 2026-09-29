import { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

import { compressImage, validateImageFile } from '../../lib/imageCompressor'
import { uploadFile, deleteFile } from '../../lib/storage'

export default function ImageUploader({
  value,
  onChange,
  folder = 'general',
  label = 'عکس',
  hint,
  maxSizeKB = 500,
  maxInputMB = 10,
  currentTotal = 0,
  maxTotal = 200,
  aspect = 'square',
  disabled = false,
}) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ step: '', percent: 0 })
  const [localPreview, setLocalPreview] = useState(null)
  const inputRef = useRef(null)

  const atLimit = currentTotal >= maxTotal

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // ─── اعتبارسنجی ───
    const validation = validateImageFile(file, { maxInputMB })
    if (!validation.valid) {
      toast.error(validation.error)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    if (atLimit && !value) {
      toast.error(
        `ظرفیت عکس‌ها پر شده (${maxTotal} عکس). اول یکی از عکس‌های قبلی را حذف کن.`
      )
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setUploading(true)
    setProgress({ step: 'شروع...', percent: 0 })

    try {
      // ─── پیش‌نمایش محلی فوری ───
      const previewUrl = URL.createObjectURL(file)
      setLocalPreview(previewUrl)

      // ─── فشرده‌سازی با progress ───
      const compressed = await compressImage(file, {
        maxSizeKB,
        maxWidth: folder === 'gallery' ? 1600 : 1000,
        maxHeight: folder === 'gallery' ? 1600 : 1000,
        onProgress: ({ step, percent }) => {
          const labels = {
            reading: 'خواندن فایل...',
            loading: 'بارگذاری عکس...',
            processing: 'پردازش...',
            compressing: 'فشرده‌سازی...',
            done: 'آماده آپلود',
          }
          setProgress({
            step: labels[step] || 'در حال پردازش...',
            percent: Math.round(percent * 0.4), // ۰ تا ۴۰٪
          })
        },
      })

      const finalKB = (compressed.size / 1024).toFixed(0)
      setProgress({
        step: `آپلود (${finalKB} کیلوبایت)...`,
        percent: 50,
      })

      // ─── حذف عکس قبلی ───
      if (value) {
        try {
          await deleteFile(value)
        } catch (err) {
          console.warn('خطا در حذف عکس قبلی:', err)
        }
      }

      // ─── آپلود ───
      setProgress({ step: 'آپلود به سرور...', percent: 70 })
      const { url } = await uploadFile(compressed, folder)

      setProgress({ step: 'تمام شد', percent: 100 })
      onChange(url)
      toast.success('عکس با موفقیت آپلود شد')

      // پاک‌سازی
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setLocalPreview(null)
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'خطا در آپلود عکس', {
        duration: 6000,
      })
      setLocalPreview(null)
    } finally {
      setUploading(false)
      setProgress({ step: '', percent: 0 })
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemove() {
    if (!value) return
    if (!confirm('این عکس حذف شود؟')) return

    setUploading(true)
    try {
      await deleteFile(value)
      onChange('')
      toast.success('عکس حذف شد')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'خطا در حذف')
    } finally {
      setUploading(false)
    }
  }

  const previewSrc = localPreview || value
  const aspectClass =
    aspect === 'square'
      ? 'aspect-square'
      : aspect === 'video'
      ? 'aspect-video'
      : ''

  return (
    <div className="w-full">
      {label && <label className="input-label">{label}</label>}

      {previewSrc ? (
        <div className="relative group">
          <div
            className={`w-full ${aspectClass} rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50`}
          >
            <img
              src={previewSrc}
              alt="پیش‌نمایش"
              className="w-full h-full object-cover"
            />
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center text-white p-4">
              <Loader2 size={28} className="animate-spin mb-3" />
              <p className="text-xs font-medium mb-2 text-center">
                {progress.step || 'در حال پردازش...'}
              </p>
              <div className="w-3/4 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300 rounded-full"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <p className="text-[10px] text-white/70 mt-1.5 fa-num">
                {progress.percent}%
              </p>
            </div>
          )}

          {!uploading && (
            <div className="absolute top-2 left-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-9 h-9 bg-white/95 backdrop-blur rounded-lg shadow-md flex items-center justify-center text-brand-700 hover:bg-white active:scale-95 transition"
                aria-label="تغییر عکس"
              >
                <Upload size={15} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="w-9 h-9 bg-white/95 backdrop-blur rounded-lg shadow-md flex items-center justify-center text-danger hover:bg-white active:scale-95 transition"
                aria-label="حذف"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || disabled || (atLimit && !value)}
          className={`w-full ${aspectClass || 'py-8'} rounded-xl border-2 border-dashed transition flex flex-col items-center justify-center gap-2 ${
            atLimit && !value
              ? 'border-red-300 bg-red-50 cursor-not-allowed'
              : 'border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-brand-50/50 active:bg-brand-100'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-brand-700" />
              <p className="text-xs text-gray-600">
                {progress.step || 'در حال پردازش...'}
              </p>
            </>
          ) : atLimit && !value ? (
            <>
              <ImageIcon size={24} className="text-red-400" />
              <p className="text-xs text-red-600 text-center px-2">
                ظرفیت پر است ({maxTotal} عکس)
              </p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <Upload size={18} className="text-brand-700" />
              </div>
              <p className="text-sm font-medium text-gray-700">انتخاب عکس</p>
              <p className="text-[10px] text-gray-400 px-4 text-center">
                JPG، PNG یا WebP — حداکثر {maxInputMB} مگابایت
              </p>
            </>
          )}
        </button>
      )}

      {hint && <p className="input-hint">{hint}</p>}

      {!hint && (
        <p className="input-hint">
          عکس به صورت خودکار فشرده می‌شود (حداکثر {maxSizeKB} کیلوبایت)
          {atLimit && ' — ظرفیت پر است'}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
        capture={undefined}
      />
    </div>
  )
}