import { useState, useMemo } from 'react'
import { Calendar, Trash2, AlertTriangle, Settings2 } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import ScheduleGrid from '../components/ScheduleGrid'
import CellEditorModal from '../components/CellEditorModal'
import { useSchedule, useSaveCell, useClearGrade } from '../useSchedule'
import { useSubjects } from '../../subjects/useSubjects'
import { useAssignments } from '../../assignments/useAssignments'
import { useSettings, useUpdateSettings } from '../../settings/useSettings'
import { toFaNum } from '../../../utils/number'
import {
  DEFAULT_PERIOD_COUNTS,
  DEFAULT_PERIOD_TIMES,
} from '../../../lib/scheduleConstants'

export default function SchedulePage() {
  const [grade, setGrade] = useState(1)
  const [editingCell, setEditingCell] = useState(null)
  const [showConfig, setShowConfig] = useState(false)

  const { data: settings } = useSettings()
  const { data: schedule, isLoading } = useSchedule(grade)
  const { data: subjects } = useSubjects(grade)
  const { data: assignments } = useAssignments(grade)

  const saveMut = useSaveCell()
  const clearMut = useClearGrade()
  const updateSettingsMut = useUpdateSettings()

  const periodTimes = settings?.period_times || DEFAULT_PERIOD_TIMES
  const periodCounts = settings?.period_counts || DEFAULT_PERIOD_COUNTS
  const periodsCount = periodCounts[grade] || 6

  // ═══ ادغام schedule با assignments ═══
  // معلم همیشه از assignments گرفته می‌شود (منبع اصلی)
  const scheduleMap = useMemo(() => {
    const map = {}

    // ۱. ساخت lookup: subject_id → teacher (از تعیین معلم)
    const teacherBySubject = {}
    ;(assignments || []).forEach((a) => {
      if (a.subject?.id && a.teacher) {
        teacherBySubject[a.subject.id] = a.teacher
      }
    })

    // ۲. برای هر خانه برنامه، معلم را از lookup بگیر
    ;(schedule || []).forEach((item) => {
      // معلم فقط از assignments می‌آید (نه از schedules)
      const teacher = item.subject_id
        ? teacherBySubject[item.subject_id] || null
        : null

      map[`${item.grade}-${item.day}-${item.period}`] = {
        ...item,
        teacher, // ← همیشه تازه از تعیین معلم
      }
    })

    return map
  }, [schedule, assignments])

  const filledCount = (schedule || []).filter((s) => s.subject).length
  const totalCells = periodsCount * 6

  function handleCellClick(day, period, cell) {
    setEditingCell({ day, period, cell })
  }

  async function handleSaveCell(values) {
    await saveMut.mutateAsync(values)
    setEditingCell(null)
  }

  async function handleClearGrade() {
    if (
      !confirm(
        `تمام برنامه صنف ${grade} پاک شود؟\nاین عمل قابل بازگشت نیست.`
      )
    )
      return
    await clearMut.mutateAsync({ grade })
  }

  async function handleChangePeriodCount(newCount) {
    const updated = { ...periodCounts, [grade]: newCount }
    await updateSettingsMut.mutateAsync({ period_counts: updated })
  }

  return (
    <PageWrapper>
      {/* ═══ هدر ═══ */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
            تقسیم اوقات درسی
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            برنامه هفتگی صنوف — روی هر خانه کلیک کن تا مضمون انتخاب کنی
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowConfig((v) => !v)}
          className="shrink-0"
        >
          <Settings2 size={16} />
          <span className="hidden sm:inline">تنظیمات</span>
        </Button>
      </div>

      {/* ═══ تنظیمات زنگ‌ها ═══ */}
      {showConfig && (
        <Card flat className="mb-4 border-brand-200 bg-brand-50/30">
          <div className="flex items-center gap-2 mb-3">
            <Settings2 size={16} className="text-brand-700" />
            <h2 className="font-bold text-sm text-gray-900">
              تعداد زنگ‌های روزانه برای این صنف
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[3, 4, 5, 6, 7, 8].map((n) => (
              <button
                key={n}
                onClick={() => handleChangePeriodCount(n)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition fa-num ${
                  periodsCount === n
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-300'
                }`}
              >
                {toFaNum(n)} زنگ
              </button>
            ))}
          </div>
          <p className="input-hint mt-3">
            تعداد زنگ هر صنف متفاوت است — مثلاً صنف ۱ ممکن است ۴ زنگ و صنف ۱۰ ممکن است ۶ زنگ داشته باشد
          </p>
        </Card>
      )}

      {/* ═══ انتخاب صنف ═══ */}
      <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
            <button
              key={g}
              onClick={() => setGrade(g)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition fa-num ${
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

      {/* ═══ آمار ═══ */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <Calendar size={14} className="text-brand-700" />
          <span className="text-gray-600">
            برنامه صنف <span className="font-bold fa-num">{toFaNum(grade)}</span>
          </span>
          {totalCells > 0 && (
            <span className="badge badge-gray text-[10px] fa-num">
              {toFaNum(filledCount)} از {toFaNum(totalCells)}
            </span>
          )}
        </div>

        {filledCount > 0 && (
          <button
            onClick={handleClearGrade}
            disabled={clearMut.isPending}
            className="flex items-center gap-1.5 text-xs text-danger hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
          >
            <Trash2 size={13} />
            <span>پاک کردن کل برنامه</span>
          </button>
        )}
      </div>

      {/* ═══ محتوا ═══ */}
      {!subjects || subjects.length === 0 ? (
        <Card className="bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 text-sm">
                مضمونی برای این صنف ثبت نشده
              </h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                اول از بخش «مضامین»، مضمون‌های این صنف را ثبت کن. بعد اینجا می‌توانی برنامه را بچینی.
              </p>
            </div>
          </div>
        </Card>
      ) : isLoading ? (
        <div className="py-16 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 28, height: 28 }}
          />
          <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
        </div>
      ) : (
        <>
          <div className="mb-3 text-center">
            <h2 className="text-base sm:text-lg font-bold text-brand-800">
              تقسیم اوقات درسی صنف {toFaNum(grade)}
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-l from-brand-500 to-gold-500 rounded-full mx-auto mt-2" />
          </div>

          <ScheduleGrid
            grade={grade}
            periodsCount={periodsCount}
            periodTimes={periodTimes}
            scheduleMap={scheduleMap}
            onCellClick={handleCellClick}
          />
        </>
      )}

      {/* ═══ مودال ویرایش ═══ */}
      <CellEditorModal
        open={!!editingCell}
        grade={grade}
        day={editingCell?.day}
        period={editingCell?.period}
        current={editingCell?.cell}
        subjects={subjects || []}
        assignments={assignments || []}
        onSave={handleSaveCell}
        onClose={() => setEditingCell(null)}
        saving={saveMut.isPending}
      />
    </PageWrapper>
  )
}