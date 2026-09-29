import { useState, useEffect } from 'react'
import {
  Save,
  School,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Sparkles,
  FileText,
} from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'
import { useSettings, useUpdateSettings } from '../useSettings'

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings()
  const updateMut = useUpdateSettings()

  const [form, setForm] = useState({
    school_name: '',
    school_full_name: '',
    hero_tagline: '',
    province: '',
    district: '',
    address: '',
    phone: '',
    email: '',
    logo_url: '',
    current_year: 1404,
    principal_name: '',
    established_year: '',
    description: '',
  })

  useEffect(() => {
    if (settings) {
      setForm({
        school_name: settings.school_name || '',
        school_full_name: settings.school_full_name || '',
        hero_tagline: settings.hero_tagline || '',
        province: settings.province || '',
        district: settings.district || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        logo_url: settings.logo_url || '',
        current_year: settings.current_year || 1404,
        principal_name: settings.principal_name || '',
        established_year: settings.established_year || '',
        description: settings.description || '',
      })
    }
  }, [settings])

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await updateMut.mutateAsync({
      school_name: form.school_name.trim(),
      school_full_name: form.school_full_name.trim() || null,
      hero_tagline: form.hero_tagline.trim() || null,
      province: form.province.trim() || null,
      district: form.district.trim() || null,
      address: form.address.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      logo_url: form.logo_url.trim() || null,
      current_year: Number(form.current_year) || 1404,
      principal_name: form.principal_name.trim() || null,
      established_year: form.established_year.trim() || null,
      description: form.description.trim() || null,
    })
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="py-16 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 28, height: 28 }}
          />
          <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
          تنظیمات
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          اطلاعات مکتب برای نمایش در سایت و اسناد
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ═══ اطلاعات اصلی ═══ */}
        <Card flat>
          <div className="flex items-center gap-2 mb-4">
            <School size={18} className="text-brand-700" />
            <h2 className="font-bold text-sm sm:text-base text-gray-900">
              اطلاعات مکتب
            </h2>
          </div>

          <div className="space-y-4">
            <Input
              label="نام مکتب *"
              value={form.school_name}
              onChange={(e) => set('school_name', e.target.value)}
              required
              placeholder="مکتب قوم یاری"
            />

            <Input
              label="نام کامل مکتب"
              value={form.school_full_name}
              onChange={(e) => set('school_full_name', e.target.value)}
              placeholder="لیسه قوم یاری"
              hint="در اسناد رسمی و فوتر سایت استفاده می‌شود"
            />
          </div>
        </Card>

        {/* ═══ متن صفحه اصلی ═══ */}
        <Card flat className="border-brand-200 bg-brand-50/30">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-brand-700" />
            <div>
              <h2 className="font-bold text-sm sm:text-base text-gray-900">
                متن صفحه اصلی
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                متن کوتاهی که در بالای صفحه اصلی و فوتر سایت نمایش داده می‌شود
              </p>
            </div>
          </div>

          <div>
            <label className="input-label">معرفی کوتاه (۱-۲ خط)</label>
            <textarea
              value={form.hero_tagline}
              onChange={(e) => set('hero_tagline', e.target.value)}
              className="input min-h-[80px] resize-y"
              placeholder="مثلاً: لیسه‌ای فعال در قلب ورس که نسل آینده را آموزش می‌دهد."
              rows={3}
            />
            <p className="input-hint">
              حداکثر ۲ خط — برای توضیح کامل، از بخش «درباره مکتب» استفاده کن
            </p>
          </div>
        </Card>

        {/* ═══ درباره مکتب ═══ */}
        <Card flat>
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-brand-700" />
            <div>
              <h2 className="font-bold text-sm sm:text-base text-gray-900">
                درباره مکتب
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                متن کامل که در صفحه «درباره مکتب» نمایش داده می‌شود
              </p>
            </div>
          </div>

          <div>
            <label className="input-label">معرفی کامل مکتب</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="input min-h-[180px] resize-y"
              placeholder="متن کامل درباره تاریخچه، اهداف و فعالیت‌های مکتب..."
              rows={8}
            />
            <p className="input-hint">
              این متن در صفحه «درباره مکتب» نمایش داده می‌شود. برای
              پاراگراف‌بندی، از Enter خالی بین پاراگراف‌ها استفاده کن.
            </p>
          </div>
        </Card>

        {/* ═══ موقعیت ═══ */}
        <Card flat>
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-brand-700" />
            <h2 className="font-bold text-sm sm:text-base text-gray-900">
              موقعیت
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="ولایت"
                value={form.province}
                onChange={(e) => set('province', e.target.value)}
                placeholder="بامیان"
              />
              <Input
                label="ولسوالی"
                value={form.district}
                onChange={(e) => set('district', e.target.value)}
                placeholder="ورس"
              />
            </div>

            <div>
              <label className="input-label">آدرس کامل</label>
              <textarea
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                className="input min-h-[70px] resize-y"
                placeholder="ولسوالی ورس، ولایت بامیان، افغانستان"
                rows={2}
              />
            </div>
          </div>
        </Card>

        {/* ═══ تماس ═══ */}
        <Card flat>
          <div className="flex items-center gap-2 mb-4">
            <Phone size={18} className="text-brand-700" />
            <h2 className="font-bold text-sm sm:text-base text-gray-900">
              اطلاعات تماس
            </h2>
          </div>

          <div className="space-y-4">
            <Input
              label="شماره تماس"
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              dir="ltr"
              className="text-left"
              placeholder="0700123456"
            />

            <Input
              label="ایمیل"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              dir="ltr"
              className="text-left"
              placeholder="school@example.com"
            />
          </div>
        </Card>

        {/* ═══ آمر مکتب ═══ */}
        <Card flat>
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-brand-700" />
            <h2 className="font-bold text-sm sm:text-base text-gray-900">
              آمر مکتب
            </h2>
          </div>

          <Input
            label="نام آمر مکتب"
            value={form.principal_name}
            onChange={(e) => set('principal_name', e.target.value)}
            placeholder="مثلاً: غلام علی آشنا"
            hint="در صفحه «درباره مکتب» نمایش داده می‌شود"
          />
        </Card>

        {/* ═══ تاریخ و لوگو ═══ */}
        <Card flat>
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-brand-700" />
            <h2 className="font-bold text-sm sm:text-base text-gray-900">
              تاریخ و لوگو
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="سال تأسیس"
                value={form.established_year}
                onChange={(e) => set('established_year', e.target.value)}
                placeholder="1382"
                hint="شمسی"
              />
              <div>
                <label className="input-label">سال تعلیمی فعلی</label>
                <input
                  type="number"
                  value={form.current_year}
                  onChange={(e) => set('current_year', e.target.value)}
                  dir="ltr"
                  className="input text-left fa-num"
                  placeholder="1404"
                />
                <p className="input-hint">
                  سال تحصیلی که الان استفاده می‌شود
                </p>
              </div>
            </div>

            <Input
              label="لینک لوگو"
              value={form.logo_url}
              onChange={(e) => set('logo_url', e.target.value)}
              dir="ltr"
              className="text-left"
              placeholder="https://..."
              hint="لینک مستقیم به عکس لوگو"
            />

            {form.logo_url && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <img
                  src={form.logo_url}
                  alt="پیش‌نمایش لوگو"
                  className="w-16 h-16 rounded-lg object-cover bg-white border"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <p className="text-xs text-gray-500">پیش‌نمایش لوگو</p>
              </div>
            )}
          </div>
        </Card>

        {/* ═══ دکمه ذخیره ═══ */}
        <div className="sticky bottom-4 z-10">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-3 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500 hidden sm:block">
              تغییرات فوری ذخیره می‌شود
            </p>
            <Button
              type="submit"
              disabled={updateMut.isPending}
              size="lg"
              className="w-full sm:w-auto"
            >
              <Save size={18} />
              <span>
                {updateMut.isPending ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
              </span>
            </Button>
          </div>
        </div>
      </form>
    </PageWrapper>
  )
}