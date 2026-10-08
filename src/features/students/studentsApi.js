import { supabase } from '../../lib/supabase'
import { CURRENT_YEAR } from '../../lib/constants'

// ─── تولید کد دانش‌آموز ───
async function generateStudentCode(grade) {
  const gradeStr = String(grade).padStart(2, '0')
  const prefix = `${CURRENT_YEAR}-${gradeStr}-`

  const { data, error } = await supabase
    .from('students')
    .select('student_code')
    .like('student_code', `${prefix}%`)
    .order('student_code', { ascending: false })
    .limit(1)

  if (error) throw error

  let nextSeq = 1
  if (data && data.length > 0 && data[0].student_code) {
    const parts = data[0].student_code.split('-')
    const lastSeq = parseInt(parts[2], 10)
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1
  }

  return `${prefix}${String(nextSeq).padStart(3, '0')}`
}

export const studentsApi = {
  async list({ grade = null, status = 'active' } = {}) {
    let query = supabase
      .from('students')
      .select('*')
      .order('grade', { ascending: true })
      .order('name', { ascending: true })

    if (grade) query = query.eq('grade', grade)
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // ⭐ لیست با رتبه (فقط برای یک صنف خاص)
  async listWithRanks(grade, year = CURRENT_YEAR) {
    // ۱. شاگردان این صنف
    const { data: students, error: sErr } = await supabase
      .from('students')
      .select('*')
      .eq('grade', grade)
      .eq('status', 'active')
      .order('name')
    if (sErr) throw sErr

    if (!students || students.length === 0) return []

    // ۲. نمرات همه شاگردان این صنف
    const studentIds = students.map((s) => s.id)
    const { data: grades, error: gErr } = await supabase
      .from('grades')
      .select('student_id, subject_id, score, round')
      .in('student_id', studentIds)
      .eq('year', year)
    if (gErr) throw gErr

    // ۳. محاسبه معدل هر شاگرد
    // ساختار: { studentId: { subjectId: { first: num, final: num } } }
    const byStudent = {}
    ;(grades || []).forEach((g) => {
      if (!byStudent[g.student_id]) byStudent[g.student_id] = {}
      if (!byStudent[g.student_id][g.subject_id]) {
        byStudent[g.student_id][g.subject_id] = { first: 0, final: 0 }
      }
      if (g.round === 'first') {
        byStudent[g.student_id][g.subject_id].first = Number(g.score) || 0
      } else {
        byStudent[g.student_id][g.subject_id].final = Number(g.score) || 0
      }
    })

    // معدل = میانگین مجموع دو دور همه مضامین
    const averages = {}
    students.forEach((s) => {
      const subjects = byStudent[s.id]
      if (!subjects) {
        averages[s.id] = null
        return
      }
      const totals = Object.values(subjects).map(
        (v) => (v.first || 0) + (v.final || 0)
      )
      if (totals.length === 0) {
        averages[s.id] = null
      } else {
        const sum = totals.reduce((a, b) => a + b, 0)
        averages[s.id] = sum / totals.length
      }
    })

    // ۴. مرتب‌سازی بر اساس معدل (بالاترین اول)
    const sorted = [...students].sort((a, b) => {
      const avgA = averages[a.id]
      const avgB = averages[b.id]
      // کسانی که معدل ندارند در آخر
      if (avgA === null && avgB === null) return 0
      if (avgA === null) return 1
      if (avgB === null) return -1
      return avgB - avgA
    })

    // ۵. اختصاص رتبه (با احتساب تساوی)
    let currentRank = 0
    let previousAvg = null
    let sameRankCount = 0

    const result = sorted.map((s, idx) => {
      const avg = averages[s.id]

      if (avg === null) {
        // بدون معدل → بدون رتبه
        return {
          ...s,
          average: null,
          rank: null,
        }
      }

      // اگر با قبلی یکسان است، همان رتبه
      if (
        previousAvg !== null &&
        Math.abs(avg - previousAvg) < 0.01
      ) {
        sameRankCount++
      } else {
        currentRank = idx + 1
        sameRankCount = 0
      }

      previousAvg = avg

      return {
        ...s,
        average: Math.round(avg * 100) / 100,
        rank: currentRank,
      }
    })

    return result
  },

  async get(id) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(student) {
    if (!student.student_code) {
      student.student_code = await generateStudentCode(student.grade)
    }

    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single()

    if (
      error &&
      error.code === '23505' &&
      error.message.includes('student_code')
    ) {
      student.student_code = await generateStudentCode(student.grade)
      const retry = await supabase
        .from('students')
        .insert(student)
        .select()
        .single()
      if (retry.error) throw retry.error
      return retry.data
    }

    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from('students').delete().eq('id', id)
    if (error) throw error
  },

  async stats() {
    const { data, error } = await supabase
      .from('students')
      .select('grade, status')
      .eq('status', 'active')
    if (error) throw error

    const total = data.length
    const byGrade = {}
    for (let g = 1; g <= 12; g++) byGrade[g] = 0
    data.forEach((s) => {
      byGrade[s.grade] = (byGrade[s.grade] || 0) + 1
    })

    return { total, byGrade }
  },
}