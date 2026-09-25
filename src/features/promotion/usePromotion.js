import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { promotionApi } from './promotionApi'

export function usePromotionStats() {
  return useQuery({
    queryKey: ['promotion', 'stats'],
    queryFn: promotionApi.stats,
  })
}

export function usePromoteAll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: promotionApi.promoteAll,
    onSuccess: () => {
      qc.invalidateQueries()
      toast.success('همه شاگردان به صنف بالاتر منتقل شدند')
    },
    onError: (err) => toast.error(err.message || 'خطا در ترفیع'),
  })
}