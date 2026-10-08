export const SCHEDULE_DAYS = [
  { value: 'sat', label: 'شنبه', short: 'ش' },
  { value: 'sun', label: 'یکشنبه', short: 'ی' },
  { value: 'mon', label: 'دوشنبه', short: 'د' },
  { value: 'tue', label: 'سه‌شنبه', short: 'س' },
  { value: 'wed', label: 'چهارشنبه', short: 'چ' },
  { value: 'thu', label: 'پنجشنبه', short: 'پ' },
]

export const DAY_LABELS = {
  sat: 'شنبه',
  sun: 'یکشنبه',
  mon: 'دوشنبه',
  tue: 'سه‌شنبه',
  wed: 'چهارشنبه',
  thu: 'پنجشنبه',
}

export const DEFAULT_PERIOD_TIMES = [
  { period: 1, start: '07:30', end: '08:15' },
  { period: 2, start: '08:20', end: '09:05' },
  { period: 3, start: '09:20', end: '10:05' },
  { period: 4, start: '10:10', end: '10:55' },
  { period: 5, start: '11:00', end: '11:45' },
  { period: 6, start: '11:50', end: '12:35' },
  { period: 7, start: '12:40', end: '13:25' },
  { period: 8, start: '13:30', end: '14:15' },
]

export const DEFAULT_PERIOD_COUNTS = {
  1: 4, 2: 4, 3: 4,
  4: 5, 5: 5, 6: 5,
  7: 5, 8: 6, 9: 6,
  10: 6, 11: 6, 12: 6,
}