import { supabase } from '../../lib/supabase'
import { CURRENT_YEAR } from '../../lib/constants'

// ─── تولید کد دانش‌آموز بر اساس بالاترین شماره موجود ───
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
    // اگر کد داده نشده، خودکار تولید کن
    if (!student.student_code) {
      student.student_code = await generateStudentCode(student.grade)
    }

    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single()

    // اگر باز هم duplicate بود، یک بار دیگر با کد جدید تلاش کن
    if (error && error.code === '23505' && error.message.includes('student_code')) {
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