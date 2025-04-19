import axios from '../lib/axios';

export interface LoginData {
  email: string;
}

export interface VerifyData {
  email: string;
  otp: number;
}

// Авторизация (отправка OTP)
export const fetchLogin = async (userData: LoginData) => {
  return await axios.post("/auth/login", userData);
}

// Верификация OTP
export const fetchVerify = async (userData: VerifyData) => {
  return await axios.post("/auth/verify", userData);
}