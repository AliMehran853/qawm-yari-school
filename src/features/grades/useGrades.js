import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { gradesApi } from './gradesApi'
import { CURRENT_YEAR } from '../../lib/constants'

const KEY = 'grades'

export function useGradesByClassSubject(grade, subjectId, round, year = CURRENT_YEAR) {
  return useQuery({
    queryKey: [KEY, grade, subjectId, round, year],
    queryFn: () => gradesApi.listByClassSubject(grade, subjectId, round, year),
    enabled: !!grade && !!subjectId && !!round,
  })
}

export function useSaveGrades() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: gradesApi.saveBulk,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('نمرات ذخیره شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در ذخیره'),
  })
}

export function useReportCard(studentId, year = CURRENT_YEAR) {
  return useQuery({
    queryKey: ['report-card', studentId, year],
    queryFn: () => gradesApi.getReportCard(studentId, year),
    enabled: !!studentId,
  })
}

export function useClassAverages(grade, year = CURRENT_YEAR) {
  return useQuery({
    queryKey: ['class-averages', grade, year],
    queryFn: () => gradesApi.classAverages(grade, year),
    enabled: !!grade,
  })
}