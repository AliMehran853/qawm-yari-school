import { supabase } from './supabase'

const BUCKET = 'images'

export async function uploadFile(file, folder = 'general') {
  const ext = file.name.split('.').pop().toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const filename = `${timestamp}-${random}.${ext}`
  const path = `${folder}/${filename}`

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type,
    })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path)

  return {
    url: urlData.publicUrl,
    path: data.path,
  }
}

export async function deleteFile(urlOrPath) {
  if (!urlOrPath) return

  let filePath = urlOrPath

  if (urlOrPath.startsWith('http')) {
    const match = urlOrPath.match(/\/images\/(.+?)(\?|$)/)
    if (match) filePath = match[1]
  }

  const { error } = await supabase.storage.from(BUCKET).remove([filePath])
  if (error) throw error
}

export async function countFilesInFolder(folder) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(folder, { limit: 1000 })
  if (error) throw error
  return (data || []).length
}