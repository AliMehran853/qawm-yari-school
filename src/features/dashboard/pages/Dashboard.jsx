import {
  GraduationCap,
  Users,
  School,
  Bell,
  BarChart3,
  Megaphone,
  UserPlus,
} from 'lucide-react'

import PageWrapper from '../../../app/PageWrapper'
import Card from '../../../components/ui/Card'
import StatCard from '../components/StatCard'
import GradeBarChart from '../components/GradeBarChart'
import RecentAnnouncements from '../components/RecentAnnouncements'
import RecentStudents from '../components/RecentStudents'
import {
  useDashboardStats,
  useStudentsByGrade,
  useRecentAnnouncements,
  useRecentStudents,
} from '../useDashboard'
import { useAuthStore } from '../../../store/authStore'

export default function Dashboard() {
  const profile = useAuthStore((s) => s.profile)

  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: byGrade } = useStudentsByGrade()
  const { data: recentAnn } = useRecentAnnouncements(4)
  const { data: recentStudents } = useRecentStudents(5)

  return (
    <PageWrapper>
      {/* ─── خوش‌آمد ─── */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-700">
          سلام، {profile?.full_name}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          خلاصه وضعیت مکتب قوم یاری
        </p>
      </div>

      {/* ─── کارت‌های آمار ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard
          title="دانش‌آموزان"
          value={statsLoading ? '...' : stats?.students || 0}
          icon={GraduationCap}
          color="brand"
        />
        <StatCard
          title="معلمان"
          value={statsLoading ? '...' : stats?.teachers || 0}
          icon={Users}
          color="gold"
        />
        <StatCard
          title="صنوف"
          value={statsLoading ? '...' : stats?.classes || 0}
          icon={School}
          color="blue"
        />
        <StatCard
          title="اعلانات"
          value={statsLoading ? '...' : stats?.announcements || 0}
          icon={Bell}
          color="purple"
        />
      </div>

      {/* ─── ردیف دوم: نمودار + آخرین شاگردان ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-5">
        {/* نمودار */}
        <Card flat className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-brand-700" />
            <h2 className="font-bold text-sm sm:text-base text-gray-900">
              دانش‌آموزان هر صنف
            </h2>
          </div>
          {byGrade && byGrade.length > 0 ? (
            <GradeBarChart data={byGrade} />
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">
              داده‌ای موجود نیست
            </p>
          )}
        </Card>

        {/* آخرین شاگردان */}
        <Card flat>
          <div className="flex items-center gap-2 mb-4">
            <UserPlus size={18} className="text-brand-700" />
            <h2 className="font-bold text-sm sm:text-base text-gray-900">
              آخرین دانش‌آموزان
            </h2>
          </div>
          <RecentStudents students={recentStudents} />
        </Card>
      </div>

      {/* ─── ردیف سوم: آخرین اعلانات ─── */}
      <Card flat>
        <div className="flex items-center gap-2 mb-4">
          <Megaphone size={18} className="text-brand-700" />
          <h2 className="font-bold text-sm sm:text-base text-gray-900">
            آخرین اعلانات
          </h2>
        </div>
        <RecentAnnouncements announcements={recentAnn} />
      </Card>
    </PageWrapper>
  )
}