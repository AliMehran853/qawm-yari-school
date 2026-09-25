import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { teachersApi } from './teachersApi'

const KEY = 'teachers'

export function useTeachers() {
  return useQuery({
    queryKey: [KEY],
    queryFn: teachersApi.list,
  })
}

export function useCreateTeacher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: teachersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('معلم اضافه شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در افزودن'),
  })
}

export function useUpdateTeacher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => teachersApi.update(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('ذخیره شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در ذخیره'),
  })
}

export function useDeleteTeacher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: teachersApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('حذف شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در حذف'),
  })
}