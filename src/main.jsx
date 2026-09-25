import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import './index.css'

// ─── ثبت Service Worker ───
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('نسخه جدید در دسترس است')
  },
  onOfflineReady() {
    console.log('برنامه آماده استفاده آفلاین است')
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)