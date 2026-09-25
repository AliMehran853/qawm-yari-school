export function normalizeWhatsApp(phone) {
  if (!phone) return null
  let p = String(phone).replace(/\D/g, '')
  if (!p) return null

  if (p.startsWith('0093')) p = p.slice(4)
  if (p.startsWith('0')) p = '93' + p.slice(1)
  if (!p.startsWith('93')) p = '93' + p
  if (p.length < 11) return null

  return p
}

export function openWhatsApp(phone, message) {
  const normalized = normalizeWhatsApp(phone)
  const text = encodeURIComponent(message || '')

  if (normalized) {
    window.open(`https://wa.me/${normalized}?text=${text}`, '_blank')
  } else {
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }
}

export function buildAnnouncementMessage({ title, body, schoolName, siteUrl }) {
  const lines = []
  if (schoolName) lines.push(`*${schoolName}*`)
  lines.push('')
  lines.push(`*${title}*`)
  lines.push('')
  lines.push(body)
  if (siteUrl) {
    lines.push('')
    lines.push('—')
    lines.push(`جزئیات بیشتر در سایت مکتب:`)
    lines.push(siteUrl)
  }
  return lines.join('\n')
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}