import type {User} from "../../generated/prisma/index";
import {UserProvider} from "../providers/user.provider.ts";

const SKIPPABLE_PATHS = ["/api/auth/"];

export const authorizationMiddleware = async (ctx: any) => {
  const pathSplit = ctx.path.split("/");

  // Пропускаем, если это не запрос к API
  if (pathSplit.length >= 2 && pathSplit[1] !== "api") return true;

  // Пропускаем, если это вход/регистрация
  if (SKIPPABLE_PATHS.includes(ctx.path)) return true;

  // Пропускаем, если это не запрос к Auth API/Profile API
  if (pathSplit.length >= 3 && pathSplit[2] !== "auth" && pathSplit[2] !== "profile" && pathSplit[2] !== "orders") return true;

  // Проверяем хидер
  if (!ctx.headers["authorization"]) return false;

  // Имя профиля
  if (!ctx.jwt) return false;
  const {email} = await ctx.jwt.verify(ctx.headers["authorization"]);

  // Получаем профиль
  let userData = await UserProvider.getByEmail(email);
  if (userData) return true;

  // Если проверка не прошла
  return false;
}

// Создать токен для юзера
export const createUserData = async (ctx: any, email: string) => {
  if (!ctx.jwt) return false;

  // Подписываем JWT-токен
  let token = await ctx.jwt.sign({email});
  if (!token) return false;

  return token;
}

// Получить данные юзера из хидеров
export const getUserData = async (ctx: any): Promise<User | false> => {
  if (!ctx.jwt) return false;

  const {email} = await ctx.jwt.verify(ctx.headers["authorization"]);
  if (!email) return false;

  // Получаем профиль
  const userData = await UserProvider.getByEmail(email);
  if (!userData) return false;

  return userData;
}