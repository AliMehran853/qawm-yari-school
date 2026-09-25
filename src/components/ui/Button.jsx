import { cn } from '../../utils/cn'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

const sizeClass = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  skipOfflineCheck = false,
  ...props
}) {
  const isOnline = useOnlineStatus()

  // اگر آفلاین است و دکمه "عملیات نوشتنی" است → disabled
  const isDisabled = disabled || (!skipOfflineCheck && !isOnline)

  return (
    <button
      className={cn('btn', variantClass[variant], sizeClass[size], className)}
      disabled={isDisabled}
      title={!isOnline && !skipOfflineCheck ? 'در حالت آفلاین غیرفعال است' : undefined}
      {...props}
    >
      {children}
    </button>
  )
}