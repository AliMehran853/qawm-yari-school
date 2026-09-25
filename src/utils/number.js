// تبدیل اعداد لاتین به فارسی
export function toFaNum(value) {
  if (value === null || value === undefined) return ''
  return String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])
}

// تبدیل اعداد فارسی به لاتین
export function toEnNum(value) {
  if (value === null || value === undefined) return ''
  return String(value).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
}