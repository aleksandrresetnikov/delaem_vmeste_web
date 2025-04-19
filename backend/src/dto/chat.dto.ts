import {t} from "elysia";

export const PostChatGptBody = t.Object(
    {
      prompt: t.String()
    }
);

export const GetChatMessagesBodyDto = t.Object(
    {
      page: t.Optional(t.Number({minimum: 1})),
      limit: t.Optional(t.Number())
    }
)

export const PostMessageBodyDto = t.Object(
    {
      content: t.Any()
    }
)