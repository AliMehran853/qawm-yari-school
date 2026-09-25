import { supabase } from '../../lib/supabase'

export const classesApi = {
  async list(year = null) {
    let query = supabase
      .from('classes')
      .select('*')
      .order('grade', { ascending: true })

    if (year) query = query.eq('year', year)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async get(id) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(cls) {
    const { data, error } = await supabase
      .from('classes')
      .insert(cls)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from('classes').delete().eq('id', id)
    if (error) throw error
  },
}