import type {User} from "../../generated/prisma/index";
import db from "../util/prisma.ts";

export class UserProvider {
  static listAll = async () => {
    return await db.user.findMany();
  }

  static getByID = async (id: number) => {
    return await db.user.findUnique({where: {id}}) || false;
  }

  static getByUsername = async (user: string) => {
    return await db.user.findUnique({where: {username: user}}) || false;
  }

  static getByEmail = async (email: string) => {
    return await db.user.findUnique({where: {email}, include: {ownedCompany: {include: {links: true, members: true}}, memberCompany: true}}) || false;
  }

  static addNew = async (email: string) => {
    return await db.user.create({
      data: {
        email
      }
    }) || false;
  }

  static update = async (id: number, data: Partial<User>) => {
    return await db.user.update({where: {id}, data});
  }

  static removeFromCompany = async (id: number) => {
    return await this.update(id, {companyId: null});
  }
}