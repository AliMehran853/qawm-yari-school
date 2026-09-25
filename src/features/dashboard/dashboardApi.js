import { supabase } from '../../lib/supabase'
import { CURRENT_YEAR } from '../../lib/constants'
import { format } from 'date-fns-jalali'

export const dashboardApi = {
  async stats() {
    // شاگردان فعال
    const { count: studentCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // معلمان فعال
    const { count: teacherCount } = await supabase
      .from('teachers')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)

    // صنوف امسال
    const { count: classCount } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .eq('year', CURRENT_YEAR)
      .eq('active', true)

    // اعلانات
    const { count: announcementCount } = await supabase
      .from('announcements')
      .select('*', { count: 'exact', head: true })

    return {
      students: studentCount || 0,
      teachers: teacherCount || 0,
      classes: classCount || 0,
      announcements: announcementCount || 0,
    }
  },

  async studentsByGrade() {
    const { data, error } = await supabase
      .from('students')
      .select('grade')
      .eq('status', 'active')
    if (error) throw error

    const counts = {}
    for (let g = 1; g <= 12; g++) counts[g] = 0
    data.forEach((s) => {
      counts[s.grade] = (counts[s.grade] || 0) + 1
    })

    return Object.entries(counts).map(([grade, count]) => ({
      grade: Number(grade),
      count,
    }))
  },

  async todayAttendance() {
    const today = format(new Date(), 'yyyy/MM/dd')
    const { data, error } = await supabase
      .from('attendance')
      .select('status')
      .eq('date', today)
    if (error) throw error

    const stats = { present: 0, absent: 0, late: 0, excused: 0, total: 0 }
    data.forEach((r) => {
      stats[r.status] = (stats[r.status] || 0) + 1
      stats.total++
    })
    return { ...stats, date: today }
  },

  async recentAnnouncements(limit = 4) {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  },
}