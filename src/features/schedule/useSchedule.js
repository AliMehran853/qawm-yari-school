import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { scheduleApi } from './scheduleApi'
import { CURRENT_YEAR } from '../../lib/constants'

const KEY = 'schedule'

export function useSchedule(grade, year = CURRENT_YEAR) {
  return useQuery({
    queryKey: [KEY, grade, year],
    queryFn: () => scheduleApi.listByGrade(grade, year),
    enabled: !!grade,
  })
}

export function useSaveCell() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: scheduleApi.saveCell,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [KEY, vars.grade] })
      toast.success(vars.subject_id ? 'ذخیره شد' : 'حذف شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در ذخیره'),
  })
}

export function useClearGrade() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ grade }) => scheduleApi.clearGrade(grade),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [KEY, vars.grade] })
      toast.success('برنامه صنف پاک شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در پاک‌سازی'),
  })
}