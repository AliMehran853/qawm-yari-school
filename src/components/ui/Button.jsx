import { cn } from '../../utils/cn'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'

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
  showOfflineIcon = true,
  ...props
}) {
  const isOnline = useOnlineStatus()
  const isOffline = !isOnline && !skipOfflineCheck
  const isDisabled = disabled || isOffline

  return (
    <button
      className={cn(
        'btn',
        variantClass[variant],
        sizeClass[size],
        isOffline && 'btn-offline',
        className
      )}
      disabled={isDisabled}
      title={isOffline ? 'در حالت آفلاین غیرفعال است' : undefined}
      aria-disabled={isDisabled}
      {...props}
    >
      {isOffline && showOfflineIcon && (
        <WifiOff size={12} className="opacity-70" />
      )}
      {children}
    </button>
  )
}