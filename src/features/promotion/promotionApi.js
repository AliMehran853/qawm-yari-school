import { supabase } from '../../lib/supabase'
import { CURRENT_YEAR } from '../../lib/constants'

export const promotionApi = {
  async stats() {
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
    return counts
  },

  async promoteAll() {
    // ۱. شاگردان صنف ۱۲ → فارغ
    const { error: gradErr } = await supabase
      .from('students')
      .update({ status: 'graduated' })
      .eq('grade', 12)
      .eq('status', 'active')
    if (gradErr) throw gradErr

    // ۲. شاگردان صنف ۱۱ → ۱۲
    const { error: e11 } = await supabase
      .from('students')
      .update({ grade: 12 })
      .eq('grade', 11)
      .eq('status', 'active')
    if (e11) throw e11

    // ۳. ۱۰ → ۱۱
    const { error: e10 } = await supabase
      .from('students')
      .update({ grade: 11 })
      .eq('grade', 10)
      .eq('status', 'active')
    if (e10) throw e10

    // ۴. ۹ → ۱۰
    const { error: e9 } = await supabase
      .from('students')
      .update({ grade: 10 })
      .eq('grade', 9)
      .eq('status', 'active')
    if (e9) throw e9

    // ۵. ۸ → ۹
    const { error: e8 } = await supabase
      .from('students')
      .update({ grade: 9 })
      .eq('grade', 8)
      .eq('status', 'active')
    if (e8) throw e8

    // ۶. ۷ → ۸
    const { error: e7 } = await supabase
      .from('students')
      .update({ grade: 8 })
      .eq('grade', 7)
      .eq('status', 'active')
    if (e7) throw e7

    // ۷. ۶ → ۷
    const { error: e6 } = await supabase
      .from('students')
      .update({ grade: 7 })
      .eq('grade', 6)
      .eq('status', 'active')
    if (e6) throw e6

    // ۸. ۵ → ۶
    const { error: e5 } = await supabase
      .from('students')
      .update({ grade: 6 })
      .eq('grade', 5)
      .eq('status', 'active')
    if (e5) throw e5

    // ۹. ۴ → ۵
    const { error: e4 } = await supabase
      .from('students')
      .update({ grade: 5 })
      .eq('grade', 4)
      .eq('status', 'active')
    if (e4) throw e4

    // ۱۰. ۳ → ۴
    const { error: e3 } = await supabase
      .from('students')
      .update({ grade: 4 })
      .eq('grade', 3)
      .eq('status', 'active')
    if (e3) throw e3

    // ۱۱. ۲ → ۳
    const { error: e2 } = await supabase
      .from('students')
      .update({ grade: 3 })
      .eq('grade', 2)
      .eq('status', 'active')
    if (e2) throw e2

    // ۱۲. ۱ → ۲
    const { error: e1 } = await supabase
      .from('students')
      .update({ grade: 2 })
      .eq('grade', 1)
      .eq('status', 'active')
    if (e1) throw e1

    return true
  },
}