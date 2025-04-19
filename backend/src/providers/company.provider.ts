import type {Chat, CompanyLink} from "../../generated/prisma/index";
import db from "../util/prisma.ts";
import {StringUtil} from "../util/string.util.ts";
import {ReviewProvider} from "./review.provider.ts";

export class CompanyProvider {
  static listAll = async () => {
    return await db.company.findMany({});
  }

  static getCompanyChats = async (chatId: number): Promise<Chat[] | false> => {
    return await db.company.findUnique({
      where: {id: chatId},
      include: {
        chats: true
      }
    })?.then(item => item?.chats) || false;
  }

  static getByID = async (id: number) => {
    const data = await db.company.findUnique({
      where: {id},
      include: {
        members: true,
        owner: true
      }
    }) || false;

    const rate = await ReviewProvider.getAverageChatRating(id);
    const totalChats = await db.chat.count({where: {id}});
    const closedChats = await db.chat.count({where: {id, isClosed: true}});
    const reviews = await db.chatReview.findMany({
      where: {
        chat: {
          companyId: id
        }
      }
    })

    return {...data, rate, totalChats, closedChats, reviews};
  }

  static getByLink = async (link: string) => {
    return await db.companyLink.findUnique({
      where: {
        link: link
      },
      include: {
        company: true
      }
    }) || false;
  }

  static addCompany = async (name: string, ownerId: number, members: number[]) => {
    // проверяем если members не содержит в себе владельца, то добавляем егр
    if (members.indexOf(ownerId) == -1) members.push(ownerId);

    const membersData: { id: number }[] = members.map(id => ({id}));

    return await db.company.create({
      data: {
        name,
        ownerId,
        members: {
          connect: membersData
        }
      }
    });
  }

  static addUserToCompany = async (companyId: number, userId: number) => {
    const companyData = await db.company.findUnique({where: {id: companyId}, select: {members: true}});
    if (!companyData) return false;

    // Получаем данные
    let membersIds = companyData.members.map(item => item.id);
    if (!membersIds.includes(userId)) return false;

    // Добавляем в массив
    membersIds.push(userId);
    const membersData: { id: number }[] = membersIds.map(id => ({id}));

    // Обновляем
    return await db.company.update({
      where: {id: companyId},
      data: {
        members: {
          connect: membersData
        }
      }
    })
  }

  static makeLinkToCompany = async (companyId: number): Promise<false | CompanyLink> => {
    const link = StringUtil.generateRandomString(15, 25);

    return await db.companyLink.create({
      data: {companyId, link}
    }) || false
  }
}