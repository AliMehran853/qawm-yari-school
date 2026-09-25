import { supabase } from '../../lib/supabase'

export const subjectsApi = {
  async list(grade = null) {
    let query = supabase
      .from('subjects')
      .select('*')
      .order('grade', { ascending: true })
      .order('name', { ascending: true })

    if (grade) query = query.eq('grade', grade)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async get(id) {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(subject) {
    const { data, error } = await supabase
      .from('subjects')
      .insert(subject)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) throw error
  },
}