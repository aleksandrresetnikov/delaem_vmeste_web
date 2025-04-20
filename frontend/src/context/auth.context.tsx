"use client";
import React, {createContext, ReactNode, useState} from 'react';
import {IUser} from "@/types/user.interface";
import {fetchProfile} from "@/api/profile";
import {useAsync} from "react-use";

interface AuthContextType {
  user: IUser | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  updateProfile: () => Promise<IUser | boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Обновить данные профиля
  const updateProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) setLoading(false);

    try {
      const response = await fetchProfile();
      setUser(response.data);
      setLoading(false);
      return response.data;
    } catch (e) {
      console.error(e);
      setUser(null);
      setLoading(false);
      return false;
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
  useAsync(updateProfile, []);

  // Результат - контекст
  return (
      <AuthContext.Provider value={{user, login, logout, loading, updateProfile}}>
        {children}
      </AuthContext.Provider>
  );
};

export default AuthContext;