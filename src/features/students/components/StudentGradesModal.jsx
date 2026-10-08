import { useState, useEffect, useMemo } from 'react'
import {
  X,
  BarChart3,
  Trophy,
  Percent,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  Award,
  Target,
  Calculator,
} from 'lucide-react'

import { useReportCard, useClassAverages } from '../../grades/useGrades'
import {
  getTotal,
  isPassed,
  getLevel,
  calcAverage,
  countStatus,
  calcRank,
} from '../../grades/gradeCalculator'
import { toFaNum } from '../../../utils/number'

export default function StudentGradesModal({ open, student, onClose }) {
  const [tab, setTab] = useState('details')

  const { data: report, isLoading } = useReportCard(open ? student?.id : null)
  const { data: classAvgs } = useClassAverages(open ? student?.grade : null)

  useEffect(() => {
    if (open) setTab('details')
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const calc = useMemo(() => {
    if (!report) return null
    const avg = calcAverage(report.rows)
    const status = countStatus(report.rows)
    const allAvgs = classAvgs ? Object.values(classAvgs) : []
    const rank = calcRank(avg, allAvgs)
    const level = getLevel(avg)
    return { avg, status, rank, classSize: allAvgs.length, level }
  }, [report, classAvgs])

  if (!open || !student) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center animate-fade-in p-0 sm:p-4"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-modal animate-slide-up max-h-[94vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══ هدر ═══ */}
        <div className="relative bg-gradient-to-bl from-brand-700 to-brand-900 text-white p-5 pb-6 sm:p-6 sm:pb-8 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition"
            aria-label="بستن"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4 pt-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-lg shrink-0">
              {student.photo_url ? (
                <img
                  src={student.photo_url}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {student.name?.charAt(0) || '؟'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg sm:text-xl truncate">
                {student.name}
              </h2>
              <p className="text-white/75 text-xs sm:text-sm mt-1 truncate">
                ولد {student.father_name || '—'}
                {student.grandfather_name &&
                  ` ولد ${student.grandfather_name}`}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[11px] bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                  <Award size={11} />
                  صنف {toFaNum(student.grade)}
                </span>
                {student.student_code && (
                  <span className="text-[10px] text-white/60 font-mono" dir="ltr">
                    {student.student_code}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        </div>

        {/* ═══ تب‌ها ═══ */}
        <div className="flex border-b border-gray-200 bg-white shrink-0">
          <TabButton
            active={tab === 'details'}
            onClick={() => setTab('details')}
            icon={BarChart3}
          >
            نمرات تفصیلی
          </TabButton>
          <TabButton
            active={tab === 'annual'}
            onClick={() => setTab('annual')}
            icon={Target}
          >
            خلاصه سالانه
          </TabButton>
        </div>

        {/* ═══ محتوا ═══ */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="py-16 text-center">
              <div
                className="spinner text-brand-700 mx-auto"
                style={{ width: 28, height: 28 }}
              />
              <p className="text-sm text-gray-500 mt-3">
                در حال بارگذاری...
              </p>
            </div>
          ) : !report || report.rows.length === 0 ? (
            <div className="py-16 text-center">
              <FileText size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">
                برای این دانش‌آموز نمره‌ای ثبت نشده است
              </p>
            </div>
          ) : tab === 'details' ? (
            <DetailsTab report={report} />
          ) : (
            <AnnualTab report={report} calc={calc} />
          )}
        </div>

        {/* ═══ دکمه بستن ═══ */}
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-white shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-xl transition"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   دکمه تب
   ═══════════════════════════════════════ */
function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-medium transition relative ${
        active
          ? 'text-brand-700'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon size={15} />
      <span>{children}</span>
      {active && (
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-l from-brand-500 to-gold-500" />
      )}
    </button>
  )
}

/* ═══════════════════════════════════════
   تب ۱ — نمرات تفصیلی
   ═══════════════════════════════════════ */
function DetailsTab({ report }) {
  // ═══ محاسبه جمع‌ها ═══
  const totals = useMemo(() => {
    let firstSum = 0
    let finalSum = 0
    let totalSum = 0
    let maxFirst = 0
    let maxFinal = 0
    let maxTotal = 0
    let countedSubjects = 0

    report.rows.forEach((r) => {
      const hasFirst = r.first_score !== null
      const hasFinal = r.final_score !== null

      if (hasFirst) {
        firstSum += Number(r.first_score) || 0
        maxFirst += 40
      }
      if (hasFinal) {
        finalSum += Number(r.final_score) || 0
        maxFinal += 60
      }
      if (hasFirst || hasFinal) {
        totalSum += (Number(r.first_score) || 0) + (Number(r.final_score) || 0)
        maxTotal += 100
        countedSubjects++
      }
    })

    return {
      firstSum,
      finalSum,
      totalSum,
      maxFirst,
      maxFinal,
      maxTotal,
      countedSubjects,
    }
  }, [report])

  return (
    <div className="p-4 space-y-3">
      {/* ═══ جدول دسکتاپ ═══ */}
      <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-right p-3 text-xs font-bold text-gray-700">
                مضمون
              </th>
              <th className="text-center p-3 text-xs font-bold text-gray-700 w-20">
                دور اول
              </th>
              <th className="text-center p-3 text-xs font-bold text-gray-700 w-20">
                دور نهایی
              </th>
              <th className="text-center p-3 text-xs font-bold text-gray-700 w-20">
                مجموع
              </th>
              <th className="text-center p-3 text-xs font-bold text-gray-700 w-24">
                وضعیت
              </th>
            </tr>
          </thead>
          <tbody>
            {report.rows.map((r) => {
              const total = getTotal(r.first_score, r.final_score)
              const empty = r.first_score === null && r.final_score === null
              const passed = isPassed(total)
              const level = getLevel(total)

              return (
                <tr
                  key={r.subject.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className="p-3 font-medium text-sm text-gray-900">
                    {r.subject.name}
                  </td>
                  <td className="p-3 text-center text-sm fa-num">
                    {r.first_score !== null ? (
                      <span className="text-gray-800">{r.first_score}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="p-3 text-center text-sm fa-num">
                    {r.final_score !== null ? (
                      <span className="text-gray-800">{r.final_score}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {empty ? (
                      <span className="text-gray-300 text-sm">—</span>
                    ) : (
                      <span
                        className={`font-bold text-sm fa-num ${
                          passed ? 'text-brand-700' : 'text-danger'
                        }`}
                      >
                        {toFaNum(total)}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {empty ? (
                      <span className="badge badge-gray text-[10px]">
                        ثبت نشده
                      </span>
                    ) : (
                      <span
                        className={`badge text-[10px] ${
                          passed ? 'badge-success' : 'badge-danger'
                        }`}
                      >
                        {level.label}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ═══ کارت موبایل ═══ */}
      <div className="sm:hidden space-y-3">
        {report.rows.map((r) => {
          const total = getTotal(r.first_score, r.final_score)
          const empty = r.first_score === null && r.final_score === null
          const passed = isPassed(total)
          const level = getLevel(total)

          return (
            <div
              key={r.subject.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-gray-900">
                  {r.subject.name}
                </h3>
                {empty ? (
                  <span className="badge badge-gray text-[10px]">ثبت نشده</span>
                ) : (
                  <span
                    className={`badge text-[10px] ${
                      passed ? 'badge-success' : 'badge-danger'
                    }`}
                  >
                    {level.label}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg py-2">
                  <p className="text-[10px] text-gray-500 mb-0.5">دور اول</p>
                  <p className="font-bold text-sm fa-num text-gray-800">
                    {r.first_score !== null ? r.first_score : '—'}
                  </p>
                  <p className="text-[9px] text-gray-400">از ۴۰</p>
                </div>
                <div className="bg-gray-50 rounded-lg py-2">
                  <p className="text-[10px] text-gray-500 mb-0.5">دور نهایی</p>
                  <p className="font-bold text-sm fa-num text-gray-800">
                    {r.final_score !== null ? r.final_score : '—'}
                  </p>
                  <p className="text-[9px] text-gray-400">از ۶۰</p>
                </div>
                <div
                  className={`rounded-lg py-2 ${
                    empty
                      ? 'bg-gray-50'
                      : passed
                      ? 'bg-brand-50'
                      : 'bg-red-50'
                  }`}
                >
                  <p className="text-[10px] text-gray-500 mb-0.5">مجموع</p>
                  <p
                    className={`font-bold text-sm fa-num ${
                      empty
                        ? 'text-gray-400'
                        : passed
                        ? 'text-brand-700'
                        : 'text-danger'
                    }`}
                  >
                    {empty ? '—' : toFaNum(total)}
                  </p>
                  <p className="text-[9px] text-gray-400">از ۱۰۰</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ═══ جمع کل ═══ */}
      <div className="bg-gradient-to-bl from-brand-700 to-brand-900 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Calculator size={16} className="text-white" />
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              جمع کل نمرات
            </h3>
            <span className="text-[10px] text-white/60 mr-auto fa-num">
              {toFaNum(totals.countedSubjects)} مضمون
            </span>
          </div>

          {/* سه کارت جمع */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* دور اول */}
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
              <p className="text-[10px] text-white/70 mb-1">دور اول</p>
              <p className="text-xl sm:text-2xl font-bold text-white fa-num leading-none">
                {toFaNum(totals.firstSum)}
              </p>
              <p className="text-[9px] text-white/60 mt-1 fa-num">
                از {toFaNum(totals.maxFirst)}
              </p>
            </div>

            {/* دور نهایی */}
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
              <p className="text-[10px] text-white/70 mb-1">دور نهایی</p>
              <p className="text-xl sm:text-2xl font-bold text-white fa-num leading-none">
                {toFaNum(totals.finalSum)}
              </p>
              <p className="text-[9px] text-white/60 mt-1 fa-num">
                از {toFaNum(totals.maxFinal)}
              </p>
            </div>

            {/* جمع کل */}
            <div className="bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl p-3 border-2 border-gold-300 text-center shadow-lg">
              <p className="text-[10px] text-white/90 mb-1 font-medium">
                جمع کل
              </p>
              <p className="text-xl sm:text-2xl font-bold text-white fa-num leading-none">
                {toFaNum(totals.totalSum)}
              </p>
              <p className="text-[9px] text-white/80 mt-1 fa-num">
                از {toFaNum(totals.maxTotal)}
              </p>
            </div>
          </div>

          {/* فیصدی کل */}
          {totals.maxTotal > 0 && (
            <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent size={14} className="text-white/70" />
                <span className="text-xs text-white/80">فیصدی کل</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white fa-num">
                {toFaNum(((totals.totalSum / totals.maxTotal) * 100).toFixed(2))}٪
              </span>
            </div>
          )}
        </div>
      </div>

      {/* راهنما */}
      <p className="text-center text-[10px] text-gray-400 pt-1">
        کامیابی: مجموع هر مضمون ۵۵ از ۱۰۰
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════
   تب ۲ — خلاصه سالانه
   ═══════════════════════════════════════ */
function AnnualTab({ report, calc }) {
  if (!calc) return null

  const percentage = calc.avg
  const passedRatio =
    calc.status.total > 0
      ? (calc.status.passed / calc.status.total) * 100
      : 0

  return (
    <div className="p-4 space-y-4">
      {/* فیصدی کل — کارت بزرگ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-bl from-brand-700 to-brand-900 text-white p-5 shadow-lg">
        <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex flex-col items-center justify-center shrink-0">
            <Percent size={16} className="text-white/80 mb-0.5" />
            <p className="text-xl font-bold fa-num leading-none">
              {toFaNum(percentage.toFixed(1))}
            </p>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs">فیصدی کل سال</p>
            <p className="text-lg sm:text-xl font-bold mt-1">
              {calc.level.label}
            </p>
            <p className="text-white/70 text-[11px] mt-1">
              میانگین همه مضامین ({toFaNum(calc.status.total)} مضمون)
            </p>
          </div>
        </div>
      </div>

      {/* ۳ کارت آمار */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatBox
          icon={TrendingUp}
          label="معدل"
          value={toFaNum(calc.avg.toFixed(2))}
          color="brand"
        />
        <StatBox
          icon={Trophy}
          label="رتبه در صنف"
          value={toFaNum(calc.rank)}
          sub={`از ${toFaNum(calc.classSize)}`}
          color="gold"
        />
        <StatBox
          icon={calc.status.failed > 0 ? XCircle : CheckCircle2}
          label="کامیاب"
          value={`${toFaNum(calc.status.passed)}/${toFaNum(calc.status.total)}`}
          color={calc.status.failed > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* نوار پیشرفت */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-gray-700">نسبت کامیابی</p>
          <p className="text-xs font-bold fa-num text-brand-700">
            {toFaNum(passedRatio.toFixed(0))}٪
          </p>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-brand-500 to-brand-700 rounded-full transition-all duration-500"
            style={{ width: `${passedRatio}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={13} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">کامیاب</p>
              <p className="font-bold text-sm fa-num text-emerald-700">
                {toFaNum(calc.status.passed)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
              <XCircle size={13} className="text-red-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">ناکام</p>
              <p className="font-bold text-sm fa-num text-danger">
                {toFaNum(calc.status.failed)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* خلاصه کلی */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Award size={16} className="text-amber-700" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-amber-900">
              وضعیت کلی: {calc.level.label}
            </p>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              {calc.status.failed === 0
                ? 'این دانش‌آموز در همه مضامین کامیاب شده است. آفرین! 🎉'
                : `این دانش‌آموز در ${toFaNum(
                    calc.status.failed
                  )} مضمون ناکام شده است و نیاز به تلاش بیشتر دارد.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   کارت آمار کوچک
   ═══════════════════════════════════════ */
function StatBox({ icon: Icon, label, value, sub, color = 'brand' }) {
  const colors = {
    brand: {
      card: 'bg-brand-50 border-brand-100',
      icon: 'bg-white text-brand-700',
      text: 'text-brand-800',
    },
    gold: {
      card: 'bg-gold-50 border-gold-100',
      icon: 'bg-white text-gold-600',
      text: 'text-gold-800',
    },
    success: {
      card: 'bg-emerald-50 border-emerald-100',
      icon: 'bg-white text-emerald-600',
      text: 'text-emerald-800',
    },
    warning: {
      card: 'bg-orange-50 border-orange-100',
      icon: 'bg-white text-orange-600',
      text: 'text-orange-800',
    },
  }
  const s = colors[color] || colors.brand

  return (
    <div className={`rounded-2xl border ${s.card} p-3`}>
      <div
        className={`w-8 h-8 rounded-lg ${s.icon} flex items-center justify-center mb-2 shadow-sm`}
      >
        <Icon size={14} />
      </div>
      <p className="text-[10px] text-gray-500">{label}</p>
      <p
        className={`text-base sm:text-lg font-bold ${s.text} fa-num leading-tight mt-0.5`}
      >
        {value}
      </p>
      {sub && <p className="text-[9px] text-gray-500 mt-0.5 fa-num">{sub}</p>}
    </div>
  )
}