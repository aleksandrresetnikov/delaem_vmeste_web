import axios from "@/lib/axios";

export interface ReviewData {
  rating: number,
  chatId: number,
  text: string
}

// Оставить рейтинг об организации
export const sendOrganizationReview = async (data: ReviewData) => {
  console.log(data);
  return await axios.post(`/review`, data);
}