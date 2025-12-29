'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { setSecureItem, getSecureItem, removeSecureItem } from '../libs/storeItem';

interface User {
    username: string;
    email: string;
    token: string;
}

interface LoginResponse {
    user: {
        username?: string;
        email?: string;
        token?: string;
    };
    [key: string]: any;
}

interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
    login: (userData: LoginResponse) => void;
    logout: () => void;
}

const emptyUser: User = {
    email: '',
    token: '',
    username: ''
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_DURATION_HOURS = parseInt(process.env.NEXT_PUBLIC_SESSION_DURATION_HOURS || '24', 10);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User>(emptyUser);
    const router = useRouter();

    useEffect(() => {
        const expiry = getSecureItem('expiry');
        const token = getSecureItem('token') ?? '';
        const username = getSecureItem('username') ?? '';
        const email = getSecureItem('email') ?? '';

        if (token && email && username) {
            setUser({ username, email, token });
            setIsLoggedIn(true);
        }
    }, []);

    // ss-tab logout sync
    useEffect(() => {
        const syncLogout = (event: StorageEvent) => {
            if (event.key === 'logout-event') {
                setUser(emptyUser);
                setIsLoggedIn(false);
                router.replace('/login');
            }
        };
        window.addEventListener('storage', syncLogout);
        return () => window.removeEventListener('storage', syncLogout);
    }, [router]);

    const login = (userData: LoginResponse) => {
        const username = userData.user.username ?? '';
        const token = userData.user.token ?? '';
        const email = userData.user.email ?? '';
        const expiry = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 1000).toISOString();

        setSecureItem('username', username);
        setSecureItem('email', email);
        setSecureItem('token', token);
        setSecureItem('expiry', expiry);

        setUser({ username, email, token });
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(emptyUser);
        removeSecureItem('username');
        removeSecureItem('email');
        removeSecureItem('token');
        removeSecureItem('expiry');
        localStorage.setItem('logout-event', Date.now().toString());
        router.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};