export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'مدیر',
  [ROLES.TEACHER]: 'معلم',
  [ROLES.STUDENT]: 'دانش‌آموز',
  [ROLES.PARENT]: 'والد',
}

export const ROLE_COLORS = {
  [ROLES.ADMIN]: 'bg-brand-50 text-brand-700',
  [ROLES.TEACHER]: 'bg-blue-50 text-blue-700',
  [ROLES.STUDENT]: 'bg-gold-50 text-gold-700',
  [ROLES.PARENT]: 'bg-purple-50 text-purple-700',
}

export const PERMISSIONS = {
  manageStudents: [ROLES.ADMIN],
  manageTeachers: [ROLES.ADMIN],
  manageClasses: [ROLES.ADMIN],
  manageSubjects: [ROLES.ADMIN],
  manageAnnouncements: [ROLES.ADMIN, ROLES.TEACHER],
  manageGrades: [ROLES.ADMIN, ROLES.TEACHER],
  manageAttendance: [ROLES.ADMIN, ROLES.TEACHER],
  viewOwnGrades: [ROLES.STUDENT],
  viewChildGrades: [ROLES.PARENT],
  sendMessages: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
}

export const hasPermission = (role, permission) => {
  return PERMISSIONS[permission]?.includes(role) ?? false
}