import {ChatProvider} from "../providers/chat.provider.ts";
import {ReviewProvider} from "../providers/review.provider.ts";
import {UserProvider} from "../providers/user.provider.ts";

export class ReviewService {
  static createReview = async (rating: number, userId: number, chatId: number, text?: string) => {
    if (!await ChatProvider.hasUserInChat(chatId, userId)) return false;

    await ChatProvider.addMessage(userId, chatId, "STATUS", {
      text: "Поставлена оценка: " + rating
    })

    return await ReviewProvider.createReview({rating, text, userId, chatId});
  }

  static async getChatReviewsWithUsers(chatId: number): Promise<any[]> {
    const reviews = await ReviewProvider.getChatReviews(chatId);
    return Promise.all(reviews.map(async review => ({
      ...review,
      user: await UserProvider.getByID(review.userId)
    })));
  }

  static async getUserReviews(userId: number): Promise<any[]> {
    return ReviewProvider.getUserReviews(userId);
  }

  static async getAverageRating(chatId: number): Promise<{ average: number; count: number }> {
    const average = await ReviewProvider.getAverageChatRating(chatId);
    const reviews = await ReviewProvider.getChatReviews(chatId);
    return {
      average,
      count: reviews.length
    };
  }
}