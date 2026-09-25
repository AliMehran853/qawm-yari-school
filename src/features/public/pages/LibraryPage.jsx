import { useState, useMemo } from 'react'
import { FileText, Search, X, Download, ExternalLink } from 'lucide-react'
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
          <div className="spinner text-brand-700 mx-auto" style={{ width: 28, height: 28 }} />
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-card transition"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                  <FileText size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className={`badge ${CATEGORY_COLOR[doc.category]} text-[10px]`}>
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

              <div className="flex items-center gap-2 mt-4">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-2 rounded-lg transition"
                >
                  <ExternalLink size={13} />
                  <span>مشاهده</span>
                </a>
                <a
                  href={doc.file_url}
                  download
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition"
                >
                  <Download size={13} />
                </a>
              </div>
            </div>
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