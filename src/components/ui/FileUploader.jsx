import { useState, useRef } from 'react'
import { Upload, X, Loader2, FileText, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

import { uploadFile, deleteFile } from '../../lib/storage'

export default function FileUploader({
  value,
  onChange,
  folder = 'documents',
  label = 'فایل',
  hint,
  maxSizeMB = 10,
  disabled = false,
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowed.includes(file.type)) {
      toast.error('فقط فایل PDF یا Word مجاز است')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`حجم فایل باید کمتر از ${maxSizeMB} مگابایت باشد`)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setUploading(true)
    try {
      if (value) {
        try {
          await deleteFile(value)
        } catch (err) {
          console.warn('خطا در حذف فایل قبلی:', err)
        }
      }

      const { url } = await uploadFile(file, folder)
      onChange(url)
      toast.success('فایل با موفقیت آپلود شد')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'خطا در آپلود')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemove() {
    if (!value) return
    if (!confirm('فایل حذف شود؟')) return

    setUploading(true)
    try {
      await deleteFile(value)
      onChange('')
      toast.success('فایل حذف شد')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'خطا در حذف')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      {label && <label className="input-label">{label}</label>}

      {value ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center shrink-0">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-900">فایل آپلود شد</p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-700 hover:underline inline-flex items-center gap-1"
            >
              <ExternalLink size={11} />
              <span>مشاهده فایل</span>
            </a>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg shrink-0 transition"
            aria-label="حذف"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || disabled}
          className="w-full py-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-brand-50/50 transition flex flex-col items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-brand-700" />
              <p className="text-xs text-gray-600">در حال آپلود...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <Upload size={18} className="text-brand-700" />
              </div>
              <p className="text-sm font-medium text-gray-700">انتخاب فایل</p>
              <p className="text-[10px] text-gray-400 px-4 text-center">
                PDF یا Word — حداکثر {maxSizeMB} مگابایت
              </p>
            </>
          )}
        </button>
      )}

      {hint && <p className="input-hint">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}