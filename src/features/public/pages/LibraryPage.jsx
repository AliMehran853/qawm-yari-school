import { useState, useMemo } from 'react'
import { FileText, Search, X, Download, BookOpen } from 'lucide-react'
import { useDocuments } from '../../documents/useDocuments'
import { toFaNum } from '../../../utils/number'

const CATEGORIES = [
  { value: null, label: 'همه' },
  { value: 'book', label: 'کتاب' },
  { value: 'jozve', label: 'جزوه' },
  { value: 'form', label: 'فرم' },
  { value: 'guide', label: 'راهنما' },
  { value: 'other', label: 'سایر' },
]

const CATEGORY_LABEL = {
  book: 'کتاب',
  jozve: 'جزوه',
  form: 'فرم',
  guide: 'راهنما',
  other: 'سایر',
}

const CATEGORY_COLOR = {
  book: 'badge-brand',
  jozve: 'badge-info',
  form: 'badge-warning',
  guide: 'badge-gray',
  other: 'badge-gray',
}

const FILE_TYPE_LABEL = {
  pdf: 'PDF',
  doc: 'DOC',
  image: 'IMG',
  other: '—',
}

export default function LibraryPage() {
  const [category, setCategory] = useState(null)
  const [grade, setGrade] = useState(null)
  const [search, setSearch] = useState('')

  const { data: documents, isLoading } = useDocuments({ category, grade })

  const filtered = useMemo(() => {
    if (!documents) return []
    const q = search.trim().toLowerCase()
    if (!q) return documents
    return documents.filter(
      (d) =>
        d.title?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
    )
  }, [documents, search])

  // ─── گروه‌بندی بر اساس صنف (فقط وقتی فیلتر صنف نداریم) ───
  const grouped = useMemo(() => {
    // اگر فیلتر صنف فعال است، گروه‌بندی نکن
    if (grade !== null) return null

    const groups = {}
    const noGrade = []

    filtered.forEach((doc) => {
      if (doc.grade) {
        if (!groups[doc.grade]) groups[doc.grade] = []
        groups[doc.grade].push(doc)
      } else {
        noGrade.push(doc)
      }
    })

    // مرتب‌سازی صنوف
    const sortedGrades = Object.keys(groups)
      .map(Number)
      .sort((a, b) => a - b)

    return {
      grades: sortedGrades.map((g) => ({ grade: g, items: groups[g] })),
      noGrade,
    }
  }, [filtered, grade])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-700">
          کتابخانه دیجیتال
        </h1>
        <p className="text-gray-500 mt-2">
          کتاب‌ها، جزوه‌ها و منابع آموزشی مکتب
        </p>
      </div>

      {/* ─── جستجو ─── */}
      <div className="max-w-md mx-auto mb-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی سند..."
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
      </div>

      {/* ─── فیلتر دسته ─── */}
      <div className="mb-3 flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map((c) => (
          <button
            key={c.value || 'all'}
            onClick={() => setCategory(c.value)}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              category === c.value
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ─── فیلتر صنف ─── */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setGrade(null)}
          className={`px-3 py-1 rounded-full text-xs transition ${
            grade === null
              ? 'bg-gold-500 text-white'
              : 'bg-white border border-gray-200 text-gray-600'
          }`}
        >
          همه صنوف
        </button>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
          <button
            key={g}
            onClick={() => setGrade(g)}
            className={`px-3 py-1 rounded-full text-xs transition fa-num ${
              grade === g
                ? 'bg-gold-500 text-white'
                : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            {toFaNum(g)}
          </button>
        ))}
      </div>

      {/* ─── محتوا ─── */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 28, height: 28 }}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {search
              ? `هیچ سندی با «${search}» پیدا نشد`
              : 'سندی موجود نیست'}
          </p>
        </div>
      ) : grouped ? (
        /* ═══ حالت «همه» — گروه‌بندی بر اساس صنف ═══ */
        <div className="space-y-2">
          {grouped.grades.map((g, idx) => (
            <div key={g.grade}>
              {/* جداکننده بالای هر گروه (به جز اولی) */}
              {idx > 0 && <GradeDivider />}

              {/* برچسب صنف */}
              <GradeHeader grade={g.grade} count={g.items.length} />

              {/* اسناد صنف */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {g.items.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          ))}

          {/* اسناد بدون صنف */}
          {grouped.noGrade.length > 0 && (
            <div>
              {grouped.grades.length > 0 && <GradeDivider />}
              <GradeHeader general />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {grouped.noGrade.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ═══ حالت فیلتر صنف — نمایش معمولی ═══ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-6">
          {toFaNum(filtered.length)} سند
        </p>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   جداکننده بین گروه‌ها
   ═══════════════════════════════════════ */
function GradeDivider() {
  return (
    <div className="relative py-5 sm:py-6">
      {/* خط افقی */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-full border-t-2 border-dashed border-gray-200" />
      </div>

      {/* نقطه وسط */}
      <div className="relative flex justify-center">
        <div className="bg-cream px-3 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-300" />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   برچسب صنف
   ═══════════════════════════════════════ */
function GradeHeader({ grade, count, general }) {
  if (general) {
    return (
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-md shrink-0">
          <BookOpen size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg sm:text-xl text-gray-900">
            اسناد عمومی
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            برای همه صنوف
          </p>
        </div>
        {count !== undefined && (
          <span className="badge badge-gray text-[11px] fa-num shrink-0">
            {toFaNum(count)} سند
          </span>
        )}
      </div>
    )
  }

  // رنگ بر اساس صنف
  const isLower = grade <= 3
  const isMiddle = grade >= 4 && grade <= 6
  const isUpper = grade >= 7 && grade <= 9
  const isHigh = grade >= 10

  const colors = isLower
    ? {
        gradient: 'from-emerald-400 to-emerald-600',
        bar: 'bg-emerald-400',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      }
    : isMiddle
    ? {
        gradient: 'from-sky-400 to-sky-600',
        bar: 'bg-sky-400',
        badge: 'bg-sky-50 text-sky-700 border-sky-200',
      }
    : isUpper
    ? {
        gradient: 'from-gold-400 to-gold-600',
        bar: 'bg-gold-400',
        badge: 'bg-gold-50 text-gold-700 border-gold-200',
      }
    : {
        gradient: 'from-brand-500 to-brand-700',
        bar: 'bg-brand-500',
        badge: 'bg-brand-50 text-brand-700 border-brand-200',
      }

  return (
    <div className="flex items-center gap-3 mb-4">
      {/* آیکن صنف */}
      <div
        className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md shrink-0`}
      >
        <span className="text-white font-bold text-lg fa-num">
          {toFaNum(grade)}
        </span>
      </div>

      {/* نام صنف */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-bold text-lg sm:text-xl text-gray-900">
            صنف {toFaNum(grade)}
          </h2>
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${colors.badge}`}
          >
            {isLower
              ? 'صنوف پایین'
              : isMiddle
              ? 'صنوف متوسطه'
              : isUpper
              ? 'صنوف بالا'
              : 'دوره لیسه'}
          </span>
        </div>
        <div className={`w-12 h-0.5 ${colors.bar} rounded-full mt-1.5`} />
      </div>

      {/* شمارش */}
      {count !== undefined && (
        <span className="badge badge-gray text-[11px] fa-num shrink-0">
          {toFaNum(count)} سند
        </span>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   کارت سند
   ═══════════════════════════════════════ */
function DocumentCard({ doc }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
          <FileText size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span
              className={`badge ${CATEGORY_COLOR[doc.category]} text-[10px]`}
            >
              {CATEGORY_LABEL[doc.category]}
            </span>
            {doc.grade && (
              <span className="badge badge-gray text-[10px] fa-num">
                صنف {toFaNum(doc.grade)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            {FILE_TYPE_LABEL[doc.file_type]}
          </span>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 leading-snug line-clamp-2">
        {doc.title}
      </h3>

      {doc.description && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
          {doc.description}
        </p>
      )}

      <a
        href={doc.file_url}
        download
        className="mt-4 inline-flex items-center justify-center gap-2 w-full text-sm font-medium text-white bg-gradient-to-l from-brand-600 to-brand-800 hover:from-brand-700 hover:to-brand-900 px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
      >
        <Download size={16} />
        <span>دانلود</span>
      </a>
    </div>
  )
}