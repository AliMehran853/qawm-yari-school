/**
 * فشرده‌سازی عکس در مرورگر
 * بهینه‌شده برای موبایل — با timeout و progress
 */

export async function compressImage(
  file,
  {
    maxWidth = 1600,
    maxHeight = 1600,
    maxSizeKB = 500,
    quality = 0.85,
    outputFormat = 'image/jpeg',
    onProgress = () => {},
  } = {}
) {
  // اگر فایل کوچک است، دست نزن
  if (file.size <= maxSizeKB * 1024) {
    onProgress({ step: 'skip', percent: 100 })
    return file
  }

  onProgress({ step: 'reading', percent: 10 })

  // ─── خواندن فایل (با timeout برای موبایل‌های کند) ───
  const dataUrl = await fileToDataUrlWithTimeout(file, 30000)

  onProgress({ step: 'loading', percent: 30 })

  const img = await loadImageWithTimeout(dataUrl, 20000)

  onProgress({ step: 'processing', percent: 50 })

  // ─── محاسبه ابعاد جدید ───
  let { width, height } = img
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  // ─── رسم روی canvas ───
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // پس‌زمینه سفید (برای PNG شفاف)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  // بهبود کیفیت
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  ctx.drawImage(img, 0, 0, width, height)

  onProgress({ step: 'compressing', percent: 70 })

  // ─── فشرده‌سازی با کیفیت‌های مختلف ───
  let currentQuality = quality
  let blob = await canvasToBlob(canvas, outputFormat, currentQuality)

  // اگر Blob خالی بود، خطا
  if (!blob) {
    throw new Error('خطا در فشرده‌سازی عکس')
  }

  let attempts = 0
  const maxAttempts = 8

  while (
    blob.size > maxSizeKB * 1024 &&
    currentQuality > 0.3 &&
    attempts < maxAttempts
  ) {
    currentQuality -= 0.1
    attempts++
    const newBlob = await canvasToBlob(canvas, outputFormat, currentQuality)
    if (newBlob) blob = newBlob
  }

  onProgress({ step: 'done', percent: 90 })

  // ─── ساخت File جدید ───
  const baseName = file.name.replace(/\.[^.]+$/, '')
  const newFile = new File([blob], `${baseName}.jpg`, {
    type: outputFormat,
  })

  onProgress({ step: 'done', percent: 100 })

  return newFile
}

export function validateImageFile(file, { maxInputMB = 10 } = {}) {
  if (!file) {
    return { valid: false, error: 'فایلی انتخاب نشده' }
  }

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'فقط فایل عکس مجاز است' }
  }

  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    return { valid: false, error: 'فرمت مجاز: JPG، PNG یا WebP' }
  }

  if (file.size > maxInputMB * 1024 * 1024) {
    return {
      valid: false,
      error: `حجم فایل باید کمتر از ${maxInputMB} مگابایت باشد`,
    }
  }

  return { valid: true }
}

// ─── توابع کمکی با timeout ───

function fileToDataUrlWithTimeout(file, timeoutMs) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    const timeout = setTimeout(() => {
      reader.abort()
      reject(new Error('زمان خواندن فایل به پایان رسید — لطفاً دوباره تلاش کن'))
    }, timeoutMs)

    reader.onload = (e) => {
      clearTimeout(timeout)
      resolve(e.target.result)
    }

    reader.onerror = () => {
      clearTimeout(timeout)
      reject(new Error('خطا در خواندن فایل'))
    }

    reader.readAsDataURL(file)
  })
}

function loadImageWithTimeout(src, timeoutMs) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    const timeout = setTimeout(() => {
      reject(new Error('زمان بارگذاری عکس به پایان رسید'))
    }, timeoutMs)

    img.onload = () => {
      clearTimeout(timeout)
      resolve(img)
    }

    img.onerror = () => {
      clearTimeout(timeout)
      reject(new Error('خطا در بارگذاری عکس'))
    }

    img.src = src
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    try {
      canvas.toBlob(
        (blob) => resolve(blob),
        type,
        quality
      )
    } catch (e) {
      resolve(null)
    }
  })
}