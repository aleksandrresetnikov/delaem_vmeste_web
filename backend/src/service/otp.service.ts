import prisma from "../util/prisma.ts";
import {UserProvider} from "../providers/user.provider.ts";
import {clearTimeout} from "node:timers";
import {EmailService} from "./email.service.ts";

let codeExpireTimeouts: any = {};

export class OTPService {
  // Создать OTP-код по E-Mail
  static generate = async (email: string) => {
    const code = OTPService.getRandom();

    // Через 60 секунд код становится невалидным
    (function (email: string) {
      codeExpireTimeouts[email] = setTimeout(() => {
        OTPService.makeLastCodeExpired(email);
      }, 1000 * 60) // 60 секунд
    })(email);

    const user = await UserProvider.getByEmail(email);
    if (!user) return false;

    // Создаём код
    const otp = await prisma.otp.create({
      data: {
        userId: user.id,
        code
      },
    });
    if (!otp) return false;

    let codeText = otp.code;

    // Отправляем код на почту
    await EmailService.sendMail(email, "Вместе Лучше", `Ваш код для входа в сервис\n<h2>${codeText}</h2>\nОн действителен только 60 секунд\nПосле этого используйте кнопку на странице для генерации нового кода`)

    // Возвращаем код
    return otp.code;
  }

  // Сделать последний код пользователя неактивным
  static makeLastCodeExpired = async (email: string) => {
    // Очищаем таймаут 60 сек
    if (codeExpireTimeouts[email]) clearTimeout(codeExpireTimeouts[email]);

    return await prisma.otp.updateMany({
      where: {
        user: {
          email
        }
      },
      data: {
        expired: true
      }
    });
  }

  // Сгенерировать рандомный OTP
  static getRandom = () => {
    const MIN = 1000;
    const MAX = 9999;

    const minCeiled = Math.ceil(MIN);
    const maxFloored = Math.floor(MAX);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
  }

  // Проверка OTP-кода
  static verifyOTP = async (email: string, code: number) => {
    const user = await UserProvider.getByEmail(email);
    if (!user) return false;

    // Находим последний активный код для пользователя
    const otp = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        code,
        expired: false,
      },
    });
    if (!otp) return false;

    // Удаляем последний активный код, если авторизация прошла успешно
    await OTPService.makeLastCodeExpired(email);

    return true; // Возвращаем true, если код валидный
  }

  // Проверить, истек ли срок действия OTP-кода
  static isCodeExpired = (expirationDate: Date) => {
    return expirationDate < new Date();
  }
}