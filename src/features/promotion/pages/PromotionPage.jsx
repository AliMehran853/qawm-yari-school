import { useState } from 'react'
import { ArrowUpCircle, AlertTriangle, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { usePromotionStats, usePromoteAll } from '../usePromotion'
import { toFaNum } from '../../../utils/number'

export default function PromotionPage() {
  const [confirmText, setConfirmText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const { data: stats, isLoading } = usePromotionStats()
  const promoteMut = usePromoteAll()

  const total = stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0

  async function handlePromote() {
    if (confirmText !== 'ترفیع') {
      toast.error('برای تأیید، کلمه «ترفیع» را تایپ کن')
      return
    }
    try {
      await promoteMut.mutateAsync()
      setShowConfirm(false)
      setConfirmText('')
    } catch (e) {}
  }

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
          ترفیع دسته‌جمعی
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          انتقال همه شاگردان به صنف بالاتر — اول سال تعلیمی
        </p>
      </div>

      {/* ─── هشدار ─── */}
      <Card className="bg-red-50 border-red-200 mb-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h3 className="font-bold text-red-900">عملیات حساس</h3>
            <p className="text-xs sm:text-sm text-red-700 mt-1 leading-relaxed">
              این عملیات <strong>غیرقابل بازگشت</strong> است. فقط در ابتدای سال
              تعلیمی و پس از اطمینان کامل انجام بده. قبل از ترفیع، از دیتابیس
              پشتیبان بگیر.
            </p>
          </div>
        </div>
      </Card>

      {/* ─── آمار ─── */}
      <Card flat className="mb-5">
        <h2 className="font-bold text-sm sm:text-base text-gray-900 mb-4">
          وضعیت فعلی شاگردان
        </h2>
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="spinner text-brand-700 mx-auto" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
              {Object.entries(stats || {})
                .filter(([_, count]) => count > 0)
                .map(([grade, count]) => (
                  <div
                    key={grade}
                    className="bg-white border border-gray-200 rounded-xl p-3 text-center"
                  >
                    <p className="text-[10px] text-gray-500">صنف {toFaNum(grade)}</p>
                    <p className="text-xl font-bold text-brand-700 fa-num mt-1">
                      {toFaNum(count)}
                    </p>
                  </div>
                ))}
            </div>

            <div className="border-t pt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">مجموع شاگردان فعال</span>
              <span className="font-bold text-brand-700 fa-num text-lg">
                {toFaNum(total)}
              </span>
            </div>
          </>
        )}
      </Card>

      {/* ─── توضیح ─── */}
      <Card flat className="mb-5">
        <h2 className="font-bold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
          <ArrowUpCircle size={18} className="text-brand-700" />
          با کلیک روی «ترفیع»، این اتفاق می‌افتد:
        </h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-brand-700 mt-0.5">✓</span>
            <span>شاگردان صنف ۱۲ → <strong>فارغ</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-700 mt-0.5">✓</span>
            <span>شاگردان صنف ۱۱ → صنف ۱۲</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-700 mt-0.5">✓</span>
            <span>شاگردان صنف ۱۰ → صنف ۱۱</span>
          </li>
          <li className="flex items-start gap-2 text-gray-400">
            <span className="mt-0.5">⋯</span>
            <span>و الی آخر تا صنف ۱ → ۲</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-700 mt-0.5">✓</span>
            <span>صنف ۱ خالی می‌شود تا ثبت‌نام‌های جدید بیایند</span>
          </li>
        </ul>
      </Card>

      {/* ─── دکمه ترفیع ─── */}
      {!showConfirm ? (
        <Button
          onClick={() => setShowConfirm(true)}
          disabled={total === 0}
          variant="danger"
          size="lg"
          className="w-full"
        >
          <GraduationCap size={20} />
          <span>شروع ترفیع دسته‌جمعی</span>
        </Button>
      ) : (
        <Card className="bg-white border-gray-300">
          <h3 className="font-bold text-gray-900 mb-2">
            تأیید نهایی
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            برای تأیید، کلمه <strong className="text-red-700">ترفیع</strong> را
            در کادر زیر تایپ کن.
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="ترفیع"
            className="input text-center font-bold mb-4"
            autoFocus
          />

          <div className="flex gap-2">
            <Button
              onClick={handlePromote}
              disabled={confirmText !== 'ترفیع' || promoteMut.isPending}
              variant="danger"
              className="flex-1"
              size="lg"
            >
              {promoteMut.isPending ? 'در حال ترفیع...' : 'تأیید و ترفیع'}
            </Button>
            <Button
              onClick={() => {
                setShowConfirm(false)
                setConfirmText('')
              }}
              variant="outline"
              size="lg"
            >
              انصراف
            </Button>
          </div>
        </Card>
      )}
    </PageWrapper>
  )
}