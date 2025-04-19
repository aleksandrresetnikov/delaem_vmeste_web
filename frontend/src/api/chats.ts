import axios from "@/lib/axios";
import {AxiosResponse} from "axios";
import {ChatReview, ChatToUser, Company, MessageType} from "../../../backend/generated/prisma";
import {ChatInListProps} from "@/context/chat.context";

export interface CreateChatData {
  users: number[];
}

export interface GetMessagesParams {
  page?: number;
  limit?: number;
}

export interface IChatList {
  id: number
  imageUrl: string;
  name: string
  lastMessage: string
}

export interface IMessage {
  id: string,
  createdOn: Date,
  updatedOn: Date
  content: {
    text?: string,
    ai?: boolean,
  }
  type: MessageType,
  chatId: number,
  userId: number,
}


export interface IChatInfo {
  id: number,
  isClosed: boolean,
  users: ChatToUser[],
  messages: IMessage[],
  createdOn: Date
  updatedOn: Date
  reviews: ChatReview[],
  company: Company
}

export interface SendMessageData {
  text: string;
}

// Получить чаты
export const fetchChats = async () => {
  try {
    const {data}: AxiosResponse<ChatInListProps[]> = await axios.get("/chat");
    return data
  } catch (e) {
    console.log(e);
    return []
  }
}

// Начать чат
export const createChat = async (data: CreateChatData) => {
  return await axios.post("/chat", data);
}

// Получить чат по ID
export const getChatById = async (chatId: number) => {
  return await axios.get(`/chat/${chatId}`);
}


// Получить сообщения в чате
export const getChatMessages = async (chatId: number, params?: GetMessagesParams) => {
  try {
    const response: AxiosResponse<IMessage[]> = await axios.get(`/chat/message/${chatId}`, {params});
    return response.data;
  } catch (e) {
    console.log(e);
    return []
  }
}

// Отправить сообщение
export const sendMessage = async (chatId: number, data: SendMessageData) => {
  return await axios.post(`/chat/message/${chatId}`, data);
}