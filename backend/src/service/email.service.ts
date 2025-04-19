import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  // @ts-ignore
  host: process.env.SMTP_HOST || "",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_LOGIN || "", // ваш email
    pass: process.env.SMTP_PASSWORD || "" // новый пароль приложения
  }
});

export class EmailService {
  // Отправить письмо
  static sendMail = async (to: string, subject: string, text: string) => {
    const mailOptions = {
      from: process.env.SMTP_LOGIN,
      to: to,
      subject: subject,
      html: text
    };

    try {
      await transport.sendMail(mailOptions);
      console.log(`Письмо отправлено на ${to}`);
      return true;
    } catch (e) {
      console.error('Ошибка при отправке письма');
      console.error(e);
      return false;
    }
  }
}