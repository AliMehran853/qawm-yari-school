import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from './dashboardApi'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.stats,
  })
}

export function useStudentsByGrade() {
  return useQuery({
    queryKey: ['dashboard', 'students-by-grade'],
    queryFn: dashboardApi.studentsByGrade,
  })
}

export function useTodayAttendance() {
  return useQuery({
    queryKey: ['dashboard', 'today-attendance'],
    queryFn: dashboardApi.todayAttendance,
  })
}

export function useRecentAnnouncements(limit = 4) {
  return useQuery({
    queryKey: ['dashboard', 'recent-announcements', limit],
    queryFn: () => dashboardApi.recentAnnouncements(limit),
  })
}