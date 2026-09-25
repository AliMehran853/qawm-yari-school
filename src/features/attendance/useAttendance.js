import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { attendanceApi } from './attendanceApi'

const KEY = 'attendance'

export function useAttendanceByClassDate(grade, date) {
  return useQuery({
    queryKey: [KEY, 'class', grade, date],
    queryFn: () => attendanceApi.listByClassDate(grade, date),
    enabled: !!grade && !!date,
  })
}

export function useRecentDates(grade) {
  return useQuery({
    queryKey: [KEY, 'recent-dates', grade],
    queryFn: () => attendanceApi.recentDates(grade),
    enabled: !!grade,
  })
}

export function useSaveAttendance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: attendanceApi.saveBulk,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('حضور ذخیره شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در ذخیره'),
  })
}

export function useStudentAttendanceReport(studentId) {
  return useQuery({
    queryKey: [KEY, 'student', studentId],
    queryFn: () => attendanceApi.studentReport(studentId),
    enabled: !!studentId,
  })
}

export function useClassAttendanceStats(grade) {
  return useQuery({
    queryKey: [KEY, 'stats', grade],
    queryFn: () => attendanceApi.classStats(grade),
    enabled: !!grade,
  })
}