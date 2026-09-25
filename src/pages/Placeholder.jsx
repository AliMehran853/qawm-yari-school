import { Construction } from 'lucide-react'
import PageWrapper from '../app/PageWrapper'
import EmptyState from '../components/ui/EmptyState'

export default function Placeholder({ title }) {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-brand-700">{title}</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200">
        <EmptyState
          icon={Construction}
          title="این بخش در حال ساخت است"
          description="بعداً اینجا را کامل می‌کنیم"
        />
      </div>
    </PageWrapper>
  )
}