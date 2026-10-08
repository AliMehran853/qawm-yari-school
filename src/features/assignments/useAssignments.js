import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { assignmentsApi } from './assignmentsApi'
import { CURRENT_YEAR } from '../../lib/constants'

const KEY = 'assignments'

export function useAssignments(grade, year = CURRENT_YEAR) {
  return useQuery({
    queryKey: [KEY, grade, year],
    queryFn: () => assignmentsApi.listByGrade(grade, year),
    enabled: !!grade,
  })
}

export function useAssignTeacher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: assignmentsApi.assign,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [KEY, vars.grade] })
      qc.invalidateQueries({ queryKey: ['teacher-load'] })
      toast.success('معلم تعیین شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در تعیین'),
  })
}

// ⭐ تعیین یک معلم برای همه مضامین
export function useAssignAll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: assignmentsApi.assignAll,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [KEY, vars.grade] })
      qc.invalidateQueries({ queryKey: ['teacher-load'] })
      toast.success(
        vars.teacher_id
          ? `معلم برای همه مضامین صنف ${vars.grade} تعیین شد`
          : 'همه تعیین‌ها پاک شد'
      )
    },
    onError: (err) => toast.error(err.message || 'خطا در تعیین گروهی'),
  })
}

export function useUnassignTeacher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, grade }) => assignmentsApi.unassign(id),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [KEY, vars.grade] })
      qc.invalidateQueries({ queryKey: ['teacher-load'] })
      toast.success('حذف شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در حذف'),
  })
}

export function useTeacherLoad(year = CURRENT_YEAR) {
  return useQuery({
    queryKey: ['teacher-load', year],
    queryFn: () => assignmentsApi.teacherLoad(year),
  })
}