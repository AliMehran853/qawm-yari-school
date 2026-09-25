import { supabase } from '../../lib/supabase'
import { CURRENT_YEAR } from '../../lib/constants'
import { format } from 'date-fns-jalali'

export const attendanceApi = {
  // لیست حضور یک صنف در تاریخ مشخص
  async listByClassDate(grade, date) {
    // شاگردان
    const { data: students, error: sErr } = await supabase
      .from('students')
      .select('id, name, father_name, student_code, photo_url')
      .eq('grade', grade)
      .eq('status', 'active')
      .order('name')
    if (sErr) throw sErr

    if (!students || students.length === 0) return []

    // حضور این تاریخ
    const ids = students.map((s) => s.id)
    const { data: records, error: rErr } = await supabase
      .from('attendance')
      .select('*')
      .eq('date', date)
      .in('student_id', ids)
    if (rErr) throw rErr

    return students.map((s) => {
      const rec = records.find((r) => r.student_id === s.id)
      return {
        student: s,
        record: rec || null,
        status: rec?.status || 'present',
        note: rec?.note || '',
      }
    })
  },

  // ذخیره گروهی حضور
  async saveBulk({ grade, date, teacherId, year = CURRENT_YEAR, records }) {
    const rows = records.map((r) => ({
      student_id: r.student_id,
      grade,
      date,
      status: r.status,
      note: r.note?.trim() || null,
      teacher_id: teacherId || null,
      year,
    }))

    const { data, error } = await supabase
      .from('attendance')
      .upsert(rows, { onConflict: 'student_id,date' })
      .select()
    if (error) throw error
    return data
  },

  // آخرین تاریخ‌هایی که حضور ثبت شده
  async recentDates(grade, limit = 8) {
    const { data, error } = await supabase
      .from('attendance')
      .select('date')
      .eq('grade', grade)
      .order('date', { ascending: false })
      .limit(100)
    if (error) throw error

    const unique = [...new Set(data.map((d) => d.date))]
    return unique.slice(0, limit)
  },

  // گزارش حضور یک شاگرد
  async studentReport(studentId) {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
    if (error) throw error
    return data
  },

  // آمار حضور یک صنف
  async classStats(grade) {
    const { data, error } = await supabase
      .from('attendance')
      .select('status')
      .eq('grade', grade)
    if (error) throw error

    const stats = { present: 0, absent: 0, late: 0, excused: 0, total: 0 }
    data.forEach((r) => {
      stats[r.status] = (stats[r.status] || 0) + 1
      stats.total++
    })
    return stats
  },
}