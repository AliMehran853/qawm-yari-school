import { useState, useMemo } from 'react'
import { Plus, FileText, Search, X, BookOpen } from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import DocumentForm from '../components/DocumentForm'
import DocumentList from '../components/DocumentList'
import {
  useDocuments,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
} from '../useDocuments'
import { toFaNum } from '../../../utils/number'

const CATEGORIES = [
  { value: null, label: 'همه' },
  { value: 'book', label: 'کتاب' },
  { value: 'jozve', label: 'جزوه' },
  { value: 'form', label: 'فرم' },
  { value: 'guide', label: 'راهنما' },
  { value: 'other', label: 'سایر' },
]

export default function DocumentsPage() {
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [gradeFilter, setGradeFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data: documents, isLoading } = useDocuments({
    category: categoryFilter,
    grade: gradeFilter,
  })
  const createMut = useCreateDocument()
  const updateMut = useUpdateDocument()
  const deleteMut = useDeleteDocument()

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
    if (gradeFilter !== null) return null

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

    const sortedGrades = Object.keys(groups)
      .map(Number)
      .sort((a, b) => a - b)

    return {
      grades: sortedGrades.map((g) => ({ grade: g, items: groups[g] })),
      noGrade,
    }
  }, [filtered, gradeFilter])

  function handleAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(doc) {
    setEditing(doc)
    setFormOpen(true)
  }

  async function handleSubmit(values) {
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, updates: values })
    } else {
      await createMut.mutateAsync(values)
    }
    setFormOpen(false)
  }

  async function handleDelete(doc) {
    if (!confirm(`سند «${doc.title}» حذف شود؟`)) return
    try {
      await deleteMut.mutateAsync(doc.id)
    } catch (e) {}
  }

  return (
    <PageWrapper>
      {/* ═══ هدر ═══ */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
            اسناد و کتابخانه
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            کتاب‌ها، جزوه‌ها و فایل‌های مکتب
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0" aria-label="افزودن سند">
          <Plus size={18} />
          <span className="hidden sm:inline">افزودن سند</span>
        </Button>
      </div>

      {/* ═══ جستجو ═══ */}
      {documents?.length > 0 && (
        <div className="relative mb-3">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی عنوان یا توضیحات..."
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
      )}

      {/* ═══ فیلتر دسته ═══ */}
      <div className="mb-3 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.value || 'all'}
              onClick={() => setCategoryFilter(c.value)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition ${
                categoryFilter === c.value
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ فیلتر صنف ═══ */}
      <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          <button
            onClick={() => setGradeFilter(null)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition ${
              gradeFilter === null
                ? 'bg-gold-500 text-white'
                : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            همه صنوف
          </button>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition fa-num ${
                gradeFilter === g
                  ? 'bg-gold-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {toFaNum(g)}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ محتوا ═══ */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div
            className="spinner text-brand-700 mx-auto"
            style={{ width: 28, height: 28 }}
          />
          <p className="text-sm text-gray-500 mt-3">در حال بارگذاری...</p>
        </div>
      ) : documents?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <EmptyState
            icon={FileText}
            title="هنوز سندی اضافه نشده"
            description="برای شروع، اولین سند را اضافه کن"
            action={
              <Button onClick={handleAdd}>
                <Plus size={18} />
                <span>افزودن سند</span>
              </Button>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <EmptyState
            icon={Search}
            title="نتیجه‌ای پیدا نشد"
            description={`هیچ سندی با «${search}» مطابقت ندارد`}
          />
        </div>
      ) : grouped ? (
        /* ═══ حالت «همه صنوف» — گروه‌بندی ═══ */
        <div className="space-y-1">
          {grouped.grades.map((g, idx) => (
            <div key={g.grade}>
              {idx > 0 && <GradeDivider />}
              <GradeHeader grade={g.grade} count={g.items.length} />

              <DocumentList
                documents={g.items}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}

          {/* اسناد بدون صنف */}
          {grouped.noGrade.length > 0 && (
            <div>
              {grouped.grades.length > 0 && <GradeDivider />}
              <GradeHeader general count={grouped.noGrade.length} />
              <DocumentList
                documents={grouped.noGrade}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      ) : (
        /* ═══ حالت فیلتر صنف — نمایش معمولی ═══ */
        <DocumentList
          documents={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* ═══ تعداد ═══ */}
      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-5">
          {toFaNum(filtered.length)} سند
          {search && documents.length !== filtered.length && (
            <> از {toFaNum(documents.length)}</>
          )}
        </p>
      )}

      {/* ═══ فرم ═══ */}
      <DocumentForm
        open={formOpen}
        doc={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════
   جداکننده بین گروه‌ها
   ═══════════════════════════════════════ */
function GradeDivider() {
  return (
    <div className="relative py-4 sm:py-5">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-full border-t-2 border-dashed border-gray-200" />
      </div>

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
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-md shrink-0">
          <BookOpen size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base sm:text-lg text-gray-900">
            اسناد عمومی
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">برای همه صنوف</p>
        </div>
        {count !== undefined && (
          <span className="badge badge-gray text-[11px] fa-num shrink-0">
            {toFaNum(count)} سند
          </span>
        )}
      </div>
    )
  }

  const isLower = grade <= 3
  const isMiddle = grade >= 4 && grade <= 6
  const isUpper = grade >= 7 && grade <= 9

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
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md shrink-0`}
      >
        <span className="text-white font-bold text-lg fa-num">
          {toFaNum(grade)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-bold text-base sm:text-lg text-gray-900">
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

      {count !== undefined && (
        <span className="badge badge-gray text-[11px] fa-num shrink-0">
          {toFaNum(count)} سند
        </span>
      )}
    </div>
  )
}