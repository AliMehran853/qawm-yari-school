import { cn } from '../../utils/cn'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3.5 py-2.5 border rounded-lg bg-white',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
          'placeholder:text-gray-400',
          error ? 'border-danger' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  )
}