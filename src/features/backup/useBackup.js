import { useState } from 'react'
import { toast } from 'sonner'
import { backupApi } from './backupApi'

export function useBackup() {
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(null)

  async function exportBackup() {
    setExporting(true)
    try {
      const backup = await backupApi.export()
      const filename = backupApi.download(backup)
      toast.success(`پشتیبان دانلود شد: ${filename}`)
      return backup
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'خطا در پشتیبان‌گیری')
      return null
    } finally {
      setExporting(false)
    }
  }

  async function importBackup(backup, onBeforeImport) {
    setImporting(true)
    setProgress({ step: 'start', current: 0, total: 0 })

    try {
      // ─── قبل از پاک کردن، یک backup از وضعیت فعلی بگیر ───
      toast.info('ابتدا از وضعیت فعلی پشتیبان گرفته می‌شود...')
      const currentBackup = await backupApi.export()
      backupApi.download(currentBackup)
      toast.success('پشتیبان وضعیت فعلی دانلود شد')

      // ─── ورود داده‌های جدید ───
      await backupApi.import(backup, setProgress)

      toast.success('بازگردانی با موفقیت انجام شد')
      return true
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'خطا در بازگردانی')
      return false
    } finally {
      setImporting(false)
      setProgress(null)
    }
  }

  return {
    exportBackup,
    importBackup,
    exporting,
    importing,
    progress,
  }
}