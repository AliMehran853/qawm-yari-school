import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { subjectsApi } from './subjectsApi'

const KEY = 'subjects'

export function useSubjects(grade = null) {
  return useQuery({
    queryKey: [KEY, grade],
    queryFn: () => subjectsApi.list(grade),
  })
}

export function useCreateSubject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: subjectsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('مضمون اضافه شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در افزودن'),
  })
}

export function useUpdateSubject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => subjectsApi.update(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('ذخیره شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در ذخیره'),
  })
}

export function useDeleteSubject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: subjectsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('حذف شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در حذف'),
  })
}