import { supabase } from '../../lib/supabase'

export const documentsApi = {
  async list({ category = null, grade = null } = {}) {
    let query = supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (grade) query = query.eq('grade', grade)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async create(doc) {
    const { data, error } = await supabase
      .from('documents')
      .insert(doc)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from('documents').delete().eq('id', id)
    if (error) throw error
  },
}