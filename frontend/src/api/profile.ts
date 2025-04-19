import axios from '../lib/axios';
import {IUserRole} from "@/types/user.interface";

export interface ProfileData {
  username: string;
  fullname: string;
  birthDate: string;
  role: IUserRole;
}

// Получение профиля
export const fetchProfile = async () => {
  return await axios.get("/auth/profile");
}

// Обновление данных профиля
export const fetchProfileUpdate = async (userData: ProfileData) => {
  return await axios.post("/auth/profile", userData);
}