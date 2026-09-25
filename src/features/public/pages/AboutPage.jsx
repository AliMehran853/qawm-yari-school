import { MapPin, Calendar, User, Phone, Mail, BookOpen } from 'lucide-react'
import { useSettings } from '../../settings/useSettings'

export default function AboutPage() {
  const { data: settings } = useSettings()

  const schoolName = settings?.school_name || 'مکتب قوم یاری'
  const fullName = settings?.school_full_name || ''

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-700">
          درباره مکتب
        </h1>
        <p className="text-gray-500 mt-2">{fullName || schoolName}</p>
      </div>

      {settings?.description && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6">
          <p className="text-gray-700 leading-loose text-sm sm:text-base whitespace-pre-wrap">
            {settings.description}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={MapPin} label="موقعیت">
          {settings?.address || 'ولسوالی ورس، بامیان'}
        </InfoCard>
        <InfoCard icon={Calendar} label="سال تأسیس">
          {settings?.established_year ? `سال ${settings.established_year} شمسی` : 'ثبت نشده'}
        </InfoCard>
        <InfoCard icon={User} label="مدیر مکتب">
          {settings?.principal_name || 'ثبت نشده'}
        </InfoCard>
        <InfoCard icon={BookOpen} label="نوع مکتب">
          {settings?.type || 'دولتی'} — متوسطه
        </InfoCard>
        {settings?.phone && (
          <InfoCard icon={Phone} label="شماره تماس">
            <a href={`tel:${settings.phone}`} dir="ltr" className="hover:text-brand-700">
              {settings.phone}
            </a>
          </InfoCard>
        )}
        {settings?.email && (
          <InfoCard icon={Mail} label="ایمیل">
            <a href={`mailto:${settings.email}`} dir="ltr" className="hover:text-brand-700">
              {settings.email}
            </a>
          </InfoCard>
        )}
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, label, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900 leading-snug">
          {children}
        </p>
      </div>
    </div>
  )
}