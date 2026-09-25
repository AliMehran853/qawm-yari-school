import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { galleryApi } from './galleryApi'

const KEY = 'gallery'

export function useGallery(category = null) {
  return useQuery({
    queryKey: [KEY, category],
    queryFn: () => galleryApi.list(category),
  })
}

export function useCreateGalleryItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: galleryApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('عکس اضافه شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در افزودن'),
  })
}

export function useUpdateGalleryItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => galleryApi.update(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('ذخیره شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در ذخیره'),
  })
}

export function useDeleteGalleryItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: galleryApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('حذف شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در حذف'),
  })
}