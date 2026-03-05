import { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../lib/adminAxios';
import toast from 'react-hot-toast';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAdmin = async () => {
        try {
            const res = await adminApi.get('/api/admin/me');
            setAdmin(res.data);
        } catch {
            localStorage.removeItem('admin_token');
            setAdmin(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) fetchAdmin();
        else setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const res = await adminApi.post('/api/admin/login', { email, password });
            localStorage.setItem('admin_token', res.data.access_token);
            setAdmin(res.data.admin);
            toast.success('Welcome back, Admin!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed.');
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try { await adminApi.post('/api/admin/logout'); } catch { }
        localStorage.removeItem('admin_token');
        setAdmin(null);
        toast.success('Logged out.');
    };

    return (
        <AdminAuthContext.Provider value={{ admin, isLoading, login, logout, fetchAdmin }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
