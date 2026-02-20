import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await api.get('/api/user');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('auth_token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await api.post('/api/login', { email, password });
            localStorage.setItem('auth_token', response.data.access_token);
            setUser(response.data.user);
            toast.success('Logged in successfully!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, phone, password, password_confirmation) => {
        setIsLoading(true);
        try {
            const response = await api.post('/api/register', {
                name,
                email,
                phone,
                password,
                password_confirmation,
            });
            localStorage.setItem('auth_token', response.data.access_token);
            setUser(response.data.user);
            toast.success('Registration successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        setIsLoading(true);
        try {
            const response = await api.post('/api/forgot-password', { email });
            toast.success(response.data.message || 'Reset link sent to your email!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset link.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (email, token, password, password_confirmation) => {
        setIsLoading(true);
        try {
            const response = await api.post('/api/reset-password', {
                email,
                token,
                password,
                password_confirmation
            });
            toast.success(response.data.message || 'Password reset successfully. You can now login.');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await api.post('/api/logout');
        } catch (error) {
            console.error('Logout error UI side', error);
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);
            toast.success('Logged out.');
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, fetchUser, forgotPassword, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
