import { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import type { User } from '../../types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: user, isLoading } = useQuery<User>({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/users/me');
                return data;
            } catch (error) {
                return null;
            }
        },
        retry: false,
    });

    const login = () => {
        console.log('Login function called!');
        const url = `${import.meta.env.VITE_API_BASE || 'http://localhost:8080'}/oauth2/authorization/github`;
        console.log('Redirecting to:', url);
        window.location.href = url;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user: user || null, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
