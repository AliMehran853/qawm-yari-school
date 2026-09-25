import { toFaNum } from '../../../utils/number'

const COLORS = {
  brand: {
    bg: 'bg-brand-50',
    text: 'text-brand-700',
    border: 'border-brand-100',
    iconBg: 'bg-brand-100',
  },
  gold: {
    bg: 'bg-gold-50',
    text: 'text-gold-700',
    border: 'border-gold-100',
    iconBg: 'bg-gold-100',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100',
  },
}

export default function StatCard({ title, value, icon: Icon, color = 'brand' }) {
  const c = COLORS[color] || COLORS.brand
  return (
    <div
      className={`rounded-2xl border ${c.border} ${c.bg} p-4 sm:p-5 transition hover:shadow-card`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={`text-xs sm:text-sm ${c.text} opacity-80 font-medium`}>
            {title}
          </p>
          <p className={`text-2xl sm:text-3xl font-bold mt-1.5 ${c.text} fa-num`}>
            {toFaNum(value)}
          </p>
        </div>
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${c.iconBg} ${c.text} flex items-center justify-center shrink-0`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}