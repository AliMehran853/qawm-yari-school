import { useState } from 'react'
import { X, Copy, MessageCircle, Check, Phone } from 'lucide-react'
import Button from '../../../components/ui/Button'
import {
  buildAnnouncementMessage,
  copyToClipboard,
  openWhatsApp,
  normalizeWhatsApp,
} from '../../../utils/whatsapp'
import { useSettings } from '../../settings/useSettings'
import { toast } from 'sonner'

export default function AnnouncementShareModal({ open, announcement, onClose }) {
  const [phone, setPhone] = useState('')
  const [copied, setCopied] = useState(false)
  const { data: settings } = useSettings()

  if (!open || !announcement) return null

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const message = buildAnnouncementMessage({
    title: announcement.title,
    body: announcement.body,
    schoolName: settings?.school_full_name || settings?.school_name || '',
    siteUrl,
  })

  async function handleCopy() {
    const ok = await copyToClipboard(message)
    if (ok) {
      setCopied(true)
      toast.success('متن کپی شد')
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error('کپی نشد، دستی انتخاب کن')
    }
  }

  function handleOpenWhatsAppGeneral() {
    openWhatsApp('', message)
  }

  function handleSendToNumber() {
    const normalized = normalizeWhatsApp(phone)
    if (!normalized) {
      toast.error('شماره معتبر نیست')
      return
    }
    openWhatsApp(phone, message)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl shadow-modal animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 sticky top-0 bg-white z-10 sm:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-green-600" />
            <h2 className="font-bold text-base sm:text-lg">ارسال در واتساپ</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="input-label">پیش‌نمایش پیام</label>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
              {message}
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleOpenWhatsAppGeneral}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <MessageCircle size={18} />
              <span>باز کردن واتساپ و انتخاب مخاطب</span>
            </Button>

            <Button
              onClick={handleCopy}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? 'کپی شد' : 'کپی متن پیام'}</span>
            </Button>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <label className="input-label">ارسال به شماره خاص</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0700123456"
                  dir="ltr"
                  className="input pr-9 text-left"
                />
              </div>
              <Button onClick={handleSendToNumber} disabled={!phone}>
                ارسال
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}