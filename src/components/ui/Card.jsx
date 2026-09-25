import { cn } from '../../utils/cn'

export default function Card({ children, hover = false, flat = false, className, ...props }) {
  return (
    <div
      className={cn(
        flat ? 'card-flat' : 'card',
        hover && 'card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}