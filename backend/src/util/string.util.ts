export class StringUtil {
  // Генерация рандомной строки
  static generateRandomString = (minLength: number, maxLength?: number): string => {
    if (minLength < 0 || (maxLength !== undefined && maxLength < 0)) {
      throw new Error('Длина строки не может быть отрицательной');
    }

    if (maxLength !== undefined && minLength > maxLength) {
      throw new Error('Минимальная длина не может быть больше максимальной');
    }

    const targetLength = maxLength === undefined
        ? minLength
        : Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < targetLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }
}