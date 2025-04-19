import axios from "@/lib/axios";
import {AxiosResponse} from "axios";

// Интерфейсы данных
export interface CreateOrganizationData {
  name: string;
  description: string;
}

// Комментарий
export interface IComment {
  id: string,
  author: string,
  text: string
}

// Вся информация о карточке
export interface OrganizationData {
  id: string,
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
  id: string,
  title: string,
  description?: string,
  imageUrl?: string,
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
export const generateOrganizationLink = async (OrganizationId: string) => {
  return await axios.post(`/company/link/${OrganizationId}`);
}