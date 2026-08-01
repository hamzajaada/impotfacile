import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import DeclarationPage from './pages/DeclarationPage'
import AdvisorDashboardPage from './pages/AdvisorDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminFormConfigPage from './pages/AdminFormConfigPage'
import PricingPage from './pages/PricingPage'
import BlogPage from './pages/BlogPage'
import ContactPage from './pages/ContactPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

export default function App() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      {!isLanding && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tarifs" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['CLIENT']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/declaration/:id?"
            element={
              <ProtectedRoute roles={['CLIENT']}>
                <DeclarationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/conseiller"
            element={
              <ProtectedRoute roles={['ADVISOR']}>
                <AdvisorDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/formulaire"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminFormConfigPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isLanding && <Footer />}
    </div>
  )
}
