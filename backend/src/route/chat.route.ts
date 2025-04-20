import {Elysia} from 'elysia';
import {getUserData} from '../middleware/authorization.middleware';
import {PostChatGptBody, PostMessageBodyDto} from '../dto/chat.dto';
import {ChatService} from '../service/chat.service';
import {AuthService} from '../service/auth.service';
import {ChatProvider} from "../providers/chat.provider.ts";

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
    if(!ctx.body.content.text) return;

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