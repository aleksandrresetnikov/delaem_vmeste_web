import {Company} from "../../../backend/generated/prisma";

export interface IUser {
  id: number;
  email: string;
  fullname: string;
  username: string;

  birthDate: Date;
  createdAt: Date;

  role: IUserRole;
  memberCompany: Company;
  ownedCompany: Company;
}

export type IUserRole = "MEMBER" | "ADMIN" | "VOLUNTEER";