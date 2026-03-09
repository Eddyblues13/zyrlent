import { useState, useEffect } from 'react'
import {
    User, Lock, Save, Loader2, Eye, EyeOff, CheckCircle,
    ShieldCheck, Mail, Pencil
} from 'lucide-react'
import { useAdminAuth } from '../../../context/AdminAuthContext'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

export default function AdminProfileSection() {
    const { admin } = useAdminAuth()

    // Profile form
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [profileSaving, setProfileSaving] = useState(false)

    // Password form
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordSaving, setPasswordSaving] = useState(false)

    // Password visibility
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        if (admin) {
            setName(admin.name || '')
            setEmail(admin.email || '')
        }
    }, [admin])

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        if (!name.trim()) return toast.error('Name is required')
        setProfileSaving(true)
        try {
            const r = await adminApi.put('/api/admin/profile', { name, email })
            toast.success(r.data.message)
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to update profile') }
        finally { setProfileSaving(false) }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        if (!currentPassword || !newPassword) return toast.error('Fill in all password fields')
        if (newPassword.length < 8) return toast.error('Password must be at least 8 characters')
        if (newPassword !== confirmPassword) return toast.error('Passwords don\'t match')
        setPasswordSaving(true)
        try {
            const r = await adminApi.put('/api/admin/profile/password', {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
            })
            toast.success(r.data.message)
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password') }
        finally { setPasswordSaving(false) }
    }

    const PasswordInput = ({ value, onChange, placeholder, show, onToggle }) => (
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition"
            />
            <button type="button" onClick={onToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
    )

    return (
        <div className="max-w-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#FF9500]" />
                <h2 className="text-lg font-bold text-white">Account Settings</h2>
            </div>

            {/* Admin Card */}
            <div className="rounded-2xl border border-[rgba(255,149,0,0.12)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex items-center justify-center text-white text-xl font-bold shadow-[0_0_15px_rgba(255,149,0,0.25)] flex-shrink-0">
                    {admin?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                    <p className="text-white font-bold">{admin?.name}</p>
                    <p className="text-sm text-white/40">{admin?.email}</p>
                    <span className="mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,149,0,0.12)] text-[#FF9500] font-bold">
                        {admin?.is_super ? 'SUPER ADMIN' : 'ADMIN'}
                    </span>
                </div>
            </div>

            {/* Profile Form */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
                    <Pencil className="w-4 h-4 text-[#FF9500]" /> Edit Profile
                </h3>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label className="text-xs text-white/40 font-medium mb-1.5 block flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> Name
                        </label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition" />
                    </div>

                    <div>
                        <label className="text-xs text-white/40 font-medium mb-1.5 block flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" /> Email
                        </label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition" />
                    </div>

                    <button type="submit" disabled={profileSaving}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(255,149,0,0.2)] hover:shadow-[0_0_20px_rgba(255,149,0,0.4)] transition disabled:opacity-40">
                        {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Profile
                    </button>
                </form>
            </div>

            {/* Password Form */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
                    <Lock className="w-4 h-4 text-[#FF9500]" /> Change Password
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="text-xs text-white/40 font-medium mb-1.5 block">Current Password</label>
                        <PasswordInput value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password" show={showCurrent} onToggle={() => setShowCurrent(v => !v)} />
                    </div>

                    <div>
                        <label className="text-xs text-white/40 font-medium mb-1.5 block">New Password</label>
                        <PasswordInput value={newPassword} onChange={e => setNewPassword(e.target.value)}
                            placeholder="At least 8 characters" show={showNew} onToggle={() => setShowNew(v => !v)} />
                    </div>

                    <div>
                        <label className="text-xs text-white/40 font-medium mb-1.5 block">Confirm New Password</label>
                        <PasswordInput value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Retype new password" show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-xs text-red-400 mt-1">Passwords don't match</p>
                        )}
                        {newPassword && confirmPassword && newPassword === confirmPassword && (
                            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passwords match</p>
                        )}
                    </div>

                    <button type="submit" disabled={passwordSaving || !currentPassword || !newPassword || newPassword !== confirmPassword}
                        className="w-full py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition disabled:opacity-30">
                        {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    )
}
