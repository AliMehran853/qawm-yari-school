import { supabase } from '../../lib/supabase'

export const galleryApi = {
  async list(category = null) {
    let query = supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async create(item) {
    const { data, error } = await supabase
      .from('gallery')
      .insert(item)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('gallery')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) throw error
  },
}