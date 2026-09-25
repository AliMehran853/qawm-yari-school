import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { settingsApi } from './settingsApi'

const KEY = 'settings'

export function useSettings() {
  return useQuery({
    queryKey: [KEY],
    queryFn: settingsApi.get,
    // تنظیمات کم عوض می‌شود، کش طولانی
    staleTime: 1000 * 60 * 30,
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      toast.success('تنظیمات ذخیره شد')
    },
    onError: (err) => toast.error(err.message || 'خطا در ذخیره'),
  })
}