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
  const [progress, setProgress] = useState('')
  const [localPreview, setLocalPreview] = useState(null)
  const inputRef = useRef(null)

  const atLimit = currentTotal >= maxTotal

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

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
    setProgress('در حال فشرده‌سازی...')

    try {
      const previewUrl = URL.createObjectURL(file)
      setLocalPreview(previewUrl)

      const compressed = await compressImage(file, { maxSizeKB })
      const finalKB = (compressed.size / 1024).toFixed(0)
      setProgress(`آپلود (${finalKB} کیلوبایت)...`)

      if (value) {
        try {
          await deleteFile(value)
        } catch (err) {
          console.warn('خطا در حذف عکس قبلی:', err)
        }
      }

      const { url } = await uploadFile(compressed, folder)

      setProgress('')
      onChange(url)
      toast.success('عکس با موفقیت آپلود شد')

      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setLocalPreview(null)
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'خطا در آپلود عکس')
      setLocalPreview(null)
    } finally {
      setUploading(false)
      setProgress('')
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
            <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center text-white">
              <Loader2 size={28} className="animate-spin mb-2" />
              <p className="text-xs">{progress || 'در حال پردازش...'}</p>
            </div>
          )}

          {!uploading && (
            <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-8 h-8 bg-white/95 rounded-lg shadow flex items-center justify-center text-brand-700 hover:bg-white"
                aria-label="تغییر عکس"
              >
                <Upload size={14} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="w-8 h-8 bg-white/95 rounded-lg shadow flex items-center justify-center text-danger hover:bg-white"
                aria-label="حذف"
              >
                <X size={14} />
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
              : 'border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-brand-50/50'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-brand-700" />
              <p className="text-xs text-gray-600">
                {progress || 'در حال پردازش...'}
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
      />
    </div>
  )
}