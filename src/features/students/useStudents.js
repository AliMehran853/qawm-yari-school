import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { studentsApi } from './studentsApi'

const KEY = 'students'

export function useStudents(filters = {}) {
  return useQuery({
    queryKey: [KEY, filters],
    queryFn: () => studentsApi.list(filters),
  })
}

export function useStudentStats() {
  return useQuery({
    queryKey: [KEY, 'stats'],
    queryFn: studentsApi.stats,
  })
}

export function useCreateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('دانش‌آموز ثبت شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در ثبت'),
  })
}

export function useUpdateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => studentsApi.update(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('ذخیره شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در ذخیره'),
  })
}

export function useDeleteStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: studentsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('حذف شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در حذف'),
  })
}