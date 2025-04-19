import prisma from "../util/prisma.ts";
import type {ChatReview} from '../../generated/prisma';

export class ReviewProvider {
  static async createReview(data: {
    rating: number;
    text?: string;
    userId: number;
    chatId: number;
  }): Promise<ChatReview> {
    return prisma.chatReview.create({
      data
    });
  }

  static async getChatReviews(chatId: number): Promise<ChatReview[]> {
    return prisma.chatReview.findMany({
      where: {chatId},
      include: {user: true}
    });
  }

  static async getUserReviews(userId: number): Promise<ChatReview[]> {
    return prisma.chatReview.findMany({
      where: {userId}
    });
  }

  static async getAverageChatRating(chatId: number): Promise<number> {
    const result = await prisma.chatReview.aggregate({
      where: {chatId},
      _avg: {rating: true}
    });
    return result._avg.rating || 0;
  }
}