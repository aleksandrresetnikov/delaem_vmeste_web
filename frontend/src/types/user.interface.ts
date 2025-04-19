export interface IUser {
  id: number;
  email: string;
  fullname: string;
  username: string;

  birthDate: Date;
  createdAt: Date;

  role: IUserRole;
}

export type IUserRole = "MEMBER" | "ADMIN" | "VOLUNTEER";