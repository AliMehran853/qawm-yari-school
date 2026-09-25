import { useState, useMemo } from 'react'
import { Search, CalendarCheck, X } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import EmptyState from '../../../components/ui/EmptyState'
import Card from '../../../components/ui/Card'
import { useStudents } from '../../students/useStudents'
import {
  useStudentAttendanceReport,
  useClassAttendanceStats,
} from '../useAttendance'
import { ATTENDANCE_LABELS } from '../../../lib/constants'
import { toFaNum } from '../../../utils/number'

const STATUS_BADGE = {
  present: 'badge-success',
  absent: 'badge-danger',
  late: 'badge-warning',
  excused: 'badge-info',
}

export default function AttendanceReportPage() {
  const [grade, setGrade] = useState(1)
  const [studentId, setStudentId] = useState(null)
  const [search, setSearch] = useState('')

  const { data: students } = useStudents({ grade, status: 'active' })
  const { data: report, isLoading } = useStudentAttendanceReport(studentId)
  const { data: stats } = useClassAttendanceStats(grade)

  const filtered = useMemo(() => {
    if (!students) return []
    const q = search.trim().toLowerCase()
    if (!q) return students
    return students.filter((s) => s.name?.toLowerCase().includes(q))
  }, [students, search])

  const studentStats = useMemo(() => {
    if (!report) return null
    const s = { present: 0, absent: 0, late: 0, excused: 0, total: report.length }
    report.forEach((r) => {
      s[r.status] = (s[r.status] || 0) + 1
    })
    return s
  }, [report])

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
          گزارش حضور
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          مشاهده تاریخچه و آمار حضور
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

      {/* ─── آمار کل صنف ─── */}
      {stats && stats.total > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
          <StatBox label="حاضر" value={stats.present} color="success" />
          <StatBox label="غایب" value={stats.absent} color="danger" />
          <StatBox label="تاخیر" value={stats.late} color="warning" />
          <StatBox label="رخصت" value={stats.excused} color="info" />
        </div>
      )}

      {/* ─── انتخاب شاگرد ─── */}
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

      {/* ─── گزارش ─── */}
      {!studentId ? (
        <Card flat className="p-6">
          <EmptyState
            icon={CalendarCheck}
            title="یک دانش‌آموز انتخاب کن"
            description="برای دیدن تاریخچه حضور، دانش‌آموز را انتخاب کن"
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
      ) : !report || report.length === 0 ? (
        <Card flat className="p-6">
          <EmptyState
            icon={CalendarCheck}
            title="حضوری ثبت نشده"
            description="برای این دانش‌آموز هیچ حضور و غیابی ثبت نشده است"
          />
        </Card>
      ) : (
        <>
          {/* آمار شاگرد */}
          {studentStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
              <StatBox label="حاضر" value={studentStats.present} color="success" />
              <StatBox label="غایب" value={studentStats.absent} color="danger" />
              <StatBox label="تاخیر" value={studentStats.late} color="warning" />
              <StatBox label="رخصت" value={studentStats.excused} color="info" />
            </div>
          )}

          {/* لیست */}
          <Card flat className="overflow-hidden p-0">
            <div className="divide-y divide-gray-100">
              {report.map((r) => (
                <div
                  key={r.id}
                  className="p-3 sm:p-4 flex items-center gap-3"
                >
                  <span className="font-mono text-xs sm:text-sm text-gray-500 fa-num shrink-0">
                    {r.date}
                  </span>
                  <span className={`badge ${STATUS_BADGE[r.status]}`}>
                    {ATTENDANCE_LABELS[r.status]}
                  </span>
                  {r.note && (
                    <span className="text-xs text-gray-500 truncate">
                      — {r.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <p className="text-xs text-gray-400 text-center mt-4">
            {toFaNum(report.length)} رکورد
          </p>
        </>
      )}
    </PageWrapper>
  )
}

function StatBox({ label, value, color }) {
  const colors = {
    success: 'bg-green-50 text-green-700 border-green-100',
    danger: 'bg-red-50 text-red-700 border-red-100',
    warning: 'bg-orange-50 text-orange-700 border-orange-100',
    info: 'bg-blue-50 text-blue-700 border-blue-100',
  }
  return (
    <div className={`rounded-xl border p-3 ${colors[color]}`}>
      <p className="text-[11px] sm:text-xs opacity-80">{label}</p>
      <p className="text-xl sm:text-2xl font-bold mt-0.5 fa-num">
        {toFaNum(value)}
      </p>
    </div>
  )
}