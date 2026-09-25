import { useState, useRef } from 'react'
import {
  Download,
  Upload,
  AlertTriangle,
  Database,
  CheckCircle2,
  FileJson,
  X,
  Shield,
} from 'lucide-react'
import { toast } from 'sonner'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { useBackup } from '../useBackup'
import { backupApi } from '../backupApi'
import { toFaNum } from '../../../utils/number'

const TABLE_LABELS = {
  settings: 'تنظیمات',
  classes: 'صنوف',
  subjects: 'مضامین',
  teachers: 'معلمان',
  students: 'دانش‌آموزان',
  teacher_subjects: 'تعیین معلم',
  grades: 'نمرات',
  attendance: 'حضور و غیاب',
  announcements: 'اعلانات',
  gallery: 'گالری',
  documents: 'اسناد',
  registrations: 'ثبت‌نام‌ها',
}

export default function BackupPage() {
  const { exportBackup, importBackup, exporting, importing, progress } =
    useBackup()
  const fileInputRef = useRef(null)

  const [pendingBackup, setPendingBackup] = useState(null)
  const [confirmText, setConfirmText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result)
        const info = backupApi.validate(json)
        setPendingBackup({ backup: json, info })
        setShowConfirm(true)
        setConfirmText('')
      } catch (err) {
        toast.error(err.message || 'فایل نامعتبر است')
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.onerror = () => {
      toast.error('خطا در خواندن فایل')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  async function handleConfirmImport() {
    if (confirmText !== 'بازگردانی') {
      toast.error('برای تأیید، کلمه «بازگردانی» را تایپ کن')
      return
    }

    const ok = await importBackup(pendingBackup.backup)
    if (ok) {
      // بازنشانی فرم
      setPendingBackup(null)
      setShowConfirm(false)
      setConfirmText('')
      if (fileInputRef.current) fileInputRef.current.value = ''

      // رفرش کل صفحه بعد از ۱ ثانیه
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  function cancelImport() {
    setPendingBackup(null)
    setShowConfirm(false)
    setConfirmText('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
          پشتیبان‌گیری و بازگردانی
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          ذخیره و بازیابی اطلاعات مکتب
        </p>
      </div>

      {/* ─── هشدار ─── */}
      <Card className="bg-blue-50 border-blue-200 mb-5">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h3 className="font-bold text-blue-900 text-sm">
              چرا پشتیبان‌گیری مهم است؟
            </h3>
            <p className="text-xs text-blue-800 mt-1 leading-relaxed">
              در پلن رایگان Supabase، پشتیبان خودکار وجود ندارد. اگر
              اشتباهی همه شاگردان یک صنف حذف شوند یا ترفیع نادرست انجام شود،
              فقط با پشتیبان می‌توانی برگردانی. توصیه: هفته‌ای یک بار یا قبل از
              عملیات مهم.
            </p>
          </div>
        </div>
      </Card>

      {/* ─── دو کارت اصلی ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* پشتیبان‌گیری */}
        <Card flat>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Download size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">پشتیبان‌گیری</h2>
              <p className="text-xs text-gray-500">دانلود یک فایل JSON</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              همه اطلاعات مکتب شامل این‌ها دانلود می‌شود:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(TABLE_LABELS).map(([key, label]) => (
                <span key={key} className="badge badge-gray text-[10px]">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={exportBackup}
            disabled={exporting || importing}
            className="w-full"
            size="lg"
          >
            <Download size={18} />
            <span>{exporting ? 'در حال آماده‌سازی...' : 'دانلود پشتیبان'}</span>
          </Button>

          <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
            فایل دانلود شده را در جای امن نگه‌دار (Google Drive، USB، ایمیل
            شخصی). این فایل شامل تمام اطلاعات مکتب است.
          </p>
        </Card>

        {/* بازگردانی */}
        <Card flat className="border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Upload size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">بازگردانی</h2>
              <p className="text-xs text-gray-500">بارگذاری فایل پشتیبان</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-red-900">
                  داده‌های فعلی پاک می‌شوند
                </p>
                <p className="text-[11px] text-red-700 mt-1 leading-relaxed">
                  قبل از بازگردانی، یک پشتیبان خودکار از وضعیت فعلی دانلود
                  می‌شود. ولی باز هم با احتیاط عمل کن.
                </p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className="hidden"
            id="backup-file-input"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={exporting || importing}
            variant="danger"
            className="w-full"
            size="lg"
          >
            <Upload size={18} />
            <span>انتخاب فایل پشتیبان</span>
          </Button>

          <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
            فقط فایل‌های با پسوند <span className="font-mono">.json</span> که
            از همین سیستم ساخته شده‌اند قابل استفاده هستند.
          </p>
        </Card>
      </div>

      {/* ─── راهنما ─── */}
      <Card flat className="mt-5">
        <h2 className="font-bold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
          <Database size={18} className="text-brand-700" />
          راهنمای پشتیبان‌گیری
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-brand-600" />
              چه زمانی پشتیبان بگیریم؟
            </h3>
            <ul className="space-y-1.5 text-gray-600 text-xs leading-relaxed">
              <li>• اول هر ماه</li>
              <li>• قبل از ترفیع دسته‌جمعی</li>
              <li>• قبل از وارد کردن نمرات نهایی</li>
              <li>• بعد از افزودن تعداد زیادی شاگرد</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-1.5">
              <FileJson size={14} className="text-brand-600" />
              فایل را کجا نگه‌داریم؟
            </h3>
            <ul className="space-y-1.5 text-gray-600 text-xs leading-relaxed">
              <li>• Google Drive (رایگان)</li>
              <li>• فلش USB (کپی دوم)</li>
              <li>• ایمیل به خودت</li>
              <li>• هرگز فقط در کمپیوتر — ممکن است خراب شود</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* ─── مودال تأیید ─── */}
      {showConfirm && pendingBackup && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center animate-fade-in"
          dir="rtl"
          onClick={cancelImport}
        >
          <div
            className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl shadow-modal animate-slide-up max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 sticky top-0 bg-white z-10 sm:rounded-t-2xl">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-600" />
                <h2 className="font-bold text-base sm:text-lg">
                  تأیید بازگردانی
                </h2>
              </div>
              <button
                onClick={cancelImport}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                aria-label="بستن"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {/* اطلاعات فایل */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs font-medium text-blue-900 mb-2">
                  اطلاعات فایل پشتیبان:
                </p>
                <div className="space-y-1.5 text-xs text-blue-800">
                  <div className="flex justify-between">
                    <span>تاریخ ساخت فایل:</span>
                    <span className="font-medium fa-num">
                      {pendingBackup.info.meta.exported_at_jalali}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>تعداد کل رکوردها:</span>
                    <span className="font-medium fa-num">
                      {toFaNum(pendingBackup.info.meta.records_count)}
                    </span>
                  </div>
                </div>
              </div>

              {/* جدول‌ها */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">
                  جدول‌هایی که بازگردانی می‌شوند:
                </p>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                  {pendingBackup.info.tables.map((t) => (
                    <div
                      key={t}
                      className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <span className="text-gray-700">
                        {TABLE_LABELS[t] || t}
                      </span>
                      <span className="badge badge-brand text-[10px] fa-num">
                        {toFaNum(pendingBackup.info.counts[t] || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* هشدار بزرگ */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    size={18}
                    className="text-red-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-bold text-red-900">
                      هشدار مهم
                    </p>
                    <p className="text-xs text-red-700 mt-1 leading-relaxed">
                      <strong>همه داده‌های فعلی مکتب پاک می‌شوند</strong> و
                      جایگزین داده‌های این فایل می‌شوند. این عملیات قابل
                      بازگشت نیست (به جز با پشتیبان وضعیت فعلی که خودکار دانلود
                      می‌شود).
                    </p>
                  </div>
                </div>
              </div>

              {/* تأیید */}
              <div>
                <label className="input-label">
                  برای تأیید، کلمه <strong>بازگردانی</strong> را تایپ کن:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="بازگردانی"
                  className="input text-center font-bold"
                  autoFocus
                />
              </div>

              {/* نوار پیشرفت */}
              {progress && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>
                      {progress.step === 'clear' && 'پاک کردن داده‌های قبلی...'}
                      {progress.step === 'insert' &&
                        `درج ${TABLE_LABELS[progress.table] || progress.table}...`}
                      {progress.step === 'done' && 'تمام شد'}
                    </span>
                    {progress.total > 0 && (
                      <span className="fa-num">
                        {toFaNum(progress.current)} / {toFaNum(progress.total)}
                      </span>
                    )}
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-700 transition-all"
                      style={{
                        width: `${
                          progress.total > 0
                            ? (progress.current / progress.total) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* دکمه‌ها */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleConfirmImport}
                  disabled={
                    confirmText !== 'بازگردانی' || importing
                  }
                  variant="danger"
                  className="flex-1"
                  size="lg"
                >
                  {importing
                    ? 'در حال بازگردانی...'
                    : 'تأیید و بازگردانی'}
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelImport}
                  disabled={importing}
                  size="lg"
                >
                  انصراف
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}