import db from "../util/prisma.ts";

export class AuthProvider {
  static createSession = async (jwt: string, userAgent: string, ip: string, userId: number) => {
    return await db.session.create(
        {
          data: {
            jwt,
            userAgent,
            ip,
            userId
          }
        }
    ) || false;
  }
}