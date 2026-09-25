import {
  Database,
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  CalendarCheck,
  Bell,
  Settings,
  Image,
  FileText,
  ClipboardList,
  UserCheck,
  PenSquare,
  Award,
  CalendarDays,
} from 'lucide-react'

import { ROLES } from './roles'

const DASHBOARD = {
  to: '/panel/dashboard',
  label: 'داشبورد',
  icon: LayoutDashboard,
}

const ADMIN_MENU = [
  DASHBOARD,
  { to: '/panel/students', label: 'دانش‌آموزان', icon: GraduationCap },
  { to: '/panel/teachers', label: 'معلمان', icon: Users },
  { to: '/panel/classes', label: 'صنوف', icon: School },
  { to: '/panel/subjects', label: 'مضامین', icon: BookOpen },
  { to: '/panel/assignments', label: 'تعیین معلم', icon: UserCheck },
  { to: '/panel/grades-entry', label: 'ورود نمرات', icon: PenSquare },
  { to: '/panel/report-card', label: 'کارنامه', icon: Award },
  { to: '/panel/attendance', label: 'ثبت حضور', icon: CalendarCheck },
  { to: '/panel/attendance-report', label: 'گزارش حضور', icon: CalendarDays },
  { to: '/panel/announcements', label: 'اعلانات', icon: Bell },
  { to: '/panel/gallery', label: 'گالری', icon: Image },
  { to: '/panel/documents', label: 'اسناد', icon: FileText },
  { to: '/panel/registrations', label: 'ثبت‌نام صنف اول', icon: ClipboardList },
  { to: '/panel/promotion', label: 'ترفیع دسته‌جمعی', icon: GraduationCap },
  { to: '/panel/backup', label: 'پشتیبان‌گیری', icon: Database },
  { to: '/panel/settings', label: 'تنظیمات', icon: Settings },
]

const TEACHER_MENU = [
  DASHBOARD,
  { to: '/panel/my-classes', label: 'صنف‌های من', icon: School },
  { to: '/panel/grades', label: 'نمرات', icon: BookOpen },
  { to: '/panel/attendance', label: 'حضور', icon: CalendarCheck },
  { to: '/panel/announcements', label: 'اعلانات', icon: Bell },
]

const STUDENT_MENU = [
  DASHBOARD,
  { to: '/panel/my-grades', label: 'کارنامه من', icon: BookOpen },
  { to: '/panel/my-attendance', label: 'حضور من', icon: CalendarCheck },
  { to: '/panel/announcements', label: 'اعلانات', icon: Bell },
]

const PARENT_MENU = [
  DASHBOARD,
  { to: '/panel/my-children', label: 'فرزندان من', icon: Users },
  { to: '/panel/announcements', label: 'اعلانات', icon: Bell },
]

export function getMenuByRole(role) {
  switch (role) {
    case ROLES.ADMIN:
      return ADMIN_MENU
    case ROLES.TEACHER:
      return TEACHER_MENU
    case ROLES.STUDENT:
      return STUDENT_MENU
    case ROLES.PARENT:
      return PARENT_MENU
    default:
      return [DASHBOARD]
  }
}