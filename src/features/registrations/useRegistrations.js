import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { registrationsApi } from './registrationsApi'

const KEY = 'registrations'

export function useRegistrations(status = null) {
  return useQuery({
    queryKey: [KEY, status],
    queryFn: () => registrationsApi.list(status),
  })
}

export function useCreateRegistration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: registrationsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('ثبت‌نام انجام شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در ثبت'),
  })
}

export function useUpdateRegistration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => registrationsApi.update(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('ذخیره شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در ذخیره'),
  })
}

export function useDeleteRegistration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: registrationsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('حذف شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در حذف'),
  })
}

export function useApproveRegistration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reviewerId }) => registrationsApi.approve(id, reviewerId),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: [KEY] })
      qc.invalidateQueries({ queryKey: ['students'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(
        `تأیید شد — کد شاگرد: ${data.student.student_code}`
      )
    },
    onError: (err) => toast.error(err.message || 'خطا در تأیید'),
  })
}

export function useRejectRegistration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason, reviewerId }) =>
      registrationsApi.reject(id, reason, reviewerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('رد شد')
    },
    onError: (err) => toast.error(err.message || 'خطا'),
  })
}