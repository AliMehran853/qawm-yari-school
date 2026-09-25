import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react'
import { useSettings } from '../../settings/useSettings'
import { normalizeWhatsApp, openWhatsApp } from '../../../utils/whatsapp'

export default function ContactPage() {
  const { data: settings } = useSettings()

  const schoolName = settings?.school_name || 'مکتب قوم یاری'
  const phone = settings?.phone
  const email = settings?.email
  const address = settings?.address || 'ولسوالی ورس، بامیان، افغانستان'

  function handleWhatsApp() {
    if (!phone) return
    const normalized = normalizeWhatsApp(phone)
    if (!normalized) return
    openWhatsApp(
      phone,
      `سلام، از سایت ${schoolName} تماس می‌گیرم.`
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-700">
          تماس با ما
        </h1>
        <p className="text-gray-500 mt-2">راه‌های ارتباط با مکتب</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ContactCard icon={MapPin} title="آدرس" color="brand">
          <p className="leading-relaxed">{address}</p>
        </ContactCard>

        {phone && (
          <ContactCard icon={Phone} title="شماره تماس" color="gold">
            <a
              href={`tel:${phone}`}
              className="text-lg font-medium hover:text-brand-700 fa-num"
              dir="ltr"
            >
              {phone}
            </a>
          </ContactCard>
        )}

        {email && (
          <ContactCard icon={Mail} title="ایمیل" color="blue">
            <a
              href={`mailto:${email}`}
              className="text-sm hover:text-brand-700 break-all"
              dir="ltr"
            >
              {email}
            </a>
          </ContactCard>
        )}

        <ContactCard icon={Clock} title="ساعات کاری" color="purple">
          <p className="leading-relaxed text-sm">
            شنبه تا چهارشنبه: ۷:۰۰ — ۱۲:۰۰
            <br />
            پنجشنبه: ۷:۰۰ — ۱۰:۳۰
          </p>
        </ContactCard>
      </div>

      {phone && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-card"
          >
            <MessageCircle size={20} />
            <span>گفتگو در واتساپ</span>
          </button>
        </div>
      )}
    </div>
  )
}

function ContactCard({ icon: Icon, title, color, children }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-700',
    gold: 'bg-gold-50 text-gold-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-start gap-4">
        <div
          className={`w-11 h-11 rounded-xl ${colors[color]} flex items-center justify-center shrink-0`}
        >
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
          <div className="text-gray-600">{children}</div>
        </div>
      </div>
    </div>
  )
}