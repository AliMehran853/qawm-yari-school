import { supabase } from '../../lib/supabase'

export const teachersApi = {
  async list() {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
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