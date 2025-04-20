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

export interface IStats {
  totalChats: number,
  closedChats: number,
  averageRating: number,
  reviewCount: number
}

// Вся информация о карточке
export interface OrganizationData {
  id: number,
  name: string,
  description?: string,
  imgUrl?: string,
  ownerId: number,
  stats: IStats
}

// Краткая информация о карточке
export interface ExtendedOrganizationData extends OrganizationData {
  members: any,
  owner: any,
  reviews: any
}


// Получить организации
export const fetchOrganizations = async (): Promise<AxiosResponse<OrganizationData[]>> => {
  return await axios.get("/company");
}

// Создать организацию
export const createOrganization = async (data: CreateOrganizationData) => {
  return await axios.post("/company", data);
}

// Получить организацию по ID
export const getOrganizationById = async (id: number): Promise<AxiosResponse<ExtendedOrganizationData>> => {
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

