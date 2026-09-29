import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { galleryApi, PAGE_SIZE } from './galleryApi'

const KEY = 'gallery'

// ─── لیست صفحه‌بندی‌شده ───
export function useGallery({ category = null, page = 0 } = {}) {
  return useQuery({
    queryKey: [KEY, 'list', category, page],
    queryFn: () => galleryApi.list({ category, page, pageSize: PAGE_SIZE }),
    keepPreviousData: true, // برای اینکه هنگام تغییر صفحه، صفحه سفید نشود
  })
}

// ─── شمارش هر دسته ───
export function useGalleryCounts() {
  return useQuery({
    queryKey: [KEY, 'counts'],
    queryFn: galleryApi.counts,
    staleTime: 1000 * 60 * 5,
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