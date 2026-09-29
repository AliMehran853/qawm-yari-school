import { supabase } from '../../lib/supabase'

const PAGE_SIZE = 24

export const galleryApi = {
  // خواندن لیست با صفحه‌بندی
  async list({ category = null, page = 0, pageSize = PAGE_SIZE } = {}) {
    const from = page * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('gallery')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (category) query = query.eq('category', category)

    const { data, error, count } = await query
    if (error) throw error
    return { items: data || [], total: count || 0 }
  },

  // فقط شمارش کل و هر دسته (برای نمایش شمارنده‌ها)
  async counts() {
    const { data, error } = await supabase
      .from('gallery')
      .select('category')
    if (error) throw error

    const counts = { all: 0 }
    data.forEach((item) => {
      counts.all += 1
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    return counts
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

export { PAGE_SIZE }