import { format } from 'date-fns-jalali'

// نمایش تاریخ شمسی
export function formatJalali(date, pattern = 'yyyy/MM/dd') {
  if (!date) return ''
  return format(new Date(date), pattern)
}

// تاریخ امروز شمسی
export function today() {
  return format(new Date(), 'yyyy/MM/dd')
}