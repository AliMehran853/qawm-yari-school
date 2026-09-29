import { supabase } from '../../lib/supabase'
import { CURRENT_YEAR } from '../../lib/constants'

export const dashboardApi = {
  async stats() {
    const { count: studentCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    const { count: teacherCount } = await supabase
      .from('teachers')
      .select('*', { count: 'exact', head: true })

    const { count: classCount } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .eq('year', CURRENT_YEAR)
      .eq('active', true)

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

  async recentStudents(limit = 5) {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, father_name, grandfather_name, grade, photo_url, created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  },
}