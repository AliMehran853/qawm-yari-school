import { useState, useMemo } from 'react'
import { Search, FileText, X } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import EmptyState from '../../../components/ui/EmptyState'
import Card from '../../../components/ui/Card'
import { useStudents } from '../../students/useStudents'
import { useReportCard, useClassAverages } from '../useGrades'
import {
  getTotal,
  isPassed,
  getLevel,
  calcAverage,
  countStatus,
  calcRank,
} from '../gradeCalculator'
import { GRADING, EXAM_ROUND_LABELS } from '../../../lib/constants'
import { toFaNum } from '../../../utils/number'

export default function ReportCardPage() {
  const [grade, setGrade] = useState(1)
  const [studentId, setStudentId] = useState(null)
  const [search, setSearch] = useState('')

  const { data: students } = useStudents({ grade, status: 'active' })
  const { data: report, isLoading } = useReportCard(studentId)
  const { data: classAvgs } = useClassAverages(grade)

  const filtered = useMemo(() => {
    if (!students) return []
    const q = search.trim().toLowerCase()
    if (!q) return students
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.father_name?.toLowerCase().includes(q) ||
        s.student_code?.toLowerCase().includes(q)
    )
  }, [students, search])

  const calc = useMemo(() => {
    if (!report) return null
    const avg = calcAverage(report.rows)
    const status = countStatus(report.rows)
    const allAvgs = classAvgs ? Object.values(classAvgs) : []
    const rank = calcRank(avg, allAvgs)
    return { avg, status, rank, classSize: allAvgs.length }
  }, [report, classAvgs])

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
          کارنامه
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          مشاهده کارنامه هر دانش‌آموز
        </p>
      </div>

      {/* ─── انتخاب صنف ─── */}
      <div className="mb-3 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
            <button
              key={g}
              onClick={() => {
                setGrade(g)
                setStudentId(null)
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition ${
                grade === g
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
              }`}
            >
              صنف {toFaNum(g)}
            </button>
          ))}
        </div>
      </div>

      {/* ─── انتخاب دانش‌آموز ─── */}
      {students && students.length > 0 && (
        <>
          <div className="relative mb-3">
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی دانش‌آموز..."
              className="input pr-10 pl-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                aria-label="پاک کردن"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
            <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStudentId(s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition ${
                    studentId === s.id
                      ? 'bg-brand-100 text-brand-700 font-medium border-2 border-brand-500'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ─── کارنامه ─── */}
      {!studentId ? (
        <Card flat className="p-6">
          <EmptyState
            icon={FileText}
            title="یک دانش‌آموز انتخاب کن"
            description="برای دیدن کارنامه، دانش‌آموز را انتخاب کن"
          />
        </Card>
      ) : isLoading ? (
        <Card flat className="py-16 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 28, height: 28 }}
          />
          <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
        </Card>
      ) : report ? (
        <ReportCardView report={report} calc={calc} />
      ) : null}
    </PageWrapper>
  )
}

function ReportCardView({ report, calc }) {
  const { student, rows } = report

  return (
    <div className="space-y-4">
      {/* ─── اطلاعات دانش‌آموز ─── */}
      <Card className="bg-gradient-to-l from-brand-50 to-white border-brand-100">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 overflow-hidden">
            {student.photo_url ? (
              <img
                src={student.photo_url}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-bold text-2xl">
                {student.name?.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg text-brand-700">{student.name}</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              ولد {student.father_name || '—'}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
              <span>صنف {toFaNum(student.grade)}</span>
              {student.student_code && (
                <span className="font-mono" dir="ltr">
                  {student.student_code}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* ─── خلاصه ─── */}
      {calc && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatBox
            label="معدل کل"
            value={calc.avg.toFixed(2)}
            color="brand"
          />
          <StatBox
            label="رتبه در صنف"
            value={calc.rank}
            sub={`از ${calc.classSize}`}
            color="gold"
          />
          <StatBox
            label="مضامین کامیاب"
            value={calc.status.passed}
            sub={`از ${calc.status.total}`}
            color="success"
          />
          <StatBox
            label="مضامین ناکام"
            value={calc.status.failed}
            color={calc.status.failed > 0 ? 'danger' : 'gray'}
          />
        </div>
      )}

      {/* ─── جدول نمرات ─── */}
      <Card flat className="overflow-hidden p-0">
        {/* موبایل */}
        <div className="lg:hidden divide-y divide-gray-100">
          {rows.map((r) => {
            const total = getTotal(r.first_score, r.final_score)
            const passed = isPassed(total)
            const level = getLevel(total)
            return (
              <div key={r.subject.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{r.subject.name}</h3>
                  <span
                    className={`badge ${
                      passed ? 'badge-success' : 'badge-danger'
                    }`}
                  >
                    {level.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-gray-50 rounded-lg py-2">
                    <p className="text-[10px] text-gray-500 mb-0.5">دور اول</p>
                    <p className="font-bold fa-num">
                      {r.first_score ?? '—'}
                      <span className="text-xs text-gray-400 font-normal">
                        /۴۰
                      </span>
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg py-2">
                    <p className="text-[10px] text-gray-500 mb-0.5">دور نهایی</p>
                    <p className="font-bold fa-num">
                      {r.final_score ?? '—'}
                      <span className="text-xs text-gray-400 font-normal">
                        /۶۰
                      </span>
                    </p>
                  </div>
                  <div
                    className={`rounded-lg py-2 ${
                      passed ? 'bg-brand-50 text-brand-700' : 'bg-red-50 text-danger'
                    }`}
                  >
                    <p className="text-[10px] opacity-70 mb-0.5">مجموع</p>
                    <p className="font-bold fa-num">
                      {r.first_score === null && r.final_score === null
                        ? '—'
                        : toFaNum(total.toFixed(0))}
                      <span className="text-xs font-normal opacity-60">
                        /۱۰۰
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* دسکتاپ */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>مضمون</th>
                <th className="text-center">دور اول (۴۰)</th>
                <th className="text-center">دور نهایی (۶۰)</th>
                <th className="text-center">مجموع (۱۰۰)</th>
                <th className="text-center">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const total = getTotal(r.first_score, r.final_score)
                const passed = isPassed(total)
                const level = getLevel(total)
                const empty =
                  r.first_score === null && r.final_score === null
                return (
                  <tr key={r.subject.id}>
                    <td className="font-medium text-gray-900">
                      {r.subject.name}
                    </td>
                    <td className="text-center fa-num">
                      {r.first_score ?? '—'}
                    </td>
                    <td className="text-center fa-num">
                      {r.final_score ?? '—'}
                    </td>
                    <td className="text-center font-bold fa-num">
                      {empty ? '—' : toFaNum(total.toFixed(0))}
                    </td>
                    <td className="text-center">
                      {empty ? (
                        <span className="badge badge-gray">ثبت نشده</span>
                      ) : (
                        <span
                          className={`badge ${
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
      </Card>
    </div>
  )
}

function StatBox({ label, value, sub, color = 'gray' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-700 border-brand-100',
    gold: 'bg-gold-50 text-gold-700 border-gold-100',
    success: 'bg-green-50 text-green-700 border-green-100',
    danger: 'bg-red-50 text-red-700 border-red-100',
    gray: 'bg-gray-50 text-gray-700 border-gray-100',
  }
  return (
    <div className={`rounded-xl border p-3 sm:p-4 ${colors[color]}`}>
      <p className="text-[11px] sm:text-xs opacity-80">{label}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1 fa-num">
        {toFaNum(value)}
        {sub && (
          <span className="text-xs font-normal opacity-60 mr-1">
            {sub}
          </span>
        )}
      </p>
    </div>
  )
}