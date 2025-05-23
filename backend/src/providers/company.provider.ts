import type {Chat, CompanyLink} from "../../generated/prisma/index";
import db from "../util/prisma.ts";
import {StringUtil} from "../util/string.util.ts";
import {ReviewProvider} from "./review.provider.ts";

export class CompanyProvider {
  static listAll = async () => {
    const companies = await db.company.findMany({
      include: {
        chats: {
          include: {
            reviews: true
          }
        }
      }
    });

    return companies.map(company => {
      const totalChats = company.chats.length;
      const closedChats = company.chats.filter(chat => chat.isClosed).length;

      // Собираем все отзывы для всех чатов компании
      const allReviews = company.chats.flatMap(chat => chat.reviews);
      const reviewCount = allReviews.length;

      // Вычисляем средний рейтинг
      const averageRating = reviewCount > 0
          ? allReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
          : 0;

      return {
        id: company.id,
        name: company.name,
        description: company.description,
        imgUrl: company.imgUrl,
        ownerId: company.ownerId,
        stats: {
          totalChats,
          closedChats,
          averageRating: parseFloat(averageRating.toFixed(2)), // Округляем до 2 знаков
          reviewCount
        }
      };
    });
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
    const company = await db.company.findUnique({
      where: {id},
      include: {
        members: true,
        owner: true,
        chats: {
          include: {
            reviews: true
          }
        }
      }
    }) || false;
    if(!company) return false;

    const totalChats = company.chats.length;
    const closedChats = company.chats.filter(chat => chat.isClosed).length;

    // Собираем все отзывы для всех чатов компании
    const allReviews = company.chats.flatMap(chat => chat.reviews);
    const reviewCount = allReviews.length;

    // Вычисляем средний рейтинг
    const averageRating = reviewCount > 0
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

    return {
      id: company.id,
      name: company.name,
      description: company.description,
      imgUrl: company.imgUrl,
      ownerId: company.ownerId,
      members: company.members,
      owner: company.owner,
      reviews: allReviews,
      stats: {
        totalChats,
        closedChats,
        averageRating: parseFloat(averageRating.toFixed(2)), // Округляем до 2 знаков
        reviewCount
      }
    };
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

  static addCompany = async (name: string, description: string, ownerId: number, members: number[]) => {
    // проверяем если members не содержит в себе владельца, то добавляем егр
    if (members.indexOf(ownerId) == -1) members.push(ownerId);

    const membersData: { id: number }[] = members.map(id => ({id}));

    return await db.company.create({
      data: {
        name,
        ownerId,
        description,
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