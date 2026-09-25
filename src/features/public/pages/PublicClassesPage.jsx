import { useState } from 'react'
import { School, BookOpen, Users } from 'lucide-react'
import { useClasses } from '../../classes/useClasses'
import { useSubjects } from '../../subjects/useSubjects'
import { toFaNum } from '../../../utils/number'

export default function PublicClassesPage() {
  const [selectedGrade, setSelectedGrade] = useState(null)
  const { data: classes, isLoading } = useClasses()

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-700">
          صنوف و مضامین
        </h1>
        <p className="text-gray-500 mt-2">
          صنوف مکتب و مضامینی که در هر صنف تدریس می‌شود
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="spinner text-brand-700 mx-auto" style={{ width: 28, height: 28 }} />
        </div>
      ) : !classes || classes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <School size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">اطلاعات صنوف هنوز ثبت نشده</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {classes
            .slice()
            .sort((a, b) => a.grade - b.grade)
            .map((c) => (
              <button
                key={c.id}
                onClick={() =>
                  setSelectedGrade(selectedGrade === c.grade ? null : c.grade)
                }
                className={`p-5 rounded-2xl border text-center transition ${
                  selectedGrade === c.grade
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                    : 'border-gray-200 bg-white hover:border-brand-300'
                }`}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
                  <span className="font-bold text-2xl fa-num">
                    {toFaNum(c.grade)}
                  </span>
                </div>
                <p className="font-bold text-gray-900">
                  صنف {toFaNum(c.grade)}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                  <Users size={11} />
                  <span className="fa-num">{toFaNum(c.capacity)}</span>
                  <span>ظرفیت</span>
                </p>
              </button>
            ))}
        </div>
      )}

      {selectedGrade && (
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-brand-700" />
            مضامین صنف {toFaNum(selectedGrade)}
          </h2>
          <SubjectList grade={selectedGrade} />
        </div>
      )}
    </div>
  )
}

function SubjectList({ grade }) {
  const { data: subjects, isLoading } = useSubjects(grade)

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="spinner text-brand-700 mx-auto" />
      </div>
    )
  }

  if (!subjects || subjects.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500 py-6">
        مضامینی برای این صنف ثبت نشده
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {subjects.map((s) => (
        <div
          key={s.id}
          className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100"
        >
          <p className="font-medium text-sm text-gray-900">{s.name}</p>
          {s.code && (
            <p className="text-[10px] text-gray-400 font-mono mt-0.5" dir="ltr">
              {s.code}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}