import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { announcementsApi } from './announcementsApi'

const KEY = 'announcements'

export function useAnnouncements() {
  return useQuery({
    queryKey: [KEY],
    queryFn: announcementsApi.list,
  })
}

export function useCreateAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: announcementsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('اعلان منتشر شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در انتشار'),
  })
}

export function useUpdateAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => announcementsApi.update(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('ذخیره شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در ذخیره'),
  })
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: announcementsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('حذف شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در حذف'),
  })
}

export function useTogglePin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, pinned }) => announcementsApi.togglePin(id, pinned),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success(vars.pinned ? 'سنجاق شد' : 'سنجاق برداشته شد')
    },
    onError: (err) => toast.error(err.message || 'خطا'),
  })
}