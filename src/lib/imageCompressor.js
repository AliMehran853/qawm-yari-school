/**
 * فشرده‌سازی عکس در مرورگر قبل از آپلود
 */

export async function compressImage(
  file,
  {
    maxWidth = 1920,
    maxHeight = 1920,
    maxSizeKB = 500,
    quality = 0.85,
    outputFormat = 'image/jpeg',
  } = {}
) {
  // اگر فایل خودش کم‌حجم است
  if (file.size <= maxSizeKB * 1024) {
    return file
  }

  const dataUrl = await fileToDataUrl(file)
  const img = await loadImage(dataUrl)

  let { width, height } = img
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // پس‌زمینه سفید (برای PNG شفاف)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  ctx.drawImage(img, 0, 0, width, height)

  let currentQuality = quality
  let blob = await canvasToBlob(canvas, outputFormat, currentQuality)

  while (blob.size > maxSizeKB * 1024 && currentQuality > 0.3) {
    currentQuality -= 0.1
    blob = await canvasToBlob(canvas, outputFormat, currentQuality)
  }

  const baseName = file.name.replace(/\.[^.]+$/, '')
  const newFile = new File([blob], `${baseName}.jpg`, {
    type: outputFormat,
  })

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

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}