import { Navigate, Route, Routes } from 'react-router-dom'

import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ActivityLogsPage } from './pages/ActivityLogsPage'
import { CompaniesPage } from './pages/CompaniesPage'
import { CompanyDetailPage } from './pages/CompanyDetailPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/activity-logs" element={<ActivityLogsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
