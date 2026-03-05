import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Partners from './pages/partners/Partners'
import Features from './pages/features/Features'
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import Dashboard from './pages/dashboard/Dashboard'
import VerifyKorapay from './pages/dashboard/VerifyKorapay'

import { AdminAuthProvider } from './context/AdminAuthContext'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/features" element={<Features />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/password-reset/:token" element={<ResetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Legacy /dashboard redirect handled by shell */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Wallet Verification Callback */}
      <Route path="/dashboard/wallet/verify-korapay" element={<VerifyKorapay />} />

      {/* User Dashboard Routes — each section has its own URL */}
      <Route path="/user/dashboard" element={<Dashboard initialSection="overview" />} />
      <Route path="/user/fund-wallet" element={<Dashboard initialSection="fund-wallet" />} />
      <Route path="/user/rent-number" element={<Dashboard initialSection="rent-number" />} />
      <Route path="/user/purchase-history" element={<Dashboard initialSection="purchase-history" />} />
      <Route path="/user/transactions" element={<Dashboard initialSection="transactions" />} />
      <Route path="/user/services" element={<Dashboard initialSection="services" />} />
      <Route path="/user/support" element={<Dashboard initialSection="support" />} />
      <Route path="/user/settings" element={<Dashboard initialSection="settings" />} />

      {/* ─── Admin Routes ─────────────────────────────── */}
      <Route path="/admin/login" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
      <Route path="/admin/dashboard" element={<AdminAuthProvider><AdminDashboard initialSection="overview" /></AdminAuthProvider>} />
      <Route path="/admin/services" element={<AdminAuthProvider><AdminDashboard initialSection="services" /></AdminAuthProvider>} />
      <Route path="/admin/countries" element={<AdminAuthProvider><AdminDashboard initialSection="countries" /></AdminAuthProvider>} />
      <Route path="/admin/users" element={<AdminAuthProvider><AdminDashboard initialSection="users" /></AdminAuthProvider>} />
      <Route path="/admin/orders" element={<AdminAuthProvider><AdminDashboard initialSection="orders" /></AdminAuthProvider>} />
      <Route path="/admin/fund-requests" element={<AdminAuthProvider><AdminDashboard initialSection="fund-requests" /></AdminAuthProvider>} />
      <Route path="/admin/settings" element={<AdminAuthProvider><AdminDashboard initialSection="settings" /></AdminAuthProvider>} />
    </Routes>
  )
}

