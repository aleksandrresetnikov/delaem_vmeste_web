import type {Session} from '../../generated/prisma';
import prisma from "../util/prisma.ts";

export class SessionProvider {
  static async createSession(data: {
    jwt: string;
    userAgent: string;
    ip: string;
    userId?: number;
  }): Promise<Session> {
    return prisma.session.create({
      data
    });
  }

  static async findActiveSession(jwt: string): Promise<Session | null> {
    return prisma.session.findFirst({
      where: {jwt, state: true}
    });
  }

  static async deactivateSession(id: number): Promise<Session> {
    return prisma.session.update({
      where: {id},
      data: {state: false}
    });
  }

  static async deactivateAllUserSessions(userId: number) {
    await prisma.session.updateMany({
      where: {userId, state: true},
      data: {state: false}
    });
  }
}