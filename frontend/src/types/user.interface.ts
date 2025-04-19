import {Company} from "prisma-client-45545ba697cc4784aab4e48e93f883a0ef70eced577eefae45ed1be0665c6d35";

export interface IUser {
  id: number;
  email: string;
  fullname: string;
  username: string;

  birthDate: Date;
  createdAt: Date;

  role: IUserRole;
  memberCompany: Company;
  ownerCompany: Company;
}

export type IUserRole = "MEMBER" | "ADMIN" | "VOLUNTEER";