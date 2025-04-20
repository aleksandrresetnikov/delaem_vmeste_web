import axios from "@/lib/axios";
import {AxiosResponse} from "axios";

// Интерфейсы данных
export interface CreateOrganizationData {
  name: string;
  description: string;
}

// Комментарий
export interface IComment {
  id: number,
  author: string,
  text: string
}

// Вся информация о карточке
export interface OrganizationData {
  id: number,
  name: string,
  description?: string,
  imageUrl?: string,
  rate: number,
  totalChats: number,
  closedChats: number,
  reviews: IComment[]
}

// Краткая информация о карточке
export interface OrganizationCardData {
  id: number,
  name: string,
  rate: number,
  description?: string,
  imgUrl?: string,
}

export interface ReviewData{
  rating: number,
  chatId:number,
  review: string
}

// Получить организации
export const fetchOrganizations = async (): Promise<AxiosResponse<OrganizationCardData[]>> => {
  return await axios.get("/company");
}

// Создать организацию
export const createOrganization = async (data: CreateOrganizationData) => {
  return await axios.post("/company", data);
}

// Получить организацию по ID
export const getOrganizationById = async (id: string): Promise<AxiosResponse<OrganizationData>> => {
  return await axios.get(`/company/${id}`);
}

// Покинуть организацию
export const leaveOrganization = async () => {
  return await axios.post("/company/leave");
}

// Удалить чела из организации
export const removeOrganizationMember = async (userId: string) => {
  return await axios.delete(`/company/member/${userId}`);
}

// Сгенерировать ссылку на организацию
export const generateOrganizationLink = async (orgId: number) => {
  return await axios.post(`/company/link/${orgId}`);
}

// Оставить рейтинг об организации
export const sendOrganizationReview = async (data: ReviewData) => {
  return await axios.post(`/review`, data);
}