import { supabase } from '../../lib/supabase'
import { CURRENT_YEAR } from '../../lib/constants'

export const teachersApi = {
  async list() {
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    if (!teachers || teachers.length === 0) return []

    const teacherIds = teachers.map((t) => t.id)
    const { data: assignments, error: aErr } = await supabase
      .from('teacher_subjects')
      .select('teacher_id, subject_id, grade')
      .eq('year', CURRENT_YEAR)
      .in('teacher_id', teacherIds)

    if (aErr) throw aErr

    const stats = {}
    ;(assignments || []).forEach((a) => {
      if (!stats[a.teacher_id]) {
        stats[a.teacher_id] = {
          subjects: new Set(),
          grades: new Set(),
          total: 0,
        }
      }
      stats[a.teacher_id].subjects.add(a.subject_id)
      stats[a.teacher_id].grades.add(a.grade)
      stats[a.teacher_id].total += 1
    })

    return teachers.map((t) => {
      const s = stats[t.id]
      return {
        ...t,
        subjects_count: s ? s.subjects.size : 0,
        grades_count: s ? s.grades.size : 0,
        assignments_count: s ? s.total : 0,
      }
    })
  },

  // ⭐ جزئیات کامل معلم با لیست تعیین‌ها
  async getWithAssignments(id, year = CURRENT_YEAR) {
    // ۱. معلم
    const { data: teacher, error: tErr } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single()
    if (tErr) throw tErr

    // ۲. تعیین‌ها با اطلاعات مضمون
    const { data: assignments, error: aErr } = await supabase
      .from('teacher_subjects')
      .select(`
        id, grade, year,
        subject:subjects(id, name, code)
      `)
      .eq('teacher_id', id)
      .eq('year', year)
      .order('grade', { ascending: true })

    if (aErr) throw aErr

    // ۳. گروه‌بندی بر اساس صنف
    const byGrade = {}
    ;(assignments || []).forEach((a) => {
      if (!byGrade[a.grade]) byGrade[a.grade] = []
      byGrade[a.grade].push({
        id: a.id,
        subject: a.subject,
      })
    })

    const uniqueSubjects = new Set(
      (assignments || []).map((a) => a.subject?.id).filter(Boolean)
    )

    return {
      ...teacher,
      assignments: assignments || [],
      byGrade,
      subjects_count: uniqueSubjects.size,
      grades_count: Object.keys(byGrade).length,
      assignments_count: (assignments || []).length,
    }
  },

  async get(id) {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(teacher) {
    const { data, error } = await supabase
      .from('teachers')
      .insert(teacher)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('teachers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from('teachers').delete().eq('id', id)
    if (error) throw error
  },
}