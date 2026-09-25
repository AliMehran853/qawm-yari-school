export const CURRENT_YEAR = 1404

export const GRADING = {
  firstRoundMax: 40,
  finalRoundMax: 60,
  totalMax: 100,
  passScore: 55,

  levels: {
    excellent: { min: 90, label: 'عالی', color: 'text-brand-700' },
    good:      { min: 75, label: 'خوب', color: 'text-blue-700' },
    acceptable:{ min: 55, label: 'قابل قبول', color: 'text-gold-700' },
    failed:    { min: 0,  label: 'ناکام', color: 'text-danger' },
  },
}

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
}

export const ATTENDANCE_LABELS = {
  present: 'حاضر',
  absent: 'غایب',
  late: 'تاخیر',
  excused: 'رخصت',
}

export const STUDENT_STATUS = {
  ACTIVE: 'active',
  GRADUATED: 'graduated',
  LEFT: 'left',
  TRANSFERRED: 'transferred',
}

export const STUDENT_STATUS_LABELS = {
  active: 'فعال',
  graduated: 'فارغ',
  left: 'ترک تحصیل',
  transferred: 'انتقالی',
}

export const EXAM_ROUNDS = {
  FIRST: 'first',
  FINAL: 'final',
}

export const EXAM_ROUND_LABELS = {
  first: 'دور اول',
  final: 'دور نهایی',
}

export const CONTACT = {
  phone: '',
  email: '',
  address: 'ولسوالی ورس، بامیان، افغانستان',
}