import { useState } from 'react'
import {
  Check,
  X as XIcon,
  Pencil,
  Trash2,
  Phone,
  User,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import Button from '../../../components/ui/Button'
import { formatJalali } from '../../../utils/date'
import { toFaNum } from '../../../utils/number'

const STATUS_STYLE = {
  pending: { label: 'در انتظار', badge: 'badge-warning' },
  approved: { label: 'تأیید شده', badge: 'badge-success' },
  rejected: { label: 'رد شده', badge: 'badge-danger' },
}

export default function RegistrationCard({
  registration: r,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  isProcessing,
}) {
  const style = STATUS_STYLE[r.status] || STATUS_STYLE.pending

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-card transition">
      {/* هدر */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center shrink-0 overflow-hidden">
          {r.photo_url ? (
            <img src={r.photo_url} alt={r.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-lg">{r.name?.charAt(0) || '؟'}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`badge ${style.badge} text-[10px]`}>{style.label}</span>
            <span className="text-[10px] text-gray-400 fa-num">
              {formatJalali(r.created_at, 'yyyy/MM/dd')}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 leading-snug">{r.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            ولد {r.father_name || '—'}
          </p>
        </div>
      </div>

      {/* اطلاعات */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        {r.dob && (
          <div className="flex items-center gap-1.5 text-gray-600">
            <Calendar size={12} className="text-gray-400" />
            <span className="fa-num">{r.dob}</span>
          </div>
        )}
        {r.phone && (
          <div className="flex items-center gap-1.5 text-gray-600" dir="ltr">
            <Phone size={12} className="text-gray-400" />
            <span className="fa-num">{r.phone}</span>
          </div>
        )}
        {r.birth_certificate_no && (
          <div className="flex items-center gap-1.5 text-gray-600">
            <User size={12} className="text-gray-400" />
            <span>تذکره: {r.birth_certificate_no}</span>
          </div>
        )}
      </div>

      {/* نمایش وضعیت تأیید */}
      {r.status === 'approved' && r.student_id && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-2 mb-3 text-xs text-green-700">
          ✓ شاگرد ثبت شد — کد شاگرد: <span className="font-mono">{r.student_id.slice(0, 8)}</span>
        </div>
      )}

      {r.status === 'rejected' && r.reject_reason && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-2 mb-3 text-xs text-red-700">
          دلیل رد: {r.reject_reason}
        </div>
      )}

      {/* دکمه‌ها */}
      <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-gray-100">
        {r.status === 'pending' && (
          <>
            <Button
              onClick={() => onApprove(r)}
              disabled={isProcessing}
              size="sm"
              className="flex-1"
            >
              <Check size={14} />
              <span>تأیید و ثبت شاگرد</span>
            </Button>
            <Button
              onClick={() => onReject(r)}
              disabled={isProcessing}
              variant="danger"
              size="sm"
            >
              <XIcon size={14} />
              <span>رد</span>
            </Button>
          </>
        )}

        <button
          onClick={() => onEdit(r)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          aria-label="ویرایش"
          title="ویرایش"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(r)}
          className="p-2 text-danger hover:bg-red-50 rounded-lg transition mr-auto"
          aria-label="حذف"
          title="حذف"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}