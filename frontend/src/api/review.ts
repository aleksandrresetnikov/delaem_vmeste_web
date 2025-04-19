import axios from "@/lib/axios";

export interface CreateReviewData {
  rating: number;
  userId: number;
  chatId: number;
  text?: string;
}

// Оставить отзыв
export const createReview = async (data: CreateReviewData) => {
  return await axios.post("/review/", data);
}