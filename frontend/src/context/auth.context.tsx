"use client";
import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {IUser} from "@/types/user.interface";
import {fetchProfile} from "@/api/profile";

interface AuthContextType {
  user: IUser | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  updateProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Обновить данные профиля
  const updateProfile = () => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile()
          .then((response) => {
            setUser(response.data);
          })
          .catch(() => {
            // Не получилось
            setUser(null);
          })
          .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }

  // Вход в аккаунт
  const login = (token: string) => {
    localStorage.setItem('token', token);
  };

  // Выйти из аккаунта
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = "/";
  };

  // Получаем профиль при загрузке страницы
  useEffect(updateProfile, []);

  // Результат - контекст
  return (
      <AuthContext.Provider value={{user, login, logout, loading, updateProfile}}>
        {children}
      </AuthContext.Provider>
  );
};

export default AuthContext;