import { supabase } from '../../lib/supabase'
import { CURRENT_YEAR } from '../../lib/constants'

export const scheduleApi = {
  // ─── خواندن برنامه یک صنف ───
  async listByGrade(grade, year = CURRENT_YEAR) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        id, grade, day, period, subject_id, teacher_id,
        subject:subjects(id, name, code),
        teacher:teachers(id, name, photo_url)
      `)
      .eq('grade', grade)
      .eq('year', year)

    if (error) throw error
    return data || []
  },

  // ─── ذخیره یک خانه (upsert) ───
  async saveCell({ grade, day, period, subject_id, teacher_id, year = CURRENT_YEAR }) {
    // اگر subject_id خالی است → حذف
    if (!subject_id) {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('grade', grade)
        .eq('day', day)
        .eq('period', period)
        .eq('year', year)
      if (error) throw error
      return null
    }

    const { data, error } = await supabase
      .from('schedules')
      .upsert(
        {
          grade,
          day,
          period,
          subject_id,
          teacher_id: teacher_id || null,
          year,
        },
        {
          onConflict: 'grade,day,period,year',
        }
      )
      .select(`
        id, grade, day, period, subject_id, teacher_id,
        subject:subjects(id, name, code),
        teacher:teachers(id, name, photo_url)
      `)
      .single()

    if (error) throw error
    return data
  },

  // ─── حذف کل برنامه یک صنف ───
  async clearGrade(grade, year = CURRENT_YEAR) {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('grade', grade)
      .eq('year', year)
    if (error) throw error
  },

  // ─── آمار: چند صنف برنامه دارند ───
  async stats(year = CURRENT_YEAR) {
    const { data, error } = await supabase
      .from('schedules')
      .select('grade')
      .eq('year', year)
    if (error) throw error

    const grades = [...new Set((data || []).map((s) => s.grade))]
    return { gradesWithSchedule: grades, count: grades.length }
  },
}