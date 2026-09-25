import { useState, useEffect, useMemo } from 'react'
import { Save, CalendarCheck, CheckCheck } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns-jalali'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import Card from '../../../components/ui/Card'
import DatePicker from '../components/DatePicker'
import AttendanceRow from '../components/AttendanceRow'
import {
  useAttendanceByClassDate,
  useRecentDates,
  useSaveAttendance,
} from '../useAttendance'
import { toFaNum } from '../../../utils/number'

export default function AttendanceEntryPage() {
  const today = format(new Date(), 'yyyy/MM/dd')
  const [grade, setGrade] = useState(1)
  const [date, setDate] = useState(today)
  const [items, setItems] = useState([])

  const isValidDate = /^\d{4}\/\d{2}\/\d{2}$/.test(date)

  const { data: fetched, isLoading } = useAttendanceByClassDate(
    grade,
    isValidDate ? date : null
  )
  const { data: recentDates } = useRecentDates(grade)
  const saveMut = useSaveAttendance()

  // وقتی داده‌ها آمد، به state محلی بریز
  useEffect(() => {
    if (fetched) setItems(fetched)
  }, [fetched])

  // وقتی صنف عوض شد، تاریخ را به امروز برگردان
  useEffect(() => {
    setDate(today)
  }, [grade])

  const stats = useMemo(() => {
    const s = { present: 0, absent: 0, late: 0, excused: 0, total: items.length }
    items.forEach((i) => {
      s[i.status] = (s[i.status] || 0) + 1
    })
    return s
  }, [items])

  function handleChange(studentId, field, value) {
    setItems((prev) =>
      prev.map((i) =>
        i.student.id === studentId ? { ...i, [field]: value } : i
      )
    )
  }

  function setAllPresent() {
    setItems((prev) =>
      prev.map((i) => ({ ...i, status: 'present', note: '' }))
    )
  }

  async function handleSave() {
    if (!isValidDate) {
      toast.error('تاریخ درست نیست')
      return
    }
    if (items.length === 0) {
      toast.error('دانش‌آموزی برای این صنف نیست')
      return
    }

    const records = items.map((i) => ({
      student_id: i.student.id,
      status: i.status,
      note: i.note,
    }))

    await saveMut.mutateAsync({ grade, date, records })
  }

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
          حضور و غیاب
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          ثبت حضور روزانه دانش‌آموزان
        </p>
      </div>

      {/* ─── انتخاب صنف ─── */}
      <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
            <button
              key={g}
              onClick={() => setGrade(g)}
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

      {/* ─── تاریخ ─── */}
      <Card className="mb-4">
        <DatePicker
          value={date}
          onChange={setDate}
          recentDates={recentDates || []}
        />
      </Card>

      {/* ─── آمار و دکمه همه حاضر ─── */}
      {items.length > 0 && (
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
            <span className="badge badge-success fa-num">
              {toFaNum(stats.present)} حاضر
            </span>
            {stats.absent > 0 && (
              <span className="badge badge-danger fa-num">
                {toFaNum(stats.absent)} غایب
              </span>
            )}
            {stats.late > 0 && (
              <span className="badge badge-warning fa-num">
                {toFaNum(stats.late)} تاخیر
              </span>
            )}
            {stats.excused > 0 && (
              <span className="badge badge-info fa-num">
                {toFaNum(stats.excused)} رخصت
              </span>
            )}
          </div>

          <button
            onClick={setAllPresent}
            className="text-xs text-brand-700 hover:text-brand-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition"
          >
            <CheckCheck size={14} />
            <span>همه حاضر</span>
          </button>
        </div>
      )}

      {/* ─── کارت اصلی ─── */}
      <Card flat className="overflow-hidden p-0">
        {!isValidDate ? (
          <div className="p-6">
            <EmptyState
              icon={CalendarCheck}
              title="تاریخ را درست وارد کن"
              description="فرمت: ۱۴۰۴/۰۶/۱۵ — یا روی «امروز» بزن"
            />
          </div>
        ) : isLoading ? (
          <div className="py-16 text-center">
            <div
              className="spinner text-brand-700 mx-auto"
              style={{ width: 28, height: 28 }}
            />
            <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={CalendarCheck}
              title="دانش‌آموزی در این صنف نیست"
              description="اول برای این صنف دانش‌آموز ثبت کن"
            />
          </div>
        ) : (
          <div>
            {items.map((item, idx) => (
              <AttendanceRow
                key={item.student.id}
                item={item}
                index={idx}
                onChange={handleChange}
              />
            ))}
          </div>
        )}
      </Card>

      {/* ─── دکمه ذخیره ─── */}
      {items.length > 0 && isValidDate && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500 fa-num">
            {toFaNum(items.length)} دانش‌آموز
          </p>
          <Button onClick={handleSave} disabled={saveMut.isPending} size="lg">
            <Save size={18} />
            <span>{saveMut.isPending ? 'در حال ذخیره...' : 'ذخیره'}</span>
          </Button>
        </div>
      )}
    </PageWrapper>
  )
}