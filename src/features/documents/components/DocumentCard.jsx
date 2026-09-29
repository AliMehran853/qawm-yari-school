import { Pencil, Trash2, FileText, Download } from 'lucide-react'
import { toFaNum } from '../../../utils/number'

const CATEGORY_STYLE = {
  book: { label: 'کتاب', color: 'badge-brand' },
  jozve: { label: 'جزوه', color: 'badge-info' },
  form: { label: 'فرم', color: 'badge-warning' },
  guide: { label: 'راهنما', color: 'badge-gray' },
  other: { label: 'سایر', color: 'badge-gray' },
}

const FILE_TYPE_COLOR = {
  pdf: 'text-red-600 bg-red-50',
  doc: 'text-blue-600 bg-blue-50',
  image: 'text-purple-600 bg-purple-50',
  other: 'text-gray-600 bg-gray-50',
}

const FILE_TYPE_LABEL = {
  pdf: 'PDF',
  doc: 'DOC',
  image: 'IMG',
  other: '—',
}

export default function DocumentCard({
  doc,
  onEdit,
  onDelete,
  canManage = true,
}) {
  const cat = CATEGORY_STYLE[doc.category] || CATEGORY_STYLE.other
  const fileColor = FILE_TYPE_COLOR[doc.file_type] || FILE_TYPE_COLOR.other

  return (
    <div className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-card transition">
      <div className="flex items-start gap-3">
        {/* آیکن فایل */}
        <div
          className={`w-12 h-12 rounded-xl ${fileColor} flex items-center justify-center shrink-0`}
        >
          <FileText size={22} />
        </div>

        <div className="flex-1 min-w-0">
          {/* عنوان + دسته */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`badge ${cat.color} text-[10px]`}>{cat.label}</span>
            {doc.grade && (
              <span className="badge badge-gray text-[10px] fa-num">
                صنف {toFaNum(doc.grade)}
              </span>
            )}
            <span className="text-[10px] text-gray-400 font-mono">
              {FILE_TYPE_LABEL[doc.file_type]}
            </span>
          </div>

          {/* عنوان */}
          <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">
            {doc.title}
          </h3>

          {/* توضیحات */}
          {doc.description && (
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
              {doc.description}
            </p>
          )}

          {/* دکمه دانلود */}
          <a
            href={doc.file_url}
            download
            className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-white bg-gradient-to-l from-brand-600 to-brand-800 hover:from-brand-700 hover:to-brand-900 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <Download size={14} />
            <span>دانلود</span>
          </a>
        </div>

        {/* دکمه‌های مدیریت */}
        {canManage && (
          <div className="flex flex-col gap-1 shrink-0">
            <button
              onClick={() => onEdit(doc)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              aria-label="ویرایش"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete(doc)}
              className="p-2 text-danger hover:bg-red-50 rounded-lg transition"
              aria-label="حذف"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}