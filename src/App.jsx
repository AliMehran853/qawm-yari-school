import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'

import QueryProvider from './app/providers/QueryProvider'
import AuthProvider from './app/providers/AuthProvider'
import ProtectedRoute from './app/ProtectedRoute'
import PublicLayout from './app/public/PublicLayout'

import Login from './pages/Login'
import HomePage from './features/public/pages/HomePage'
import AboutPage from './features/public/pages/AboutPage'
import StaffPage from './features/public/pages/StaffPage'
import PublicClassesPage from './features/public/pages/PublicClassesPage'
import NewsPage from './features/public/pages/NewsPage'
import PhotosPage from './features/public/pages/PhotosPage'
import LibraryPage from './features/public/pages/LibraryPage'
import ContactPage from './features/public/pages/ContactPage'

import Dashboard from './features/dashboard/pages/Dashboard'
import SubjectsPage from './features/subjects/pages/SubjectsPage'
import ClassesPage from './features/classes/pages/ClassesPage'
import TeachersPage from './features/teachers/pages/TeachersPage'
import StudentsPage from './features/students/pages/StudentsPage'
import AssignmentsPage from './features/assignments/pages/AssignmentsPage'
import GradesEntryPage from './features/grades/pages/GradesEntryPage'
import ReportCardPage from './features/grades/pages/ReportCardPage'
import AttendanceEntryPage from './features/attendance/pages/AttendanceEntryPage'
import AttendanceReportPage from './features/attendance/pages/AttendanceReportPage'
import AnnouncementsPage from './features/announcements/pages/AnnouncementsPage'
import GalleryPage from './features/gallery/pages/GalleryPage'
import DocumentsPage from './features/documents/pages/DocumentsPage'
import RegistrationsPage from './features/registrations/pages/RegistrationsPage'
import PromotionPage from './features/promotion/pages/PromotionPage'
import BackupPage from './features/backup/pages/BackupPage'
import SettingsPage from './features/settings/pages/SettingsPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/classes" element={<PublicClassesPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      <Route path="/panel/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/panel/subjects" element={<ProtectedRoute allow={['admin']}><SubjectsPage /></ProtectedRoute>} />
      <Route path="/panel/classes" element={<ProtectedRoute allow={['admin']}><ClassesPage /></ProtectedRoute>} />
      <Route path="/panel/teachers" element={<ProtectedRoute allow={['admin']}><TeachersPage /></ProtectedRoute>} />
      <Route path="/panel/students" element={<ProtectedRoute allow={['admin']}><StudentsPage /></ProtectedRoute>} />
      <Route path="/panel/assignments" element={<ProtectedRoute allow={['admin']}><AssignmentsPage /></ProtectedRoute>} />
      <Route path="/panel/grades-entry" element={<ProtectedRoute allow={['admin']}><GradesEntryPage /></ProtectedRoute>} />
      <Route path="/panel/report-card" element={<ProtectedRoute allow={['admin']}><ReportCardPage /></ProtectedRoute>} />
      <Route path="/panel/attendance" element={<ProtectedRoute allow={['admin']}><AttendanceEntryPage /></ProtectedRoute>} />
      <Route path="/panel/attendance-report" element={<ProtectedRoute allow={['admin']}><AttendanceReportPage /></ProtectedRoute>} />
      <Route path="/panel/announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
      <Route path="/panel/gallery" element={<ProtectedRoute allow={['admin']}><GalleryPage /></ProtectedRoute>} />
      <Route path="/panel/documents" element={<ProtectedRoute allow={['admin']}><DocumentsPage /></ProtectedRoute>} />
      <Route path="/panel/registrations" element={<ProtectedRoute allow={['admin']}><RegistrationsPage /></ProtectedRoute>} />
      <Route path="/panel/promotion" element={<ProtectedRoute allow={['admin']}><PromotionPage /></ProtectedRoute>} />
      <Route path="/panel/backup" element={<ProtectedRoute allow={['admin']}><BackupPage /></ProtectedRoute>} />
      <Route path="/panel/settings" element={<ProtectedRoute allow={['admin']}><SettingsPage /></ProtectedRoute>} />

      <Route path="/panel" element={<Navigate to="/panel/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <Toaster position="top-center" richColors />
          <AppRoutes />
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  )
}