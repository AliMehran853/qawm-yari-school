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

export function useRecentAnnouncements(limit = 4) {
  return useQuery({
    queryKey: ['dashboard', 'recent-announcements', limit],
    queryFn: () => dashboardApi.recentAnnouncements(limit),
  })
}

export function useRecentStudents(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'recent-students', limit],
    queryFn: () => dashboardApi.recentStudents(limit),
  })
}