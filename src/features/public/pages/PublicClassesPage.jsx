import { useState, Fragment } from 'react'
import {
  School,
  BookOpen,
  Users,
  ChevronDown,
  X,
} from 'lucide-react'

import { useClasses } from '../../classes/useClasses'
import { useAssignments } from '../../assignments/useAssignments'
import { toFaNum } from '../../../utils/number'

export default function PublicClassesPage() {
  const [selected, setSelected] = useState(null)
  const { data: classes, isLoading } = useClasses()

  function toggle(grade) {
    setSelected((prev) => (prev === grade ? null : grade))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
      {/* ─── هدر ─── */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-700">
          صنوف و مضامین
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          روی هر صنف کلیک کن تا مضامین و معلم‌هایش را ببینی
        </p>
      </div>

      {/* ─── محتوا ─── */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 28, height: 28 }}
          />
          <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
        </div>
      ) : !classes || classes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <School size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">اطلاعات صنوف هنوز ثبت نشده</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 grid-flow-row-dense">
          {[...classes]
            .sort((a, b) => a.grade - b.grade)
            .map((c) => (
              <Fragment key={c.id}>
                <GradeCard
                  grade={c.grade}
                  capacity={c.capacity}
                  isOpen={selected === c.grade}
                  onClick={() => toggle(c.grade)}
                />

                {selected === c.grade && (
                  <div className="col-span-full">
                    <SubjectsPanel
                      grade={c.grade}
                      onClose={() => setSelected(null)}
                    />
                  </div>
                )}
              </Fragment>
            ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   کارت صنف
   ═══════════════════════════════════════ */
function GradeCard({ grade, capacity, isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative p-4 sm:p-5 rounded-2xl border-2 text-center transition-all duration-300 hover:-translate-y-1 ${
        isOpen
          ? 'border-brand-500 bg-gradient-to-br from-brand-50 to-brand-100 shadow-lg shadow-brand-200/50'
          : 'border-gray-200 bg-white hover:border-brand-300 hover:shadow-md'
      }`}
      aria-expanded={isOpen}
    >
      {/* آیکن شماره */}
      <div
        className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${
          isOpen
            ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md scale-105'
            : 'bg-brand-50 text-brand-700'
        }`}
      >
        <span className="font-bold text-2xl fa-num">{toFaNum(grade)}</span>
      </div>

      {/* عنوان */}
      <p
        className={`font-bold text-sm sm:text-base ${
          isOpen ? 'text-brand-800' : 'text-gray-900'
        }`}
      >
        صنف {toFaNum(grade)}
      </p>

      {/* ظرفیت */}
      <p
        className={`text-[11px] mt-1 flex items-center justify-center gap-1 ${
          isOpen ? 'text-brand-700/80' : 'text-gray-500'
        }`}
      >
        <Users size={11} />
        <span className="fa-num">{toFaNum(capacity)}</span>
        <span>ظرفیت</span>
      </p>

      {/* نشانگر باز بودن */}
      {isOpen && (
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center shadow-lg">
          <ChevronDown size={13} className="text-white rotate-180" />
        </div>
      )}
    </button>
  )
}

/* ═══════════════════════════════════════
   پنل مضامین (باز شده زیر صنف)
   ═══════════════════════════════════════ */
function SubjectsPanel({ grade, onClose }) {
  const { data: items, isLoading } = useAssignments(grade)

  const total = items?.length || 0
  const assignedCount = items?.filter((i) => i.teacher).length || 0

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-200 shadow-xl p-4 sm:p-6 animate-slide-up">
      {/* ─── هدر پنل ─── */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shrink-0">
            <BookOpen size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm sm:text-base text-gray-900 truncate">
              مضامین صنف {toFaNum(grade)}
            </h2>
            {total > 0 && (
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                <span className="fa-num">{toFaNum(assignedCount)}</span>
                {' از '}
                <span className="fa-num">{toFaNum(total)}</span>
                {' مضمون معلم دارد'}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 shrink-0 transition"
          aria-label="بستن"
        >
          <X size={18} />
        </button>
      </div>

      {/* ─── محتوا ─── */}
      {isLoading ? (
        <div className="py-8 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 24, height: 24 }}
          />
          <p className="text-xs text-gray-500 mt-2">در حال بارگذاری...</p>
        </div>
      ) : !items || items.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-6">
          مضامینی برای این صنف ثبت نشده
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {items.map(({ subject, teacher }) => (
            <SubjectItem
              key={subject.id}
              subject={subject}
              teacher={teacher}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   آیتم مضمون
   ═══════════════════════════════════════ */
function SubjectItem({ subject, teacher }) {
  return (
    <div className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 hover:border-brand-200 transition-all duration-200">
      {/* آیکن مضمون */}
      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-brand-300 group-hover:bg-white transition">
        <BookOpen size={15} className="text-brand-600" />
      </div>

      {/* نام + کد مضمون */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 truncate">
          {subject.name}
        </p>
        {subject.code && (
          <p
            className="text-[10px] text-gray-400 font-mono mt-0.5"
            dir="ltr"
          >
            {subject.code}
          </p>
        )}
      </div>

      {/* معلم */}
      {teacher ? (
        <div className="flex items-center gap-1.5 shrink-0 max-w-[45%]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {teacher.photo_url ? (
              <img
                src={teacher.photo_url}
                alt={teacher.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-[10px] font-bold text-white">
                {teacher.name?.charAt(0)}
              </span>
            )}
          </div>
          <span className="text-[11px] text-gray-600 truncate">
            {teacher.name}
          </span>
        </div>
      ) : (
        <span className="badge badge-warning text-[10px] shrink-0">
          بدون معلم
        </span>
      )}
    </div>
  )
}