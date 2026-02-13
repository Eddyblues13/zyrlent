import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Partners from './pages/partners/Partners'
import Features from './pages/features/Features'
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/features" element={<Features />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  )
}
