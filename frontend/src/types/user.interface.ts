import {Company, User} from "../../../backend/generated/prisma";

interface ExtendedCompany extends Company {
  links?: {
    id: number;
    link: string;
  }[];
  members: User[];
}

export interface IUser {
  id: number;
  email: string;
  fullname: string;
  username: string;

  birthDate: Date;
  createdAt: Date;

  role: IUserRole;
  memberCompany: Company;
  ownedCompany: ExtendedCompany;
}

export type IUserRole = "MEMBER" | "ADMIN" | "VOLUNTEER";