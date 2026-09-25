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

export const registrationsApi = {
  async list(status = null) {
    let query = supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async create(reg) {
    const { data, error } = await supabase
      .from('registrations')
      .insert(reg)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('registrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from('registrations').delete().eq('id', id)
    if (error) throw error
  },

  // ─── تأیید ثبت‌نام → ایجاد شاگرد ───
  async approve(id, reviewerId) {
    // ۱. ثبت‌نام را بخوان
    const { data: reg, error: rErr } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single()
    if (rErr) throw rErr

    if (reg.status !== 'pending') {
      throw new Error('این ثبت‌نام قبلاً بررسی شده')
    }

    // ۲. کد شاگرد تولید کن
    const studentCode = await generateStudentCode(1)

    // ۳. شاگرد بساز
    const { data: student, error: sErr } = await supabase
      .from('students')
      .insert({
        student_code: studentCode,
        name: reg.name,
        father_name: reg.father_name,
        grandfather_name: reg.grandfather_name,
        dob: reg.dob,
        grade: 1,
        admission_year: reg.year,
        phone: reg.phone,
        whatsapp: reg.whatsapp,
        address: reg.address,
        photo_url: reg.photo_url,
        status: 'active',
        notes: reg.notes,
      })
      .select()
      .single()

    if (sErr) {
      // اگر duplicate بود، دوباره تلاش کن
      if (sErr.code === '23505' && sErr.message.includes('student_code')) {
        const retryCode = await generateStudentCode(1)
        const retry = await supabase
          .from('students')
          .insert({
            student_code: retryCode,
            name: reg.name,
            father_name: reg.father_name,
            grandfather_name: reg.grandfather_name,
            dob: reg.dob,
            grade: 1,
            admission_year: reg.year,
            phone: reg.phone,
            whatsapp: reg.whatsapp,
            address: reg.address,
            photo_url: reg.photo_url,
            status: 'active',
            notes: reg.notes,
          })
          .select()
          .single()
        if (retry.error) throw retry.error

        // آپدیت ثبت‌نام با شاگرد جدید
        const { data: updated, error: uErr } = await supabase
          .from('registrations')
          .update({
            status: 'approved',
            student_id: retry.data.id,
            reviewed_by: reviewerId,
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single()
        if (uErr) throw uErr

        return { registration: updated, student: retry.data }
      }
      throw sErr
    }

    // ۴. ثبت‌نام را آپدیت کن
    const { data: updated, error: uErr } = await supabase
      .from('registrations')
      .update({
        status: 'approved',
        student_id: student.id,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    if (uErr) throw uErr

    return { registration: updated, student }
  },

  async reject(id, reason, reviewerId) {
    const { data, error } = await supabase
      .from('registrations')
      .update({
        status: 'rejected',
        reject_reason: reason,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
}