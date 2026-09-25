import { supabase } from '../../lib/supabase'

export const announcementsApi = {
  async list() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async get(id) {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(announcement) {
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcement)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async togglePin(id, pinned) {
    const { data, error } = await supabase
      .from('announcements')
      .update({ pinned })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
}