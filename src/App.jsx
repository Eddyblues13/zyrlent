import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Partners from './pages/partners/Partners'
import Features from './pages/features/Features'
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword' // existing
import ResetPassword from './pages/auth/ResetPassword'
import Dashboard from './pages/dashboard/Dashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/features" element={<Features />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/password-reset/:token" element={<ResetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}
