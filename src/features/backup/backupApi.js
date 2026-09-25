import { supabase } from '../../lib/supabase'
import { format } from 'date-fns-jalali'

// ترتیب مهم است — به دلیل foreign key ها
const TABLES = [
  'settings',
  'classes',
  'subjects',
  'teachers',
  'students',
  'teacher_subjects',
  'grades',
  'attendance',
  'announcements',
  'gallery',
  'documents',
  'registrations',
]

export const backupApi = {
  // ─── خروجی ───
  async export() {
    const data = {}
    const errors = []

    for (const table of TABLES) {
      const { data: rows, error } = await supabase.from(table).select('*')
      if (error) {
        errors.push(`${table}: ${error.message}`)
        continue
      }
      data[table] = rows || []
    }

    if (errors.length > 0) {
      console.warn('خطا در بعضی جدول‌ها:', errors)
    }

    const backup = {
      _meta: {
        version: 1,
        app: 'qawm-yari-school',
        exported_at: new Date().toISOString(),
        exported_at_jalali: format(new Date(), 'yyyy/MM/dd HH:mm'),
        tables_count: TABLES.length,
        records_count: Object.values(data).reduce(
          (sum, rows) => sum + rows.length,
          0
        ),
        tables: TABLES,
      },
      data,
    }

    return backup
  },

  // ─── دانلود فایل ───
  download(backup) {
    const json = JSON.stringify(backup, null, 2)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const dateStr = format(new Date(), 'yyyy-MM-dd_HH-mm')
    const filename = `qawm-yari-backup_${dateStr}.json`

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return filename
  },

  // ─── اعتبارسنجی فایل ───
  validate(backup) {
    if (!backup || typeof backup !== 'object') {
      throw new Error('فایل نامعتبر است')
    }
    if (!backup._meta || !backup._meta.app) {
      throw new Error('این فایل مربوط به سیستم مکتب نیست')
    }
    if (backup._meta.app !== 'qawm-yari-school') {
      throw new Error('این فایل از سیستم دیگری است')
    }
    if (!backup.data || typeof backup.data !== 'object') {
      throw new Error('داده‌ها در فایل پیدا نشد')
    }

    const available = Object.keys(backup.data).filter((k) =>
      TABLES.includes(k)
    )
    if (available.length === 0) {
      throw new Error('هیچ جدول شناخته‌شده‌ای در فایل نیست')
    }

    return {
      meta: backup._meta,
      tables: available,
      counts: Object.fromEntries(
        available.map((t) => [t, (backup.data[t] || []).length])
      ),
    }
  },

  // ─── ورود داده‌ها ───
  async import(backup, onProgress = () => {}) {
    const available = Object.keys(backup.data).filter((k) =>
      TABLES.includes(k)
    )

    // ۱. پاک کردن همه جدول‌ها (به ترتیب معکوس برای FK)
    onProgress({ step: 'clear', current: 0, total: available.length })

    // ترتیب معکوس برای حذف (child قبل از parent)
    const reverseOrder = [...TABLES].reverse()
    for (const table of reverseOrder) {
      if (!available.includes(table)) continue

      // settings را نمی‌توان حذف کرد (فقط یک ردیف) — فقط آپدیت می‌شود
      if (table === 'settings') continue

      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (error) {
        console.error(`خطا در پاک کردن ${table}:`, error)
        throw new Error(`خطا در پاک کردن ${table}: ${error.message}`)
      }
    }

    // ۲. درج داده‌های جدید
    let current = 0
    for (const table of TABLES) {
      if (!available.includes(table)) continue
      const rows = backup.data[table] || []
      current++
      onProgress({ step: 'insert', current, total: available.length, table })

      if (rows.length === 0) continue

      if (table === 'settings') {
        // settings را آپدیت کن (نه insert)
        const s = rows[0]
        if (s) {
          const { id, ...rest } = s
          const { error } = await supabase
            .from('settings')
            .update(rest)
            .eq('id', 1)
          if (error) {
            throw new Error(`خطا در بازگردانی تنظیمات: ${error.message}`)
          }
        }
        continue
      }

      // درج در دسته‌های کوچک (برای جلوگیری از محدودیت)
      const chunkSize = 100
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize)
        const { error } = await supabase.from(table).insert(chunk)
        if (error) {
          console.error(`خطا در درج ${table}:`, error)
          throw new Error(`خطا در بازگردانی ${table}: ${error.message}`)
        }
      }
    }

    onProgress({ step: 'done', current: available.length, total: available.length })
    return true
  },
}