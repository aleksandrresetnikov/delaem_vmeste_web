import {type ChatToUser, MessageType} from "../../generated/prisma";
import {ChatProvider} from "../providers/chat.provider"
import {UserProvider} from "../providers/user.provider.ts";
import {GPTunnelService} from "./gpt.service.ts";
import {CompanyProvider} from "../providers/company.provider.ts";

export class ChatService {
  // Получить все чаты
  static getAllChats = async () => {
    return await ChatProvider.listAll();
  }

  // Получить чаты юзера
  static getUserChats = async (userId: number) => {
    return await ChatProvider.listUserChats(userId);
  }

  // Получить сообщения из чата
  static getChatMessages = async (chatId: number, userId: number, page: number = 1, limit: number = 50) => {
    if (!await ChatProvider.hasUserInChat(chatId, userId)) return false;

    return await ChatProvider.listChatMessages(chatId, page, limit);
  }

  // Получить данные о чате
  static getChat = async (chatId: number) => {
    return await ChatProvider.getById(chatId);
  }

  // Создать чат
  static createChat = async (users: number[]) => {
    return await ChatProvider.create(users);
  }

  // Отправить сообщение в чат
  static sendMessage = async (userId: number, chatId: number, type: MessageType, content: any) => {
    if (!await ChatProvider.hasUserInChat(chatId, userId)) return false;

    return await ChatProvider.addMessage(userId, chatId, type, content);
  }

  // Добавить юзера в чат
  static addUserToChat = async (userId: number, chatId: number): Promise<ChatToUser> => {
    return await ChatProvider.addUserToChat(userId, chatId);
  }

  // Удалить юзера из чата
  static removeUserFromChat = async (userId: number, chatId: number) => {
    return await ChatProvider.removeUserFromChat(userId, chatId);
  }

  // Закрыть чат (считается решённым)
  static closeChat = async (userId: number, chatId: number) => {
    if (!await ChatProvider.hasUserInChat(chatId, userId)) return false;

    if (await ChatProvider.isChatClosed(chatId)) return false;

    return await ChatProvider.closeChat(chatId);
  }

  /**
   * Создать чат с промптом
   * @param chatId - ID чата
   * @param prompt - промпт текст
   */
  static createChatWithPrompt = async (userId: number, chatId: number, prompt: string) => {
    const user = await UserProvider.getByID(userId);
    if (!user) return false;

    try {
      const gpt = new GPTunnelService(process.env.GPTUNNEL_KEY, "gpt-4o-mini");
      gpt.setSystemPrompt(`Попробуй помочь пользователю в решении его проблемы. В конце добавь: Если вы хотите позвать человека, напишите - 'человек'`);
      gpt.setUserPrompt(prompt);
      gpt.setTemperature(0.3);

      // Отправляем сообщения статусов
      await ChatService.sendMessage(userId, chatId, MessageType.STATUS, {
        text: "Чат создан"
      });

      // Отправляем сообщение юзера
      await ChatService.sendMessage(userId, chatId, MessageType.DEFAULT, {
        text: prompt
      });

      // Отправляем даные
      await ChatService.sendMessage(userId, chatId, MessageType.STATUS_LOADING, {
        text: "ИИ уже пытается найти решение вашей проблемы"
      });

      const response = await gpt.ask();
      if (!response || response.choices.length < 1 || !response.choices[0]) return false;

      await ChatService.sendMessage(userId, chatId, MessageType.DEFAULT, {
        text: response.choices[0].message.content,
        ai: true
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  /**
   * Подобрать организацию для чата
   * @param chatId - ID чата
   * @param userId - ID юзера
   */
  static searchOrganizationForUser = async (chatId: number, userId: number) => {
    const user = await UserProvider.getByID(userId);
    if (!user) return false;

    const organizations = await CompanyProvider.listAll();
    if (!organizations || organizations.length === 0) return false;

    const chat = await ChatProvider.getById(chatId);
    if (!chat || !chat.messages[1] || !chat.messages[1].content || typeof chat.messages[1].content !== "object") return false;

    if (chat.users.length >= 2) return false;

    try {
      const orgsJson = JSON.stringify(organizations);
      const chatMessage = chat.messages[1].content;
      const systemPrompt = `Ты помогаешь искать организации из JSON-списка по текстовому запросу пользователя. \\nВерни подходящие или хоть какие-то организации (до 5 шт) в формате JSON-массива из их полей ID, без пояснений.\\n\\nПравила поиска:\\n1. Ищи по всем полям данных организаций\\n2. Учитывай синонимы и возможные опечатки\\n3. Приоритет: полное совпадение > частичное совпадение > похожие слова > любые организации. В крайнем случае показывай любые организации\\n\\nФормат ответа JSON:\\n"{"list": number[]}"`;
      const userPrompt = chatMessage["text"];
      if (!userPrompt) return false;

      const gpt = new GPTunnelService(process.env.GPTUNNEL_KEY, "gpt-4o-mini");
      gpt.setSystemPrompt(systemPrompt);
      gpt.setUserPrompt(`Список организаций (JSON): ${orgsJson}\nЗапрос юзера: ${prompt}`);
      gpt.setTemperature(0.1);

      const chatData = await ChatProvider.getById(chatId);
      if (!chatData) return false;

      // Отправляем статус
      await ChatService.sendMessage(userId, chatData.id, MessageType.STATUS_LOADING, {
        text: "ИИ уже подбирает подходящие организации"
      });

      const response = await gpt.ask();
      if (!response || response.choices.length < 1 || !response.choices[0]) return false;

      const responseData = JSON.parse(response.choices[0].message.content);
      const list: number[] = responseData.list;

      await ChatService.sendMessage(userId, chatData.id, MessageType.SELECT_ORGANIZATION, {
        text: "Вот список организаций подходящих",
        list,
        ai: true
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}