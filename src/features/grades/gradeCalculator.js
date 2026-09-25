import { GRADING } from '../../lib/constants'

// محاسبه مجموع دو دور
export function getTotal(firstScore, finalScore) {
  const f = Number(firstScore) || 0
  const s = Number(finalScore) || 0
  return f + s
}

// آیا کامیاب است؟
export function isPassed(total) {
  return total >= GRADING.passScore
}

// سطح نمره
export function getLevel(total) {
  if (total >= GRADING.levels.excellent.min) return GRADING.levels.excellent
  if (total >= GRADING.levels.good.min) return GRADING.levels.good
  if (total >= GRADING.levels.acceptable.min) return GRADING.levels.acceptable
  return GRADING.levels.failed
}

// محاسبه معدل از لیست نمرات
export function calcAverage(grades) {
  if (!grades || grades.length === 0) return 0
  const sum = grades.reduce((acc, g) => {
    return acc + getTotal(g.first_score, g.final_score)
  }, 0)
  return sum / grades.length
}

// تعداد کامیاب و ناکام
export function countStatus(grades) {
  let passed = 0
  let failed = 0
  grades.forEach((g) => {
    if (isPassed(getTotal(g.first_score, g.final_score))) passed++
    else failed++
  })
  return { passed, failed, total: grades.length }
}

// رتبه‌بندی
export function calcRank(studentAvg, allAverages) {
  const sorted = [...allAverages].sort((a, b) => b - a)
  const rank = sorted.findIndex((a) => Math.abs(a - studentAvg) < 0.01) + 1
  return rank || sorted.length
}