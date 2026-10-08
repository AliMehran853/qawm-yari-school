import { useState, useRef } from 'react'
import { Upload, Trash2, Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import { compressImage, validateImageFile } from '../../lib/imageCompressor'
import { uploadFile, deleteFile } from '../../lib/storage'

export default function LogoUploader({
  value,
  onChange,
  folder = 'logo',
  fallbackLetter = 'م',
  maxSizeKB = 200,
  maxInputMB = 5,
}) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const inputRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file, { maxInputMB })
    if (!validation.valid) {
      toast.error(validation.error)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setUploading(true)
    setProgress('در حال فشرده‌سازی...')

    try {
      const compressed = await compressImage(file, {
        maxWidth: 512,
        maxHeight: 512,
        maxSizeKB,
      })

      setProgress('آپلود...')

      if (value) {
        try {
          await deleteFile(value)
        } catch (err) {
          console.warn('خطا در حذف لوگوی قبلی:', err)
        }
      }

      const { url } = await uploadFile(compressed, folder)
      onChange(url)
      toast.success('لوگو ذخیره شد')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'خطا در آپلود لوگو')
    } finally {
      setUploading(false)
      setProgress('')
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemove() {
    if (!value) return
    if (!confirm('لوگو حذف شود؟')) return

    setUploading(true)
    try {
      await deleteFile(value)
      onChange('')
      toast.success('لوگو حذف شد')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'خطا در حذف')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {/* ─── پیش‌نمایش لوگو (کوچک) ─── */}
      <div className="relative shrink-0">
        <div className="w-20 h-20 rounded-2xl bg-white border-2 border-brand-200 flex items-center justify-center overflow-hidden shadow-sm">
          {value ? (
            <img
              src={value}
              alt="لوگو"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-bold text-3xl">
                {fallbackLetter}
              </span>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
              <Loader2 size={20} className="text-white animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* ─── دکمه‌ها ─── */}
      <div className="flex-1 min-w-0">
        {uploading ? (
          <p className="text-sm text-gray-600">{progress || 'در حال آپلود...'}</p>
        ) : value ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-700 font-medium">لوگو آپلود شده</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-2 rounded-lg transition"
              >
                <RefreshCw size={13} />
                <span>تغییر لوگو</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition"
              >
                <Trash2 size={13} />
                <span>حذف</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-l from-brand-600 to-brand-800 hover:from-brand-700 hover:to-brand-900 px-4 py-2.5 rounded-xl transition shadow-sm hover:shadow-md"
            >
              <Upload size={15} />
              <span>انتخاب لوگو</span>
            </button>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              عکس مربع (PNG یا JPG) — حداکثر {maxInputMB} مگابایت
              <br />
              خودکار به {maxSizeKB} کیلوبایت فشرده می‌شود
            </p>
          </div>
        )}
      </div>

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