import {t} from "elysia";

export const PostReviewBodyDto = t.Object(
    {
      rating: t.Number({
        minimum: 1,
        maximum: 5
      }),
      chatId: t.Number(),
      text: t.Optional(t.String())
    }
)