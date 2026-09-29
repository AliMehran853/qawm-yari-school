import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // فقط محتوای اصلی را به بالا برگردان
    const main = document.querySelector('main')
    if (main) {
      main.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
    // و window هم برای اطمینان
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}