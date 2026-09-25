import { useState, useEffect, useMemo } from 'react'
import { Save, ClipboardList } from 'lucide-react'
import { toast } from 'sonner'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import Card from '../../../components/ui/Card'
import GradeEntryTable from '../components/GradeEntryTable'
import { useGradesByClassSubject, useSaveGrades } from '../useGrades'
import { useSubjects } from '../../subjects/useSubjects'
import { GRADING, EXAM_ROUND_LABELS } from '../../../lib/constants'
import { toFaNum } from '../../../utils/number'

export default function GradesEntryPage() {
  const [grade, setGrade] = useState(1)
  const [subjectId, setSubjectId] = useState(null)
  const [round, setRound] = useState('first')
  const [scores, setScores] = useState({})

  const { data: subjects } = useSubjects(grade)
  const { data: items, isLoading } = useGradesByClassSubject(
    grade,
    subjectId,
    round
  )
  const saveMut = useSaveGrades()

  // اگر مضمون انتخاب نشده، اولی را انتخاب کن
  useEffect(() => {
    if (subjects && subjects.length > 0 && !subjectId) {
      setSubjectId(subjects[0].id)
    }
  }, [subjects, subjectId])

  // وقتی داده‌ها آمد، form را پر کن
  useEffect(() => {
    if (items) {
      const initial = {}
      items.forEach((item) => {
        initial[item.student.id] = item.score ?? ''
      })
      setScores(initial)
    }
  }, [items])

  // اگر صنف عوض شد، مضمون را ریست کن
  useEffect(() => {
    setSubjectId(null)
  }, [grade])

  const maxScore = round === 'first' ? GRADING.firstRoundMax : GRADING.finalRoundMax

  const stats = useMemo(() => {
    if (!items || items.length === 0) return { filled: 0, total: 0 }
    let filled = 0
    items.forEach((item) => {
      const v = scores[item.student.id]
      if (v !== '' && v !== null && v !== undefined && !isNaN(Number(v))) {
        filled++
      }
    })
    return { filled, total: items.length }
  }, [items, scores])

  function handleChange(studentId, value) {
    setScores((prev) => ({ ...prev, [studentId]: value }))
  }

  async function handleSave() {
    if (!subjectId) {
      toast.error('اول مضمون را انتخاب کن')
      return
    }

    // اعتبارسنجی
    const invalid = []
    Object.entries(scores).forEach(([sid, val]) => {
      if (val === '' || val === null) return
      const n = Number(val)
      if (isNaN(n) || n < 0 || n > maxScore) {
        invalid.push(sid)
      }
    })

    if (invalid.length > 0) {
      toast.error('بعضی نمرات نامعتبر هستند')
      return
    }

    const payload = Object.entries(scores)
      .filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      .map(([student_id, score]) => ({ student_id, score: Number(score) }))

    if (payload.length === 0) {
      toast.error('هیچ نمره‌ای وارد نشده')
      return
    }

    await saveMut.mutateAsync({
      grade,
      subjectId,
      round,
      scores: payload,
    })
  }

  return (
    <PageWrapper>
      {/* ─── هدر ─── */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
          ورود نمرات
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          نمرات هر مضمون را برای صنف وارد کن
        </p>
      </div>

      {/* ─── انتخاب صنف ─── */}
      <div className="mb-3 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
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

      {/* ─── انتخاب دور ─── */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setRound('first')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition ${
            round === 'first'
              ? 'bg-gold-500 text-white'
              : 'bg-white border border-gray-200 text-gray-600'
          }`}
        >
          دور اول (از ۴۰)
        </button>
        <button
          onClick={() => setRound('final')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition ${
            round === 'final'
              ? 'bg-gold-500 text-white'
              : 'bg-white border border-gray-200 text-gray-600'
          }`}
        >
          دور نهایی (از ۶۰)
        </button>
      </div>

      {/* ─── انتخاب مضمون ─── */}
      {subjects && subjects.length > 0 && (
        <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
          <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
            {subjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSubjectId(sub.id)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition ${
                  subjectId === sub.id
                    ? 'bg-brand-100 text-brand-700 font-medium border-2 border-brand-500'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── کارت اصلی ─── */}
      <Card flat className="overflow-hidden p-0">
        {!subjectId ? (
          <div className="p-6">
            <EmptyState
              icon={ClipboardList}
              title="مضمون انتخاب کن"
              description="برای دیدن لیست شاگردان، یک مضمون انتخاب کن"
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
        ) : items?.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={ClipboardList}
              title="دانش‌آموزی در این صنف نیست"
              description="اول برای این صنف دانش‌آموز ثبت کن"
            />
          </div>
        ) : (
          <GradeEntryTable
            items={items}
            scores={scores}
            onChange={handleChange}
            maxScore={maxScore}
          />
        )}
      </Card>

      {/* ─── دکمه ذخیره (چسبیده به پایین در موبایل) ─── */}
      {items && items.length > 0 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500 fa-num">
            {toFaNum(stats.filled)} از {toFaNum(stats.total)} پر شده
          </p>
          <Button
            onClick={handleSave}
            disabled={saveMut.isPending}
            size="lg"
          >
            <Save size={18} />
            <span>{saveMut.isPending ? 'در حال ذخیره...' : 'ذخیره نمرات'}</span>
          </Button>
        </div>
      )}
    </PageWrapper>
  )
}