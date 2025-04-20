import {$Enums, type Chat, type ChatToUser} from "../../generated/prisma/client";
import db from "../util/prisma.ts";
import MessageType = $Enums.MessageType;

export class ChatProvider {
  static listAll = async () => {
    return await db.chat.findMany({
      include: {
        company: true
      }
    });
  }

  static listUserChats = async (userId: number) => {
    return await db.chatToUser.findMany({
      where: {userId},
      include: {
        chat: {
          include: {
            company: true,
            users: {
              include: {
                user: true // Полная информация о пользователях в чате
              }
            },
            messages: {
              take: 1, // Можно взять последнее сообщение
              orderBy: {id: 'desc'}
            }
          }
        }
      },
      orderBy: {
        chat: {
          updatedOn: 'desc' // Сортировка по дате обновления чата
        }
      }
    });
  }

  static listChatMessages = async (chatId: number, page: number = 1, limit: number = 50) => {
    return await db.message.findMany({
      where: {chatId},
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true
          }
        }
      },
      orderBy: {createdOn: 'desc'},
      take: limit,
      skip: (page - 1) * limit
    });
  }

  static getById = async (id: number) => {
    // return await db.chat.findUnique(
    //   {
    //     where: {id},
    //     include: {
    //       users: {
    //         include: {
    //             user: true,
    //         }
    //       },
    //       messages: true
    //     }
    //   }
    // ) || false

    const chat = await db.chat.findUnique({
      where: {id},
      include: {
        users: {
          include: {
            user: true // Получаем полные данные пользователя
          }
        },
        messages: true,
        company: true,
        reviews: true
      }
    });

    if (!chat) return false;

    // Преобразуем структуру ответа
    return {
      ...chat,
      users: chat.users.map(chatToUser => chatToUser.user) // Извлекаем только user
    };
  }

  static create = async (users: number[]) => {
    const chat = await db.chat.create({data: {}});

    for (let userId of users) {
      await db.chatToUser.create({
        data: {
          userId,
          chatId: chat.id
        }
      })
    }
    return chat;
  }

  static addMessage = async (userId: number, chatId: number, type: MessageType, content: any) => {
    await db.message.create({
      data: {content, chatId, userId, type}
    })
  }

  static async addUserToChat(userId: number, chatId: number): Promise<ChatToUser> {
    return await db.chatToUser.create({
      data: {userId, chatId}
    });
  }

  static async removeUserFromChat(userId: number, chatId: number) {
    return await db.chatToUser.deleteMany({
      where: {userId, chatId}
    });
  }

  // static async getUserChats(userId: number): Promise<ChatToUser[]> {
  //     return  db.chatToUser.findMany({
  //         where: { userId },
  //         include: { chat: true }
  //     });
  // }

  static async getChatParticipants(chatId: number): Promise<ChatToUser[]> {
    return await db.chatToUser.findMany({
      where: {chatId},
      include: {user: true}
    });
  }

  static hasUserInChat = async (chatId: number, userId: number) => {
    return await db.chatToUser.findUnique({
      where: {chatId_userId: {chatId, userId}}
    });
  }

  static update = async (id: number, data: Partial<Chat>) => {
    return await db.chatToUser.update({where: {id}, data});
  }

  static setChatCompany = async (chatId: number, companyId: number) => {
    return await this.update(chatId, {companyId: null});
  }

  static isChatClosed = async (chatId: number) => {
    return await db.chat.findUnique({where:{id: chatId}, select: {isClosed: true}});
  }

  static closeChat = async (chatId: number) => {
    return await db.chat.update({where: {id: chatId}, data: {isClosed: true}});
  }
}