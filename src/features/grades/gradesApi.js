import { supabase } from '../../lib/supabase'
import { CURRENT_YEAR } from '../../lib/constants'

export const gradesApi = {
  // لیست نمرات برای یک صنف + مضمون + دور
  async listByClassSubject(grade, subjectId, round, year = CURRENT_YEAR) {
    // ۱. شاگردان این صنف
    const { data: students, error: sErr } = await supabase
      .from('students')
      .select('id, name, father_name, grandfather_name, student_code, photo_url')
      .eq('grade', grade)
      .eq('status', 'active')
      .order('name')
    if (sErr) throw sErr

    if (!students || students.length === 0) return []

    // ۲. نمرات موجود برای این مضمون و دور
    const studentIds = students.map((s) => s.id)
    const { data: grades, error: gErr } = await supabase
      .from('grades')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('round', round)
      .eq('year', year)
      .in('student_id', studentIds)
    if (gErr) throw gErr

    // ۳. ترکیب
    return students.map((s) => {
      const g = grades.find((x) => x.student_id === s.id)
      return {
        student: s,
        gradeRecord: g || null,
        score: g?.score ?? '',
      }
    })
  },

  // ذخیره گروهی نمرات
  async saveBulk({ grade, subjectId, teacherId, round, year = CURRENT_YEAR, scores }) {
    const rows = scores
      .filter((s) => s.score !== '' && s.score !== null && s.score !== undefined)
      .map((s) => ({
        student_id: s.student_id,
        subject_id: subjectId,
        teacher_id: teacherId || null,
        grade,
        year,
        round,
        score: Number(s.score),
      }))

    if (rows.length === 0) return []

    const { data, error } = await supabase
      .from('grades')
      .upsert(rows, {
        onConflict: 'student_id,subject_id,year,round',
        ignoreDuplicates: false,
      })
      .select()
    if (error) throw error
    return data
  },

  // کارنامه یک شاگرد
  async getReportCard(studentId, year = CURRENT_YEAR) {
    const { data: student, error: sErr } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single()
    if (sErr) throw sErr

    const { data: subjects, error: subErr } = await supabase
      .from('subjects')
      .select('*')
      .eq('grade', student.grade)
      .eq('active', true)
      .order('name')
    if (subErr) throw subErr

    const { data: grades, error: gErr } = await supabase
      .from('grades')
      .select('*')
      .eq('student_id', studentId)
      .eq('year', year)
    if (gErr) throw gErr

    return {
      student,
      rows: subjects.map((sub) => {
        const first = grades.find(
          (g) => g.subject_id === sub.id && g.round === 'first'
        )
        const final = grades.find(
          (g) => g.subject_id === sub.id && g.round === 'final'
        )
        return {
          subject: sub,
          first_score: first?.score ?? null,
          final_score: final?.score ?? null,
        }
      }),
    }
  },

  // معدل همه شاگردان یک صنف (برای رتبه‌بندی)
  async classAverages(grade, year = CURRENT_YEAR) {
    const { data: students, error: sErr } = await supabase
      .from('students')
      .select('id')
      .eq('grade', grade)
      .eq('status', 'active')
    if (sErr) throw sErr

    if (!students || students.length === 0) return {}

    const ids = students.map((s) => s.id)
    const { data: grades, error: gErr } = await supabase
      .from('grades')
      .select('student_id, subject_id, score, round')
      .in('student_id', ids)
      .eq('year', year)
    if (gErr) throw gErr

    const byStudent = {}
    grades.forEach((g) => {
      if (!byStudent[g.student_id]) byStudent[g.student_id] = {}
      if (!byStudent[g.student_id][g.subject_id]) {
        byStudent[g.student_id][g.subject_id] = { first: 0, final: 0 }
      }
      if (g.round === 'first')
        byStudent[g.student_id][g.subject_id].first = Number(g.score) || 0
      else
        byStudent[g.student_id][g.subject_id].final = Number(g.score) || 0
    })

    const averages = {}
    Object.entries(byStudent).forEach(([sid, subjects]) => {
      const totals = Object.values(subjects).map((s) => s.first + s.final)
      if (totals.length === 0) {
        averages[sid] = 0
      } else {
        averages[sid] = totals.reduce((a, b) => a + b, 0) / totals.length
      }
    })
    return averages
  },
}