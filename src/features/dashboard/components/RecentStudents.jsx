import { Link } from 'react-router-dom'
import { GraduationCap, ArrowLeft, User } from 'lucide-react'
import { toFaNum } from '../../../utils/number'

export default function RecentStudents({ students }) {
  if (!students || students.length === 0) {
    return (
      <div className="text-center py-6">
        <GraduationCap size={32} className="mx-auto text-gray-300 mb-2" />
        <p className="text-sm text-gray-500">هنوز شاگردی ثبت نشده</p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {students.map((s) => (
        <div
          key={s.id}
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition border border-gray-100"
        >
          {/* عکس */}
          <div className="w-10 h-10 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center shrink-0 overflow-hidden border border-gold-100">
            {s.photo_url ? (
              <img
                src={s.photo_url}
                alt={s.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="font-bold text-sm">
                {s.name?.charAt(0) || '؟'}
              </span>
            )}
          </div>

          {/* اطلاعات */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-sm text-gray-900 truncate">
                {s.name}
              </p>
              <span className="badge badge-brand text-[9px] shrink-0 fa-num">
                صنف {toFaNum(s.grade)}
              </span>
            </div>
            {s.father_name && (
              <p className="text-[11px] text-gray-500 truncate mt-0.5">
                ولد {s.father_name}
                {s.grandfather_name && ` ولد ${s.grandfather_name}`}
              </p>
            )}
          </div>
        </div>
      ))}

      <Link
        to="/panel/students"
        className="flex items-center justify-center gap-1.5 text-xs text-brand-700 hover:text-brand-800 font-medium pt-2"
      >
        <span>مشاهده همه دانش‌آموزان</span>
        <ArrowLeft size={13} />
      </Link>
    </div>
  )
}