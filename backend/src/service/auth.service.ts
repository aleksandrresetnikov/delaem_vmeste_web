import {UserProvider} from "../providers/user.provider";
import {OTPService} from "./otp.service";
import {AuthProvider} from "../providers/auth.provider";

export class AuthService {
  // Ограничение прав для пользователей без заполненного профиля
  static checkFullUserRules = async (userId: number) => {
    const userData = await UserProvider.getByID(userId);

    return userData && userData.birthDate && userData.fullname &&
        userData.username && userData.role;
  }

  // Вход в аккаунт
  static login = async (email: string) => {
    const userData = await UserProvider.getByEmail(email);
    if (!userData) await UserProvider.addNew(email);

    // Удаляем старый код
    await OTPService.makeLastCodeExpired(email);

    // Генерируем новый
    await OTPService.generate(email);
  }

  // Создать сессию
  static createSession = async (jwt: string, userAgent: string, ip: string, userId: number) => {
    return AuthProvider.createSession(jwt, userAgent, ip, userId);
  }
}