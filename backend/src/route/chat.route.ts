import {Elysia} from 'elysia';
import {getUserData} from '../middleware/authorization.middleware';
import {ChatOrganizationPatchDto, PostChatGptBody, PostMessageBodyDto, PostMessageFileBodyDto} from '../dto/chat.dto';
import {ChatService} from '../service/chat.service';
import {AuthService} from '../service/auth.service';
import {ChatProvider} from "../providers/chat.provider.ts";
import prisma from "../util/prisma.ts";
import {CompanyProvider} from "../providers/company.provider.ts";
import {write} from "bun";

const authRoutes = new Elysia({prefix: "/chat", detail: {tags: ["Chat"]}});

// ендпойнт для получения чатов конкретного пользователя
authRoutes.get("/", async (ctx) => {
  try {
    // Получаем аккаунт по хидеру авторизации
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    if (!await AuthService.checkFullUserRules(userData.id)) return ctx.set.status = 401;

    return await ChatService.getUserChats(userData.id);
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

// ендпойнт для получения конкретного чата
authRoutes.get("/:chatId", async (ctx) => {
  try {
    // Получаем аккаунт по хидеру авторизации
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    if (!await AuthService.checkFullUserRules(userData.id)) return ctx.set.status = 401;

    const {chatId} = ctx.params;

    return await ChatService.getChat(+chatId);
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

// ендпойнт для выбора организации в чате
authRoutes.patch("/:chatId/organization/:organizationId", async (ctx) => {
  try {
    // Получаем аккаунт по хидеру авторизации
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    if (!await AuthService.checkFullUserRules(userData.id)) return ctx.set.status = 401;

    const {chatId, organizationId} = ctx.params;

    const chatData = await ChatProvider.getById(chatId);
    if (!chatData || chatData.companyId) return ctx.set.status = 403;

    const organizationData = await CompanyProvider.getByID(organizationId);
    if (!organizationData || !organizationData.members) return ctx.set.status = 404;

    await prisma.chat.update({
      where: {id: chatId}, data: {
        company: {
          connect: {
            id: organizationId
          }
        }
      }
    })

    for (let member of organizationData.members) {
      if (!chatData.users.map(item => item.id).includes(member.id)) {
        await ChatProvider.addUserToChat(member.id, chatId);
      }
    }
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
}, {params: ChatOrganizationPatchDto});

authRoutes.get("/message/:chatId", async (ctx) => {
  try {
    const {chatId} = ctx.params;

    // Получаем аккаунт по хидеру авторизации
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    if (!await AuthService.checkFullUserRules(userData.id)) return ctx.set.status = 401;

    const data = await ChatService.getChatMessages(+chatId, userData.id);
    if (!data) return ctx.set.status = 403;

    return data.reverse()
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

authRoutes.post("/message/:chatId", async (ctx) => {
  try {
    // Получаем аккаунт по хидеру авторизации
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    if (!await AuthService.checkFullUserRules(userData.id)) return ctx.set.status = 401;

    const {chatId} = ctx.params;

    // Отправлять можно только текст
    if (!ctx.body.content.text) return;

    if (ctx.body.content.text.toLowerCase() === "человек") {
      const result = await ChatService.searchOrganizationForUser(+ctx.params.chatId, userData.id);
      if (!result) return ctx.set.status = 500;

      return ctx.set.status = 201;
    }

    return await ChatService.sendMessage(userData.id, +chatId, "DEFAULT", ctx.body.content);
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
}, {body: PostMessageBodyDto});

authRoutes.post("/message/file/:chatId", async (ctx) => {
  const file = ctx.body.file;

  if (!file) {
    throw new Error('No file uploaded');
  }

  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `./files/${fileName}`;

  await write(filePath, file);

  return {success: true, path: filePath};
}, {body: PostMessageFileBodyDto});

authRoutes.post("/", async (ctx) => {
  try {
    // Получаем аккаунт по хидеру авторизации
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    if (!await AuthService.checkFullUserRules(userData.id)) return ctx.set.status = 401;

    // Создаём чат
    const chatData = await ChatProvider.create([userData.id]);
    if (!chatData) return false;

    ChatService.createChatWithPrompt(userData.id, chatData.id, ctx.body.prompt);

    return chatData;
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
}, {body: PostChatGptBody});

authRoutes.patch("/close/:chatId", async (ctx) => {
  try {
    // Получаем аккаунт по хидеру авторизации
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    const {chatId} = ctx.params;

    return await ChatService.closeChat(userData.id, +chatId);
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

export default authRoutes;