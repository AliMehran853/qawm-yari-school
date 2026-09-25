import { supabase } from '../../lib/supabase'
import { CURRENT_YEAR } from '../../lib/constants'

export const assignmentsApi = {
  // لیست همه مضامین یک صنف با معلم تعیین‌شده
  async listByGrade(grade, year = CURRENT_YEAR) {
    // ۱. مضامین صنف
    const { data: subjects, error: sErr } = await supabase
      .from('subjects')
      .select('*')
      .eq('grade', grade)
      .eq('active', true)
      .order('name')
    if (sErr) throw sErr

    // ۲. تعیین‌های این صنف
    const { data: assignments, error: aErr } = await supabase
      .from('teacher_subjects')
      .select('id, subject_id, teacher_id')
      .eq('grade', grade)
      .eq('year', year)
    if (aErr) throw aErr

    // ۳. اطلاعات معلم‌ها
    const teacherIds = [...new Set(assignments.map((a) => a.teacher_id))]
    let teachers = []
    if (teacherIds.length > 0) {
      const { data, error } = await supabase
        .from('teachers')
        .select('id, name, photo_url')
        .in('id', teacherIds)
      if (error) throw error
      teachers = data
    }

    // ۴. ترکیب داده‌ها
    return subjects.map((subject) => {
      const assignment = assignments.find((a) => a.subject_id === subject.id)
      const teacher = assignment
        ? teachers.find((t) => t.id === assignment.teacher_id)
        : null
      return {
        subject,
        assignment: assignment || null,
        teacher: teacher || null,
      }
    })
  },

  // تعیین معلم به مضمون
  async assign({ teacher_id, subject_id, grade, year = CURRENT_YEAR }) {
    // اگر قبلاً تعیین شده، اول حذف کن
    await supabase
      .from('teacher_subjects')
      .delete()
      .eq('subject_id', subject_id)
      .eq('grade', grade)
      .eq('year', year)

    // سپس اضافه کن
    const { data, error } = await supabase
      .from('teacher_subjects')
      .insert({ teacher_id, subject_id, grade, year })
      .select()
      .single()
    if (error) throw error
    return data
  },

  // حذف تعیین
  async unassign(id) {
    const { error } = await supabase
      .from('teacher_subjects')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // آمار: هر معلم چند مضمون دارد
  async teacherLoad(year = CURRENT_YEAR) {
    const { data, error } = await supabase
      .from('teacher_subjects')
      .select('teacher_id, grade, subject_id')
      .eq('year', year)
    if (error) throw error

    const byTeacher = {}
    data.forEach((a) => {
      if (!byTeacher[a.teacher_id]) {
        byTeacher[a.teacher_id] = { count: 0, grades: new Set() }
      }
      byTeacher[a.teacher_id].count += 1
      byTeacher[a.teacher_id].grades.add(a.grade)
    })
    return byTeacher
  },
}